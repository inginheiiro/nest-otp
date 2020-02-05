import mongoose, {Document} from 'mongoose';
import {Subject} from '../../../graphql.schema';

export interface Teachers extends Subject, Document {
    readonly  id: mongoose.Types.ObjectId;
    readonly  name: string;
}
