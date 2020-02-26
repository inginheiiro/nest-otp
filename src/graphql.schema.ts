
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class AddressInput {
    name?: string;
    latitude?: number;
    longitude?: number;
}

export class ClassInput {
    id?: string;
    name: string;
    year: number;
    managers?: string[];
    students?: string[];
    subjects?: string[];
    start: Date;
    end: Date;
}

export class StudentInput {
    id?: string;
    nr: number;
    name: string;
    birthDate: Date;
    photo?: string;
}

export class SubjectInput {
    id?: string;
    name: string;
    description: string;
    teachers?: string[];
}

export class UserInput {
    id: string;
    name?: string;
    phone?: string;
    photo?: string;
    nif?: string;
    address?: AddressInput;
    delete?: boolean;
    roles?: string[];
}

export class Address {
    name?: string;
    latitude?: number;
    longitude?: number;
}

export class AlreadyExists {
    reason?: string;
}

export class Class {
    _id: string;
    name: string;
    year: number;
    managers?: User[];
    students?: User[];
    subjects?: Subject[];
    start: Date;
    end: Date;
}

export class InvalidToken {
    reason?: string;
}

export class Login {
    QRCode: string;
}

export abstract class IMutation {
    abstract addOrUpdateClass(data?: ClassInput): Class | Promise<Class>;

    abstract joinStudentsToClass(classId: string, studentIds?: string[]): Class | Promise<Class>;

    abstract joinManagersToClass(classId: string, teacherIds?: string[]): Class | Promise<Class>;

    abstract addOrUpdateStudent(student?: StudentInput): Student | Promise<Student>;

    abstract addOrUpdateSubject(subject?: SubjectInput): Subject | Promise<Subject>;

    abstract joinTeachersToSubject(subjectId: string, teacherIds?: string[]): Subject | Promise<Subject>;

    abstract deleteSubject(id?: string): boolean | Promise<boolean>;
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

    abstract getLoggedUserData(): User | Promise<User>;

    abstract getSubjectsByIds(ids?: string[]): Subject[] | Promise<Subject[]>;

    abstract getSubjects(): Subject[] | Promise<Subject[]>;
}

export class Register {
    QRCode: string;
}

export class Student {
    _id: string;
    nr?: number;
    name: string;
    birthDate: Date;
    photo?: string;
}

export class Subject {
    _id: string;
    name: string;
    description?: string;
    teachers?: User[];
}

export class User {
    _id: string;
    email: string;
    name?: string;
    phone?: string;
    photo?: string;
    nif?: string;
    address?: Address;
    delete?: boolean;
    roles: string[];
}

export type LoginResult = Login | NotFound;
export type RegisterResult = Register | AlreadyExists;
