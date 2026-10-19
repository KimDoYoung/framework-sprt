# f_get_tdmevidcount

## FUNCTION public.f_get_tdmevidcount(p_target_id numeric)

- 반환: `numeric`
- 줄 수: 34

```sql
CREATE OR REPLACE FUNCTION public.f_get_tdmevidcount(p_target_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_COUNT     NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT ( SELECT COUNT(*)
               FROM sys10_file
              WHERE sys10_parent_id = p_target_id )
           +
           ( SELECT COUNT(*)
               FROM com01_relate_appr
              WHERE com01_key_table_id = p_target_id )
           +
           ( SELECT COUNT(*)
               FROM tdm64_chck_evid_extr
              WHERE tdm64_target_id = p_target_id )
    INTO v_COUNT;

    IF v_COUNT IS NULL THEN
        v_COUNT := 0;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_COUNT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
