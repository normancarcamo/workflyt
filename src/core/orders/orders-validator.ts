import * as schema from 'src/utils/schemas';
import { TSchema } from 'src/utils/types';
import Datalizer from '@ncardez/datalizer';

export const order:TSchema = {
  attributes: [
    'id',
    'quote_id',
    'code',
    'subject',
    'status',
    'priority',
    'progress',
    'extra',
    'created_at',
    'updated_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'jobs' ]
};

export const job:TSchema = {
  attributes: [
    'id',
    'service_id',
    'order_id',
    'code',
    'details',
    'status',
    'priority',
    'progress',
    'units',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'subjobs', 'workers', 'materials' ]
};

export const getOrders = new Datalizer({
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    quote_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT_FILTER({ $optional: true }),
    status: schema.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
    priority: schema.ENUM([ 'low', 'medium', 'high' ]),
    progress: schema.NUMBER_FILTER({
      $optional: true,
      $float: true,
      $negative: false,
      $zero: true
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(order.attributes),
    sort_by: schema.ENUM(order.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createOrder = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    quote_id: schema.UUID(),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT({
      $optional: true,
      $null: true,
      $default: 'No subject',
      $empty: false,
      $min: 2
    }),
    status: schema.ENUM([
      'awaiting',
      'working',
      'cancelled',
      'done'
    ], { $default: 'awaiting' }),
    priority: schema.ENUM([
      'low',
      'medium',
      'high'
    ], { $default: 'low' }),
    progress: schema.NUMBER({
      $negative: false,
      $float: true,
      $default: 0,
      $optional: true,
      $null: true,
      $zero: true
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 20, $empty: false })
}, { addKey: false });

export const getOrder = new Datalizer({
  params: schema.PARAMS({ order: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(order.attributes),
    include: schema.INCLUDE(order.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 30 })
});

export const updateOrder = new Datalizer({
  params: schema.PARAMS(
    { order: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY(
    { paranoid: schema.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    quote_id: schema.UUID({ $optional: true, $deny: true }),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
    status: schema.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
    priority: schema.ENUM([ 'low', 'medium', 'high' ]),
    progress: schema.NUMBER({
      $negative: false,
      $float: true,
      $default: 0,
      $optional: true,
      $null: true,
      $zero: true
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 30, $empty: false, $min: 1 })
}, { addKey: false });

export const deleteOrder = new Datalizer({
  params: schema.PARAMS(
    { order: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getJobs = new Datalizer({
  params: schema.PARAMS({ order: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $forbidden: true }),
    service_id: schema.UUID({ $optional: true }),
    order_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    details: schema.TEXT_FILTER({ $optional: true }),
    status: schema.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
    priority: schema.ENUM([ 'low', 'medium', 'high' ]),
    progress: schema.NUMBER_FILTER({
      $optional: true,
      $float: true,
      $negative: false,
      $zero: true
    }),
    units: schema.NUMBER_FILTER({
      $optional: true,
      $float: false,
      $negative: false,
      $zero: true
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(job.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    sort_by: schema.ENUM(job.attributes),
    order_by: schema.ORDER_BY({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true })
  }, { $max: 30 })
});

export const getJob = new Datalizer({
  params: schema.PARAMS(
    { order: schema.UUID(), job: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(job.attributes),
    include: schema.INCLUDE(job.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 30 })
});
