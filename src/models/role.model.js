const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const { ErrorHandler } = require('../helper/error');

// Function to get all roles
const getRoles = async () => {
  const res = [];
  // result will store role specific data
  const result = await knex('role')
    .join('role_permissions', 'role.ID', 'role_permissions.ROLE_ID')
    .join('permission', 'role_permissions.PERMISSION_ID', 'permission.ID')
    .select([
      'ROLE.ID as id',
      'ROLE.NAME as name',
      'ROLE.DESCRIPTION as description ',
      'ROLE.STATUS as status',
      knex.raw('GROUP_CONCAT(PERMISSION.ID) as permissions')
    ])
    .groupBy('role.ID');
  const data = { roles: result };

  // getPermissions function will return permissions depend on permissionIds
  const getPermissions = async (id) => {
    const permissions = await knex.raw(
      `select ID as id, NAME as name, DESCRIPTION as description from permission where FIND_IN_SET(id, '${id}')`
    );
    return permissions[0];
  };

  for (let i = 0; i < result.length; i++) {
    res.push(result[i].permissions);
  }

  // will fetch permissions and add it result json
  for (let i = 0; i < res.length; i++) {
    const permissions = await getPermissions(res[i]);
    data.roles[i].permissions = permissions;
  }

  return data;
};

// Function to get create a role
const createRole = async (role) => {
  let inserts = [];

  // fetch role names from role table
  const result = await knex('role')
    .select('NAME')
    .where({ ENTERPRISE_CODE: role.enterpriseCode });

  // check for unique role names
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
        STATUS: role.status
      });

      for (let i = 0; i < role.permissionIds.length; i++) {
        inserts = await trx('role_permissions').insert({
          ROLE_ID: ids,
          PERMISSION_ID: role.permissionIds[i]
        });
      }
      return inserts.length + ' new role saved';
    });
  } catch (error) {
    throw error;
  }
};

// Function to get a specific role by id
const getRoleByIdentifier = async (id) => {
  const res = [];
  let permissions;
  const permission = [];
  // fetching and grouping data by permission id
  const result = await knex('role')
    .join('role_permissions', 'role.ID', 'role_permissions.ROLE_ID')
    .join('permission', 'role_permissions.PERMISSION_ID', 'permission.ID')
    .select([
      'ROLE.ID as id',
      'ROLE.NAME as name',
      'ROLE.DESCRIPTION as description ',
      'ROLE.STATUS as status',
      knex.raw('GROUP_CONCAT(PERMISSION.ID) as permissionsByFeature')
    ])
    .where({ 'role.ID': id });
  // adding retrieved data into response object
  const data = result[0];

  // fetching and grouping all permission features for each permission id
  const getPermissions = async (id) => {
    const result = await knex.raw(
      `select GROUP_CONCAT(PERMISSION.FEATURE) as Feature from permission where FIND_IN_SET(id, '${id}') group by(FEATURE) `
    );
    return result[0];
  };

  //fetching permissions by permission feature
  const getPermissionsByFeature = async (features) => {
    const result = await knex('permission')
      .where({
        FEATURE: features
      })
      .select(
        'ID as id',
        'NAME as name',
        'DESCRIPTION as description',
        'STATUS as status'
      );
    return { [features]: result };
  };

  // adding role specific permission id into array
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

// Function to delete a role
const deleteRole = async (id) => {
  const result = await knex('role')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'D' });
  return result;
};

// update a specific role data and save to databse
const updateRole = async (id, data) => {
  // deleting old role permissions
  await knex('role_permissions').where({ ROLE_ID: id }).del();
  // updating role name and role description
  const result = await knex('role')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({
      NAME: data.name,
      DESCRIPTION: data.description,
      LAST_UPDATE_DATE: new Date()
    });
  // adding new role permissions
  for (let i = 0; i < data.permissionIds.length; i++) {
    await knex('role_permissions').insert({
      ROLE_ID: id,
      PERMISSION_ID: data.permissionIds[i],
      LAST_UPDATE_DATE: new Date()
    });
  }
  return result;
};

module.exports = {
  getRoles: getRoles,
  createRole: createRole,
  getRoleByIdentifier: getRoleByIdentifier,
  deleteRole: deleteRole,
  updateRole: updateRole
};
