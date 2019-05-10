"use strict";

const faker = require("faker");

module.exports = function(orders, item) {
  const data = [];
  const item_id = item.map(e => e.id);

  for (let i = 0; i < orders.length; i++) {
    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );
    data.push({
      "order_id": orders[i].id,
      "item_id": faker.helpers.randomize(item_id),
      "extra": {
        "units": faker.random.number({ min: 1, max: 10 })
      },
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    });
  }

  return data;
};
