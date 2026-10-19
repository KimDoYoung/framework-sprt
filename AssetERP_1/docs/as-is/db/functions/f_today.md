# f_today

## FUNCTION public.f_today()

- 반환: `date`
- 줄 수: 14

```sql
CREATE OR REPLACE FUNCTION public.f_today()
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
-----------------------------------------------------------------------------------------
BEGIN
    RETURN now()::Date;
-----------------------------------------------------------------------------------------
END;
$function$
```
