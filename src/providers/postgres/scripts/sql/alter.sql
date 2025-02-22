-- category -------------------------------------------------------------------

alter table category alter column code drop not null;
alter table category alter column code type varchar(30);

-- company --------------------------------------------------------------------

alter table company alter column code drop not null;
alter table company alter column code type varchar(30);

-- customer -------------------------------------------------------------------

alter table customer alter column code drop not null;
alter table customer alter column code type varchar(30);

-- department -----------------------------------------------------------------

alter table department alter column code drop not null;
alter table department alter column code type varchar(30);

-- employee -------------------------------------------------------------------

alter table employee alter column code drop not null;
alter table employee alter column code type varchar(30);

-- item -----------------------------------------------------------------------

alter table item alter column code drop not null;
alter table item alter column code type varchar(30);

-- order ----------------------------------------------------------------------

alter table orders alter column code drop not null;
alter table orders alter column code type varchar(30);

-- permission -----------------------------------------------------------------

alter table permission alter column code drop not null;
alter table permission alter column code type varchar(30);

-- quote ----------------------------------------------------------------------

alter table quote alter column code drop not null;
alter table quote alter column code type varchar(30);

-- role -----------------------------------------------------------------------

alter table role alter column code drop not null;
alter table role alter column code type varchar(30);

-- supplier -------------------------------------------------------------------

alter table supplier alter column code drop not null;
alter table supplier alter column code type varchar(30);

-- user -----------------------------------------------------------------------

alter table users alter column code drop not null;
alter table users alter column code type varchar(30);

-- warehouse ------------------------------------------------------------------

alter table warehouse alter column code drop not null;
alter table warehouse alter column code type varchar(30);

-- ----------------------------------------------------------------------------
