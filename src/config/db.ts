import { MongoClient, env } from '../config/deps.ts';

const client = new MongoClient();

export const db = await client.connect(env.MONGO_URI);
