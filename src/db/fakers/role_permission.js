"use strict";

const faker = require("faker");

module.exports = function(role, permission) {
  const data = [];

  for (let i = 0; i < role.length; i++) {

    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );

    data.push({
      "role_id": role.map(r => r.id)[i],
      "permission_id": faker.helpers.randomize(permission.map(p => p.id)),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
}
