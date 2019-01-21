-- ---------------------------------------------------------------------------

Where are my postgres *.conf files?
psql -U postgres -c 'SHOW config_file'

-- ---------------------------------------------------------------------------

Show version of the database in postgres?
select version();

-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS demo(text[]);

CREATE OR REPLACE FUNCTION demo(text[]) RETURNS CHAR(2) AS
$BODY$
  DECLARE
    ELEMENTOS TEXT[];
    ELEMENTO  TEXT[];
    SCH_NAME  VARCHAR(50) := 'nz';
    TBL_NAME  VARCHAR(45);
    PREFIX    VARCHAR(50);
    FUN_NAME   VARCHAR(50);
    SEQ_NAME  VARCHAR(50);
  BEGIN
    <<LOOP_PARENT>>
    FOREACH ELEMENTOS SLICE 2 IN ARRAY $1 LOOP
      <<LOOP_CHILD>>
      FOREACH ELEMENTO SLICE 1 IN ARRAY ELEMENTOS LOOP
        -- PREPARE VALUES:
        SCH_NAME = ELEMENTO[1]; -- example: 'nz'
        TBL_NAME = ELEMENTO[2]; -- example: 'person'
        PREFIX   = ELEMENTO[3]; -- example: 'per'
        FUN_NAME  = SCH_NAME || '.' || TBL_NAME || '_gencode'; -- example: 'nz.person_gencode'
        SEQ_NAME = SCH_NAME || '.' || TBL_NAME || '_seq'; -- example: 'nz.person_seq'
        -- FUNCTION:
        PERFORM (SELECT FORMAT('DROP FUNCTION IF EXISTS %s() CASCADE', FUN_NAME));
        PERFORM (SELECT FORMAT('CREATE FUNCTION %s() RETURNS TRIGGER AS $FN$ BEGIN NEW.code = %s; RETURN NEW; END; $FN$ LANGUAGE plpgsql', FUN_NAME, PREFIX || NEXTVAL(SEQ_NAME)));
        -- TRIGGER:
        PERFORM (SELECT FORMAT('DROP TRIGGER IF EXISTS %s ON %s CASCADE', FUN_NAME, TBL_NAME));
        PERFORM (SELECT FORMAT('CREATE TRIGGER IF NOT EXISTS %s BEFORE INSERT ON %s FOR EACH ROW EXECUTE PROCEDURE %s()', FUN_NAME, TBL_NAME, FUN_NAME));
      END LOOP LOOP_CHILD;
    END LOOP LOOP_PARENT;
    RETURN 'ok';
  END;
$BODY$
LANGUAGE 'plpgsql';

-- USAGE:
select demo('{
  {"nz", "person", "per"},
  {"nz", "employee", "emp"},
}');


-- =============================================================================================================================

-- #1.ROLES
-- https://www.postgresql.org/docs/10/sql-droprole.html
-- https://www.postgresql.org/docs/10/sql-createrole.html
DROP ROLE IF EXISTS dev;
CREATE ROLE dev WITH CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'dev' IN ROLE postgres;

-- #2. USERS
-- https://www.postgresql.org/docs/10/sql-dropuser.html
-- https://www.postgresql.org/docs/10/sql-createuser.html
-- DROP USER IF EXISTS disema_dev;
-- CREATE USER disema_dev WITH CREATEDB CREATEROLE ENCRYPTED PASSWORD 'disema_dev' IN ROLE dev;

-- #3. DATABASES
-- https://www.postgresql.org/docs/10/sql-dropdatabase.html
-- https://www.postgresql.org/docs/10/sql-createdatabase.html
-- https://www.postgresql.org/docs/10/multibyte.html#MULTIBYTE-CHARSET-SUPPORTED (Encoding)
DROP DATABASE IF EXISTS disema_dev;
CREATE DATABASE disema_dev WITH OWNER disema_dev ENCODING 'UTF8';

-- #4. PRIVILEGES - Pending!!!
-- https://www.tutorialspoint.com/postgresql/postgresql_privileges.htm
-- GRANT PRIVILEGE SELECT, INSERT, UPDATE, DELETE, REFERENCES, CREATE, CONNECT, EXECUTE, USAGE
-- ON
-- TO

