-- Common exploratory analysis:
select * from company;
select * from category;
select * from department;
select * from orders;
select * from customer;
select * from item;
select * from stock;
select * from quote;
select * from warehouse;
select * from supplier;
select * from employee;
select * from users;
select * from role;
select * from permission;

-- Get a list of all permissions of each role:
select
  r.code "role.code",
  r.name "role.name",
  p.code "perm.code",
  p.name "perm.name"
from role r
left join role_permission rp on rp.role_id = r.id
left join permission p on p.id = rp.permission_id
;

-- Get a list of all role of each user:
select
  u.employee_id "user.employee",
  u.code "user.code",
  u.username "user.username",
  u.password "user.password",
  r.code "role.code",
  r.name "role.name"
from users u
left join user_role ur on ur.user_id = u.id
left join role r on r.id = ur.role_id
;
