import mongoose, {Document} from 'mongoose';

export interface ISubject extends Document {
    readonly   id: mongoose.Types.ObjectId;
    readonly   name: string;
    readonly   description: string;
    readonly  teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]; // array of teachers
    readonly   start: Date;
    readonly   end: Date;
}
