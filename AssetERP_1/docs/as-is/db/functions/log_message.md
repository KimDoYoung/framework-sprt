# log_message

## FUNCTION public.log_message(p_level text, p_message text, p_add_data text)

- 반환: `void`
- 줄 수: 36

```sql
CREATE OR REPLACE FUNCTION public.log_message(p_level text, p_message text, p_add_data text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_CONN  TEXT;
    v_SQL   TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    /* 호출스크립트 
        PERFORM log_message('INFO', '작업 1');
        PERFORM log_message('ERR' , SQLERRM, jsonb_build_object('errcode', SQLSTATE));
    */

    RAISE NOTICE 'Attempting to connect to database: %', current_database();

    v_SQL := format('INSERT INTO sys98_log ( sys98_log_level, sys98_message, sys98_additional_data ) VALUES ( %L, %L, %L )'
                   ,p_level, p_message, p_add_data
                   );

    IF current_database() = 'idmsdb' THEN
        v_CONN := 'dbname=idmsdb host=172.20.200.248 user=idmsuser password=idms8100';
    ELSIF current_database() = 'kfiamdb' THEN
        v_CONN := 'dbname=kfiamdb host=172.20.200.130 user=kfiamuser password=kfiam5100';
    END IF;

    PERFORM dblink_exec(v_CONN, v_SQL);
    --PERFORM dblink_exec('dbname='||current_database(), v_SQL);

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Autonomous log insert failed: %', SQLERRM;
END;
$function$
```
