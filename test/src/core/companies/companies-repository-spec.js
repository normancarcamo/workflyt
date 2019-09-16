const Repository = require('src/core/companies/companies-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Company Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getCompanies', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getCompanies(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of companies', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findAll')
        .mockResolvedValue([ DATA.company ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getCompanies(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.company ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Company, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.company;

      // Act:
      const res = repository.createCompany(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company created', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'create')
        .mockResolvedValue(DATA.company);

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
      jest.spyOn(database.models.Company, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.getCompany({ company_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when company was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await repository.getCompany({ company_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.getCompany({ company_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return company when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk')
        .mockResolvedValue(DATA.company);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await repository.getCompany({ company_id, options });

      // Assert:
      expect(res).toEqual(DATA.company);
    });
  });

  describe('updateCompany', () => {
    it('should throw error when company was not found', () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateCompany({ company_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateCompany({ company_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const company_id = DATA.company.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateCompany({ company_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteCompany', () => {
    it('should throw error when company was not found', () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.deleteCompany({ company_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = repository.deleteCompany({ company_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return company deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Company, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const company_id = DATA.company.id;
      const options = {};

      // Act:
      const res = await repository.deleteCompany({ company_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });
});
