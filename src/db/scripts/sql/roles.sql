drop role if exists dba;

create role dba with
  superuser
  createdb
  createrole
  inherit
  login
  replication
  encrypted
  password 'dba2019'
;

set session authorization dba;
