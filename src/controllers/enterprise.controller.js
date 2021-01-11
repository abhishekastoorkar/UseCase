const enterpriseModel = require('.././models/enterprise.model');
const { ErrorHandler } = require('../helper/error');

const createEnterprise = async (req, res, next) => {
  try {
    const entCode = await enterpriseModel.createEnterprise(req.body, next);
    return res.status(201).json({
      code: 201,
      message: 'New enterprise created successfully.',
      enterpriseCode: entCode,
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const listEnterprise = async (req, res, next) => {
  try {
    const enterprise = await enterpriseModel.listEnterprise();
    return res.status(200).json(enterprise);
  } catch (error) {
    next(error);
  }
};

const suspendEnterprise = async (req, res, next) => {
  try {
    const result = await enterpriseModel.suspendEnterprise(req.params.id, next);
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or Enterprise already suspended'
      );
    }
    return res.status(200).json({
      code: 200,
      message: 'Enterprise suspended successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const activateEnterprise = async (req, res, next) => {
  try {
    const result = await enterpriseModel.activateEnterprise(
      req.params.id,
      next
    );
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or Enterprise already activated'
      );
    }
    return res.status(200).json({
      code: 200,
      message: 'Enterprise activated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const deleteEnterprise = async (req, res, next) => {
  try {
    const result = await enterpriseModel.deleteEnterprise(req.params.id, next);
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or Enterprise already deleted'
      );
    }
    return res.status(200).json({
      code: 200,
      message: 'Enterprise deleted successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnterprise: createEnterprise,
  listEnterprise: listEnterprise,
  suspendEnterprise: suspendEnterprise,
  activateEnterprise: activateEnterprise,
  deleteEnterprise: deleteEnterprise
};
