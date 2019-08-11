-- category -------------------------------------------------------------------

drop trigger if exists category_code_trigger on category cascade;

create trigger category_code_trigger
before insert on category
for each row
execute procedure category_code_trigger_fn();

-- company --------------------------------------------------------------------

drop trigger if exists company_code_trigger on company cascade;

create trigger company_code_trigger
before insert on company
for each row
execute procedure company_code_trigger_fn();

-- customer -------------------------------------------------------------------

drop trigger if exists customer_code_trigger on customer cascade;

create trigger customer_code_trigger
before insert on customer
for each row
execute procedure customer_code_trigger_fn();

-- department -----------------------------------------------------------------

drop trigger if exists department_code_trigger on department cascade;

create trigger department_code_trigger
before insert on department
for each row
execute procedure department_code_trigger_fn();

-- employee -----------------------------------------------------------------

drop trigger if exists employee_code_trigger on employee cascade;

create trigger employee_code_trigger
before insert on employee
for each row
execute procedure employee_code_trigger_fn();

-- item -----------------------------------------------------------------------

drop trigger if exists item_code_trigger on item cascade;

create trigger item_code_trigger
before insert on item
for each row
execute procedure item_code_trigger_fn();

-- order ----------------------------------------------------------------------

drop trigger if exists order_code_trigger on orders cascade;

create trigger order_code_trigger
before insert on orders
for each row
execute procedure order_code_trigger_fn();

-- permission -----------------------------------------------------------------

drop trigger if exists permission_code_trigger on permission cascade;

create trigger permission_code_trigger
before insert on permission
for each row
execute procedure permission_code_trigger_fn();

-- quote ----------------------------------------------------------------------

drop trigger if exists quote_code_trigger on quote cascade;

create trigger quote_code_trigger
before insert on quote
for each row
execute procedure quote_code_trigger_fn();

-- role -----------------------------------------------------------------------

drop trigger if exists role_code_trigger on role cascade;

create trigger role_code_trigger
before insert on role
for each row
execute procedure role_code_trigger_fn();

-- supplier -------------------------------------------------------------------

drop trigger if exists supplier_code_trigger on supplier cascade;

create trigger supplier_code_trigger
before insert on supplier
for each row
execute procedure supplier_code_trigger_fn();

-- user -----------------------------------------------------------------------

drop trigger if exists user_code_trigger on users cascade;

create trigger user_code_trigger
before insert on users
for each row
execute procedure user_code_trigger_fn();

-- warehouse ------------------------------------------------------------------

drop trigger if exists warehouse_code_trigger on warehouse cascade;

create trigger warehouse_code_trigger
before insert on warehouse
for each row
execute procedure warehouse_code_trigger_fn();

-- ----------------------------------------------------------------------------
