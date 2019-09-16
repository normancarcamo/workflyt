const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

export const client = {
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
  associations: [ 'quotes' ]
};

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

export const getClients = new Datalizer({
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
    attributes: schema.ATTRIBUTES(client.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    sort_by: schema.ENUM(client.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { max: 30 })
});

export const createClient = new Datalizer({
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
  }, { $max: 10 })
}, { addKey: false });

export const getClient = new Datalizer({
  params: schema.PARAMS({ client: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(client.attributes),
    include: schema.INCLUDE(client.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateClient = new Datalizer({
  params: schema.PARAMS({ client: schema.UUID() }, { $length: 1 }),
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

export const deleteClient = new Datalizer({
  params: schema.PARAMS({ client: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

export const getQuotes = new Datalizer({
  params: schema.PARAMS({ client: schema.UUID() }, { $length: 1 }),
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

export const getQuote = new Datalizer({
  params: schema.PARAMS({
    client: schema.UUID(),
    quote: schema.UUID()
  }, { $length: 2 }),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true }),
    attributes: schema.ATTRIBUTES(quote.attributes),
    include: schema.INCLUDE(quote.associations)
  }, { $max: 20 })
});
