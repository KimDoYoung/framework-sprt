# f_create_schdeadlineday

## FUNCTION public.f_create_schdeadlineday(p_deadline_id numeric, p_std_date date)

- 반환: `character varying`
- 줄 수: 73

```sql
CREATE OR REPLACE FUNCTION public.f_create_schdeadlineday(p_deadline_id numeric, p_std_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_std_date      DATE;
    v_schedule_cd   VARCHAR(1);
    v_cycle_cd      VARCHAR(2);
    v_close_date    DATE;
    v_errMsg        VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT CASE sch03_cycle_cd WHEN '02' THEN (p_std_date + INTERVAL '-7day'  )::date
                               WHEN '03' THEN (p_std_date + INTERVAL '-1month')::date
                               WHEN '04' THEN (p_std_date + INTERVAL '-3month')::date
                               WHEN '05' THEN (p_std_date + INTERVAL '-6month')::date
                               WHEN '06' THEN (p_std_date + INTERVAL '-1year' )::date
                               ELSE p_std_date END
         , sch03_schedule_cd
         , sch03_cycle_cd
         , COALESCE(sch03_close_date,'9999-12-31'::date)
      INTO v_std_date
         , v_schedule_cd
         , v_cycle_cd
         , v_close_date
      FROM sch03_deadline
     WHERE sch03_deadline_id = p_deadline_id;
    -------------------------------------------------------------------------------------
    -- 스케줄(1)이 아니거나, 일별(01)/수시(99)인 경우 생성안함
    IF v_schedule_cd != '1' OR v_cycle_cd IN ('01','99') THEN
        RAISE NOTICE '생성안함 [%]-[%]', v_schedule_cd, v_cycle_cd;
        RETURN 'Y';
    END IF;
    -------------------------------------------------------------------------------------
    DELETE
      FROM sch09_deadline_day
     WHERE sch09_deadline_id  = p_deadline_id
       AND sch09_day         >= v_std_date;
    -------------------------------------------------------------------------------------
    INSERT
      INTO sch09_deadline_day
    SELECT f_create_seq()
         , sch03_deadline_id
         , close_date
      FROM (
             SELECT DISTINCT
                    sch03_deadline_id
                  , f_get_std_date(sch03_deadline_id, sys12_day::date, sch01_company_id) close_date
               FROM sch01_info
                    INNER JOIN sch03_deadline ON sch03_info_id    = sch01_info_id
                    INNER JOIN sys12_calendar ON sys12_company_id = sch01_company_id
              WHERE sch03_deadline_id = p_deadline_id
                AND sch03_cycle_cd IN ('02','03','04','05','06') --주/월/분기/반기/연
                AND COALESCE(sch01_use_yn, 'false') = 'true'
                AND sys12_day BETWEEN GREATEST(v_std_date, sch03_start_date)::timestamp
                                  AND LEAST(p_std_date + INTERVAL '5year', COALESCE(sch03_close_date,'9999-12-31'))::timestamp
           ) t
     WHERE close_date != '1900-01-01';
    -------------------------------------------------------------------------------------
    DELETE
      FROM sch09_deadline_day
     WHERE sch09_deadline_id  = p_deadline_id
       AND sch09_day          > v_close_date;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN v_errMsg||'-'||SQLERRM;
END;
$function$
```
