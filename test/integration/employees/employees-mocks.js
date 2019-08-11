const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/employees/employees-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  employeesAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findAll: async options => setup.instance.employees
    }));
  },
  createRepeatedError: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.Employee.build({
            firstname: 'demo1',
            lastname: 'demo2'
          });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  employeeIsCreated: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      create: data => {
        let { _id } = cycle;
        return setup.models.Employee.build({
          firstname: 'Steve',
          lastname: _id === 1 ? 'Knoxville' : 'Tow',
          created_by: _id === 1 ? null : setup.instance.users[0].id,
          updated_by: _id === 1 ? null : setup.instance.users[0].id
        });
      }
    }));
  },
  employeeIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: async () => {
        let { _id } = cycle;

        if (_id === 1) {
          return setup.instance.employees[2];
        }

        if (_id === 2) {
          return {
            ...setup.instance.employees[2].dataValues,
            user: await setup.instance.employees[2].getUser()
          };
        }

        if (_id === 3) {
          return {
            ...setup.instance.employees[2].dataValues,
            user: await setup.instance.employees[2].getUser(),
            quotes: await setup.instance.employees[2].getQuotes()
          };
        }

        return setup.instance.employees[2];
      }
    }));
  },
  employeeIsUpdated: ({ setup }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      update: async values => [ 1 ]
    }));
  },
  employeeIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      destroy: options => {
        let employee = setup.instance.employees.slice(0, 1)[0];
        let now = new Date().toISOString();
        employee.updated_at = now;
        employee.deleted_at = now;
        return employee;
      },
    }));
  },
  // -------------------------------------------------------
  userIsFound: ({ setup }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getUser: () => setup.instance.users.find(
        user => user.employee_id === setup.instance.employees[0].id
      )
    }));
  },
  userIsSet: ({ setup }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getUser: () => ({}),
      setUser: () => [ 1 ]
    }));
  },
  userIsRemoved: ({ setup }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getUser: () => ({}),
      removeUser: () => [ 1 ]
    }));
  },
  // -------------------------------------------------------
  quotesAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getQuotes: async opts => {
        let { _id } = cycle;
        let employee = setup.instance.employees[2];
        let quotes = await employee.getQuotes({});

        if (_id === 'A') {
          return quotes;
        }

        if (_id === 'B') {
          return quotes.filter(
            q => q.subject === 'Stickers for furniture 2x24'
          );
        }

        if (_id === 'C') {
          return [];
        }

        if (_id === 'D') {
          return quotes.filter(q => q.subject.includes('cker'));
        }

        return [];
      },
    }));
  },
  quotesAreAdded: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      addQuotes: () => ({}),
    }));
  },
  quoteIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getQuote: opts => {
        return setup.instance.quotes.find(
          quote => quote.id === opts.quote_id
            && quote.salesman_id === opts.salesman_id
        );
      }
    }));
  },
  // -------------------------------------------------------
  supervisorsAreFiltered: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getSupervisors: async opts => {
        let { _id } = cycle;
        let employee = setup.instance.employees[0];
        let supervisors = await employee.getSupervisors({});

        if (_id === 'A') {
          return supervisors;
        }

        if (_id === 'B') {
          return supervisors.filter(
            supervisor => supervisor.firstname === 'Javier'
          );
        }

        if (_id === 'C') {
          return [];
        }

        if (_id === 'D') {
          return supervisors.filter(
            supervisor => supervisor.firstname.includes('nis')
          );
        }

        return [];
      },
    }));
  },
  supervisorsAreAdded: opts => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      addSupervisors: opts => 'ok'
    }));
  },
  supervisorIsFound: ({ setup }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getSupervisor: () => setup.instance.employees.find(
        s => s.firstname === 'Denis'
      )
    }));
  },
  supervisorIsUpdated: ({ setup }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => ({}),
      getSupervisor: () => ({}),
      updateSupervisor: opts => [ 1 ]
    }));
  },
  supervisorIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/employees/employees-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      getSupervisor: () => ({}),
      removeSupervisor: () => [ 1 ]
    }));
  },
};
