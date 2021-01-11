const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const { nanoid } = require('nanoid');

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
      const permissionIds = await trx('permission').select('permission.ID');
      for (let i = 0; i < permissionIds.length; i++) {
        permissionIdArray.push(permissionIds[i].ID);
      }
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

const listEnterprise = async () => {
  const nameArray = [];
  let roleNames = [];
  const roleIds = [];
  const roles = [];
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

  for (let i = 0; i < result.length; i++) {
    result[i].permissionNames = result[i].permissionNames.split(',');
    roles.push(result[i]['roles']);
    delete result[i]['roles'];
  }

  const getPermissionName = async (id) => {
    const roleName = await knex.raw(
      `select ID as id, NAME as name, STATUS as status from role where FIND_IN_SET(ID, '${id}')`
    );
    return roleName[0];
  };

  for (let i = 0; i < result.length; i++) {
    const id = roles[i].split(',');
    const names = await getPermissionName(id);
    nameArray.push(names);
  }

  for (let i = 0; i < nameArray.length; i++) {
    for (let j = 0; j < nameArray[i].length; j++) {
      roleNames.push(nameArray[i][j].name);
      roleIds.push(nameArray[i][j].id);
    }
    result[i].roleNames = roleNames;
    roleNames = [];
  }
  const ent = JSON.parse(JSON.stringify(enterprise[0]));
  console.log(ent);
  if (ent.status === 'A') {
    ent.status = 'Active';
  } else {
    ent.status = 'Inactive';
  }
  ent['admin'] = result;
  return ent;
};

const suspendEnterprise = async (id) => {
  const result = await knex('enterprise')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'S' });
  return result;
};

const activateEnterprise = async (id) => {
  const result = await knex('enterprise')
    .where({ ID: id })
    .andWhere({ STATUS: 'D' })
    .update({ STATUS: 'A' });
  return result;
};

const deleteEnterprise = async (id) => {
  const result = await knex('enterprise')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
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
