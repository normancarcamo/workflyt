-- * Do you want to know where are the postgres *.conf files?
select * from pg_settings where category = 'File Locations';

-- * Do you want to know where are the postgres *.conf files?
-- but you are currently in an error that doesn't allow you
-- to execute the query through a client sql? then:
-- restart the service (only on linux debian falvor)
service postgres restart

-- * If you receive the error: "sorry, too many clients already"
-- then you can restart the service or customize the postgresql.conf
-- file to increase the max connection, path:
nano /etc/postgresql/10/main/postgresql.conf

-- * If you want to see the current value of the search_path:
select * from pg_settings where name = 'search_path';

-- * Do you want to know what version of postgres database is installed?
select version();

-- * Set as "default" a schema:
set search_path = public;

-- * If you want to know what's the default password of postgres then, read this:
-- https://www.liquidweb.com/kb/what-is-the-default-password-for-postgresql/
-- more info about ident vs peer:
-- https://chartio.com/resources/tutorials/how-to-set-the-default-user-password-in-postgresql/
-- The pg_hba.conf File:
-- https://www.postgresql.org/docs/10/auth-pg-hba-conf.html

-- * info about psql utility:
-- https://www.postgresql.org/docs/11/app-psql.html

-- * info about initdb utility:
-- https://www.postgresql.org/docs/10/app-initdb.html

-- * If you are using postgres with docker with the official repository image,
-- then check this to see the options: https://hub.docker.com/_/postgres

-- * If you want to know the environment variables used by Postgres, then:
-- https://www.postgresql.org/docs/10/libpq-envars.html
