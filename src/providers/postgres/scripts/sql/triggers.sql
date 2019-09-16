-- category -------------------------------------------------------------------

drop trigger if exists category_code_trigger on category cascade;

create trigger category_code_trigger
before insert on category
for each row
execute procedure category_code_trigger_fn();

-- client ---------------------------------------------------------------------

drop trigger if exists client_code_trigger on client cascade;

create trigger client_code_trigger
before insert on client
for each row
execute procedure client_code_trigger_fn();

-- company --------------------------------------------------------------------

drop trigger if exists company_code_trigger on company cascade;

create trigger company_code_trigger
before insert on company
for each row
execute procedure company_code_trigger_fn();

-- area -----------------------------------------------------------------

drop trigger if exists area_code_trigger on area cascade;

create trigger area_code_trigger
before insert on area
for each row
execute procedure area_code_trigger_fn();

-- worker -------------------------------------------------------------------

drop trigger if exists worker_code_trigger on worker cascade;

create trigger worker_code_trigger
before insert on worker
for each row
execute procedure worker_code_trigger_fn();

-- service -------------------------------------------------------------------

drop trigger if exists service_code_trigger on service cascade;

create trigger service_code_trigger
before insert on service
for each row
execute procedure service_code_trigger_fn();

-- job ------------------------------------------------------------------------

drop trigger if exists job_code_trigger on job cascade;

create trigger job_code_trigger
before insert on job
for each row
execute procedure job_code_trigger_fn();

-- material -------------------------------------------------------------------

drop trigger if exists material_code_trigger on material cascade;

create trigger material_code_trigger
before insert on material
for each row
execute procedure material_code_trigger_fn();

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
