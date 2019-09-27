import Datalizer from '@ncardez/datalizer';
import { TSchema } from 'src/utils/types';
import * as s from 'src/utils/schemas';

export const area:TSchema = {
  attributes: [
    'id',
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
  associations: [ 'subareas', 'workers', 'services' ]
};

export const worker:TSchema = {
  attributes: [
    'id',
    'code',
    'firstname',
    'lastname',
    'is_supervisor',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'supervisors', 'jobs', 'areas', 'quotes', 'user' ]
};

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

export const getAreas = new Datalizer({
  query: s.QUERY({
    id: s.UUID({ $optional: true, $forbidden: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true }),
    attributes: s.ATTRIBUTES(area.attributes),
    sort_by: s.ENUM(area.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createArea = new Datalizer({
  body: s.BODY({
    id: s.UUID({ $optional: true, $null: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT({ $empty: false, $min: 2 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
}, { addKey: false });

export const getArea = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    attributes: s.ATTRIBUTES(area.attributes),
    include: s.INCLUDE(area.associations),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateArea = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: s.BODY({
    id: s.UUID({ $optional: true, $forbidden: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
}, { addKey: false });

export const deleteArea = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    force: s.BOOLEAN({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getSubareas = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    id: s.UUID({ $optional: true, $forbidden: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true }),
    attributes: s.ATTRIBUTES(area.attributes),
    sort_by: s.ENUM(area.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const addSubareas = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  body: s.BODY({ subareas: s.UUID_ARRAY() }, { $length: 1 })
});

export const getSubarea = new Datalizer({
  params: s.PARAMS(
    { area: s.UUID(), subarea: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    attributes: s.ATTRIBUTES(area.attributes),
    include: s.INCLUDE(area.associations),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateSubarea = new Datalizer({
  params: s.PARAMS(
    { area: s.UUID(), subarea: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: s.BODY({
    area_id: s.UUID({ $optional: true, $deny: true }),
    subarea_id: s.UUID({ $optional: true, $deny: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteSubarea = new Datalizer({
  params: s.PARAMS(
    { area: s.UUID(), subarea: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    force: s.BOOLEAN({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getWorkers = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    id: s.UUID({ $optional: true, $deny: true }),
    code: s.CODE({ $optional: true }),
    firstname: s.TEXT_FILTER({ $optional: true }),
    lastname: s.TEXT_FILTER({ $optional: true }),
    is_supervisor: s.NUMBER({
      $optional: true,
      $zero: true,
      $min: 0,
      $max: 1
    }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    attributes: s.ATTRIBUTES(worker.attributes),
    paranoid: s.BOOLEAN({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    sort_by: s.ENUM(worker.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 36 })
});

export const addWorkers = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  body: s.BODY({ workers: s.UUID_ARRAY() }, { $length: 1 })
});

export const getWorker = new Datalizer({
  params: s.PARAMS({
    area: s.UUID(),
    worker: s.UUID()
  }, { $length: 2 }),
  query: s.QUERY({
    paranoid: s.BOOLEAN({ $optional: true }),
    attributes: s.ATTRIBUTES(worker.attributes),
    include: s.INCLUDE(worker.associations)
  }, { $max: 20 })
});

export const updateWorker = new Datalizer({
  params: s.PARAMS(
    { area: s.UUID(), worker: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: s.BODY({
    area_id: s.UUID({ $optional: true, $deny: true }),
    worker_id: s.UUID({ $optional: true, $deny: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteWorker = new Datalizer({
  params: s.PARAMS(
    { area: s.UUID(), worker: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    force: s.BOOLEAN({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getServices = new Datalizer({
  params: s.PARAMS({ area: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    id: s.UUID({ $optional: true, $deny: true }),
    area_id: s.UUID({ $optional: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT_FILTER({ $optional: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    attributes: s.ATTRIBUTES(service.attributes),
    paranoid: s.BOOLEAN({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    sort_by: s.ENUM(service.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

export const getService = new Datalizer({
  params: s.PARAMS({
    area: s.UUID(),
    service: s.UUID()
  }, { $length: 2 }),
  query: s.QUERY({
    paranoid: s.BOOLEAN({ $optional: true }),
    attributes: s.ATTRIBUTES(service.attributes),
    include: s.INCLUDE(service.associations)
  }, { $max: 20 })
});
