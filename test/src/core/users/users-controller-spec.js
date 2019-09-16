const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Users - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Users', () => {
    it('GET /users --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /users --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get users' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /users --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getUsers: async options => [ DATA.user ]
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let permissions = [ 'get users' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating User', () => {
    it(`POST /users --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /users --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create user' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /users --> There is an user with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          createUser: jest.fn().mockRejectedValue(new Error('Forbidden'))
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let permissions = [ 'create user' ];
      let data = DATA.user;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /users --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          createUser: async values => values
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let permissions = [ 'create user' ];
      let data = { ...DATA.user };
      delete data.id;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/users`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving User', () => {
    it(`GET /users/:user --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /users/:user --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/users/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /users/:user --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getUser: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'get user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /users/:user --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getUser: async ({ user_id, options }) => DATA.user
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'get user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.user.id);
    });
  });

  describe('Updating User', () => {
    it(`PATCH /users/:user --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'unknown privilege' ];
      let data = { name: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /users/:user --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'update user' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /users/:user --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          updateUser: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'update user' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /users/:user --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          updateUser: async ({ user_id, values, options }) => values
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'update user' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting User', () => {
    it(`DELETE /users/:user --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /users/:user --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/users/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /users/:user --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          deleteUser: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'delete user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /users/:user --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          deleteUser: async ({ user_id, options }) => ({
            id: user_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}`;
      let permissions = [ 'delete user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.user.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Roles', () => {
    it(`GET /users/:user/roles --> Invalid rights`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /users/:user/roles --> Invalid input`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles`;
      let permissions = [ 'get roles from user' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /users/:user/roles --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getRoles: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let user_id = DATA.user.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles`;
      let permissions = [ 'get roles from user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /users/:user/roles --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getRoles: async ({ user_id, options }) => [{
            ...DATA.role,
            UserRole: DATA.user
          }]
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let user = await db.models.User.create(DATA.user);
        let role = await db.models.Role.create(DATA.role);
        await user.addRole(role);
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}/roles`;
      let permissions = [ 'get roles from user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding roles', () => {
    it(`PUT /users/:user/roles --> Invalid rights`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles`;
      let permissions = [ 'unknown' ];
      let data = { roles: [] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PUT /users/:user/roles --> Invalid input`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles`;
      let permissions = [ 'add roles to user' ];
      let data = { roles: [ 'welkdnfksnksjdnf' ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PUT /users/:user/roles --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          addRoles: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles`;
      let permissions = [ 'add roles to user' ];
      let data = { roles: [ role_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /users/:user/roles --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          addRoles: async ({ user_id, roles }) => [
            DATA.userRole
          ]
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.Role.create(DATA.role);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let endpoint = `${API_BASE}/users/${DATA.user.id}/roles`;
      let permissions = [ 'add roles to user' ];
      let data = { roles: [ DATA.role.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].user_id).toEqual(DATA.user.id);
      expect(res.body.data[0].role_id).toEqual(DATA.role.id);
    });
  });

  describe('Retrieve role', () => {
    it(`GET /users/:user/roles/:role --> Invalid rights`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /users/:user/roles/:role --> Invalid input`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'get role from user' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /users/:user/roles/:role --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getRole: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'get role from user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /users/:user/roles/:role --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          getRole: async ({ user_id, role_id, options }) => ({
            ...DATA.role,
            UserRole: DATA.userRole
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let role = await db.models.Role.create(DATA.role);
        let user = await db.models.User.create(DATA.user);
        await user.addRole(role);
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'get role from user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(role_id);
    });
  });

  describe('Updating role', () => {
    it(`PATCH /users/:user/roles/:role --> Invalid rights`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'jdsnkjnsfkj' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /users/:user/roles/:role --> Invalid input`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'update role from user' ];
      let data = { unknownProperty: { units: 20 } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /users/:user/roles/:role --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          updateRole: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'update role from user' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /users/:user/roles/:role --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          updateRole: async ({ user_id, role_id, values, options }) => ({
            user_id: user_id,
            role_id: role_id,
            ...values
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let role = await db.models.Role.create(DATA.role);
        let user = await db.models.User.create(DATA.user);
        await user.addRole(role);
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'update role from user' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting role', () => {
    it(`DELETE /users/:user/roles/:role --> Invalid rights`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'jdbjhdbdfjhb' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /users/:user/roles/:role --> Invalid input`, async () => {
      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'delete role from user' ];
      let query = { force: 'sdkjnskjnfksdjnf' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /users/:user/roles/:role --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          deleteRole: helpers.serviceNotFoundError
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let role = await db.models.Role.create(DATA.role);
        let user = await db.models.User.create(DATA.user);
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'delete role from user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /users/:user/roles/:role --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => () => ({
          deleteRole: async ({ user_id, role_id, options }) => ({
            user_id: user_id,
            role_id: role_id,
            deleted_at: new Date()
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let role = await db.models.Role.create(DATA.role);
        let user = await db.models.User.create(DATA.user);
        await user.addRole(role);
      }

      // Arrange:
      let user_id = DATA.user.id;
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/users/${user_id}/roles/${role_id}`;
      let permissions = [ 'delete role from user' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.user_id).toEqual(user_id);
      expect(res.body.data.role_id).toEqual(role_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
