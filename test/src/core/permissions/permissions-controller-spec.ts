import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Permissions - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Permissions', () => {
    it('GET /permissions --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            getPermissions: async (options?:object) => [ DATA.permission ]
          })
        }));
      } else {
        await db.models.Permission.create(DATA.permission);
      }

      // Arrange:
      let permissions = [ 'get permissions' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Permission', () => {
    it(`POST /permissions --> There is an permission with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            createPermission: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Permission.create(DATA.permission);
      }

      // Arrange:
      let permissions = [ 'create permission' ];
      let data = DATA.permission;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /permissions --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            createPermission: async (values:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create permission' ];
      let data = DATA.permission;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Permission', () => {
    it(`GET /permissions/:permission --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            getPermission: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'get permission' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /permissions/:permission --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            getPermission: async (permission_id:string, options?:object) => DATA.permission
          })
        }));
      } else {
        await db.models.Permission.create(DATA.permission);
      }

      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'get permission' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.permission.id);
    });
  });

  describe('Updating Permission', () => {
    it(`PATCH /permissions/:permission --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            updatePermission: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'update permission' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /permissions/:permission --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            updatePermission: async (permission_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Permission.create(DATA.permission);
      }

      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'update permission' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Permission', () => {
    it(`DELETE /permissions/:permission --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            deletePermission: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'delete permission' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /permissions/:permission --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => ({
          PermissionService: () => ({
            deletePermission: async (permission_id:string, options?:object) => ({
              id: permission_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Permission.create(DATA.permission);
      }

      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'delete permission' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.permission.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
