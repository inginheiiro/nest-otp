import mongoose, {Document} from 'mongoose';
import {Subject} from '../../../graphql.schema';

export interface ISubject extends Subject, Document {
    id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    responsibles: [mongoose.Types.ObjectId]; // array of persons responsible
    start: Date; // needed ?
    end: Date; // needed ?
}
