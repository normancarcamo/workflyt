"use strict";

const faker = require("faker");

module.exports = function(role, permission) {
  const data = [];
  const roles = role.map(r => r.id)
  const permissions = permission.map(p => p.id)

  for (let i = 0; i < roles.length; i++) {

    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );

    data.push({
      "role_id": faker.helpers.randomize(roles),
      "permission_id": faker.helpers.randomize(permissions),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    });
  }

  return data;
}
