import { InternalError } from '@playscode/fns/lib/errors';

export default function RoleHooks(Role, sequelize) {
  Role.beforeCreate(async role => {
    if (role.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.role_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        role.code = `ROL${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
