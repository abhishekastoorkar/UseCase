const express = require('express');
const router = express.Router();
const userController = require('.././controllers/user.controller');

router.post('/auth', userController.authenticateUser);

module.exports = router;
