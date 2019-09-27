import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Users - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Users', () => {
    it('GET /users --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getUsers: async (options?:object) => [ DATA.user ]
          })
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
    it(`POST /users --> There is an user with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            createUser: async () => { throw new Error('Forbidden'); }
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            createUser: async (values:object) => values
          })
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
    it(`GET /users/:user --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getUser: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getUser: async (user_id:string, options?:object) => DATA.user
          })
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
    it(`PATCH /users/:user --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            updateUser: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            updateUser: async (user_id:string, values:object, options?:object) => values
          })
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
    it(`DELETE /users/:user --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            deleteUser: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            deleteUser: async (user_id:string, options?:object) => ({
              id: user_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
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
    it(`GET /users/:user/roles --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getRoles: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getRoles: async (user_id:string, options?:object) => [{
              ...DATA.role,
              UserRole: DATA.user
            }]
          })
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
    it(`PUT /users/:user/roles --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            addRoles: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            addRoles: async (user_id:string, roles:string[]) => [ DATA.userRole ]
          })
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
    it(`GET /users/:user/roles/:role --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getRole: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            getRole: async (user_id:string, role_id:string, options?:object) => ({
              ...DATA.role,
              UserRole: DATA.userRole
            })
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
    it(`PATCH /users/:user/roles/:role --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            updateRole: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            updateRole: async (user_id:string, role_id:string, values:object, options?:object) => ({
              user_id: user_id,
              role_id: role_id,
              ...values
            })
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
    it(`DELETE /users/:user/roles/:role --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            deleteRole: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/users/users-service', () => ({
          UserService: () => ({
            deleteRole: async (user_id:string, role_id:string, options?:object) => ({
              user_id: user_id,
              role_id: role_id,
              deleted_at: new Date()
            })
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
