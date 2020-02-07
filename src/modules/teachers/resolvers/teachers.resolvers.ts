import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {TeacherInput, Teachers} from '../../../graphql.schema';
import {TeachersService} from '../teachers.service';
import * as DataLoader from 'dataloader';


@Resolver('Teachers')
export class TeachersResolvers {
    constructor(private readonly teachersService: TeachersService) {
    }

    @Query()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async getTeachersByIds(@Args({name: 'ids', type: () => [String]}) ids: string[]): Promise<Teachers[] | null> {

        const teacherByIdLoader = new DataLoader<string[], Teachers[]>((keys) =>
            Promise.all(keys.map(key => {
                console.log('teachers by ids data loader');
                const predicate: any = {};
                if (key) {
                    predicate._id = key;
                }

                return this.teachersService.findByIds(predicate);
            }))
        );
        return await teacherByIdLoader.load(ids);
    }

    @Query()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async getTeachers(): Promise<Teachers[] | null> {
        return await this.teachersService.findAll();
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async addOrUpdateTeacher(@Args({
        name: 'teacher',
        type: () => TeacherInput
    })teacher: TeacherInput): Promise<Teachers | null> {
        return await this.teachersService.addOrUpdate(teacher);
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async deleteTeacher(@Args({
        name: 'id',
        type: () => String
    })id: string): Promise<boolean | null> {
        return await this.teachersService.delete(id);
    }
}
