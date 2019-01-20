import prefetcher from "src/routes/utils/prefetcher";
import db from "src/db/models";

const { Category } = db.sequelize.models;

export function category(req, res, next) {
  prefetcher(
    Category.findByPk(req.params.category),
    "category",
    req,
    next
  );
}

export function item(req, res, next) {
  prefetcher(
    req.category.getItems({ where: { id: req.params.item }, plain: true }),
    "item",
    req,
    next
  );
}

export const get_category = category;

export const update_category = category;

export const delete_category = category;

export const add_items = category;

export const get_items = category;

export const get_item = [ category, item ];
