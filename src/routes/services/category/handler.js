import db from "src/db/models";

const { Category } = db.sequelize.models;

export async function get_categories(req, res, next) {
  try {
    let result = await Category.findAll(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function create_categories(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await Category.createMany(req.body.values, options);
    await transaction.commit();
    res.status(201);
    res.json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_category(req, res, next) {
  res.status(200).json({ data: req.category, error: null });
}

export async function update_category(req, res, next) {
  try {
    let result = await req.category.update(req.body.values);
    res.set('Last-Modified', result.updated_at);
    res.status(200).json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function delete_category(req, res, next) {
  try {
    let result = await req.category.destroy(req.options);
    res.status(200).json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function add_items(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await req.category.addItems(req.body.values, options);
    await transaction.commit();
    res.json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_items(req, res, next) {
  try {
    let result = await req.category.getItems(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function get_item(req, res, next) {
  res.json({ data: req.item, error: null });
}
