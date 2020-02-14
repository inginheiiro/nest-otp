import {model, Schema} from 'mongoose';

export const ClassSchema = new Schema({
        name: {type: String, required: true},
        managers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Users'
            }
        ],
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Students'
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Subjects'
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

export const ClassesModel = model(
    'Classes',
    ClassSchema
);




