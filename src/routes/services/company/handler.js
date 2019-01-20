import db from "src/db/models";

const { Company } = db.sequelize.models;

export async function get_companies(req, res, next) {
  try {
    let result = await Company.findAll(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function create_companies(req, res, next) {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    let options = { transaction };
    let result = await Company.createMany(req.body.values, options);
    await transaction.commit();
    res.status(201).json({ data: result, error: null });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export async function get_company(req, res, next) {
  res.json({ data: req.company, error: null });
}

export async function update_company(req, res, next) {
  try {
    let result = await req.company.update(req.body.values);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}

export async function delete_company(req, res, next) {
  try {
    let result = await req.company.destroy(req.options);
    res.json({ data: result, error: null });
  } catch (error) {
    next(error);
  }
}
