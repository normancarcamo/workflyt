const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/warehouses/warehouses-repository', () => database => actions);
}

function compare(name) {
  return function(a, b) {
    if (a[name].toLowerCase() < b[name].toLowerCase())
      return -1;
    if (a[name].toLowerCase() > b[name].toLowerCase())
      return 1;
    return 0;
  }
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  // -------------------------------------------------------
  warehousesAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findAll: async options => {
        index += 1;

        if (index === 1) {
          return setup.instance.warehouses;
        }

        if (index === 2) {
          return setup.instance.warehouses.filter(
            warehouse => warehouse.name === options.name
          );
        }

        if (index === 3) {
          return setup.instance.warehouses.filter(
            warehouse => warehouse.name.includes(
              options.name.like.replace(/\%/g, '')
            )
          );
        }

        if (index === 4) {
          let warehouse = setup.instance.warehouses.find(
            warehouse => warehouse.name.includes(options.name)
          );
          let items = await warehouse.getItems();
          return [{ ...warehouse.dataValues, items }];
        }

        if (index === 5) {
          let warehouse = setup.instance.warehouses.find(
            warehouse => warehouse.name.includes(options.name)
          );
          let items = await warehouse.getItems();
          return [{ ...warehouse.dataValues, items }];
        }

        if ([6,7].includes(index)) {
          let warehouse = setup.data.warehouse.find(
            warehouse => warehouse.name.includes(
              // index === 6 ? 'Animax' : 'Cortex'
              options.name
            )
          );
          return [{
            id: warehouse.id,
            code: warehouse.code,
            name: warehouse.name
          }];
        }

        if (index === 8) {
          return setup.instance.warehouses.slice(0, 2);
        }

        if ([9,10].includes(index)) {
          return setup.instance.warehouses.slice(1);
        }

        return [];
      }
    }));
  },
  warehouseIsCreated: ({ setup }) => {
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      create: data => setup.models.Warehouse.build(data)
    }));
  },
  warehouseIsFound: ({ setup }) => {
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        return setup.instance.warehouses.find(
          warehouse => warehouse.id === warehouse_id
        );
      }
    }));
  },
  warehouseIsUpdated: ({ setup }) => {
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: async ({ warehouse_id, options }) => {
        return setup.instance.warehouses.find(
          warehouse => warehouse.id === warehouse_id
        );
      },
      update: async ({ warehouse_id, data }) => {
        let warehouse = setup.instance.warehouses.find(warehouse => warehouse.id === warehouse_id);
        return {
          ...warehouse.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  warehouseIsDeleted: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.warehouses.find(
            warehouse => warehouse.id === warehouse_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ warehouse_id, options }) => {
        let warehouse = setup.instance.warehouses.find(warehouse => warehouse.id === warehouse_id);
        let now = new Date().toISOString();
        warehouse.updated_at = now;
        warehouse.deleted_at = now;
        return warehouse;
      }
    }));
  },
  // -------------------------------------------------------
  itemsAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        return setup.instance.warehouses.find(
          warehouse => warehouse.id === warehouse_id
        );
      },
      getItems: async ({ warehouse, options }) => {
        index += 1;

        let _warehouse = setup.instance.warehouses[0];
        let items = await _warehouse.getItems({});

        if ([1].includes(index)) {
          return items;
        }

        if ([2].includes(index)) {
          return items.filter(
            item => item.category_id === options.category_id
          );
        }

        if ([3].includes(index)) {
          return items.filter(
            item => item.name === options.name
          );
        }

        if ([4].includes(index)) {
          return items.slice(0, 1);
        }

        if ([5].includes(index)) {
          return items.slice(1, 2);
        }

        if ([6].includes(index)) {
          return items.slice(0).sort(compare('name'));
        }

        if ([7].includes(index)) {
          return items.slice(0).sort(compare('name')).reverse();
        }

        return [];
      }
    }))
  },
  itemsAreAdded: ({ setup }) => {
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        return setup.instance.warehouses.find(
          warehouse => warehouse.id === warehouse_id
        );
      },
      addItems: ({ warehouse_id, items }) => {
        return items.map(item_id => {
          return {
            warehouse_id,
            item_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  itemIsFound: ({ setup }) => {
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        return setup.instance.warehouses.find(
          warehouse => warehouse.id === warehouse_id
        );
      },
      getItem: ({ warehouse, item_id, options }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let WarehouseItem = setup.data.warehouse_item.find(
          oi => oi.warehouse_id === warehouse.id && oi.item_id === item_id
        );
        return { ...item, WarehouseItem };
      }
    }))
  },
  itemIsUpdated: ({ setup }) => {
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        return setup.instance.warehouses.find(
          warehouse => warehouse.id === warehouse_id
        );
      },
      getItem: ({ warehouse, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let WarehouseItem = setup.data.warehouse_item.find(
          oi => oi.warehouse_id === warehouse.id && oi.item_id === item_id
        );
        return { ...item, WarehouseItem };
      },
      updateItem: ({ warehouse_id, item_id, data, options }) => {
        return {
          warehouse_id: warehouse_id,
          item_id: item_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  itemIsRemoved: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/warehouses/warehouses-repository', () => db => ({
      findByPk: ({ warehouse_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.warehouses.find(
            warehouse => warehouse.id === warehouse_id
          );
        } else {
          return null;
        }
      },
      getItem: ({ warehouse, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let WarehouseItem = setup.data.warehouse_item.find(
          oi => oi.warehouse_id === warehouse.id && oi.item_id === item_id
        );
        return { ...item, WarehouseItem };
      },
      removeItem: ({ warehouse_id, item_id, options }) => {
        return {
          warehouse_id: warehouse_id,
          item_id: item_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  }
};
