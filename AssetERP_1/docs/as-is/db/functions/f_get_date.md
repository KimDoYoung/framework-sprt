# f_get_date

## FUNCTION public.f_get_date(p_stddate date, p_prd numeric)

- 반환: `date`
- 줄 수: 17

```sql
CREATE OR REPLACE FUNCTION public.f_get_date(p_stddate date, p_prd numeric)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_date   DATE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    RETURN p_stdDate + p_prd * INTERVAL '1day';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
