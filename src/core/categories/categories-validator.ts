import Datalizer from '@ncardez/datalizer';
import { TSchema } from 'src/utils/types';
import * as s from 'src/utils/schemas';

export const category:TSchema = {
  attributes: [
    'id',
    'parent_id',
    'code',
    'name',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'materials', 'parent' ]
};

export const material:TSchema = {
  attributes: [
    'id',
    'category_id',
    'code',
    'name',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'stocks' ]
};

export const getCategories = new Datalizer({
  query: s.QUERY({
    id: s.UUID({ $optional: true, $forbidden: true }),
    parent_id: s.UUID({ $optional: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT_FILTER({ $optional: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    attributes: s.ATTRIBUTES(category.attributes),
    paranoid: s.BOOLEAN({ $optional: true }),
    sort_by: s.ENUM(category.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createCategory = new Datalizer({
  body: s.BODY({
    id: s.UUID({ $optional: true, $null: true }),
    parent_id: s.UUID({ $optional: true, $null: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT({ $empty: false, $min: 2 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 11, $empty: false })
}, { addKey: false });

export const getCategory = new Datalizer({
  params: s.PARAMS(
    { category: s.UUID() },
    { $length: 1 }
  ),
  query: s.QUERY({
    attributes: s.ATTRIBUTES(category.attributes),
    include: s.INCLUDE(category.associations),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 17 })
});

export const updateCategory = new Datalizer({
  params: s.PARAMS(
    { category: s.UUID() },
    { $length: 1 }
  ),
  query: s.QUERY(
    { paranoid: s.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
  body: s.BODY({
    id: s.UUID({ $optional: true }),
    parent_id: s.UUID({ $optional: true, $null: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 11, $empty: false })
}, { addKey: false });

export const deleteCategory = new Datalizer({
  params: s.PARAMS(
    { category: s.UUID() },
    { $length: 1 }
  ),
  query: s.QUERY({
    force: s.BOOLEAN({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

export const getMaterials = new Datalizer({
  params: s.PARAMS({ category: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    id: s.UUID({ $optional: true, $forbidden: true }),
    category_id: s.UUID({ $optional: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT_FILTER({ $optional: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    attributes: s.ATTRIBUTES(material.attributes),
    paranoid: s.BOOLEAN({ $optional: true }),
    sort_by: s.ENUM(material.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const getMaterial = new Datalizer({
  params: s.PARAMS({
    category: s.UUID(),
    material: s.UUID()
  }, { $length: 2 }),
  query: s.QUERY({
    attributes: s.ATTRIBUTES(material.attributes),
    include: s.INCLUDE(material.associations),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 24 })
});
