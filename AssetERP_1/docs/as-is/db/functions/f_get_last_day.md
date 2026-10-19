# f_get_last_day

## FUNCTION public.f_get_last_day(p_stddate date)

- 반환: `date`
- 줄 수: 17

```sql
CREATE OR REPLACE FUNCTION public.f_get_last_day(p_stddate date)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    RETURN date_trunc('month', p_stdDate) + INTERVAL '1month -1day';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
