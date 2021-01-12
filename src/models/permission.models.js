const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);

// Function to get all permissions
const getAllPermissions = async () => {
  const result = await knex('permission').distinct('FEATURE');
  const feature = [];

  // fetching data from permission table for each permission feature
  async function permissions(i) {
    const result = await knex('permission')
      .select(
        'ID as id',
        'NAME as name',
        'DESCRIPTION as description',
        'STATUS as status'
      )
      .where({ FEATURE: i.FEATURE });
    return result;
  }

  for (let i = 0; i < result.length; i++) {
    const type = result[i].FEATURE;
    const data = await permissions(result[i]);
    feature.push({ [type]: data });
  }
  return feature;
};

// Function to get a specific permission by feature
const getPermissionByFeature = async (featureArr) => {
  const permission = [];
  for (let i = 0; i < featureArr.length; i++) {
    const result = await knex('permission')
      .where({
        FEATURE: featureArr[i]
      })
      .select(
        'ID as id',
        'NAME as name',
        'DESCRIPTION as description',
        'STATUS as status'
      );
    permission.push({ [featureArr[i]]: result });
  }

  return permission;
};

module.exports = {
  getAllPermissions: getAllPermissions,
  getPermissionByFeature: getPermissionByFeature
};
