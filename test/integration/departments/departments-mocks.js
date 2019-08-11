const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/departments/departments-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  departmentsAreFiltered: ({ cycle, setup }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findAll: async options => {
        let { _id } = cycle;

        if (_id === 1) {
          return setup.instance.departments;
        }
        if (_id === 2) {
          return setup.instance.departments.filter(
            department => department.name.includes('Art')
          );
        }
        if (_id === 3) {
          return setup.instance.departments.filter(
            department => department.name.includes('tin')
          );
        }
        return [];
      }
    }));
  },
  createRepeatedError: ({ cycle, setup }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.Department.build({ name: 'demo' });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  departmentIsCreated: ({ setup, cycle }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      create: data => {
        let { _id } = cycle;
        if (_id === 1) {
          return setup.models.Department.build({
            name: 'demo',
            created_by: null
          });
        } else {
          return setup.models.Department.build({
            name: 'anonym',
            created_by: setup.instance.users[0].id
          });
        }
      }
    }));
  },
  departmentIsFound: ({ setup }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => setup.instance.departments[0].dataValues
    }));
  },
  departmentIsUpdated: ({ setup }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => ({}),
      update: values => setup.models.Department.build({
        ...setup.instance.departments[0].dataValues,
        ...values.data
      })
    }));
  },
  departmentIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      destroy: options => {
        let department = setup.instance.departments.slice(0, 1)[0];
        let now = new Date().toISOString();
        department.updated_at = now;
        department.deleted_at = now;
        return department;
      },
    }));
  },
  employeesAreFiltered: ({ setup, cycle }) => {
    let department = setup.instance.departments[2];
    let employees = setup.instance.employees;

    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => ({}),
      getEmployees: async opts => {
        let { _id } = cycle;

        if (_id === 'A') {
          return employees;
        }

        if (_id === 'B') {
          return employees.filter(
            employee => employee.firstname.includes('Javier')
          );
        }

        if (_id === 'C') {
          return [];
        }

        if (_id === 'D') {
          return employees.filter(
            employee => employee.firstname.includes('nis')
          );
        }

        return [];
      },
    }));
  },
  employeesAreAdded: opts => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => ({}),
      addEmployees: opts => 'ok'
    }));
  },
  employeeIsFound: ({ setup }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => ({}),
      getEmployee: () => setup.instance.employees[0]
    }));
  },
  employeeIsUpdated: ({ setup }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => ({}),
      getEmployee: () => ({}),
      updateEmployee: opts => {
        return {
          ...setup.instance.employees[0].dataValues,
          ...opts.data,
          updated_at: new Date().toISOString()
        };
      }
    }));
  },
  employeeIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/departments/departments-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      getEmployee: () => ({}),
      removeEmployee: () => 1
    }));
  },
};
