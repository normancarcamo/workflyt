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

for (let i = 0; i < 5; i++) {
  const created_at = faker.date.between(
    new Date("2018-11-10"),
    new Date("2018-11-15")
  );

  setUnique(faker.commerce.department, names);

  data.push({
    "id": faker.random.uuid(),
    "code": `WRH${("0000000" + (i+1)).substr(-7,7)}`,
    "name": names[i],
    "created_at": created_at,
    "updated_at": created_at,
    "deleted_at": null
  });
}

module.exports = data;
