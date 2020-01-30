import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {LoginResult, RegisterResult, User} from '../../graphql.schema';
import {AuthService} from '../auth.service';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../guards/auth.guard';
import {Roles} from '../decorators/roles.decorator';
import {CurrentUser} from '../decorators/user.decorator';



@Resolver('Auth')
export class AuthResolvers {
    constructor(private readonly authService: AuthService) {
    }

    @Mutation()
    async register(@Args('email') email: string): Promise<RegisterResult> {
        return await this.authService.register(email);
    }

    @Mutation()
    async validate(@Args('email') email: string, @Args('token') token: string): Promise<string> {
        return await this.authService.validateOTPToken(email, token);
    }

    @Mutation()
    async login(@Args('email') email: string): Promise<LoginResult> {
        return await this.authService.login(email);
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    @Roles('admin','NOROLE')
    async ok(@CurrentUser()user: User, @Args('email') email: string): Promise<string> {
        return user.email;
    }


}
