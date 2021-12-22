import { RouterContext, Bson } from '../config/deps.ts';
import { logErr, hasFalsyProperties, find, findOne } from '../functions/utils.ts';
import { response } from '../functions/response.ts';
import { db } from '../config/db.ts';

import type { Post } from '../models/Post.ts';

const postsCollection = db.collection<Post>('posts');

export default {
  // Get all posts
  get_all: async (ctx: RouterContext<'/api/posts'>) => {
    await find(postsCollection)
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
    if (!id) {
      return response(ctx, 400, 'Missing required fields');
    }

    const _id = new Bson.ObjectId(id);

    await find(postsCollection, { _id })
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
    const bodyValue = await ctx.request.body().value;
    const { text, author } = (await bodyValue.read()).fields;

    if (hasFalsyProperties({ text, author })) {
      return response(ctx, 400, 'Missing required fields');
    }

    const timestamp = new Date();

    await postsCollection
      .insertOne({ text, author, createdAt: timestamp, updatedAt: timestamp }, {})
      .then(async (postId) => {
        const post = await findOne(postsCollection, { _id: postId });

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
    if (!id) {
      return response(ctx, 400, 'Missing required fields');
    }

    const _id = new Bson.ObjectId(id);

    const post = await find(postsCollection, { _id }).next();
    if (!post) {
      return response(ctx, 404, 'Post not found');
    }

    await postsCollection
      .deleteOne({ _id })
      .then(() => {
        ctx.response.status = 204;
      })
      .catch((err) => {
        logErr(err);
        response(ctx, 500, 'Unable to delete post');
      });
  },
};
