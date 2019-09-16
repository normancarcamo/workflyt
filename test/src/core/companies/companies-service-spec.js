const Repository = require('src/core/companies/companies-repository');
const Service = require('src/core/companies/companies-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Company Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getCompanies', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getCompanies').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getCompanies(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of companies', async () => {
      // Setup:
      jest.spyOn(repository, 'getCompanies').mockResolvedValue([ DATA.company ]);

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
      jest.spyOn(repository, 'createCompany').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.company;

      // Act:
      const res = service.createCompany(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company created', async () => {
      // Setup:
      jest.spyOn(repository, 'createCompany').mockResolvedValue(DATA.company);

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
      jest.spyOn(repository, 'getCompany').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = service.getCompany({ company_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getCompany').mockResolvedValue(DATA.company);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await service.getCompany({ company_id, options });

      // Assert:
      expect(res).toEqual(DATA.company);
    });
  });

  describe('updateCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateCompany').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateCompany({ company_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateCompany').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateCompany({ company_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteCompany', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteCompany').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = service.deleteCompany({ company_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteCompany').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await service.deleteCompany({ company_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
