-- QUOTE ----------------------------------------------------------------------

drop type if exists enum_quote_status;
create type enum_quote_status as enum (
  'open',
  'closed',
  'confirmed',
  'other',
  'approved',
  'pending',
  'awaiting',
  'authorized',
  'cancelled',
  'done',
  'finished'
);

-- ORDER ----------------------------------------------------------------------

drop type if exists enum_orders_status;
create type enum_orders_status as enum (
  'done',
  'cancelled',
  'working',
  'awaiting'
);

drop type if exists enum_orders_priority;
create type enum_orders_priority as enum (
  'low',
  'medium',
  'high'
);

drop type if exists enum_orders_type;
create type enum_orders_type as enum (
  'installation',
  'work'
);

-- JOB ------------------------------------------------------------------------

drop type if exists enum_jobs_status;
create type enum_jobs_status as enum (
  'done',
  'cancelled',
  'working',
  'awaiting'
);

drop type if exists enum_jobs_priority;
create type enum_jobs_priority as enum (
  'low',
  'medium',
  'high'
);

-- SOCIAL ---------------------------------------------------------------------

drop type if exists enum_social_type;
create type enum_social_type as enum(
  'web',
  'blog',
  'email',
  'skype',
  'linkedIn',
  'facebook',
  'twitter',
  'slack',
  'other'
);

-- PHONE ----------------------------------------------------------------------

drop type if exists enum_phone_type;
create type enum_phone_type as enum(
  'work',
  'home',
  'office',
  'mobile',
  'other'
);

-- ADDRESS --------------------------------------------------------------------

drop type if exists enum_address_type;
create type enum_address_type as enum(
  'work',
  'home',
  'office',
  'other'
);

-- CLIENT_TYPE ----------------------------------------------------------------

drop type if exists enum_client_type;
create type enum_client_type as enum(
  'normal',
  'company',
  'juridical',
  'other'
);
