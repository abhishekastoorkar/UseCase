const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const getActivation = require('../helper/activationToken');

const { ErrorHandler } = require('../helper/error');

// create new user and save to database
const createUser = async (data) => {
  const roleId = [];
  let inserts;

  // inserting user data
  try {
    await knex.transaction(async (trx) => {
      const ids = await trx('user').insert({
        NAME: data.name,
        USERNAME: data.username,
        EMAIL_ID: data.emailId,
        ENTERPRISE_CODE: data.enterpriseCode,
        USER_TYPE: data.userType
      });

      // inserting all roles for individual user
      for (let i = 0; i < data.roles.length; i++) {
        const id = await knex('role')
          .select('role.ID')
          .where({ NAME: data.roles[i] });
        roleId.push(id[0].ID);
      }

      // inserting role id's for each users
      for (let i = 0; i < roleId.length; i++) {
        inserts = await trx('user_roles').insert({
          USER_ID: ids,
          ROLE_ID: roleId[i]
        });
      }

      // generate activation token expiry
      const activeExpires = new Date(Date.now() + 24 * 3600 * 1000);
      // generate activation token
      const activeToken = await getActivation.getActivationKey();

      // inserting activation token for user
      await knex('user_activation_key').insert({
        USER_ID: ids,
        ACTIVATION_KEY: activeToken,
        EXPIRY_DATE: activeExpires
      });
    });
  } catch (error) {
    throw error;
  }
};

// fetch all users from database
const listUsers = async () => {
  const nameArray = [];
  let roleNames = [];
  const roleIds = [];

  // retrieving user data and grouping the role id and permission names for each user id
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

  // formating the result according to required response
  for (let i = 0; i < result.length; i++) {
    result[i].permissionNames = result[i].permissionNames.split(',');
  }

  // adding result to resposne object
  const data = { users: result };

  // fetch role name for role id
  const getRoleName = async (id) => {
    const roleName = await knex.raw(
      `select ID as id, NAME as name, STATUS as status from role where FIND_IN_SET(ID, '${id}')`
    );
    return roleName[0];
  };

  for (let i = 0; i < result.length; i++) {
    // creating array of role id for each user
    const id = result[i].roles.split(',');
    const names = await getRoleName(id);
    nameArray.push(names);
    // adding all role names for each user
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

// delete a user by id
const deleteUser = async (id) => {
  const result = await knex('user')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'D' });
  return result;
};

// suspend a user by id
const suspendUser = async (id) => {
  const result = await knex('user')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'S' });
  return result;
};

// activate a user by id
const activateUser = async (id) => {
  const result = await knex('user')
    .where({ ID: id })
    .andWhere({ STATUS: 'S' })
    .update({ STATUS: 'A' });
  return result;
};

