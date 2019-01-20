import { InternalError } from '@playscode/fns/lib/errors';

export default function OrderHooks(Order, sequelize) {
  Order.beforeCreate(async order => {
    if (order.code === "unset") {
      try {
        if (order.type === "installation") {
          const stmt = "SELECT last_value FROM nz.installation_order_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          order.code = `IOR${("0000000" + (last_value+1)).substr(-7,7)}`;
        } else {
          const stmt = "SELECT last_value FROM nz.work_order_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          order.code = `WOR${("0000000" + (last_value+1)).substr(-7,7)}`;
        }
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
