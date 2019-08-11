const roles = require('./role.js');
const permissions = require('./permission.js');

const common_columns = {
  extra: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
};
const data = [];

for (let permission of permissions) {
  data.push({ // All permissions for Admin:
    role_id: roles[0].id,
    permission_id: permission.id,
    ...common_columns
  });
}

// only read access permissions for testing purposes:
let userRoles = ['Salesman', 'Designer', 'Printer'];
for (let role of roles) {
  if (userRoles.includes(role.name)) {
    for (let permission of permissions) {
      if (permission.name.includes('get')) {
        data.push({
          role_id: role.id,
          permission_id: permission.id,
          ...common_columns
        });
      }
    }
  }
}

module.exports = data;
