# f_get_deadline_nm

## FUNCTION public.f_get_deadline_nm(p_deadline_id numeric, p_type character varying)

- 반환: `character varying`
- 줄 수: 72

```sql
CREATE OR REPLACE FUNCTION public.f_get_deadline_nm(p_deadline_id numeric, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_NM VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN
    
    /*
    SELECT CASE WHEN p_type IN ('2','4') THEN '('||f_cdnm('CycleCode', sch03_cycle_cd, sch03_company_id, f_sysdate())||')' ELSE '' END
           ||CASE WHEN sch03_y_cd    IN ('0','00') THEN '' ELSE f_cdnm('YCode'        , sch03_y_cd   , sch03_company_id, f_sysdate()) END 
           ||CASE WHEN sch03_ys_cd   IN ('0','00') THEN '' ELSE f_cdnm('YsCode'       , sch03_ys_cd  , sch03_company_id, f_sysdate()) END   
           ||CASE WHEN sch03_m_cd    IN ('0','00') THEN '' ELSE f_cdnm('MCode'        , sch03_m_cd   , sch03_company_id, f_sysdate()) END   
           ||CASE WHEN sch03_ms_cd   IN ('0','00') THEN '' ELSE f_cdnm('MsCode'       , sch03_ms_cd  , sch03_company_id, f_sysdate()) END
           ||CASE WHEN sch03_d_cd    IN ('0','00') THEN '' ELSE f_cdnm('DCode'        , sch03_d_cd   , sch03_company_id, f_sysdate()) END   
           ||CASE WHEN sch03_ds_cd   IN ('0','00') THEN '' ELSE f_cdnm('DsCode'       , sch03_ds_cd  , sch03_company_id, f_sysdate()) END   
           ||CASE WHEN sch03_week_cd IN ('0','00') THEN '' ELSE f_cdnm('WeekOfMonth'  , sch03_week_cd, sch03_company_id, f_sysdate()) END
           ||CASE WHEN sch03_day_cd  IN ('0','00') THEN '' ELSE f_cdnm('DayOfWeekCode', sch03_day_cd , sch03_company_id, f_sysdate()) END
           ||CASE WHEN p_type IN ('3','4') THEN ' - '||sch03_note ELSE '' END
      INTO v_NM
      FROM sch03_deadline
     WHERE sch03_deadline_id = p_deadline_id;*/

    SELECT CASE WHEN p_type IN ('2','4') THEN '('||f_cdnm('CycleCode', sch03_cycle_cd, sch03_company_id, f_sysdate())||')' ELSE '' END
           ||CASE sch03_cycle_calc_type
                 WHEN '01' THEN TO_CHAR(sch03_fix_date,'YYYY-MM-DD')
                 WHEN '02' THEN CAST(sch03_num1 AS VARCHAR)||f_cdnm('PeriodCode', sch03_period_cd, sch03_company_id, f_sysdate())
                                ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
                 WHEN '04' THEN f_cdnm('DayOfWeekCode',sch03_day_week_cd, sch03_company_id, f_sysdate())
                                ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
                 WHEN '05' THEN (CASE COALESCE(sch03_day_cd,'00') WHEN 'AA' THEN CAST(sch03_num1 AS VARCHAR)
                                                                  WHEN '00' THEN ''
                                                                  ELSE f_cdnm('DCode', sch03_day_cd, sch03_company_id, f_sysdate()) END)
                                ||CASE WHEN COALESCE(sch03_day_type_cd,'0') = '0' THEN '' ELSE f_cdnm('DsCode', sch03_day_type_cd, sch03_company_id, f_sysdate())||' ' END
                                ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
                 WHEN '06' THEN f_cdnm('WeekOfMonth', sch03_week_cd, sch03_company_id, f_sysdate())||' '
                                ||f_cdnm('DayOfWeekCode',sch03_day_week_cd, sch03_company_id, f_sysdate())
                                ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
                 WHEN '11' THEN (CASE COALESCE(sch03_month_cd,'0') WHEN '0' THEN ''
                                                                   WHEN '4' THEN CAST(sch03_num1 AS VARCHAR)
                                                                   WHEN '5' THEN f_cdnm('MonthCode', sch03_month_cd, sch03_company_id, f_sysdate())||' '
                                                                                 ||CASE WHEN sch03_num1 IS NOT NULL THEN CAST(sch03_num1 AS VARCHAR) ELSE '' END
                                                                   ELSE f_cdnm('MonthCode', sch03_month_cd, sch03_company_id, f_sysdate()) END)
                                ||(CASE COALESCE(sch03_month_type_cd,'0') WHEN '0' THEN '' ELSE f_cdnm('MonthTypeCode', sch03_month_type_cd, sch03_company_id, f_sysdate())||' ' END)
                                ||(CASE COALESCE(sch03_day_cd,'00') WHEN 'AA' THEN ' '||CAST(sch03_num2 AS VARCHAR) 
                                                                    WHEN '00' THEN ''
                                                                    ELSE f_cdnm('DCode', sch03_day_cd, sch03_company_id, f_sysdate()) END)
                                ||CASE WHEN COALESCE(sch03_day_type_cd,'0') = '0' THEN '' ELSE f_cdnm('DsCode', sch03_day_type_cd, sch03_company_id, f_sysdate())||' ' END
                                ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
                 WHEN '12' THEN (CASE COALESCE(sch03_month_cd,'0') WHEN '0' THEN ''
                                                                   WHEN '4' THEN CAST(sch03_num1 AS VARCHAR)
                                                                   ELSE f_cdnm('MonthCode', sch03_month_cd, sch03_company_id, f_sysdate()) END)
                                ||CASE COALESCE(sch03_month_type_cd,'0') WHEN '0' THEN '' ELSE f_cdnm('MonthTypeCode', sch03_month_type_cd, sch03_company_id, f_sysdate()) END||' '
                                ||f_cdnm('WeekOfMonth', sch03_week_cd, sch03_company_id, f_sysdate())||' '
                                ||f_cdnm('DayOfWeekCode',sch03_day_week_cd, sch03_company_id, f_sysdate())
                                ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
                 ELSE f_cdnm('CycleCalcTypeCode', sch03_cycle_calc_type, sch03_company_id, f_sysdate())
                      ||CASE WHEN COALESCE(sch03_holiday_cd,'0') = '0' THEN '' ELSE '('||f_cdnm('HolidaySettleCode', sch03_holiday_cd, sch03_company_id, f_sysdate())||')' END
             END
      INTO v_NM
      FROM sch03_deadline
     WHERE sch03_deadline_id = p_deadline_id;
    -------------------------------------------------------------------------------------
    RETURN v_NM ;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
