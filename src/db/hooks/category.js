import { InternalError } from '@playscode/fns/lib/errors';

export default function CategoryHooks(Category, sequelize) {
  Category.beforeCreate(async category => {
    if (category.code === 'unset') {
      try {
        const stmt = "SELECT last_value FROM nz.category_seq";
        const opts = { plain: true };
        const { last_value } = await sequelize.query(stmt, opts);
        category.code = `CAT${("0000000" + (last_value+1)).substr(-7,7)}`;
        return true;
      } catch (e) {
        throw new InternalError(e.message);
      }
    } else {
      return false;
    }
  });

  Category.beforeBulkCreate(async categories => {
    for (let category of categories) {
      if (category.code === 'unset') {
        try {
          const stmt = "SELECT last_value FROM nz.category_seq";
          const opts = { plain: true };
          const { last_value } = await sequelize.query(stmt, opts);
          category.code = `CAT${("0000000" + (last_value+1)).substr(-7,7)}`;
          continue;
        } catch (e) {
          throw new InternalError(e.message);
        }
      } else {
        continue;
      }
    }
  });
}
