import { create, hash, compare, RouterContext, Bson } from '../config/deps.ts';
import { response } from '../functions/response.ts';
import { db } from '../config/db.ts';
import {
  logErr,
  generateCryptoKey,
  hasFalsyProperties,
  find,
  getBody,
} from '../functions/utils.ts';

import type { User } from '../models/User.ts';

const usersCollection = db.collection<User>('users');
const userKeys: Record<string, CryptoKey> = {};

async function createToken(user: User) {
  const key = await generateCryptoKey();

  userKeys[user._id.toString()] = key;

  return create(
    { alg: 'HS512', typ: 'JWT' },
    { ...user, exp: Date.now() / 1000 + 3600 },
    key
  );
}

export default {
  keys: userKeys,
  // Get user by id
  get_user: async (ctx: RouterContext<'/api/users'>) => {
    const _id = await ctx.response.headers.get('_id');
    if (!_id) {
      return response(ctx, 400, 'Missing auth token');
    }

    await find(usersCollection, { _id: new Bson.ObjectId(_id) })
      .next()
      .then((user) => {
        if (!user) {
          return response(ctx, 404, 'User not found');
        }

        // Prevent password being returned
        delete user.password;

        response(ctx, 200, 'Fetched user', user);
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to fetch user');
      });
  },

  // Login user
  login: async (ctx: RouterContext<'/api/users/login'>) => {
    const { email, password } = await getBody(ctx);

    if (hasFalsyProperties({ email, password })) {
      return response(ctx, 400, 'Missing required fields');
    }

    await find(usersCollection, { email })
      .next()
      .then(async (user) => {
        if (!user) {
          return response(ctx, 404, 'User not found');
        }

        // Compare passwords
        const match = await compare(password, user.password as string);

        // Prevent password being returned
        delete user.password;

        if (match) {
          const token = await createToken(user);

          response(ctx, 200, 'User logged in', { token, user });
        } else {
          response(ctx, 401, 'Invalid credentials');
        }
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to login user');
      });
  },

  // Signup user
  signup: async (ctx: RouterContext<'/api/users/signup'>) => {
    const { email, password, name } = await getBody(ctx);

    if (hasFalsyProperties({ email, password })) {
      return response(ctx, 400, 'Missing required fields');
    }

    // Check if user already exists
    const existingUser = await find(usersCollection, { email }).next();
    if (existingUser) {
      return response(ctx, 409, 'User already exists');
    }

    const hashedPassword = await hash(password);
    const timestamp = new Date();
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Attempt signup
    await usersCollection
      .insertOne(newUser)
      .then(async (userId) => {
        const userToReturn = {
          _id: userId,
          ...newUser,
        };

        // Prevent password being returned
        delete userToReturn.password;

        const token = await createToken(userToReturn);

        response(ctx, 201, 'User created', { token, user: userToReturn });
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to create user');
      });
  },
};
