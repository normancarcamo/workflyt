-- TABLES ---------------------------------------------------------------------

-- area:
comment on table area is 'Information about areas';
comment on table area_subarea is 'Associations between areas and subareas';
comment on table area_worker is 'Associations between areas and workers';

-- category:
comment on table category is 'Information about categories.';

-- client:
comment on table client is 'Information about clients';

-- company:
comment on table company is 'Information about company';

-- job:
comment on table job is 'Information about jobs';
comment on table job_material is 'Associations between jobs and materials';
comment on table job_subjob is 'Associations between jobs and subjobs';
comment on table job_worker is 'Associations between jobs and workers';

-- material:
comment on table material is 'Information about materials';

-- orders:
comment on table orders is 'Information about orders';

-- permission:
comment on table permission is 'Information about permissions';

-- quote:
comment on table quote is 'Information about quotes';
comment on table quote_service is 'Information about quotes and services';

-- role:
comment on table role is 'Information about roles';
comment on table role_permission is 'Associations between roles and permissions';

-- service:
comment on table service is 'Information about services used in quotes and jobs';

-- stock:
comment on table stock is 'Information about the stocks of materials';

-- supplier:
comment on table supplier is 'Information about suppliers';
comment on table supplier_material is 'Associations between suppliers and materials';

-- users:
comment on table users is 'Information about users';
comment on table user_role is 'Associations between users and roles';

-- warehouse:
comment on table warehouse is 'Information about warehouses';
comment on table warehouse_material is 'Associations between warehouses and materials';

-- worker:
comment on table worker is 'Information about workers';
comment on table worker_supervisor is 'Associations between workers and supervisors';

-- COLUMNS --------------------------------------------------------------------

-- area:
comment on column area.id is 'id of the area using UUID format version 4';
comment on column area.code is 'Used to identify an area using a custom code';
comment on column area.name is 'Name or description of the area';
comment on column area.extra is 'Used to store extra metadata in JSON format';
comment on column area.created_at is 'Used to know when was created';
comment on column area.updated_at is 'Used to know when was updated';
comment on column area.deleted_at is 'Used to know when was deleted softly';
comment on column area.created_by is 'Used to know who created it';
comment on column area.updated_by is 'Used to know who updated it';
comment on column area.deleted_by is 'Used to know who deleted it';

-- area_subarea:
comment on column area_subarea.area_id is 'Used to know the id of the area';
comment on column area_subarea.subarea_id is 'Used to know the id of the subarea';
comment on column area_subarea.extra is 'Used to store extra metadata in JSON format';
comment on column area_subarea.created_at is 'Used to know when was created';
comment on column area_subarea.updated_at is 'Used to know when was updated';
comment on column area_subarea.deleted_at is 'Used to know when was deleted softly';
comment on column area_subarea.created_by is 'Used to know who created it';
comment on column area_subarea.updated_by is 'Used to know who updated it';
comment on column area_subarea.deleted_by is 'Used to know who deleted it';

-- area_worker:
comment on column area_worker.area_id is 'Used to know the id of the area';
comment on column area_worker.worker_id is 'Used to know the id of the worker';
comment on column area_worker.extra is 'Used to store extra metadata in JSON format';
comment on column area_worker.created_at is 'Used to know when was created';
comment on column area_worker.updated_at is 'Used to know when was updated';
comment on column area_worker.deleted_at is 'Used to know when was deleted softly';
comment on column area_worker.created_by is 'Used to know who created it';
comment on column area_worker.updated_by is 'Used to know who updated it';
comment on column area_worker.deleted_by is 'Used to know who deleted it';

-- category:
comment on column category.id is 'id of the category using UUID format version 4';
comment on column category.parent_id is 'Used to know what parent owns the category';
comment on column category.code is 'Used to identify a category using a custom code';
comment on column category.name is 'Name or description of the category';
comment on column category.extra is 'Used to store extra metadata in JSON format';
comment on column category.created_at is 'Used to know when was created';
comment on column category.updated_at is 'Used to know when was updated';
comment on column category.deleted_at is 'Used to know when was deleted softly';
comment on column category.created_by is 'Used to know who created it';
comment on column category.updated_by is 'Used to know who updated it';
comment on column category.deleted_by is 'Used to know who deleted it';

