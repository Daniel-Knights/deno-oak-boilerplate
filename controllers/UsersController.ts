import { create, hash, compare, RouterContext } from '../config/deps.ts';
import { validate, invalid } from '../functions/validate.ts';
import { generateCryptoKey } from '../functions/utils.ts';

import User from '../models/User.ts';

async function createToken(user: User) {
  const key = await generateCryptoKey();

  const token = await create(
    { alg: 'HS512', typ: 'JWT' },
    { ...user, exp: Date.now() / 1000 + 3600 },
    key
  );

  return token;
}

export default {
  // Get user by id
  get_user: async (ctx: RouterContext<'/api/users'>) => {
    const bodyValue = await ctx.request.body().value;

    await User.find(bodyValue.user?._id || '')
      .then((user) => {
        delete user.password;

        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          msg: 'User fetched',
          user,
        };
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to fetch user',
          err: err.message,
        };
      });
  },

  // Login user
  login: async (ctx: RouterContext<'/api/users/login'>) => {
    const { email, password } = await ctx.request.body().value;

    if (!validate({ email, password })) return invalid(ctx);

    await User.where('email', email)
      .first()
      .then(async (user) => {
        // User not found
        if (!user) {
          ctx.response.status = 404;
          ctx.response.body = {
            success: false,
            msg: 'User not found',
          };

          return;
        }

        // Compare passwords
        const match = await compare(password, user.password as string);

        // Prevent password being returned
        delete user.password;

        if (match) {
          const token = await createToken(user);

          ctx.response.status = 200;
          ctx.response.body = {
            success: true,
            msg: 'User logged in',
            user,
            token,
          };
        } else {
          ctx.response.status = 401;
          ctx.response.body = {
            success: false,
            msg: 'Authorization denied',
          };
        }
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to login user',
          err: err.message,
        };
      });
  },

  // Signup user
  signup: async (ctx: RouterContext<'/api/users/signup'>) => {
    const { name, email, password } = await ctx.request.body().value;

    if (!validate({ email, password })) return invalid(ctx);

    // Check if user already exists
    const existingUser = await User.where('email', email).first();

    if (existingUser) {
      ctx.response.status = 409;
      ctx.response.body = {
        success: false,
        msg: 'User already exists',
      };

      return;
    }

    const hashedPassword = await hash(password);

    // Attempt signup
    await User.create({ name, email, password: hashedPassword })
      .then(async (user) => {
        // Prevent password being returned
        delete user.password;

        const token = await createToken(user);

        ctx.response.status = 201;
        ctx.response.body = {
          success: true,
          msg: 'User signed up',
          user,
          token,
        };
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to signup user',
          err: err.message,
        };
      });
  },
};
