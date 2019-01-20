import validator from './validator';
import * as params from './params';
import * as query from './query';
import * as handler from './handler';

export const get_companies = [
  validator.get_companies,
  query.get_companies,
  handler.get_companies
];

export const create_companies = [
  validator.create_companies,
  handler.create_companies
];

export const get_company = [
  validator.get_company,
  params.get_company,
  handler.get_company
];

export const update_company = [
  validator.update_company,
  params.update_company,
  handler.update_company
];

export const delete_company = [
  validator.delete_company,
  params.delete_company,
  query.delete_company,
  handler.delete_company
];
