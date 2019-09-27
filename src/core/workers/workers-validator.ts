import * as schema from 'src/utils/schemas';
import { TSchema } from 'src/utils/types';
import Datalizer from '@ncardez/datalizer';

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

export const quote:TSchema = {
  attributes: [
    'id',
    'client_id',
    'salesman_id',
    'code',
    'subject',
    'status',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'services', 'orders' ]
};

export const user:TSchema = {
  attributes: [
    'id',
    'worker_id',
    'code',
    'username',
    // 'password', omitted by security reasons...
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'roles' ]
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

export const getWorkers = new Datalizer({
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

export const createWorker = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    code: schema.CODE({ $optional: true }),
    firstname: schema.TEXT({ $empty: false, $min: 2 }),
    lastname: schema.TEXT({ $empty: false, $min: 2 }),
    is_supervisor: schema.NUMBER({
      $optional: true,
      $zero: true,
      $min: 0,
      $max: 1,
      $default: 0
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 13, $empty: false })
}, { addKey: false });

export const getWorker = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(worker.attributes),
    include: schema.INCLUDE(worker.associations),
    paranoid: schema.BOOLEAN({ $optional: true }),
  }, { $max: 18 })
});

export const updateWorker = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    code: schema.CODE({ $optional: true }),
    firstname: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
    lastname: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
    is_supervisor: schema.NUMBER({
      $optional: true,
      $zero: true,
      $min: 0,
      $max: 1,
      $default: 0
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $empty: false, $max: 13 })
}, { addKey: false });

export const deleteWorker = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getSupervisors = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
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
  }, { $max: 34 })
});

export const addSupervisors = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
  body: schema.BODY({ supervisors: schema.UUID_ARRAY() }, { $length: 1 })
});

export const getSupervisor = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID(), supervisor: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(worker.attributes),
    include: schema.INCLUDE(worker.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateSupervisor = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID(), supervisor: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    worker_id: schema.UUID({ $optional: true, $deny: true }),
    supervisor_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteSupervisor = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID(), supervisor: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getJobs = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
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

export const addJobs = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
  body: schema.BODY({ jobs: schema.UUID_ARRAY() }, { $length: 1 })
});

export const getJob = new Datalizer({
  params: schema.PARAMS({
    worker: schema.UUID(),
    job: schema.UUID()
  }, { $length: 2 }),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(job.attributes),
    include: schema.INCLUDE(job.associations)
  }, { $max: 20 })
});

export const updateJob = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID(), job: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    worker_id: schema.UUID({ $optional: true, $deny: true }),
    job_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteJob = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID(), job: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getQuotes = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    client_id: schema.UUID({ $optional: true }),
    salesman_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT_FILTER({ $optional: true }),
    status: schema.ENUM([
      'open', 'confirmed', 'other', 'approved', 'pending',
      'awaiting', 'authorized', 'cancelled', 'done'
    ]),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(quote.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(quote.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 34 })
});

export const getQuote = new Datalizer({
  params: schema.PARAMS(
    { worker: schema.UUID(), quote: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(quote.attributes),
    include: schema.INCLUDE(quote.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const getUser = new Datalizer({
  params: schema.PARAMS({ worker: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(user.attributes),
    include: schema.INCLUDE(user.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});
