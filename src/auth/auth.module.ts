import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule} from '@nestjs/jwt';
import {AuthResolvers} from './resolvers/auth.resolvers';
import {RegisterResultResolvers} from './resolvers/registerResult.resolvers';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersSchema} from './mongo/usersSchema';
import {LoginResultResolvers} from './resolvers/loginResult.resolvers';
import {GqlAuthGuard, HttpAuthGuard, WsAuthGuard} from './guards/auth.guard';
import {EasyconfigModule} from 'nestjs-easyconfig';

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
        HttpAuthGuard,
        WsAuthGuard,
        GqlAuthGuard,
        AuthResolvers,
        RegisterResultResolvers,
        LoginResultResolvers
    ],
    exports: [AuthService]
})
export class AuthModule {
}
