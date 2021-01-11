const express = require('express');
const router = express.Router();
const enterpriseController = require('.././controllers/enterprise.controller');

router.post('/root', enterpriseController.createEnterprise);
router.get('/', enterpriseController.listEnterprise);
router.put('/:id/suspend', enterpriseController.suspendEnterprise);
router.put('/:id/activate', enterpriseController.activateEnterprise);
router.delete('/:id/delete', enterpriseController.deleteEnterprise);

module.exports = router;
