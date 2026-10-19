# f_get_alarm_datetime

## FUNCTION public.f_get_alarm_datetime(p_alarm_id numeric, p_std_date date)

- 반환: `timestamp without time zone`
- 줄 수: 70

```sql
CREATE OR REPLACE FUNCTION public.f_get_alarm_datetime(p_alarm_id numeric, p_std_date date)
 RETURNS timestamp without time zone
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SCH06     sch06_alarm%ROWTYPE;
    
    v_ADD_DAY   NUMERIC;
    v_DATE      DATE;
    v_HOUR      NUMERIC;
    v_DATETIME  TIMESTAMP;

    v_errMsg    VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN

    RAISE NOTICE 'f_get_alarm_datetime IN!! 알람id : % / 기준일 : %', p_alarm_id, TO_CHAR(p_std_date,'YYYY-MM-DD');
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_SCH06
      FROM sch06_alarm
     WHERE sch06_alarm_id = p_alarm_id;
    -------------------------------------------------------------------------------------
    IF v_SCH06.sch06_day_week_cd = 'D' THEN     --(D:일/W:주)
        v_ADD_DAY := v_SCH06.sch06_num * 1;
    ELSE
        v_ADD_DAY := v_SCH06.sch06_num * 7;
    END IF;
    -------------------------------------------------------------------------------------
    IF v_SCH06.sch06_bef_aft_cd = '1' THEN  --(1:전/2:후)
        v_ADD_DAY := v_ADD_DAY * -1;
    END IF;
    -------------------------------------------------------------------------------------
    v_DATE := p_std_date + v_ADD_DAY * INTERVAL '1day';

    IF v_SCH06.sch06_holiday_cd = '1' THEN  --(1:직전영업일)
        v_DATE := f_get_biz_date(v_SCH06.sch06_company_id, v_DATE, '-0');
    ELSIF v_SCH06.sch06_holiday_cd = '2' THEN --(2:직후영업일)
        v_date := f_get_biz_date(v_SCH06.sch06_company_id, v_DATE, '+0');
    END IF;

    RAISE NOTICE '알람일자 : %', v_DATE;
    -------------------------------------------------------------------------------------
    v_HOUR := v_SCH06.sch06_hour_cd;

    -- AM12시 => 00시, PM12시 => 12시
    IF v_HOUR = '12' THEN
        IF v_SCH06.sch06_am_pm_cd = 'AM' THEN
            v_HOUR := '00';
        END IF;
    ELSE
        IF v_SCH06.sch06_am_pm_cd = 'PM' THEN
            v_HOUR := v_HOUR + 12;
        END IF;
    END IF;
    RAISE NOTICE 'v_HOUR : %', v_HOUR;
    -------------------------------------------------------------------------------------
    v_DATETIME := (TO_CHAR(v_DATE,'YYYYMMDD ')||TO_CHAR(v_HOUR,'00')||v_SCH06.sch06_minute_cd||'00')::timestamp;
    RAISE NOTICE 'v_DATETIME : %', v_DATETIME;
    -------------------------------------------------------------------------------------
    RETURN v_DATETIME;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - % (%)', v_errMsg, SQLERRM ;
    RETURN '1900-01-01'::timestamp;
END;
$function$
```
