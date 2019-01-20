import { InternalError } from '@playscode/fns/lib/errors';

export default function CompanyHooks(Company, sequelize) {
  Company.beforeCreate(async company => {
    if (company.code === 'unset') {
      try {
        const stmt = "SELECT last_value FROM nz.company_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        company.code = `CMP${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
