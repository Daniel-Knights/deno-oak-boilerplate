import { config } from 'https://deno.land/x/dotenv@v2.0.0/mod.ts';

export { Application, Router } from 'https://deno.land/x/oak@v8.0.0/mod.ts';
export type {
  Request,
  RouterContext,
  RouterMiddleware,
} from 'https://deno.land/x/oak@v8.0.0/mod.ts';
export {
  Model,
  Database,
  DataTypes,
  Relationships,
  MongoDBConnector,
} from 'https://deno.land/x/denodb@v1.0.38/mod.ts';
export { create, verify } from 'https://deno.land/x/djwt@v2.2/mod.ts';
export { hash, compare } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

// Environment variables
const env = config();
export { env };
