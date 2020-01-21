(1) Create schema ADW_USER in database
create user ADW_USER identified by "<password>";
grant dwrole to ADW_USER;

(2) Run create_table.sql as ADW_USER user to create
  - vector 
  - event
# switch to ADW_USER session
ALTER SESSION SET CURRENT_SCHEMA = ADW_USER;

(3) Run ORDS script as ADW_USER user to install REST services
