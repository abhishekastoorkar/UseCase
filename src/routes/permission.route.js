const express = require('express');
const router = express.Router();
const permissionController = require('.././controllers/permission.controller');
const validate = require('.././helper/validation');

router.get('/', permissionController.getAllPermissions);

router.get(
  '/search',
  validate('permissionSchema', 'query'),
  permissionController.getPermissionByFeature
);

module.exports = router;
