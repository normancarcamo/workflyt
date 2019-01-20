"use strict";

import Schema from "../schemas/item_type";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  return Model;
};
