const Validator = require('src/core/warehouses/warehouses-validator');

const Schema = {
  UUID: values => ({ ...values }),
  UUID_ARRAY: values => ({ ...values }),
  CODE: values => ({ ...values }),
  TEXT: values => ({ ...values }),
  TEXT_FILTER: values => ({ ...values }),
  EXTRA: values => ({ ...values }),
  NUMBER: values => ({ ...values }),
  NUMBER_FILTER: values => ({ ...values }),
  DATE: values => ({ ...values }),
  DATE_FILTER: values => ({ ...values }),
  OFFSET: values => ({ ...values }),
  LIMIT: values => ({ ...values }),
  ATTRIBUTES: values => ({ ...values }),
  INCLUDE: values => ({ ...values }),
  BOOLEAN: values => ({ ...values }),
  ENUM: values => ({ ...values }),
  PRICE: values => ({ ...values }),
  PRICE_FILTER: values => ({ ...values }),
  ORDER_BY: values => ({ ...values }),
  QUERY: values => ({ ...values }),
  BODY: values => ({ ...values }),
  PARAMS: values => ({ ...values }),
};

describe('Validator', () => {
  it('should module be a factory function', () => {
    expect(Validator).toBeFunction();
  });
  it('should throw error when Datalizer is not passed in as argument', () => {
    expect(x => Validator({})).toThrow();
  });
  it('should return an object when function is invoked', () => {
    expect(Validator({ schema: Schema, Datalizer: function(schema) {} }))
      .toBeObject()
      .not.toBeEmpty()
      .toContainAllKeys([
        'getWarehouses',
        'createWarehouses',
        'getWarehouse',
        'updateWarehouse',
        'deleteWarehouse',
        'getItems',
        'addItems',
        'getItem',
        'updateItem',
        'removeItem'
      ]);
  });
});
