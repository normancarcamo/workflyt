-- category

drop table if exists category;
create table if not exists category (
  id uuid not null primary key default uuid_generate_v4(),
  parent_id uuid,
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- company

drop table if exists company;
create table if not exists company (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- customer

drop table if exists customer;
create table if not exists customer (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- department

drop table if exists department;
create table if not exists department (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- employee

drop table if exists employee;
create table if not exists employee (
  id uuid not null primary key default uuid_generate_v4(),
  supervisor_id uuid,
  department_id uuid,
  code varchar(30) not null unique default 'unset',
  firstname varchar(50) not null,
  lastname varchar(50) not null,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- item

drop type if exists enum_item_type;
create type enum_item_type as enum (
  'material',
  'product',
  'service'
);

drop table if exists material;
create table if not exists material (
  id uuid not null primary key default uuid_generate_v4(),
  category_id uuid,
  code varchar(30) not null unique default 'unset',
  name varchar(100) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- order_job

drop table if exists order_job;
create table if not exists order_job (
  order_id uuid not null,
  job_id uuid not null,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- orders

drop type if exists enum_orders_status;
create type enum_orders_status as enum (
  'done',
  'cancelled',
  'working',
  'awaiting'
);

drop table if exists orders;
create table if not exists orders (
  id uuid not null primary key default uuid_generate_v4(),
  quote_id uuid,
  code varchar(30) not null unique default 'unset',
  type enum_item_type default 'service',
  status enum_orders_status default 'awaiting',
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- permission

drop table if exists permission;
create table if not exists permission (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- quote

drop type if exists enum_quote_status;
create type enum_quote_status as enum (
  'open',
  'closed',
  'confirmed',
  'other',
  'approved',
  'pending',
  'awaiting',
  'authorized',
  'cancelled',
  'done'
);

drop table if exists quote;
create table if not exists quote (
  id uuid not null primary key default uuid_generate_v4(),
  customer_id uuid,
  salesman_id uuid,
  code varchar(20) not null unique default 'unset',
  subject varchar default 'No subject',
  status enum_quote_status default 'awaiting',
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- quote_item

drop table if exists quote_item;
create table if not exists quote_item (
  quote_id uuid,
  item_id uuid,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- role

drop table if exists role;
create table if not exists role (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- role_permission

drop table if exists role_permission;
create table if not exists role_permission (
  role_id uuid,
  permission_id uuid,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- stock

drop table if exists stock;
create table if not exists stock (
  id uuid not null primary key default uuid_generate_v4(),
  item_id uuid,
  entries integer not null default 0,
  exits integer not null default 0,
  units integer not null default 0,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- supplier

drop table if exists supplier;
create table if not exists supplier (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- supplier_item

drop table if exists supplier_item;
create table if not exists supplier_item (
  supplier_id uuid,
  item_id uuid,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- user_role

drop table if exists user_role;
create table if not exists user_role (
  user_id uuid not null,
  role_id uuid not null,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- users

drop table if exists users;
create table if not exists users (
  id uuid not null primary key default uuid_generate_v4(),
  employee_id uuid,
  code varchar(30) not null unique default 'unset',
  username varchar(50) not null unique,
  password varchar(40) not null,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- warehouse

drop table if exists warehouse;
create table if not exists warehouse (
  id uuid not null primary key default uuid_generate_v4(),
  code varchar(30) not null unique default 'unset',
  name varchar(50) not null unique,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);

-- warehouse_item

drop table if exists warehouse_item;
create table if not exists warehouse_item (
  warehouse_id uuid not null,
  item_id uuid not null,
  extra jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp,
  created_by uuid,
  updated_by uuid,
  deleted_by uuid
);
