import validator from './validator';
import * as params from './params';
import * as handler from './handler';
import * as query from './query';

// entity ---------------------------------------------------------------------

// item:

export const get_items = [
  validator.get_items,
  query.get_items,
  handler.get_items
];

export const create_items = [
  validator.create_items,
  handler.create_items
];

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

export const delete_item = [
  validator.delete_item,
  params.delete_item,
  query.delete_item,
  handler.delete_item
];

// associations ---------------------------------------------------------------

// item_type:

export const get_types = [
  validator.get_types,
  params.get_types,
  handler.get_types
];

export const add_types = [
  validator.add_types,
  params.add_types,
  handler.add_types
];

export const get_type = [
  validator.get_type,
  params.get_type,
  handler.get_type
];

export const update_type = [
  validator.update_type,
  params.update_type,
  handler.update_type
];

export const remove_type = [
  validator.remove_type,
  params.remove_type,
  handler.remove_type
];
