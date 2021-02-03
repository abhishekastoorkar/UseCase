const userModel = require('.././models/user.model');
const { ErrorHandler } = require('../helper/error');

// create new user and save to database
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

// fetch all users from database
const listUsers = async (req, res, next) => {
  try {
    const user = await userModel.listUsers();
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// delete a user by id
const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.deleteUser(req.params.id);
    if (!user.lenght) {
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

// suspend a user by id
const suspendUser = async (req, res, next) => {
  try {
    const user = await userModel.suspendUser(req.params.id, next);
    if (!user.lenght) {
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

// activate a user by id
const activateUser = async (req, res, next) => {
  try {
    const user = await userModel.activateUser(req.params.id, next);
    if (!user.lenght) {
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

// activate a user by token
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

// generate a salt for a user
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

// to handle forgot password request
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

// to change a password
const changePassword = async (req, res, next) => {
  try {
    await userModel.changePassword(req.body, req.body.userName, next);
    return res.status(200).json({
      code: 200,
      message: 'Password change sucessfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

// retrieve all users with respect to enterprise
const listEnterpriseUsers = async (req, res, next) => {
  const enterpriseCode = 'irAImQC5U9NhCE';
  try {
    const user = await userModel.listEnterpriseUsers(enterpriseCode);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// get all users who are already logged-in
const getLoggedInUser = async (req, res, next) => {
  const currentDate = new Date(Date.now());
  try {
    const user = await userModel.getLoggedInUser(currentDate);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// to authenticate the user and generate auth token
const authenticateUser = async (req, res, next) => {
  try {
    const result = await userModel.authenticateUser(req.body, next);
    return res.status(200).json(result);
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
  changePassword: changePassword,
  listEnterpriseUsers: listEnterpriseUsers,
  getLoggedInUser: getLoggedInUser,
  authenticateUser: authenticateUser
};
