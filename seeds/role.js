exports.seed = function (knex) {
  // Deletes ALL existing entries

  return knex('role')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('role').insert([
        {
          ID: 1,
          NAME: 'ADMIN',
          DESCRIPTION: 'Admin works',
          STATUS: 'A',
          ENTERPRISE_CODE: 'XXXX-XXXX-XXXX',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 2,
          NAME: 'MANAGER',
          DESCRIPTION: 'Operations',
          STATUS: 'A',
          ENTERPRISE_CODE: 'XXXX-XXXX-XXXX',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 3,
          NAME: 'ENGINEER',
          DESCRIPTION: 'Softwere development',
          STATUS: 'A',
          ENTERPRISE_CODE: 'XXXX-XXXX-XXXX',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 4,
          NAME: 'TESTER',
          DESCRIPTION: 'Testing Department',
          STATUS: 'A',
          ENTERPRISE_CODE: 'XXXX-XXXX-XXXX',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 5,
          NAME: 'ARCHITECT',
          DESCRIPTION: 'Design department',
          STATUS: 'A',
          ENTERPRISE_CODE: 'XXXX-XXXX-XXXX',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 6,
          NAME: 'ADMIN',
          DESCRIPTION: '',
          STATUS: 'A',
          ENTERPRISE_CODE: 'irAImQC5U9NhCE',
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        }
      ]);
    });
};
