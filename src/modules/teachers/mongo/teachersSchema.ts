import {Schema} from 'mongoose';


const options = {
    timestamps: true,
    toObject: {virtuals: true, getters: true}
};

export const TeachersSchema = new Schema({
        name: {type: String, required: true},
    },
    options
);
