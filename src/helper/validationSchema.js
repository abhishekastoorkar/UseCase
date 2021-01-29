const Joi = require('joi');

// each schema will be different for routes.

// schema for role
const roleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  permissionIds: Joi.array().required()
});

// schema for password
const passwordSchema = Joi.object({
    
});

module.exports = {
  roleSchema: roleSchema,
  passwordSchema: passwordSchema
};
