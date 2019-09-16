const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Roles - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Roles', () => {
    it('GET /roles --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /roles --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get roles' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /roles --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getRoles: async options => [ DATA.role ]
        }));
      } else {
        await db.models.Role.create(DATA.role);
      }

      // Arrange:
      let permissions = [ 'get roles' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Role', () => {
    it(`POST /roles --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /roles --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create role' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /roles --> There is an role with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          createRole: helpers.serviceUniqueError
        }));
      } else {
        await db.models.Role.create(DATA.role);
      }

      // Arrange:
      let permissions = [ 'create role' ];
      let data = DATA.role;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /roles --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          createRole: async values => values
        }));
      }

      // Arrange:
      let permissions = [ 'create role' ];
      let data = { ...DATA.role };
      delete data.id;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/roles`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Role', () => {
    it(`GET /roles/:role --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /roles/:role --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/roles/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /roles/:role --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getRole: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'get role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /roles/:role --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getRole: async ({ role_id, options }) => DATA.role
        }));
      } else {
        await db.models.Role.create(DATA.role);
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'get role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.role.id);
    });
  });

  describe('Updating Role', () => {
    it(`PATCH /roles/:role --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
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
    it(`PATCH /roles/:role --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'update role' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /roles/:role --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          updateRole: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'update role' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /roles/:role --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          updateRole: async ({ role_id, values, options }) => values
        }));
      } else {
        await db.models.Role.create(DATA.role);
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'update role' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Role', () => {
    it(`DELETE /roles/:role --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /roles/:role --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/roles/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /roles/:role --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          deleteRole: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'delete role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /roles/:role --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          deleteRole: async ({ role_id, options }) => ({
            id: role_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
          })
        }));
      } else {
        await db.models.Role.create(DATA.role);
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}`;
      let permissions = [ 'delete role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.role.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Permissions', () => {
    it(`GET /roles/:role/permissions --> Invalid rights`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /roles/:role/permissions --> Invalid input`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions`;
      let permissions = [ 'get permissions from role' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /roles/:role/permissions --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getPermissions: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions`;
      let permissions = [ 'get permissions from role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /roles/:role/permissions --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getPermissions: async ({ role_id, options }) => [{
            ...DATA.permission,
            RolePermission: DATA.role
          }]
        }));
      } else {
        let role = await db.models.Role.create(DATA.role);
        let permission = await db.models.Permission.create(DATA.permission);
        await role.addPermission(permission);
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}/permissions`;
      let permissions = [ 'get permissions from role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding permissions', () => {
    it(`PUT /roles/:role/permissions --> Invalid rights`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions`;
      let permissions = [ 'unknown' ];
      let data = { permissions: [] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PUT /roles/:role/permissions --> Invalid input`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions`;
      let permissions = [ 'add permissions to role' ];
      let data = { permissions: [ 'welkdnfksnksjdnf' ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PUT /roles/:role/permissions --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          addPermissions: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions`;
      let permissions = [ 'add permissions to role' ];
      let data = { permissions: [ permission_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /roles/:role/permissions --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          addPermissions: async ({ role_id, permissions }) => [
            DATA.rolePermission
          ]
        }));
      } else {
        await db.models.Role.create(DATA.role);
        await db.models.Permission.create(DATA.permission);
      }

      // Arrange:
      let endpoint = `${API_BASE}/roles/${DATA.role.id}/permissions`;
      let permissions = [ 'add permissions to role' ];
      let data = { permissions: [ DATA.permission.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].role_id).toEqual(DATA.role.id);
      expect(res.body.data[0].permission_id).toEqual(DATA.permission.id);
    });
  });

  describe('Retrieve permission', () => {
    it(`GET /roles/:role/permissions/:permission --> Invalid rights`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /roles/:role/permissions/:permission --> Invalid input`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'get permission from role' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /roles/:role/permissions/:permission --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getPermission: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'get permission from role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /roles/:role/permissions/:permission --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          getPermission: async ({ role_id, permission_id, options }) => ({
            ...DATA.permission,
            RolePermission: DATA.rolePermission
          })
        }));
      } else {
        let role = await db.models.Role.create(DATA.role);
        let permission = await db.models.Permission.create(DATA.permission);
        await role.addPermission(permission);
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'get permission from role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(permission_id);
    });
  });

  describe('Updating permission', () => {
    it(`PATCH /roles/:role/permissions/:permission --> Invalid rights`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
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
    it(`PATCH /roles/:role/permissions/:permission --> Invalid input`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'update permission from role' ];
      let data = { unknownProperty: { units: 20 } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /roles/:role/permissions/:permission --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          updatePermission: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'update permission from role' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /roles/:role/permissions/:permission --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          updatePermission: async ({ role_id, permission_id, values, options }) => ({
            role_id: role_id,
            permission_id: permission_id,
            ...values
          })
        }));
      } else {
        let role = await db.models.Role.create(DATA.role);
        let permission = await db.models.Permission.create(DATA.permission);
        await role.addPermission(permission);
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'update permission from role' ];
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

  describe('Deleting permission', () => {
    it(`DELETE /roles/:role/permissions/:permission --> Invalid rights`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'jdbjhdbdfjhb' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /roles/:role/permissions/:permission --> Invalid input`, async () => {
      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'delete permission from role' ];
      let query = { force: 'sdkjnskjnfksdjnf' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /roles/:role/permissions/:permission --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          deletePermission: helpers.serviceNotFoundError
        }));
      } else {
        await db.models.Role.create(DATA.role);
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'delete permission from role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /roles/:role/permissions/:permission --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/roles/roles-service', () => () => ({
          deletePermission: async ({ role_id, permission_id, options }) => ({
            role_id: role_id,
            permission_id: permission_id,
            deleted_at: new Date()
          })
        }));
      } else {
        let role = await db.models.Role.create(DATA.role);
        let permission = await db.models.Permission.create(DATA.permission);
        await role.addPermission(permission);
      }

      // Arrange:
      let role_id = DATA.role.id;
      let permission_id = DATA.permission.id;
      let endpoint = `${API_BASE}/roles/${role_id}/permissions/${permission_id}`;
      let permissions = [ 'delete permission from role' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.role_id).toEqual(role_id);
      expect(res.body.data.permission_id).toEqual(permission_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
