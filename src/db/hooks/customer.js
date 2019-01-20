import { InternalError } from '@playscode/fns/lib/errors';

export default function CustomerHooks(Customer, sequelize) {
  Customer.beforeCreate(async customer => {
    if (customer.code === "unset") {
      try {
        const stmt = "SELECT last_value FROM nz.customer_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        customer.code = `CUS${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });
}
