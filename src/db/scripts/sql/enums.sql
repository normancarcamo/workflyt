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
  'done'
);

drop type if exists enum_orders_status;
create type enum_orders_status as enum (
  'done',
  'cancelled',
  'working',
  'awaiting'
);

drop type if exists enum_orders_type;
create type enum_orders_type as enum (
  'installation',
  'work'
);

drop type if exists enum_item_type;
create type enum_item_type as enum (
  'material',
  'product',
  'service'
);

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

drop type if exists enum_phone_type;
create type enum_phone_type as enum(
  'work',
  'home',
  'office',
  'mobile',
  'other'
);

drop type if exists enum_address_type;
create type enum_address_type as enum(
  'work',
  'home',
  'office',
  'other'
);

drop type if exists enum_customer_type;
create type enum_customer_type as enum(
  'normal',
  'company',
  'juridical',
  'other'
);
