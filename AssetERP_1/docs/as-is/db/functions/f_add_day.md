# f_add_day

## FUNCTION public.f_add_day(d timestamp without time zone, i integer)

- 반환: `timestamp without time zone`
- 줄 수: 9

```sql
CREATE OR REPLACE FUNCTION public.f_add_day(d timestamp without time zone, i integer)
 RETURNS timestamp without time zone
 LANGUAGE plpgsql
AS $function$
BEGIN
	return  d +  ($2 || ' day')::INTERVAL;
END;$function$
```
