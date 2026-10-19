# tdm_create_data_fss

## FUNCTION public.tdm_create_data_fss(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp character varying)

- 반환: `text`
- 줄 수: 506

```sql
CREATE OR REPLACE FUNCTION public.tdm_create_data_fss(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp character varying)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
    declare
        r1      record;
        rr sys99_print%ROWTYPE;

        R_tdm36_role_report   tdm36_role_report%ROWTYPE;
        w_cnt    integer ;
        w_bf_report_date date;
		w_role_allc_date date; 


		w_tdm32_reason_cd   tdm32_role_digm.tdm32_reason_cd%type;

    BEGIN
        w_cnt  := 0;
        rr     := null;

        select *
        from   tdm36_role_report 
        into   R_tdm36_role_report
        where  tdm36_role_report_id = p_id  ;


        IF NOT FOUND THEN
            RAISE NOTICE 'Job not foud in tdm36_role_report  ' ;
            RETURN 'N';
        END IF;


        --최근 이사회 개최일 
        select coalesce ( max(tdm36_board_open_date),  to_date('20000101','yyyymmdd'))
        into   w_bf_report_date 
        from   tdm36_role_report
        where  tdm36_company_id      = R_tdm36_role_report.tdm36_company_id
		and    tdm36_role_report_id  <> p_id
        and    tdm36_board_open_date <= R_tdm36_role_report.tdm36_board_open_date;

        
 
        rr.sys99_company_id := p_company_id;
        rr.sys99_person_id  := p_emp_id;
        rr.sys99_group_id   := p_sys99_group_id;
    
        delete from sys99_print 
        where  sys99_company_id   = rr.sys99_company_id
        and    sys99_person_id    = rr.sys99_person_id
        and    sys99_group_id     = rr.sys99_group_id
        and    sys99_string01     = 
                case when  i_rpt_tp = 'MK_FSS_COVER'   then 'FSS_COVER'
                    when i_rpt_tp = 'MK_FSS_OVERVIEW'  then 'FSS_OVERVIEW' 
                    when i_rpt_tp = 'MK_FSS_CEO_CFRM'  then 'FSS_CEO_CFRM' 
                    when i_rpt_tp = 'MK_FSS_BOARD'     then 'FSS_BOARD' 
                end;


        if i_rpt_tp = 'MK_FSS_COVER' then   -- 표지부 

            rr.sys99_string01  := 'FSS_COVER';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy.mm.dd');
            rr.sys99_text02    := '작성자 : ' || R_tdm36_role_report.tdm36_upd_nm ;
            rr.sys99_text03    := '전화번호 : ' ; -- 02-123-4567';

			begin			
				select  '전화번호 : '  || emp01_office_telno  into strict  rr.sys99_text03   
				from  emp01_person
				where emp01_company_id = R_tdm36_role_report.tdm36_company_id  
				and   emp01_kor_nm     = R_tdm36_role_report.tdm36_upd_nm 
				and   emp01_office_telno is not null
				limit 1;
			exception when no_data_found then
				 rr.sys99_text03    := '전화번호 : ' ;
			end;


			begin
	            select rr.sys99_text02 || ' (' || f_get_emptrans(tdm01_person_id,  f_today(),   'pos_nm')  || ')'
	            into   strict rr.sys99_text02
	            from   tdm01_hr
	            where  tdm01_company_id =  R_tdm36_role_report.tdm36_company_id
	            and    tdm01_person_nm  = R_tdm36_role_report.tdm36_upd_nm;
			exception when no_data_found then
				null;
			end;

            rr.sys99_print_id  := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;


        elsif i_rpt_tp = 'MK_FSS_CEO_CFRM' then    -- 대표이사 확인서  (첨부) 
 
            rr.sys99_string01  := 'FSS_CEO_CFRM';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy년 mm월 dd일'); 
            --rr.sys99_text02    := '김 대 표 (인)';
            --rr.sys99_text03    := '공 대 표 (인)';

            w_cnt := 0;
            for r1 in (
/*
                select  tdm01_person_nm  
                    , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
                    , tdm30_role_allc_date
                from   getTdm30RoleAllc(R_tdm36_role_report.tdm36_company_id, R_tdm36_role_report.tdm36_report_date + 10 , true)
                left outer join tdm20_role
                on     tdm30_role_id = tdm20_role_id
                left outer join tdm01_hr
                on     tdm30_person_id =  tdm01_person_id
                where  tdm20_role.tdm20_role_type='C'
*/
				with lists
				as (
				   SELECT  emp03_person_id 
						 , emp01_kor_nm
				         , CASE WHEN emp03_trans_cd = '900'
				                THEN emp03_trans_date
				                ELSE (
				                    SELECT MIN(a.emp03_trans_date) - '1 day'::interval
				                      FROM emp03_trans a
				                     WHERE a.emp03_person_id = t2.emp03_person_id
				                       AND a.emp03_trans_date > t2.emp03_trans_date
				                )
				           END                                                                         AS emp00_close_date
				         , emp03_pos_cd                                                                AS emp00_pos_cd
				         , f_cdnm('EmpPosCode', emp03_pos_cd, emp01_company_id, emp03_trans_date)      AS emp00_pos_nm
				         , emp03_title_cd                                                              AS emp00_title_cd
				         , f_get_empTrans(emp03_person_id, emp03_trans_date::date, 'title_nm')         AS emp00_title_nm
				      FROM emp01_person t1
				           INNER JOIN emp03_trans t2 ON emp03_person_id = emp01_person_id
				     WHERE 1=1
				        AND emp01_company_id = p_company_id 
				       AND 'Y' = (CASE WHEN (SELECT COUNT(*) FROM emp04_add_title WHERE emp04_add_person_id = emp01_person_id) = 0
				                       THEN 'Y'
				                  ELSE (CASE WHEN (SELECT COUNT(*)
				                                     FROM emp01_person a
				                                          INNER JOIN emp04_add_title ON emp04_person_id = a.emp01_person_id
				                                    WHERE emp04_add_person_id = t1.emp01_person_id) = 0 THEN 'N'
				                        ELSE 'Y' END)
				             END)
				)
				select distinct emp01_kor_nm, emp00_pos_nm
				from   lists
				where  emp00_close_date is null
				and    (emp00_pos_cd = '100' or emp00_title_cd ='100')
				-- order by emp03_person_id
            ) loop
                w_cnt := w_cnt + 1;
 
                if w_cnt = 1 then
                    rr.sys99_text02    :=  r1.emp01_kor_nm || ' (인)';
                elseif  w_cnt = 2 then
                    rr.sys99_text03    :=   r1.emp01_kor_nm || ' (인)';
                else
                    RAISE NOTICE '대표자 3인 이상은 화면을 수정해야 합니다. IT에 연락하십시오  ' ;
                    RETURN 'N';
                end if;
                
            end loop;


            rr.sys99_print_id  := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;

        elsif i_rpt_tp = 'MK_FSS_BOARD' then   -- 이사회 결의서   (첨부) 
 
            rr.sys99_string01  := 'FSS_BOARD';
            rr.sys99_string02  := 'FSS_BOARD_INFO';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy년 mm월 dd일');  
            --rr.sys99_text02    := '대표자 : 김 대 표 (인)';
            --rr.sys99_text03    := '대표자 : 공 대 표 (인)';

            w_cnt := 0;
            for r1 in (

/*
                select  tdm01_person_nm  
                    , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
                    , tdm30_role_allc_date
                from   getTdm30RoleAllc(R_tdm36_role_report.tdm36_company_id, R_tdm36_role_report.tdm36_report_date + 10 , true)
                left outer join tdm20_role
                on     tdm30_role_id = tdm20_role_id
                left outer join tdm01_hr
                on     tdm30_person_id =  tdm01_person_id
                where  tdm20_role.tdm20_role_type='C'
*/
				with lists
				as (
				   SELECT  emp03_person_id 
						 , emp01_kor_nm
				         , CASE WHEN emp03_trans_cd = '900'
				                THEN emp03_trans_date
				                ELSE (
				                    SELECT MIN(a.emp03_trans_date) - '1 day'::interval
				                      FROM emp03_trans a
				                     WHERE a.emp03_person_id = t2.emp03_person_id
				                       AND a.emp03_trans_date > t2.emp03_trans_date
				                )
				           END                                                                         AS emp00_close_date
				         , emp03_pos_cd                                                                AS emp00_pos_cd
				         , f_cdnm('EmpPosCode', emp03_pos_cd, emp01_company_id, emp03_trans_date)      AS emp00_pos_nm
				         , emp03_title_cd                                                              AS emp00_title_cd
				         , f_get_empTrans(emp03_person_id, emp03_trans_date::date, 'title_nm')         AS emp00_title_nm
				      FROM emp01_person t1
				           INNER JOIN emp03_trans t2 ON emp03_person_id = emp01_person_id
				     WHERE 1=1
				        AND emp01_company_id = p_company_id 
				       AND 'Y' = (CASE WHEN (SELECT COUNT(*) FROM emp04_add_title WHERE emp04_add_person_id = emp01_person_id) = 0
				                       THEN 'Y'
				                  ELSE (CASE WHEN (SELECT COUNT(*)
				                                     FROM emp01_person a
				                                          INNER JOIN emp04_add_title ON emp04_person_id = a.emp01_person_id
				                                    WHERE emp04_add_person_id = t1.emp01_person_id) = 0 THEN 'N'
				                        ELSE 'Y' END)
				             END)
				)
				select distinct emp01_kor_nm, emp00_pos_nm
				from   lists
				where  emp00_close_date is null
				and    (emp00_pos_cd = '100' or emp00_title_cd ='100')
				-- order by emp03_person_id
            ) loop
                w_cnt := w_cnt + 1;
 
                if w_cnt = 1 then
                    rr.sys99_text02    := '대표자 : ' || r1.emp01_kor_nm || ' (인)';
                elseif  w_cnt = 2 then
                    rr.sys99_text03    := '대표자 : ' || r1.emp01_kor_nm || ' (인)';
                else
                    RAISE NOTICE '대표자 3인 이상은 화면을 수정해야 합니다. IT에 연락하십시오  ' ;
                    RETURN 'N';
                end if;
                
            end loop;

            rr.sys99_text04    := '1. 일   시 : ' ||  to_char(R_tdm36_role_report.tdm36_board_open_date, 'yyyy.mm.dd');  
            rr.sys99_text05    := '2. 장   소 : ' ||  R_tdm36_role_report.tdm36_board_open_loc ; 
            rr.sys99_text06    := '3. 이사총수 : ' ||  R_tdm36_role_report.tdm36_memb_tot_cnt  || ' 명';
            rr.sys99_text07    := '4. 출석이사 : ' ||  R_tdm36_role_report.tdm36_memb_attend_cnt  || ' 명' ;
            rr.sys99_text08    := '5. 결의안건 : 책무구조도 마련 및 제출의 건';

            rr.sys99_text09    := '위 안건에 대하여 이사회에서 심의한 결과, 재적이사 총 ' 
							|| R_tdm36_role_report.tdm36_memb_tot_cnt  || '명중 ' 
							|| R_tdm36_role_report.tdm36_memb_attend_cnt  || '명의 이사가 출석하여 원안대로 가결되었음을 확인합니다.';

            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;

 
            for r1 in
                --select '이사 김이사 (인)' as str  union all
                --select '이사 조감사 (인)' as str
                select  trim( regexp_split_to_table(R_tdm36_role_report.tdm36_memb_yes_nm  , ',')) AS str
   
            loop
                rr.sys99_string01  := 'FSS_BOARD';
                rr.sys99_string02  := 'FSS_BOARD_YES';
                rr.sys99_text01    := r1.str || '   (인)';
                rr.sys99_print_id  := f_create_seq();
    
                INSERT INTO sys99_print  SELECT (rr).*;
            end loop;


        elsif i_rpt_tp = 'MK_FSS_OVERVIEW' then   -- 책무구조도 제출개요 (붙임1)

            rr.sys99_string01  := 'FSS_OVERVIEW';
            rr.sys99_string02  := 'ASIS_TOBE';

/*
	-- 현대하임 202406256305650
	202606126536863	투자운용본부장
	202606126536843	이사회 의장
	202607210256722	투자운용부문대표이사

	-- 피에스 202605285327799
	202606227303907	이사회 의장
	202606227303911	대표이사
*/

-- call p_log('kdj', 'w_bf_report_date ' ||  w_bf_report_date ||  ' w_fr_exct_id ' ||  R_tdm36_role_report.tdm36_board_open_date || ' p_company_id ' || p_company_id );

			-- 최초제출시에는 책무배분일을 이사회 개최일로 간주하자 
			if w_bf_report_date <= to_date('20260702','yyyymmdd') then
				w_bf_report_date := to_date('20260702','yyyymmdd') ;
			end if;



			begin
				select tdm32_reason_cd into strict w_tdm32_reason_cd
				from
				(
					select tdm32_reason_cd  , row_number() over (   order by tdm32_reg_date desc )  as seq
					from   tdm32_role_digm
					where  tdm32_company_id = p_company_id
					and    tdm32_reg_date <= R_tdm36_role_report.tdm36_board_open_date
				) t where seq =1;
			exception when no_data_found then
				w_tdm32_reason_cd := 'D03';
			end;


			-- 제출일 이전의 최종 배분기준일  
			select coalesce (max(tdm34_role_allc_date), R_tdm36_role_report.tdm36_report_date )
			into   w_role_allc_date
			from   tdm30_role_allc 
			INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
			where  tdm30_company_id  = p_company_id
			and    tdm34_role_allc_date <= R_tdm36_role_report.tdm36_report_date ;



            -- 기간내에 변경분이 있을때만 생성된다 
            w_cnt := 0;
            for r1 in
	 			with lists
				as (
					select tdm30_role_id role_id, case when tdm30_role_id = 202607210256722 then 202606126536863 end  old_role_id
					from   tdm30_role_allc 
					INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
					--INNER JOIN apr01_appr             ON apr01_appr_id = tdm34_appr_id AND apr01_status_cd  = '30' 
					where  tdm30_company_id  = p_company_id
					and    tdm34_role_allc_date >= w_bf_report_date
					and    tdm34_role_allc_date <= w_role_allc_date
					-- and    tdm30_role_id in (202606126536843, 202607210256722, 202606126536863, 202606227303907, 202606227303911 ) 
				) 
				, list_include_old_role
				as  (
					select role_id,  old_role_id
					from   lists
					union all 
					select tdm30_role_id,  old_role_id
					from   tdm30_role_allc, lists
					where  tdm30_role_id =  lists.old_role_id
				)		
				, list_role_exct
				as (
					select tdm30_role_id role_id , old_role_id
						, (select tdm20_role_nm   from tdm20_role where tdm20_role_id   = tdm30_role_id )  role_nm
						, (select tdm01_person_nm from tdm01_hr   where tdm01_person_id = tdm30_person_id ) person_nm
						, tdm30_person_id person_id
						, row_number() over ( partition by  coalesce(old_role_id, tdm30_role_id )   order by tdm30_start_date  desc  ) as start_seq 
						, count(*) over ( partition by coalesce(old_role_id, tdm30_role_id )     ) as role_cnt  
						, f_cdnm ('TdmDescRegReason', w_tdm32_reason_cd , 0,  f_sysdate() )  Tdm_Desc_ReasonNm
						, (select substr(to_decrypts(emp02_ctz_no),1,6) from emp02_others where  emp02_person_id  = tdm30_person_id)  ctz_no
					from   tdm30_role_allc
					INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
					join   list_include_old_role on role_id = tdm30_role_id
					and    tdm34_role_allc_date <= w_role_allc_date
				), list_role_manual
				as ( 
					select  tdm41_manl_job_id
						, coalesce(old_role_id, role_id)    new_and_old_role_id
						, tdm43_task_id    task_id
						, tdm43_task_nm    task_nm
						, tdm43_role_id    role_id
						, tdm43_task_relate_detail_id  detail_id
						, tdm43_task_relate_detail_nm  detail_nm
						, max( list.Tdm_Desc_ReasonNm) Tdm_Desc_ReasonNm
						, ( select role_nm    from  list_role_exct where role_id  = tdm43_role_id  and start_seq=2 ) bf_role_nm
						, ( select ctz_no     from  list_role_exct where role_id  = tdm43_role_id  and start_seq=2 ) bf_ctz_no
						, ( select person_nm  from  list_role_exct where role_id  = tdm43_role_id  and start_seq=2 ) bf_person_nm
						, ( select role_nm    from  list_role_exct where role_id  = tdm43_role_id  and start_seq=1 ) af_role_nm
						, ( select ctz_no     from  list_role_exct where role_id  = tdm43_role_id  and start_seq=1 ) af_ctz_no
						, ( select person_nm  from  list_role_exct where role_id  = tdm43_role_id  and start_seq=1 ) af_person_nm
						, row_number() over ( partition by coalesce(old_role_id, role_id)   order by coalesce(old_role_id, role_id), tdm43_task_id,  tdm43_task_relate_detail_id  ) as seq
					from tdm43_manl
					join tdm41_manl_duty        on tdm41_manl_duty_id = tdm43_manl_duty_id
					join list_role_exct  list   on list.role_id       = tdm43_role_id      and list.person_id =  tdm43_exct_id
					-- where list.role_cnt >=2
					group by coalesce(old_role_id, role_id), tdm41_manl_job_id
						, tdm43_task_id
						, tdm43_task_nm
						, tdm43_role_id
						, tdm43_task_relate_detail_id
						, tdm43_task_relate_detail_nm
						, list.role_id, list.start_seq 
				),
				list_role_manl_job_id
				as (
					select  new_and_old_role_id, tdm41_manl_job_id
					, row_number() over ( partition by  new_and_old_role_id  order by tdm41_manl_job_id  desc  )   manl_job_seq
					from    list_role_manual
					group by new_and_old_role_id, tdm41_manl_job_id
				)
				select  a.new_and_old_role_id  role_id
					--, seq
					, max( Tdm_Desc_ReasonNm) Tdm_Desc_ReasonNm
					, max(bf_role_nm) bf_role_nm
					, max(bf_ctz_no) bf_ctz_no
					, max(bf_person_nm )bf_person_nm
					, max(case when manl_job_seq =2 then task_nm       end) bf_task_nm
					, max(case when manl_job_seq =2 then detail_nm     end) bf_detail_nm
					, max(af_role_nm) af_role_nm
					, max(af_ctz_no) af_ctz_no
					, max(af_person_nm )af_person_nm
					, max(case when manl_job_seq =1 then task_nm       end) af_task_nm
					, max(case when manl_job_seq =1 then detail_nm     end) af_detail_nm
				from    list_role_manual  a, list_role_manl_job_id b
				where   b.new_and_old_role_id = a.new_and_old_role_id  and   b.tdm41_manl_job_id = a.tdm41_manl_job_id
				group by  a.new_and_old_role_id, task_id
					, task_nm
					, detail_id
					, detail_nm
				order by  a.new_and_old_role_id, task_id, detail_id
            loop

                rr.sys99_string10  := r1.role_id ;
                rr.sys99_string11  := r1.bf_person_nm;
				if coalesce( r1.bf_role_nm, 'N/A') = 'N/A'  then
	                rr.sys99_string12  := '';
				else
					rr.sys99_string12  := coalesce( r1.bf_ctz_no, '미등록');
				end if;
                rr.sys99_string13  := r1.bf_role_nm;
                rr.sys99_string14  := r1.bf_task_nm;
                rr.sys99_string15  := r1.bf_detail_nm;

                rr.sys99_string16  := r1.af_person_nm;
                rr.sys99_string17  := coalesce( r1.af_ctz_no, '미등록');
                rr.sys99_string18  := r1.af_role_nm;
                rr.sys99_string19  := r1.af_task_nm;
                rr.sys99_string20  := r1.af_detail_nm;
                rr.sys99_string21  := r1.Tdm_Desc_ReasonNm ;

                rr.sys99_print_id  := f_create_seq();
                INSERT INTO sys99_print  SELECT (rr).*;

                w_cnt  := w_cnt +1;

            end loop;

            -----------------

            rr.sys99_string02  := 'REPORT_TP';

            if w_cnt = 0 then
                rr.sys99_string11  := '1. 구분 : 신규 제출';
                rr.sys99_string12  := '- 제출사유 : 금융관계법령 변경';
            else
                rr.sys99_string11  := '1. 구분 : 변경 제출';
                rr.sys99_string12  := '- 제출사유 : ' || rr.sys99_string21;   -- 마지막의 등록사유 
            end if;

            rr.sys99_print_id  := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;


            -- 신규, 변경분을 표시한다
            for r1 in  
                with lists
                as (
                select  sys99_print_id
                    , sys99_string10 as  group_nm
                    , sys99_string11 as  asis_exct_nm
                    , sys99_string12 as  asis_person_no
                    , sys99_string13 as  asis_position
                    , sys99_string14 as  asis_task
                    , sys99_string15 as  asis_detail
                    , sys99_string16 as  tobe_exct_nm
                    , sys99_string17 as  tobe_person_no
                    , sys99_string18 as  tobe_position
                    , sys99_string19 as  tobe_task
                    , sys99_string20 as  tobe_detail
                    , sys99_string21 as  chg_reason  
                from   sys99_print 
                where  sys99_company_id = rr.sys99_company_id 
                and    sys99_person_id  = rr.sys99_person_id
                and    sys99_group_id   = rr.sys99_group_id
                and    sys99_string01  = 'FSS_OVERVIEW'
                and    sys99_string02  = 'ASIS_TOBE'
                order by sys99_print_id
                )
                select sys99_print_id
                    ,(select 'Y' from lists where group_nm = a.group_nm and asis_exct_nm   = a.tobe_exct_nm  limit 1)    tobe_exct_nm_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and asis_person_no = a.tobe_person_no  limit 1)  tobe_person_no_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and asis_position  = a.tobe_position  limit 1)   tobe_position_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and asis_task      = a.tobe_task  limit 1)       tobe_task_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and asis_detail    = a.tobe_detail  limit 1)     tobe_detail_exist_yn
                from   lists a
                order by sys99_print_id
            loop

                update sys99_print
                set sys99_string26  = coalesce( r1.tobe_exct_nm_exist_yn, 'N') ,
                    sys99_string27  = coalesce( r1.tobe_person_no_exist_yn, 'N'),
                    sys99_string28  = coalesce( r1.tobe_position_exist_yn, 'N'),
                    sys99_string29  = coalesce( r1.tobe_task_exist_yn, 'N'),
                    sys99_string30  = coalesce( r1.tobe_detail_exist_yn, 'N')
                where  sys99_print_id = r1.sys99_print_id;

            end loop;
 
        end if;



        RETURN  'Y';

    END;
    $function$
```
