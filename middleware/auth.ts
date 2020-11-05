import { verify, env } from '../config/deps.ts';

// Verify JWT
const auth = async (ctx: any, next: any) => {
    const token = await ctx.request.headers.get('x-auth-token');

    await verify(token, env.JWT_SECRET, 'HS512')
        .then(async payload => {
            // Set user details on the request body
            ctx.request.user = payload;

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
