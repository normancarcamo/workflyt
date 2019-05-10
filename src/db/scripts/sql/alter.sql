-- category -------------------------------------------------------------------

alter table category alter column code drop not null;
alter table category alter column code type varchar(20);

-- company --------------------------------------------------------------------

alter table company alter column code drop not null;
alter table company alter column code type varchar(20);

-- customer -------------------------------------------------------------------

alter table customer alter column code drop not null;
alter table customer alter column code type varchar(20);

-- department -----------------------------------------------------------------

alter table department alter column code drop not null;
alter table department alter column code type varchar(20);

-- employee -------------------------------------------------------------------

alter table employee alter column code drop not null;
alter table employee alter column code type varchar(20);

-- item -----------------------------------------------------------------------

alter table item alter column code drop not null;
alter table item alter column code type varchar(20);

-- order ----------------------------------------------------------------------

alter table orders alter column code drop not null;
alter table orders alter column code type varchar(20);

-- permission -----------------------------------------------------------------

alter table permission alter column code drop not null;
alter table permission alter column code type varchar(20);

-- quote ----------------------------------------------------------------------

alter table quote alter column code drop not null;
alter table quote alter column code type varchar(20);

-- role -----------------------------------------------------------------------

alter table role alter column code drop not null;
alter table role alter column code type varchar(20);

-- supplier -------------------------------------------------------------------

alter table supplier alter column code drop not null;
alter table supplier alter column code type varchar(20);

-- user -----------------------------------------------------------------------

alter table users alter column code drop not null;
alter table users alter column code type varchar(20);

-- warehouse ------------------------------------------------------------------

alter table warehouse alter column code drop not null;
alter table warehouse alter column code type varchar(20);

-- ----------------------------------------------------------------------------
