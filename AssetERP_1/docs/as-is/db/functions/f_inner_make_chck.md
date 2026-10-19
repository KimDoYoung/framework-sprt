# f_inner_make_chck

## FUNCTION public.f_inner_make_chck(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)

- 반환: `text`
- 줄 수: 280

```sql
CREATE OR REPLACE FUNCTION public.f_inner_make_chck(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
	declare
	    r1      record;
	    r2      record;
	
	    w_person_id    tdm31_role_desc.tdm31_person_id%type;
	    rr sys99_print%ROWTYPE;
	    v_rowcount     integer;
	    w_tmp_cnt       integer;

	    r_tdm53           tdm53_chck_exct%ROWTYPE;
	    R_tdm42_manl_org  tdm42_manl_org%ROWTYPE;
		check_cnt integer := 0;

 	BEGIN

	    rr := null;
	    
	    rr.sys99_company_id := p_company_id;
	    rr.sys99_person_id  := p_emp_id;
	    rr.sys99_group_id   := p_sys99_group_id;
	
	    delete from sys99_print 
	    where  sys99_company_id   = rr.sys99_company_id
	    and    sys99_person_id    = rr.sys99_person_id
	    and    sys99_group_id     = rr.sys99_group_id;

       SELECT *
          INTO r_tdm53
          FROM tdm53_chck_exct
         WHERE tdm53_chck_exct_id = p_id;

		--이행점검결과집계
		----------------------------------------------------------------------------------------------------------------------------------------------------
        for r1 in
			SELECT t.*
			  FROM (
			        SELECT tdm51_chck_org.*
			             , tdm20_role_nm                                                                                AS tdm51_role_nm                /*직책*/
			             , f_emp_kor_nm(tdm51_exct_id)                                                                  AS tdm51_exct_nm                /*임원*/
			             , COALESCE(task_cnt,0)                                                                         AS tdm51_task_cnt               /*항목수_책무*/
			             , COALESCE(detail_cnt,0)                                                                       AS tdm51_detail_cnt             /*항목수_책무세부*/
			             , COALESCE(duty_cnt,0)                                                                         AS tdm51_duty_cnt               /*항목수_관리의무*/
			             , COALESCE(manl_cnt,0)                                                                         AS tdm51_manl_cnt               /*항목수_점검항목*/
			             , COALESCE(month_check_cnt,0)                                                                  AS tdm51_month_check_cnt        /*당월점검_점검건수*/
			             , COALESCE(month_check1_cnt,0)                                                                 AS tdm51_month_check1_cnt       /*당월점검_적정*/
			             , COALESCE(month_check2_cnt,0)                                                                 AS tdm51_month_check2_cnt       /*당월점검_미흡*/
			             , COALESCE(month_check9_cnt,0)                                                                 AS tdm51_month_check9_cnt       /*당월점검_해당없음*/
                         , f_org_nm(tdm51_org_id, f_today())															AS tdm51_org_nm
			             , '공통'																							AS tdm51_status
			          FROM tdm51_chck_org
			               INNER JOIN tdm20_role ON tdm20_role_id = tdm51_role_id
			               LEFT JOIN ( SELECT tdm43_manl_org_id
			                                 , COUNT(DISTINCT tdm43_task_id)                task_cnt
			                                 , COUNT(DISTINCT tdm43_task_relate_detail_id)  detail_cnt
			                                 , COUNT(DISTINCT tdm43_task_relate_duty_id)    duty_cnt
			                                 , COUNT(*)                                     manl_cnt
			                              FROM tdm43_manl
			                                   LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
			                             WHERE tdm43_company_id = r_tdm53.tdm53_company_id
			                               AND tdm10_common_yn = 'true'
			                               AND COALESCE(tdm43_start_date,'9999-12-31'::date) >= (r_tdm53.tdm53_check_ym||'.01')::date
			                             GROUP BY tdm43_manl_org_id ) tdm43 ON tdm43_manl_org_id = tdm51_manl_org_id
			               LEFT JOIN ( SELECT tdm52_chck_org_id
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11')                                 THEN 1 ELSE 0 END)  month_check_cnt
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '1' THEN 1 ELSE 0 END)  month_check1_cnt
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd IN ('2') THEN 1 ELSE 0 END)  month_check2_cnt
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '9' THEN 1 ELSE 0 END)  month_check9_cnt
			                              FROM tdm52_chck_manl
			                                   LEFT JOIN tdm43_manl ON tdm43_manl_id = tdm52_manl_id
			                                   LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
			                             WHERE tdm52_company_id = r_tdm53.tdm53_company_id
			                               AND tdm10_common_yn = 'true'
			                             GROUP BY tdm52_chck_org_id ) tdm52 ON tdm52_chck_org_id = tdm51_chck_org_id
			         WHERE tdm51_company_id = r_tdm53.tdm53_company_id
			           AND tdm51_check_ym   = r_tdm53.tdm53_check_ym
			           AND tdm51_role_id     = r_tdm53.tdm53_role_id
			       ) t
			UNION ALL
			SELECT t.*
			  FROM (
			        SELECT tdm51_chck_org.*
			             , tdm20_role_nm                                                                                AS tdm51_role_nm                /*직책*/
			             , f_emp_kor_nm(tdm51_exct_id)                                                                  AS tdm51_exct_nm                /*임원*/
			             , COALESCE(task_cnt,0)                                                                         AS tdm51_task_cnt               /*항목수_책무*/
			             , COALESCE(detail_cnt,0)                                                                       AS tdm51_detail_cnt             /*항목수_책무세부*/
			             , COALESCE(duty_cnt,0)                                                                         AS tdm51_duty_cnt               /*항목수_관리의무*/
			             , COALESCE(manl_cnt,0)                                                                         AS tdm51_manl_cnt               /*항목수_점검항목*/
			             , COALESCE(month_check_cnt,0)                                                                  AS tdm51_month_check_cnt        /*당월점검_점검건수*/
			             , COALESCE(month_check1_cnt,0)                                                                 AS tdm51_month_check1_cnt       /*당월점검_적정*/
			             , COALESCE(month_check2_cnt,0)                                                                 AS tdm51_month_check2_cnt       /*당월점검_미흡*/
			             , COALESCE(month_check9_cnt,0)                                                                 AS tdm51_month_check9_cnt       /*당월점검_해당없음*/
                         , f_org_nm(tdm51_org_id, f_today())															AS tdm51_org_nm
			             , '개별'																							AS tdm51_status
			          FROM tdm51_chck_org
			               INNER JOIN tdm20_role ON tdm20_role_id = tdm51_role_id
			               LEFT JOIN ( SELECT tdm43_manl_org_id
			                                 , COUNT(DISTINCT tdm43_task_id)                task_cnt
			                                 , COUNT(DISTINCT tdm43_task_relate_detail_id)  detail_cnt
			                                 , COUNT(DISTINCT tdm43_task_relate_duty_id)    duty_cnt
			                                 , COUNT(*)                                     manl_cnt
			                              FROM tdm43_manl
			                                   LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
			                             WHERE tdm43_company_id = r_tdm53.tdm53_company_id
			                               AND tdm10_common_yn = 'false'
			                               AND COALESCE(tdm43_start_date,'9999-12-31'::date) >= (r_tdm53.tdm53_check_ym||'.01')::date
			                             GROUP BY tdm43_manl_org_id ) tdm43 ON tdm43_manl_org_id = tdm51_manl_org_id
			               LEFT JOIN ( SELECT tdm52_chck_org_id
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11')                                 THEN 1 ELSE 0 END)  month_check_cnt
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '1' THEN 1 ELSE 0 END)  month_check1_cnt
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd IN ('2') THEN 1 ELSE 0 END)  month_check2_cnt
			                                 , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '9' THEN 1 ELSE 0 END)  month_check9_cnt
			                              FROM tdm52_chck_manl
			                                   LEFT JOIN tdm43_manl ON tdm43_manl_id = tdm52_manl_id
			                                   LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
			                             WHERE tdm52_company_id = r_tdm53.tdm53_company_id
			                               AND tdm10_common_yn = 'false'
			                             GROUP BY tdm52_chck_org_id ) tdm52 ON tdm52_chck_org_id = tdm51_chck_org_id
			         WHERE tdm51_company_id = r_tdm53.tdm53_company_id
			           AND tdm51_check_ym   = r_tdm53.tdm53_check_ym
			           AND tdm51_role_id     = r_tdm53.tdm53_role_id
			       ) t
			 ORDER BY 1, 2
        LOOP
            rr.sys99_string01  := 'CHCK_TOTAL';
            rr.sys99_string02  := r1.tdm51_org_nm;
            rr.sys99_string03  := r1.tdm51_status;
            rr.sys99_long01    := r1.tdm51_task_cnt;
            rr.sys99_long02    := r1.tdm51_detail_cnt;
            rr.sys99_long03    := r1.tdm51_duty_cnt;
            rr.sys99_long04    := r1.tdm51_manl_cnt;
            rr.sys99_long05    := r1.tdm51_month_check_cnt;
            rr.sys99_long06    := r1.tdm51_month_check1_cnt;
            rr.sys99_long07    := r1.tdm51_month_check2_cnt;
            rr.sys99_long08    := r1.tdm51_month_check9_cnt;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
		----------------------------------------------------------------------------------------------------------------------------------------------------
		
		--점검 결과 미흡에 대한 상세 내용 및 조치
		----------------------------------------------------------------------------------------------------------------------------------------------------
        for r1 in
            SELECT tdm53_chck_exct_id
                 , CONCAT( CASE WHEN tdm10.tdm10_common_yn = 'true' THEN '<b>(공통책무)</b>' ELSE '<b>(개별책무)</b>' END, tdm43.tdm43_task_nm
                           , '<br>'
                           , '<b>(책무세부)</b>', tdm43.tdm43_task_relate_detail_nm
                           , '<br>'
                           , '<b>(관리의무)</b>', tdm43.tdm43_task_relate_duty_nm)                                                                  AS tdm54_task_info
                 , CONCAT(   '<b>(점검항목명)</b>', tdm43.tdm43_check_item 
                           , '<br>'
                           , '<b>(점검주기)</b>', CONCAT( f_cdnm('CycleCode', tdm43.tdm43_check_cycle_cd, tdm54.tdm54_company_id, tdm54.tdm54_reg_date)
                                                                  , '('||CASE WHEN tdm43.tdm43_check_cycle_cd IN ('06','98')
                                                                              THEN tdm43.tdm43_check_month
                                                                              ELSE null END||')' )
                           , '<br>'
                           , '<b>(점검자의견)</b>', tdm52.tdm52_check_cmnt)                                                                          AS tdm54_check_info
                 , CONCAT(   '<b>(조치명)</b>', tdm54.tdm54_action_nm
                           , '<br>'
                           , '<b>(조치완료예정일)</b>', to_char(tdm54.tdm54_due_date,'yyyy-mm-dd') 
                           , '<br>'
                           , '<b>(조치예정자)</b>', f_emp_kor_nm(tdm54.tdm54_plan_action_emp_id)
                           , '<br>'
                           , '<b>(조치계획)</b>', tdm54.tdm54_action_plan)                                                                          AS tdm54_plan_info
                 , CONCAT(   '<b>(부서장의견)</b>', tdm60.tdm60_appr_cmnt )                                                                          AS tdm54_confirm_cmnt
              FROM tdm53_chck_exct tdm53
                   INNER JOIN tdm51_chck_org       tdm51 ON tdm51.tdm51_chck_job_id  = tdm53.tdm53_chck_job_id
                   INNER JOIN tdm52_chck_manl      tdm52 ON tdm52.tdm52_chck_org_id  = tdm51.tdm51_chck_org_id
                   INNER JOIN tdm54_chck_insuff    tdm54 ON tdm54.tdm54_chck_manl_id = tdm52.tdm52_chck_manl_id
                   INNER JOIN tdm43_manl           tdm43 ON tdm43.tdm43_manl_id      = tdm52.tdm52_manl_id
                   INNER JOIN tdm10_task           tdm10 ON tdm10.tdm10_task_id      = tdm43.tdm43_task_id
                    LEFT JOIN tdm60_chck_manl_appr tdm60 ON tdm60.tdm60_chck_manl_id = tdm52.tdm52_chck_manl_id
             WHERE tdm53.tdm53_chck_exct_id = p_id
               AND tdm60.tdm60_appr_seq = (SELECT MIN(tdm60_2.tdm60_appr_seq)
                                             FROM tdm60_chck_manl_appr tdm60_2
                                            WHERE tdm60_2.tdm60_chck_manl_id =tdm52.tdm52_chck_manl_id)
        LOOP
            rr.sys99_string01  := 'CHCK_MANL';
            rr.sys99_text01    := r1.tdm54_task_info;
            rr.sys99_text02    := r1.tdm54_check_info;
            rr.sys99_text03    := r1.tdm54_plan_info;
            rr.sys99_text04    := r1.tdm54_confirm_cmnt;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
		----------------------------------------------------------------------------------------------------------------------------------------------------
		
		--당월 기준 진행중 또는 종료된 미흡/개선 조치 사항
		----------------------------------------------------------------------------------------------------------------------------------------------------
        for r2 in
            SELECT f_org_nm(tdm54_org_id, f_today())																		AS tdm54_org_nm				-- 부서명
                 , '<b>(조치명)</b>'||COALESCE(tdm54_action_nm,'')															AS tdm54_action_nm			-- 조치명
                 , '<b>(조치구분)</b>'||f_cdnm('TdmCheckResult', tdm52_check_result_cd, tdm54_company_id, tdm54_reg_date)		AS tdm54_insuff_type		-- 조치 구분
                 , '<b>(등록일자)</b>'||COALESCE(to_char(tdm54_reg_date, 'YYYY-MM-DD'),'')										AS tdm54_reg_date			-- 등록일
                 , '<b>(완료예정일자)</b>'||COALESCE(to_char(tdm54_due_date, 'YYYY-MM-DD'),'')									AS tdm54_due_date			-- 완료예정일
                 , '<b>(조치 담당자)</b>'||CASE WHEN tdm54_action_emp_id IS NOT NULL THEN f_emp_kor_nm(tdm54_action_emp_id)
                                           ELSE f_emp_kor_nm(tdm54_plan_action_emp_id) END									AS tdm54_action_emp_nm		-- 담당자
                 , '<b>(진행상태)</b>'||f_cdnm('TdmInsuffStatus', tdm54_status_cd, tdm54_company_id, tdm54_reg_date)			AS tdm54_status_nm			-- 진행 상태
                 , '<b>(조치계획내용)</b>'||COALESCE(tdm54_action_plan,'')														AS tdm54_action_plan		-- 조치 계획 내용
                 , '<b>(조치계획의견)</b>'||COALESCE(tdm60_appr_cmnt,'')														AS tdm54_appr_cmnt			-- 조치 계획 의견
                 , '<b>(조치결과)</b>'||COALESCE(tdm54_action_cmnt,'')															AS tdm54_action_cmnt		-- 조치 결과
                 , '<b>(조치결과의견)</b>'||COALESCE(tdm61.tdm61_appr_cmnt,'')													AS tdm54_appr_result_cmnt	-- 조치 결과 의견
                 , *
              FROM (SELECT *
                      FROM tdm54_chck_insuff
                           INNER JOIN tdm52_chck_manl ON tdm52_chck_manl_id = tdm54_chck_manl_id
                           INNER JOIN tdm51_chck_org  ON tdm51_chck_org_id = tdm52_chck_org_id
                     WHERE ( tdm54_status_cd IN ('10', '11', '26') AND (tdm51_check_ym||'.01')::date < (r_tdm53.tdm53_check_ym||'.01')::date)
                       AND tdm54_role_id = r_tdm53.tdm53_role_id
                     UNION ALL
                    SELECT *
                      FROM tdm54_chck_insuff
                           INNER JOIN tdm52_chck_manl ON tdm52_chck_manl_id = tdm54_chck_manl_id
                           INNER JOIN tdm51_chck_org  ON tdm51_chck_org_id = tdm52_chck_org_id
                      WHERE ( tdm54_status_cd NOT IN ('10', '11', '26') AND to_char(tdm54_action_date, 'YYYY.MM') = r_tdm53.tdm53_check_ym)
                        AND tdm54_role_id = r_tdm53.tdm53_role_id)t
              LEFT JOIN tdm61_chck_insuff_appr tdm61 ON tdm61_chck_insuff_id = t.tdm54_chck_insuff_id
              LEFT JOIN tdm60_chck_manl_appr tdm60 ON tdm60_chck_manl_id = tdm52_chck_manl_id
             WHERE tdm61.tdm61_appr_seq = (SELECT MIN(tdm61_2.tdm61_appr_seq)
                                             FROM tdm61_chck_insuff_appr tdm61_2
                                            WHERE tdm61_2.tdm61_chck_insuff_id = t.tdm54_chck_insuff_id)
               AND tdm60.tdm60_appr_seq = (SELECT MIN(tdm60_2.tdm60_appr_seq)
                                             FROM tdm60_chck_manl_appr tdm60_2
                                            WHERE tdm60_2.tdm60_chck_manl_id = t.tdm52_chck_manl_id)
        LOOP
            rr.sys99_string01  := 'CHCK_INSUFF';
            rr.sys99_string02  := r2.tdm54_org_nm;
            rr.sys99_string03  := r2.tdm54_action_nm;
            rr.sys99_string04  := r2.tdm54_insuff_type;
            rr.sys99_string05  := r2.tdm54_reg_date;
            rr.sys99_string06  := r2.tdm54_due_date;
            rr.sys99_string07  := r2.tdm54_action_emp_nm;
            rr.sys99_string08  := r2.tdm54_status_nm;
            rr.sys99_text01    := r2.tdm54_action_plan;
            rr.sys99_text02    := r2.tdm54_appr_cmnt;
            rr.sys99_text03    := r2.tdm54_action_cmnt;
            rr.sys99_text04    := r2.tdm54_appr_result_cmnt;
            rr.sys99_long01    := r2.tdm54_chck_insuff_id;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
		------------------------------------------------------------------------- 
		
		--점검 종합 의견
		-------------------------------------------------------------------------- 
        for r2 in
            SELECT tdm59_chck_appr_cmnt_id      AS tdm59_chck_appr_cmnt_id
                 , tdm59_cmnt_type              AS tdm59_cmnt_type
                 , tdm59_appr_cmnt              AS tdm59_appr_cmnt
                 , tdm59_report_cmnt            AS tdm59_report_cmnt
                 , tdm59_submit_yn              AS tdm59_submit_yn
              FROM tdm59_chck_appr_cmnt
                   INNER JOIN tdm53_chck_exct ON tdm53_chck_exct_id = tdm59_chck_exct_id AND tdm53_exct_id = tdm59_appr_emp_id
             WHERE tdm53_chck_exct_id = p_id
               AND tdm59_cmnt_type = 'SELF'
        LOOP
            rr.sys99_string01  := 'CHCK_APPRCMNT';
            rr.sys99_text01    := r2.tdm59_report_cmnt;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
		

		RETURN  'Y';

	END;
	$function$
```
