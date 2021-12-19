import { verify, Context } from '../config/deps.ts';
import { logErr, generateCryptoKey } from '../functions/utils.ts';
import { response } from '../functions/response.ts';

// Verify JWT
const auth = async (ctx: Context, next: () => Promise<unknown>) => {
  const token = await ctx.request.headers.get('x-auth-token');

  if (!token) {
    return response(ctx, 401, 'Unauthorized');
  }

  await verify(token, await generateCryptoKey())
    .then(async (payload) => {
      const bodyValue = await ctx.request.body().value;

      // Set user details on the request body
      bodyValue.user = payload;

      await next();
    })
    .catch((err) => {
      logErr(err);
      response(ctx, 401, 'Unauthorized');
    });
};

export default auth;
