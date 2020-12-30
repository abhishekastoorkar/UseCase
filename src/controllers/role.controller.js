const roleModel = require('.././models/role.model');
const { ErrorHandler } = require('../helper/error');

getRole = async (req, res, next) => {
  try {
    const role = await roleModel.getRole();
    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

createRole = async (req, res, next) => {
  try {
    let data = req.body;
    if (data.status === '') {
      data.status = 'A';
    }
    if (data.permissionIds.length === 0) {
      throw new ErrorHandler(
        404,
        'Bad request, permissions id can not be empty'
      );
    }
    const role = await roleModel.createRole(data, res, next);

    return res.status(201).json({ message: 'Role created successfully.' });
  } catch (error) {
    next(error);
  }
};

getRoleByIdentifier = async (req, res, next) => {
  try {
    const role = await roleModel.getRoleByIdentifier(req.params.id);
    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

deleteRole = async (req, res, next) => {
  try {
    const role = await roleModel.deleteRole(req.params.id);
    if (role === 0) {
      throw new ErrorHandler(404, 'Bad request, id does not exist');
    }
    return res.status(200).json('Role deleted successfully.');
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getRole: getRole,
  createRole: createRole,
  getRoleByIdentifier: getRoleByIdentifier,
  deleteRole: deleteRole,
};
