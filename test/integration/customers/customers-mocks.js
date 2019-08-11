const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/customers/customers-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  customersAreFiltered: ({ cycle, setup }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findAll: async options => {
        let { _id } = cycle;

        if (_id === 1) {
          return setup.instance.customers.slice(0);
        }

        if (_id === 2) {
          return setup.instance.customers.filter(
            customer => customer.name === 'Jetstereo'
          );
        }

        if (_id === 3) {
          return setup.instance.customers.filter(
            customer => customer.name.includes('tereo')
          );
        }

        return [];
      }
    }));
  },
  createRepeatedError: ({ cycle, setup }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.Customer.build({ name: 'demo' });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  customerIsCreated: ({ setup, cycle }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      create: data => {
        let { _id } = cycle;
        if (_id === 1) {
          return setup.models.Customer.build({
            name: 'demo',
            created_by: null
          });
        } else {
          return setup.models.Customer.build({
            name: 'anonym',
            created_by: setup.instance.users[0].id
          });
        }
      }
    }));
  },
  customerIsFound: ({ setup }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findByPk: () => setup.instance.customers[0].dataValues
    }));
  },
  customerIsUpdated: ({ setup }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findByPk: () => ({}),
      update: values => setup.models.Customer.build({
        ...setup.instance.customers[0].dataValues,
        ...values.data
      })
    }));
  },
  customerIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      destroy: options => {
        let customer = setup.instance.customers.slice(0, 1)[0];
        let now = new Date().toISOString();
        customer.updated_at = now;
        customer.deleted_at = now;
        return customer;
      },
    }));
  },
  quotesAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findByPk: () => ({}),
      getQuotes: async opts => {
        let { _id } = cycle;
        let customer = setup.instance.customers[2];
        let quotes = await customer.getQuotes({});

        if (_id === 'A') {
          return quotes;
        }

        if (_id === 'B') {
          return quotes.filter(q => q.subject.includes('wall'));
        }

        if (_id === 'C') {
          return [];
        }

        if (_id === 'D') {
          return quotes.filter(q => q.subject.includes('door'));
        }

        return [];
      },
    }));
  },
  quotesAreAdded: opts => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findByPk: () => ({}),
      addQuotes: () => ({}),
    }));
  },
  quoteIsFound: ({ setup }) => {
    jest.doMock('src/core/customers/customers-repository', () => db => ({
      findByPk: () => ({}),
      getQuote: () => setup.instance.quotes.find(
        quote => quote.customer_id === setup.instance.customers[0].id
      )
    }));
  }
};
