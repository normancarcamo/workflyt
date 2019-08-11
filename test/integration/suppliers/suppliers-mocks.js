const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/suppliers/suppliers-repository', () => database => actions);
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
  suppliersAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findAll: async options => {
        index += 1;

        if (index === 1) {
          return setup.instance.suppliers;
        }

        if (index === 2) {
          return setup.instance.suppliers.filter(
            supplier => supplier.name === 'Animax'
          );
        }

        if (index === 3) {
          return setup.instance.suppliers.filter(
            supplier => supplier.name.includes('tex')
          );
        }

        if (index === 4) {
          let supplier = setup.instance.suppliers.find(
            supplier => supplier.name.includes('Animax')
          );
          let items = await supplier.getItems();
          return [{ ...supplier.dataValues, items }];
        }

        if (index === 5) {
          let supplier = setup.instance.suppliers.find(
            supplier => supplier.name.includes('Cortex')
          );
          let items = await supplier.getItems();
          return [{ ...supplier.dataValues, items }];
        }

        if ([6,7].includes(index)) {
          let supplier = setup.data.supplier.find(
            supplier => supplier.name.includes(
              index === 6 ? 'Animax' : 'Cortex'
            )
          );
          return [{
            id: supplier.id,
            code: supplier.code,
            name: supplier.name
          }];
        }

        if (index === 8) {
          return setup.instance.suppliers.slice(0, 2);
        }

        if ([9,10].includes(index)) {
          return setup.instance.suppliers.slice(1);
        }

        return [];
      }
    }));
  },
  supplierIsCreated: ({ setup }) => {
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      create: data => setup.models.Supplier.build(data)
    }));
  },
  supplierIsFound: ({ setup }) => {
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        return setup.instance.suppliers.find(
          supplier => supplier.id === supplier_id
        );
      }
    }));
  },
  supplierIsUpdated: ({ setup }) => {
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: async ({ supplier_id, options }) => {
        return setup.instance.suppliers.find(
          supplier => supplier.id === supplier_id
        );
      },
      update: async ({ supplier_id, data }) => {
        let supplier = setup.instance.suppliers.find(supplier => supplier.id === supplier_id);
        return {
          ...supplier.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  supplierIsDeleted: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.suppliers.find(
            supplier => supplier.id === supplier_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ supplier_id, options }) => {
        let supplier = setup.instance.suppliers.find(supplier => supplier.id === supplier_id);
        let now = new Date().toISOString();
        supplier.updated_at = now;
        supplier.deleted_at = now;
        return supplier;
      }
    }));
  },
  // -------------------------------------------------------
  itemsAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        return setup.instance.suppliers.find(
          supplier => supplier.id === supplier_id
        );
      },
      getItems: async ({ supplier, options }) => {
        index += 1;

        let _supplier = setup.instance.suppliers[0];
        let items = await _supplier.getItems({});

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
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        return setup.instance.suppliers.find(
          supplier => supplier.id === supplier_id
        );
      },
      addItems: ({ supplier_id, items }) => {
        return items.map(item_id => {
          return {
            supplier_id,
            item_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  itemIsFound: ({ setup }) => {
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        return setup.instance.suppliers.find(
          supplier => supplier.id === supplier_id
        );
      },
      getItem: ({ supplier, item_id, options }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let SupplierItem = setup.data.supplier_item.find(
          oi => oi.supplier_id === supplier.id && oi.item_id === item_id
        );
        return { ...item, SupplierItem };
      }
    }))
  },
  itemIsUpdated: ({ setup }) => {
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        return setup.instance.suppliers.find(
          supplier => supplier.id === supplier_id
        );
      },
      getItem: ({ supplier, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let SupplierItem = setup.data.supplier_item.find(
          oi => oi.supplier_id === supplier.id && oi.item_id === item_id
        );
        return { ...item, SupplierItem };
      },
      updateItem: ({ supplier_id, item_id, data, options }) => {
        return {
          supplier_id: supplier_id,
          item_id: item_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  itemIsRemoved: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/suppliers/suppliers-repository', () => db => ({
      findByPk: ({ supplier_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.suppliers.find(
            supplier => supplier.id === supplier_id
          );
        } else {
          return null;
        }
      },
      getItem: ({ supplier, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let SupplierItem = setup.data.supplier_item.find(
          oi => oi.supplier_id === supplier.id && oi.item_id === item_id
        );
        return { ...item, SupplierItem };
      },
      removeItem: ({ supplier_id, item_id, options }) => {
        return {
          supplier_id: supplier_id,
          item_id: item_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  }
};
