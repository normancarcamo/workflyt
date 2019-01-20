"use strict";

const faker = require("faker");

module.exports = function(quote, item) {
  const data = [];

  for (let i = 0; i < quote.length; i++) {

    let created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );

    data.push({
      "quote_id": quote[i].id,
      "item_id": faker.helpers.randomize(item.map(e => e.id)),
      "extra": {
        "units": faker.random.number({ min: 1, max: 10 })
      },
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
}
