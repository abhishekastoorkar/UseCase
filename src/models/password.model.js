const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const { ErrorHandler } = require('../helper/error'); //** to handle run time errors*/

// create new password policy and save in database
const createpassword = async (data) => {
  // inserting related data in 'password_policy' table
  try {
    await knex.transaction(async (trx) => {
      const id = await trx('password_policy').insert({
        POLICY_NAME: data.policyName,
        STATUS: 'S',
        DESCRIPTION: data.description,
        ENTERPRISE_CODE: 'xxxx-xxxx-xxxx'
      });

      // adding policy attributes in another table 'password_policy_attr' table
      for (const key in data) {
        if (key === 'policyName' || key === 'description') {
          continue; /** skipping policyName and description to
                        be inserted into password_policy_attr table */
        } else {
          await trx('password_policy_attr').insert({
            POLICY_ID: id,
            ATTR_NAME: key,
            ATTR_VALUE: data[key]
          });
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

// fetch all password policies
const getPasswordPolicies = async () => {
  const result = await knex('password_policy')
    .select(
      'password_policy.ID as policyId',
      'password_policy.POLICY_NAME as policyName',
      'password_Policy.DESCRIPTION as description',
      'password_policy.STATUS as status'
    )
    .whereNot({
      'PASSWORD_POLICY.STATUS': 'D'
    }); /** skipping deleted password policies */

  // fetching required data from password_policy_attr by policy id
  const getData = async (id) => {
    const result = await knex('password_policy_attr')
      .select(
        'password_policy_attr.ATTR_NAME as name',
        'password_policy_attr.ATTR_VALUE as value'
      )
      .where({ POLICY_ID: id });
    return result;
  };

  // formatting data as per required response
  for (let i = 0; i < result.length; i++) {
    // getting attribute names and attribute values for every policy id
    const data = await getData(result[i].policyId);
    // pairing attribute name and value and storing in result
    for (let j = 0; j < data.length; j++) {
      result[i][data[j].name] = data[j].value;
    }
    // checking status og password policy and replacing with proper string
    if (result[i].status === 'S') {
      result[i].status = 'Inactive';
    } else {
      result[i].status = 'Active';
    }
  }
  if (!result.length) {
    throw new ErrorHandler('404', 'resource not found');
  }
  return result;
};

// activate Password Policy by id and if status is suspended
const activatePasswordPolicy = async (id) => {
  const result = await knex('password_policy')
    .where({ ID: id })
    .andWhere({ STATUS: 'S' })
    .update({ STATUS: 'A' });
  return result;
};

// de-activate Password Policy by id and if status is active
const deActivatePasswordPolicy = async (id) => {
  const result = await knex('password_policy')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'S' });
  return result;
};

// delete Password Policy by id
const deletePasswordPolicy = async (id) => {
  const result = await knex('password_policy')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'D' });
  return result;
};

// update password policy and save in database
const updatePasswordPolicy = async (data) => {
  const result = await knex('password_policy')
    .select('ID as id')
    .where({ POLICY_NAME: data.policyName });
  // if requested id does not exist send client error
  if (!result.length) {
    throw new ErrorHandler(404, 'Bad request, result not found');
  }
  // deleting existing  policy attributes for given policy id
  await knex('password_policy_attr').where({ POLICY_ID: result[0].id }).del();

  // adding new updated policy attributes
  for (const key in data) {
    if (key === 'policyName' || key === 'description') {
      continue;
    } else {
      await knex('password_policy_attr').insert({
        POLICY_ID: result[0].id,
        ATTR_NAME: key,
        ATTR_VALUE: data[key]
      });
    }
  }
};

module.exports = {
  createpassword: createpassword,
  getPasswordPolicies: getPasswordPolicies,
  activatePasswordPolicy: activatePasswordPolicy,
  deActivatePasswordPolicy: deActivatePasswordPolicy,
  deletePasswordPolicy: deletePasswordPolicy,
  updatePasswordPolicy: updatePasswordPolicy
};
