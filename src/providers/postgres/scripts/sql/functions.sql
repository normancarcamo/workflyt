-- category -------------------------------------------------------------------

drop function if exists category_code_trigger_fn() cascade;

create or replace function category_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'CAT',null,'000',
    '{p}/{s}',
    'category_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- company --------------------------------------------------------------------

drop function if exists company_code_trigger_fn() cascade;

create or replace function company_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'COM',null,'000',
    '{p}/{s}',
    'company_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- customer -------------------------------------------------------------------

drop function if exists customer_code_trigger_fn() cascade;

create or replace function customer_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'CUS',null,'000',
    '{p}/{s}',
    'customer_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- department -----------------------------------------------------------------

drop function if exists department_code_trigger_fn() cascade;

create or replace function department_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'DEP',null,'000',
    '{p}/{s}',
    'department_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- employee -------------------------------------------------------------------

drop function if exists employee_code_trigger_fn() cascade;

create or replace function employee_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'EMP',null,'000',
    '{p}/{s}',
    'employee_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- item -----------------------------------------------------------------------

drop function if exists item_code_trigger_fn() cascade;

create or replace function item_code_trigger_fn()
returns trigger as $body$
declare
  _sequence text;
  _prefix text;
begin
  if (lower(new.type::text) = 'material') then
    _sequence := 'item_material_code_sequence';
    _prefix := 'MAT';
  elsif (lower(new.type::text) = 'product') then
    _sequence := 'item_product_code_sequence';
    _prefix := 'PRO';
  else
    _sequence := 'item_service_code_sequence';
    _prefix := 'SER';
  end if;

  new.code := gen_code_sequence_fn(
    _prefix,null,'000',
    '{p}/{s}',_sequence,
    new.created_at::timestamp
  );

  return new;
end
$body$ language 'plpgsql' stable;

-- order ----------------------------------------------------------------------

drop function if exists order_code_trigger_fn() cascade;

create or replace function order_code_trigger_fn()
returns trigger as $body$
declare
  _sequence text;
  _prefix text;
begin
  if (lower(new.type::text) = 'installation') then
    _sequence := 'order_installation_code_sequence';
    _prefix := 'ORI';
  else
    _sequence := 'order_work_code_sequence';
    _prefix := 'ORW';
  end if;

  new.code := gen_code_sequence_fn(
    _prefix,null,'000',
    '{p}/{s}',_sequence,
    new.created_at::timestamp
  );

  return new;
end
$body$ language 'plpgsql' stable;

-- permission -----------------------------------------------------------------

drop function if exists permission_code_trigger_fn() cascade;

create or replace function permission_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'PER',null,'000',
    '{p}/{s}', 'permission_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- quote ----------------------------------------------------------------------

drop function if exists quote_code_trigger_fn() cascade;

create or replace function quote_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'QUO','YY','000',
    '{p}-{d}/{s}',
    'quote_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- role -----------------------------------------------------------------------

drop function if exists role_code_trigger_fn() cascade;

create or replace function role_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'ROL',null,'000',
    '{p}/{s}',
    'role_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- supplier -------------------------------------------------------------------

drop function if exists supplier_code_trigger_fn() cascade;

create or replace function supplier_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'SUP',
    null,
    '000',
    '{p}/{s}',
    'supplier_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- user -----------------------------------------------------------------------

drop function if exists user_code_trigger_fn() cascade;

create or replace function user_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'USR',null,'000',
    '{p}/{s}',
    'user_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- warehouse ------------------------------------------------------------------

drop function if exists warehouse_code_trigger_fn() cascade;

create or replace function warehouse_code_trigger_fn()
returns trigger as $body$
begin
  new.code := gen_code_sequence_fn(
    'WRH',null,'000',
    '{p}/{s}',
    'warehouse_code_sequence',
    new.created_at::timestamp
  );
  return new;
end
$body$ language 'plpgsql' stable;

-- utils ----------------------------------------------------------------------

drop function if exists get_template_name() cascade;
create or replace function get_template_name()
returns text as
$body$
declare
  val text;
begin
  val := (select current_setting('template_name'));

  if (val = current_database()) then
    return 'template0';
  else
    return val;
  end if;

  exception when others then
    if (SQLERRM ~* 'unrecognized configuration parameter') then
      return 'template0';
    else
      return SQLERRM;
    end if;
end
$body$
language 'plpgsql' stable;

drop function if exists get_schema_size(text) cascade;
create or replace function get_schema_size(text)
returns bigint as
$body$
  select
    coalesce(sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint, 0)
  from pg_tables
  where schemaname = $1;
$body$
language sql;

drop function if exists count_table_rows(text, text) cascade;
create or replace function count_table_rows(_schema_name text, _table_name text)
returns integer as
$body$
  declare _records int := 0;
  begin
    execute (select format(
      'select count(*) from %s.%s',
      _schema_name,
      _table_name
    )) into _records;
    return _records;
  end;
$body$
language 'plpgsql';

drop function if exists count_schema_rows(text) cascade;
create or replace function count_schema_rows(_schema_name text)
returns integer as
$body$
  declare
    _total int := 0;
    _record record;
    _rows int := 0;
  begin
    for _record in
      select *
      from pg_catalog.pg_tables
      where schemaname = _schema_name
      and tablename !~* 'sequelize'
    loop
      _rows := 0;
      execute (select format(
        'select count(*) from %s.%s',
        _record.schemaname,
        _record.tablename
      )) into _rows;
      _total := _total + _rows;
    end loop;
    return _total;
  end;
$body$
language 'plpgsql';

drop function if exists gen_code_sequence_fn(text, text, text, text, text, timestamp) cascade;

create or replace function gen_code_sequence_fn(
  _prefix text,
  _date_format text,
  _padding text,
  _template text,
  _sequence text,
  _timestamp timestamp
)
returns text as $body$
declare
  _last_value int;
  _value text;
begin
  -- get last value of the sequence:
  execute 'select last_value from ' || _sequence into _last_value;

  -- normalize padding using last_value as length:
  if (length(_last_value::varchar) > length(_padding)) then
    _padding := repeat('0', length(_last_value::varchar));
  end if;

  -- get next value of the sequence:
  _value := nextval(_sequence);

  -- normalize padding using code as length:
  if (length(_value) > length(_padding)) then
    _padding := repeat('0', length(_padding) + 1);
  end if;

  -- apply padding:
  _value := concat(
    substring(_padding, 1, length(_padding) - length(_value)), _value
  );

  -- apply template:
  if _date_format is null then
    return replace(replace(_template, '{p}', _prefix), '{s}', _value);
  else
    return replace(
      replace(
        replace(_template, '{p}', _prefix),
        '{d}', to_char(_timestamp, _date_format)
      ), '{s}', _value
    );
  end if;

  -- when error: reset sequence and raise the error:
exception
  when others then
    perform setval(_sequence, _last_value);
    raise exception '%', SQLERRM;
end
$body$ language 'plpgsql' stable;

drop function if exists reset_sequences(text[], integer);

create or replace function reset_sequences(text[], integer default 1)
returns bool as
$body$
begin
  for i in 1..array_length($1, 1) loop
    perform setval($1[i], $2, false);
  end loop;
  return true;
end;
$body$
language 'plpgsql';
