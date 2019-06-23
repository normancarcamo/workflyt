import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Department, Employee } = db.sequelize.models;

const departmentAssociations = Object.keys(Department.associations);
const departmentAttributes = Object.keys(Department.attributes);
const employeeAssociations = Object.keys(Employee.associations);
const employeeAttributes = Object.keys(Employee.attributes);

const getDepartments = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
    attributes: shared.ATTRIBUTES(departmentAttributes),
    include: shared.INCLUDE(departmentAssociations),
    sort_by: shared.ENUM(departmentAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const createDepartments = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
});

const getDepartment = new Datalizer({
  params: shared.PARAMS({ department: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(departmentAttributes),
    include: shared.INCLUDE(departmentAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

const updateDepartment = new Datalizer({
  params: shared.PARAMS({ department: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
});

const deleteDepartment = new Datalizer({
  params: shared.PARAMS({ department: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getEmployees = new Datalizer({
  params: shared.PARAMS({ department: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    supervisor_id: shared.UUID({ $optional: true }),
    department_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    firstname: shared.TEXT_FILTER({ $optional: true }),
    lastname: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    attributes: shared.ATTRIBUTES(employeeAttributes),
    paranoid: shared.BOOLEAN({ $optional: true }),
    include: shared.INCLUDE(employeeAssociations),
    sort_by: shared.ENUM(employeeAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 35 })
});

const setEmployees = new Datalizer({
  params: shared.PARAMS({ department: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({ employees: shared.UUID_ARRAY() }, { $length: 1 })
});

const getEmployee = new Datalizer({
  params: shared.PARAMS({
    department: shared.UUID(),
    employee: shared.UUID()
  }, { $length: 2 }),
  query: shared.QUERY({
    paranoid: shared.BOOLEAN({ $optional: true }),
    attributes: shared.ATTRIBUTES(employeeAttributes),
    include: shared.INCLUDE(employeeAssociations)
  }, { $max: 20 })
});

export default {
  getDepartments: shared.validate(getDepartments),
  createDepartments: shared.validate(createDepartments),
  getDepartment: shared.validate(getDepartment),
  updateDepartment: shared.validate(updateDepartment),
  deleteDepartment: shared.validate(deleteDepartment),
  getEmployees: shared.validate(getEmployees),
  setEmployees: shared.validate(setEmployees),
  getEmployee: shared.validate(getEmployee)
};
