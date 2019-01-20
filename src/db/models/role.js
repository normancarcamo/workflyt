"use strict";

import Schema from "../schemas/role";

import Hooks from "../hooks/role";

import { Role as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  return Model;
};
