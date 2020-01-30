import {ResolveProperty, Resolver} from '@nestjs/graphql';


@Resolver('RegisterResult')
export class RegisterResultResolvers {
    @ResolveProperty('__resolveType')
    __resolveType(obj) {

        if (obj.QRCode)
            return 'Register';

        if (obj.reason)
            return 'AlreadyExists';
    }
}
