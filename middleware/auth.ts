import { verify, env, RouterMiddleware } from '../config/deps.ts';

// Verify JWT
const auth: RouterMiddleware = async (ctx, next) => {
  const token = await ctx.request.headers.get('x-auth-token');

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      msg: 'Authorization denied',
    };

    return;
  }

  await verify(token, env.JWT_SECRET, 'HS512')
    .then(async (payload) => {
      const bodyValue = await ctx.request.body().value;

      // Set user details on the request body
      bodyValue.user = payload;

      await next();
    })
    .catch(() => {
      ctx.response.status = 401;
      ctx.response.body = {
        success: false,
        msg: 'Authorization denied',
      };

      return;
    });
};

export default auth;
