# f_get_biz_days

## FUNCTION public.f_get_biz_days(p_company_id numeric, p_start_date date, p_close_date date)

- 반환: `numeric`
- 줄 수: 26

```sql
CREATE OR REPLACE FUNCTION public.f_get_biz_days(p_company_id numeric, p_start_date date, p_close_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_days  NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    ------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_days
      FROM sys12_calendar
     WHERE sys12_company_id = p_company_id
       AND sys12_day BETWEEN p_start_date AND p_close_date
       AND COALESCE(sys12_working_yn,'false') = 'true';
    -------------------------------------------------------------------------------------
    RETURN v_days;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %/%/%', p_company_id, p_start_date, p_close_date;
    RETURN null;
END;
$function$
```
