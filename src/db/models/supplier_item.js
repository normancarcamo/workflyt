"use strict";

import Schema from "../schemas/supplier_item";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  return Model;
};
