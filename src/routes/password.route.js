const express = require('express');
const router = express.Router();
const passwordController = require('.././controllers/password.controller');

const validate = require('.././helper/validation');

router.post('/', passwordController.createpassword);

router.get('/', passwordController.getPasswordPolicies);

router.put(
  '/:id/activate',
  validate('passwordSchema', 'params'),
  passwordController.activatePasswordPolicy
);

router.put('/:id/deactivate', passwordController.deActivatePasswordPolicy);

router.delete('/:id', passwordController.deletePasswordPolicy);

router.put('/', passwordController.updatePasswordPolicy);

module.exports = router;
