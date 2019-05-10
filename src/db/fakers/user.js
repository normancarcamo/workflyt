"use strict";

const faker = require("faker");

module.exports = function(employee) {

  const employee_id = employee.map(w => w.id);
  const data = [];
  const usernames = [];
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

    setUnique(faker.internet.userName, usernames);

    let by = faker.helpers.randomize([
      null, null, null, null,
      ...uuids.filter(uuid => uuid !== uuids[i])
    ]);

    data.push({
      "id": uuids[i],
      "employee_id": employee_id[i],
      "code": `USR/${("000000" + (i+1)).substr(-6,6)}`,
      "username": usernames[i].toLowerCase(),
      "password": faker.internet.password(),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": by,
      "updated_by": by,
      "deleted_by": null
    });
  }

  return data;
};
