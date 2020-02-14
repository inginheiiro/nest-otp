import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Class, ClassInput} from '../../graphql.schema';
import {Helpers} from '../../common/utils/helpers';
import {StudentService} from '../students/student.service';
import {UserService} from '../../auth/user.service';


@Injectable()
export class ClassService {

    private readonly logger = new Logger(ClassService.name);

    constructor(
        @InjectModel('Classes') private readonly classModel: Model<Class>,
        private readonly studentsService: StudentService,
        private readonly usersService: UserService
    ) {
    }


    async findByIds(ids: string[]): Promise<Class[]> {
        this.logger.debug(`Classes ID's: ${ids}`);
        return await this.classModel.find({_id: {$in: ids}});
    }


    async addOrUpdate(c: ClassInput): Promise<Class> {
        this.logger.debug(`Add or Update: ${c.name}`);
        const t = Helpers.shallow(c, new Class());
        if (c.id) {
            const options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                overwrite: true
            };
            const query = {_id: c.id};
            return await this.classModel.findOneAndUpdate(query, t, options);
        } else {
            return await this.classModel.create(t);
        }
    }


    async joinStudents(classId: string, studentIds: string[]): Promise<Class> {
        this.logger.debug(`join students by id: ${studentIds}`);

        const c = await this.classModel.findOne({_id: classId}).lean().populate({
            path: 'students',
            populate: {
                path: 'managers',
                populate: {
                    path: 'subjects'
                }
            }
        }).exec();

        const sList = await this.studentsService.findByIds(studentIds);

        let update = false;
        if (!c.students) {
            c.students = [];
        }

        sList.forEach(val => {
            if (c.students.findIndex(e => e._id.toString() === val._id.toString()) === -1) {
                update = true;
                c.students.push(val);
            }
        });

        if (update) {
            this.logger.debug(`Updating Students ...`);
            await this.classModel.updateOne({_id: c._id},{students: c.students})
        }

        return c;
    }

    async joinManagers(classId: string, teacherIds: string[]): Promise<Class> {
        this.logger.debug(`join managers by id: ${teacherIds}`);
        const c = await this.classModel.findOne({_id: classId}).lean().populate({
            path: 'managers',
            populate: {
                path: 'students',
                populate: {
                    path: 'subjects'
                }
            }
        }).exec();

        const sList = await this.usersService.findByIds(teacherIds);

        let update = false;
        if (!c.managers) {
            c.managers = [];
        }

        sList.forEach(val => {
            if (c.managers.findIndex(e => e._id.toString() === val._id.toString()) === -1) {
                update = true;
                c.managers.push(val);
            }
        });

        if (update) {
            this.logger.debug(`Updating Managers ...`);
            await this.classModel.updateOne({_id: c._id},{managers: c.managers})
        }

        return c;
    }
}
