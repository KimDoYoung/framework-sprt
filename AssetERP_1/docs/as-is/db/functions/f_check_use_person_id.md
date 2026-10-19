# f_check_use_person_id

## FUNCTION public.f_check_use_person_id(p_person_id numeric)

- 반환: `numeric`
- 줄 수: 55

```sql
CREATE OR REPLACE FUNCTION public.f_check_use_person_id(p_person_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_DATA      RECORD;
    v_SQL       TEXT;
    v_COUNT     NUMERIC := 0;
    v_TCOUNT    NUMERIC := 0;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT table_name, column_name
                      FROM information_schema.COLUMNS
                     WHERE table_catalog = current_database()
                       AND (   column_name LIKE '%person_id'
                            OR column_name LIKE '%emp_reg_id' )
                       AND table_name  NOT LIKE '%_back'
                       AND table_name  NOT LIKE SUBSTR(table_name,1,3)||'bak%'
                       AND SUBSTR(table_name,1,5) NOT IN ('emp01','emp02','emp03','emp35','emp00')
                     ORDER BY 1,2
    ) LOOP
        ---------------------------------------------------------------------------------
        v_SQL := 'SELECT COUNT(*)'
               ||'  FROM '||c_DATA.table_name
               ||' WHERE '||c_DATA.column_name||' = '||p_person_id;
        ---------------------------------------------------------------------------------
        --RAISE NOTICE 'v_SQL : %', v_SQL;
        ---------------------------------------------------------------------------------
        IF v_SQL IS NOT NULL THEN
            EXECUTE v_SQL INTO v_COUNT;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_COUNT IS NULL THEN
            v_COUNT := 0;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_COUNT > 0 THEN
            RAISE NOTICE 'SQL(%건) : %', v_COUNT, v_SQL;
            --RAISE NOTICE 'table_name : % / column_name : % / COUNT : %', c_DATA.table_name, c_DATA.column_name, v_COUNT;
            --RETURN 1;
        END IF;
        ---------------------------------------------------------------------------------
        v_TCOUNT := v_TCOUNT + v_COUNT;

    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN v_TCOUNT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
