import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Class, ClassInput, Subject} from '../../../graphql.schema';
import * as DataLoader from 'dataloader';
import {ClassService} from '../class.service';


@Resolver('Class')
export class ClassResolvers {
    constructor(private readonly classService: ClassService) {
    }

    @Query()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async getClassesByIds(@Args({name: 'ids', type: () => [String]}) ids: string[]): Promise<Subject[] | null> {

        const classByIdLoader = new DataLoader<string[], Class[]>((keys) =>
            Promise.all(keys.map(key => {
                console.log('classes by ids data loader');
                const predicate: any = {};
                if (key) {
                    predicate._id = key;
                }

                return this.classService.findByIds(predicate);
            }))
        );

        return await classByIdLoader.load(ids);
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async addOrUpdateClass(@Args({
        name: 'data',
        type: () => ClassInput
    })data: ClassInput): Promise<Class | null> {
        return await this.classService.addOrUpdate(data);
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async joinStudentsToClass(@Args({
        name: 'classId',
        type: () => String
    })classId: string, @Args({
        name: 'studentIds',
        type: () =>[String]
    })studentIds: string[]): Promise<Class | null> {
        return await this.classService.joinStudents(classId,studentIds);
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async joinManagersToClass(@Args({
        name: 'classId',
        type: () => String
    })classId: string, @Args({
        name: 'teacherIds',
        type: () =>[String]
    })teacherIds: string[]): Promise<Class | null> {
        return await this.classService.joinManagers(classId,teacherIds);
    }
}
