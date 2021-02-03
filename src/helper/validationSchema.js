const Joi = require('joi');

// each schema will be depend upon different routes.

// schema for role
const roleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  enterpriseCode: Joi.string().required(),
  permissionIds: Joi.array().min(1).required()
});

// schema for password
const passwordSchema = Joi.object({});

const roleId = Joi.object({
  id: Joi.number().required()
});

const permissionSchema = Joi.object({
  feature: Joi.string().required()
});

const forgotpasswordSchema = Joi.object({
  username: Joi.string().required()
});

const changepasswordSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required()
});

const authenticateUserSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required()
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  emailId: Joi.string().email().required(),
  enterpriseCode: Joi.string().required(),
  userType: Joi.number().required(),
  roles: Joi.array().min(1).required()
});

const passwordPolicySchema = Joi.object({
  policyName: Joi.string().required(),
  description: Joi.string().required()
});

const createEnterpriseSchema = Joi.object({
  name: Joi.string().required(),
  enterpriseType: Joi.number().required(),
  admin: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    emailId: Joi.string().email().required(),
    userType: Joi.number().required()
  })
});
module.exports = {
  roleSchema: roleSchema,
  passwordSchema: passwordSchema,
  roleId: roleId,
  permissionSchema: permissionSchema,
  forgotpasswordSchema: forgotpasswordSchema,
  changepasswordSchema: changepasswordSchema,
  authenticateUserSchema: authenticateUserSchema,
  createUserSchema: createUserSchema,
  passwordPolicySchema: passwordPolicySchema,
  createEnterpriseSchema: createEnterpriseSchema
};
