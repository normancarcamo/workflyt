"use strict";

const faker = require("faker");

const data = [];
const names = [];
const uuids = [];

function setUnique(fn, arr) {
  let val = fn();
  if (arr.indexOf(val) === -1) {
    arr.push(val);
  } else {
    setUnique(fn, arr);
  }
}

for (let i = 0; i < 10; i++) {
  const created_at = faker.date.between(
    new Date("2018-11-10"),
    new Date()
  );

  const id = faker.random.uuid();
  uuids.push(id);
  setUnique(faker.commerce.productMaterial, names);

  data.push({
    "id": id,
    "parent_id": faker.helpers.randomize([
      null,
      null,
      null,
      null,
      ...uuids.filter(uuid => uuid !== id)
    ]),
    "code": `CAT/${("000000" + (i+1)).substr(-6,6)}`,
    "name": names[i],
    "extra": {},
    "created_at": created_at,
    "updated_at": created_at,
    "deleted_at": null,
    "created_by": null,
    "updated_by": null,
    "deleted_by": null
  });
}

module.exports = data;
