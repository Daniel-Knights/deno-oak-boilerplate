import { Bson } from '../config/deps.ts';
import type { User } from './User.ts';

export interface Post {
  readonly _id: Bson.ObjectId;
  text: string;
  readonly author: User;
  readonly createdAt: Date;
  updatedAt: Date;
}