-- #5. SCHEMA:
drop schema if exists nz cascade;
create schema if not exists nz;

-- #6. SEQUENCES:
create sequence if not exists nz.address_seq start 0000001; -- ADR: address
create sequence if not exists nz.asset_seq start 0000001; -- AST: asset
create sequence if not exists nz.category_seq start 0000001; -- CAT: category
create sequence if not exists nz.city_seq start 0000001; -- CTY: city
create sequence if not exists nz.company_seq start 0000001; -- CMP: company
create sequence if not exists nz.country_seq start 0000001; -- CTR: country
create sequence if not exists nz.customer_seq start 0000001; -- CUS: customer
create sequence if not exists nz.department_seq start 0000001; -- DEP: department
create sequence if not exists nz.discount_seq start 0000001; -- DIS: discount
create sequence if not exists nz.employee_seq start 0000001; -- EMP: employee
create sequence if not exists nz.language_seq start 0000001; -- LNG: language
create sequence if not exists nz.nationality_seq start 0000001; -- NAT: nationality
create sequence if not exists nz.permission_seq start 0000001; -- PRS: permission
create sequence if not exists nz.person_seq start 0000001; -- PER: person
create sequence if not exists nz.phone_seq start 0000001; -- PHO: phone
create sequence if not exists nz.product_seq start 0000001; -- PRD: product
create sequence if not exists nz.productee_seq start 0000001; -- STK: stock *
create sequence if not exists nz.price_seq start 0000001; -- PRC: price
create sequence if not exists nz.quote_seq start 0000001; -- QTE: quote
create sequence if not exists nz.role_seq start 0000001; -- ROL: role
create sequence if not exists nz.sale_seq start 0000001; -- KDX: kardex *
create sequence if not exists nz.social_seq start 0000001; -- SOC: social
create sequence if not exists nz.state_seq start 0000001; -- STE: state
create sequence if not exists nz.status_seq start 0000001; -- STA: status
create sequence if not exists nz.supplier_seq start 0000001; -- SUP: supplier
create sequence if not exists nz.supplierwarehouse_seq start 0000001; -- KDX: kardex *
create sequence if not exists nz.tax_seq start 0000001;
create sequence if not exists nz.type_seq start 0000001; -- TYP: type
create sequence if not exists nz.user_seq start 0000001; -- USR: user
create sequence if not exists nz.warehouse_seq start 0000001; -- WRH: warehouse
create sequence if not exists nz.workorder_seq start 0000001; -- WRD: workorder


-- =============================================================================================================================

-- SCRIPT TO RUN AFTER THE DATABASE AND CONNECTION IS READY:

-- ------------------------------------------------------------------------------------------------------------

drop schema if exists nz cascade;
create schema if not exists nz;
grant all on all tables in schema nz to disema_test with grant option;
grant all on all sequences in schema nz to disema_test with grant option;
grant all on schema nz to disema_test with grant option;

-- ------------------------------------------------------------------------------------------------------------