-- client:
comment on column client.id is 'id of the client using UUID format version 4';
comment on column client.code is 'Used to identify a client using a custom code';
comment on column client.name is 'Name or description of the client';
comment on column client.extra is 'Used to store extra metadata in JSON format';
comment on column client.created_at is 'Used to know when was created';
comment on column client.updated_at is 'Used to know when was updated';
comment on column client.deleted_at is 'Used to know when was deleted softly';
comment on column client.created_by is 'Used to know who created it';
comment on column client.updated_by is 'Used to know who updated it';
comment on column client.deleted_by is 'Used to know who deleted it';

-- company:
comment on column company.id is 'id of the company using UUID format version 4';
comment on column company.code is 'Used to identify a company using a custom code';
comment on column company.name is 'Name or description of the company';
comment on column company.extra is 'Used to store extra metadata in JSON format';
comment on column company.created_at is 'Used to know when was created';
comment on column company.updated_at is 'Used to know when was updated';
comment on column company.deleted_at is 'Used to know when was deleted softly';
comment on column company.created_by is 'Used to know who created it';
comment on column company.updated_by is 'Used to know who updated it';
comment on column company.deleted_by is 'Used to know who deleted it';

-- job:
comment on column job.id is 'id of the job using UUID format version 4';
comment on column job.service_id is 'id of the service that is performed in the job';
comment on column job.order_id is 'id of the order that owns the job';
comment on column job.code is 'Used to identify a job using a custom code';
comment on column job.details is 'A short and optional description for the job';
comment on column job.status is 'Used to know the status of the job';
comment on column job.priority is 'Used to know the priority of the job';
comment on column job.progress is 'Used to know the progress in % number of the job';
comment on column job.units is 'Used to know how many times this job will be performed';
comment on column job.extra is 'Used to store extra metadata in JSON format';
comment on column job.created_at is 'Used to know when was created';
comment on column job.updated_at is 'Used to know when was updated';
comment on column job.deleted_at is 'Used to know when was deleted softly';
comment on column job.created_by is 'Used to know who created it';
comment on column job.updated_by is 'Used to know who updated it';
comment on column job.deleted_by is 'Used to know who deleted it';

-- job_material:
comment on column job_material.job_id is 'Used to know the id of the job';
comment on column job_material.material_id is 'Used to know the id of the material';
comment on column job_material.extra is 'Used to store extra metadata in JSON format';
comment on column job_material.created_at is 'Used to know when was created';
comment on column job_material.updated_at is 'Used to know when was updated';
comment on column job_material.deleted_at is 'Used to know when was deleted softly';
comment on column job_material.created_by is 'Used to know who created it';
comment on column job_material.updated_by is 'Used to know who updated it';
comment on column job_material.deleted_by is 'Used to know who deleted it';

-- job_subjob:
comment on column job_subjob.job_id is 'Used to know the id of the job';
comment on column job_subjob.subjob_id is 'Used to know the id of the subjob';
comment on column job_subjob.extra is 'Used to store extra metadata in JSON format';
comment on column job_subjob.created_at is 'Used to know when was created';
comment on column job_subjob.updated_at is 'Used to know when was updated';
comment on column job_subjob.deleted_at is 'Used to know when was deleted softly';
comment on column job_subjob.created_by is 'Used to know who created it';
comment on column job_subjob.updated_by is 'Used to know who updated it';
comment on column job_subjob.deleted_by is 'Used to know who deleted it';

-- job_worker:
comment on column job_worker.job_id is 'Used to know the id of the job';
comment on column job_worker.worker_id is 'Used to know the id of the worker';
comment on column job_worker.extra is 'Used to store extra metadata in JSON format';
comment on column job_worker.created_at is 'Used to know when was created';
comment on column job_worker.updated_at is 'Used to know when was updated';
comment on column job_worker.deleted_at is 'Used to know when was deleted softly';
comment on column job_worker.created_by is 'Used to know who created it';
comment on column job_worker.updated_by is 'Used to know who updated it';
comment on column job_worker.deleted_by is 'Used to know who deleted it';

