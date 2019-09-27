import { F } from './companies-types';

export const CompanyService:F.service = (repository) => ({
  async getCompanies (options) {
    return await repository.getCompanies(options);
  },

  async createCompany (values) {
    return await repository.createCompany(values);
  },

  async getCompany (company_id, options) {
    return await repository.getCompany(company_id, options, true);
  },

  async updateCompany (company_id, values, options) {
    return await repository.updateCompany(company_id, values, options);
  },

  async deleteCompany (company_id, options) {
    return await repository.deleteCompany(company_id, options);
  }
});
