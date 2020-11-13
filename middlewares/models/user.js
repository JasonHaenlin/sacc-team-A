
const Joi = require('joi');

const schema = Joi.object({
    sha1: Joi.string().pattern(/^([A-Za-z0-9]{10})+$/).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    user_status_changeDate: Joi.date().timestamp(),
});

// return { error, value }
module.exports = (model) => schema.validate(model);
