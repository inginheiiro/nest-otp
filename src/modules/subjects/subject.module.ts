import {Module} from '@nestjs/common';
import {EasyconfigModule} from 'nestjs-easyconfig';
import {MongooseModule} from '@nestjs/mongoose';
import {SubjectService} from './subject.service';
import {SubjectResolvers} from './resolvers/subject.resolvers';
import {AuthModule} from '../../auth/auth.module';
import {UsersSchema} from '../../MongoSchemas/schemas/users';
import {SubjectSchema} from '../../MongoSchemas/schemas/subjects';


@Module({
    imports: [
        AuthModule,
        EasyconfigModule.register({path: './.env'}),
        MongooseModule.forFeature([{name: 'Users', schema: UsersSchema}, {name: 'Subject', schema: SubjectSchema}]),
    ],
    providers: [
        SubjectService,
        SubjectResolvers,
    ],
    exports: [SubjectService]
})
export class SubjectModule {
}
