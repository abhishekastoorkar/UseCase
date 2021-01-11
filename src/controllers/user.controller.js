const userModel = require('.././models/user.model');
const { ErrorHandler } = require('../helper/error');

const createUser = async (req, res, next) => {
  try {
    await userModel.createUser(req.body, next);
    return res.status(201).json({
      code: 201,
      message: 'New user created successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const user = await userModel.listUsers();
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.deleteUser(req.params.id);
    if (user === 0) {
      throw new ErrorHandler(404, 'Bad request, id does not exist');
    }
    return res.status(200).json({
      code: 200,
      message: 'User deleted successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const result = await userModel.suspendUser(req.params.id, next);
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or user already suspended'
      );
    }
    return res.status(200).json({
      code: 200,
      message: 'User suspended successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const result = await userModel.activateUser(req.params.id, next);
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or user already activated'
      );
    }
    return res.status(200).json({
      code: 200,
      message: 'User activated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const activateUserByToken = async (req, res, next) => {
  try {
    const result = await userModel.activateUserByToken(
      req.params.key,
      req.body,
      next
    );
    if (result === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, id does not exist or user already activated'
      );
    }
    return res.status(200).json({
      code: 200,
      message: 'User activated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const getSalt = async (req, res, next) => {
  try {
    const result = await userModel.getSalt(req.body.username, next);
    if (result[0] === undefined) {
      throw new ErrorHandler(404, 'Bad request, Username not found');
    }
    return res.status(200).json({ salt: result[0].salt });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await userModel.forgotPassword(req.body.username, next);
    return res.status(201).json({
      code: 201,
      message: 'Activation key generated.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await userModel.changePassword(req.body, next);
    return res.status(200).json({
      code: 200,
      message: 'Password change sucessfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser: createUser,
  listUsers: listUsers,
  deleteUser: deleteUser,
  suspendUser: suspendUser,
  activateUser: activateUser,
  activateUserByToken: activateUserByToken,
  getSalt: getSalt,
  forgotPassword: forgotPassword,
  changePassword: changePassword
};
