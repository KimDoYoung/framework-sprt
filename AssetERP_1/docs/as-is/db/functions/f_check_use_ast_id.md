# f_check_use_ast_id

## FUNCTION public.f_check_use_ast_id(p_ast_id numeric)

- 반환: `numeric`
- 줄 수: 49

```sql
CREATE OR REPLACE FUNCTION public.f_check_use_ast_id(p_ast_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_DATA  RECORD;
    v_SQL   TEXT;
    v_COUNT NUMERIC := 0;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT table_name, column_name
                      FROM information_schema.COLUMNS
                     WHERE table_catalog = current_database()
                       AND (   column_name LIKE '%ast_class_tree_id'
                            OR column_name LIKE '%class_tree_id'
                            OR column_name LIKE '%ast_id'
                            OR column_name LIKE '%deposit_id' )
                       AND table_name  NOT LIKE '%_back'
                       AND SUBSTR(table_name,1,5) NOT IN ('ast01','ast02','ast03','ast04','ast10')
                       AND column_name NOT LIKE '%dcr%'
                       AND column_name NOT LIKE '%ics%'
                       AND column_name NOT LIKE '%icr%'
                     ORDER BY 1,2
    ) LOOP
        ---------------------------------------------------------------------------------
        v_SQL := 'SELECT COUNT(*)'
               ||'  FROM '||c_DATA.table_name
               ||' WHERE '||c_DATA.column_name||' = '||p_ast_id;
        ---------------------------------------------------------------------------------
        --RAISE NOTICE 'v_SQL : %', v_SQL;
        ---------------------------------------------------------------------------------
        IF v_SQL IS NOT NULL THEN
            EXECUTE v_SQL INTO v_COUNT;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_COUNT > 0 THEN
            RETURN 1;
        END IF;
    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN v_COUNT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
