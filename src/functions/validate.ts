// Check for existence of required fields
export const validate = (fields: Record<string, unknown>) => {
  let valid;

  Object.values(fields).forEach((field) => {
    valid = !field ? false : true;
  });

  return valid;
};
