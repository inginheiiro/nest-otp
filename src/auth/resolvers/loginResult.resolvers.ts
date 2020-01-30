import {ResolveProperty, Resolver} from '@nestjs/graphql';

@Resolver('LoginResult')
export class LoginResultResolvers {
    @ResolveProperty('__resolveType')
    __resolveType(obj) {

        if (obj.QRCode)
            return 'Login';
        if (obj.reason)
            return 'NotFound';
    }
}
