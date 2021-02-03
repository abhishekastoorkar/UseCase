const express = require('express');
const router = express.Router();
const enterpriseController = require('.././controllers/enterprise.controller');
const validate = require('.././helper/validation');

router.post(
  '/root',
  validate('createEnterpriseSchema', 'body'),
  enterpriseController.createEnterprise
);
router.get('/', enterpriseController.listEnterprise);
router.put(
  '/:id/suspend',
  validate('roleId', 'params'),
  enterpriseController.suspendEnterprise
);
router.put(
  '/:id/activate',
  validate('roleId', 'params'),
  enterpriseController.activateEnterprise
);
router.delete(
  '/:id/delete',
  validate('roleId', 'params'),
  enterpriseController.deleteEnterprise
);

module.exports = router;
