"use strict";

const faker = require("faker");

module.exports = function(orders, department) {
  const data = [];
  const department_id = department.map(e => e.id);

  for (let i = 0; i < orders.length; i++) {
    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );
    data.push({
      "order_id": orders[i].id,
      "department_id": faker.helpers.randomize(department_id),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
