-- category -------------------------------------------------------------------

drop sequence if exists category_code_sequence;
create sequence if not exists category_code_sequence;

-- company --------------------------------------------------------------------

drop sequence if exists company_code_sequence;
create sequence if not exists company_code_sequence;

-- customer -------------------------------------------------------------------

drop sequence if exists customer_code_sequence;
create sequence if not exists customer_code_sequence;

-- department -----------------------------------------------------------------

drop sequence if exists department_code_sequence;
create sequence if not exists department_code_sequence;

-- employee -------------------------------------------------------------------

drop sequence if exists employee_code_sequence;
create sequence if not exists employee_code_sequence;

-- item -----------------------------------------------------------------------

drop sequence if exists item_material_code_sequence;
create sequence if not exists item_material_code_sequence;

drop sequence if exists item_product_code_sequence;
create sequence if not exists item_product_code_sequence;

drop sequence if exists item_service_code_sequence;
create sequence if not exists item_service_code_sequence;

-- order ----------------------------------------------------------------------

drop sequence if exists order_installation_code_sequence;
create sequence if not exists order_installation_code_sequence;

drop sequence if exists order_work_code_sequence;
create sequence if not exists order_work_code_sequence;

-- permission -----------------------------------------------------------------

drop sequence if exists permission_code_sequence;
create sequence if not exists permission_code_sequence;

-- quote ----------------------------------------------------------------------

drop sequence if exists quote_code_sequence;
create sequence if not exists quote_code_sequence;

-- role -----------------------------------------------------------------------

drop sequence if exists role_code_sequence;
create sequence if not exists role_code_sequence;

-- supplier -------------------------------------------------------------------

drop sequence if exists supplier_code_sequence;
create sequence if not exists supplier_code_sequence;

-- user -----------------------------------------------------------------------

drop sequence if exists user_code_sequence;
create sequence if not exists user_code_sequence;

-- warehouse ------------------------------------------------------------------

drop sequence if exists warehouse_code_sequence;
create sequence if not exists warehouse_code_sequence;

-- ----------------------------------------------------------------------------
