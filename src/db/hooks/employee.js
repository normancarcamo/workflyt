import { InternalError } from '@playscode/fns/lib/errors';

export default function EmployeeHooks(Employee, sequelize) {
  Employee.beforeCreate(async employee => {
    if (employee.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.employee_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        employee.code = `EMP${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
