import {BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Reflector} from '@nestjs/core';
import {AuthService} from '../auth.service';


@Injectable()
export class HttpAuthGuard implements CanActivate {
    constructor(
        private readonly auth: AuthService,
        private readonly reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext) {

        const authHeader = context.switchToHttp().getRequest().headers.authorization as string;
        if (!authHeader) {
            throw new BadRequestException('Authorization header not found.');
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer') {
            throw new BadRequestException(`Authentication type \'Bearer\' required. Found \'${type}\'`);
        }
        const payload = await this.auth.validateJWTToken(token);
        if (!payload.ex) {
            const user = await this.auth.validateUser(payload.email);
            if (!user) {
                throw new UnauthorizedException();
            }

            const roles = this.reflector.get<string[]>('roles', context.getHandler());
            if (roles) {
                const intersection = roles.map(f => {
                    return f.toUpperCase();
                }).filter(x => user.roles.map(f => {
                    return f.toUpperCase();
                }).includes(x));
                if (intersection.length === 0) {
                    throw new UnauthorizedException('Forbidden by missing user role');
                }
            }

            context.switchToHttp().getRequest().user = user;
            return true;
        }
        throw new UnauthorizedException(payload.ex);
    }
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(
        private readonly auth: AuthService,
        private readonly reflector: Reflector
    ) {
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate(context: ExecutionContext) {

        const request = this.getRequest(context);
        const authHeader = request.headers.authorization as string;

        if (!authHeader) {
            throw new BadRequestException('Authorization header not found.');
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer') {
            throw new BadRequestException(`Authentication type \'Bearer\' required. Found \'${type}\'`);
        }
        const payload = await this.auth.validateJWTToken(token);
        if (!payload.ex) {
            const user = await this.auth.validateUser(payload.email);
            if (!user) {
                throw new UnauthorizedException();
            }
            const roles = this.reflector.get<string[]>('roles', context.getHandler());

            if (roles) {
                const intersection = roles.map(f => {
                    return f.toUpperCase();
                }).filter(x => user.roles.map(f => {
                    return f.toUpperCase();
                }).includes(x));
                if (intersection.length === 0) {
                    throw new UnauthorizedException('Forbidden by missing user role');
                }
            }

            request.user = user;
            return true;
        }
        throw new UnauthorizedException(payload.ex);
    }
}


@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        private readonly auth: AuthService,
        private readonly reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext) {
        // Since a GraphQl subscription uses Websockets,
        //     we can't pass any headers. So we pass the token inside the query itself
        const token = context.switchToWs().getData().token;

        if (!token) {
            throw new BadRequestException('Authentication token not found.');
        }

        const payload = await this.auth.validateJWTToken(token);
        if (!payload.ex) {
            const user = await this.auth.validateUser(payload.email);
            if (!user) {
                throw new UnauthorizedException();
            }
            const roles = this.reflector.get<string[]>('roles', context.getHandler());
            if (roles) {
                const intersection = roles.map(f => {
                    return f.toUpperCase();
                }).filter(x => user.roles.map(f => {
                    return f.toUpperCase();
                }).includes(x));
                if (intersection.length === 0) {
                    throw new UnauthorizedException('Forbidden by missing user role');
                }
            }

            context.switchToWs().getData().user = user;
            return true;
        }
        throw new UnauthorizedException(payload.ex);
    }
}

