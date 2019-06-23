import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { User, Role } = db.sequelize.models;

const userAssociations = Object.keys(User.associations);
const userAttributes = Object.keys(User.attributes);

const roleAssociations = Object.keys(Role.associations);
const roleAttributes = Object.keys(Role.attributes);

const getUsers = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    employee_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    username: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(userAttributes),
    include: shared.ATTRIBUTES(userAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    sort_by: shared.ENUM(userAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 32 })
});

const createUsers = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    employee_id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    username: shared.TEXT({ $empty: false, $min: 2 }),
    password: shared.PASS(),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 12, $empty: false })
});

const getUser = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(userAttributes),
    include: shared.ATTRIBUTES(userAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  })
});

const updateUser = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    employee_id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    username: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    password: shared.PASS({ $optional: true, $empty: false, $min: 5 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 12, $empty: false })
});

const deleteUser = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getRoles = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true, $max: 100 }),
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
  }, { $max: 26 })
});

const setRoles = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { roles: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getRole = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID(), role: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(roleAttributes),
    include: shared.INCLUDE(roleAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 16 })
});

const updateRole = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID(), role: shared.UUID() },
    { $length: 2 }
  ),
  body: shared.BODY({
    user_id: shared.UUID({ $optional: true, $deny: true }),
    role_id: shared.UUID({ $optional: true, $deny: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

const removeRole = new Datalizer({
  params: shared.PARAMS(
    { user: shared.UUID(), role: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export default {
  getUsers: shared.validate(getUsers),
  createUsers: shared.validate(createUsers),
  getUser: shared.validate(getUser),
  updateUser: shared.validate(updateUser),
  deleteUser: shared.validate(deleteUser),
  getRoles: shared.validate(getRoles),
  setRoles: shared.validate(setRoles),
  getRole: shared.validate(getRole),
  updateRole: shared.validate(updateRole),
  removeRole: shared.validate(removeRole)
};
