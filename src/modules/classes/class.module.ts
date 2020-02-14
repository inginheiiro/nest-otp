import {Module} from '@nestjs/common';
import {EasyconfigModule} from 'nestjs-easyconfig';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthModule} from '../../auth/auth.module';
import {UsersSchema} from '../../MongoSchemas/schemas/users';
import {SubjectSchema} from '../../MongoSchemas/schemas/subjects';
import {ClassSchema} from '../../MongoSchemas/schemas/classes';
import {ClassService} from './class.service';
import {ClassResolvers} from './resolvers/class.resolvers';
import {StudentModule} from '../students/student.module';
import {StudentsSchema} from '../../MongoSchemas/schemas/students';


@Module({
    imports: [
        AuthModule,
        StudentModule,
        EasyconfigModule.register({path: './.env'}),
        MongooseModule.forFeature([
            {name: 'Users', schema: UsersSchema},
            {name: 'Subject', schema: SubjectSchema},
            {name: 'Students', schema: StudentsSchema},
            {name: 'Classes', schema: ClassSchema}
        ]),
    ],
    providers: [
        ClassService,
        ClassResolvers,
    ],
    exports: [ClassService]
})

export class ClassModule {
}
