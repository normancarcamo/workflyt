import { InternalError } from '@playscode/fns/lib/errors';

export default function UserHooks(User, sequelize) {
  User.beforeCreate(async user => {
    if (user.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.user_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        user.code = `USR${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
