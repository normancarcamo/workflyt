"use strict";

import Schema from "../schemas/user";

import Hooks from "../hooks/user";

import { User as Associations } from "../associations";

module.exports = (sequelize, DataTypes) => {

  const { name, attributes, options } = Schema(DataTypes);

  const Model = sequelize.define(name, attributes, options);

  Associations(Model);

  Hooks(Model, sequelize);

  return Model;
};
