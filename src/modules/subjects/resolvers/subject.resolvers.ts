import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Subject, SubjectInput, User} from '../../../graphql.schema';
import {SubjectService} from '../subject.service';
import * as DataLoader from 'dataloader';


@Resolver('Subject')
export class SubjectResolvers {
    constructor(private readonly subjectService: SubjectService) {
    }

    @Query()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async getSubjectsByIds(@Args({name: 'ids', type: () => [String]}) ids: string[]): Promise<Subject[] | null> {

        const subjectByIdLoader = new DataLoader<string[], Subject[]>((keys) =>
            Promise.all(keys.map(key => {
                console.log('subjects by ids data loader');
                const predicate: any = {};
                if (key) {
                    predicate._id = key;
                }

                return this.subjectService.findByIds(predicate);
            }))
        );

        return await subjectByIdLoader.load(ids);
    }

    @Query()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async getSubjects(): Promise<Subject[] | null> {
        return await this.subjectService.findAll();
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async addOrUpdateSubject(@Args({
        name: 'subject',
        type: () => SubjectInput
    })subject: SubjectInput): Promise<Subject | null> {
        return await this.subjectService.addOrUpdate(subject);
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async joinTeachersToSubject(@Args({
        name: 'subjectId',
        type: () => String
    })subjectId: string, @Args({
        name: 'teacherIds',
        type: () =>[String]
    })teacherIds: string[]): Promise<Subject | null> {
        return await this.subjectService.joinTeachers(subjectId, teacherIds);
    }


    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async deleteSubject(@Args({
        name: 'id',
        type: () => String
    })id: string): Promise<boolean | null> {
        return await this.subjectService.delete(id);
    }
}
