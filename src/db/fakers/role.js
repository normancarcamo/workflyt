"use strict";

const faker = require("faker");

const data = [];

const roles = [
  "Admin",
  "Developer",
  "Test",
  "Guest",
  "Salesman",
  "Designer",
  "Printer",
  "Welder",
  "Woodman",
  "Carpenter"
];

for (let i = 0; i < roles.length; i++) {
  let created_at = faker.date.between(
    new Date("2018-11-10"),
    new Date("2018-11-15")
  );
  data.push({
    "id": faker.random.uuid(),
    "code": `ROL/${("000000" + (i+1)).substr(-6,6)}`,
    "name": roles[i],
    "created_at": created_at,
    "updated_at": created_at,
    "deleted_at": null,
    "created_by": null,
    "updated_by": null,
    "deleted_by": null
  });
}

module.exports = data;
