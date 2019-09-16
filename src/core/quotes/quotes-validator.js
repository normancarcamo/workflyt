const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

export const quote = {
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

export const order = {
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

export const getQuotes = new Datalizer({
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $forbidden: true }),
    client_id: schema.UUID({ $optional: true }),
    salesman_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
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
    offset: schema.OFFSET({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    attributes: schema.ATTRIBUTES(quote.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    sort_by: schema.ENUM(quote.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createQuote = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    client_id: schema.UUID(),
    salesman_id: schema.UUID(),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT({
      $optional: true,
      $max: 100,
      $empty: false,
      $min: 2,
      $default: 'No subject description'
    }),
    status: schema.ENUM([
      'open', 'confirmed', 'other', 'approved',
      'pending', 'awaiting', 'authorized',
      'cancelled', 'done'
    ], { $default: 'awaiting' }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 13, $empty: false })
}, { addKey: false });

export const getQuote = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(quote.attributes),
    include: schema.INCLUDE(quote.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 15 })
});

export const updateQuote = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY(
    { paranoid: schema.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    client_id: schema.UUID({ $optional: true }),
    salesman_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    subject: schema.TEXT({
      $optional: true,
      $max: 100,
      $empty: false,
      $min: 2,
      $default: 'No subject description'
    }),
    status: schema.ENUM([
      'open', 'confirmed', 'other', 'approved',
      'pending', 'awaiting', 'authorized',
      'cancelled', 'done'
    ], { $default: 'awaiting' }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 20, $empty: false })
}, { addKey: false });

export const deleteQuote = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getServices = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID() },
    { $length: 1 }
  ),
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

export const addServices = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID() },
    { $length: 1 }
  ),
  body: schema.BODY(
    { services: schema.UUID_ARRAY() },
    { $length: 1 }
  )
});

export const getService = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID(), service: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(service.attributes),
    include: schema.INCLUDE(service.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateService = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID(), service: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    quote_id: schema.UUID({ $optional: true, $deny: true }),
    service_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteService = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID(), service: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getOrders = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID() },
    { $length: 1 }
  ),
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

export const getOrder = new Datalizer({
  params: schema.PARAMS(
    { quote: schema.UUID(), order: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(order.attributes),
    include: schema.INCLUDE(order.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});
