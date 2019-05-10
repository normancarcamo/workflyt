"use strict";

const faker = require("faker");

module.exports = function(users, roles) {
  const data = [];
  const user = users.map(user => user.id);
  const role = roles.map(role => role.id);
  const created_at = faker.date.between(new Date("2018-11-10"), new Date("2018-11-15"));

  const salesmanIndex = roles.findIndex(rol => rol.name === 'Salesman');

  for (let i = 0; i < users.length; i++) {
    data.push({
      "user_id": user[i],
      "role_id": faker.helpers.randomize(role),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    });
  }

  // Add two salesman roles:
  if (data.findIndex(el => el.role_id === role[salesmanIndex]) === -1) {
    data[0] = {
      "user_id": user[0],
      "role_id": role[salesmanIndex],
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    };
    data[1] = {
      "user_id": user[1],
      "role_id": role[salesmanIndex],
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    };
  }

  return data;
};
