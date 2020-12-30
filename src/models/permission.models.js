const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);

//Function to get all permissions
getAllPermissions = async () => {
  const result = await knex('permission').distinct('FEATURE');
  let feature = [];

  async function permissions(i) {
    const result = await knex('permission')
      .select('ID', 'NAME', 'DESCRIPTION')
      .where({ FEATURE: i.FEATURE });
    return result;
  }
  for (let i = 0; i < result.length; i++) {
    type = result[i].FEATURE;
    data = await permissions(result[i]);
    feature.push({ [type]: data });
  }
  return feature;
};

//Function to get a specific permission by feature
getPermissionByFeature = async (features) => {
  let permission = [];
  let featureArr = features.split(',');
  for (let i = 0; i < featureArr.length; i++) {
    const result = await knex('permission')
      .where({
        FEATURE: featureArr[i],
      })
      .select('ID', 'NAME', 'DESCRIPTION', 'STATUS');
    permission.push({ [featureArr[i]]: result });
  }

  return permission;
};

module.exports = {
  getAllPermissions: getAllPermissions,
  getPermissionByFeature: getPermissionByFeature,
};
