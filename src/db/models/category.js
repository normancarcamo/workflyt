"use strict";

import Schema from "../schemas/category";

import Hooks from "../hooks/category";

import Methods from "../methods/category";

import { Category as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  Methods.call(Model, sequelize);

  return Model;

};
