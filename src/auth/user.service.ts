import {Injectable, Logger} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {User} from '../graphql.schema';


@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);
    constructor(@InjectModel('Users') private readonly usersModel: Model<User>) {
    }

    async findByIds(ids: ReadonlyArray<string[]> |string[] ): Promise<User[]> {
        this.logger.debug(`Find users by ID's: ${ids}`);
        return await this.usersModel.find({_id: {$in: ids}});
    }

}
