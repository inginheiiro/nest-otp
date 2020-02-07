import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Subject, SubjectInput, User} from '../../graphql.schema';
import {Helpers} from '../../common/utils/helpers';
import {UserService} from '../../auth/user.service';


@Injectable()
export class SubjectService {

    private readonly logger = new Logger(SubjectService.name);

    constructor(
        @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
        private readonly usersService: UserService
    ) {
    }

    async findByIds(ids: ReadonlyArray<string[]>): Promise<Subject[]> {
        this.logger.debug(`Subject ID's: ${ids}`);
        return await this.subjectModel.find(ids);
    }

    async findAll(): Promise<Subject[]> {
        this.logger.debug(`Find All Subject`);
        return await this.subjectModel.find({});
    }

    async delete(id: string): Promise<boolean> {
        this.logger.debug(`Delete Subject with id: ${id}`);
        return await this.subjectModel.deleteOne({'_id': id}).deleteCount === 1;
    }

    async joinUsers(subjectId: string, teacherIds: string[]): Promise<User[]> {
        this.logger.debug(`join users by id: ${teacherIds}`);
        const subject = await this.subjectModel.find({_id: subjectId});
        console.log(subject);
        const uList = await this.usersService.findByIds(teacherIds);
        console.log(uList);
        return uList;

    }

    async addOrUpdate(subject: SubjectInput): Promise<Subject> {
        this.logger.debug(`Add or Update: ${subject.name}`);
        const t = Helpers.shallow(subject, new Subject());
        if (subject.id) {
            const options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                overwrite: true
            };
            const query = {_id: subject.id};
            return await this.subjectModel.findOneAndUpdate(query, t, options);
        } else {
            return await this.subjectModel.create(t);
        }
    }
}
