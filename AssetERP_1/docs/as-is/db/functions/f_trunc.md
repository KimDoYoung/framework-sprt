# f_trunc

## FUNCTION public.f_trunc(d timestamp without time zone)

- 반환: `timestamp without time zone`
- 줄 수: 9

```sql
CREATE OR REPLACE FUNCTION public.f_trunc(d timestamp without time zone)
 RETURNS timestamp without time zone
 LANGUAGE plpgsql
AS $function$
BEGIN
	return date_trunc('day', d); 
END;$function$
```

## FUNCTION public.f_trunc(p_amt numeric, p_cur_cd character varying, p_type character varying)

- 반환: `numeric`
- 줄 수: 23

```sql
CREATE OR REPLACE FUNCTION public.f_trunc(p_amt numeric, p_cur_cd character varying, p_type character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AMT       NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_cur_cd = 'KRW' OR p_type = '1' THEN
        v_AMT := TRUNC(p_amt);
    ELSE
        v_AMT := TRUNC(p_amt, 2);
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN p_amt;
END;
$function$
```
