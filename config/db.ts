import { Database, MongoDBConnector, env } from '../config/deps.ts';

// Models
import Post from '../models/Post.ts';
import User from '../models/User.ts';

// Connect
const connector = new MongoDBConnector({
  uri: env.MONGO_URI,
  database: 'deno_oak',
});

const db = new Database(connector);

// Links
db.link([Post, User]);

export default db;
