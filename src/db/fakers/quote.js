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

  for (let i = 0; i < 30; i++) {
    const created_at = faker.date.between(
      new Date("2019-11-10"),
      new Date("2019-11-15")
    );

    data.push({
      "id": faker.random.uuid(),
      "customer_id": faker.helpers.randomize(customer.map(e => e.id)),
      "salesman_id": getSalesman(users_roles, users, roles, employee).id,
      "subject": faker.commerce.productName(),
      "code": `QUO-19/${("000000" + i).substr(-6,6)}`,
      "status": faker.helpers.randomize([ "open", "awaiting", "confirmed", "cancelled" ]),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    });
  }

  return data;
};
