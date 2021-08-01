import { RouterContext } from '../config/deps.ts';

// Check for existence of required fields
export const validate = (fields: Record<string, unknown>) => {
  let valid;

  Object.values(fields).forEach((field) => {
    valid = !field ? false : true;
  });

  return valid;
};

// Invalid fields response
export const invalid = (ctx: RouterContext) => {
  ctx.response.status = 400;
  ctx.response.body = {
    success: false,
    msg: 'Missing required fields',
  };
};
