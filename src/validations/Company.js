import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Company } = db.sequelize.models;

const companyAttributes = Object.keys(Company.attributes);

const getCompanies = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(companyAttributes),
    paranoid: shared.BOOLEAN({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    sort_by: shared.ENUM(companyAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 24 })
});

const createCompanies = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
});

const getCompany = new Datalizer({
  params: shared.PARAMS({ company: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(companyAttributes),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 11 })
});

const updateCompany = new Datalizer({
  params: shared.PARAMS({ company: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({
    id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
});

const deleteCompany = new Datalizer({
  params: shared.PARAMS({ company: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

export default {
  getCompanies: shared.validate(getCompanies),
  createCompanies: shared.validate(createCompanies),
  getCompany: shared.validate(getCompany),
  updateCompany: shared.validate(updateCompany),
  deleteCompany: shared.validate(deleteCompany)
};
