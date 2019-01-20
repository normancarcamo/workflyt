import { InternalError } from '@playscode/fns/lib/errors';

export default function DepartmentHooks(Department, sequelize) {
  Department.beforeCreate(async department => {
    if (department.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.department_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        department.code = `DEP${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
