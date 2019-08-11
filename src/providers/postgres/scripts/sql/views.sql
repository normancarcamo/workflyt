-- roles ----------------------------------------------------------------------

drop view if exists roles_view;
create or replace view roles_view as
select * from pg_roles;

-- databases ------------------------------------------------------------------

drop view if exists databases_view;
create or replace view databases_view as
select
  a.*,
  pg_size_pretty(pg_database_size(a.datname)) "size",
  (select version()) "version"
from pg_database as a;

drop view if exists database_view;
create or replace view database_view as
select
  a.datname "name",
  (select count(s.schema_name)
  from information_schema.schemata s
  where s.schema_name !~ 'pg_*'
  and s.schema_name !~* 'information_schema') "schemas",
  (select
    sum(coalesce((select count(tablename)
     from pg_catalog.pg_tables t
     where t.schemaname not in ('pg_catalog','information_schema')
     and t.tablename !~* 'sequelize'
     and t.schemaname = schema_name), 0))
  from information_schema.schemata
  where schema_name !~ 'pg_*' and schema_name !~* 'information_schema') "tables",
  (select sum(count_schema_rows(schema_name))
  from information_schema.schemata
  where schema_name !~ 'pg_*'
  and schema_name !~* 'information_schema') "rows",
  pg_size_pretty(pg_database_size(a.datname)) "size",
  pg_encoding_to_char(a.encoding) "encoding",
  a.datcollate "lc_collate",
  a.datctype "lc_ctype",
  a.datistemplate "is_template",
  a.datallowconn "allow_connection",
  a.datconnlimit "limit_connection",
  user "user",
  has_database_privilege(a.datname, 'create') as "priv_create",
  has_database_privilege(a.datname, 'connect') as "priv_connect",
  has_database_privilege(a.datname, 'temp') as "priv_temp",
  version() "version"
from pg_database as a
where a.datname = current_database();

-- schemas --------------------------------------------------------------------

drop view if exists schemas_view;
create or replace view schemas_view as
select
  schema_name "schema_name",
  count_schema_rows(schema_name) "rows",
  (select count(tablename)
   from pg_catalog.pg_tables t
   where t.schemaname not in ('pg_catalog','information_schema')
   and t.tablename !~* 'sequelize'
   and t.schemaname = schema_name) "tables",
  pg_size_pretty(get_schema_size(schema_name)) "size",
  schema_owner "owner",
  has_schema_privilege(schema_owner, schema_name, 'create') as "priv_create",
  has_schema_privilege(schema_owner, schema_name, 'usage') as "priv_usage"
from information_schema.schemata
where schema_name !~ 'pg_*' and schema_name !~* 'information_schema';

-- tables ---------------------------------------------------------------------

drop view if exists tables_view;
create or replace view tables_view as
select
  t.schemaname "schema",
  t.tablename "table",
  count_table_rows(t.schemaname, t.tablename) "rows",
  pg_size_pretty(pg_total_relation_size(t.tablename::text)) "size",
  t.tableowner "owner",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'select') as "priv_select",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'insert') as "priv_insert",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'update') as "priv_update",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'delete') as "priv_delete",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'truncate') as "priv_truncate",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'references') as "priv_references",
  has_table_privilege(t.tableowner, concat(t.schemaname, '.', t.tablename), 'trigger') as "priv_trigger",
  pg_catalog.obj_description(c.oid) as "comment"
from pg_catalog.pg_tables t
join pg_catalog.pg_class c on c.relname = t.tablename
where t.schemaname not in ('pg_catalog','information_schema')
and t.tablename !~* 'sequelize';

-- columns --------------------------------------------------------------------

drop view if exists columns_view;
create or replace view columns_view as
select
  table_catalog,
  table_schema,
  table_name,
  column_name,
  udt_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length,
  character_octet_length,
  numeric_precision,
  numeric_precision_radix,
  numeric_scale,
  datetime_precision,
  interval_type,
  interval_precision,
  character_set_catalog,
  character_set_schema,
  character_set_name,
  collation_catalog,
  collation_schema,
  collation_name
from information_schema.columns
where table_schema !~* '(^pg_|^information_sc)'
and table_name !~* '(.*trigg.*|_view$|sequelize)'
and data_type !~* 'USER-DEFINED'
order by table_catalog, table_schema, table_name, ordinal_position;

-- functions ------------------------------------------------------------------

