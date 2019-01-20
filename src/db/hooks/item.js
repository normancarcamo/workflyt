import { InternalError } from '@playscode/fns/lib/errors';

export default function ItemHooks(Item, sequelize) {
  Item.beforeCreate(async item => {
    if (item.code === "unset") {
      try {
        if (item.type === "material") {
          const stmt = "SELECT last_value FROM nz.material_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          item.code = `MTR${("0000000" + (last_value+1)).substr(-7,7)}`;
        } else if (item.type === "service") {
          const stmt = "SELECT last_value FROM nz.service_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          item.code = `SRV${("0000000" + (last_value+1)).substr(-7,7)}`;
        } else {
          const stmt = "SELECT last_value FROM nz.product_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          item.code = `PRD${("0000000" + (last_value+1)).substr(-7,7)}`;
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