-- material:
comment on column material.id is 'id of the material using UUID format version 4';
comment on column material.category_id is 'Used to know what category belongs to the material';
comment on column material.code is 'Used to identify a material using a custom code';
comment on column material.name is 'Name or description of the material';
comment on column material.extra is 'Used to store extra metadata in JSON format';
comment on column material.created_at is 'Used to know when was created';
comment on column material.updated_at is 'Used to know when was updated';
comment on column material.deleted_at is 'Used to know when was deleted softly';
comment on column material.created_by is 'Used to know who created it';
comment on column material.updated_by is 'Used to know who updated it';
comment on column material.deleted_by is 'Used to know who deleted it';

-- order:
comment on column orders.id is 'id of the order using UUID format version 4';
comment on column orders.quote_id is 'Used to know what quote owns this order';
comment on column orders.code is 'Used to identify a order using a custom code';
comment on column orders.subject is 'A short and optional description for the order';
comment on column orders.status is 'Used to know the status of the order';
comment on column orders.priority is 'Used to know the priority of the order';
comment on column orders.progress is 'Used to know the progress in % number of the order';
comment on column orders.extra is 'Used to store extra metadata in JSON format';
comment on column orders.created_at is 'Used to know when was created';
comment on column orders.updated_at is 'Used to know when was updated';
comment on column orders.deleted_at is 'Used to know when was deleted softly';
comment on column orders.created_by is 'Used to know who created it';
comment on column orders.updated_by is 'Used to know who updated it';
comment on column orders.deleted_by is 'Used to know who deleted it';

-- permission:
comment on column permission.id is 'id of the permission using UUID format version 4';
comment on column permission.code is 'Used to identify a permission using a custom code';
comment on column permission.name is 'Name or description of the permission';
comment on column permission.extra is 'Used to store extra metadata in JSON format';
comment on column permission.created_at is 'Used to know when was created';
comment on column permission.updated_at is 'Used to know when was updated';
comment on column permission.deleted_at is 'Used to know when was deleted softly';
comment on column permission.created_by is 'Used to know who created it';
comment on column permission.updated_by is 'Used to know who updated it';
comment on column permission.deleted_by is 'Used to know who deleted it';

-- quote:
comment on column quote.id is 'id of the quote using UUID format version 4';
comment on column quote.client_id is 'Used to identify the client of the quote';
comment on column quote.salesman_id is 'Used to identify the salesman of the quote';
comment on column quote.code is 'Used to identify a quote using a custom code';
comment on column quote.subject is 'Subject or description of the quote';
comment on column quote.status is 'Status of the quote';
comment on column quote.extra is 'Used to store extra metadata in JSON format';
comment on column quote.created_at is 'Used to know when was created';
comment on column quote.updated_at is 'Used to know when was updated';
comment on column quote.deleted_at is 'Used to know when was deleted softly';
comment on column quote.created_by is 'Used to know who created it';
comment on column quote.updated_by is 'Used to know who updated it';
comment on column quote.deleted_by is 'Used to know who deleted it';

-- quote_service:
comment on column quote_service.quote_id is 'Used to know the id of the quote';
comment on column quote_service.service_id is 'Used to know the id of the service';
comment on column quote_service.extra is 'Used to store extra metadata in JSON format';
comment on column quote_service.created_at is 'Used to know when was created';
comment on column quote_service.updated_at is 'Used to know when was updated';
comment on column quote_service.deleted_at is 'Used to know when was deleted softly';
comment on column quote_service.created_by is 'Used to know who created it';
comment on column quote_service.updated_by is 'Used to know who updated it';
comment on column quote_service.deleted_by is 'Used to know who deleted it';

