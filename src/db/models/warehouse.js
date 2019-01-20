"use strict";

import Schema from "../schemas/warehouse";

import Hooks from "../hooks/warehouse";

import Methods from "../methods/warehouse";

import { Warehouse as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {
  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  Methods.call(Model, sequelize);

  return Model;
};
