const express = require('express');
const router = express.Router();
const userController = require('.././controllers/user.controller');
const validate = require('.././helper/validation');
const validateToken = require('.././helper/verifyJWT');

router.post('/', userController.createUser);

router.get('/list', validateToken, userController.listEnterpriseUsers);

router.delete('/:id', userController.deleteUser);

router.put('/suspend/:id', userController.suspendUser);

router.put('/activate/:id', userController.activateUser);

router.post('/activation/:key', userController.activateUserByToken);

router.post('/salt', userController.getSalt);

router.post('/forgotpasword', userController.forgotPassword);

router.put('/passwd/change', validateToken, userController.changePassword);

router.get('/', userController.getLoggedInUser);

module.exports = router;