drop view if exists functions_view;
create or replace view functions_view as
select
  s.catalog_name "database_name",
  n.nspname "schema_name",
  p.proname "function_name",
  format('(%s)', oidvectortypes(p.proargtypes)) "arguments",
  f.data_type "return",
  f.external_language "language",
  r.rolname "user",
  has_function_privilege(
    format('%I.%I(%s)', n.nspname, p.proname, oidvectortypes(p.proargtypes)),
    'execute'
  ) as "priv_execute",
  p.prosrc "definition"
from pg_proc p
inner join pg_namespace n on n.oid = p.pronamespace
inner join pg_roles r on r.oid = p.proowner
inner join information_schema.schemata s on s.schema_name = n.nspname
inner join information_schema.routines f on f.routine_name = p.proname
where n.nspname !~* '(^pg_|^information_)'
and p.probin is null;

-- sequences ------------------------------------------------------------------

drop view if exists sequences_view;
create or replace view sequences_view as
select * from information_schema.sequences;

-- triggers -------------------------------------------------------------------

drop view if exists triggers_view;
create or replace view triggers_view as
select * from information_schema.triggers;

-- enums ----------------------------------------------------------------------

drop view if exists enums_view;
create or replace view enums_view as
select
  n.nspname as "schema",
  t.typname as "name",
  array_agg(e.enumlabel) "values"
from pg_type t
join pg_enum e on t.oid = e.enumtypid
join pg_catalog.pg_namespace n on n.oid = t.typnamespace
group by "schema","name";

-- indexes --------------------------------------------------------------------

drop view if exists indexes_view;
create or replace view indexes_view as
select *
from pg_indexes
where schemaname not in ('pg_catalog')
and tablename !~* 'sequelize';

-- constraints ----------------------------------------------------------------

drop view if exists constraints_view;
create or replace view constraints_view as
select
  c.nspname as "schema_name",
  b.relname as "table_name",
  array_agg(e.attname order by u.attposition) as "columns_names",
  case
    when array_length(array_agg(e.attname order by u.attposition), 1) > 1
    then true
    else false
  end as "constraint_composite",
  a.contype as "constraint_type",
  a.conname as "constraint_name",
  pg_get_constraintdef(a.oid) as "constraint_definition"
from pg_constraint as a
join pg_class as b on b.oid = a.conrelid
join pg_namespace as c ON c.oid = b.relnamespace
join lateral unnest(a.conkey) with ordinality as u (attnum, attposition) on true
join pg_attribute as e ON (e.attrelid = b.oid and e.attnum = u.attnum)
where b.relname !~* 'sequelize'
group by "schema_name", "table_name", "constraint_type", "constraint_name", "constraint_definition";

-- views ----------------------------------------------------------------------

drop view if exists views_view;
create or replace view views_view as
select *
from information_schema.views
where table_schema not in ('pg_catalog','information_schema');

-- extensions -----------------------------------------------------------------

drop view if exists extensions_view;
create or replace view extensions_view as
select * from pg_extension;

-- domains --------------------------------------------------------------------

drop view if exists domains_view;
create or replace view domains_view as
SELECT *
FROM pg_catalog.pg_type
JOIN pg_catalog.pg_namespace ON pg_namespace.oid = pg_type.typnamespace
WHERE typtype = 'd'
AND nspname not in ('information_schema');

-- servers --------------------------------------------------------------------

drop view if exists foreign_servers_view;
create or replace view foreign_servers_view as
select
  srvname as name,
  fdwname as wrapper,
  srvoptions as options,
  srvowner::regrole as owner,
  has_foreign_data_wrapper_privilege(fdwname, 'usage') "fdw_priv_usage",
  has_server_privilege(srvname, 'usage') "srv_priv_usage"
from pg_foreign_server
join pg_foreign_data_wrapper w on w.oid = srvfdw;

-- tablespaces ----------------------------------------------------------------

drop view if exists tablespaces_view;
create or replace view tablespaces_view as
select oid, *, has_tablespace_privilege(spcname, 'create') "priv_create"
from pg_tablespace;

-- comments -------------------------------------------------------------------

drop view if exists comments_column_view;
create or replace view comments_column_view as
select
  c.table_schema "schema",
  c.table_name "table",
  c.column_name "column",
  b.description "comment"
from pg_catalog.pg_statio_all_tables as a
  inner join pg_catalog.pg_description b on b.objoid = a.relid
  inner join information_schema.columns c on b.objsubid = c.ordinal_position
  and c.table_schema = a.schemaname
  and c.table_name = a.relname
;

-- activity -------------------------------------------------------------------

drop view if exists activity_view;
create or replace view activity_view as
select * from pg_stat_activity;

-- settings -------------------------------------------------------------------

drop view if exists settings_view;
create or replace view settings_view as
select * from pg_settings;

-- ----------------------------------------------------------------------------
