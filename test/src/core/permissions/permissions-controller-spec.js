const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Permissions - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Permissions', () => {
    it('GET /permissions --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /permissions --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get permissions' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /permissions --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          getPermissions: async options => [ DATA.permission ]
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
    it(`POST /permissions --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /permissions --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create permission' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/permissions`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /permissions --> There is an permission with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          createPermission: helpers.serviceUniqueError
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
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          createPermission: async values => values
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
    it(`GET /permissions/:permission --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /permissions/:permission --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/permissions/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get permission' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /permissions/:permission --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          getPermission: helpers.serviceNotFoundError
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
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          getPermission: async ({ permission_id, options }) => DATA.permission
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
    it(`PATCH /permissions/:permission --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
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
    it(`PATCH /permissions/:permission --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'update permission' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /permissions/:permission --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          updatePermission: helpers.serviceNotFoundError
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
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          updatePermission: async ({ permission_id, values, options }) => values
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
    it(`DELETE /permissions/:permission --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/permissions/${DATA.permission.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /permissions/:permission --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/permissions/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete permission' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /permissions/:permission --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          deletePermission: helpers.serviceNotFoundError
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
        jest.doMock('src/core/permissions/permissions-service', () => () => ({
          deletePermission: async ({ permission_id, options }) => ({
            id: permission_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
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
