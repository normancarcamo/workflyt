"use strict";

const faker = require("faker");

const data = [];

const names = [ "Art", "Printing", "Weld", "Wood", "Painting", "Sales" ];

for (let i = 0; i < names.length; i++) {
  const created_at = faker.date.between(
    new Date("2018-11-10"),
    new Date("2018-11-15")
  );

  data.push({
    "id": faker.random.uuid(),
    "code": `DEP${("0000000" + (i+1)).substr(-7,7)}`,
    "name": names[i],
    "created_at": created_at,
    "updated_at": created_at,
    "deleted_at": null
  });
}

module.exports = data;
