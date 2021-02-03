exports.seed = function (knex) {
  // Deletes ALL existing entries

  return knex('password_policy_attr')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('password_policy_attr').insert([
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: 1,
          ATTR_NAME: 'PASSWORD_MIN_NUMERIC_CHARS',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: 1,
          ATTR_NAME: 'PASSWORD_MIN_UPPERCASE_CHARS',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: 3,
          ATTR_NAME: 'PASSWORD_MIN_LOWERCASE_CHARS',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: 1,
          ATTR_NAME: 'PASSWORD_MIN_SPECIAL_CHARS',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: 3,
          ATTR_NAME: 'PASSWORD_HISTORY_LENGTH',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: '~!@#$%^*&;?._',
          ATTR_NAME: 'PASSWORD_SPECIAL_CHARS',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 1,
          POLICY_ID: 1,
          ATTR_VALUE: 0,
          ATTR_NAME: 'PASSWORD_AGE',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        }
      ]);
    });
};
