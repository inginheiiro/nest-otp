import {model, Schema} from 'mongoose';
import {UsersSchema} from './users';
import {RolesEnum} from '../rolesEnum';

export const ParentsSchema = new Schema({
    ...UsersSchema,
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Students'
        }
    ]
});

// middleware
ParentsSchema.pre('save', (next) => {
    const self = this;
    if (!self.isParent()) {
        self.roles.push(RolesEnum.PARENT);
        next();
    }
});


ParentsSchema.pre('updateOne',  (next) => {
    const self = this;

    if (!self.isModified('roles')) {
        return next();
    }
    if (!self.isParent()) {
        self.roles.push(RolesEnum.PARENT);
        next();
    }
});


ParentsSchema.methods.isParent = function isParent() {
    return this.roles.find(p => p === RolesEnum.PARENT);
};

export const ParentsModel = model(
    'Parents',
    ParentsSchema
);




