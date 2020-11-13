
const Joi = require('joi');

const schema = Joi.object({
    u1sha1: Joi.string().pattern(/^([A-Za-z0-9]{10})+$/).required(),
    u2sha1: Joi.string().pattern(/^([A-Za-z0-9]{10})+$/).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    timestamp: Joi.date().timestamp(),
});

// return { error, value }
module.exports = (model) => schema.validate(model);
