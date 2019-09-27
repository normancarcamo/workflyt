import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Companies - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Companies', () => {
    it('GET /companies --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            getCompanies: async () => [ DATA.company ]
          })
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
    it(`POST /companies --> There is an company with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            createCompany: helpers.serviceUniqueError
          })
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
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            createCompany: async (values:object) => values
          })
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
    it(`GET /companies/:company --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            getCompany: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            getCompany: async (company_id:string, options?:object) => DATA.company
          })
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
    it(`PATCH /companies/:company --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            updateCompany: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            updateCompany: async (company_id:string, values:object, options?:object) => values
          })
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
    it(`DELETE /companies/:company --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            deleteCompany: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/companies/companies-service', () => ({
          CompanyService: () => ({
            deleteCompany: async (company_id:string, options?:object) => ({
              id: company_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
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
