"use strict";

const faker = require("faker");


module.exports = function(warehouse, item) {
  const data = [];

  for (let i = 0; i < item.length; i++) {

    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );

    data.push({
      "warehouse_id": faker.helpers.randomize(warehouse.map(e => e.id)),
      "item_id": item.map(e => e.id)[i],
      "extra": {
        "units": faker.random.number({ min: 1, max: 200 })
      },
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
}
