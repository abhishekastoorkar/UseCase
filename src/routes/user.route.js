const express = require('express');
const router = express.Router();
const userController = require('.././controllers/user.controller');

router.post('/', userController.createUser);

router.get('/list', userController.listUsers);

router.delete('/:id', userController.deleteUser);

router.put('/suspend/:id', userController.suspendUser);

router.put('/activate/:id', userController.activateUser);

router.post('/activation/:key', userController.activateUserByToken);

router.post('/salt', userController.getSalt);

router.post('/forgotpasword', userController.forgotPassword);

router.put('/passwd/change', userController.changePassword);

module.exports = router;
