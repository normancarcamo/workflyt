DROP FUNCTION GEN_CODE(PREFIX CHAR(3), TABLE_NAME VARCHAR, SEQ_NAME VARCHAR);

CREATE FUNCTION GEN_CODE(PREFIX CHAR(3), TABLE_NAME VARCHAR, SEQ_NAME VARCHAR)
RETURNS VARCHAR AS
$BODY$
declare
  row_code int;
begin
  execute format('SELECT COALESCE(SUBSTRING(MAX(code) FROM 4), 0::text)::integer FROM %s', TABLE_NAME) into row_code;
  return PREFIX || to_char((row_code + 1), 'fm0000');
end;
$BODY$ language plpgsql VOLATILE;

select GEN_CODE('DEM', 'nz.demo', 'nz.demo_seq');

select last_value from nz.demo_seq;

select to_char(1, 'fm0000');

CREATE TRIGGER check_code
BEFORE INSERT ON nz.demo
FOR EACH ROW
EXECUTE PROCEDURE GEN_CODE('DEM', 'nz.demo');

-- select * from nz.type;
-- select max(code) from nz.type;
--ALTER SEQUENCE nz.demo_seq START WITH 1019;
--ALTER SEQUENCE nz.demo_seq RESTART;
select nextval('nz.demo_seq');
-- setval(regclass, bigint)
select currval('nz.demo_seq');
-- select lastval();

ALTER SEQUENCE nz.demo_seq RESTART WITH 1;

drop sequence if exists nz.demo_seq cascade;
create sequence if not exists nz.demo_seq start 1001;

drop table if exists nz.demo cascade;
create table if not exists nz.demo(
  id serial not null primary key,
  code varchar default 'DEM' || nextval('nz.demo_seq'),
  name varchar,
  unique(code)
);

insert into nz.demo (code, name) values
  ('DEM1001', 'Norman'),
  ('DEM1002', 'Javier'),
  ('DEM1003', 'Vadi'),
  ('DEM1004', 'David'),
  ('DEM1005', 'Elias');

insert into nz.demo (name) values ('otro');

insert into nz.demo (name) values
  ('Norman2'),
  ('Javier2'),
  ('Vadi2'),
  ('David2'),
  ('Elias2');

insert into nz.demo (name) values ('otro5');

insert into nz.demo (code, name) values
  ('DEM1015', 'Norman3'),
  ('DEM1016', 'Javier3'),
  ('DEM1017', 'Vadi3'),
  ('DEM1018', 'David3'),
  ('DEM1019', 'Elias3');

select * from nz.demo;

select currval('nz.demo_seq');

SELECT last_value FROM nz.demo_seq;

SELECT COALESCE(substring(max(code) from 4), 0::text) FROM nz.demo;
