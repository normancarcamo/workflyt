-- Do you want to know where are the postgres *.conf files?
select * from pg_settings where category = 'File Locations';

-- Do you want to know where are the postgres *.conf files?
-- but you are currently in an error that doesn't allow you
-- to execute the query through a client sql? then:
-- restart the service (only on linux debian falvor)
service postgres restart

-- If you receive the error: "sorry, too many clients already"
-- then you can restart the service or customize the postgresql.conf
-- file to increase the max connection, path:
nano /etc/postgresql/10/main/postgresql.conf

-- If you want to see the current value of the search_path:
select * from pg_settings where name = 'search_path';

-- Do you want to know what version of postgres database is installed?
select version();

-- Set as "default" a schema:
set search_path = public;
