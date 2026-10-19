# f_get_quarter_date

## FUNCTION public.f_get_quarter_date(p_date date, p_type character varying)

- 반환: `date`
- 줄 수: 45

```sql
CREATE OR REPLACE FUNCTION public.f_get_quarter_date(p_date date, p_type character varying)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_date      DATE;
v_month     NUMERIC;
v_errMsg    VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_date  := p_date;
    v_month := CAST(to_char(v_date,'MM') AS NUMERIC);
    -------------------------------------------------------------------------------------
    -- 분기
    IF p_type = '1' THEN
        IF v_month <= 3 THEN
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '-1day';
        ELSIF v_month <= 6 THEN
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '3month -1day';
        ELSIF v_month <= 9 THEN
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '6month -1day';
        ELSE
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '9month -1day';
        END IF;
    -------------------------------------------------------------------------------------
    -- 반기
    ELSIF p_type = '2' THEN
        IF v_month <= 6 THEN
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '-1day';
        ELSE
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '6month -1day';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_date;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %/%', p_date, p_type;
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
