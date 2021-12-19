import type { Context } from '../config/deps.ts';

enum ResponseCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export function response(ctx: Context, statusCode: number, msg?: string, data?: unknown) {
  ctx.response.status = statusCode;
  ctx.response.body = {
    success: statusCode < 400,
    status: ResponseCodes[statusCode],
    msg,
    data,
  };
}
