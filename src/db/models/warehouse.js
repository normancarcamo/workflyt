"use strict";

import Schema from "../schemas/warehouse";

import Methods from "../methods/shared";

import { Warehouse as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {
  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Methods.call(Model, sequelize);

  return Model;
};
