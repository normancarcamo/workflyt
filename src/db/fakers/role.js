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
  let created_at = faker.date.between(new Date("2018-11-10"), new Date("2018-11-15"));
  data.push({
    "id": faker.random.uuid(),
    "code": `ROL${("0000000" + (i+1)).substr(-7,7)}`,
    "name": roles[i],
    "created_at": created_at,
    "updated_at": created_at,
    "deleted_at": null
  });
}

module.exports = data;
