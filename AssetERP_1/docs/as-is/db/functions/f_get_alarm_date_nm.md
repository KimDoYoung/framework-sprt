# f_get_alarm_date_nm

## FUNCTION public.f_get_alarm_date_nm(p_alarm_id numeric)

- 반환: `character varying`
- 줄 수: 44

```sql
CREATE OR REPLACE FUNCTION public.f_get_alarm_date_nm(p_alarm_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SCH06     sch06_alarm%ROWTYPE;
    v_RETURN    VARCHAR(10);
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
        --v_RETURN := ' 당일입니다';
        v_RETURN := ' (D일)';
    ELSE
        SELECT /*CONCAT(' ', v_SCH06.sch06_num
                     ,f_cdnm('DayWeekCode'    , v_SCH06.sch06_day_week_cd, v_SCH06.sch06_company_id, f_today()),' '
                     ,f_cdnm('BeforeAfterCode', v_SCH06.sch06_bef_aft_cd , v_SCH06.sch06_company_id, f_today())
                     ,'입니다.')*/
               ' (D'
               ||CASE WHEN v_SCH06.sch06_bef_aft_cd = '1' THEN '-' ELSE '+' END
               ||v_SCH06.sch06_num
               ||f_cdnm('DayWeekCode', v_SCH06.sch06_day_week_cd, v_SCH06.sch06_company_id, f_today())
               ||')'
          INTO v_RETURN;
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
