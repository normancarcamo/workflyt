import * as schema from 'src/utils/schemas';
import { TSchema } from 'src/utils/types';
import Datalizer from '@ncardez/datalizer';

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

export const getJobs = new Datalizer({
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

export const createJob = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true, $forbidden: true }),
    service_id: schema.UUID({ $optional: true, $null: false }),
    order_id: schema.UUID({ $optional: true, $null: false }),
    code: schema.CODE({ $optional: true }),
    details: schema.TEXT({
      $optional: true,
      $null: true,
      $default: 'No details',
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
    units: schema.NUMBER({
      $negative: false,
      $float: false,
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
    deleted_by: schema.UUID({ $optional: true })
  }, { $empty: false, $max: 30 })
}, { addKey: false });

export const getJob = new Datalizer({
  params: schema.PARAMS({ job: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(job.attributes),
    include: schema.INCLUDE(job.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 3 })
});

export const updateJob = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY(
    { paranoid: schema.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    service_id: schema.UUID({ $optional: true, $deny: true }),
    order_id: schema.UUID({ $optional: true, $deny: true }),
    code: schema.CODE({ $optional: true }),
    details: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
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
    units: schema.NUMBER({
      $negative: false,
      $float: false,
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
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 20, $empty: true })
}, { addKey: false });

export const deleteJob = new Datalizer({
  params: schema.PARAMS({ job: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

export const getSubjobs = new Datalizer({
  params: schema.PARAMS({ job: schema.UUID() }, { $length: 1 }),
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

export const addSubjobs = new Datalizer({
  params: schema.PARAMS({ job: schema.UUID() }, { $length: 1 }),
  body: schema.BODY({ subjobs: schema.UUID_ARRAY() }, { $length: 1 })
});

export const getSubjob = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), subjob: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(job.attributes),
    include: schema.INCLUDE(job.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateSubjob = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), subjob: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    job_id: schema.UUID({ $optional: true, $deny: true }),
    subjob_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteSubjob = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), subjob: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getWorkers = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID() },
    { $length: 1 }
  ),
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
  params: schema.PARAMS(
    { job: schema.UUID() },
    { $length: 1 }
  ),
  body: schema.BODY(
    { workers: schema.UUID_ARRAY() },
    { $length: 1 }
  )
});

export const getWorker = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), worker: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(worker.attributes),
    include: schema.ATTRIBUTES(worker.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateWorker = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), worker: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    job_id: schema.UUID({ $optional: true, $deny: true }),
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
    { job: schema.UUID(), worker: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getMaterials = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    category_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT_FILTER({ $optional: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(material.attributes),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
    sort_by: schema.ENUM(material.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const addMaterials = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID() },
    { $length: 1 }
  ),
  body: schema.BODY(
    { materials: schema.UUID_ARRAY() },
    { $length: 1 }
  )
});

export const getMaterial = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), material: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(material.attributes),
    include: schema.ATTRIBUTES(material.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateMaterial = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), material: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    job_id: schema.UUID({ $optional: true, $deny: true }),
    material_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteMaterial = new Datalizer({
  params: schema.PARAMS(
    { job: schema.UUID(), material: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});
