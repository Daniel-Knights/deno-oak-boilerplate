// Check for existence of required fields
export const validate: Function = (fields: Object) => {
    let valid;

    Object.values(fields).forEach(field => {
        valid = !field ? false : true;
    });

    return valid;
};

// Invalid fields response
export const invalid: Function = (ctx: any) => {
    ctx.response.status = 400;
    ctx.response.body = {
        success: false,
        msg: 'Missing required fields',
    };
};