-- role:
comment on column role.id is 'id of the role using UUID format version 4';
comment on column role.code is 'Used to identify a role using a custom code';
comment on column role.name is 'Name or description of the role';
comment on column role.extra is 'Used to store extra metadata in JSON format';
comment on column role.created_at is 'Used to know when was created';
comment on column role.updated_at is 'Used to know when was updated';
comment on column role.deleted_at is 'Used to know when was deleted softly';
comment on column role.created_by is 'Used to know who created it';
comment on column role.updated_by is 'Used to know who updated it';
comment on column role.deleted_by is 'Used to know who deleted it';

-- role_permission:
comment on column role_permission.role_id is 'Used to know the id of the role';
comment on column role_permission.permission_id is 'Used to know the id of the permission';
comment on column role_permission.extra is 'Used to store extra metadata in JSON format';
comment on column role_permission.created_at is 'Used to know when was created';
comment on column role_permission.updated_at is 'Used to know when was updated';
comment on column role_permission.deleted_at is 'Used to know when was deleted softly';
comment on column role_permission.created_by is 'Used to know who created it';
comment on column role_permission.updated_by is 'Used to know who updated it';
comment on column role_permission.deleted_by is 'Used to know who deleted it';

-- service:
comment on column service.id is 'id of the service using UUID format version 4';
comment on column service.area_id is 'id of the area the service is worked';
comment on column service.code is 'Used to identify a service using a custom code';
comment on column service.name is 'Name or description of the service';
comment on column service.extra is 'Used to store extra metadata in JSON format';
comment on column service.created_at is 'Used to know when was created';
comment on column service.updated_at is 'Used to know when was updated';
comment on column service.deleted_at is 'Used to know when was deleted softly';
comment on column service.created_by is 'Used to know who created it';
comment on column service.updated_by is 'Used to know who updated it';
comment on column service.deleted_by is 'Used to know who deleted it';

-- stock:
comment on column stock.id is 'id of the stock using UUID format version 4';
comment on column stock.material_id is 'Used to identify the material of the stock';
comment on column stock.entries is 'Used to know how many entries a material has';
comment on column stock.exits is 'Used to know how many exits a material has';
comment on column stock.stocks is 'Used to know how many stocks a material has';
comment on column stock.extra is 'Used to store extra metadata in JSON format';
comment on column stock.created_at is 'Used to know when was created';
comment on column stock.updated_at is 'Used to know when was updated';
comment on column stock.deleted_at is 'Used to know when was deleted softly';
comment on column stock.created_by is 'Used to know who created it';
comment on column stock.updated_by is 'Used to know who updated it';
comment on column stock.deleted_by is 'Used to know who deleted it';

-- supplier:
comment on column supplier.id is 'id of the supplier using UUID format version 4';
comment on column supplier.code is 'Used to identify a supplier using a custom code';
comment on column supplier.name is 'Name or description of the supplier';
comment on column supplier.extra is 'Used to store extra metadata in JSON format';
comment on column supplier.created_at is 'Used to know when was created';
comment on column supplier.updated_at is 'Used to know when was updated';
comment on column supplier.deleted_at is 'Used to know when was deleted softly';
comment on column supplier.created_by is 'Used to know who created it';
comment on column supplier.updated_by is 'Used to know who updated it';
comment on column supplier.deleted_by is 'Used to know who deleted it';

-- supplier_material:
comment on column supplier_material.supplier_id is 'Used to know the id of the supplier';
comment on column supplier_material.material_id is 'Used to know the id of the material';
comment on column supplier_material.extra is 'Used to store extra metadata in JSON format';
comment on column supplier_material.created_at is 'Used to know when was created';
comment on column supplier_material.updated_at is 'Used to know when was updated';
comment on column supplier_material.deleted_at is 'Used to know when was deleted softly';
comment on column supplier_material.created_by is 'Used to know who created it';
comment on column supplier_material.updated_by is 'Used to know who updated it';
comment on column supplier_material.deleted_by is 'Used to know who deleted it';

