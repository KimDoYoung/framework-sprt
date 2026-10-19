# f_create_batchseq

## FUNCTION public.f_create_batchseq()

- 반환: `numeric`
- 줄 수: 20

```sql
CREATE OR REPLACE FUNCTION public.f_create_batchseq()
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_SEQ NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT cast(to_char(f_today(),'yyyymmdd') as numeric) * 10000000000 + cast(lpad(cast(nextval('batchseq') as varchar),10,'0') as numeric)
      INTO v_SEQ;

    RETURN v_SEQ;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
