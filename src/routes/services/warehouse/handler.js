import db from "src/db/models";

const { Warehouse } = db.sequelize.models;

// warehouse:

export async function get_warehouses(req, res, next) {
  try {
    const options = { ...req.criteria };
    let result = await Warehouse.findAll(options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function create_warehouses(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await Warehouse.createMany(req.body.values, options);
    await transaction.commit();
    res.status(201).json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_warehouse(req, res, next) {
  res.json({ data: req.warehouse, error: null });
}

export async function update_warehouse(req, res, next) {
  try {
    let result = await req.warehouse.update(req.body.values);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function delete_warehouse(req, res, next) {
  try {
    let result = await req.warehouse.destroy(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

// warehouse_item:

export async function add_items(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await req.warehouse.addItems(req.body.values, options);
    await transaction.commit();
    res.json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_items(req, res, next) {
  try {
    let result = await req.warehouse.getItems(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function get_item(req, res, next) {
  res.json({ data: req.item, error: null });
}

export async function update_item(req, res, next) {
  try {
    let options = { through: req.body.values };
    let result = await req.warehouse.addItem(req.params.item, options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function remove_item(req, res, next) {
  try {
    let result = await req.warehouse.removeItem(req.params.item);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}
