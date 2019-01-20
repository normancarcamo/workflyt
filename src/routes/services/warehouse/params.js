import prefetcher from "src/routes/utils/prefetcher";
import db from "src/db/models";

const { Warehouse } = db.sequelize.models;

// prefetchers ----------------------------------------------------------------

function warehouse(req, res, next) {
  prefetcher(
    Warehouse.findByPk(req.params.warehouse),
    "warehouse",
    req,
    next
  );
}

function item(req, res, next) {
  prefetcher(
    req.warehouse.getItems({ where: { id: req.params.item }, plain: true }),
    "item",
    req,
    next
  );
}

// Middlewares ----------------------------------------------------------------

// warehouse:
export const get_warehouse = warehouse;
export const update_warehouse = warehouse;
export const delete_warehouse = warehouse;

// warehouse_item:
export const get_items = warehouse;
export const add_items = warehouse;
export const get_item = [ warehouse, item ];
export const update_item = [ warehouse, item ];
export const remove_item = [ warehouse, item ];
