const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const { nanoid } = require('nanoid');

// function to create enterprise and save in database
const createEnterprise = async (data) => {
  const entCode = nanoid(14);
  const permissionIdArray = [];
  try {
    await knex.transaction(async (trx) => {
      const ids = await trx('enterprise').insert({
        NAME: data.name,
        STATUS: 'D',
        ENTERPRISE_CODE: entCode,
        ENTERPRISE_TYPE: data.enterpriseType
      });
      await trx('address').insert({
        ENTERPRISE_ID: ids
      });
      const userId = await trx('user').insert({
        NAME: data.name,
        USERNAME: data.admin.username,
        EMAIL_ID: data.admin.emailId,
        ENTERPRISE_CODE: entCode,
        USER_TYPE: data.admin.userType
      });
      const roleId = await trx('role').insert({
        NAME: 'ADMIN',
        ENTERPRISE_CODE: entCode
      });
      // fetching all permission id's to add all permissions for root user(admin)
      const permissionIds = await trx('permission').select('permission.ID');

      for (let i = 0; i < permissionIds.length; i++) {
        permissionIdArray.push(permissionIds[i].ID);
      }
      // adding new admin role and all permissions in role_permissions table
      for (let i = 0; i < permissionIdArray.length; i++) {
        await trx('role_permissions').insert({
          ROLE_ID: roleId,
          PERMISSION_ID: permissionIdArray[i]
        });
      }
      await trx('user_roles').insert({
        USER_ID: userId,
        ROLE_ID: roleId
      });
    });
  } catch (error) {
    throw error;
  }
  return entCode;
};

//  Fetch all entrerprise from database
const listEnterprise = async () => {
  const nameArray = [];
  let roleNames = [];
  const roleIds = [];
  const roles = [];
  // Fetching data from enterprise table
  const enterprise = await knex('enterprise').select(
    'enterprise.NAME as name',
    'enterprise.STATUS as status',
    'enterprise.ENTERPRISE_CODE as enterpriseCode'
  );

  const result = await knex('user')
    .innerJoin('user_roles', 'user.Id', 'user_roles.USER_ID')
    .innerJoin('role', 'user_roles.ROLE_ID', 'role.ID')
    .leftOuterJoin('role_permissions', 'role.ID', 'role_permissions.ROLE_ID')
    .leftOuterJoin(
      'permission',
      'role_permissions.PERMISSION_ID',
      'permission.ID'
    )
    .select(
      'user.ID as id',
      'user.USERNAME as username',
      'user.NAME as name',
      'user.EMAIL_ID as emailId',
      'user.ENTERPRISE_CODE as enterpriseCode',
      'user.STATUS as status',
      'user.USER_TYPE as userType',
      knex.raw('GROUP_CONCAT(distinct(user_roles.ROLE_ID)) as roles'),
      knex.raw('GROUP_CONCAT(PERMISSION.NAME) as permissionNames')
    )
    .where({ 'user.STATUS': 'A' })
    .orWher({ 'user.STATUS': 'S' })
    .andWhere({ 'user.ENTERPRISE_CODE ': enterprise[0].enterpriseCode })
    .groupBy('user.ID');

  // formatting retrieved data as per required response
  for (let i = 0; i < result.length; i++) {
    result[i].permissionNames = result[i].permissionNames.split(',');
    roles.push(result[i]['roles']);
    delete result[i]['roles'];
  }

  // get role name for role id of every enterprise user
  const getRoleName = async (id) => {
    const roleName = await knex.raw(
      `select ID as id, NAME as name, STATUS as status from role where FIND_IN_SET(ID, '${id}')`
    );
    return roleName[0];
  };

  // formatting data as per required response
  for (let i = 0; i < result.length; i++) {
    const id = roles[i].split(',');
    const names = await getRoleName(id);
    nameArray.push(names);
  }

  // adding formatted data into response JSON
  for (let i = 0; i < nameArray.length; i++) {
    for (let j = 0; j < nameArray[i].length; j++) {
      roleNames.push(nameArray[i][j].name);
      roleIds.push(nameArray[i][j].id);
    }
    result[i].roleNames = roleNames;
    roleNames = [];
  }
  const ent = JSON.parse(JSON.stringify(enterprise[0]));
  // checking activation status of enterprise and changing it's name
  if (ent.status === 'A') {
    ent.status = 'Active';
  } else {
    ent.status = 'Inactive';
  }
  ent['admin'] = result;
  return ent;
};

// Suspend the enterprise by enterprise id
const suspendEnterprise = async (id) => {
  // suspend enterprise if status is active and make changes 'S' in Db
  const result = await knex('enterprise')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'S' });
  return result;
};

// Activate the enterprise by id
const activateEnterprise = async (id) => {
  // activate enterprise if status is suspended and make changes as 'A' in Db
  const result = await knex('enterprise')
    .where({ ID: id })
    .andWhere({ STATUS: 'S' })
    .update({ STATUS: 'A' });
  return result;
};

// Delete the enterprise by its id
const deleteEnterprise = async (id) => {
  const result = await knex('enterprise')
    .where({ ID: id })
    .update({ STATUS: 'D' });
  return result;
};
module.exports = {
  createEnterprise: createEnterprise,
  listEnterprise: listEnterprise,
  suspendEnterprise: suspendEnterprise,
  activateEnterprise: activateEnterprise,
  deleteEnterprise: deleteEnterprise
};
