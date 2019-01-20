import { InternalError } from '@playscode/fns/lib/errors';

export default function QuoteHooks(Quote, sequelize) {
  Quote.beforeCreate(async quote => {
    if (quote.code === "unset") {
      try {
        if (quote.type === "invoice") {
          const stmt = "SELECT last_value FROM nz.invoice_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          quote.code = `IVC${("0000000" + (last_value+1)).substr(-7,7)}`;
        } else {
          const stmt = "SELECT last_value FROM nz.quote_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          quote.code = `QTE${("0000000" + (last_value+1)).substr(-7,7)}`;
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
