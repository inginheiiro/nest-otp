import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {TeacherInput, Teachers} from '../../graphql.schema';

@Injectable()
export class TeachersService {

    private readonly logger = new Logger(TeachersService.name);

    constructor(
        @InjectModel('Teachers') private readonly teachersModel: Model<Teachers>
    ) {
    }

    async findByIds(ids: ReadonlyArray<string[]>): Promise<Teachers[]> {
        this.logger.debug(`Teacher ID's: ${ids}`);
        return await this.teachersModel.find(ids);
    }

    async findAll(): Promise<Teachers[]> {
        this.logger.debug(`Find All Teachers`);
        return await this.teachersModel.find({});
    }

    async delete(id:string): Promise<boolean> {
        this.logger.debug(`Delete teacher with id: ${id}`);
        return await this.teachersModel.deleteOne({'_id': id}).deleteCount===1;
    }

    async addOrUpdate(teacher: TeacherInput): Promise<Teachers> {
        this.logger.debug(`Add or Update: ${teacher.name}`);

        if (teacher.id) {
            const options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                runValidators: true,
                overwrite: true
            };
            const query = {_id: teacher.id};

            const t = new Teachers();
            t.name = teacher.name;
            t.id = teacher.id;
            return await this.teachersModel.findOneAndUpdate(query, t, options);
        } else {
            const t = new Teachers();
            t.name = teacher.name;
            return await this.teachersModel.create(t);
        }
    }
}
