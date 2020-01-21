(1) Create schema ADW_USER in database
```sql
create user ADW_USER identified by "<password>";
grant dwrole to ADW_USER;
```
(2) Run create_table.sql as ADW_USER user to create
  - vector 
  - event
  
(3)switch to ADW_USER session
```sql
ALTER SESSION SET CURRENT_SCHEMA = ADW_USER;
```

(4) Run ORDS script as ADW_USER user to install REST services
