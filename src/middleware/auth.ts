import { verify, Context, decode } from '../config/deps.ts';
import { response } from '../functions/response.ts';
import { logErr } from '../functions/utils.ts';

import UsersController from '../controllers/UsersController.ts';
import type { User } from '../models/User.ts';

// Verify JWT
export async function auth(ctx: Context, next: () => Promise<unknown>) {
  const token = ctx.request.headers.get('x-auth-token');
  if (!token) {
    return response(ctx, 400, 'Missing auth token');
  }

  const decodedToken = decode(token);
  const payload = decodedToken[1];
  let tokenKey;

  if (Object.hasOwnProperty.call(payload, '_id')) {
    const _id = (payload as User)._id.toString();

    tokenKey = UsersController.keys[_id];
  }

  if (tokenKey === undefined) {
    return response(ctx, 400, 'Token key not set');
  }

  await verify(token, tokenKey)
    .then(async (payload) => {
      await ctx.response.headers.append('_id', payload._id as string);
      await next();
    })
    .catch((err) => {
      logErr(err);
      response(ctx, 401, 'Unauthorized');
    });
}
