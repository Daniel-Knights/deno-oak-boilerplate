import { config } from 'https://deno.land/x/dotenv@v3.1.0/mod.ts';

export { Application, Router } from 'https://deno.land/x/oak@v10.0.0/mod.ts';
export type {
  Request,
  Context,
  RouterContext,
  RouterMiddleware,
} from 'https://deno.land/x/oak@v10.0.0/mod.ts';
export {
  Model,
  Database,
  DataTypes,
  Relationships,
  MongoDBConnector,
} from 'https://deno.land/x/denodb@v1.0.40/mod.ts';
export { create, verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';
export { hash, compare } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts';

// Environment variables
const env = config();
export { env };
