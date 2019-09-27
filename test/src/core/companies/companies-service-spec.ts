import '../../../config/global';
import { CompanyRepository } from '../../../../src/core/companies/companies-repository';
import { CompanyService } from '../../../../src/core/companies/companies-service';
import { I } from '../../../../src/core/companies/companies-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Company Service', () => {
  let database = {};
  let repository = CompanyRepository(database);
  let service:I.service = CompanyService(repository);

  beforeEach(async () => { service = CompanyService(repository); });

  describe('getCompanies', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getCompanies = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getCompanies(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of companies', async () => {
      // Setup:
      repository.getCompanies = async () => [ DATA.company ];

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getCompanies(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.company ]);
    });
  });

  describe('createCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.createCompany = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.company;

      // Act:
      const res = service.createCompany(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company created', async () => {
      // Setup:
      repository.createCompany = async () => DATA.company;

      // Arrange:
      const values = DATA.company;

      // Act:
      const res = await service.createCompany(values);

      // Assert:
      expect(res).toEqual(DATA.company);
    });
  });

  describe('getCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getCompany = async () => { throw ACTION_ERROR; };

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = service.getCompany(company_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company when is found', async () => {
      // Setup:
      repository.getCompany = async () => DATA.company;

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await service.getCompany(company_id, options);

      // Assert:
      expect(res).toEqual(DATA.company);
    });
  });

  describe('updateCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateCompany = async () => { throw ACTION_ERROR; };

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateCompany(company_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company updated when is found', async () => {
      // Setup:
      repository.updateCompany = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateCompany(company_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteCompany = async () => { throw ACTION_ERROR; };

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = service.deleteCompany(company_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company updated when is found', async () => {
      // Setup:
      repository.deleteCompany = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await service.deleteCompany(company_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
