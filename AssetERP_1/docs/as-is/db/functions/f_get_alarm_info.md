# f_get_alarm_info

## FUNCTION public.f_get_alarm_info(p_alarm_id numeric)

- 반환: `character varying`
- 줄 수: 66

```sql
CREATE OR REPLACE FUNCTION public.f_get_alarm_info(p_alarm_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SCH06     sch06_alarm%ROWTYPE;
    v_RETURN    VARCHAR(100);
    v_errMsg    VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_SCH06
      FROM sch06_alarm
     WHERE sch06_alarm_id = p_alarm_id;

    IF v_SCH06.sch06_alarm_id IS NULL THEN RETURN ''; END IF;
    -------------------------------------------------------------------------------------
    IF COALESCE(v_SCH06.sch06_num,0) = 0 THEN
        v_RETURN := '당일';
    ELSE
        IF v_SCH06.sch06_day_week_cd = 'D' THEN
            v_RETURN := v_SCH06.sch06_num||'일';
        ELSE
            v_RETURN := v_SCH06.sch06_num||'주';
        END IF;

        --RAISE NOTICE 'v_RETURN 1 : %', v_RETURN;
        ---------------------------------------------------------------------------------
        IF v_SCH06.sch06_bef_aft_cd = '1' THEN
            v_RETURN := v_RETURN||'전';
        ELSE
            v_RETURN := v_RETURN||'후';
        END IF;

        --RAISE NOTICE 'v_RETURN 2 : %', v_RETURN;
        ---------------------------------------------------------------------------------
        /*IF v_SCH06.sch06_holiday_cd != '0' THEN
            v_RETURN := v_RETURN||'(휴일인 경우 '||f_cdnm('HolidaySettleCode', v_SCH06.sch06_holiday_cd, v_SCH06.sch06_company_id, f_today())||')';

            RAISE NOTICE 'v_RETURN 2-1 : %', v_RETURN;

        END IF;*/
    END IF;
    -------------------------------------------------------------------------------------
    v_RETURN := v_RETURN||' '||f_cdnm('AmPmCode', v_SCH06.sch06_am_pm_cd, v_SCH06.sch06_company_id, f_today())
                        ||' '||CAST(v_SCH06.sch06_hour_cd AS NUMERIC)||'시';

    --RAISE NOTICE 'v_RETURN 3 : %', v_RETURN;
    -------------------------------------------------------------------------------------
    IF v_SCH06.sch06_minute_cd != '00' THEN
        v_RETURN := v_RETURN||' '||v_SCH06.sch06_minute_cd||'분';
    
        --RAISE NOTICE 'v_RETURN 3-1 : %', v_RETURN;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RETURN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - % (%)', v_errMsg, SQLERRM ;
    RETURN '';
END;
$function$
```
