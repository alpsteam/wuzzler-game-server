# Setup database

(1) Create ADW and open WebSQL.

(2) Create schema ADW_USER in database
```sql
create user ADW_USER identified by "<password>";
grant dwrole to ADW_USER;
```
(2) Run [create_table.sql](https://github.com/alpsteam/wuzzler-game-server/blob/master/sql/create_table.sql) to create `vector`and `event` table.
  
(3) Open APEX console and login as `INTERNAL`, `ADMIN`, `<password>`.

(4) Create new workspace with database user `ADW_USER` and workspace name `ADW_USER`. Logout and sign in again into the new workspace.

<img src="screenshot.png" width="500">

(5) Go to `SQL Workshop`, `Restful Services` and import [ORDS_REST_ACW_acw_vector.sql](https://github.com/alpsteam/wuzzler-game-server/blob/master/sql/ORDS_REST_ACW_acw_vector.sql).

(6) Finally run

```
ALTER USER adw_user QUOTA 100M ON DATA;
```

Done. REST calls should now be available. Example request payload for `{{baseUrl}}/vector/:gameid`:

```json
[	
	{
    	"posx": 199,
    	"posy": 1,
    	"dirx": 13,
    	"diry": 14,
    	"tsstart": 1,
    	"tsend": 2
 
},
{
	    "posx": 98,
    	"posy": 1999,
    	"dirx": 1,
    	"diry": 15,
    	"tsstart": 1,
    	"tsend": 2
 
	}
]
```
