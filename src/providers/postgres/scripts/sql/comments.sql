-- TABLES ---------------------------------------------------------------------

comment on table category is 'This table is meant to store information about categories of items.';
comment on table company is 'This table is meant to store information about the company';
comment on table customer is 'This table is meant to store information about the customers of a company';
comment on table department is 'This table is meant to store information about the departments in a company';
comment on table employee is 'This table is meant to store information about the employees of a company';
comment on table item is 'This table is meant to store information about items';
comment on table order_department is 'This table is meant to store information about between the orders and departments';
comment on table order_item is 'This table is meant to store information about between the orders and items';
comment on table order_item is 'This table is meant to store information about between the orders and employees';
comment on table orders is 'This table is meant to store information about the orders';
comment on table permission is 'This table is meant to store information about the permissions';
comment on table quote is 'This table is meant to store information about quotes';
comment on table quote_item is 'This table is meant to store information between quotes and items';
comment on table role is 'This table is meant to store information about roles';
comment on table role_permission is 'This table is meant to store information between roles and permissions';
comment on table stock is 'This table is meant to store information about the stock';
comment on table supplier is 'This table is meant to store information about the suppliers';
comment on table supplier_item is 'This table is meant to store information between the suppliers and the items';
comment on table user_role is 'This table is meant to store information about the users and their roles';
comment on table users is 'This table is meant to store information about the users';
comment on table warehouse is 'This table is meant to store information about the warehouses a company has';
comment on table warehouse_item is 'This table is meant to store information about the warehouses and items';

-- COLUMNS --------------------------------------------------------------------

comment on column category.code is 'Used to identify each category';
comment on column category.extra is 'Used to store unstructured data for the category';
comment on column company.code is 'Unique code used to identify each company';
comment on column customer.code is 'Unique code used to identify each customer';
comment on column department.code is 'Unique code used to identify each department';
comment on column employee.code is 'Unique code used to identify each employee';
comment on column item.code is 'Unique code used to identify each item';
comment on column orders.code is 'Unique code used to identify each order';
comment on column quote.code is 'Unique code used to identify each quote';
comment on column quote.subject is 'Short subject used to identify each quote';
comment on column role.code is 'Unique code used to identify each role';
comment on column supplier.code is 'Unique code used to identify each supplier';
comment on column users.code is 'Unique code used to identify each user';
comment on column warehouse.code is 'Unique code used to identify each warehouse';
