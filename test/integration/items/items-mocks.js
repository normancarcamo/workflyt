const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/items/items-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  itemsAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findAll: async options => {
        let { _id } = cycle;

        function compare(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
          return 0;
        }

        if (_id === 1) {
          return [].concat(setup.instance.items);
        }

        if (_id === 2) {
          return setup.instance.items.slice(0, 2);
        }

        if (_id === 3) {
          return setup.instance.items.slice(0, 1);
        }

        if (_id === 4) {
          return setup.instance.items.slice(0).sort(compare);
        }

        if (_id === 5) {
          return setup.instance.items.slice(0).sort(compare).reverse();
        }

        if (_id === 6 || _id === 7) {
          let item = setup.instance.items[0];
          return [{ id: item.id, code: item.code, name: item.name }];
        }

        if (_id === 8 || _id === 9) {
          let item = setup.instance.items[0];
          let stocks = await item.getStocks({});
          return [{ ...item.dataValues, stocks }];
        }

        if (_id === 10 || _id === 11) {
          return setup.instance.items.slice(0);
        }

        if (_id === 12) {
          return setup.instance.items.filter(
            item => item.category_id === options.category_id
          );
        }

        if (_id === 13) {
          return setup.instance.items.filter(
            item => item.category_id === options.category_id
          );
        }

        if (_id === 14) {
          return setup.instance.items.filter(
            item => item.name === options.name
          );
        }

        if (_id === 15) {
          let str = options.name.like.replace(/\%/g, '');
          return setup.instance.items.filter(
            item => item.name.includes(str)
          );
        }

        return [];
      }
    }));
  },
  createRepeatedError: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.Item.build({
            firstname: 'demo1',
            lastname: 'demo2'
          });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  itemIsCreated: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      create: data => {
        return setup.models.Item.build({ name: data.name });
      }
    }));
  },
  itemIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findByPk: async opts => {
        return setup.instance.items.find(item => item.id === opts.item_id);
      }
    }));
  },
  itemIsUpdated: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findByPk: () => ({}),
      update: async values => [ 1 ]
    }));
  },
  itemIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      destroy: options => {
        let item = setup.instance.items[0];
        let now = new Date().toISOString();
        item.updated_at = now;
        item.deleted_at = now;
        return item;
      },
    }));
  },
  // -------------------------------------------------------
  stocksAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findByPk: () => ({}),
      getStocks: async opts => {
        let { _id } = cycle;

        if (_id === 1) {
          return setup.instance.stocks;
        }

        if (_id === 2 || _id === 3) {
          return setup.instance.stocks.map(stock => {
            return {
              id: stock.id,
              entries: stock.entries
            };
          });
        }

        if (_id === 4) {
          return setup.instance.stocks.map(stock => {
            return {
              id: stock.id,
              exits: stock.exits
            };
          });
        }

        if (_id < 16) {
          return setup.instance.stocks;
        }

        return [];
      },
    }));
  },
  stocksAreAdded: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findByPk: () => ({}),
      addStocks: () => ({}),
    }));
  },
  stockIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/items/items-repository', () => db => ({
      findByPk: () => ({}),
      getStock: () => setup.instance.stocks[0]
    }));
  }
};
