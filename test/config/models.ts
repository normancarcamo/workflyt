import faker from 'faker';
import bcrypt from 'bcrypt';
import { models } from './types';

export const area:models.area = Object.freeze({
  id: faker.random.uuid(),
  name: faker.lorem.word(),
});

export const subarea:models.subarea = Object.freeze({
  id: faker.random.uuid(),
  name: faker.lorem.word()
});

export const category:models.category = Object.freeze({
  id: faker.random.uuid(),
  name: faker.commerce.department()
});

export const client:models.client = Object.freeze({
  id: faker.random.uuid(),
  name: faker.company.companyName()
});

export const company:models.company = Object.freeze({
  id: faker.random.uuid(),
  name: faker.company.companyName()
});

export const worker:models.worker = Object.freeze({
  id: faker.random.uuid(),
  firstname: faker.name.findName(),
  lastname: faker.name.lastName()
});

export const salesman:models.salesman = Object.freeze({
  id: faker.random.uuid(),
  firstname: faker.name.findName(),
  lastname: faker.name.lastName()
});

export const supervisor:models.supervisor = Object.freeze({
  id: faker.random.uuid(),
  firstname: faker.name.findName(),
  lastname: faker.name.lastName()
});

export const workerSupervisor:models.workerSupervisor = Object.freeze({
  worker_id: worker.id,
  supervisor_id: supervisor.id
});

export const service:models.service = Object.freeze({
  id: faker.random.uuid(),
  area_id: area.id,
  name: faker.lorem.words(3)
});

export const areaSubarea:models.areaSubarea = Object.freeze({
  area_id: area.id,
  subarea_id: subarea.id
});

export const areaWorker:models.areaWorker = Object.freeze({
  area_id: area.id,
  worker_id: worker.id
});

export const material:models.material = Object.freeze({
  id: faker.random.uuid(),
  category_id: category.id,
  code: 'MTR/001',
  name: faker.commerce.productMaterial()
});

export const stock:models.stock = Object.freeze({
  id: faker.random.uuid(),
  material_id: material.id,
  entries: 5000,
  exits: 4900,
  stocks: 100
});

export const user:models.user = Object.freeze({
  id: faker.random.uuid(),
  worker_id: worker.id,
  code: 'USR/001',
  username: 'lnos54',
  password: bcrypt.hashSync('PASSword.2119', 10)
});

export const quote:models.quote = Object.freeze({
  id: faker.random.uuid(),
  client_id: client.id,
  salesman_id: salesman.id,
  code: 'QUO-19/001',
  subject: 'Stickers for furniture 2x24',
  status: 'confirmed'
});

export const quoteService:models.quoteService = Object.freeze({
  quote_id: quote.id,
  service_id: service.id
});

export const order:models.order = Object.freeze({
  id: faker.random.uuid(),
  quote_id: quote.id,
  code: 'ORD-19/001',
  subject: faker.lorem.words(),
  status: 'cancelled',
  priority: 'medium',
  progress: Math.ceil(Math.random() * 90) / 2 as number
});

export const job:models.job = Object.freeze({
  id: faker.random.uuid(),
  service_id: service.id,
  order_id: order.id,
  code: 'JOB/001',
  details: faker.lorem.words(),
  status: 'working',
  priority: 'medium',
  progress: Math.ceil(Math.random() * 90) / 2 as number,
  units: Math.ceil(Math.random() * 10) as number
});

export const subjob:models.subjob = Object.freeze({
  id: faker.random.uuid(),
  service_id: service.id,
  order_id: order.id,
  code: 'JOB/001',
  details: faker.lorem.words(),
  status: 'working',
  priority: 'medium',
  progress: Math.ceil(Math.random() * 90) / 2 as number,
  units: Math.ceil(Math.random() * 10) as number
});

export const jobSubjob:models.jobSubjob = Object.freeze({
  job_id: job.id,
  subjob_id: subjob.id
});

export const jobWorker:models.jobWorker = Object.freeze({
  job_id: job.id,
  worker_id: worker.id
});

export const jobMaterial:models.jobMaterial = Object.freeze({
  job_id: job.id,
  material_id: material.id
});

export const permission:models.permission = Object.freeze({
  id: faker.random.uuid(),
  code: `PRM/001`,
  name: 'get orders'
});

export const role:models.role = Object.freeze({
  id: faker.random.uuid(),
  code: `ROL/001`,
  name: 'admin'
});

export const rolePermission:models.rolePermission = Object.freeze({
  role_id: role.id,
  permission_id: permission.id
});

export const userRole:models.userRole = Object.freeze({
  user_id: user.id,
  role_id: role.id
});

export const supplier:models.supplier = Object.freeze({
  id: faker.random.uuid(),
  code: `SPL/001`,
  name: 'connect'
});

export const supplierMaterial:models.supplierMaterial = Object.freeze({
  supplier_id: supplier.id,
  material_id: material.id
});

export const warehouse:models.warehouse = Object.freeze({
  id: faker.random.uuid(),
  code: `WRH/001`,
  name: 'villas'
});

export const warehouseMaterial:models.warehouseMaterial = Object.freeze({
  warehouse_id: warehouse.id,
  material_id: material.id
});
