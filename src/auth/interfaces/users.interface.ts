import { Document } from 'mongoose';

export interface Users extends Document {
  readonly name: string;
  readonly phone: string;
  readonly photo: string;
  readonly email: string;
  readonly deleted: boolean;
  readonly secretOTP: string;
  readonly roles: [string];
}
