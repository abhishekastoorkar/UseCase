const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);
const knex = require('../src/configs/knex');

beforeEach(async () => {
  return await knex.seed.run();
});

describe('Enterprise-routes', () => {
  // it('GET /enterprise - success', async () => {
  //   const result = await request.get('/idm/api/enterprises');
  //   expect(result.body[1]).toEqual({
  //     name: 'happiestminds',
  //     status: 'Inactive',
  //     enterpriseCode: 'irAImQC5U9NhCE',
  //     admin: [
  //       {
  //         id: 1,
  //         username: 'stevejobs@HMT',
  //         name: 'Steve Jobs',
  //         emailId: 'steve.jobs@happiestminds.com',
  //         enterpriseCode: 'XXXX-XXXX-XXXX',
  //         status: 'A',
  //         userType: 1,
  //         permissionNames: [
  //           'user_add',
  //           'user_update',
  //           'user_fetch',
  //           'role_add',
  //           'role_update',
  //           'role_fetch',
  //           'role_delete',
  //           'passwordpolicy_add',
  //           'passwordpolicy_update',
  //           'passwordpolicy_fetch',
  //           'passwordpolicy_delete',
  //           'user_add',
  //           'user_update',
  //           'user_fetch',
  //           'user_delete',
  //           'enterprise_add',
  //           'enterprise_update',
  //           'enterprise_fetch',
  //           'enterprise_delete'
  //         ],
  //         roleNames: ['ADMIN', 'MANAGER', 'TESTER']
  //       },
  //       {
  //         id: 2,
  //         username: 'elonmusk@HMT',
  //         name: 'Elon musk',
  //         emailId: 'elon.musk@happiestminds.com',
  //         enterpriseCode: 'irAImQC5U9NhCE',
  //         status: 'A',
  //         userType: 1,
  //         permissionNames: [
  //           'passwordpolicy_add',
  //           'passwordpolicy_update',
  //           'passwordpolicy_fetch',
  //           'passwordpolicy_delete',
  //           'role_update',
  //           'role_fetch',
  //           'role_delete',
  //           'passwordpolicy_add'
  //         ],
  //         roleNames: ['ENGINEER', 'ARCHITECT']
  //       },
  //       {
  //         id: 3,
  //         username: 'adamsandalr@hm-admin',
  //         name: 'happiestminds',
  //         emailId: 'adams.sandalr@happiestminds.com',
  //         enterpriseCode: 'irAImQC5U9NhCE',
  //         status: 'A',
  //         userType: 1,
  //         permissionNames: [
  //           'user_add',
  //           'user_update',
  //           'user_fetch',
  //           'user_delete',
  //           'enterprise_add',
  //           'enterprise_update',
  //           'enterprise_fetch',
  //           'enterprise_delete',
  //           'enterprise_clear',
  //           'role_add',
  //           'role_update',
  //           'role_fetch',
  //           'role_delete',
  //           'passwordpolicy_add',
  //           'passwordpolicy_update',
  //           'passwordpolicy_fetch',
  //           'passwordpolicy_delete'
  //         ],
  //         roleNames: ['ADMIN']
  //       }
  //     ]
  //   });
  // });
  // it('POST / creat enterprise - success', async () => {
  //   let body = {
  //     name: 'happiestminds',
  //     enterpriseType: 1,
  //     admin: {
  //       emailId: 'adams.sandalr@happiestminds.com',
  //       name: 'Adam sandalar',
  //       username: 'adamsandalr@hm-admin',
  //       userType: 1
  //     }
  //   };
  //   const result = await request.post('/idm/api/enterprises/root').send(body);
  //   expect(result.statusCode).toEqual(201);
  //   expect(result.body).toHaveProperty('enterpriseCode');
  // });
  // it('PUT / Activate enterprise - success', async () => {
  //   const result = await request.put('/idm/api/enterprises/2/activate');
  //   expect(result.statusCode).toEqual(200);
  //   expect(result.body).toEqual({
  //     code: 200,
  //     message: 'Enterprise activated successfully.',
  //     applicationErrorCode: 0
  //   });
  // });
  // it('PUT / Suspend enterprise - success', async () => {
  //   const result = await request.put('/idm/api/enterprises/1/suspend');
  //   expect(result.statusCode).toEqual(200);
  //   expect(result.body).toEqual({
  //     code: 200,
  //     message: 'Enterprise suspended successfully.',
  //     applicationErrorCode: 0
  //   });
  // });
  // it('PUT / Suspend enterprise - success', async () => {
  //   const result = await request.delete('/idm/api/enterprises/1/delete');
  //   expect(result.statusCode).toEqual(200);
  //   expect(result.body).toEqual({
  //     code: 200,
  //     message: 'Enterprise deleted successfully.',
  //     applicationErrorCode: 0
  //   });
  // });
});
