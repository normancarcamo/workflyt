drop database if exists workflyt_prod;
create database workflyt_prod with
  owner = 'dba'
  template = 'template0'
  encoding = 'UTF8'
  lc_collate = 'en_US.UTF-8'
  lc_ctype = 'en_US.UTF-8'
  tablespace = 'workflyt_ts'
  allow_connections = true
  connection limit = -1
  is_template = false
;

drop database if exists workflyt_dev;
create database workflyt_dev with
  owner = 'dba'
  template = 'template0'
  encoding = 'UTF8'
  lc_collate = 'en_US.UTF-8'
  lc_ctype = 'en_US.UTF-8'
  tablespace = 'workflyt_ts'
  allow_connections = true
  connection limit = -1
  is_template = false
;

drop database if exists workflyt_test;
create database workflyt_test with
  owner = 'dba'
  template = 'template0'
  encoding = 'UTF8'
  lc_collate = 'en_US.UTF-8'
  lc_ctype = 'en_US.UTF-8'
  tablespace = 'workflyt_ts'
  allow_connections = true
  connection limit = -1
  is_template = false
;

drop database if exists workflyt_stage;
create database workflyt_stage with
  owner = 'dba'
  template = 'template0'
  encoding = 'UTF8'
  lc_collate = 'en_US.UTF-8'
  lc_ctype = 'en_US.UTF-8'
  tablespace = 'workflyt_ts'
  allow_connections = true
  connection limit = -1
  is_template = false
;
