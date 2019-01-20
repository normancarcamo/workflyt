"use strict";

import Schema from "../schemas/employee";

import Hooks from "../hooks/employee";

import { Employee as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  return Model;
};
