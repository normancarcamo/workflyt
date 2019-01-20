import { InternalError } from '@playscode/fns/lib/errors';

export default function SupplierHooks(Supplier, sequelize) {
  Supplier.beforeCreate(async supplier => {
    if (supplier.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.supplier_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        supplier.code = `SPL${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
