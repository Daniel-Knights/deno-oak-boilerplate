import { Bson } from '../config/deps.ts';

export interface User {
  _id: Bson.ObjectId;
  name: string;
  email: string;
  password?: string;
  createdAt: Bson.Timestamp;
  updatedAt: Bson.Timestamp;
}