-- users:
comment on column users.id is 'id of the users using UUID format version 4';
comment on column users.worker_id is 'Used to identify who owns the user';
comment on column users.code is 'Used to identify a users using a custom code';
comment on column users.username is 'Used to know the username of the user';
comment on column users.password is 'Used to know the password of the user';
comment on column users.extra is 'Used to store extra metadata in JSON format';
comment on column users.created_at is 'Used to know when was created';
comment on column users.updated_at is 'Used to know when was updated';
comment on column users.deleted_at is 'Used to know when was deleted softly';
comment on column users.created_by is 'Used to know who created it';
comment on column users.updated_by is 'Used to know who updated it';
comment on column users.deleted_by is 'Used to know who deleted it';

-- user_role:
comment on column user_role.user_id is 'Used to know the id of the user';
comment on column user_role.role_id is 'Used to know the id of the role';
comment on column user_role.extra is 'Used to store extra metadata in JSON format';
comment on column user_role.created_at is 'Used to know when was created';
comment on column user_role.updated_at is 'Used to know when was updated';
comment on column user_role.deleted_at is 'Used to know when was deleted softly';
comment on column user_role.created_by is 'Used to know who created it';
comment on column user_role.updated_by is 'Used to know who updated it';
comment on column user_role.deleted_by is 'Used to know who deleted it';

-- warehouse:
comment on column warehouse.id is 'id of the warehouse using UUID format version 4';
comment on column warehouse.code is 'Used to identify a warehouse using a custom code';
comment on column warehouse.name is 'Name or description of the warehouse';
comment on column warehouse.extra is 'Used to store extra metadata in JSON format';
comment on column warehouse.created_at is 'Used to know when was created';
comment on column warehouse.updated_at is 'Used to know when was updated';
comment on column warehouse.deleted_at is 'Used to know when was deleted softly';
comment on column warehouse.created_by is 'Used to know who created it';
comment on column warehouse.updated_by is 'Used to know who updated it';
comment on column warehouse.deleted_by is 'Used to know who deleted it';

-- warehouse_material:
comment on column warehouse_material.warehouse_id is 'Used to know the id of the warehouse';
comment on column warehouse_material.material_id is 'Used to know the id of the material';
comment on column warehouse_material.extra is 'Used to store extra metadata in JSON format';
comment on column warehouse_material.created_at is 'Used to know when was created';
comment on column warehouse_material.updated_at is 'Used to know when was updated';
comment on column warehouse_material.deleted_at is 'Used to know when was deleted softly';
comment on column warehouse_material.created_by is 'Used to know who created it';
comment on column warehouse_material.updated_by is 'Used to know who updated it';
comment on column warehouse_material.deleted_by is 'Used to know who deleted it';

-- worker:
comment on column worker.id is 'id of the worker using UUID format version 4';
comment on column worker.code is 'Used to identify a worker using a custom code';
comment on column worker.firstname is 'firstname of the worker';
comment on column worker.lastname is 'lastname of the worker';
comment on column worker.is_supervisor is 'Used to know the supervisor of the worker';
comment on column worker.extra is 'Used to store extra metadata in JSON format';
comment on column worker.created_at is 'Used to know when was created';
comment on column worker.updated_at is 'Used to know when was updated';
comment on column worker.deleted_at is 'Used to know when was deleted softly';
comment on column worker.created_by is 'Used to know who created it';
comment on column worker.updated_by is 'Used to know who updated it';
comment on column worker.deleted_by is 'Used to know who deleted it';

-- worker_supervisor:
comment on column worker_supervisor.worker_id is 'Used to know the id of the worker';
comment on column worker_supervisor.supervisor_id is 'Used to know the id of the supervisor';
comment on column worker_supervisor.extra is 'Used to store extra metadata in JSON format';
comment on column worker_supervisor.created_at is 'Used to know when was created';
comment on column worker_supervisor.updated_at is 'Used to know when was updated';
comment on column worker_supervisor.deleted_at is 'Used to know when was deleted softly';
comment on column worker_supervisor.created_by is 'Used to know who created it';
comment on column worker_supervisor.updated_by is 'Used to know who updated it';
comment on column worker_supervisor.deleted_by is 'Used to know who deleted it';
