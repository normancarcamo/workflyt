-- workflyt -------------------------------------------------------------------

drop tablespace if exists workflyt_ts;

create tablespace workflyt_ts
owner postgres
location '/data/tablespaces/workflyt_ts';

set default_tablespace = workflyt_ts;

-- ----------------------------------------------------------------------------
