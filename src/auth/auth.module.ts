import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {AuthResolvers} from './resolvers/auth.resolvers';
import {RegisterResultResolvers} from './resolvers/registerResult.resolvers';
import {MongooseModule} from '@nestjs/mongoose';
import {LoginResultResolvers} from './resolvers/loginResult.resolvers';
import {GqlAuthGuard, HttpAuthGuard, WsAuthGuard} from './guards/auth.guard';
import {EasyconfigModule} from 'nestjs-easyconfig';
import {UserService} from './user.service';
import {UsersSchema} from '../MongoSchemas/schemas/users';
import {UserResolvers} from './resolvers/user.resolvers';

@Module({
    imports: [
        EasyconfigModule.register({path: './.env'}),
        MongooseModule.forFeature([{name: 'Users', schema: UsersSchema}]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '200m'
            }
        }),
    ],
    providers: [
        AuthService,
        UserService,
        HttpAuthGuard,
        WsAuthGuard,
        GqlAuthGuard,
        AuthResolvers,
        UserResolvers,
        RegisterResultResolvers,
        LoginResultResolvers
    ],
    exports: [AuthService, UserService]
})
export class AuthModule {
}
