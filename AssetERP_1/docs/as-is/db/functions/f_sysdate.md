# f_sysdate

## FUNCTION public.f_sysdate()

- 반환: `timestamp without time zone`
- 줄 수: 9

```sql
CREATE OR REPLACE FUNCTION public.f_sysdate()
 RETURNS timestamp without time zone
 LANGUAGE plpgsql
AS $function$
BEGIN
	return current_timestamp::timestamp;
END;$function$
```
