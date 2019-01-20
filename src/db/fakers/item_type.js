const faker = require("faker");

module.exports = function(item) {
  const data = [];
  const products = item.filter(el => el.type === "product").map(e => e.id);
  const material = item.filter(el => el.type === "material").map(e => e.id);

  for (let i = 0; i < products.length; i++) {
    const created_at = faker.date.between(
      new Date("2018-11-10"),
      new Date("2018-11-15")
    );
    data.push({
      "item_id": products[i],
      "type_id": faker.helpers.randomize(material),
      "extra": {
        "units": faker.random.number({ min: 0, max: 10 })
      },
      "created_at": created_at,
      "updated_at": created_at,
      "deleted_at": null
    });
  }

  return data;
};
