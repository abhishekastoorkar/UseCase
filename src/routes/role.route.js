const express = require('express');
const router = express.Router();
const roleController = require('.././controllers/role.controller');
const validate = require('.././helper/validation');

router.get('/', roleController.getRoles);
router.get(
  '/:id',
  validate('roleId', 'params'),
  roleController.getRoleByIdentifier
);
router.post('/', validate('roleSchema', 'body'), roleController.createRole);
router.delete('/:id', validate('roleId', 'params'), roleController.deleteRole);
router.put(
  '/:id',
  validate('roleId', 'params'),
  validate('roleSchema', 'body'),
  roleController.updateRole
);

module.exports = router;
