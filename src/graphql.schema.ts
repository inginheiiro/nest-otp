
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class UserInput {
    id: string;
    name?: string;
    phone?: string;
    photo?: string;
    delete?: boolean;
    roles?: string[];
}

export class AlreadyExists {
    reason?: string;
}

export class InvalidToken {
    reason?: string;
}

export class Login {
    QRCode: string;
}

export class NotFound {
    reason?: string;
}

export abstract class IQuery {
    abstract register(email: string): RegisterResult | Promise<RegisterResult>;

    abstract validate(email: string, token: string): string | Promise<string>;

    abstract login(email: string): LoginResult | Promise<LoginResult>;

    abstract googleLogin(tokenId: string): string | Promise<string>;

    abstract ok(email: string): string | Promise<string>;
}

export class Register {
    QRCode: string;
}

export class User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    photo?: string;
    delete?: boolean;
    roles: string[];
}

export type LoginResult = Login | NotFound;
export type RegisterResult = Register | AlreadyExists;
