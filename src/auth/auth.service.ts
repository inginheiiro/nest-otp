import {Injectable, Logger} from '@nestjs/common';
import {AuthenticationError} from 'apollo-server-errors';
import {JwtService} from '@nestjs/jwt';
import {AlreadyExists, LoginResult, NotFound, RegisterResult, User} from '../graphql.schema';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import {Email} from '../common/utils/mail';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {OAuth2Client} from 'google-auth-library';
import * as cache from 'memory-cache';
import {GeneratedSecret} from 'speakeasy';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel('Users') private readonly usersModel: Model,
        private readonly jwtService: JwtService
    ) {

        /*
        authenticator.options = {
            step: parseInt(process.env.OTP_STEP, 10),
            window: 5,
        };
       */
    }


    /**
     * Validate a user over mongo.
     * @param email
     */

    async validateUser(email: string): Promise<User> {
        return await this.usersModel.findOne({email});
    }


    /**
     * GOOGLE login a user by sending and OTP mail code.
     * @param tokenId
     */

    async googleLogin(tokenId: string): Promise<string> {
        this.logger.debug(`Google Login:  ${tokenId}`);

        let ticket = null;
        try {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID
            });
        } catch (e) {
            console.log('error');
            throw new AuthenticationError(`Invalid google token!`);
        }

        let user = await this.usersModel.findOne({email: ticket.getPayload().email});

        if (!user) {
            user = new this.usersModel({
                email: ticket.getPayload().email,
                name: ticket.getPayload().name,
                photo: ticket.getPayload().picture
            });
            user.save();
        }

        const payload: any = {
            id: user.id,
            email: user.email,
            name: user.name,
            claims: user.roles.map(p => p)
        };

        return this.jwtService.sign(payload);
    }

    /**
     * login a user by sending and OTP mail code.
     * @param email
     */

    async login(email: string): Promise<LoginResult> {
        this.logger.debug(`Login:  ${email}`);
        const user = await this.usersModel.findOne({email});

        if (!user) {
            const notfound: NotFound = {
                reason: 'User not found'
            };

            this.logger.warn(`User: ${email} NOT FOUND`);
            return notfound;
        }

        // cache.put(email, user.secretBase32);

        // Get the secret from mongo
        const emailUtil: Email = new Email();
        const data = await AuthService.generateOTPData(email, user.secretBase32,user.otpauth_url);
        emailUtil.sendOTP(process.env.MAIL_USER, email, 'Login Token Verification', data);

        return {
            QRCode: data.qrCode
        };
    }

    /**
     * Register a new  user.
     * @param email
     */
    async register(email: string): Promise<RegisterResult> {

        const user = await this.usersModel.findOne({email});
        if (user) {
            const alreadyExists: AlreadyExists = {
                reason: 'User already registered'
            };
            this.logger.warn(`User: ${email} ALREADY EXISTS!!!!`);
            return alreadyExists;
        }

        const emailUtil: Email = new Email();

        const SECRET: GeneratedSecret = speakeasy.generateSecret({length: 20, name:'nest-otp'});

        cache.put(email, SECRET);

        const data = await AuthService.generateOTPData(email, SECRET.base32,SECRET.otpauth_url);

        emailUtil.sendOTP(process.env.MAIL_USER, email, 'Registration Token Verification', data);
        return {
            QRCode: data.qrCode
        };
    }

    /**
     * Validate a OTP token.
     * @param email
     * @param token
     */
    async validateOTPToken(email: string, token: string): Promise<string> {

        this.logger.debug(`INITIAL Token: ${token} Key!`);
        let user = await this.usersModel.findOne({email});

        let isValid=false;

        let SECRET=null;

        if (!user){
            SECRET = cache.get(email) || null;

            if (!SECRET) {
                throw new AuthenticationError(`No SECRET Cache value for ${email}!`);
            }

            isValid = speakeasy.totp.verify({
                secret: SECRET.base32,
                encoding: 'base32',
                token
            });
        } else {
            SECRET = user.secretBase32;
            isValid = speakeasy.totp.verify({
                secret: SECRET,
                encoding: 'base32',
                token
            });
        }

        if (!isValid) {
            this.logger.warn(`Invalid Token: ${token} Key!`);
            throw new AuthenticationError('Invalid validation token key!');
        }

        if (!user) {
            this.logger.debug(`Saving User: ${email} !`);
            user = new this.usersModel({email});
            user.secretBase32=SECRET.base32;
            user.otpauth_url=SECRET.otpauth_url;
            user.save();
        }

        this.logger.debug(`VALID Token: ${token} Key!`);

        const payload: any = {
            id: user.id,
            email: user.email,
            name: user.name,
            claims: user.roles.map(p => p)
        };
        return this.jwtService.sign(payload);
    }

    /**
     * Validate a JWT token.
     * @param token
     */

    async validateJWTToken(token: string): Promise<any> {
        try {
            this.jwtService.verify(token);
            return this.jwtService.decode(token);
        } catch (error) {
            return {ex: error.name};
        }
    }


    // tslint:disable-next-line:variable-name
    private static async generateOTPData(email: string, secret: string, otpauth_url:string): Promise<any> {

        const token = speakeasy.totp({
            secret,
            encoding: 'base32'
        });
        const qrCode = await QRCode.toDataURL(otpauth_url);

        return {
            token,
            qrCode
        };

    }


}
