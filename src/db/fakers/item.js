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
    let code = "000000";

    switch(type) {
      case "product":
        products.push(i);
        name = `${faker.commerce.productName()}-${i}`;
        code = `PRD/${(code + (products.length)).substr(-6,6)}`;
        break;
      case "material":
        materials.push(i);
        name = `${faker.commerce.productMaterial()}-${i}`;
        code = `MAT/${(code + (materials.length)).substr(-6,6)}`;
        break;
      default:
        services.push(i);
        name = `${faker.lorem.sentence()}-${i}`;
        code = `SER/${(code + (services.length)).substr(-6,6)}`;
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
      "deleted_at": null,
      "created_by": null,
      "updated_by": null,
      "deleted_by": null
    });
  }

  return data;
};
