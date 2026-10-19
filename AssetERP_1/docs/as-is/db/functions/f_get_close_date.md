# f_get_close_date

## FUNCTION public.f_get_close_date(p_company_id numeric, p_year character varying, p_type character varying)

- 반환: `date`
- 줄 수: 37

```sql
CREATE OR REPLACE FUNCTION public.f_get_close_date(p_company_id numeric, p_year character varying, p_type character varying)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_MONTH         VARCHAR(2);
v_START_DATE    DATE;
v_CLOSE_DATE    DATE;
-----------------------------------------------------------------------------------------
BEGIN

    SELECT sys01_leave_month_cd
      INTO v_MONTH
      FROM sys01_company
     WHERE sys01_company_id = p_company_id;

    -- 결산종료일
    v_CLOSE_DATE := f_get_last_day((p_year||v_MONTH||'01')::date);
    IF v_MONTH != '12' THEN
        v_CLOSE_DATE := v_CLOSE_DATE + INTERVAL '1year'; 
    END IF;

    -- 결산시작일
    v_START_DATE := v_CLOSE_DATE + INTERVAL '-1year + 1day'; 

    IF p_type = '1' THEN
        RETURN v_START_DATE;
    ELSE
        RETURN v_CLOSE_DATE;
    END IF;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
