# f_get_leave_count_by_date

## FUNCTION public.f_get_leave_count_by_date(p_start_date date, p_close_date date, p_leave_cd character varying, p_company_id numeric)

- 반환: `numeric`
- 줄 수: 32

```sql
CREATE OR REPLACE FUNCTION public.f_get_leave_count_by_date(p_start_date date, p_close_date date, p_leave_cd character varying, p_company_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_LEAVE_COUNT   NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    IF p_leave_cd IN ('02','03') THEN   --반차
        v_LEAVE_COUNT := 0.5;
    ELSIF p_leave_cd IN ('06','07','08','09') THEN     --반반차
        v_LEAVE_COUNT := 0.25;
    ELSE
        IF p_start_date > p_close_date THEN
            v_LEAVE_COUNT := p_close_date - p_start_date + 1;
        ELSE
            SELECT COUNT(*)
              INTO v_LEAVE_COUNT
              FROM sys12_calendar
             WHERE sys12_company_id = p_company_id
               AND sys12_day BETWEEN p_start_date AND p_close_date;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_LEAVE_COUNT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
