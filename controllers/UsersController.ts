import { create, hash, compare, RouterContext, Bson } from '../config/deps.ts';
import { generateCryptoKey, logErr } from '../functions/utils.ts';
import { validate } from '../functions/validate.ts';
import { response } from '../functions/response.ts';
import { db } from '../config/db.ts';

import type { User } from '../models/User.ts';

const usersCollection = db.collection<User>('users');

async function createToken(user: User) {
  const key = await generateCryptoKey();

  return create(
    { alg: 'HS512', typ: 'JWT' },
    { ...user, exp: Date.now() / 1000 + 3600 },
    key
  );
}

export default {
  // Get user by id
  get_user: async (ctx: RouterContext<'/api/users'>) => {
    const bodyValue = await ctx.request.body().value;

    await usersCollection
      .find(bodyValue.user?._id || '')
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
    const { email, password } = await ctx.request.body().value;

    if (!validate({ email, password })) {
      return response(ctx, 400, 'Missing required fields');
    }

    await usersCollection
      .find(email)
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
    const { name, email, password } = await ctx.request.body().value;

    if (!validate({ email, password })) {
      return response(ctx, 400, 'Missing required fields');
    }

    // Check if user already exists
    const existingUser = await usersCollection.find(email).next();

    if (existingUser) {
      return response(ctx, 409, 'User already exists');
    }

    const hashedPassword = await hash(password);
    const timestamp = new Bson.Timestamp();

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

        response(ctx, 201, 'User created', { token, newUser });
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to create user');
      });
  },
};
