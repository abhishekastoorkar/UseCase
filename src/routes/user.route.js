const express = require('express');
const router = express.Router();
const userController = require('.././controllers/user.controller');
const validate = require('.././helper/validation');
const validateToken = require('.././helper/verifyJWT');

router.post(
  '/',
  validate('createUserSchema', 'body'),
  userController.createUser
);

router.get('/list', userController.listUsers);

router.delete('/:id', validate('roleId', 'params'), userController.deleteUser);

router.put(
  '/suspend/:id',
  validate('roleId', 'params'),
  userController.suspendUser
);

router.put(
  '/activate/:id',
  validate('roleId', 'params'),
  userController.activateUser
);

router.post('/activation/:key', userController.activateUserByToken);

router.post('/salt', userController.getSalt);

router.post(
  '/forgotpasword',
  validate('forgotpasswordSchema', 'body'),
  userController.forgotPassword
);

router.put(
  '/passwd/change',
  validate('changepasswordSchema', 'body'),
  userController.changePassword
);

router.get('/', userController.getLoggedInUser);

module.exports = router;
