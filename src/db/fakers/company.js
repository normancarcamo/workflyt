"use strict";

const faker = require("faker");

const data = [];

let created_at = faker.date.between(
  new Date("2018-11-10"),
  new Date("2018-11-15")
);

data.push({
  "id": faker.random.uuid(),
  "code": "CMP0000001",
  "name": faker.company.companyName(),
  "created_at": created_at,
  "updated_at": created_at,
  "deleted_at": null
});

module.exports = data;
