# f_to_number

## FUNCTION public.f_to_number(v character varying)

- 반환: `numeric`
- 줄 수: 9

```sql
CREATE OR REPLACE FUNCTION public.f_to_number(v character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
BEGIN
	return cast(v as numeric);
END;$function$
```
