"use strict";

const faker = require("faker");

module.exports = function(item) {
  const data = [];

  for (let i = 0; i < 30; i++) {
    let entries = faker.random.number({ min: 0, max: 5000 });
    let exits = faker.random.number({ min: 0, max: 5000 });
    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2019-11-15")
    );

    data.push({
      "id": faker.random.uuid(),
      "item_id": faker.helpers.randomize(item.map(e => e.id)),
      "entries": entries,
      "exits": exits,
      "stock": entries - exits,
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
