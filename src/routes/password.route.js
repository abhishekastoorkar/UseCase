const express = require('express');
const router = express.Router();
const passwordController = require('.././controllers/password.controller');
const validate = require('.././helper/validation');

router.post(
  '/',
  validate('passwordPolicySchema', 'body'),
  passwordController.createpassword
);

router.get('/', passwordController.getPasswordPolicies);

router.put(
  '/:id/activate',
  validate('roleId', 'params'),
  validate('passwordSchema', 'params'),
  passwordController.activatePasswordPolicy
);

router.put(
  '/:id/deactivate',
  validate('roleId', 'params'),
  passwordController.deActivatePasswordPolicy
);

router.delete(
  '/:id',
  validate('roleId', 'params'),
  passwordController.deletePasswordPolicy
);

router.put(
  '/',
  validate('passwordPolicySchema', 'body'),
  passwordController.updatePasswordPolicy
);

module.exports = router;
