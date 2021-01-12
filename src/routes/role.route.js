const express = require('express');
const router = express.Router();
const roleController = require('.././controllers/role.controller');
const validate = require('.././helper/validation');

router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRoleByIdentifier);
router.post('/', validate('roleSchema', 'body'), roleController.createRole);
router.delete('/:id', roleController.deleteRole);
router.put('/:id', roleController.updateRole);

module.exports = router;
