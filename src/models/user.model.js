const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const crypto = require('crypto');
const getActivation = require('../helper/activationToken');

const { ErrorHandler } = require('../helper/error');

const createUser = async (data) => {
  const roleId = [];
  let inserts;

  try {
    await knex.transaction(async (trx) => {
      const ids = await trx('user').insert({
        NAME: data.name,
        USERNAME: data.username,
        EMAIL_ID: data.emailId,
        ENTERPRISE_CODE: data.enterpriseCode,
        USER_TYPE: data.userType
      });

      for (let i = 0; i < data.roles.length; i++) {
        const id = await knex('role')
          .select('role.ID')
          .where({ NAME: data.roles[i] });
        roleId.push(id[0].ID);
      }

      for (let i = 0; i < roleId.length; i++) {
        inserts = await trx('user_roles').insert({
          USER_ID: ids,
          ROLE_ID: roleId[i]
        });
      }

      const activeExpires = new Date(Date.now() + 24 * 3600 * 1000);
      const activeToken = await getActivation.getActivationKey();

      await knex('user_activation_key').insert({
        USER_ID: ids,
        ACTIVATION_KEY: activeToken,
        EXPIRY_DATE: activeExpires
      });

      return inserts.length + 'new user saved';
    });
  } catch (error) {
    throw error;
  }
};

const listUsers = async () => {
  const nameArray = [];
  let roleNames = [];
  const roleIds = [];
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
    .groupBy('user.ID');

  for (let i = 0; i < result.length; i++) {
    result[i].permissionNames = result[i].permissionNames.split(',');
  }
  const data = { users: result };
  const getPermissionName = async (id) => {
    const roleName = await knex.raw(
      `select ID as id, NAME as name, STATUS as status from role where FIND_IN_SET(ID, '${id}')`
    );
    return roleName[0];
  };

  for (let i = 0; i < result.length; i++) {
    const id = result[i].roles.split(',');
    const names = await getPermissionName(id);
    nameArray.push(names);
    data.users[i].roles = names;
  }

  for (let i = 0; i < nameArray.length; i++) {
    for (let j = 0; j < nameArray[i].length; j++) {
      roleNames.push(nameArray[i][j].name);
      roleIds.push(nameArray[i][j].id);
    }
    data.users[i].roleNames = roleNames;
    roleNames = [];
  }

  return data;
};

const deleteUser = async (id) => {
  const result = await knex('user')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'D' });
  return result;
};

const suspendUser = async (id) => {
  const result = await knex('user')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'S' });
  return result;
};

const activateUser = async (id) => {
  const result = await knex('user')
    .where({ ID: id })
    .andWhere({ STATUS: 'S' })
    .update({ STATUS: 'A' });
  return result;
};

const activateUserByToken = async (token, data) => {
  const result = await knex('user_activation_key')
    .select('EXPIRY_DATE as expire', 'USER_ID as userId')
    .where({ ACTIVATION_KEY: token });

  if (result[0].expire > new Date(Date.now())) {
    const password = await getActivation.getHashedPassword(data.newPassword);
    const id = await knex('user')
      .where({ ID: result[0].userId })
      .update({
        SALT: salt,
        PASSWORD: password,
        PASSWD_CREATED: new Date(Date.now()),
        EMAIL_VERIFIED: true,
        STATUS: 'A',
        PASSWORD_EXPIRY: new Date(Date.now() + 90 * 24 * 3600 * 1000),
        LAST_UPDATE_DATE: new Date(Date.now())
      });

    return id;
  } else {
    return 'activation key expire expired';
  }
};

const getSaltAndPassword = async (username) => {
  const result = await knex('user')
    .select('SALT as salt', 'PASSWORD as password')
    .where({ USERNAME: username });
  return result;
};

const forgotPassword = async (username) => {
  const result = await knex('user')
    .select('ID as id')
    .where({ USERNAME: username });
  if (result[0] === undefined) {
    throw new ErrorHandler(404, 'Bad request, Username not found');
  }
  const activeExpires = new Date(Date.now() + 24 * 3600 * 1000);
  const activeToken = await getActivation.getActivationKey();

  await knex('user_activation_key')
    .update({
      ACTIVATION_KEY: activeToken,
      EXPIRY_DATE: activeExpires,
      LAST_UPDATE_DATE: new Date(Date.now())
    })
    .where({ 'user_activation_key.USER_ID': result[0].id });
};

const changePassword = async (data) => {
  const salt = await getSaltAndPassword(data.userName);
  const password = await getActivation.getHashedPassword(
    data.password,
    salt[0].salt
  );

  if (!(salt[0].password === password)) {
    throw new ErrorHandler(404, 'Please enter correct password');
  }
  const newPassword = await getActivation.getHashedPassword(
    data.newPassword,
    salt[0].salt
  );

  const id = await knex('user')
    .where({ 'user.USERNAME': data.userName })
    .update({
      PASSWORD: newPassword,
      PASSWORD_EXPIRY: new Date(Date.now() + 90 * 24 * 3600 * 1000),
      LAST_UPDATE_DATE: new Date(Date.now()),
      CHANGE_PASSWD: true
    });
  return id;
};
module.exports = {
  createUser: createUser,
  listUsers: listUsers,
  deleteUser: deleteUser,
  suspendUser: suspendUser,
  activateUser: activateUser,
  activateUserByToken: activateUserByToken,
  getSalt: getSaltAndPassword,
  forgotPassword: forgotPassword,
  changePassword: changePassword
};