create sequence if not exists nz.address_seq start 1001; -- ADR: address
create sequence if not exists nz.asset_seq start 1001; -- AST: asset
create sequence if not exists nz.category_seq start 1001; -- CAT: category
create sequence if not exists nz.city_seq start 1001; -- CTY: city
create sequence if not exists nz.company_seq start 1001; -- CMP: company
create sequence if not exists nz.country_seq start 1001; -- CTR: country
create sequence if not exists nz.customer_seq start 1001; -- CUS: customer
create sequence if not exists nz.department_seq start 1001; -- DEP: department
create sequence if not exists nz.discount_seq start 1001; -- DIS: discount
create sequence if not exists nz.employee_seq start 1001; -- EMP: employee
create sequence if not exists nz.language_seq start 1001; -- LNG: language
create sequence if not exists nz.nationality_seq start 1001; -- NAT: nationality
create sequence if not exists nz.permission_seq start 1001; -- PRS: permission
create sequence if not exists nz.person_seq start 1001; -- PER: person
create sequence if not exists nz.phone_seq start 1001; -- PHO: phone
create sequence if not exists nz.product_seq start 1001; -- PRD: product
create sequence if not exists nz.productee_seq start 1001; -- STK: stock *
create sequence if not exists nz.price_seq start 1001; -- PRC: price
create sequence if not exists nz.quote_seq start 1001; -- QTE: quote
create sequence if not exists nz.role_seq start 1001; -- ROL: role
create sequence if not exists nz.sale_seq start 1001; -- KDX: kardex *
create sequence if not exists nz.social_seq start 1001; -- SOC: social
create sequence if not exists nz.state_seq start 1001; -- STE: state
create sequence if not exists nz.status_seq start 1001; -- STA: status
create sequence if not exists nz.supplier_seq start 1001; -- SUP: supplier
create sequence if not exists nz.supplierwarehouse_seq start 1001; -- KDX: kardex *
create sequence if not exists nz.tax_seq start 1001;
create sequence if not exists nz.type_seq start 1001; -- TYP: type
create sequence if not exists nz.user_seq start 1001; -- USR: user
create sequence if not exists nz.warehouse_seq start 1001; -- WRH: warehouse
create sequence if not exists nz.workorder_seq start 1001; -- WRD: workorder

-- ------------------------------------------------------------------------------------------------------------

-- Idea:
-- Check the existence of a sequence in the database.

drop function if exists nz.check_seq(sequence_name text);

create or replace function nz.check_seq(sequence_name text)
returns boolean as
$body$
  begin
    if (select count(c.*) from pg_class c where c.relname = sequence_name) > 0 then
      return true;
    else
      return false;
    end if;
  end;
$body$
language 'plpgsql'
stable;

-- USAGE:
-- select nz.check_seq('person_seq') as "sequence"

-- ------------------------------------------------------------------------------------------------------------

-- Idea:
-- Check the existence of a function in the database.

drop function if exists nz.check_fn(function_name text);

create or replace function nz.check_fn(function_name text)
returns boolean as
$body$
  declare results int := 0;
  begin
    select count(i.routine_name)
    into results
    from information_schema.routines i
    where i.routine_type = 'FUNCTION'
      and i.specific_schema = 'nz'
      and i.routine_name = function_name;
    if results = 0 then
      return false;
    else
      return true;
    end if;
  end;
$body$
language 'plpgsql'
stable;

-- USAGE:
-- select nz.check_fn('check_fn');

-- ------------------------------------------------------------------------------------------------------------

drop function if exists nz.getnext(seq_name varchar(45));

create or replace function nz.getnext(seq_name varchar(45))
returns int as
$$
  declare nextvalue int := 1001;
  begin
    return (select setval(seq_name, (currval(seq_name) + 1), false));
    exception
      when others then
        perform (select nextval(seq_name));
        select currval(seq_name) into nextvalue;
        return nextvalue;
  end;
$$
language plpgsql;

-- USAGE:
-- select nz.getnext('nz.person_seq') "nextval";
-- select setval('nz.person_seq', (currval('nz.person_seq') + 1), false);
select * from nz.person;
select nz.getnext('nz.person_seq');
select currval('nz.person_seq');



-- ------------------------------------------------------------------------------------------------------------

/*
Idea: generate a custom code for records using 3 parameters:
1. schema name
2. table name
3. custom prefix of the table, for example: for person = per, warehouse = wre, etc.

Why? The ORM "Sequelize" can't call "nextval('...')" from the model definition, so
my intention here is the trigger reacts before inserting a record into the database.
The problem here is that I have to allow null in the field of the model definition
to make it work.
*/

DROP FUNCTION IF EXISTS nz.demo(text[]);

