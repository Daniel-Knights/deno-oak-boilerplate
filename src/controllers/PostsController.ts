import { RouterContext, Bson } from '../config/deps.ts';
import { validate } from '../functions/validate.ts';
import { response } from '../functions/response.ts';
import { logErr } from '../functions/utils.ts';
import { db } from '../config/db.ts';

import type { Post } from '../models/Post.ts';

const postsCollection = db.collection<Post>('posts');

export default {
  // Get all posts
  get_all: async (ctx: RouterContext<'/api/posts'>) => {
    await postsCollection
      .find()
      .toArray()
      .then((posts) => {
        response(ctx, 200, 'Fetched posts', posts);
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to fetch posts');
      });
  },

  // Get single post
  get_single: async (ctx: RouterContext<'/api/posts/:id'>) => {
    const { id } = ctx.params;

    await postsCollection
      .find({ id: id || '' })
      .next()
      .then((post) => {
        if (!post) {
          return response(ctx, 404, 'Post not found');
        }

        response(ctx, 200, 'Fetched post', post);
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to fetch post');
      });
  },

  // Create post
  create: async (ctx: RouterContext<'/api/posts'>) => {
    const { text, author } = await ctx.request.body().value;

    if (!validate({ text, author })) {
      return response(ctx, 400, 'Missing required fields');
    }

    const timestamp = new Bson.Timestamp();

    await postsCollection
      .insertOne({ text, author, createdAt: timestamp, updatedAt: timestamp })
      .then((post) => {
        response(ctx, 201, 'Created post', post);
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to create post');
      });
  },

  // Delete post
  delete: async (ctx: RouterContext<'/api/posts/:id'>) => {
    const { id } = ctx.params;
    const post = await postsCollection.find({ id: id || '' });

    if (!post) {
      return response(ctx, 404, 'Post not found');
    }

    await postsCollection
      .deleteOne({ id: id || '' })
      .then(() => {
        response(ctx, 204, 'Deleted post');
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to delete post');
      });
  },
};
