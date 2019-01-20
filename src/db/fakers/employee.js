"use strict";

const faker = require("faker");

module.exports = function(department) {
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

  for (let i = 0; i < 30; i++) {
    const created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );

    uuids.push(faker.random.uuid());
    setUnique(faker.name.findName, names);

    data.push({
      "id": uuids[i],
      "supervisor_id": faker.helpers.randomize([
        null,
        null,
        null,
        null,
        ...uuids.filter(uuid => uuid !== uuids[i])
      ]),
      "department_id": faker.helpers.randomize(department.map(e => e.id)),
      "code": `WRK${("0000000" + (i + 1)).substr(-7,7)}`,
      "firstname": names[i],
      "lastname": faker.name.findName(),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
}
