const permissionModel = require('.././models/permission.models');
const { ErrorHandler } = require('../helper/error');

async function getAllPermissions(req, res, next) {
  try {
    const permissions = await permissionModel.getAllPermissions();
    return res.status(200).send(permissions);
  } catch (error) {
    next(error);
  }
}

async function getPermissionByFeature(req, res, next) {
  const { feature } = req.query;
  try {
    if (feature === '') {
      throw new ErrorHandler(404, 'Bad request, features can not be empty');
    }
    const permission = await permissionModel.getPermissionByFeature(feature);
    return res.status(200).json(permission);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPermissions: getAllPermissions,
  getPermissionByFeature: getPermissionByFeature,
};