// activate a user by token
const activateUserByToken = async (token, data) => {
  // fetching axpiry date and user id by activation token
  const result = await knex('user_activation_key')
    .select('EXPIRY_DATE as expire', 'USER_ID as userId')
    .where({ ACTIVATION_KEY: token });

  // checking expiry of token by comapairing expiry date
  if (result[0].expire > new Date(Date.now())) {
    // generate salt
    const salt = await getActivation.genRandomString(16);
    // generating hash password from user entered password
    const password = await getActivation.getHashedPassword(
      data.newPassword,
      salt
    );

    // insert salt and hash password into user table
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

// generate a salt for a user
const getSaltAndPassword = async (username) => {
  const result = await knex('user')
    .select('SALT as salt', 'PASSWORD as password')
    .where({ USERNAME: username });
  return result;
};

// to handle forgot password request
const forgotPassword = async (username) => {
  // fetch user id and check for valid username
  const result = await knex('user')
    .select('ID as id')
    .where({ USERNAME: username });

  if (!result.length) {
    throw new ErrorHandler(404, 'Bad request, Username not found');
  }
  // generate a activation token and expiry date
  const activeExpires = new Date(Date.now() + 24 * 3600 * 1000);
  const activeToken = await getActivation.getActivationKey();

  // insert token in to table
  await knex('user_activation_key')
    .update({
      ACTIVATION_KEY: activeToken,
      EXPIRY_DATE: activeExpires,
      LAST_UPDATE_DATE: new Date(Date.now())
    })
    .where({ 'user_activation_key.USER_ID': result[0].id });
};

// to change a password
const changePassword = async (data, username) => {
  //get salt for specific username
  const salt = await getSaltAndPassword(username);
  // check for valid username
  if (!salt.length) {
    throw new ErrorHandler(404, 'Invalid username');
  }
  // generate hashed password from user entered password
  const password = await getActivation.getHashedPassword(
    data.password,
    salt[0].salt
  );

  // match hashed password and passowrd stored from database
  if (!(salt[0].password === password)) {
    throw new ErrorHandler(404, 'Please enter correct password');
  }
  // create an new hashed password
  const newPassword = await getActivation.getHashedPassword(
    data.newPassword,
    salt[0].salt
  );

  // store new hased password and expiry in database
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

// retrieve all users with respect to enterprise
const listEnterpriseUsers = async (enterpriseCode) => {
  const nameArray = [];
  let roleNames = [];
  const roleIds = [];

  // fetch user details by enterprise code
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
    .andWhere({ 'user.ENTERPRISE_CODE': enterpriseCode })
    .groupBy('user.ID');

  // formating the result according to required response
  for (let i = 0; i < result.length; i++) {
    result[i].permissionNames = result[i].permissionNames.split(',');
  }
  const data = { users: result };
  // fetch role name for role id
  const getRoleName = async (id) => {
    const roleName = await knex.raw(
      `select ID as id, NAME as name, STATUS as status from role where FIND_IN_SET(ID, '${id}')`
    );
    return roleName[0];
  };

  for (let i = 0; i < result.length; i++) {
    // creating array of role id for each user
    const id = result[i].roles.split(',');
    const names = await getRoleName(id);
    nameArray.push(names);
    // adding all role names for each user
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

// get all users who are already logged-in
const getLoggedInUser = async (currentDate) => {
  const nameArray = [];
  let roleNames = [];
  const roleIds = [];
  // fetch all users who are already logged in
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
    .andWhere(
      'user.LAST_LOGIN_DATE',
      '<',
      currentDate
    ) /** checking last login date and time smaller than current*/
    .groupBy('user.ID');

  for (let i = 0; i < result.length; i++) {
    result[i].permissionNames = result[i].permissionNames.split(',');
  }
  const data = { users: result };
  const getRoleName = async (id) => {
    const roleName = await knex.raw(
      `select ID as id, NAME as name, STATUS as status from role where FIND_IN_SET(ID, '${id}')`
    );
    return roleName[0];
  };

  for (let i = 0; i < result.length; i++) {
    const id = result[i].roles.split(',');
    const names = await getRoleName(id);
    nameArray.push(names);
    // adding all role names for each user
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

// to authenticate the user and generate auth token
const authenticateUser = async (data) => {
  // get salt for specific username
  const salt = await getSaltAndPassword(data.userName);
  // check for valid username
  if (!salt.length) {
    throw new ErrorHandler(404, 'Invalid username');
  }
  // generate hashed password from user entered password
  const password = await getActivation.getHashedPassword(
    data.password,
    salt[0].salt
  );

  // match hashed password and passowrd stored from database
  if (!(salt[0].password === password)) {
    throw new ErrorHandler(404, 'Please enter correct password');
  }

  const expiry = '1800s'; /** expiry for jwt token */
  // generate jwt token
  function generateAccessToken(username, exp) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: exp.exp });
  }

  const token = generateAccessToken(
    { username: data.userName },
    { exp: expiry }
  );

  // fetch user data from user table
  const result = await knex('user')
    .select(
      'user.ENTERPRISE_CODE as enterpriseCode',
      'user.USER_TYPE as userType',
      'user.LAST_LOGIN_DATE as lastLoginDate'
    )
    .where({ 'user.USERNAME': data.userName });

  // formatting response object
  const authUser = {};
  authUser.token = token;
  authUser.enterpriseCode = result[0].enterpriseCode;
  authUser.userType = result[0].userType;
  authUser.lastLoginDate = result[0].lastLoginDate.getTime();
  authUser.expiration = expiry.replace('s', '');

  return authUser;
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
  changePassword: changePassword,
  listEnterpriseUsers: listEnterpriseUsers,
  getLoggedInUser: getLoggedInUser,
  authenticateUser: authenticateUser
};
