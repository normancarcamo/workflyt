import prefetcher from "src/routes/utils/prefetcher";
import db from "src/db/models";

const { Supplier } = db.sequelize.models;

// prefetchers ----------------------------------------------------------------

function supplier(req, res, next) {
  prefetcher(
    Supplier.findByPk(req.params.supplier),
    "supplier",
    req,
    next
  );
}

function item(req, res, next) {
  prefetcher(
    req.supplier.getItems({ where: { id: req.params.item }, plain: true }),
    "item",
    req,
    next
  );
}

// Middlewares ----------------------------------------------------------------

// supplier:
export const get_supplier = supplier;
export const update_supplier = supplier;
export const delete_supplier = supplier;

// supplier_item:
export const get_items = supplier;
export const add_items = supplier;
export const get_item = [ supplier, item ];
export const update_item = [ supplier, item ];
export const remove_item = [ supplier, item ];