CREATE OR REPLACE FUNCTION nz.demo(text[]) RETURNS CHAR(2) AS
$BODY$
  DECLARE
    ELEMENTOS TEXT[];
    ELEMENTO TEXT[];
    SCH_NAME VARCHAR(45);
    TBL_NAME VARCHAR(45);
    PREFIX VARCHAR(5);
    FN_NAME VARCHAR(45);
    TG_NAME VARCHAR(45);
    SEQ_NAME VARCHAR(45);
    FULL_TABLE_NAME VARCHAR(45);
  BEGIN
    <<LOOP_PARENT>>
    FOREACH ELEMENTOS SLICE 2 IN ARRAY $1 LOOP
      <<LOOP_CHILD>>
      FOREACH ELEMENTO SLICE 1 IN ARRAY ELEMENTOS LOOP
        -- VALUES:
        SCH_NAME = ELEMENTO[1]; -- example: 'nz'
        TBL_NAME = ELEMENTO[2]; -- example: 'nz.person'
        PREFIX = ELEMENTO[3]; -- example: 'per'
        TG_NAME = ELEMENTO[2] || '_gencode'; -- example: person_gencode
        FULL_TABLE_NAME = SCH_NAME || '.' || TBL_NAME;
        FN_NAME = FULL_TABLE_NAME || '_gencode'; -- example: 'nz.person_gencode'
        SEQ_NAME = FULL_TABLE_NAME || '_seq'; -- example: 'nz.person_seq'

        -- FUNCTION:
        EXECUTE (
          SELECT FORMAT('DROP FUNCTION IF EXISTS %s() CASCADE;', FN_NAME)
        );
        EXECUTE (
          SELECT FORMAT('
            CREATE FUNCTION %s()
            RETURNS TRIGGER AS
            $FN$
              DECLARE _CODE VARCHAR(10);
              BEGIN
                _CODE = ''%s'' || NEXTVAL(''%s'');
                NEW.code = _CODE;
                RETURN NEW;
              END;
            $FN$
            LANGUAGE ''plpgsql'';', FN_NAME, PREFIX, SEQ_NAME
          )
        );

        -- TRIGGER:
        EXECUTE (
          SELECT FORMAT('
            DROP TRIGGER IF EXISTS %s ON %s CASCADE;', TG_NAME, FULL_TABLE_NAME
          )
        );
        EXECUTE (
          SELECT FORMAT('
            CREATE TRIGGER %s
            BEFORE INSERT
            ON %s
            FOR EACH ROW
            EXECUTE PROCEDURE %s();',
            TG_NAME, FULL_TABLE_NAME, FN_NAME
          )
        );
      END LOOP LOOP_CHILD;
    END LOOP LOOP_PARENT;
    RETURN 'ok';
  END;
$BODY$
LANGUAGE 'plpgsql';

-- USAGE:
select nz.demo('{
  {"nz", "person", "per"}
}');

insert into nz.person(id, firstname, created_at) values (uuid_generate_v4(), 'ddddd', now());

select * from nz.person;

select nz.getnext('nz.person_seq');
select currval('nz.person_seq');

delete from nz.person;

-- ----------------------------------------------------------------------------------------------------------------------------- TRIGGERS

-- #1: Get details about the triggers:
SELECT
  UPPER(trigger_catalog) "database",
  UPPER(trigger_name) "trigger",
  UPPER(action_timing) "time",
  UPPER(event_manipulation) "clause",
  UPPER(CONCAT(event_object_schema, '.', event_object_table)) "on table",
  UPPER(CONCAT(trigger_schema, '.', trigger_name, '()')) "execute"
FROM information_schema.triggers;

-- #2: Get a list of the trigger's name:
SELECT tgname
FROM   pg_trigger
WHERE  tgrelid = 'nz.person'::regclass;

-- ----------------------------------------------------------------------------------------------------------------------------- FUNCTIONS

-- Idea:
-- Get a list of all function of specific schemas, for example public or nz.
SELECT routine_name
FROM information_schema.routines
WHERE routine_type = 'FUNCTION'
  AND specific_schema in ('nz');

drop function if exists nz.person_gencode cascade;
drop function if exists nz.demo cascade;

-- ************************


SELECT
  SPLIT_PART('per,nz.person_seq', ',', 1) "PREFIX",
  SPLIT_PART('per,nz.person_seq', ',', 2) "SEQUENCE";

drop sequence if exists demo;
create sequence if not exists demo start 1001;
select currval('demo'::regclass);
select nextval('demo'::regclass);

