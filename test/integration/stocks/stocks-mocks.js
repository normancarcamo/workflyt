const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/stocks/stocks-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  // -------------------------------------------------------
  stocksAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/stocks/stocks-repository', () => db => ({
      findAll: async options => {
        index += 1;

        if (index === 1) {
          return setup.instance.stocks;
        }

        if (index === 2) {
          return setup.instance.stocks.filter(
            stock => stock.stock === 100
          );
        }

        if (index === 3) {
          return setup.instance.stocks.filter(
            stock => stock.exits > 1000
          );
        }
      }
    }));
  },
  stockIsCreated: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/stocks/stocks-repository', () => db => ({
      create: data => {
        index += 1;
        return setup.models.Stock.build({
          ...data,
          created_by : index === 1 ? null : data.created_by
        });
      }
    }));
  },
  stockIsFound: ({ setup }) => {
    jest.doMock('src/core/stocks/stocks-repository', () => db => ({
      findByPk: ({ stock_id, options }) => {
        return setup.instance.stocks.find(
          stock => stock.id === stock_id
        );
      }
    }));
  },
  stockIsUpdated: ({ setup }) => {
    jest.doMock('src/core/stocks/stocks-repository', () => db => ({
      findByPk: async ({ stock_id, options }) => {
        return setup.instance.stocks.find(
          stock => stock.id === stock_id
        );
      },
      update: async ({ stock_id, data }) => {
        let stock = setup.instance.stocks.find(stock => stock.id === stock_id);
        return {
          ...stock.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  stockIsDeleted: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/stocks/stocks-repository', () => db => ({
      findByPk: ({ stock_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.stocks.find(
            stock => stock.id === stock_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ stock_id, options }) => {
        let stock = setup.instance.stocks.find(stock => stock.id === stock_id);
        let now = new Date().toISOString();
        stock.updated_at = now;
        stock.deleted_at = now;
        return stock;
      }
    }));
  }
};
