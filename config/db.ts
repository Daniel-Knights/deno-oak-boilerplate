import { Database, env } from '../config/deps.ts';

// Models
import Post from '../models/Post.ts';
import User from '../models/User.ts';

// Connect
const db = new Database('mongo', {
    uri: env.MONGO_URI,
    database: 'deno_oak',
});

// Links
db.link([Post, User]);
db.sync();

export default db;
