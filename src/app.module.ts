import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {AuthModule} from './auth/auth.module';
import {EasyconfigModule} from 'nestjs-easyconfig';
import {MongooseModule} from '@nestjs/mongoose';
import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';
import {SubjectModule} from './modules/subjects/subject.module';
import {ClassModule} from './modules/classes/class.module';
import {StudentModule} from './modules/students/student.module';


@Module({
    imports: [
        EasyconfigModule.register({path: './.env'}),
        MongooseModule.forRoot(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }),
        GraphQLModule.forRoot({
            typePaths: ['./**/*.graphql'],
            installSubscriptionHandlers: true,
            context: ({req}) => ({req}),
            resolvers: {Date: GraphQLDate, DateTime: GraphQLDateTime},
            debug: true,
            playground: true,
            tracing: true,
            introspection: true,
            resolverValidationOptions: {
                allowResolversNotInSchema: true,
            },
        }),
        AuthModule,
        SubjectModule,
        StudentModule,
        ClassModule
    ],
})
export class AppModule {
}
