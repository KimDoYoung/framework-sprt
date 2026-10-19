# f_to_ymd

## FUNCTION public.f_to_ymd(d timestamp without time zone)

- 반환: `character varying`
- 줄 수: 9

```sql
CREATE OR REPLACE FUNCTION public.f_to_ymd(d timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
BEGIN
	return to_char(d, 'yyyyMMdd');
END;$function$
```
