import {Schema, model} from 'mongoose';
import {Users} from '../interfaces/users.interface';
import {UsersSchema} from './users';


export const SubjectSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: model<Users>('users', UsersSchema)
            }
        ],
        start: {type: Date, require: true},
        end: {type: Date, require: true},
    },
    {
        timestamps: true,
        toObject: {virtuals: true, getters: true}
    }
);

SubjectSchema.pre('find', function populateTeachers(next) {
    this.populate('teachers');
    next();
});



SubjectSchema.pre('findOne', function populateTeachers(next) {
    this.populate('teachers');
    next();
});


