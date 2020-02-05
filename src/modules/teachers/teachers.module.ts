import {Module} from '@nestjs/common';
import {EasyconfigModule} from 'nestjs-easyconfig';
import {MongooseModule} from '@nestjs/mongoose';
import {TeachersSchema} from './mongo/teachersSchema';
import {TeachersResolvers} from './resolvers/teachers.resolvers';
import {TeachersService} from './teachers.service';


@Module({
    imports: [
        EasyconfigModule.register({path: './.env'}),
        MongooseModule.forFeature([{name: 'Teachers', schema: TeachersSchema}]),
    ],
    providers: [
        TeachersService,
        TeachersResolvers,
    ],
    exports: [TeachersService]
})
export class TeachersModule {
}
