import validator from './validator';
import * as params from './params';
import * as query from './query';
import * as handler from './handler';

// Entity ---------------------------------------------------------------------

// warehouse:

export const get_warehouses = [
  validator.get_warehouses,
  query.get_warehouses,
  handler.get_warehouses
];

export const create_warehouses = [
  validator.create_warehouses,
  handler.create_warehouses
];

export const get_warehouse = [
  validator.get_warehouse,
  params.get_warehouse,
  handler.get_warehouse
];

export const update_warehouse = [
  validator.update_warehouse,
  params.update_warehouse,
  handler.update_warehouse
];

export const delete_warehouse = [
  validator.delete_warehouse,
  params.delete_warehouse,
  query.delete_warehouse,
  handler.delete_warehouse
];

// Associations ---------------------------------------------------------------

// warehouse_item:

export const get_items = [
  validator.get_items,
  params.get_items,
  query.get_items,
  handler.get_items
];

export const add_items = [
  validator.add_items,
  params.add_items,
  handler.add_items
]

export const get_item = [
  validator.get_item,
  params.get_item,
  handler.get_item
];

export const update_item = [
  validator.update_item,
  params.update_item,
  handler.update_item
];

export const remove_item = [
  validator.remove_item,
  params.remove_item,
  handler.remove_item
];
