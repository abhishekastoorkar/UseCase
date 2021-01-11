const dbOptions = require('../configs/db.config');
const knex = require('knex')(dbOptions.options);
const { ErrorHandler } = require('../helper/error');

const createpassword = async (data) => {
  try {
    await knex.transaction(async (trx) => {
      const id = await trx('password_policy').insert({
        POLICY_NAME: data.policyName,
        STATUS: 'S',
        DESCRIPTION: data.description,
        ENTERPRISE_CODE: 'xxxx-xxxx-xxxx'
      });

      for (const key in data) {
        if (key === 'policyName' || key === 'description') {
          continue;
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

const getPasswordPolicies = async () => {
  const result = await knex('password_policy')
    .select(
      'password_policy.ID as policyId',
      'password_policy.POLICY_NAME as policyName',
      'password_Policy.DESCRIPTION as description',
      'password_policy.STATUS as status'
    )
    .whereNot({ 'PASSWORD_POLICY.STATUS': 'D' });

  const getData = async (id) => {
    const result = await knex('password_policy_attr')
      .select(
        'password_policy_attr.ATTR_NAME as name',
        'password_policy_attr.ATTR_VALUE as value'
      )
      .where({ POLICY_ID: id });

    return result;
  };

  for (let i = 0; i < result.length; i++) {
    console.log(result[i].policyId);
    const data = await getData(result[i].policyId);
    for (let j = 0; j < data.length; j++) {
      result[i][data[j].name] = data[j].value;
    }
    if (result[i].status === 'S') {
      result[i].status = 'Inactive';
    } else {
      result[i].status = 'Active';
    }
  }

  return result;
};

const activatePasswordPolicy = async (id) => {
  const result = await knex('password_policy')
    .where({ ID: id })
    .andWhere({ STATUS: 'S' })
    .update({ STATUS: 'A' });
  return result;
};

const deActivatePasswordPolicy = async (id) => {
  const result = await knex('password_policy')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'S' });
  return result;
};

const deletePasswordPolicy = async (id) => {
  const result = await knex('password_policy')
    .where({ ID: id })
    .andWhere({ STATUS: 'A' })
    .update({ STATUS: 'D' });
  return result;
};

const updatePasswordPolicy = async (data) => {
  const result = await knex('password_policy')
    .select('ID as id')
    .where({ POLICY_NAME: data.policyName });
  if (result[0] === undefined) {
    throw new ErrorHandler(404, 'Bad request, result not found');
  }
  await knex('password_policy_attr').where({ POLICY_ID: result[0].id }).del();

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
