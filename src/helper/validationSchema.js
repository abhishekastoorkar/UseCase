const Joi = require('joi');

const roleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  permissionIds: Joi.array().required()
});

const passwordSchema = Joi.object({
  id: Joi.number().min(1).required()
});

module.exports = {
  roleSchema: roleSchema,
  passwordSchema: passwordSchema
};
