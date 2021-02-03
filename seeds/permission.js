exports.seed = function (knex) {
  // Deletes ALL existing entries

  return knex('permission')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('permission').insert([
        {
          ID: 1,
          NAME: 'user_add',
          DESCRIPTION: 'Add User',
          FEATURE: 'user',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 2,
          NAME: 'user_update',
          DESCRIPTION: 'Update User',
          FEATURE: 'user',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 3,
          NAME: 'user_fetch',
          DESCRIPTION: 'Fetch User Details',
          FEATURE: 'user',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 4,
          NAME: 'user_delete',
          DESCRIPTION: 'Delete User',
          FEATURE: 'user',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 5,
          NAME: 'enterprise_add',
          DESCRIPTION: 'Add Enterprise',
          FEATURE: 'enterprise',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 6,
          NAME: 'enterprise_update',
          DESCRIPTION: 'Update Enterprise',
          FEATURE: 'enterprise',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 7,
          NAME: 'enterprise_fetch',
          DESCRIPTION: 'Fetch Enterprise Details',
          FEATURE: 'enterprise',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 8,
          NAME: 'enterprise_delete',
          DESCRIPTION: 'Delete Enterprise',
          FEATURE: 'enterprise',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 9,
          NAME: 'enterprise_clear',
          DESCRIPTION: 'Clear Organisation Data',
          FEATURE: 'enterprise',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 10,
          NAME: 'role_add',
          DESCRIPTION: 'Add Role',
          FEATURE: 'role',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 11,
          NAME: 'role_update',
          DESCRIPTION: 'Update Role',
          FEATURE: 'role',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 12,
          NAME: 'role_fetch',
          DESCRIPTION: 'Fetch Role Details',
          FEATURE: 'role',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 13,
          NAME: 'role_delete',
          DESCRIPTION: 'Delete Role',
          FEATURE: 'role',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 14,
          NAME: 'passwordpolicy_add',
          DESCRIPTION: 'Add Password Policy',
          FEATURE: 'passwordpolicy',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 15,
          NAME: 'passwordpolicy_update',
          DESCRIPTION: 'Update Password Policy',
          FEATURE: 'passwordpolicy',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 16,
          NAME: 'passwordpolicy_fetch',
          DESCRIPTION: 'Fetch Password Policy',
          FEATURE: 'passwordpolicy',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        },
        {
          ID: 17,
          NAME: 'passwordpolicy_delete',
          DESCRIPTION: 'Delete Password Policy',
          FEATURE: 'passwordpolicy',
          TYPE: 0,
          STATUS: 'X',
          CREATE_DATE: '2020-12-14 10:22:38',
          LAST_UPDATE_DATE: '2020-12-14 10:22:38'
        }
      ]);
    });
};
