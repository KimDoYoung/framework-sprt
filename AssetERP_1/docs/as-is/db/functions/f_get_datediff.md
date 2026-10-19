# f_get_datediff

## FUNCTION public.f_get_datediff(p_start_date date, p_close_date date, p_type character varying)

- 반환: `character varying`
- 줄 수: 63

```sql
CREATE OR REPLACE FUNCTION public.f_get_datediff(p_start_date date, p_close_date date, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_MONTH NUMERIC;
v_YEAR  NUMERIC;
v_DAY   NUMERIC;
v_DATE  DATE;
v_TEXT  VARCHAR := '';
v_RTN   VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_MONTH := (DATE_PART('year' ,p_close_date) - DATE_PART('year' ,p_start_date)) * 12
             + (DATE_PART('month',p_close_date) - DATE_PART('month',p_start_date));
    -------------------------------------------------------------------------------------
    v_YEAR := TRUNC(v_MONTH / 12);
    IF v_YEAR > 0 THEN
        v_TEXT  := v_YEAR||'년 ';
    END IF;
    -------------------------------------------------------------------------------------
    v_MONTH := MOD(v_MONTH, 12);
    IF v_MONTH < 0 THEN
        v_MONTH := 0;
    END IF;

    -------------------------------------------------------------------------------------
    IF p_type = '1' THEN
        ---------------------------------------------------------------------------------
        v_RTN := v_TEXT||v_MONTH||'개월';
    -------------------------------------------------------------------------------------
    ELSIF p_type = '2' THEN
        ---------------------------------------------------------------------------------
        v_DAY := DATE_PART('day',p_close_date) - DATE_PART('day',p_start_date);
        ---------------------------------------------------------------------------------
        IF v_DAY < 0 AND v_MONTH > 0 THEN
            v_MONTH := v_MONTH - 1;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_MONTH > 0 THEN
            v_TEXT := v_TEXT||v_MONTH||'개월 ';
        END IF;
        ---------------------------------------------------------------------------------
        v_DATE := p_start_date + v_YEAR * INTERVAL '+1year';
        v_DATE := v_DATE + v_MONTH * INTERVAL '+1month';
        ---------------------------------------------------------------------------------
        v_DAY := p_close_date - v_DATE;
        ---------------------------------------------------------------------------------
        v_RTN := v_TEXT||v_DAY||'일';
    -------------------------------------------------------------------------------------
    ELSE
        v_RTN := null;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RTN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
