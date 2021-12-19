import { verify, Context } from '../config/deps.ts';
import { generateCryptoKey } from '../functions/utils.ts';

// Verify JWT
const auth = async (ctx: Context, next: () => Promise<unknown>) => {
  const token = await ctx.request.headers.get('x-auth-token');

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      msg: 'Authorization denied',
    };

    return;
  }

  await verify(token, await generateCryptoKey())
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
