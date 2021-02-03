const express = require('express');
const router = express.Router();
const userController = require('.././controllers/user.controller');
const validate = require('.././helper/validation');

router.post(
  '/auth',
  validate('authenticateUserSchema', 'body'),
  userController.authenticateUser
);

module.exports = router;
