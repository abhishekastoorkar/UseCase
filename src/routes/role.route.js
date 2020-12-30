const express = require('express');
const router = express.Router();
const roleController = require('.././controllers/role.controller');

router.get('/roles', roleController.getRole);
router.get('/roles/:id', roleController.getRoleByIdentifier);
router.post('/roles', roleController.createRole);
router.put('/roles/:id', roleController.deleteRole);

module.exports = router;
