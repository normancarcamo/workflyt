const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Companies - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Companies', () => {
    it('GET /companies --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /companies --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get companies' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /companies --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          getCompanies: async options => [ DATA.company ]
        }));
      } else {
        await db.models.Company.create(DATA.company);
      }

      // Arrange:
      let permissions = [ 'get companies' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Company', () => {
    it(`POST /companies --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /companies --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create company' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /companies --> There is an company with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          createCompany: helpers.serviceUniqueError
        }));
      } else {
        await db.models.Company.create(DATA.company);
      }

      // Arrange:
      let permissions = [ 'create company' ];
      let data = DATA.company;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /companies --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          createCompany: async values => values
        }));
      }

      // Arrange:
      let permissions = [ 'create company' ];
      let data = DATA.company;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/companies`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Company', () => {
    it(`GET /companies/:company --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /companies/:company --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/companies/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get company' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /companies/:company --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          getCompany: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'get company' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /companies/:company --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          getCompany: async ({ company_id, options }) => DATA.company
        }));
      } else {
        await db.models.Company.create(DATA.company);
      }

      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'get company' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.company.id);
    });
  });

  describe('Updating Company', () => {
    it(`PATCH /companies/:company --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
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
    it(`PATCH /companies/:company --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'update company' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /companies/:company --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          updateCompany: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'update company' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /companies/:company --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          updateCompany: async ({ company_id, values, options }) => values
        }));
      } else {
        await db.models.Company.create(DATA.company);
      }

      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'update company' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Company', () => {
    it(`DELETE /companies/:company --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /companies/:company --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/companies/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete company' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /companies/:company --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          deleteCompany: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'delete company' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /companies/:company --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => () => ({
          deleteCompany: async ({ company_id, options }) => ({
            id: company_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
          })
        }));
      } else {
        await db.models.Company.create(DATA.company);
      }

      // Arrange:
      let endpoint = `${API_BASE}/companies/${DATA.company.id}`;
      let permissions = [ 'delete company' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.company.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
