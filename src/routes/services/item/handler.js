import db from "src/db/models";

const { Item } = db.sequelize.models;

// item:

export async function get_items(req, res, next) {
  try {
    let result = await Item.findAll(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function create_items(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await Item.createMany(req.body.values, options);
    await transaction.commit();
    res.status(201).json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_item(req, res, next) {
  res.json({ data: req.item, error: null });
}

export async function update_item(req, res, next) {
  try {
    let result = await req.item.update(req.body.values);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function delete_item(req, res, next) {
  try {
    let result = await req.item.destroy(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

// item_type:

// Pending...
export async function get_types(req, res, next) {
  try {
    let result = await req.item.findTypes(null, req.query.criteria);

    // req.item.getTypes({
    //   joinTableAttributes: [],
    //   where: { ...req.query.criteria }
    // });

    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

// Pending...
export async function add_types(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await req.item.addTypes(req.body.values, options);
    await transaction.commit();
    res.json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_type(req, res, next) {
  res.json({ data: req.type, error: null });
}

export async function update_type(req, res, next) {
  try {
    let options = { through: req.body.values };
    let result = await req.item.addType(req.params.type, options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function remove_type(req, res, next) {
  try {
    let result = await req.item.removeType(req.params.type);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}
