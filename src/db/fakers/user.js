"use strict";

const faker = require("faker");

module.exports = function(employee) {

  const employee_id = employee.map(w => w.id);
  const data = [];
  const usernames = [];

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

    setUnique(faker.internet.userName, usernames);

    data.push({
      "id": faker.random.uuid(),
      "employee_id": faker.helpers.randomize(employee_id),
      "code": `USR${("0000000" + (i+1)).substr(-7,7)}`,
      "username": usernames[i].toLowerCase(),
      "password": faker.internet.password(),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
