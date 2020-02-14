import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Student, StudentInput} from '../../../graphql.schema';
import * as DataLoader from 'dataloader';
import {StudentService} from '../student.service';

@Resolver('Students')
export class StudentResolvers {
    constructor(private readonly studentService: StudentService) {
    }

    @Query()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async getStudentsByIds(@Args({name: 'ids', type: () => [String]}) ids: string[]): Promise<Student[] | null> {

        const studentByIdLoader = new DataLoader<string[], Student[]>((keys) =>
            Promise.all(keys.map(key => {
                console.log('students by ids data loader');
                const predicate: any = {};
                if (key) {
                    predicate._id = key;
                }

                return this.studentService.findByIds(predicate);
            }))
        );

        return await studentByIdLoader.load(ids);
    }

    @Mutation()
    // @UseGuards(GqlAuthGuard)
    // @Roles('admin','NOROLE')
    async addOrUpdateStudent(@Args({
        name: 'student',
        type: () => StudentInput
    })student: StudentInput): Promise<Student | null> {
        return await this.studentService.addOrUpdate(student);
    }
}
