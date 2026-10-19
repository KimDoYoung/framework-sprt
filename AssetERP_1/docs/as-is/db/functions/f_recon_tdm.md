# f_recon_tdm

## FUNCTION public.f_recon_tdm(p_tp character varying, p_date date, p_company_id numeric, p_emp_id numeric)

- 반환: `text`
- 줄 수: 1130

```sql
CREATE OR REPLACE FUNCTION public.f_recon_tdm(p_tp character varying, p_date date, p_company_id numeric, p_emp_id numeric)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE

	-- p_tp    : 'DB_CHK',  CHCK_STATUS : 점검상태  
	-- p_date : 기준일 , 조회하는 날짜 
	-- p_company_id : 관리자 화면에서는 0 으로 조회한다
	-- p_emp_id   : 사번 

	/* 결과 
	select f_recon_tdm ('DB_CHK' , f_today(),  202302215118509, 123);

	select sys99_company_id
		,  case when sys99_company_id=0 then '-' else f_get_company_nm(sys99_company_id) end comp_nm
		, sys99_string01 chk_item, sys99_string02 chk_result_1, sys99_string03 chk_result_2
	from sys99_print 
	where sys99_window_class_nm = p_tp  and sys99_group_id = p_emp_id  
	order by case when sys99_company_id =0 then 1 else 2 end
		, sys99_string01 COLLATE "ko_KR.utf8" 
		, sys99_company_id
		, sys99_string02 COLLATE "ko_KR.utf8" ;



	
	select f_recon_tdm ('CHCK_STATUS' , f_today(),  0, 123);
	
	select f_recon_tdm ('CHCK_STATUS' , f_today(),  202302215118509, 123);
	
	

	select sys99_company_id company_id
		, sys99_string01 company_nm, sys99_string02 role_nm, sys99_string03 exct_nm, sys99_string04 org_nm, sys99_string05 name_1454, sys99_string06 appr_list_1463
		, sys99_long01 manl_cnt, sys99_long02 end_cnt, sys99_long03 lock_cnt, sys99_long04  approve_cnt
		, sys99_long05 unused_cnt, sys99_long06 manl_annually, sys99_long07 manl_semiannually,  sys99_long08 manl_quarterly
		, sys99_long09 manl_monthly, sys99_long10 manl_anytime, sys99_long11  manl_etc
		, sys99_string07 this_month_yn, sys99_string08 next_month_yn
		, sys99_long21 m00_cnt, sys99_long22 m01_cnt, sys99_long23 m02_cnt, sys99_long24 m03_cnt, sys99_long25 m04_cnt, sys99_long26  m05_cnt
		, sys99_long27 m06_cnt, sys99_long28 m07_cnt, sys99_long29 m08_cnt, sys99_long30 m09_cnt, sys99_long31 m10_cnt, sys99_long32 m11_cnt
		, sys99_long33 item_cnt_1455
		, sys99_string11 checker_1456, sys99_string12 appr_list_1456, sys99_string13 appr_ststus
		, sys99_string14 exct_approve_yn, sys99_string15 chck_lock_yn, sys99_string16 chck_close_yn, sys99_string17 chck_appr_status
	from sys99_print 
	where sys99_window_class_nm = 'CHCK_STATUS' and sys99_group_id = 123  
	;
	

	*/


	w_sys99_group_id          sys99_print.sys99_group_id%type;
	w_sys99_window_class_nm   sys99_print.sys99_window_class_nm%type;
	w_cnt      integer default 0;
	w_cnt_2    integer default 0;
	w_cnt_3    integer default 0;	
	r1      record;
	w_today  date;
	w_chck_std_date  date;   -- 이행점검 기준일 
BEGIN

	-- p_company_id := 0;

	w_sys99_window_class_nm := p_tp;
	w_sys99_group_id        := p_emp_id;
	w_today := p_date;

	w_chck_std_date := date_trunc('month', p_date);  -- 이행점검 기준일 




	delete  from sys99_print where sys99_window_class_nm = w_sys99_window_class_nm and  sys99_group_id = w_sys99_group_id;


	if p_tp =   'DB_CHK'  then  

		raise notice 'sys99_group_id % ', w_sys99_group_id;
	


		--------------------------------------------------------------------------------
		w_cnt := 0;
		w_cnt_2 := 0;

		for r1 in  
			with lists
			as (
				select  sys01_company_id, sys01_company_nm,   tdm30_role_id, tdm30_appr_id, tdm30_person_id
				from    sys01_company  
				LEFT JOIN LATERAL getTdm30RoleAllc(sys01_company_id, w_today, false)  tdm30Allc  ON TRUE
				where  sys01_use_yn ='true'
				and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
			)
			SELECT  sys01_company_id, 'tp1' tp, '미동의 임원 (임원동의서 미결재)' check_tp , tdm20_role_nm chk_result_1, f_emp_kor_nm(tdm30_person_id)  chk_result_2
			FROM lists
			LEFT  JOIN apr01_appr ON apr01_appr_id = tdm30_appr_id
			INNER JOIN tdm20_role ON tdm20_role_id = tdm30_role_id
			WHERE COALESCE(apr01_status_cd,'99') != '30'
			union all
			select tdm20_company_id, 'tp2' tp,  '임원 미배정 직책' check_tp , tdm20_role_nm, ''    
			FROM tdm20_role
			WHERE f_today()  BETWEEN tdm20_start_date AND COALESCE(tdm20_end_date, w_today  +1 )
			and  tdm20_role_id not in (select tdm30_role_id from  lists )
			and    tdm20_company_id = case when p_company_id = 0 then tdm20_company_id else p_company_id end
		loop
			if r1.tp = 'tp1' then
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1417 미동의 임원 (임원동의서 미결재)'
					, r1.chk_result_1, r1.chk_result_2
				);
			end if;

			if r1.tp = 'tp2' then
	
				w_cnt_2 := w_cnt_2 +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1417 임원 미배정 직책'  
					, r1.chk_result_1, r1.chk_result_2
				);
			end if;
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1417 미동의 임원 (임원동의서 미결재)', 'OK');
		end if;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1417 임원 미배정 직책', 'OK');
		end if;



		--------------------------------------------------------------------------------
		w_cnt := 0;

		for r1 in  
			SELECT  tdm10_company_id,tdm10_task_id,   'CEO책무 배정'                                                             AS tdm02_change_data
			                      , tdm10_task_nm
			                      , ' ==> 직책 : ' || tdm20_role_nm   role_nm
			FROM tdm10_task
				INNER JOIN tdm14_task_type ON ( tdm14_company_id    = tdm10_company_id   AND
												tdm14_task_type_cd  = tdm10_task_type_cd )
				INNER JOIN tdm21_role_relate_task ON tdm21_task_id = tdm10_task_id
				INNER JOIN tdm20_role             ON tdm21_role_id = tdm20_role_id
			WHERE tdm10_company_id = case when p_company_id = 0 then tdm10_company_id else p_company_id end
			AND  w_today   BETWEEN tdm10_start_date AND COALESCE(tdm10_end_date,w_today+1)
			AND tdm10_ceo_yn = 'true'
			AND tdm20_role_type != 'C'
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm10_company_id, '1414 CEO책무를 일반임원에 배정'
					, r1.tdm10_task_nm, r1.role_nm
				);
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1414 CEO책무를 일반임원에 배정', 'OK');
		end if;
 




		--------------------------------------------------------------------------------
		w_cnt := 0;
		w_cnt_2 := 0;
		w_cnt_3 := 0;
		for r1 in
			with lists
			as (
				select  sys01_company_id, sys01_company_nm,   emp00_person_id,  emp00_emp_no, emp00_kor_nm, emp00_tdm_target_yn, emp00_retire_date, emp00_org_code_nm
					, (select 'Y' from  tdm01_hr
						WHERE tdm01_company_id = emp00_company_id
						AND tdm01_person_id  = emp00_person_id
						AND COALESCE(tdm01_end_date, to_date('2999-12-31','yyyy-mm-dd')) > w_today  
						) tdm01_exist_yn
				from    sys01_company  
				LEFT JOIN LATERAL getperson(sys01_company_id, w_today) person  ON TRUE
				where    sys01_use_yn ='true'
				and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
				and      sys01_company_id	 not in (
							0   -- Admin
							, 1  --  "한국펀드서비스(주)"
							, 10,20,30,40  -- "S1,S2,S3,A1 사용 고객사"
							, 83211  -- DEMO 
						)	
			)
			select  case when COALESCE(emp00_tdm_target_yn, 'false') = 'true' and     COALESCE(tdm01_exist_yn ,'N')= 'N' and     COALESCE(emp00_retire_date , w_today+1) > w_today   then '인사정보:대상, 책무인사:비대상' end  exct_chk_1
				,	case when COALESCE(emp00_tdm_target_yn, 'false') = 'false' and    COALESCE(tdm01_exist_yn ,'N')= 'Y' then '인사정보:비대상, 책무인사:대상' end  exct_chk_2
				,	case when COALESCE(emp00_tdm_target_yn, 'false') = 'true' and     COALESCE(emp00_retire_date , w_today+1) < w_today then '인사정보:퇴사, 책무인사:대상' end  exct_chk_3
				, sys01_company_id, emp00_kor_nm
				, emp00_org_code_nm
			from lists
		loop
			if r1.exct_chk_1 is not null then
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1411 인사정보:대상, 책무인사:비대상'
					, r1.emp00_kor_nm, r1.emp00_org_code_nm
				);
			end if;

			if r1.exct_chk_2 is not null then
	
				w_cnt_2 := w_cnt_2 +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1411 인사정보:비대상, 책무인사:대상'  
					, r1.emp00_kor_nm, r1.emp00_org_code_nm
				);
			end if;

			if r1.exct_chk_3 is not null then
	
				w_cnt_3 := w_cnt_3 +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1411 인사정보:퇴사, 책무인사:대상'  
					, r1.emp00_kor_nm, r1.emp00_org_code_nm
				);
			end if;

		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1411 인사정보:대상, 책무인사:비대상', 'OK');
		end if;
		if w_cnt_2 = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1411 인사정보:비대상, 책무인사:대상','OK');
		end if;
		if w_cnt_3 = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1411 인사정보:퇴사, 책무인사:대상','OK');
		end if;





		--------------------------------------------------------------------------------
		w_cnt := 0;
		w_cnt_2 := 0;
		w_cnt_3 := 0;
		for r1 in  
			with list_tdm43
			as (
				select tdm43_company_id, tdm43_task_id
					,  tdm43_role_id, tdm43_exct_id, tdm43_org_id
					, case when tdm44_end_yn ='true' then  'Y' else 'N' end  end_yn
					, case when tdm42_lock_yn ='true' then  'Y' else 'N' end  lock_yn
					, case when tdm42_lock_yn ='true' and tdm42_appr_id is not null then 'Y' else 'N' end approve_yn
				from   tdm43_manl
				join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
				JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
				where  coalesce( tdm42_end_date, w_today +1 )  > w_today
				and    coalesce( tdm42_start_date, w_today  -1 )  <= w_today
				and    tdm43_company_id = case when p_company_id = 0 then tdm43_company_id else p_company_id end
			),
			list_tdm43_sum
			as (
				select tdm43_company_id company_id, end_yn, approve_yn
				from   list_tdm43
				group by tdm43_company_id, end_yn, approve_yn
			) 
			----------------------------------------------------------------
			select tdm43_company_id, 'tp2' tp, '1422 부서매뉴얼 미완료' 
				, f_org_nm(tdm43_org_id, f_today()) 	chk_nm
				, (select tdm20_role_nm from tdm20_role where tdm20_role_id  = tdm43_role_id )  
				|| '(' ||  (select tdm01_person_nm    from tdm01_hr  where tdm01_person_id  = tdm43_exct_id )   || ')'  ref_nm
				from   list_tdm43  
			where  end_yn ='N'
			and    tdm43_company_id in (select company_id from list_tdm43_sum  where  end_yn ='Y'  )
			group by tdm43_company_id, tdm43_role_id, tdm43_exct_id, tdm43_org_id
			union all
			select tdm43_company_id, 'tp2' tp, '1422 부서매뉴얼 미완료' , '부서전체' chk_nm	, ''  ref_nm
			from   list_tdm43  
			where  end_yn ='N'
			and    tdm43_company_id not in (select company_id from list_tdm43_sum  where  end_yn ='Y'  )
			group by tdm43_company_id
			union all
			----------------------------------------------------------------
			select tdm43_company_id, 'tp3' tp, '1423 부서매뉴얼 미결재' 
				, f_org_nm(tdm43_org_id, f_today()) 	
				, (select tdm20_role_nm from tdm20_role where tdm20_role_id  = tdm43_role_id )  
				|| '(' ||  (select tdm01_person_nm    from tdm01_hr  where tdm01_person_id  = tdm43_exct_id )   || ')'
				from   list_tdm43  
			where  approve_yn ='N' and end_yn ='Y'
			and    tdm43_company_id in (select company_id from list_tdm43_sum  where  approve_yn ='Y' )
			group by tdm43_company_id, tdm43_role_id, tdm43_exct_id, tdm43_org_id
			union all
			select tdm43_company_id, 'tp3' tp, '1423 부서매뉴얼 미결재' , '부서전체' chk_nm	, ''  ref_nm
			from   list_tdm43  
			where  approve_yn ='N' and end_yn ='Y'
			and    tdm43_company_id not in (select company_id from list_tdm43_sum  where  approve_yn ='Y'  )
			group by tdm43_company_id 
			union all
			----------------------------------------------------------------
			select tdm10_company_id, 'tp1' tp,  '1414 책무 미배정' , tdm10_task_nm chk_nm, ' ' 
			from  tdm10_task  
			where  tdm10_task_id not in (select tdm43_task_id from  list_tdm43 )
			and    tdm10_company_id = case when p_company_id = 0 then tdm10_company_id else p_company_id end
		loop

			if r1.tp = 'tp1' then
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm43_company_id, '1414 책무 미배정', r1.chk_nm,  r1.ref_nm	);
			end if;

			if r1.tp = 'tp2' then
				w_cnt_2 := w_cnt_2 +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm43_company_id, '1422 부서매뉴얼 미완료', r1.chk_nm, r1.ref_nm	);
			end if;

			if r1.tp = 'tp3' then
				w_cnt_3 := w_cnt_3 +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm43_company_id, '1423 부서매뉴얼 미결재', r1.chk_nm, r1.ref_nm	);
			end if;


		end loop;	

		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1414 책무 미배정', 'OK');
		end if;
		if w_cnt_2 = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1422 부서매뉴얼 작성완료','OK');
		end if;
		if w_cnt_3 = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1423 부서매뉴얼 결재','OK');
		end if;



		--------------------------------------------------------------------------------
		w_cnt := 0;
		for r1 in
			select sys01_company_id, max(sys01_company_nm), tdm21_task_id, tdm10_task_nm,  count(*) 
			from  tdm21_role_relate_task
			join tdm10_task  on  tdm10_task_id = tdm21_task_id 
			join tdm20_role  on  tdm20_role_id = tdm21_role_id 
			join sys01_company  on  sys01_company_id = tdm10_company_id
			where  tdm10_common_yn  = 'false'
			and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
			and   coalesce( tdm20_end_date, w_today  +1 )   > w_today
			and    coalesce( tdm20_start_date, w_today   -1 )  <= w_today
			group by sys01_company_id, tdm21_task_id, tdm10_task_nm
			having count(*) >1
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1414 책무 중복배정' , r1.tdm10_task_nm, ' ');
		end loop;	
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1414 책무 중복배정', 'OK');
		end if;
	
	
		--------------------------------------------------------------------------------
		-- 임원의 원직 등록 
		w_cnt := 0;
		for r1 in
			with lists
			as (
				select tdm30_company_id, tdm30_person_id
					, (select sys01_company_nm from  sys01_company where sys01_company_id= tdm30_company_id) 
					, (select tdm01_person_nm  from  tdm01_hr  where  tdm01_person_id = tdm30_person_id ) person_nm
					, max( case when tdm30_add_title_yn ='false' then 'Y' else 'N'  end)  Main_role
					, max( case when tdm30_add_title_yn ='true' then 'Y' end)  "겸직"
				from tdm30_role_allc 
				where    tdm30_company_id = case when p_company_id = 0 then tdm30_company_id else p_company_id end
				group by  tdm30_company_id, tdm30_person_id
			)
			select tdm30_company_id, person_nm from lists
			where  Main_role <> 'Y'
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm30_company_id, '1417 임원의 원직 등록', r1.person_nm, ' ');
		end loop;	
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1417 임원의 원직 등록', 'OK'	);
		end if;
	
	
		--------------------------------------------------------------------------------
		--- 
		w_cnt := 0;
		for r1 in
			select sys01_company_id, sys01_company_nm, tdm20_role_nm 
			from   tdm20_role
			join   sys01_company on sys01_company_id = tdm20_company_id
			and    tdm20_role_id not in (select  tdm42_role_id from  tdm42_manl_org) 
			and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1414 직책의 담당부서 미지정', r1.tdm20_role_nm, ' ');
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1414 직책의 담당부서 미지정', 'OK'	);
		end if;
	
	
		--------------------------------------------------------------------------------
		---직책_책무의 매뉴얼이 없다
		w_cnt := 0;
		for r1 in
			with lists
			as (
				select tdm43_company_id, tdm43_role_id, tdm43_task_id 
				from   tdm43_manl
				join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
				JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
				where  coalesce( tdm42_end_date, w_today +1 )  > w_today
				and    coalesce( tdm42_start_date, w_today  -1 )  <= w_today
				and    tdm43_company_id = case when p_company_id = 0 then tdm43_company_id else p_company_id end
				group by tdm43_company_id, tdm43_role_id, tdm43_task_id 
			)
			select  sys01_company_id, sys01_company_nm, tdm21_role_id, tdm20_role_nm, tdm21_task_id, tdm10_task_nm  
			from   tdm21_role_relate_task
			join   tdm10_task on tdm10_task_id = tdm21_task_id
			join   tdm20_role on tdm20_role_id = tdm21_role_id
			join   sys01_company  on sys01_company_id = tdm20_company_id
			where   (tdm21_role_id, tdm21_task_id ) not in (select  tdm43_role_id,tdm43_task_id from lists)
			and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.sys01_company_id, '1424 직책_책무의 매뉴얼 없음', r1.tdm20_role_nm || ' - ' ||r1.tdm10_task_nm, ' ');
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1424 직책_책무의 매뉴얼 존재', 'OK'	);
		end if;
	
	
	
	
	
		--------------------------------------------------------------------------------
		---부서승인선
		w_cnt := 0;
		w_cnt_2 := 0;
		for r1 in
			with list_tdm43
			as (
				select tdm43_company_id, tdm43_role_id, tdm43_exct_id, tdm43_org_id	
				from   tdm43_manl
				join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
				JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
				where  coalesce( tdm42_end_date, w_today +1 )  > w_today
				and    coalesce( tdm42_start_date, w_today  -1 )  <= w_today
				and    tdm43_company_id = case when p_company_id = 0 then tdm43_company_id else p_company_id end
				group by tdm43_company_id, tdm43_role_id, tdm43_exct_id, tdm43_org_id	
			)
			,list_tdm09
			as (
				select  tdm09_company_id, tdm09_role_id, tdm09_org_id, tdm09_appr_emp_id
						, row_number() over (partition by tdm09_company_id, tdm09_role_id, tdm09_org_id  order by tdm09_appr_seq desc)  appr_rev_seq
				from   tdm09_appr_step
				where  tdm09_type_cd ='T'
			)
			select tdm43_company_id, tdm43_role_id, tdm43_exct_id, tdm43_org_id	
				, (select tdm09_appr_emp_id from  list_tdm09 
					where tdm09_role_id = tdm43_role_id and tdm09_org_id =  tdm43_org_id and appr_rev_seq =1 )  last_emp_id
			from   list_tdm43
		loop
	
			if r1.last_emp_id is null then
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm43_company_id, '1463 승인선 등록'
					, (select tdm20_role_nm  from tdm20_role  where   tdm20_role_id = r1.tdm43_role_id ) 
					|| ' ' || f_org_nm(r1.tdm43_org_id, w_today) 
					, '누락'
				);
			
			elsif r1.tdm43_exct_id <> r1.last_emp_id then
	
				w_cnt_2 := w_cnt_2 +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm43_company_id, '1463 최종승인자 변경(등록)'  
					, (select tdm20_role_nm  from tdm20_role  where   tdm20_role_id = r1.tdm43_role_id ) 
					|| ' ' || f_org_nm(r1.tdm43_org_id, w_today ) 
					,(select emp01_kor_nm  from emp01_person  where   emp01_person_id = r1.tdm43_exct_id ) 
				);
			end if;
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1463 승인선 등록', 'OK');
		end if;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1463 최종승인자 변경(등록)', 'OK');
		end if;
	
		--------------------------------------------------------------------------------
		---결재부서의 중복
		w_cnt := 0;
		for r1 in
			select tdm09_company_id 
				, tdm09_role_id, (select tdm20_role_nm from tdm20_role where tdm20_role_id = tdm09_role_id ) role_nm
				, tdm09_org_id ,  f_org_nm( tdm09_org_id,  w_today ) org_nm
				, tdm09_parent_id
				, appr_org_nm, count(*)
				, string_agg(  emp01_kor_nm ,  ',' order by tdm09_appr_seq)   emp_nms 
			from
			(
				select  tdm09_company_id, tdm09_role_id, tdm09_parent_id, tdm09_org_id, tdm09_appr_seq
						,  emp01_kor_nm 
						,  f_get_empTrans(tdm09_appr_emp_id, w_today, 'org_code_nm')  appr_org_nm  
						-- ,  f_get_emptrans(tdm09_appr_emp_id, f_sysdate(), 'pos_nm')  appr_pos_nm 
						 , ' ' appr_pos_nm
				from   tdm09_appr_step
				left outer join emp01_person x on emp01_person_id = tdm09_appr_emp_id
				where  tdm09_type_cd ='T'
				and    tdm09_company_id = case when p_company_id = 0 then tdm09_company_id else p_company_id end
				--and tdm09_company_id = 202406256305650
				--and  tdm09_org_id =202603120822587
			) t
			group by tdm09_company_id, tdm09_role_id, tdm09_org_id, tdm09_parent_id, appr_org_nm
			having count(*)>1
			order by 1,2
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm09_company_id, '1463 결재선내 부서의 중복'
					, r1.role_nm || ' - ' ||r1.org_nm, r1.emp_nms);
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1463 결재선내 부서의 중복 없음', 'OK'	);
		end if;
	

	
		--------------------------------------------------------------------------------
		---결재부서의 중복
		w_cnt := 0;
		for r1 in
	
			select   tdm51_company_id, f_get_company_nm(tdm51_company_id)
				,tdm51_role_id, (select tdm20_role_nm from tdm20_role where tdm20_role_id = tdm51_role_id ) role_nm
				,  tdm51_org_id,  tdm51_exct_id
				, string_agg(  emp01_kor_nm,  ',' order by tdm58_appr_seq)     emp_nms
				, string_agg(  org_nm,  ',' order by tdm58_appr_seq)     depts
			from (
				select tdm51_company_id, tdm51_role_id, tdm51_org_id,  tdm51_exct_id, emp01_kor_nm  , tdm58_appr_seq
					, f_get_empTrans(tdm58_appr_emp_id, w_today, 'org_code_nm')  org_nm
				from tdm58_chck_appr_step  
				join tdm51_chck_org on tdm51_chck_org_id  = tdm58_chck_org_id  
				left outer join emp01_person  on emp01_person_id = tdm58_appr_emp_id
				where  1=1   
				and   tdm51_check_ym = to_char(w_today, 'yyyy.mm') 
				and    tdm51_company_id = case when p_company_id = 0 then tdm51_company_id else p_company_id end
			) t	
			group by tdm51_company_id, tdm51_role_id, tdm51_org_id,  tdm51_exct_id, org_nm
			having count(*)>1
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm51_company_id, '1456 승인선내 부서의 중복'
					, r1.role_nm || ' - ' ||r1.depts, r1.emp_nms);
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1456 승인선내 부서의 중복 없음', 'OK'	);
		end if;
	
	
		--------------------------------------------------------------------------------
		---결재부서의 중복
		w_cnt := 0;
		for r1 in
	
			with lists
			as (
				select   tdm08_company_id, tdm08_org_id   org_id  , tdm08_person_id
						,  f_get_tdmOrg_id(tdm08_person_id, w_today  )  tdmOrg_id
				from     tdm08_manager_info  
				-- left outer join   emp01_person  on  emp01_person_id = tdm08_person_id
				where  tdm08_manager_type='21' 
				and  tdm08_org_id in (select  tdm23_org_id from tdm23_role_relate_org) 
				and    coalesce(tdm08_start_date, w_today ) < w_today-1
				and     coalesce(tdm08_end_date, w_today +1) > w_today 
				and    tdm08_company_id = case when p_company_id = 0 then tdm08_company_id else p_company_id end
			)
			select tdm08_company_id, f_get_company_nm(tdm08_company_id) 
				,  org_id, f_org_nm( org_id,  w_today ) org_nm
				,  tdm08_person_id, (select emp01_kor_nm from  emp01_person where emp01_person_id = tdm08_person_id  ) person_nm
				,  f_org_nm( tdmOrg_id,  w_today ) tdmOrg_nm
			from  lists  where  org_id <> tdmOrg_id
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm08_company_id, '1454 부서담당자의 부서는 점검부서와 동일하여야 함'
					, r1.org_nm,  r1.person_nm || ' (' ||r1.tdmOrg_nm || ')');
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0, '1454 부서담당자의 부서는 점검부서와 동일', 'OK'	);
		end if;


		--------------------------------------------------------------------------------
		--- 이행점검 생성 
		w_cnt := 0;
		for r1 in

			with list_sys01
			as (
				select sys01_company_id, sys01_company_nm 
					, coalesce(sys01_tdm_start_date, '2026-07-01'::date)  sys01_tdm_start_date
					, date_trunc('month', w_today  )::date  std_date	
					, (date_trunc('month', coalesce(sys01_tdm_start_date, '2026-07-01'::date) ) + interval '1month')::date                         AS m_std_date
					, f_get_last_day((f_get_quarter_date(coalesce(sys01_tdm_start_date, to_date('2026-07-01','yyyy-mm-dd') ) , '1') + interval '3month')::date) + 1 AS q_std_date
					, f_get_last_day((f_get_quarter_date(coalesce(sys01_tdm_start_date, to_date('2026-07-01','yyyy-mm-dd') ) , '2') + interval '6month')::date) + 1 AS h_std_date
					, (date_trunc('year' , coalesce(sys01_tdm_start_date, to_date('2026-07-01','yyyy-mm-dd') ) ) + interval '12month')::date                        AS y_std_date
					,to_number(to_char(date_trunc('month', w_today )       , 'mm'),'99')::integer  m_month
				from   sys01_company
				where  sys01_use_yn ='true'
				and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
			)
			, list_tdm43
			as (
				select tdm43_manl_id, tdm43_company_id, tdm43_task_id	,  tdm43_role_id, tdm43_exct_id, tdm43_org_id
						, case tdm43_check_cycle_cd
							WHEN '04' THEN   greatest( coalesce( tdm43_start_date, sys01_tdm_start_date) ,  q_std_date ) 
							WHEN '05' THEN   greatest( coalesce( tdm43_start_date, sys01_tdm_start_date ) , h_std_date )
							WHEN '06' THEN   greatest( coalesce( tdm43_start_date, sys01_tdm_start_date ) , y_std_date )
							ELSE greatest( coalesce( tdm43_start_date, sys01_tdm_start_date) ,m_std_date)   end tdm43_start_date
						,tdm43_check_month
						, m_month
				from   tdm43_manl
				join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
				JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
				JOIN   list_sys01  ON sys01_company_id = tdm43_company_id 
				where  coalesce( tdm42_end_date,   list_sys01.std_date +1 )  > list_sys01.std_date
				and    coalesce( tdm42_start_date, list_sys01.std_date -1 )  <= list_sys01.std_date
			)
			,list_tdm52
			as (
				select tdm52_company_id, tdm52_manl_id
				from   tdm52_chck_manl  join tdm51_chck_org on tdm51_chck_org_id  = tdm52_chck_org_id  
				where  tdm51_check_ym = to_char(w_today,'yyyy.mm') 
			)
			select tdm43_company_id,  '1455 점검항목생성' 	, '전체부서' org_nm	, ''   role_nm   
			from list_tdm43
			where tdm43_start_date < w_today
			and   substr(tdm43_check_month,m_month ,1) ='1'
			and   tdm43_manl_id  not in ( select tdm52_manl_id from  list_tdm52)
			and   tdm43_company_id not in (select tdm52_company_id from list_tdm52 )
			group by  tdm43_company_id
			union all
			select tdm43_company_id,  '1455 점검항목생성' 
				, f_org_nm(tdm43_org_id, f_today())   org_nm	
				, (select tdm20_role_nm from tdm20_role where tdm20_role_id  = tdm43_role_id )  
				|| '(' ||  (select tdm01_person_nm    from tdm01_hr  where tdm01_person_id  = tdm43_exct_id )   || ')'  role_nm   
			from list_tdm43
			where tdm43_start_date < w_today
			and   substr(tdm43_check_month,m_month ,1) ='1'
			and   tdm43_manl_id  not in ( select tdm52_manl_id from  list_tdm52)
			and   tdm43_company_id  in (select tdm52_company_id from list_tdm52 )
			group by  tdm43_company_id, tdm43_org_id, tdm43_role_id, tdm43_exct_id
		loop
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm43_company_id
					, '1455 ' ||  ltrim(to_char(w_today,'mm'),'0')  || '월 이행점검항목 미생성'
					, r1.org_nm, r1.role_nm);
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0
					, '1455 ' || ltrim(to_char(w_today,'mm'),'0') || '월 이행점검항목 생성', 'OK'	);
		end if;
	


		--------------------------------------------------------------------------------
		--- 이행점검 최종승인
		w_cnt := 0;
		for r1 in
			with lists
			as (
				select tdm50_company_id  , max(tdm56_chck_relate_appr_id) list_chck_relate_appr_id
				from   tdm50_chck_job  
				left outer join   tdm56_chck_relate_appr  on  tdm56_relate_table_id  = tdm50_chck_job_id
				where  tdm50_check_ym = to_char(w_today,'yyyy.mm') 
				and    tdm50_company_id = case when p_company_id = 0 then tdm50_company_id else p_company_id end
				and    tdm50_company_id  in (select  tdm52_company_id 
					from   tdm52_chck_manl  join tdm51_chck_org on tdm51_chck_org_id  = tdm52_chck_org_id  
					where  tdm51_check_ym = to_char(w_today,'yyyy.mm') 
					)
				group by tdm50_company_id
			)
			select tdm50_company_id, f_cdnm('AprStatusCode', apr01_status_cd, tdm50_company_id, apr01_reg_date) AS tdm50_appr_status_nm 
			from   lists
			left outer join   tdm56_chck_relate_appr  on  tdm56_chck_relate_appr_id  = list_chck_relate_appr_id
			left outer join   apr01_appr  on  apr01_appr_id  = tdm56_appr_id
		loop

			if coalesce(r1.tdm50_appr_status_nm,'N') <> '완료' then
				w_cnt := w_cnt +1;
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02, sys99_string03)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), r1.tdm50_company_id
					, '1455 ' ||  ltrim(to_char(w_today,'mm'),'0')  || '월 마감 최종결재 미수행'
					, '','잠금->마감->결재');
			end if;
		end loop;
		if w_cnt = 0 then
				insert into sys99_print 
				(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id, sys99_string01, sys99_string02)
				values
				( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq(), 0
					, '1455 ' ||  ltrim(to_char(w_today,'mm'),'0') || '월 마감 최종결재 ', 'OK'	);
		end if;



	
	--====================================================================================================================
	elsif p_tp = 'CHCK_STATUS' then

		--call p_log('kdj', 'w_today ' ||  w_today );

		for r1 in  
			with list_sys01
			as (
				select sys01_company_id, ltrim( replace( replace( replace(  sys01_company_nm ,'(주)', ''),  '㈜','' ), '주식회사',''))  company_nm   
					, (date_trunc('month', coalesce(sys01_tdm_start_date, '2026-07-01'::date) ) + interval '1month')::date                         AS m_std_date
					, f_get_last_day((f_get_quarter_date(coalesce(sys01_tdm_start_date, '2026-07-01'::date) , '1') + interval '3month')::date) + 1 AS q_std_date
					, f_get_last_day((f_get_quarter_date(coalesce(sys01_tdm_start_date, '2026-07-01'::date) , '2') + interval '6month')::date) + 1 AS h_std_date
					, (date_trunc('year' , coalesce(sys01_tdm_start_date, '2026-07-01'::date) ) + interval '12month')::date                        AS y_std_date
					,date_trunc('month', w_today )::date  std_date	
					,date_trunc('month', w_today )  m00_dt
					,date_trunc('month', w_today ) + INTERVAL '1 month'  m01_dt
					,date_trunc('month', w_today ) + INTERVAL '2 month'  m02_dt
					,date_trunc('month', w_today ) + INTERVAL '3 month'  m03_dt
					,date_trunc('month', w_today ) + INTERVAL '4 month'  m04_dt
					,date_trunc('month', w_today ) + INTERVAL '5 month'  m05_dt
					,date_trunc('month', w_today ) + INTERVAL '6 month'  m06_dt
					,date_trunc('month', w_today ) + INTERVAL '7 month'  m07_dt
					,date_trunc('month', w_today ) + INTERVAL '8 month'  m08_dt
					,date_trunc('month', w_today ) + INTERVAL '9 month'  m09_dt
					,date_trunc('month', w_today ) + INTERVAL '10 month'  m10_dt
					,date_trunc('month', w_today ) + INTERVAL '12 month'  m11_dt
					,to_number(to_char(date_trunc('month', w_today )                      , 'mm'),'99')::integer  m00_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '1 month' , 'mm'),'99')::integer  m01_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '2 month' , 'mm'),'99')::integer  m02_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '3 month' , 'mm'),'99')::integer  m03_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '4 month' , 'mm'),'99')::integer  m04_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '5 month' , 'mm'),'99')::integer  m05_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '6 month' , 'mm'),'99')::integer  m06_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '7 month' , 'mm'),'99')::integer  m07_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '8 month' , 'mm'),'99')::integer  m08_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '9 month' , 'mm'),'99')::integer  m09_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '10 month', 'mm'),'99')::integer  m10_mon
					,to_number(to_char(date_trunc('month', w_today ) + INTERVAL '11 month', 'mm'),'99')::integer  m11_mon
				from   sys01_company
				where  sys01_use_yn ='true'
				and    sys01_company_id	 not in (
						0   -- Admin
						, 1  --  "한국펀드서비스(주)"
						, 10,20,30,40  -- "S1,S2,S3,A1 사용 고객사"
						, 83211  -- DEMO 
						, 202605194864932 -- 케이지티자산운용
						, 202507020960706 -- 로호드파트너스
						, 202403273621336 -- 미래에셋자산운용
					)
				-- and    sys01_company_id = 202604223596370
				and    sys01_company_id = case when p_company_id = 0 then sys01_company_id else p_company_id end
			)
			, list_tdm43
			as (
				select company_nm,  tdm43_company_id, tdm43_role_id, tdm43_org_id, tdm43_exct_id
					, case when  coalesce( tdm43_start_date, list_sys01.std_date -1 ) > list_sys01.std_date then 'Y' else 'N' end unused_yn
					-- 분기별	04, 반기별 05,  연별 06			
					, tdm43_check_cycle_cd 
					, tdm43_check_month
					, case tdm43_check_cycle_cd
							WHEN '04' THEN   greatest( coalesce( tdm43_start_date, to_date('2026-07-01','yyyy-mm-dd') ),  q_std_date ) 
							WHEN '05' THEN   greatest( coalesce( tdm43_start_date, to_date('2026-07-01','yyyy-mm-dd') ) , h_std_date )
							WHEN '06' THEN   greatest( coalesce( tdm43_start_date, to_date('2026-07-01','yyyy-mm-dd') ) , y_std_date )
							ELSE greatest( coalesce( tdm43_start_date, to_date('2026-07-01','yyyy-mm-dd')) ,m_std_date)   end tdm43_start_date
					, case when tdm44_end_yn  ='true' then  'Y' else 'N' end  end_yn
					, case when tdm42_lock_yn ='true' then  'Y' else 'N' end  lock_yn
					, case when tdm42_lock_yn ='true' and tdm42_appr_id is not null then 'Y' else 'N' end approve_yn
					, m00_dt, m01_dt, m02_dt, m03_dt, m04_dt, m05_dt, m06_dt, m07_dt, m08_dt, m09_dt, m10_dt, m11_dt
					, std_date
					, m00_mon, m01_mon, m02_mon, m03_mon, m04_mon, m05_mon, m06_mon, m07_mon, m08_mon, m09_mon, m10_mon, m11_mon
				from   tdm43_manl
				join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
				JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
				JOIN   list_sys01    ON sys01_company_id   = tdm43_company_id
				where  coalesce( tdm42_end_date,   list_sys01.std_date +1 )  >  list_sys01.std_date
				and    coalesce( tdm42_start_date, list_sys01.std_date -1 )  <= list_sys01.std_date
			)
			, lists
			as (
				select list_tdm43.*
					,case when substr(tdm43_check_month,m00_mon,1) ='1'  and tdm43_start_date <= m00_dt      then 'Y' else 'N' end  m00_yn 
					,case when substr(tdm43_check_month,m01_mon,1) ='1'  and tdm43_start_date <= m01_dt      then 'Y' else 'N' end  m01_yn 
					,case when substr(tdm43_check_month,m02_mon,1) ='1'  and tdm43_start_date <= m02_dt      then 'Y' else 'N' end  m02_yn
					,case when substr(tdm43_check_month,m03_mon,1) ='1'  and tdm43_start_date <= m03_dt      then 'Y' else 'N' end  m03_yn 
					,case when substr(tdm43_check_month,m04_mon,1) ='1'  and tdm43_start_date <= m04_dt      then 'Y' else 'N' end  m04_yn 
					,case when substr(tdm43_check_month,m05_mon,1) ='1'  and tdm43_start_date <= m05_dt      then 'Y' else 'N' end  m05_yn
					,case when substr(tdm43_check_month,m06_mon,1) ='1'  and tdm43_start_date <= m06_dt      then 'Y' else 'N' end  m06_yn
					,case when substr(tdm43_check_month,m07_mon,1) ='1'  and tdm43_start_date <= m07_dt      then 'Y' else 'N' end  m07_yn
					,case when substr(tdm43_check_month,m08_mon,1) ='1'  and tdm43_start_date <= m08_dt      then 'Y' else 'N' end  m08_yn	
					,case when substr(tdm43_check_month,m09_mon,1) ='1'  and tdm43_start_date <= m09_dt      then 'Y' else 'N' end  m09_yn	
					,case when substr(tdm43_check_month,m10_mon,1) ='1'  and tdm43_start_date <= m10_dt      then 'Y' else 'N' end  m10_yn
					,case when substr(tdm43_check_month,m11_mon,1) ='1'  and tdm43_start_date <= m11_dt      then 'Y' else 'N' end  m11_yn	
				from   list_tdm43
			)
			, list_appr_step
			as (
				select  tdm09_company_id, tdm09_role_id, tdm09_org_id
							, string_agg(emp01_kor_nm::text, ',' order by tdm09_appr_seq)  appr_nms
				from   tdm09_appr_step
				left outer join emp01_person x on emp01_person_id = tdm09_appr_emp_id
				where  tdm09_type_cd ='T'
				group by tdm09_company_id, tdm09_role_id, tdm09_org_id
			) 
			, list_chck
			as (
				select tdm51_chck_org.* , tdm52_checker_id
				from   tdm52_chck_manl  join tdm51_chck_org on tdm51_chck_org_id  = tdm52_chck_org_id  
				where  tdm51_check_ym = to_char(w_chck_std_date, 'yyyy.mm') 
			)
			, list_chck_appr_seq
			as (
				select  tdm51_company_id
					, tdm51_role_id, tdm51_exct_id, tdm51_org_id
					-- 승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)
					, to_number(tdm60_appr_seq,'99') tdm60_appr_seq, tdm60_appr_org_id, tdm60_appr_emp_id, tdm60_appr_status_cd
					, (select emp01_kor_nm  from emp01_person  where   emp01_person_id = tdm60_appr_emp_id ) emp01_kor_nm 
					, f_cdnm ('AprStepStatusCode', tdm60_appr_status_cd, 0,  f_sysdate() ) appr_status_nm
				from tdm60_chck_manl_appr
				join tdm52_chck_manl  on tdm52_chck_manl_id = tdm60_chck_manl_id
				join tdm51_chck_org   on tdm51_chck_org_id = tdm52_chck_org_id
				where  tdm51_check_ym = to_char(w_chck_std_date, 'yyyy.mm') 
				group by tdm51_company_id, tdm51_role_id, tdm51_exct_id, tdm51_org_id
				, tdm60_appr_org_id, tdm60_appr_seq, tdm60_appr_emp_id, tdm60_appr_status_cd
			),
			list_chck_appr
			as (
				select tdm51_company_id, tdm51_role_id, tdm51_exct_id, tdm51_org_id  
					, case when max(appr_status_nm) is null then '점검중' 
						else string_agg (emp01_kor_nm || '(' || appr_status_nm || ')', ','  order by  tdm60_appr_seq)
						end   appr_status
				from   list_chck_appr_seq
				group by tdm51_company_id, tdm51_role_id, tdm51_exct_id, tdm51_org_id
			)
			select  
				 tdm43_role_id, tdm43_exct_id, tdm43_org_id
				, tdm43_company_id
				,  company_nm
				, (select tdm20_role_nm from tdm20_role where tdm20_role_id  = tdm43_role_id )  role_nm
				, (select tdm01_person_nm    from tdm01_hr  where tdm01_person_id  = tdm43_exct_id )  exct_nm
				, f_org_nm(tdm43_org_id, w_today)  org_nm
				, (select  emp01_kor_nm  
					from   tdm08_manager_info  
					left outer join   emp01_person  on  emp01_person_id = tdm08_person_id
					where  tdm08_company_id = tdm43_company_id and tdm08_manager_type='21' 
					and    tdm08_org_id = tdm43_org_id 
					and    coalesce(tdm08_start_date, w_today  ) < w_today-1
					and     coalesce(tdm08_end_date, w_today +1) > w_today
					) name_1454
				, (select appr_nms from  list_appr_step 
					where  tdm09_company_id = tdm43_company_id  and tdm09_role_id = tdm43_role_id and  tdm09_org_id = tdm43_org_id
					) appr_list_1463 
				, count(*) manl_cnt
				, count( case when end_yn    = 'Y' then 1 end)  end_cnt
				, count( case when lock_yn   = 'Y' then 1 end)  lock_cnt
				, count( case when approve_yn= 'Y' then 1 end) approve_cnt
				, count( case when unused_yn ='Y' then 1 end) unused_cnt
				, count( case when unused_yn ='N' and tdm43_check_cycle_cd = '06' then 1 end) manl_annually 
				, count( case when unused_yn ='N' and tdm43_check_cycle_cd = '05' then 1 end) manl_semiannually 
				, count( case when unused_yn ='N' and tdm43_check_cycle_cd = '04' then 1 end) manl_quarterly  
				, count( case when unused_yn ='N' and tdm43_check_cycle_cd = '03' then 1 end) manl_monthly 
				, count( case when unused_yn ='N' and tdm43_check_cycle_cd = '99' then 1 end) manl_anytime
				, count( case when unused_yn ='N' and tdm43_check_cycle_cd = '98' then 1 end) manl_etc 
				, case when  ( select  count(*) from lists  where tdm43_company_id =  t.tdm43_company_id and  m00_yn = 'Y'  )  >0 then 'Y' end this_month_yn -- "금월 대상"
				, case when  ( select  count(*) from lists  where tdm43_company_id =  t.tdm43_company_id and  m01_yn = 'Y'  )  >0 then 'Y' end next_month_yn  -- "익월 대상"
				, count( case when  m00_yn = 'Y'  then 1 end) m00_cnt
				, count( case when  m01_yn = 'Y'  then 1 end) m01_cnt
				, count( case when  m02_yn = 'Y'  then 1 end) m02_cnt
				, count( case when  m03_yn = 'Y'  then 1 end) m03_cnt
				, count( case when  m04_yn = 'Y'  then 1 end) m04_cnt
				, count( case when  m05_yn = 'Y'  then 1 end) m05_cnt
				, count( case when  m06_yn = 'Y'  then 1 end) m06_cnt
				, count( case when  m07_yn = 'Y'  then 1 end) m07_cnt
				, count( case when  m08_yn = 'Y'  then 1 end) m08_cnt
				, count( case when  m09_yn = 'Y'  then 1 end) m09_cnt
				, count( case when  m10_yn = 'Y'  then 1 end) m10_cnt
				, count( case when  m11_yn = 'Y'  then 1 end) m11_cnt
				, (select count(*) 
					from list_chck  
					where  tdm51_company_id = tdm43_company_id 
					and    tdm51_role_id = tdm43_role_id
					and    tdm51_org_id = tdm43_org_id
					and    tdm51_exct_id = tdm43_exct_id
					) item_cnt_1455 --  "1455 점검항목수"
				, (select  string_agg( distinct emp01_kor_nm ,  ',' order by emp01_kor_nm  )   
					from   list_chck
					left outer join   emp01_person  on  emp01_person_id = tdm52_checker_id
					where  tdm51_company_id = tdm43_company_id 
					and    tdm51_role_id = tdm43_role_id
					and    tdm51_org_id = tdm43_org_id
					and    tdm51_exct_id = tdm43_exct_id
					and    tdm52_checker_id is not null 
					) checker_1456    -- "1456 점검자"
				, ( select   string_agg(  emp01_kor_nm,  ',' order by tdm58_appr_seq)   
					from (
						select  emp01_kor_nm, tdm58_appr_seq
						from tdm58_chck_appr_step  
						join tdm51_chck_org on tdm51_chck_org_id  = tdm58_chck_org_id  
						left outer join emp01_person x on emp01_person_id = tdm58_appr_emp_id
						where  tdm51_company_id =  tdm43_company_id 
						and    tdm51_role_id = tdm43_role_id
						and    tdm51_org_id  = tdm43_org_id
						and    tdm51_exct_id = tdm43_exct_id
						and   tdm51_check_ym = to_char(w_chck_std_date, 'yyyy.mm') 
						and (tdm51_role_id, tdm51_org_id ) 
						in  (select tdm43_role_id, tdm43_org_id from lists where   m00_yn = 'Y' )
						group by emp01_kor_nm, tdm58_appr_seq
						) a
					) appr_list_1456  --  "1456 승인선"
					,( select appr_status 
						from  list_chck_appr
						where tdm51_company_id = tdm43_company_id and   tdm51_role_id = tdm43_role_id	and   tdm51_exct_id = tdm43_exct_id	and  tdm51_org_id   = tdm43_org_id
					) appr_ststus --  "승인상태"	
					, (select 'Y'
						from  tdm53_chck_exct 
						where tdm53_company_id = tdm43_company_id and tdm53_role_id = tdm43_role_id and  tdm53_exct_id = tdm43_exct_id 
						and tdm53_exct_appr_yn ='true' 
						and tdm53_check_ym = to_char(w_chck_std_date, 'yyyy.mm')  ) exct_approve_yn  -- "임원승인 완료여부"
					, (select 'Y'
						from  tdm53_chck_exct 
						where tdm53_company_id = tdm43_company_id and tdm53_role_id = tdm43_role_id and  tdm53_exct_id = tdm43_exct_id and tdm53_lock_yn ='true' 
						and tdm53_check_ym = to_char(w_chck_std_date, 'yyyy.mm') ) chck_lock_yn  -- "잠금여부"
					, (select 'Y'
						from  tdm50_chck_job 
						where tdm50_company_id = tdm43_company_id and tdm50_end_yn='true' 
						and   tdm50_check_ym = to_char(w_chck_std_date, 'yyyy.mm') ) chck_close_yn  -- "마감여부"
					, ( SELECT f_cdnm('AprStatusCode', apr01_status_cd, apr01_company_id, apr01_reg_date) AS tdm50_appr_status_nm 
						FROM tdm56_chck_relate_appr 
						join    tdm50_chck_job  on  tdm50_chck_job_id  = tdm56_relate_table_id
						INNER JOIN apr01_appr ON apr01_appr_id = tdm56_appr_id 
						where apr01_company_id = tdm43_company_id
						and  tdm50_check_ym = to_char(w_chck_std_date, 'yyyy.mm')  	) chck_appr_status  -- "결재상태"
					, max(m05_mon) m05_mon
			from    lists t
			group by tdm43_company_id, company_nm,  tdm43_role_id, tdm43_exct_id, tdm43_org_id
			order by company_nm    COLLATE "ko_KR.utf8", tdm43_role_id, tdm43_exct_id, tdm43_org_id

		loop


			-- call p_log('kdj', 'w_today ' ||  w_today  || 'r1.m05_mon '|| r1.m05_mon );

			w_cnt := w_cnt +1;
	
			if   r1.manl_cnt             = 0 then r1.manl_cnt           := null;  end if; 
			if   r1.end_cnt              = 0 then r1.end_cnt            := null;  end if;
			if   r1.lock_cnt             = 0 then r1.lock_cnt           := null;  end if;
			if   r1.approve_cnt          = 0 then r1.approve_cnt        := null;  end if;
			if   r1.unused_cnt           = 0 then r1.unused_cnt         := null;  end if;
			if   r1.manl_annually        = 0 then r1.manl_annually      := null;  end if;
			if   r1.manl_semiannually    = 0 then r1.manl_semiannually  := null;  end if;
			if   r1.manl_quarterly       = 0 then r1.manl_quarterly     := null;  end if;
			if   r1.manl_monthly         = 0 then r1.manl_monthly       := null;  end if;
			if   r1.manl_anytime         = 0 then r1.manl_anytime       := null;  end if;
			if   r1.manl_etc             = 0 then r1.manl_etc           := null;  end if;
			if   r1.m00_cnt              = 0 then r1.m00_cnt            := null;  end if;
			if   r1.m01_cnt              = 0 then r1.m01_cnt            := null;  end if;
			if   r1.m02_cnt              = 0 then r1.m02_cnt            := null;  end if;
			if   r1.m03_cnt              = 0 then r1.m03_cnt            := null;  end if;
			if   r1.m04_cnt              = 0 then r1.m04_cnt            := null;  end if;
			if   r1.m05_cnt              = 0 then r1.m05_cnt            := null;  end if;
			if   r1.m06_cnt              = 0 then r1.m06_cnt            := null;  end if;
			if   r1.m07_cnt              = 0 then r1.m07_cnt            := null;  end if;
			if   r1.m08_cnt              = 0 then r1.m08_cnt            := null;  end if;
			if   r1.m09_cnt              = 0 then r1.m09_cnt            := null;  end if;
			if   r1.m10_cnt              = 0 then r1.m10_cnt            := null;  end if;
			if   r1.m11_cnt              = 0 then r1.m11_cnt            := null;  end if;
			if   r1.item_cnt_1455        = 0 then r1.item_cnt_1455      := null;  end if;



			insert into sys99_print 
			(sys99_window_class_nm, sys99_group_id, sys99_print_id,sys99_company_id
				, sys99_string01, sys99_string02, sys99_string03, sys99_string04, sys99_string05, sys99_string06
				, sys99_long01, sys99_long02, sys99_long03, sys99_long04 
				, sys99_long05, sys99_long06, sys99_long07, sys99_long08, sys99_long09, sys99_long10, sys99_long11 
				, sys99_string07, sys99_string08
				, sys99_long21, sys99_long22, sys99_long23, sys99_long24, sys99_long25, sys99_long26 
				, sys99_long27, sys99_long28, sys99_long29, sys99_long30, sys99_long31, sys99_long32
				, sys99_long33
				, sys99_string11, sys99_string12, sys99_string13, sys99_string14, sys99_string15, sys99_string16, sys99_string17
			)
			values
			( w_sys99_window_class_nm, w_sys99_group_id, f_create_seq()	, r1.tdm43_company_id
				, r1.company_nm, r1.role_nm, r1.exct_nm, r1.org_nm, r1.name_1454,  r1.appr_list_1463
				, r1.manl_cnt, r1.end_cnt, r1.lock_cnt, r1.approve_cnt 
				, r1.unused_cnt, r1.manl_annually, r1.manl_semiannually, r1.manl_quarterly, r1.manl_monthly, r1.manl_anytime, r1.manl_etc
				, r1.this_month_yn, r1.next_month_yn
				, r1.m00_cnt, r1.m01_cnt, r1.m02_cnt, r1.m03_cnt, r1.m04_cnt, r1.m05_cnt
				, r1.m06_cnt, r1.m07_cnt, r1.m08_cnt, r1.m09_cnt, r1.m10_cnt, r1.m11_cnt
				, r1.item_cnt_1455
				, r1.checker_1456 , r1.appr_list_1456, r1.appr_ststus, r1.exct_approve_yn, r1.chck_lock_yn, r1.chck_close_yn, r1.chck_appr_status
			);


	
		end loop;


	end if;

	delete  from sys99_print where sys99_window_class_nm = w_sys99_window_class_nm and  sys99_group_id = w_sys99_group_id
	and     sys99_company_id in ( 
			 1  --  "한국펀드서비스(주)"
			, 10,20,30,40  -- "S1,S2,S3,A1 사용 고객사"
			, 83211  -- DEMO 
			, 202602068116831   -- 민트투자자문
			, 202605194864932   -- 케이지티자산운용
			, 202308289232130  -- 한국연금투자자문
	);



	return('Y');

END;
$function$
```
