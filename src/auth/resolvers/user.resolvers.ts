import {Query, Resolver} from '@nestjs/graphql';
import {User} from '../../graphql.schema';
import {UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../guards/auth.guard';
import {CurrentUser} from '../decorators/user.decorator';
import {UserService} from '../user.service';


@Resolver('User')
export class UserResolvers {
    constructor(private readonly userService: UserService) {
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async getLoggedUserData(@CurrentUser()user: User): Promise<User> {
        return user;
    }
}
