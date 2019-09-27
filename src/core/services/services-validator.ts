import * as schema from 'src/utils/schemas';
import { TSchema } from 'src/utils/types';
import Datalizer from '@ncardez/datalizer';

export const service:TSchema = {
  attributes: [
    'id',
    'area_id',
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

export const getServices = new Datalizer({
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    area_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT_FILTER({ $optional: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(service.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(service.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

export const createService = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    area_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT({ $empty: false, $min: 2 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 20, $empty: false })
}, { addKey: false });

export const getService = new Datalizer({
  params: schema.PARAMS(
    { service: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(service.attributes),
    include: schema.INCLUDE(service.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateService = new Datalizer({
  params: schema.PARAMS(
    { service: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    area_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 20, $empty: false })
}, { addKey: false });

export const deleteService = new Datalizer({
  params: schema.PARAMS(
    { service: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getJobs = new Datalizer({
  params: schema.PARAMS({ service: schema.UUID() }, { $length: 1 }),
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
    { service: schema.UUID(), job: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(job.attributes),
    include: schema.INCLUDE(job.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 30 })
});
