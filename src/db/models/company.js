"use strict";

import Schema from "../schemas/company";

import Methods from "../methods/shared";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Methods.call(Model, sequelize);

  return Model;
};
