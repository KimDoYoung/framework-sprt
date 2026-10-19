# f_inner_make_fss

## FUNCTION public.f_inner_make_fss(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp character varying)

- 반환: `text`
- 줄 수: 331

```sql
CREATE OR REPLACE FUNCTION public.f_inner_make_fss(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp character varying)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
	declare
	    r1      record;
	    rr sys99_print%ROWTYPE;

		R_tdm36_role_report   tdm36_role_report%ROWTYPE;
		w_cnt    integer ;
		w_bf_report_date date;

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
		and    tdm36_board_open_date < R_tdm36_role_report.tdm36_board_open_date;

		
 
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

			select rr.sys99_text02 || ' (' || f_get_emptrans(tdm01_person_id,  f_today(),   'pos_nm')  || ')'
			into   rr.sys99_text02
			from   tdm01_hr
			where  tdm01_company_id =  R_tdm36_role_report.tdm36_company_id
			and    tdm01_person_nm  = R_tdm36_role_report.tdm36_upd_nm;


            rr.sys99_print_id  := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;


		elsif i_rpt_tp = 'MK_FSS_CEO_CFRM' then    -- 대표이사 확인서  (첨부) 
 
            rr.sys99_string01  := 'FSS_CEO_CFRM';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy년 mm월 dd일'); 
            --rr.sys99_text02    := '김 대 표 (인)';
            --rr.sys99_text03    := '공 대 표 (인)';

			w_cnt := 0;
			for r1 in (
	            select  tdm01_person_nm  
	                , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
	                , tdm30_role_allc_date
	            from   getTdm30RoleAllc(R_tdm36_role_report.tdm36_company_id, R_tdm36_role_report.tdm36_board_open_date, true)
	            left outer join tdm20_role
	            on     tdm30_role_id = tdm20_role_id
	            left outer join tdm01_hr
	            on     tdm30_person_id =  tdm01_person_id
	            where  tdm20_role.tdm20_role_type='C'
			) loop
				w_cnt := w_cnt + 1;
 
				if w_cnt = 1 then
					rr.sys99_text02    :=  r1.tdm01_person_nm || ' (인)';
				elseif 	w_cnt = 2 then
					rr.sys99_text03    :=   r1.tdm01_person_nm || ' (인)';
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
	            select  tdm01_person_nm  
	                , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
	                , tdm30_role_allc_date
	            from   getTdm30RoleAllc(R_tdm36_role_report.tdm36_company_id, R_tdm36_role_report.tdm36_board_open_date, true)
	            left outer join tdm20_role
	            on     tdm30_role_id = tdm20_role_id
	            left outer join tdm01_hr
	            on     tdm30_person_id =  tdm01_person_id
	            where  tdm20_role.tdm20_role_type='C'
			) loop
				w_cnt := w_cnt + 1;
 
				if w_cnt = 1 then
					rr.sys99_text02    := '대표자 : ' || r1.tdm01_person_nm || ' (인)';
				elseif 	w_cnt = 2 then
					rr.sys99_text03    := '대표자 : ' || r1.tdm01_person_nm || ' (인)';
				else
					RAISE NOTICE '대표자 3인 이상은 화면을 수정해야 합니다. IT에 연락하십시오  ' ;
            		RETURN 'N';
				end if;
				
			end loop;

            rr.sys99_text04    := '1. 일   시 : ' ||  to_char(R_tdm36_role_report.tdm36_board_open_date, 'yyyy.mm.dd');  
            rr.sys99_text05    := '2. 장   소 : ' ||  R_tdm36_role_report.tdm36_board_open_loc ; 
            rr.sys99_text06    := '3. 이사총수 : ' ||  R_tdm36_role_report.tdm36_memb_tot_cnt ;
            rr.sys99_text07    := '4. 출석이사 : ' ||  R_tdm36_role_report.tdm36_memb_attend_cnt  ;
			rr.sys99_text08    := '5. 결의내용 : 책무구조도 및 책무체계도 제출의 건';

            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;

 
			for r1 in
				--select '이사 김이사 (인)' as str  union all
				--select '이사 조감사 (인)' as str
				select  trim( regexp_split_to_table(R_tdm36_role_report.tdm36_memb_yes_nm  , ',')) AS str
   
			loop
				rr.sys99_string01  := 'FSS_BOARD';
				rr.sys99_string02  := 'FSS_BOARD_YES';
	            rr.sys99_text01    := r1.str || ' (인)';
	            rr.sys99_print_id  := f_create_seq();
	
	            INSERT INTO sys99_print  SELECT (rr).*;
			end loop;



		elsif i_rpt_tp = 'MK_FSS_OVERVIEW' then   -- 책무구조도 제출개요 (붙임1)

            rr.sys99_string01  := 'FSS_OVERVIEW';
            rr.sys99_string02  := 'ASIS_TOBE';


			-- 기간내에 변경분이 있을때만 생성된다 
			w_cnt := 0;
			for r1 in
				with lists
				as (
					select tdm30_role_allc_id, tdm30_role_id , tdm30_person_id, tdm30_add_title_yn, tdm30_start_date
						, (select tdm20_role_nm   from tdm20_role where tdm20_role_id   = tdm30_role_id )  role_nm
						, (select tdm01_person_nm from tdm01_hr   where tdm01_person_id = tdm30_person_id ) person_nm
						, (select max(tdm31_role_desc_id) from tdm31_role_desc  
								where tdm31_role_allc_id = tdm30_role_allc_id 
								and   tdm31_reg_date >  w_bf_report_date
								and   tdm31_reg_date <= R_tdm36_role_report.tdm36_board_open_date
							) tdm31_role_desc_id
						, row_number() over ( partition by tdm30_role_id  order by tdm30_start_date  desc  ) as start_seq 
					from   tdm30_role_allc 
					INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
					INNER JOIN apr01_appr             ON apr01_appr_id = tdm34_appr_id AND apr01_status_cd  = '30' 
					where  tdm30_company_id  = p_company_id
					and    tdm30_start_date >= w_bf_report_date
					and    tdm30_start_date <= R_tdm36_role_report.tdm36_board_open_date
				) 
				, list_role_exct
				as (
					select tdm30_role_id role_id, role_nm
							, tdm30_person_id person_id, person_nm, tdm30_start_date start_date, start_seq
							, f_cdnm ('TdmDescRegReason', 'D03', 0,  f_sysdate() )  Tdm_Desc_ReasonNm
							, (select substr(to_decrypts(emp02_ctz_no),1,6) from emp02_others where  emp02_person_id  = tdm30_person_id)  ctz_no
					from   lists
					where  tdm30_role_id in (select tdm30_role_id from lists where start_seq =2 ) 
				),
				list_detail 
				as  (
					select  
						 tdm21_role_id role_id
						, list.Tdm_Desc_ReasonNm
						, list.ctz_no
						, list.start_seq
						, list.start_date
						, list.role_nm
						, list.person_nm
						, tdm21_task_id
						, tdm10_task_nm  task_nm
						, tdm21_role_id
						, tdm12_content  detail_nm
						, row_number() over ( partition by list.role_id, list.start_seq   order by tdm21_role_id, tdm21_task_id,  tdm12_task_relate_detail_id  ) as seq
					from tdm21_role_relate_task
					join tdm10_task                on tdm21_task_id = tdm10_task_id
					join tdm12_task_relate_detail  on tdm21_task_id = tdm12_task_id
					join list_role_exct  list      on tdm21_role_id = list.role_id  
					where list.start_date between tdm10_start_date and coalesce(tdm10_end_date, current_timestamp)
				)
				select  role_id, role_nm, seq
					, max( Tdm_Desc_ReasonNm) Tdm_Desc_ReasonNm
					, max(case when start_seq =1 then ctz_no        end) bf_ctz_no
					, max(case when start_seq =1 then person_nm     end) bf_person_nm
					, max(case when start_seq =1 then task_nm       end) bf_task_nm
					, max(case when start_seq =1 then detail_nm     end) bf_detail_nm
					, max(case when start_seq =2 then ctz_no        end) af_ctz_no
					, max(case when start_seq =2 then person_nm     end) af_person_nm
					, max(case when start_seq =2 then task_nm       end) af_task_nm
					, max(case when start_seq =2 then detail_nm     end) af_detail_nm
				from    list_detail
				group by role_id, role_nm, seq
			loop

				rr.sys99_string10  := r1.role_id ;
				rr.sys99_string11  := r1.bf_person_nm;
				rr.sys99_string12  := coalesce( r1.bf_ctz_no, '미등록');
				rr.sys99_string13  := r1.role_nm;
				rr.sys99_string14  := r1.bf_task_nm;
				rr.sys99_string15  := r1.bf_detail_nm;

				rr.sys99_string16  := r1.af_person_nm;
				rr.sys99_string17  := coalesce( r1.af_ctz_no, '미등록');
				rr.sys99_string18  := r1.role_nm;
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
					,(select 'Y' from lists where group_nm = a.group_nm and tobe_exct_nm   = a.asis_exct_nm  limit 1)    tobe_exct_nm_exist_yn
					,(select 'Y' from lists where group_nm = a.group_nm and tobe_person_no = a.asis_person_no  limit 1)  tobe_person_no_exist_yn
					,(select 'Y' from lists where group_nm = a.group_nm and tobe_position  = a.asis_position  limit 1)   tobe_position_exist_yn
					,(select 'Y' from lists where group_nm = a.group_nm and tobe_task      = a.asis_task  limit 1)       tobe_task_exist_yn
					,(select 'Y' from lists where group_nm = a.group_nm and tobe_detail    = a.asis_detail  limit 1)     tobe_detail_exist_yn
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
