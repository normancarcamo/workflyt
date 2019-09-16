-- category -------------------------------------------------------------------

-- primary key: id

alter table category
drop constraint if exists category_pkey;
alter table category
add constraint category_pkey
primary key(id);

-- unique: code

alter table category
drop constraint if exists category_code_key;
alter table category
add constraint category_code_key
unique (code);

-- unique: name

alter table category
drop constraint if exists category_name_key;
alter table category
add constraint category_name_key
unique (name);

-- foreign key: parent_id

alter table category
add constraint category_parent_id_fkey
foreign key (parent_id)
references category(id)
on update cascade
on delete set null;

-- foreign key: created_by

alter table category
add constraint category_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table category
add constraint category_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table category
add constraint category_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- company --------------------------------------------------------------------

-- primary key: id

alter table company
drop constraint if exists company_pkey;
alter table company
add constraint company_pkey
primary key (id);

-- unique: code

alter table company
drop constraint if exists company_code_key;
alter table company
add constraint company_code_key
unique (code);

-- unique: name

alter table company
drop constraint if exists company_name_key;
alter table company
add constraint company_name_key
unique (name);

-- foreign key: created_by

alter table company
add constraint company_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table company
add constraint company_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table company
add constraint company_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- customer -------------------------------------------------------------------

-- primary key: id

alter table customer
drop constraint if exists customer_pkey;
alter table customer
add constraint customer_pkey
primary key (id);

-- unique: code

alter table customer
drop constraint if exists customer_code_key;
alter table customer
add constraint customer_code_key
unique (code);

-- unique: name

alter table customer
drop constraint if exists customer_name_key;
alter table customer
add constraint customer_name_key
unique (name);

-- foreign key: created_by
alter table customer
drop constraint if exists customer_created_by_fkey;
alter table customer
add constraint customer_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table customer
drop constraint if exists customer_updated_by_fkey;
alter table customer
add constraint customer_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table customer
drop constraint if exists customer_deleted_by_fkey;
alter table customer
add constraint customer_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- deparment ------------------------------------------------------------------

-- primary key: id

alter table department
drop constraint if exists department_pkey;
alter table department
add constraint department_pkey
primary key (id);

-- unique: code

alter table department
drop constraint if exists department_code_key;
alter table department
add constraint department_code_key
unique (code);

-- unique: name

alter table department
drop constraint if exists department_name_key;
alter table department
add constraint department_name_key
unique (name);

-- foreign key: created_by
alter table department
drop constraint if exists department_created_by_fkey;
alter table department
add constraint department_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table department
drop constraint if exists department_updated_by_fkey;
alter table department
add constraint department_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table department
drop constraint if exists department_deleted_by_fkey;
alter table department
add constraint department_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- employee -------------------------------------------------------------------

-- primary key: id

alter table employee
drop constraint if exists employee_pkey;
alter table employee
add constraint employee_pkey
primary key (id);

-- unique: code

alter table employee
drop constraint if exists employee_code_key;
alter table employee
add constraint employee_code_key
unique (code);

-- foreign key: department_id

alter table employee
add constraint employee_department_id_fkey
foreign key (department_id)
references department(id)
on update cascade
on delete set null;

-- forein key: supervisor_id

