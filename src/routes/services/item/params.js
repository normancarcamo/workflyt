import prefetcher from "src/routes/utils/prefetcher";
import db from "src/db/models";

const { Item } = db.sequelize.models;

// prefetchers ----------------------------------------------------------------

function item(req, res, next) {
  prefetcher(
    Item.findByPk(req.params.item),
    "item",
    req,
    next
  );
}

function type(req, res, next) {
  prefetcher(
    req.item.findTypes(null, req.params.type, { plain: true }),
    "type",
    req,
    next
  );
}

// middlewares ----------------------------------------------------------------

// item:
export const get_item = item;
export const update_item = item;
export const delete_item = item;

// item_type:
export const get_types = item;
export const add_types = item;
export const get_type = [ item, type ];
export const update_type = [ item, type ];
export const remove_type = [ item, type ];
