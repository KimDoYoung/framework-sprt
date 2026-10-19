# f_get_rate

## FUNCTION public.f_get_rate(p_rate_cd character varying, p_std_date date)

- 반환: `numeric`
- 줄 수: 31

```sql
CREATE OR REPLACE FUNCTION public.f_get_rate(p_rate_cd character varying, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_RATE  NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT pay21_apply_rate
      INTO v_RATE
      FROM pay21_rate
     WHERE pay21_rate_cd     = p_rate_cd
       AND pay21_start_date <= p_std_date
     ORDER BY pay21_start_date DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    IF v_RATE IS NULL THEN
        v_RATE := 0;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RATE / 100;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN 0;
END;
$function$
```
