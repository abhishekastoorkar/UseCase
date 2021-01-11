const passwordModel = require('.././models/password.model');
const { ErrorHandler } = require('../helper/error');

const createpassword = async (req, res, next) => {
  try {
    await passwordModel.createpassword(req.body, res, next);
    return res.status(201).json({
      code: 201,
      message: 'Password policy created successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const getPasswordPolicies = async (req, res, next) => {
  try {
    const passwordPolicy = await passwordModel.getPasswordPolicies();
    return res.status(200).json(passwordPolicy);
  } catch (error) {
    next(error);
  }
};

const activatePasswordPolicy = async (req, res, next) => {
  try {
    const result = await passwordModel.activatePasswordPolicy(
      req.params.id,
      next
    );
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or password policy already activated'
      );
    }
    return res.status(200).json({
      code: 200,
      message: ' Password policy activated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const deActivatePasswordPolicy = async (req, res, next) => {
  try {
    const result = await passwordModel.deActivatePasswordPolicy(
      req.params.id,
      next
    );
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or password policy already deactivated'
      );
    }
    return res.status(200).json({
      code: 200,
      message: ' Password policy deactivated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const deletePasswordPolicy = async (req, res, next) => {
  try {
    const result = await passwordModel.deletePasswordPolicy(
      req.params.id,
      next
    );
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or password policy already deleted'
      );
    }
    return res.status(200).json({
      code: 200,
      message: ' Password policy deleted successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const updatePasswordPolicy = async (req, res, next) => {
  try {
    await passwordModel.updatePasswordPolicy(req.body);
    return res.status(200).json({
      code: 200,
      message: 'Password policy updated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createpassword: createpassword,
  getPasswordPolicies: getPasswordPolicies,
  activatePasswordPolicy: activatePasswordPolicy,
  deActivatePasswordPolicy: deActivatePasswordPolicy,
  deletePasswordPolicy: deletePasswordPolicy,
  updatePasswordPolicy: updatePasswordPolicy
};
