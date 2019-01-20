"use strict";

import Schema from "../schemas/customer";

import Hooks from "../hooks/customer";

import { Customer as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  return Model;
};
