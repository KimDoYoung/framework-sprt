# f_get_personidbytoken

## FUNCTION public.f_get_personidbytoken(p_token text)

- 반환: `numeric`
- 줄 수: 26

```sql
CREATE OR REPLACE FUNCTION public.f_get_personidbytoken(p_token text)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_RETURN    NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT token_person_id
      INTO v_RETURN
      FROM tmp_token
     WHERE token_value = p_token;
    -------------------------------------------------------------------------------------
    DELETE
      FROM tmp_token
     WHERE token_value = p_token;
    -------------------------------------------------------------------------------------
    RETURN v_RETURN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
