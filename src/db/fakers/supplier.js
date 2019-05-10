"use strict";

const faker = require("faker");
const data = [];
const names = [];

function setUnique(fn, arr) {
  let val = fn();
  if (arr.indexOf(val) === -1) {
    arr.push(val);
  } else {
    setUnique(fn, arr);
  }
}

for (let i = 0; i < 30; i++) {
  let created_at = faker.date.between(
    new Date("2018-11-10"),
    new Date("2018-11-15")
  );

  setUnique(faker.company.companyName, names);

  data.push({
    "id": faker.random.uuid(),
    "code": `SUP/${("000000" + (i+1)).substr(-6,6)}`,
    "name": names[i],
    "created_at": created_at,
    "updated_at": created_at,
    "deleted_at": null,
    "created_by": null,
    "updated_by": null,
    "deleted_by": null
  });
}

module.exports = data;
