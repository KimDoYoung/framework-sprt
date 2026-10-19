# f_get_datedif

## FUNCTION public.f_get_datedif(p_start_date date, p_close_date date, p_type character varying)

- 반환: `numeric`
- 줄 수: 31

```sql
CREATE OR REPLACE FUNCTION public.f_get_datedif(p_start_date date, p_close_date date, p_type character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_YM    NUMERIC;
v_DIFF  NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_YM := (DATE_PART('year' ,p_close_date) - DATE_PART('year' ,p_start_date)) * 12
          + (DATE_PART('month',p_close_date) - DATE_PART('month',p_start_date));
    -------------------------------------------------------------------------------------
    -- p_type (Y:차이년수, M:차이개월수, D:차이일수)
    -------------------------------------------------------------------------------------
    IF p_type = 'Y' THEN
        v_DIFF := TRUNC(v_YM / 12);
    ELSIF p_type = 'M' THEN
        v_DIFF := TRUNC(v_YM / 12) * 12 + MOD(v_YM, 12);
    ELSIF p_type = 'D' THEN
        v_DIFF := p_close_date - p_start_date;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_DIFF;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
