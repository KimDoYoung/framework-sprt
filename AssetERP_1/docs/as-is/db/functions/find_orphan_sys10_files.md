# find_orphan_sys10_files

## FUNCTION public.find_orphan_sys10_files()

- 반환: `TABLE(sys10_file_id numeric, sys10_parent_id numeric, sys10_file_nm character varying, sys10_server_path character varying, sys10_size numeric, sys10_reg_date timestamp without time zone, is_orphan boolean)`
- 줄 수: 80

```sql
CREATE OR REPLACE FUNCTION public.find_orphan_sys10_files()
 RETURNS TABLE(sys10_file_id numeric, sys10_parent_id numeric, sys10_file_nm character varying, sys10_server_path character varying, sys10_size numeric, sys10_reg_date timestamp without time zone, is_orphan boolean)
 LANGUAGE plpgsql
AS $function$
DECLARE
    pk_rec RECORD;
    dynamic_union TEXT := '';
BEGIN
    -- Step 1: Build the UNION ALL query for all primary key values
    FOR pk_rec IN
        SELECT
            tc.table_schema,
            tc.table_name,
            kc.column_name
        FROM
            information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kc
              ON tc.constraint_name = kc.constraint_name
             AND tc.table_schema = kc.table_schema
             AND tc.table_name = kc.table_name
        WHERE
            tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema NOT IN ('information_schema', 'pg_catalog')
    LOOP
        IF dynamic_union <> '' THEN
            dynamic_union := dynamic_union || ' UNION ALL ';
        END IF;
        -- Primary Key 컬럼의 값을 추출하여 UNION ALL에 추가
        dynamic_union := dynamic_union || FORMAT('SELECT %I AS pk_value FROM %I.%I', pk_rec.column_name, pk_rec.table_schema, pk_rec.table_name);
    END LOOP;

    IF dynamic_union = '' THEN
        RAISE NOTICE 'No Primary Key columns found in the database.';
        RETURN;
    END IF;

    -- Step 2: Execute the dynamic query with NOT EXISTS
    RETURN QUERY EXECUTE FORMAT(
        'SELECT 
             f.sys10_file_id, 
             f.sys10_parent_id, 
             f.sys10_file_nm, 
             f.sys10_server_path, 
             f.sys10_size, 
             f.sys10_reg_date, 
             TRUE AS is_orphan
         FROM 
             sys10_file f
         WHERE 
             NOT EXISTS (
                 SELECT 1 
                 FROM (%s) AS all_pks 
                 WHERE all_pks.pk_value = f.sys10_parent_id
             )
    -- Step 3: apr99 테이블 예외로 포함
	 UNION ALL
	 SELECT 
             g.sys10_file_id, 
             g.sys10_parent_id, 
             g.sys10_file_nm, 
             g.sys10_server_path, 
             g.sys10_size, 
             g.sys10_reg_date, 
             TRUE AS is_orphan
         FROM 
             sys10_file g
         WHERE 
             EXISTS (
                 SELECT 1 
                 FROM apr99_appr_del 
                 WHERE apr99_appr_id = g.sys10_parent_id
             )
         ORDER BY 
             sys10_reg_date, sys10_file_nm',
        dynamic_union
    );
END;
$function$
```
