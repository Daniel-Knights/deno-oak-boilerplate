import { RouterContext } from '../config/deps.ts';
import { validate, invalid } from '../functions/validate.ts';

import Post from '../models/Post.ts';

export default {
  // Get all posts
  get_all: async (ctx: RouterContext) => {
    await Post.all()
      .then((posts) => {
        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          msg: 'Fetched posts',
          posts,
        };
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to fetch posts',
        };
      });
  },

  // Get single post
  get_single: async (ctx: RouterContext) => {
    const { id } = ctx.params;

    await Post.find(id || '')
      .then((post) => {
        if (!post) {
          ctx.response.status = 404;
          ctx.response.body = {
            success: false,
            msg: 'Post not found',
          };

          return;
        }

        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          msg: 'Fetched post',
          post,
        };
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to fetch post',
          err: err.message,
        };
      });
  },

  // Create post
  create: async (ctx: RouterContext) => {
    const { text, author } = await ctx.request.body().value;

    if (!validate({ text, author })) return invalid(ctx);

    await Post.create({ text, author })
      .then((post) => {
        ctx.response.status = 201;
        ctx.response.body = {
          success: true,
          msg: 'Post created',
          post,
        };
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to create post',
          err: err.message,
        };
      });
  },

  // Delete post
  delete: async (ctx: RouterContext) => {
    const { id } = ctx.params;
    const post = await Post.find(id || '');

    if (!post) {
      ctx.response.status = 404;
      ctx.response.body = {
        success: false,
        msg: 'Post not found',
      };

      return;
    }

    await Post.deleteById(id || '')
      .then(() => {
        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          msg: 'Post deleted',
        };
      })
      .catch((err) => {
        console.error(err);

        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          msg: 'Unable to delete post',
          err: err.message,
        };
      });
  },
};
