-- Do you want to know where are the postgres *.conf files?
select * from pg_settings where category = 'File Locations';

-- If you want to see the current value of the search_path:
select * from pg_settings where name = 'search_path';

-- Do you want to know what version of postgres database is installed?
select version();

-- Set as "default" a schema:
set search_path = public;
