# f_create_law

## FUNCTION public.f_create_law(p_type character varying)

- 반환: `character varying`
- 줄 수: 86

```sql
CREATE OR REPLACE FUNCTION public.f_create_law(p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_errMsg                VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_type = 'R010' THEN
        ---------------------------------------------------------------------------------
        -- 전체 삭제
        v_errMsg := '법규내역 삭제 실패';
        DELETE
          FROM ifi10_law;
        -------------------------------------------------------------------------------------
        -- 전체 생성
        v_errMsg := '법규내역 생성 실패';
        INSERT
          INTO ifi10_law
        SELECT f_create_batchseq()                                                                              AS ifi10_law_id
             , ics01_class_tree_cd                                                                              AS ifi10_law_cd
             , ics01_class_tree_nm                                                                              AS ifi10_law_nm
             , ics01_related_law                                                                                AS ifi10_relevant_law
             , ics01_submit_to                                                                                  AS ifi10_submission
             , CASE WHEN sch03_cycle_cd = '99' THEN '20' ELSE '10' END                                          AS ifi10_cycle_type     --정기/수시구분(10:정기, 20:수시)
             , CASE WHEN sch03_cycle_calc_type IN ('01','07','08','10') THEN '20'
                    WHEN sch03_month_type_cd = '1'                      THEN '20'
                    WHEN sch03_day_type_cd   = '1'                      THEN '20'
                    ELSE '10' END                                                                               AS ifi10_term_type      --기간/날짜구분(10:기간, 20:날짜)
             , CASE sch03_cycle_cd WHEN '01' THEN 'D'
                                   WHEN '02' THEN 'W'
                                   WHEN '03' THEN 'M'
                                   WHEN '04' THEN 'Q'
                                   WHEN '05' THEN 'H'
                                   WHEN '06' THEN 'Y'
                                   WHEN '99' THEN 'O' END                                                       AS ifi10_interval_unit      --주기_구분(D:일, W:주, M:월, Q:분기, H:반기, Y:년, O:수시)
             , CASE WHEN sch03_cycle_calc_type IN ('07','08') OR COALESCE(sch03_day_cd,'') = '31'
                    THEN '10' ELSE '20' END                                                                     AS ifi10_std_date_type      --기준일타입(10:말일, 20:트리거(이벤트))
             , 'A'                                                                                              AS ifi10_relative_position  --이전/이후구분(A:이전(이내), B:이후)
             , CASE WHEN sch03_month_cd = '2' THEN 'Y' ELSE 'N' END                                             AS ifi10_next_yn            --익월/익일여부(Y/N)
             , CASE WHEN sch03_cycle_calc_type IN ('07','08','09') OR COALESCE(sch03_day_cd,'00') = '31'
                    THEN 'Y' ELSE 'N' END                                                                       AS ifi10_last_day_yn        --말일여부(Y/N)
             , CASE WHEN (sch03_cycle_calc_type = '02' AND sch03_period_cd = '4') THEN sch03_num1
                    WHEN (sch03_cycle_calc_type IN ('11','12') AND 
                          COALESCE(sch03_month_cd,'0') not IN ('0','2'))          THEN sch03_num1
                    ELSE null END                                                                               AS ifi10_value_month
             , CASE WHEN (sch03_cycle_calc_type = '02' AND sch03_period_cd = '3') THEN sch03_num1
                    ELSE null END                                                                               AS ifi10_value_week
             , sch03_day_week_cd::numeric                                                                       AS ifi10_value_weekday
             , CASE WHEN (sch03_cycle_calc_type = '02' AND sch03_period_cd IN ('1','2'))       THEN sch03_num1
                    WHEN (sch03_cycle_calc_type = '05' AND COALESCE(sch03_day_cd,'00') = 'AA') THEN sch03_num1
                    WHEN (sch03_cycle_calc_type = '11' AND COALESCE(sch03_day_cd,'00') = 'AA') THEN sch03_num2
                    ELSE null END                                                                               AS ifi10_value_day
             , CASE WHEN sch03_cycle_calc_type = '10'                                               THEN 'N'
                    WHEN COALESCE(sch03_period_cd,'') = '2' OR COALESCE(sch03_day_type_cd,'') = '3' THEN 'Y'
                    ELSE 'N' END                                                                                AS ifi10_biz_calc_yn        --영업일계산여부(Y/N)
             , CASE COALESCE(sch03_holiday_cd,'0') WHEN '0' THEN '10'
                                                   WHEN '1' THEN '30'
                                                   WHEN '2' THEN '20' END                                       AS ifi10_due_date_type      --기한일처리(10:해당없음, 20:직후영업일, 30:직전영업일)
             , to_char(COALESCE(sch03_start_date,'2000-01-01'),'YYYYMMDD')                                      AS ifi10_start_date
             , to_char(COALESCE(sch03_close_date,'2999-12-31'),'YYYYMMDD')                                      AS ifi10_END_date
             , f_get_deadline_nm(sch03_deadline_id, '2')                                                        AS ifi10_deadline_nm
             , ics01_class_tree_id                                                                              AS ifi10_ics_class_tree_id
             , sch03_deadline_id                                                                                AS ifi10_deadline_id
         FROM ics01_class_tree
              inner join sch03_deadline ON ( sch03_info_id = ics01_class_tree_id AND sch03_company_id = 0 )
        WHERE ics01_company_id               = 0
          AND ics01_type_cd                  = 'IT'
          AND COALESCE(ics01_use_yn,'false') = 'true'
          AND f_today() BETWEEN COALESCE(sch03_start_date,'2000-01-01') AND COALESCE(sch03_close_date,'9999-12-31')
        ORDER BY ics01_class_tree_cd;

    END IF;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN v_errMsg||'-'||SQLERRM;
END;
$function$
```
