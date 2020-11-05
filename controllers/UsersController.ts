import { create, hash, compare, env } from '../config/deps.ts';
import { validate, invalid } from '../functions/validate.ts';

import User from '../models/User.ts';

export default {
    // Get user by id
    get_user: async (ctx: any) => {
        await User.find(ctx.request.user._id)
            .then(user => {
                delete user.password;

                ctx.response.status = 200;
                ctx.response.body = {
                    success: true,
                    msg: 'User fetched',
                    user,
                };
            })
            .catch(err => {
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
    login: async (ctx: any) => {
        const { email, password } = await ctx.request.body().value;

        if (!validate({ email, password })) return invalid(ctx);

        await User.where('email', email)
            .first()
            .then(async user => {
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
                const match = await compare(password, user.password);

                // Prevent password being returned
                delete user.password;

                if (match) {
                    // Create token
                    const token = await create(
                        { alg: 'HS512', typ: 'JWT' },
                        { ...user, exp: Date.now() / 1000 + 3600 },
                        env.JWT_SECRET
                    );

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
            .catch(err => {
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
    signup: async (ctx: any) => {
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
            .then(async user => {
                // Prevent password being returned
                delete user[0].password;

                // Create token
                const token = await create(
                    { alg: 'HS512', typ: 'JWT' },
                    { ...user, exp: Date.now() / 1000 + 3600 },
                    env.JWT_SECRET
                );

                ctx.response.status = 201;
                ctx.response.body = {
                    success: true,
                    msg: 'User signed up',
                    user,
                    token,
                };
            })
            .catch(err => {
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
