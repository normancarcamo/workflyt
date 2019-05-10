-- ---------------------------------------------------------------------- uuid:

drop extension if exists "uuid-ossp" cascade;
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------- dblink:

drop extension if exists dblink cascade;
create extension if not exists dblink;

-- ----------------------------------------------------------------------- fdw:

drop extension if exists postgres_fdw cascade;
create extension if not exists postgres_fdw;
