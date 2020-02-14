import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Student, StudentInput} from '../../graphql.schema';
import {Helpers} from '../../common/utils/helpers';


@Injectable()
export class StudentService {

    private readonly logger = new Logger(StudentService.name);

    constructor(
        @InjectModel('Students') private readonly studentModel: Model<Student>
    ) {
    }


    async findByIds(ids: string[]): Promise<Student[]> {
        this.logger.debug(`Student ID's: ${ids}`);
        return await this.studentModel.find({_id: {$in: ids}});
    }


    async addOrUpdate(student: StudentInput): Promise<Student> {
        this.logger.debug(`Add or Update: ${student.name}`);
        const t = Helpers.shallow(student, new Student());
        if (student.id) {
            const options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                overwrite: true
            };
            const query = {_id: student.id};
            return await this.studentModel.findOneAndUpdate(query, t, options);
        } else {
            return await this.studentModel.create(t);
        }
    }
}
