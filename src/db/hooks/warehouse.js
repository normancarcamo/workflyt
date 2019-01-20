import { InternalError } from '@playscode/fns/lib/errors';

export default function WarehouseHooks(Warehouse, sequelize) {
  Warehouse.beforeCreate(async warehouse => {
    if (warehouse.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.warehouse_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        warehouse.code = `WRH${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
