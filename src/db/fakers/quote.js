"use strict";

const faker = require("faker");

function getSalesman(users_roles, users, roles, employees) {
  return users_roles.reduce((initial, ur) => {
    let indexRole = roles.findIndex(
      role => role.id === ur.role_id && role.name === "Salesman"
    );
    if (indexRole > -1) {
      let indexUser = users.findIndex(u => u.id === ur.user_id);
      if (indexUser > -1) {
        let indexEmployee = employees.findIndex(
          w => w.id === users[indexUser].employee_id
        );
        if (indexEmployee > -1) {
          initial = employees[indexEmployee];
        }
      }
    }
    return initial;
  }, null);
}

module.exports = function(customer, employee, users, roles, users_roles) {

  const data = [];
  const q_order = [];
  const i_order = [];

  for (let i = 0; i < 30; i++) {
    const created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );
    const type = faker.helpers.randomize([ "quote", "invoice" ]);
    let code = "0000000";
    let status = "open";

    if (type === "quote") {
      q_order.push(i);
      code = `QTE${("0000000" + q_order.length).substr(-7,7)}`;
      status = faker.helpers.randomize([ "open", "awaiting", "confirmed", "canceled" ]);
    } else {
      i_order.push(i);
      code = `IVC${("0000000" + i_order.length).substr(-7,7)}`;
      status = faker.helpers.randomize([ "open", "canceled", "done" ]);
    }

    data.push({
      "id": faker.random.uuid(),
      "customer_id": faker.helpers.randomize(customer.map(e => e.id)),
      "salesman_id": getSalesman(users_roles, users, roles, employee).id,
      "code": code,
      "type": type,
      "status": status,
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
