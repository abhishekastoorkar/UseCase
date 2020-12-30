const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const { ErrorHandler } = require('../helper/error');

//Function to get all roles
getRole = async () => {
  let res = [];
  //result will store role specific data
  result = await knex('role')
    .join('role_permissions', 'role.ID', 'role_permissions.ROLE_ID')
    .join('permission', 'role_permissions.PERMISSION_ID', 'permission.ID')
    .select([
      'ROLE.ID as id',
      'ROLE.NAME as name',
      'ROLE.DESCRIPTION as description ',
      'ROLE.STATUS as status',
      knex.raw('GROUP_CONCAT(PERMISSION.ID) as permissions'),
    ])
    .groupBy('role.ID');
  data = { ['roles']: result };

  // getPermissions function will return permissions depend on permissionIds
  getPermissions = async (id) => {
    result = await knex.raw(
      `select ID, NAME, DESCRIPTION  from permission where FIND_IN_SET(id, '${id}')`
    );
    return result[0];
  };

  for (let i = 0; i < result.length; i++) {
    res.push(result[i].permissions);
  }

  //will fetch permissions and add it result json
  for (let i = 0; i < res.length; i++) {
    let permissions = await getPermissions(res[i]);
    data.roles[i].permissions = permissions;
  }

  return data;
};

//Function to get create a role
createRole = async (role) => {
  const result = await knex('role')
    .select('NAME')
    .where({ ENTERPRISE_CODE: role.enterpriseCode });

  for (let i = 0; i < result.length; i++) {
    if (result[i].NAME === role.name) {
      throw new ErrorHandler(404, 'Bad request, name must be unique');
    }
  }

  try {
    await knex.transaction(async (trx) => {
      const ids = await trx('role').insert({
        NAME: role.name,
        DESCRIPTION: role.description,
        ENTERPRISE_CODE: role.enterpriseCode,
        STATUS: role.status,
      });

      for (let i = 0; i < role.permissionIds.length; i++) {
        inserts = await trx('role_permissions').insert({
          ROLE_ID: ids,
          PERMISSION_ID: role.permissionIds[i],
        });
      }
      return inserts.length + ' new role saved';
    });
  } catch (error) {
    throw error;
  }
};

//Function to get a specific role by id
getRoleByIdentifier = async (id) => {
  let res = [];
  let permissions;
  let permission = [];
  result = await knex('role')
    .join('role_permissions', 'role.ID', 'role_permissions.ROLE_ID')
    .join('permission', 'role_permissions.PERMISSION_ID', 'permission.ID')
    .select([
      'ROLE.ID as id',
      'ROLE.NAME as name',
      'ROLE.DESCRIPTION as description ',
      'ROLE.STATUS as status',
      knex.raw('GROUP_CONCAT(PERMISSION.ID) as permissionsByFeature'),
    ])
    .where({ 'role.ID': id });

  let data = result[0];
  getPermissions = async (id) => {
    result = await knex.raw(
      `select GROUP_CONCAT(PERMISSION.FEATURE) as Feature from permission where FIND_IN_SET(id, '${id}') group by(FEATURE) `
    );
    return result[0];
  };
  getPermissionsByFeature = async (features) => {
    const result = await knex('permission')
      .where({
        FEATURE: features,
      })
      .select('ID', 'NAME', 'DESCRIPTION', 'STATUS');
    return { [features]: result };
  };

  for (let i = 0; i < result.length; i++) {
    res.push(result[i].permissionsByFeature);
  }
  for (let i = 0; i < res.length; i++) {
    permissions = await getPermissions(res[i]);
  }

  for (let i = 0; i < permissions.length; i++) {
    permission.push(
      await getPermissionsByFeature(permissions[i].Feature.split(',')[0])
    );
  }
  data.permissionsByFeature = permission;
  return data;
};

//Function to delete a role
deleteRole = async (id) => {
  const result = await knex('role')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'D' });
  console.log(result);
  return result;
};
module.exports = {
  getRole: getRole,
  createRole: createRole,
  getRoleByIdentifier: getRoleByIdentifier,
  deleteRole: deleteRole,
};
