import {model, Schema} from 'mongoose';


export const SubjectSchema = new Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        teachers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Users'
            }
        ]
    },
    {
        timestamps: true,
        toObject: {virtuals: true, getters: true}
    }
);

export const SubjectModel = model(
    'Subjects',
    SubjectSchema
);




