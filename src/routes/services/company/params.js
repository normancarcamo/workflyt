import prefetcher from "src/routes/utils/prefetcher";
import db from "src/db/models";

const { Company } = db.sequelize.models;

// preetchers -----------------------------------------------------------------

function company(req, res, next) {
  prefetcher(
    Company.findByPk(req.params.company),
    "company",
    req,
    next
  );
}

// middlewares ----------------------------------------------------------------

export const get_company = company;

export const update_company = company;

export const delete_company = company;
