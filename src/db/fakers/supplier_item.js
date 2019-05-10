"use strict";

const faker = require("faker");

module.exports = function(supplier, item) {
  const data = [];

  for (let i = 0; i < item.length; i++) {

    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );

    data.push({
      "supplier_id": faker.helpers.randomize(supplier.map(e => e.id)),
      "item_id": item.map(e => e.id)[i],
      "extra": {
        "units": faker.random.number({ min: 1, max: 200 })
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
}
