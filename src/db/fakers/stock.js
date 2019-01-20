"use strict";

const faker = require("faker");

module.exports = function(item) {
  const data = [];

  for (let i = 0; i < 30; i++) {
    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );
    let entries = faker.random.number({ min: 0, max: 5000 });
    let exits = faker.random.number({ min: 0, max: 5000 });
    let stock = entries - exits;
    // if (exits > entries) {};

    data.push({
      "id": faker.random.uuid(),
      "item_id": faker.helpers.randomize(item.map(e => e.id)),
      "entries": entries,
      "exits": exits,
      "stock": stock,
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
