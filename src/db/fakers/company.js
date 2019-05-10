"use strict";

const faker = require("faker");

const data = [];

let created_at = faker.date.between(
  new Date("2018-11-10"),
  new Date("2018-11-15")
);

data.push({
  "id": faker.random.uuid(),
  "name": faker.company.companyName(),
  "code": `COM/0000001`,
  "created_at": created_at,
  "updated_at": created_at,
  "deleted_at": null,
  "created_by": null,
  "updated_by": null,
  "deleted_by": null
});

module.exports = data;
