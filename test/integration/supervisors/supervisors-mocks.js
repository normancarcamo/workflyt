const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/supervisors/supervisors-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  // -------------------------------------------------------
  supervisorsAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/supervisors/supervisors-repository', () => db => ({
      findAll: async options => {
        index += 1;

        if (index === 1) {
          return setup.instance.employees
            .filter(e => e.is_supervisor === 1)
        }
        if (index === 2) {
          return setup.instance.employees
            .filter(e => e.is_supervisor === 1 && e.firstname === 'Javier')
        }
        if (index === 3) {
          return setup.instance.employees
            .filter(e => e.is_supervisor === 1 && e.firstname.includes('nis'))
        }
        if ([4,5].includes(index)) {
          return setup.instance.employees
            .filter(e => e.is_supervisor === 1)
            .map(e => ({ ...e.dataValues, user: {} }));
        }
        if (index === 6) {
          return setup.instance.employees
            .filter(e => e.is_supervisor === 1);
        }
        if (index === 7) {
          return setup.instance.employees
            .filter(e => e.is_supervisor === 1)
            .filter((e, index) => index === 1);
        }

        return [];
      }
    }));
  },
  supervisorIsFound: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/supervisors/supervisors-repository', () => db => ({
      findByPk: async ({ supervisor_id, options }) => {
        index += 1;

        if (index === 1) {
          return setup.instance.employees[2];
        }

        if (index === 2) {
          return {
            ...setup.instance.employees[2].dataValues,
            user: await setup.instance.employees[2].getUser()
          };
        }

        if (index === 3) {
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
  employeesAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/supervisors/supervisors-repository', () => db => ({
      findByPk: () => ({}),
      getEmployees: async ({ supervisor, options }) => {
        index += 1;
        let _supervisor = setup.instance.employees[3];
        let employees = await _supervisor.getEmployees({});

        if (index === 1) {
          return employees;
        }

        if (index === 2) {
          return employees.filter(
            emp => emp.firstname.includes(options.firstname)
          );
        }

        if (index === 3) {
          return employees.filter(
            emp => emp.firstname.includes(options.firstname)
          );
        }

        if (index === 4) {
          return employees.filter(
            emp => emp.firstname.includes(options.firstname.like.replace(/\%/g, ''))
          );
        }
      }
    }))
  }
};
