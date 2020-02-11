import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Subject, SubjectInput} from '../../graphql.schema';
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


    async joinUsers(subjectId: string, teacherIds: string[]): Promise<Subject> {
        this.logger.debug(`join users by id: ${teacherIds}`);
        const subject = await this.subjectModel.findOne({_id: subjectId}).populate('teachers').exec();
        const uList = await this.usersService.findByIds(teacherIds);

        let update = false;
        if (!subject.teachers) {
            subject.teachers = [];
        }

        uList.forEach(val => {
            if (subject.teachers.findIndex(e => e._id.toString() === val._id.toString()) === -1) {
                update = true;
                subject.teachers.push(val);
            }
        });

        if (update) {
            this.logger.debug(`Updating Subjects ...`);
            await subject.updateOne({teachers: subject.teachers});
        }
        return subject;
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
