const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

// return { error, value }
module.exports = (model) => schema.validate(model);
