"use strict";

import Schema from "../schemas/item";

import Hooks from "../hooks/item";

import Methods from "../methods/item";

import { Item as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  Methods.call(Model, sequelize);

  return Model;
};
