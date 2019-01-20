import validator from './validator';
import * as params from './params';
import * as query from './query';
import * as handler from './handler';

// Entity ---------------------------------------------------------------------

// supplier:

export const get_suppliers = [
  validator.get_suppliers,
  query.get_suppliers,
  handler.get_suppliers
];

export const create_suppliers = [
  validator.create_suppliers,
  handler.create_suppliers
];

export const get_supplier = [
  validator.get_supplier,
  params.get_supplier,
  handler.get_supplier
];

export const update_supplier = [
  validator.update_supplier,
  params.update_supplier,
  handler.update_supplier
];

export const delete_supplier = [
  validator.delete_supplier,
  params.delete_supplier,
  query.delete_supplier,
  handler.delete_supplier
];

// Associations ---------------------------------------------------------------

// supplier_item:

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
