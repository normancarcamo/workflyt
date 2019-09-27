import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { CompanyRepository } from '../../../../src/core/companies/companies-repository';

describe('Company Repository', () => {
  const database = { ...DATABASE() };
  const repository = CompanyRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getCompanies', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Company.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getCompanies(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of companies', async () => {
      // Setup:
      database.models.Company.findAll = (async () => [ DATA.company ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getCompanies(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.company ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Company.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getCompanies(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Company.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.company;

      // Act:
      const res = repository.createCompany(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company created', async () => {
      // Setup:
      database.models.Company.create = (async () => DATA.company) as any;

      // Arrange:
      const values = DATA.company;

      // Act:
      const res = await repository.createCompany(values);

      // Assert:
      expect(res).toEqual(DATA.company);
    });
  });

  describe('getCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Company.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.getCompany(company_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when company was not found', async () => {
      // Setup:
      database.models.Company.findByPk = (async () => null) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await repository.getCompany(company_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Company.findByPk = (async () => null) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.getCompany(company_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return company when is found', async () => {
      // Setup:
      database.models.Company.findByPk = (async () => DATA.company) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await repository.getCompany(company_id, options);

      // Assert:
      expect(res).toEqual(DATA.company);
    });
  });

  describe('updateCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Company.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateCompany(company_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company updated when is found', async () => {
      // Setup:
      database.models.Company.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateCompany(company_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Company.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.deleteCompany(company_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company deleted when is found', async () => {
      // Setup:
      database.models.Company.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await repository.deleteCompany(company_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });
});