alter table employee
add constraint employee_supervisor_id_fkey
foreign key (supervisor_id)
references employee(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table employee
drop constraint if exists employee_created_by_fkey;
alter table employee
add constraint employee_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table employee
drop constraint if exists employee_updated_by_fkey;
alter table employee
add constraint employee_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table employee
drop constraint if exists employee_deleted_by_fkey;
alter table employee
add constraint employee_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- item -----------------------------------------------------------------------

-- primary key: id

alter table item
drop constraint if exists item_pkey;
alter table item
add constraint item_pkey
primary key (id);

-- unique: code

alter table item
drop constraint if exists item_code_key;
alter table item
add constraint item_code_key
unique (code);

-- unique: name

alter table item
drop constraint if exists item_name_key;
alter table item
add constraint item_name_key
unique (name);

-- foreign key: category_id

alter table item
add constraint item_category_id_fkey
foreign key (category_id)
references category(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table item
drop constraint if exists item_created_by_fkey;
alter table item
add constraint item_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table item
drop constraint if exists item_updated_by_fkey;
alter table item
add constraint item_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table item
drop constraint if exists item_deleted_by_fkey;
alter table item
add constraint item_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- order_item -----------------------------------------------------------------

-- primary key: order_id, item_id

alter table order_item
add constraint order_item_pkey
primary key (order_id, item_id);

-- foreign key: order_id

alter table order_item
add constraint order_item_order_id_fkey
foreign key (order_id)
references orders(id)
on update cascade
on delete set null;

-- foreign key: item_id

alter table order_item
add constraint order_item_item_id_fkey
foreign key (item_id)
references item(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table order_item
drop constraint if exists order_item_created_by_fkey;
alter table order_item
add constraint order_item_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table order_item
drop constraint if exists order_item_updated_by_fkey;
alter table order_item
add constraint order_item_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table order_item
drop constraint if exists order_item_deleted_by_fkey;
alter table order_item
add constraint order_item_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- orders ---------------------------------------------------------------------

-- primary key: id

alter table orders
drop constraint if exists orders_pkey;
alter table orders
add constraint orders_pkey
primary key (id);

-- unique: code

alter table orders
drop constraint if exists orders_code_key;
alter table orders
add constraint orders_code_key
unique (code);

-- foreign key: quote_id

alter table orders
add constraint orders_quote_id_fkey
foreign key (quote_id)
references quote(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table orders
drop constraint if exists orders_created_by_fkey;
alter table orders
add constraint orders_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table orders
drop constraint if exists orders_updated_by_fkey;
alter table orders
add constraint orders_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table orders
drop constraint if exists orders_deleted_by_fkey;
alter table orders
add constraint orders_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- permission -----------------------------------------------------------------

-- primary key: id

alter table permission
drop constraint if exists permission_pkey;
alter table permission
add constraint permission_pkey
primary key (id);

-- unique: code

alter table permission
drop constraint if exists permission_code_key;
alter table permission
add constraint permission_code_key
unique (code);

-- unique: name

alter table permission
drop constraint if exists permission_name_key;
alter table permission
add constraint permission_name_key
unique (name);

-- foreign key: created_by
alter table permission
drop constraint if exists permission_created_by_fkey;
alter table permission
add constraint permission_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table permission
drop constraint if exists permission_updated_by_fkey;
alter table permission
add constraint permission_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table permission
drop constraint if exists permission_deleted_by_fkey;
alter table permission
add constraint permission_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- quote ----------------------------------------------------------------------

-- primary key: id

alter table quote
drop constraint if exists quote_pkey;
alter table quote
add constraint quote_pkey
primary key (id);

-- unique: code

alter table quote
drop constraint if exists quote_code_key;
alter table quote
add constraint quote_code_key
unique (code);

-- foreign key: customer_id

alter table quote
add constraint quote_customer_id_fkey
foreign key (customer_id)
references customer(id)
on update cascade
on delete set null;

-- foreign key: salesman_id

alter table quote
add constraint quote_salesman_id_fkey
foreign key (salesman_id)
references employee(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table quote
drop constraint if exists quote_created_by_fkey;
alter table quote
add constraint quote_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table quote
drop constraint if exists quote_updated_by_fkey;
alter table quote
add constraint quote_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table quote
drop constraint if exists quote_deleted_by_fkey;
alter table quote
add constraint quote_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- quote_item -----------------------------------------------------------------

-- primary key: quote_id, item_id

alter table quote_item
add constraint quote_item_pkey
primary key (quote_id, item_id);

-- foreign key: quote_id

alter table quote_item
add constraint quote_item_quote_id_fkey
foreign key (quote_id)
references quote(id)
on update cascade
on delete set null;

-- foreign key: item_id

alter table quote_item
add constraint quote_item_item_id_fkey
foreign key (item_id)
references item(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table quote_item
drop constraint if exists quote_item_created_by_fkey;
alter table quote_item
add constraint quote_item_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table quote_item
drop constraint if exists quote_item_updated_by_fkey;
alter table quote_item
add constraint quote_item_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table quote_item
drop constraint if exists quote_item_deleted_by_fkey;
alter table quote_item
add constraint quote_item_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- role -----------------------------------------------------------------------

-- primary key: id

alter table role
drop constraint if exists role_pkey;
alter table role
add constraint role_pkey
primary key(id);

-- unique: code

alter table role
drop constraint if exists role_code_key;
alter table role
add constraint role_code_key
unique (code);

-- unique: name

alter table role
drop constraint if exists role_name_key;
alter table role
add constraint role_name_key
unique (name);

-- foreign key: created_by
alter table role
drop constraint if exists role_created_by_fkey;
alter table role
add constraint role_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table role
drop constraint if exists role_updated_by_fkey;
alter table role
add constraint role_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table role
drop constraint if exists role_deleted_by_fkey;
alter table role
add constraint role_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- role_permission ------------------------------------------------------------

-- primary key: role_id, permission_id

alter table role_permission
drop constraint if exists role_permission_pkey;
alter table role_permission
add constraint role_permission_pkey
primary key (role_id, permission_id);

-- foreign key: role_id

alter table role_permission
drop constraint if exists role_permission_role_id_fkey;
alter table role_permission
add constraint role_permission_role_id_fkey
foreign key (role_id)
references role(id)
on update cascade
on delete set null;

-- foreign key: permission_id

alter table role_permission
drop constraint if exists role_permission_permission_id_fkey;
alter table role_permission
add constraint role_permission_permission_id_fkey
foreign key (permission_id)
references permission(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table role_permission
drop constraint if exists role_permission_created_by_fkey;
alter table role_permission
add constraint role_permission_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table role_permission
drop constraint if exists role_permission_updated_by_fkey;
alter table role_permission
add constraint role_permission_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table role_permission
drop constraint if exists role_permission_deleted_by_fkey;
alter table role_permission
add constraint role_permission_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- stock ----------------------------------------------------------------------

-- primary key: id

alter table stock
drop constraint if exists stock_pkey;
alter table stock
add constraint stock_pkey
primary key(id);

-- foreign key: item_id

alter table stock
drop constraint if exists stock_item_id_fkey;
alter table stock
add constraint stock_item_id_fkey
foreign key (item_id)
references item(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table stock
drop constraint if exists stock_created_by_fkey;
alter table stock
add constraint stock_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table stock
drop constraint if exists stock_updated_by_fkey;
alter table stock
add constraint stock_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table stock
drop constraint if exists stock_deleted_by_fkey;
alter table stock
add constraint stock_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- supplier -------------------------------------------------------------------

-- primary key: id

alter table supplier
drop constraint if exists supplier_pkey;
alter table supplier
add constraint supplier_pkey
primary key(id);

-- unique: code

alter table supplier
drop constraint if exists supplier_code_key;
alter table supplier
add constraint supplier_code_key
unique (code);

-- unique: name

alter table supplier
drop constraint if exists supplier_name_key;
alter table supplier
add constraint supplier_name_key
unique (name);

-- foreign key: created_by
alter table supplier
drop constraint if exists supplier_created_by_fkey;
alter table supplier
add constraint supplier_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table supplier
drop constraint if exists supplier_updated_by_fkey;
alter table supplier
add constraint supplier_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table supplier
drop constraint if exists supplier_deleted_by_fkey;
alter table supplier
add constraint supplier_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- supplier_item --------------------------------------------------------------

-- primary key: supplier_id, item_id

alter table supplier_item
drop constraint if exists supplier_item_pkey;
alter table supplier_item
add constraint supplier_item_pkey
primary key (supplier_id, item_id);

-- foreign key: supplier_id

alter table supplier_item
drop constraint if exists supplier_item_supplier_id_fkey;
alter table supplier_item
add constraint supplier_item_supplier_id_fkey
foreign key (supplier_id)
references supplier(id)
on update cascade
on delete set null;

-- foreign key: item_id

alter table supplier_item
drop constraint if exists supplier_item_item_id_fkey;
alter table supplier_item
add constraint supplier_item_item_id_fkey
foreign key (item_id)
references item(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table supplier_item
drop constraint if exists supplier_item_created_by_fkey;
alter table supplier_item
add constraint supplier_item_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table supplier_item
drop constraint if exists supplier_item_updated_by_fkey;
alter table supplier_item
add constraint supplier_item_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table supplier_item
drop constraint if exists supplier_item_deleted_by_fkey;
alter table supplier_item
add constraint supplier_item_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- user_role ------------------------------------------------------------------

-- primary key: user_id, role_id

alter table user_role
drop constraint if exists user_role_pkey;
alter table user_role
add constraint user_role_pkey
primary key (user_id, role_id);

-- foreign key: user_id

alter table user_role
drop constraint if exists user_role_user_id_fkey;
alter table user_role
add constraint user_role_user_id_fkey
foreign key (user_id)
references users(id)
on update cascade
on delete set null;

-- foreign key: role_id

alter table user_role
drop constraint if exists user_role_role_id_fkey;
alter table user_role
add constraint user_role_role_id_fkey
foreign key (role_id)
references role(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table user_role
drop constraint if exists user_role_created_by_fkey;
alter table user_role
add constraint user_role_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table user_role
drop constraint if exists user_role_updated_by_fkey;
alter table user_role
add constraint user_role_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table user_role
drop constraint if exists user_role_deleted_by_fkey;
alter table user_role
add constraint user_role_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- users ----------------------------------------------------------------------

-- primary key: id

alter table users
drop constraint if exists users_pkey;
alter table users
add constraint users_pkey
primary key(id);

-- unique: code

alter table users
drop constraint if exists users_code_key;
alter table users
add constraint users_code_key
unique (code);

-- unique: username

alter table users
drop constraint if exists users_username_key;
alter table users
add constraint users_username_key
unique (username);

-- foreign key: employee_id

alter table users drop constraint if exists users_employee_id_fkey;
alter table users
add constraint users_employee_id_fkey
foreign key (employee_id)
references employee(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table users
drop constraint if exists users_created_by_fkey;
alter table users
add constraint users_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table users
drop constraint if exists users_updated_by_fkey;
alter table users
add constraint users_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table users
drop constraint if exists users_deleted_by_fkey;
alter table users
add constraint users_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- warehouse ------------------------------------------------------------------

-- primary key: id

alter table warehouse
drop constraint if exists warehouse_pkey;
alter table warehouse
add constraint warehouse_pkey
primary key(id);

-- unique: code

alter table warehouse
drop constraint if exists warehouse_code_key;
alter table warehouse
add constraint warehouse_code_key
unique (code);

-- unique: name

alter table warehouse
drop constraint if exists warehouse_name_key;
alter table warehouse
add constraint warehouse_name_key
unique (name);

-- foreign key: created_by
alter table warehouse
drop constraint if exists warehouse_created_by_fkey;
alter table warehouse
add constraint warehouse_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table warehouse
drop constraint if exists warehouse_updated_by_fkey;
alter table warehouse
add constraint warehouse_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table warehouse
drop constraint if exists warehouse_deleted_by_fkey;
alter table warehouse
add constraint warehouse_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-- warehouse_item -------------------------------------------------------------

-- primary key: warehouse_id, item_id

alter table warehouse_item
drop constraint if exists warehouse_item_pkey;
alter table warehouse_item
add constraint warehouse_item_pkey
primary key (warehouse_id, item_id);

-- foreign key: warehouse_id

alter table warehouse_item
drop constraint if exists warehouse_item_warehouse_id_fkey;
alter table warehouse_item
add constraint warehouse_item_warehouse_id_fkey
foreign key (warehouse_id)
references warehouse(id)
on update cascade
on delete set null;

-- foreign key: item_id

alter table warehouse_item
drop constraint if exists warehouse_item_item_id_fkey;
alter table warehouse_item
add constraint warehouse_item_item_id_fkey
foreign key (item_id)
references item(id)
on update cascade
on delete set null;

-- foreign key: created_by
alter table warehouse_item
drop constraint if exists warehouse_item_created_by_fkey;
alter table warehouse_item
add constraint warehouse_item_created_by_fkey
foreign key (created_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: updated_by

alter table warehouse_item
drop constraint if exists warehouse_item_updated_by_fkey;
alter table warehouse_item
add constraint warehouse_item_updated_by_fkey
foreign key (updated_by)
references users(id)
on update cascade
on delete set null;

-- foreign key: deleted_by

alter table warehouse_item
drop constraint if exists warehouse_item_deleted_by_fkey;
alter table warehouse_item
add constraint warehouse_item_deleted_by_fkey
foreign key (deleted_by)
references users(id)
on update cascade
on delete set null;

-------------------------------------------------------------------------------
