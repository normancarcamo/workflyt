import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Permission } = db.sequelize.models;

const permissionAssociations = Object.keys(Permission.associations);
const permissionAttributes = Object.keys(Permission.attributes);

const getPermissions = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(permissionAttributes),
    include: shared.INCLUDE(permissionAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(permissionAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

const createPermissions = new Datalizer({
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

const getPermission = new Datalizer({
  params: shared.PARAMS(
    { permission: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(permissionAttributes),
    include: shared.INCLUDE(permissionAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 13 })
});

const updatePermission = new Datalizer({
  params: shared.PARAMS(
    { permission: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10, $empty: true })
});

const deletePermission = new Datalizer({
  params: shared.PARAMS(
    { permission: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export default {
  getPermissions: shared.validate(getPermissions),
  createPermissions: shared.validate(createPermissions),
  getPermission: shared.validate(getPermission),
  updatePermission: shared.validate(updatePermission),
  deletePermission: shared.validate(deletePermission)
};
