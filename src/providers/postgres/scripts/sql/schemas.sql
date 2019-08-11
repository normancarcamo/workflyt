-- public ---------------------------------------------------------------------

drop schema if exists public cascade;
create schema if not exists public;
set search_path = public;

-- audit ----------------------------------------------------------------------

drop schema if exists audit cascade;
create schema if not exists audit;
-- set search_path = audit;

-- ----------------------------------------------------------------------------
