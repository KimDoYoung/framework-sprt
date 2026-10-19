# f_nvl

## FUNCTION public.f_nvl(p_amt numeric, p_default numeric)

- 반환: `numeric`
- 줄 수: 16

```sql
CREATE OR REPLACE FUNCTION public.f_nvl(p_amt numeric, p_default numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    RETURN CASE WHEN COALESCE(p_amt,0) = 0 THEN p_default ELSE p_amt END;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN p_default;
END;
$function$
```
