"use strict";

import Schema from "../schemas/supplier";

import Hooks from "../hooks/supplier";

import Methods from "../methods/supplier";

import { Supplier as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  Methods.call(Model, sequelize);

  return Model;
};
