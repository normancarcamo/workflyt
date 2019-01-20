"use strict";

const faker = require("faker");

module.exports = function(quote) {

  const data = [];
  const w_order = [];
  const i_order = [];

  for (let i = 0; i < 30; i++) {
    const created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );
    const type = faker.helpers.randomize([ "work", "installation" ]);
    let code = "0000000";
    let status = faker.helpers.randomize([
      "awaiting",
      "working",
      "canceled",
      "done"
    ]);

    if (type === "installation") {
      i_order.push(i);
      code = `IOR${("0000000" + i_order.length).substr(-7,7)}`
    } else {
      w_order.push(i);
      code = `WOR${("0000000" + w_order.length).substr(-7,7)}`
    }

    data.push({
      "id": faker.random.uuid(),
      "quote_id": faker.helpers.randomize(quote.map(e => e.id)),
      "code": code,
      "type": type,
      "status": status,
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
