import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Role, Permission } = db.sequelize.models;

const roleAssociations = Object.keys(Role.associations);
const roleAttributes = Object.keys(Role.attributes);

const permissionAssociations = Object.keys(Permission.associations);
const permissionAttributes = Object.keys(Permission.attributes);

const getRoles = new Datalizer({
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
    attributes: shared.ATTRIBUTES(roleAttributes),
    include: shared.INCLUDE(roleAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(roleAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

const createRoles = new Datalizer({
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
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 10, $empty: false })
});

const getRole = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(roleAttributes),
    include: shared.INCLUDE(roleAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 10 })
});

const updateRole = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID() },
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
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 10, $empty: false })
});

const deleteRole = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getPermissions = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID() },
    { $length: 1 }
  ),
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

const setPermissions = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { permissions: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getPermission = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID(), permission: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(permissionAttributes),
    include: shared.INCLUDE(permissionAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 10 })
});

const updatePermission = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID(), permission: shared.UUID() },
    { $length: 2 }
  ),
  body: shared.BODY({
    role_id: shared.UUID({ $optional: true, $deny: true }),
    permission_id: shared.UUID({ $optional: true, $deny: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

const removePermission = new Datalizer({
  params: shared.PARAMS(
    { role: shared.UUID(), permission: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export default {
  getRoles: shared.validate(getRoles),
  createRoles: shared.validate(createRoles),
  getRole: shared.validate(getRole),
  updateRole: shared.validate(updateRole),
  deleteRole: shared.validate(deleteRole),
  getPermissions: shared.validate(getPermissions),
  setPermissions: shared.validate(setPermissions),
  getPermission: shared.validate(getPermission),
  updatePermission: shared.validate(updatePermission),
  removePermission: shared.validate(removePermission)
};
