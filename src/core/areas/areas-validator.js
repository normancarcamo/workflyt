const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

export const area = {
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

export const worker = {
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

export const service = {
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
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $forbidden: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(area.attributes),
    sort_by: schema.ENUM(area.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createArea = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT({ $empty: false, $min: 2 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
}, { addKey: false });

export const getArea = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(area.attributes),
    include: schema.INCLUDE(area.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateArea = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $forbidden: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
}, { addKey: false });

export const deleteArea = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getSubareas = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $forbidden: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(area.attributes),
    sort_by: schema.ENUM(area.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const addSubareas = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  body: schema.BODY({ subareas: schema.UUID_ARRAY() }, { $length: 1 })
});

export const getSubarea = new Datalizer({
  params: schema.PARAMS(
    { area: schema.UUID(), subarea: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(area.attributes),
    include: schema.INCLUDE(area.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateSubarea = new Datalizer({
  params: schema.PARAMS(
    { area: schema.UUID(), subarea: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    area_id: schema.UUID({ $optional: true, $deny: true }),
    subarea_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteSubarea = new Datalizer({
  params: schema.PARAMS(
    { area: schema.UUID(), subarea: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getWorkers = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    code: schema.CODE({ $optional: true }),
    firstname: schema.TEXT_FILTER({ $optional: true }),
    lastname: schema.TEXT_FILTER({ $optional: true }),
    is_supervisor: schema.NUMBER({
      $optional: true,
      $zero: true,
      $min: 0,
      $max: 1
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(worker.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    sort_by: schema.ENUM(worker.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 36 })
});

export const addWorkers = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
  body: schema.BODY({ workers: schema.UUID_ARRAY() }, { $length: 1 })
});

export const getWorker = new Datalizer({
  params: schema.PARAMS({
    area: schema.UUID(),
    worker: schema.UUID()
  }, { $length: 2 }),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(worker.attributes),
    include: schema.INCLUDE(worker.associations)
  }, { $max: 20 })
});

export const updateWorker = new Datalizer({
  params: schema.PARAMS(
    { area: schema.UUID(), worker: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    area_id: schema.UUID({ $optional: true, $deny: true }),
    worker_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteWorker = new Datalizer({
  params: schema.PARAMS(
    { area: schema.UUID(), worker: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getServices = new Datalizer({
  params: schema.PARAMS({ area: schema.UUID() }, { $length: 1 }),
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

export const getService = new Datalizer({
  params: schema.PARAMS({
    area: schema.UUID(),
    service: schema.UUID()
  }, { $length: 2 }),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(service.attributes),
    include: schema.INCLUDE(service.associations)
  }, { $max: 20 })
});
