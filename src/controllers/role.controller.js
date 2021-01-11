const roleModel = require('.././models/role.model');
const { ErrorHandler } = require('../helper/error');

const getRole = async (req, res, next) => {
  try {
    const role = await roleModel.getRole();
    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.status === '') {
      data.status = 'A';
    }
    if (data.permissionIds.length === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, permissions id can not be empty'
      );
    }
    await roleModel.createRole(data, res, next);

    return res.status(201).json({
      code: 201,
      message: 'Role created successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const getRoleByIdentifier = async (req, res, next) => {
  try {
    const role = await roleModel.getRoleByIdentifier(req.params.id);
    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const role = await roleModel.deleteRole(req.params.id);
    if (role === 0) {
      throw new ErrorHandler(404, 'Bad request, id does not exist');
    }
    return res.status(200).json({
      code: 200,
      message: 'Role deleted successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await roleModel.updateRole(req.params.id, req.body);
    if (role === 0) {
      throw new ErrorHandler(404, 'Bad request, id does not exist');
    }
    return res.status(200).json({
      code: 200,
      message: 'Role updated successfully.',
      applicationErrorCode: 0
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRole: getRole,
  createRole: createRole,
  getRoleByIdentifier: getRoleByIdentifier,
  deleteRole: deleteRole,
  updateRole: updateRole
};