-- If you want to see the last value issued from a different session:
SELECT * FROM nz.person_seq;
select * from nz.person;

drop function if exists startdb;

create or replace function startdb()
returns char(2) as
$$
  begin
--    execute (select format('drop schema if exists nz cascade;'));
--    execute (select format('create schema if not exists nz;'));
--    grant all on all tables in schema nz to disema_test with grant option;
--    grant all on all sequences in schema nz to disema_test with grant option;
--    grant all on schema nz to disema_test with grant option;
--    create sequence if not exists nz.person_seq start 1001;
    execute (select format('create sequence if not exists nz.address_seq start 1001;')); -- ADR: address
    execute (select format('create sequence if not exists nz.asset_seq start 1001;')); -- AST: asset
    execute (select format('create sequence if not exists nz.category_seq start 1001;')); -- CAT: category
    execute (select format('create sequence if not exists nz.city_seq start 1001;')); -- CTY: city
    execute (select format('create sequence if not exists nz.company_seq start 1001;')); -- CMP: company
    execute (select format('create sequence if not exists nz.country_seq start 1001;')); -- CTR: country
    execute (select format('create sequence if not exists nz.customer_seq start 1001;')); -- CUS: customer
    execute (select format('create sequence if not exists nz.department_seq start 1001;')); -- DEP: department
    execute (select format('create sequence if not exists nz.discount_seq start 1001;')); -- DIS: discount
    execute (select format('create sequence if not exists nz.employee_seq start 1001;')); -- EMP: employee
    execute (select format('create sequence if not exists nz.language_seq start 1001;')); -- LNG: language
    execute (select format('create sequence if not exists nz.nationality_seq start 1001;')); -- NAT: nationality
    execute (select format('create sequence if not exists nz.permission_seq start 1001;')); -- PRS: permission
    execute (select format('create sequence if not exists nz.person_seq start 1001;')); -- PER: person
    execute (select format('create sequence if not exists nz.phone_seq start 1001;')); -- PHO: phone
    execute (select format('create sequence if not exists nz.product_seq start 1001;')); -- PRD: product
    execute (select format('create sequence if not exists nz.productee_seq start 1001;')); -- STK: stock *
    execute (select format('create sequence if not exists nz.price_seq start 1001;')); -- PRC: price
    execute (select format('create sequence if not exists nz.quote_seq start 1001;')); -- QTE: quote
    execute (select format('create sequence if not exists nz.role_seq start 1001;')); -- ROL: role
    execute (select format('create sequence if not exists nz.sale_seq start 1001;')); -- KDX: kardex *
    execute (select format('create sequence if not exists nz.social_seq start 1001;')); -- SOC: social
    execute (select format('create sequence if not exists nz.state_seq start 1001;')); -- STE: state
    execute (select format('create sequence if not exists nz.status_seq start 1001;')); -- STA: status
    execute (select format('create sequence if not exists nz.supplier_seq start 1001;')); -- SUP: supplier
    execute (select format('create sequence if not exists nz.supplierwarehouse_seq start 1001;')); -- KDX: kardex *
    execute (select format('create sequence if not exists nz.tax_seq start 1001;'));
    execute (select format('create sequence if not exists nz.type_seq start 1001;')); -- TYP: type
    execute (select format('create sequence if not exists nz.user_seq start 1001;')); -- USR: user
    execute (select format('create sequence if not exists nz.warehouse_seq start 1001;')); -- WRH: warehouse
    execute (select format('create sequence if not exists nz.workorder_seq start 1001;')); -- WRD: workorder
    return 'ok';
  end;
$$
language 'plpgsql';

select startdb();

select * from nz.person;

select * from nz.nationality;

SELECT *
FROM information_schema.columns
WHERE table_schema = 'nz'
  AND table_name   = 'bingo';

SELECT obj_description(oid)
FROM pg_class
WHERE relkind = 'r';

drop table nz.bingo;
create table nz.bingo( name text, tipo TINYINT );
comment on table nz.bingo is 'This is my table.';

3. Agrega esto a las notas de la base de dastos!: select * from pg_stat_activity;
