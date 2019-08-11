const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/quotes/quotes-repository', () => database => actions);
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
  quotesAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findAll: options => {
        index += 1;

        if (index === 1) {
          return setup.instance.quotes;
        }

        if (index === 2) {
          return setup.instance.quotes.filter(
            quote => quote.subject === 'Stickers for furniture 2x24'
          );
        }

        if (index === 3) {
          return setup.instance.quotes.filter(
            quote => quote.subject === 'nnnnnnn'
          );
        }

        if (index === 4) {
          return setup.instance.quotes.filter(
            quote => quote.subject.includes('cker')
          );
        }
      }
    }));
  },
  quoteIsCreated: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      create: data => setup.models.Quote.build(data)
    }));
  },
  quoteIsFound: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      }
    }));
  },
  quoteIsUpdated: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: async ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      update: async ({ quote_id, data }) => {
        let quote = setup.instance.quotes.find(quote => quote.id === quote_id);
        return {
          ...quote.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  quoteIsDeleted: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.quotes.find(
            quote => quote.id === quote_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ quote_id, options }) => {
        let quote = setup.instance.quotes.find(quote => quote.id === quote_id);
        let now = new Date().toISOString();
        quote.updated_at = now;
        quote.deleted_at = now;
        return quote;
      }
    }));
  },
  // -------------------------------------------------------
  itemsAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      getItems: async ({ quote, options }) => {
        index += 1;
        let _quote = setup.instance.quotes[0];
        let items = await _quote.getItems({});

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
          return items.slice(0, 1);
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
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      addItems: ({ quote_id, items }) => {
        return items.map(item_id => {
          return {
            quote_id,
            item_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  itemIsFound: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      getItem: ({ quote, item_id, options }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let QuoteItem = setup.data.quote_item.find(
          oi => oi.quote_id === quote.id && oi.item_id === item_id
        );
        return { ...item, QuoteItem };
      }
    }))
  },
  itemIsUpdated: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      getItem: ({ quote, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let QuoteItem = setup.data.quote_item.find(
          oi => oi.quote_id === quote.id && oi.item_id === item_id
        );
        return { ...item, QuoteItem };
      },
      updateItem: ({ quote_id, item_id, data, options }) => {
        return {
          quote_id: quote_id,
          item_id: item_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  itemIsRemoved: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.quotes.find(
            quote => quote.id === quote_id
          );
        } else {
          return null;
        }
      },
      getItem: ({ quote, item_id }) => {
        let item = setup.data.item.find(item => item.id === item_id);
        let QuoteItem = setup.data.quote_item.find(
          oi => oi.quote_id === quote.id && oi.item_id === item_id
        );
        return { ...item, QuoteItem };
      },
      removeItem: ({ quote_id, item_id, options }) => {
        return {
          quote_id: quote_id,
          item_id: item_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  },
  // -------------------------------------------------------
  ordersAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      getOrders: async ({ quote, options }) => {
        index += 1;
        let _quote = setup.instance.quotes[0];
        let orders = await _quote.getOrders();
        if ([1,2,3,4,5].includes(index)) {
          return orders.slice(0);
        } else{
          return [];
        }
      }
    }))
  },
  ordersAreAdded: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      addOrders: ({ quote_id, orders }) => {
        return orders.map(order_id => {
          return {
            quote_id,
            order_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  orderIsFound: ({ setup }) => {
    jest.doMock('src/core/quotes/quotes-repository', () => db => ({
      findByPk: ({ quote_id, options }) => {
        return setup.instance.quotes.find(
          quote => quote.id === quote_id
        );
      },
      getOrder: ({ quote_id, order_id, options }) => {
        let order = setup.data.order.find(order => order.id === order_id);
        return { ...order };
      }
    }))
  }
};
