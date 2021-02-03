exports.seed = function (knex) {
  // Deletes ALL existing entries

  return knex('enterprise')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('enterprise').insert([
        {
          ID: 1,
          NAME: 'Happiestminds',
          STATUS: 'A',
          ENTERPRISE_CODE: 'xxxx-yyyy-zzzz',
          ENTERPRISE_TYPE: 1,
          CREATE_DATE: '2021-01-04 19:14:42',
          LAST_UPDATE_DATE: '2021-01-06 09:14:42'
        },
        {
          ID: 2,
          NAME: 'DBS',
          STATUS: 'S',
          ENTERPRISE_CODE: 'xxx1-yyy1-zzz1',
          ENTERPRISE_TYPE: 1,
          CREATE_DATE: '2021-01-05 19:14:42',
          LAST_UPDATE_DATE: '2021-01-07 09:14:42'
        }
      ]);
    });
};
