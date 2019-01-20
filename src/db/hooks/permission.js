import { InternalError } from '@playscode/fns/lib/errors';

export default function PermissionHooks(Permission, sequelize) {
  Permission.beforeCreate(async permission => {
    if (permission.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.permission_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        permission.code = `PRM${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
