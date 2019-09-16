module.exports = ({ database }) => ({
  async getCompanies (options) {
    return await database.models.Company.findAll(options);
  },

  async createCompany (values) {
    return await database.models.Company.create(values);
  },

  async getCompany ({ company_id, options }, assert) {
    let company = await database.models.Company.findByPk(
      company_id,
      database.queryBuilder(options)
    );

    if (assert && !company) {
      throw new Error('Not found');
    } else {
      return company;
    }
  },

  async updateCompany ({ company_id, values, options }) {
    let company = await this.getCompany({ company_id }, true);
    return await company.update(values, options);
  },

  async deleteCompany ({ company_id, options }) {
    let company = await this.getCompany({ company_id }, true);
    return await company.destroy(options);
  }
});
