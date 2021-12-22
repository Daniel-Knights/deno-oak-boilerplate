import { Bson } from '../config/deps.ts';

export interface User {
  readonly _id: Bson.ObjectId;
  name: string;
  email: string;
  password?: string;
  readonly createdAt: Date;
  updatedAt: Date;
}
