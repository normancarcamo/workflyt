const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/companies/companies-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  companiesAreFiltered: ({ cycle, setup }) => {
    jest.doMock('src/core/companies/companies-repository', () => db => ({
      findAll: async options => {
        let _id = cycle._id;

        if (_id === 1) {
          return setup.instance.companies;
        }

        if ([2,3].includes(_id)) {
          return setup.instance.companies.filter(
            company => company.name === 'Imprimarcas'
          );
        }

        return [];
      }
    }));
  },
  createRepeatedError: ({ cycle, setup }) => {
    jest.doMock('src/core/companies/companies-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.Company.build({ name: 'demo' });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  companyIsCreated: ({ cycle, setup }) => {
    jest.doMock('src/core/companies/companies-repository', () => db => ({
      create: data => {
        let { _id } = cycle;
        return setup.models.Company.build({
          ...data,
          created_by: _id === 1
            ? null
            : setup.instance.users[0].id
        });
      }
    }));
  },
  companyIsFound: ({ setup }) => {
    jest.doMock('src/core/companies/companies-repository', () => db => ({
      findByPk: () => setup.instance.companies[0].dataValues
    }));
  },
  companyIsUpdated: ({ setup }) => {
    jest.doMock('src/core/companies/companies-repository', () => db => ({
      findByPk: () => ({}),
      update: values => setup.models.Company.build({
        ...setup.instance.companies[0].dataValues,
        ...values.data
      })
    }));
  },
  companyIsDeleted: ({ cycle, setup }) => {
    jest.doMock('src/core/companies/companies-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      destroy: options => {
        let company = setup.instance.companies[0];
        let now = new Date().toISOString();
        company.updated_at = now;
        company.deleted_at = now;
        return company;
      }
    }));
  }
};
