# f_check_use_corp_id

## FUNCTION public.f_check_use_corp_id(p_corp_id numeric)

- 반환: `numeric`
- 줄 수: 44

```sql
CREATE OR REPLACE FUNCTION public.f_check_use_corp_id(p_corp_id numeric)
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
                       AND column_name LIKE '%corp_id'
                       AND table_name  NOT LIKE '%_back'
                       AND SUBSTR(table_name,1,5) NOT IN ('sys15')
                     ORDER BY 1,2
    ) LOOP
        ---------------------------------------------------------------------------------
        v_SQL := 'SELECT COUNT(*)'
               ||'  FROM '||c_DATA.table_name
               ||' WHERE '||c_DATA.column_name||' = '||p_corp_id;
        ---------------------------------------------------------------------------------
        --RAISE NOTICE 'v_SQL : %', v_SQL;
        ---------------------------------------------------------------------------------
        IF v_SQL IS NOT NULL THEN
            EXECUTE v_SQL INTO v_COUNT;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_COUNT > 0 THEN
            RAISE NOTICE 'TABLE : % / COLUMN : %', c_DATA.table_name, c_DATA.column_name;
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
