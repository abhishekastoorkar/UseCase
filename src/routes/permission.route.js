const express = require('express');
const router = express.Router();
const permissionController = require('.././controllers/permission.controller');

router.get('/', permissionController.getAllPermissions);

router.get('/search', permissionController.getPermissionByFeature);

module.exports = router;
