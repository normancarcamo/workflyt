import db from "src/db/models";

const { Supplier } = db.sequelize.models;

// supplier:

export async function get_suppliers(req, res, next) {
  try {
    const options = { ...req.criteria };
    let result = await Supplier.findAll(options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function create_suppliers(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await Supplier.createMany(req.body.values, options);
    await transaction.commit();
    res.status(201).json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_supplier(req, res, next) {
  res.json({ data: req.supplier, error: null });
}

export async function update_supplier(req, res, next) {
  try {
    let result = await req.supplier.update(req.body.values);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function delete_supplier(req, res, next) {
  try {
    let result = await req.supplier.destroy(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

// supplier_item:

export async function add_items(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await req.supplier.addItems(req.body.values, options);
    await transaction.commit();
    res.json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_items(req, res, next) {
  try {
    let result = await req.supplier.getItems(req.options);
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
    let result = await req.supplier.addItem(req.params.item, options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function remove_item(req, res, next) {
  try {
    let result = await req.supplier.removeItem(req.params.item);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}
