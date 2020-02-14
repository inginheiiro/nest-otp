import {Module} from '@nestjs/common';
import {EasyconfigModule} from 'nestjs-easyconfig';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthModule} from '../../auth/auth.module';
import {StudentsSchema} from '../../MongoSchemas/schemas/students';
import {StudentService} from './student.service';
import {StudentResolvers} from './resolvers/student.resolvers';


@Module({
    imports: [
        AuthModule,
        EasyconfigModule.register({path: './.env'}),
        MongooseModule.forFeature([
            {name: 'Students', schema: StudentsSchema}
        ]),
    ],
    providers: [
        StudentService,
        StudentResolvers,
    ],
    exports: [StudentService]
})

export class StudentModule {
}
