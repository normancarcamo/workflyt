-- category -------------------------------------------------------------------

insert into category (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'category1', now(), now());
insert into category (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'category2', now(), now());
insert into category (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'category3', now(), now());
insert into category (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'category4', now(), now());
insert into category (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'category5', now(), now());

-- company --------------------------------------------------------------------

insert into company (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'company1', now(), now());
insert into company (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'company2', now(), now());
insert into company (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'company3', now(), now());
insert into company (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'company4', now(), now());
insert into company (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'company5', now(), now());

-- customer -------------------------------------------------------------------

insert into customer (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'customer1', now(), now());
insert into customer (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'customer2', now(), now());
insert into customer (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'customer3', now(), now());
insert into customer (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'customer4', now(), now());
insert into customer (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'customer5', now(), now());

-- department -----------------------------------------------------------------

insert into department (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'department1', now(), now());
insert into department (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'department2', now(), now());
insert into department (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'department3', now(), now());
insert into department (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'department4', now(), now());
insert into department (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'department5', now(), now());

-- employee -------------------------------------------------------------------

insert into employee (id, firstname, lastname, created_at, updated_at)
values (uuid_generate_v4(), 'fisrtname1', 'lastname1', now(), now());
insert into employee (id, firstname, lastname, created_at, updated_at)
values (uuid_generate_v4(), 'fisrtname2', 'lastname2', now(), now());
insert into employee (id, firstname, lastname, created_at, updated_at)
values (uuid_generate_v4(), 'fisrtname3', 'lastname3', now(), now());
insert into employee (id, firstname, lastname, created_at, updated_at)
values (uuid_generate_v4(), 'fisrtname4', 'lastname4', now(), now());
insert into employee (id, firstname, lastname, created_at, updated_at)
values (uuid_generate_v4(), 'fisrtname5', 'lastname5', now(), now());

-- item -----------------------------------------------------------------------

insert into item (id, name, type, created_at, updated_at)
values (uuid_generate_v4(), 'item1', 'product', now(), now());
insert into item (id, name, type, created_at, updated_at)
values (uuid_generate_v4(), 'item2', 'service', now(), now());
insert into item (id, name, type, created_at, updated_at)
values (uuid_generate_v4(), 'item3', 'material', now(), now());
insert into item (id, name, type, created_at, updated_at)
values (uuid_generate_v4(), 'item4', 'product', now(), now());
insert into item (id, name, type, created_at, updated_at)
values (uuid_generate_v4(), 'item5', 'product', now(), now());

-- order ----------------------------------------------------------------------

insert into orders (id, type, status, created_at, updated_at)
values (uuid_generate_v4(), 'work', 'awaiting', now(), now());
insert into orders (id, type, status, created_at, updated_at)
values (uuid_generate_v4(), 'installation', 'awaiting', now(), now());
insert into orders (id, type, status, created_at, updated_at)
values (uuid_generate_v4(), 'work', 'done', now(), now());
insert into orders (id, type, status, created_at, updated_at)
values (uuid_generate_v4(), 'installation', 'cancelled', now(), now());
insert into orders (id, type, status, created_at, updated_at)
values (uuid_generate_v4(), 'work', 'done', now(), now());

-- permission -----------------------------------------------------------------

insert into permission (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'permission1', now(), now());
insert into permission (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'permission2', now(), now());
insert into permission (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'permission3', now(), now());
insert into permission (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'permission4', now(), now());
insert into permission (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'permission5', now(), now());

-- quote ----------------------------------------------------------------------

insert into quote (id, created_at, updated_at)
values (uuid_generate_v4(), now(), now());
insert into quote (id, created_at, updated_at)
values (uuid_generate_v4(), now(), now());
insert into quote (id, created_at, updated_at)
values (uuid_generate_v4(), now(), now());
insert into quote (id, created_at, updated_at)
values (uuid_generate_v4(), now(), now());
insert into quote (id, created_at, updated_at)
values (uuid_generate_v4(), now(), now());

-- role -----------------------------------------------------------------------

insert into role (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'role1', now(), now());
insert into role (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'role2', now(), now());
insert into role (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'role3', now(), now());
insert into role (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'role4', now(), now());
insert into role (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'role5', now(), now());

-- supplier -------------------------------------------------------------------

insert into supplier (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'supplier1', now(), now());
insert into supplier (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'supplier2', now(), now());
insert into supplier (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'supplier3', now(), now());
insert into supplier (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'supplier4', now(), now());
insert into supplier (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'supplier5', now(), now());

-- user -----------------------------------------------------------------------

insert into users (id, username, password, created_at, updated_at)
values (uuid_generate_v4(), 'username1', 'password1', now(), now());
insert into users (id, username, password, created_at, updated_at)
values (uuid_generate_v4(), 'username2', 'password2', now(), now());
insert into users (id, username, password, created_at, updated_at)
values (uuid_generate_v4(), 'username3', 'password3', now(), now());
insert into users (id, username, password, created_at, updated_at)
values (uuid_generate_v4(), 'username4', 'password4', now(), now());
insert into users (id, username, password, created_at, updated_at)
values (uuid_generate_v4(), 'username5', 'password5', now(), now());

-- warehouse ------------------------------------------------------------------

insert into warehouse (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'warehouse1', now(), now());
insert into warehouse (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'warehouse2', now(), now());
insert into warehouse (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'warehouse3', now(), now());
insert into warehouse (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'warehouse4', now(), now());
insert into warehouse (id, name, created_at, updated_at)
values (uuid_generate_v4(), 'warehouse5', now(), now());

-- ----------------------------------------------------------------------------
