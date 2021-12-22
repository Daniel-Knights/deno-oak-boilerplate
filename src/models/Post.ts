import { Bson } from '../config/deps.ts';
import type { User } from './User.ts';

export interface Post {
  _id: Bson.ObjectId;
  text: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}
