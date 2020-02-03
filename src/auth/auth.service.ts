import {Injectable, Logger} from '@nestjs/common';
import {AuthenticationError} from 'apollo-server-errors';
import {JwtService} from '@nestjs/jwt';
import {AlreadyExists, LoginResult, NotFound, Register, RegisterResult, User} from '../graphql.schema';
import * as cacheManager from 'memory-cache'
import * as OTP from 'otplib';
import * as QRCode from 'qrcode';
import {Email} from '../common/utils/mail';
import {InjectModel} from '@nestjs/mongoose';
import {Users} from './interfaces/users.interface';
import {Model} from 'mongoose';
import {OAuth2Client} from 'google-auth-library';

@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);
    private readonly cache = new cacheManager.Cache();

    constructor(
        @InjectModel('Users') private readonly usersModel: Model<Users>,
        private readonly jwtService: JwtService
    ) {
    }


    /**
     * Validate a user over mongo.
     * @param email
     */

    async validateUser(email: string): Promise<User> {
        this.logger.debug(`validating: ${email}`);
        return await this.usersModel.findOne({email});
    }


    /**
     * GOOGLE login a user by sending and OTP mail code.
     * @param email
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
                secretOTP: OTP.authenticator.generateSecret(),
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
            }

            this.logger.warn(`User: ${email} NOT FOUND`);
            return notfound;
        }

        const emailUtil: Email = new Email();
        const data = await this.generateOTPData(email, user.secretOTP);
        emailUtil.sendOTP(process.env.MAIL_USER, email, 'Login Token Verification', data);

        const result: LoginResult = {
            QRCode: data.qrcode
        }
        return result;
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

        if (this.cache.get(email)) {
            this.logger.debug(`clearing secret cache for  ${email}`);
            this.cache.del(email);
        }

        this.cache.put(email, OTP.authenticator.generateSecret());
        const data = await this.generateOTPData(email, this.cache.get(email));

        emailUtil.sendOTP(process.env.MAIL_USER, email, 'Registration Token Verification', data);
        const result: Register = {
            QRCode: data.qrcode
        };

        return result;
    }

    /**
     * Validate a OTP token.
     * @param email
     * @param token
     */
    async validateOTPToken(email: string, token: string): Promise<string> {

        this.logger.debug(`INITIAL Token: ${token} Key!`);
        let user = await this.usersModel.findOne({email});
        let secret = null;
        if (!user) {
            const _ = this.cache.get(email);
            if (!_) {
                this.logger.warn(`Invalid Token Verification`);
                throw new AuthenticationError('Invalid token verification!');
            }
            secret = _;
        } else {
            secret = user.secretOTP;
        }

        const isValid = OTP.authenticator.check(token, secret);
        if (!isValid) {
            this.logger.warn(`Invalid Token: ${token} Key!`);
            throw new AuthenticationError('Invalid validation token key!');
        }

        if (!user) {
            user = new this.usersModel({email, secretOTP: secret});
            user.save();
        }

        // Invalidate from MemoryCache
        this.cache.del(email);

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


    private async generateOTPData(email: string, secret: string): Promise<any> {

        OTP.authenticator.options = {
            step: parseInt(process.env.OTP_STEP, 10),
        };

        const otpauth = OTP.authenticator.keyuri(email, 'OTP', secret);
        const token = OTP.authenticator.generate(secret);
        const qrcode = await QRCode.toDataURL(otpauth);

        return {
            token,
            qrcode
        };

    }


}