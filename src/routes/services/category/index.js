import validator from './validator';
import * as params from './params';
import * as query from './query';
import * as handler from './handler';

export const get_categories = [
  validator.get_categories,
  query.get_categories,
  handler.get_categories
];

export const create_categories = [
  validator.create_categories,
  handler.create_categories
];

export const get_category = [
  validator.get_category,
  params.get_category,
  handler.get_category
];

export const update_category = [
  validator.update_category,
  params.update_category,
  handler.update_category
];

export const delete_category = [
  validator.delete_category,
  params.delete_category,
  query.delete_category,
  handler.delete_category
];

export const add_items = [
  validator.add_items,
  params.add_items,
  handler.add_items
]

export const get_items = [
  validator.get_items,
  params.get_items,
  query.get_items,
  handler.get_items
];

export const get_item = [
  validator.get_item,
  params.get_item,
  handler.get_item
];
