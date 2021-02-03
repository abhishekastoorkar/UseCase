const roleModel = require('.././models/role.model');
const { ErrorHandler } = require('../helper/error');

// retrieve al roles from database
const getRoles = async (req, res, next) => {
  try {
    const roles = await roleModel.getRoles();
    return res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

// create new role and save to database
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

// get a role for database by role id
const getRoleByIdentifier = async (req, res, next) => {
  try {
    const role = await roleModel.getRoleByIdentifier(req.params.id);
    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

// delete role by id
const deleteRole = async (req, res, next) => {
  try {
    const result = await roleModel.deleteRole(req.params.id);
    if (!result.lenght) {
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

// update a specific role data and save to databse
const updateRole = async (req, res, next) => {
  try {
    const role = await roleModel.updateRole(req.params.id, req.body);
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
  getRoles: getRoles,
  createRole: createRole,
  getRoleByIdentifier: getRoleByIdentifier,
  deleteRole: deleteRole,
  updateRole: updateRole
};
