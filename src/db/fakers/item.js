"use strict";

const faker = require("faker");

module.exports = function(category) {
  const data = [];
  const products = [];
  const materials = [];
  const services = [];

  for (let i = 0; i < 30; i++) {
    const created_at = faker.date.between(
      new Date("2018-01-10"),
      new Date("2018-01-15")
    );

    let type = faker.helpers.randomize([ "product", "material", "service" ]);
    let name = "";
    let code = "0000000";

    switch(type) {
      case "product":
        products.push(i);
        name = `${faker.commerce.productName()}-${i}`;
        code = `PRD${("0000000" + (products.length)).substr(-7,7)}`;
        break;
      case "material":
        materials.push(i);
        name = `${faker.commerce.productMaterial()}-${i}`;
        code = `MTR${("0000000" + (materials.length)).substr(-7,7)}`;
        break;
      default:
        services.push(i);
        name = `${faker.lorem.sentence()}-${i}`;
        code = `SRV${("0000000" + (services.length)).substr(-7,7)}`;
    }

    data.push({
      "id": faker.random.uuid(),
      "category_id": faker.helpers.randomize(category.map(e => e.id)),
      "code": code,
      "name": name,
      "type": type,
      "stock": faker.random.number({ min: 0, max: 800 }),
      "price": faker.commerce.price(),
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
