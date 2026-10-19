# f_create_seq

## FUNCTION public.f_create_seq()

- 반환: `numeric`
- 줄 수: 20

```sql
CREATE OR REPLACE FUNCTION public.f_create_seq()
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_SEQ NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT cast(to_char(f_today(),'yyyymmdd') as numeric) * 10000000 + cast(lpad(cast(nextval('seq') as varchar),7,'0') as numeric)
      INTO v_SEQ;

    RETURN v_SEQ;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
