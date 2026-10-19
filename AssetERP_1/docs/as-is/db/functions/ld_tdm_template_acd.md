# ld_tdm_template_acd

## FUNCTION public.ld_tdm_template_acd(p_file_name character varying, p_company_id numeric)

- 반환: `character varying`
- 줄 수: 850

```sql
CREATE OR REPLACE FUNCTION public.ld_tdm_template_acd(p_file_name character varying, p_company_id numeric DEFAULT 0)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
    
BEGIN

	declare
		r1      record;
		r2      record;
		w_company_id sys01_company.sys01_company_id%type;
		w_id   tdm01_hr.tdm01_person_id%type;
		w_start_date date  default now(); 
		w_upd_nm    varchar(10)  default 'system';
		
		R_tdm10   tdm10_task%rowtype;
		R_tdm11   tdm11_task_relate_rule%rowtype;
		R_tdm12   tdm12_task_relate_detail%rowtype;
		R_tdm13   tdm13_task_relate_duty%rowtype;
		R_tdm14   tdm14_task_type%rowtype;

		R_tdm20   tdm20_role%rowtype;
		R_tdm21   tdm21_role_relate_task%rowtype;
		R_tdm23   tdm23_role_relate_org%rowtype;

		R_tdm30   tdm30_role_allc%rowtype;
		R_tdm34   tdm34_role_allc_detail%rowtype;

		R_tdm32  tdm32_role_digm%rowtype;
		R_tdm36  tdm36_role_report%rowtype;

		R_tdm40   tdm40_manl_job%rowtype;
		R_tdm41   tdm41_manl_duty%rowtype;
		R_tdm42   tdm42_manl_org%rowtype;
		R_tdm43   tdm43_manl%rowtype;
		R_tdm44   tdm44_manl_duty_org%rowtype;

		R_tdm98    tdm98_load%rowtype; 

		w_cnt      integer default 0;
		w_ret      varchar(100);
		w_num_ret  numeric;
		w_haim_company_id   sys01_company.sys01_company_id%type   default 1;   -- 현대하임대신에  KFS에 넣었음 
		w_haim_role_id     tdm43_manl.tdm43_role_id%type;
		w_old_id          sys01_company.sys01_company_id%type;

		w_upd_date tdm20_role.tdm20_upd_date%type ; 

		
	begin


		RAISE NOTICE 'Start ';
		-------------------------------------------------------------------------------------------------------
	
		begin
			select sys01_company_id
			into   STRICT w_company_id
			from   sys01_company
			where  sys01_loc_nm = replace(p_file_name,'.txt','');
		exception when no_data_found then
            RAISE 'Company not foud in sys01_company  % ' , p_file_name ;
        END;

		

		RAISE NOTICE 'Company   %   %', p_file_name  , w_company_id ;
		

		-- 화일을 Load
		delete from tdm98_load  where tdm98_company_id = w_company_id;


		----------------------------------------------------------------------------------------------------------
	
		delete from tdm12_task_relate_detail
		where tdm12_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = w_company_id) ;
		
		delete from tdm13_task_relate_duty
		where tdm13_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = w_company_id) ;



		delete from tdm21_role_relate_task  
		where  tdm21_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = w_company_id);

		--직책별 담당부서 
		-- 기존정보 이용 
		-- delete from tdm23_role_relate_org  
		-- where  tdm23_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = w_company_id);


		-- 임원배정 상세 
		delete from tdm34_role_allc_detail  
		where  tdm34_role_allc_id  in (select  tdm30_role_allc_id from tdm30_role_allc where tdm30_company_id = w_company_id);

		delete from tdm14_task_type         where tdm14_company_id = w_company_id;


		-- 책무는 기존 정보 이용
		-- delete from tdm10_task              where tdm10_company_id = w_company_id;
		

		-- 직책은 기존 정보 이용 
		-- delete from tdm20_role              where tdm20_company_id = w_company_id;

		delete from tdm30_role_allc         where tdm30_company_id = w_company_id;
		delete from tdm11_task_relate_rule  where tdm11_company_id = w_company_id and tdm11_relate_type ='1';

	

		delete from tdm44_manl_duty_org   where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where  tdm41_company_id = w_company_id);
		-- delete from tdm40_manl_job   where tdm40_company_id = w_company_id;
		delete from tdm41_manl_duty  where tdm41_company_id = w_company_id;

		-- Role에 연동하는 데이타 이므로 삭제하지 않는다 
		-- delete from tdm42_manl_org   where tdm42_company_id = w_company_id;
		delete from tdm43_manl       where tdm43_company_id = w_company_id;


		----------------------------------------------------------------------------------------------------------

		RAISE NOTICE 'select tdm40_manl_job';

		-- 
		SELECT tdm40_start_date, tdm40_upd_date   
		into  strict  w_start_date, w_upd_date 
		FROM  tdm40_manl_job
		where tdm40_company_id = w_company_id;


	
		----------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start role ';
		
		for r1 in 
			select   split_part(contents, '	', 3)  seq
				, split_part(contents, '	', 4)  role_cd	
				, split_part(contents, '	', 5)  role_nm	
				, split_part(contents, '	', 6)  person_nm
				, case when split_part(contents, '	', 7) ='Y' then 'true' else 'false' end  add_title_yn 
				, split_part(contents, '	', 8)  support_depts
				, split_part(contents, '	', 9)  role_desc
				, case 
					when split_part(contents, '	', 5) like '이사회%의장' then 'A'
					when split_part(contents, '	', 5) like '%감사%'    then 'B' 
					when split_part(contents, '	', 5) like '%대표이사%' then 'C' 
					when split_part(contents, '	', 5) like '%준법감시%' then 'D' 
					when split_part(contents, '	', 5) in ('경영관리본부장','투자운용본부장') then 'E' 
					else 'E' 
					end role_type
				, case 
					when split_part(contents, '	', 5) in ('경영관리본부장','투자운용본부장') then '대표이사지원' 
					end role_type_etc_nm
			from  ifi_recv 
			where file_name = p_file_name
			and   split_part(contents, '	', 2) = 'role'
			and   length(contents) > 0 
			and   contents not like 'No%' 
			and   length( split_part(contents, '	', 5))  >0   -- 직책 필수 
			and   length( split_part(contents, '	', 6))  >0   -- 담당임원 필수
			order by  case when split_part(contents, '	', 4) = '대표이사' then 1 else 2 end, id 
		loop 

			begin
				select * into strict R_tdm20
				from   tdm20_role
				where  tdm20_company_id  =  w_company_id
				and    tdm20_role_nm     =  r1.role_nm;
		
			exception when no_data_found then

				R_tdm20 := null;
				R_tdm20.tdm20_role_id           :=  f_create_seq(); -- 직책정보ID(PK)
	
	
				R_tdm20.tdm20_company_id        :=  w_company_id ; -- 회사ID
				R_tdm20.tdm20_role_nm           :=  r1.role_nm ; -- 직책명
				R_tdm20.tdm20_role_type         :=  r1.role_type ; -- 직책그룹코드(TdmRoleType-A:이사회의장/B:이사회지원/C:대표이사/D:대표이사지원/E:기타그룹)
	
				-- R_tdm20.tdm20_role_type_etc_nm  :=  r1.role_type_etc_nm ; -- 직책그룹기타코드명(직책그룹코드가 E인 경우만 해당)
	
				if r1.role_type ='E' then
					R_tdm20.tdm20_role_type_etc_nm := '대표이사지원' ;
				end if;
				
				if r1.role_nm <> '대표이사' then
					select tdm20_role_id into R_tdm20.tdm20_ceo_role_id
					from   tdm20_role
					where  tdm20_company_id = w_company_id and tdm20_role_type ='C';
				end if;
		
				-- R_tdm20.tdm20_role_type_etc_nm  :=   ; -- 직책그룹기타코드명(직책그룹코드가 E인 경우만 해당)
				R_tdm20.tdm20_overview          :=  r1.role_desc; -- 개요
				R_tdm20.tdm20_start_date        :=  w_start_date; -- 사용시작일
				R_tdm20.tdm20_end_date          :=  null; -- 사용종료일
				R_tdm20.tdm20_upd_nm            :=  'system' ; -- 등록(변경)자
				R_tdm20.tdm20_upd_date          :=  w_upd_date ; -- 등록(변경)일시
			
				insert into tdm20_role values ( R_tdm20.* );
			end;


			-----------------------------------------------
			-- ROlE코드 Save
			R_tdm98 := null;
			R_tdm98.tdm98_company_id := w_company_id;
			R_tdm98.tdm98_load_id    := f_create_batchseq();
			R_tdm98.tdm98_data_tp    := 'role';
			R_tdm98.tdm98_data_id    := R_tdm20.tdm20_role_id ;
			R_tdm98.tdm98_data_cd    := r1.role_cd;
			R_tdm98.tdm98_data_nm    := r1.role_nm;
			insert into tdm98_load values ( R_tdm98.* );

	

			-----------------------------------------------
			-- 직책 담당임원 배정내역 
			R_tdm30 := null;
			R_tdm30.tdm30_role_allc_id  :=   f_create_seq(); -- 직책(책무)배분ID(PK)
			R_tdm30.tdm30_company_id    :=   R_tdm20.tdm20_company_id; -- 회사ID
			R_tdm30.tdm30_role_id       :=   R_tdm20.tdm20_role_id ; -- 직책ID(tdm20_role_id)
			-- R_tdm30.tdm30_person_id     :=   null ; -- 임원ID(tdm01_person_id)
			R_tdm30.tdm30_add_title_yn  :=   r1.add_title_yn ; -- 겸직여부
			R_tdm30.tdm30_start_date    :=   w_start_date ; -- 직책부여일
			R_tdm30.tdm30_end_date      :=   null ; -- 직책해제일
			R_tdm30.tdm30_upd_nm        :=   'system'; -- 등록(변경)자
			R_tdm30.tdm30_upd_date      :=   w_upd_date; -- 등록(변경)일시



			-- 임원ID
			begin
				select tdm01_person_id into strict  R_tdm30.tdm30_person_id
				from   tdm01_hr
				where  tdm01_company_id = w_company_id and tdm01_person_nm = r1.person_nm;
			exception 
				when too_many_rows then RAISE NOTICE 'Person too_many_rows :  % ' , r1.person_nm;   return 'N';
				when no_data_found then RAISE NOTICE 'Person no_data_found :  % ' , r1.person_nm;   return 'N';
			end;
			

			/* 이건 못함 
			-- 직책부여일 (인사발령일)
			SELECT max(emp03_trans_date) into R_tdm30.tdm30_start_date
			FROM emp03_trans WHERE emp03_person_id = R_tdm30.tdm30_person_id;
			*/

			
			insert into tdm30_role_allc values ( R_tdm30.* );

			-----------------------------------------------
			-- 직책 담당임원 상세내역 
			R_tdm34 := null;
			R_tdm34.tdm34_role_allc_detail_id  :=  f_create_seq() ; -- 직책(책무)배분-상세정보ID(PK)
			R_tdm34.tdm34_role_allc_id         :=  R_tdm30.tdm30_role_allc_id ; -- 직책(책무)배분ID(tdm30_role_allc_id)
			-- R_tdm34.tdm34_role_allc_date       :=  w_start_date; -- 책무배분일(이사회결의일)

			R_tdm34.tdm34_role_allc_date       :=  to_date('2026-07-02','yyyy-mm-dd'); -- 책무배분일(이사회결의일 )
			R_tdm34.tdm34_reg_reason           :=  '협회 소규모 운용사 예시안' ; -- 등록사유
			R_tdm34.tdm34_deputy_emp_nm        :=  '미등록' ; -- 유고시 대체 임직원명
			R_tdm34.tdm34_appr_id              :=  null ; -- 임원동의서 상신ID
			R_tdm34.tdm34_upd_nm               :=  'system'; -- 등록(변경)자
			R_tdm34.tdm34_upd_date             :=  w_upd_date ; -- 등록(변경)일시
			
			insert into tdm34_role_allc_detail values ( R_tdm34.* );

			-----------------------------------------------
			-- 직책별 지원부서 

		end loop;






		
		----------------------------------------------------------------------------------------
		RAISE NOTICE 'Start task_type ';
		for r1 in 
			select   split_part(contents, '	', 3)  seq
				, split_part(contents, '	', 4)  task_type_cd	
				, split_part(contents, '	', 5)  task_type_nm	
			from  ifi_recv 
			where file_name = p_file_name
			and   split_part(contents, '	', 2) = 'task_type'
			and   length(contents) > 0 
		loop
			R_tdm14 := null;
			R_tdm14.tdm14_task_type_id  := f_create_seq(); -- 책무유형정의ID(PK)
			R_tdm14.tdm14_company_id    := w_company_id ; -- 회사ID
			R_tdm14.tdm14_task_type_cd  := r1.task_type_cd; -- 책무유형코드
			R_tdm14.tdm14_task_type_nm  := r1.task_type_nm ; -- 책무유형명
			R_tdm14.tdm14_system_cd     := null ; -- 책무유형코드(ADMIN)
			R_tdm14.tdm14_use_yn        := 'true' ; -- 사용여부
			R_tdm14.tdm14_upd_nm        := 'true'; -- 등록(변경)자
			R_tdm14.tdm14_upd_date      := w_upd_date  ; -- 등록(변경)일시
			
			insert into tdm14_task_type values ( R_tdm14.* );
	
			-- RAISE NOTICE 'ID % ', R_tdm14.tdm14_task_type_id ;
			-- w_num_ret := ld_tdm_template_sub ( 'SAVE', w_company_id, 'task_type', r1.task_type_cd, R_tdm14.tdm14_task_type_id);
		end loop ;



		----------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start task ';
		for r1 in
			select   split_part(contents, '	', 3)  seq
				, split_part(contents, '	', 4)  task_cd	
				, split_part(contents, '	', 5)  task_nm	
				, split_part(contents, '	', 6)  task_class_cd
				, case when split_part(contents, '	', 7) ='Y' then 'true' else 'false' end   ceo_yn 
				, case when split_part(contents, '	', 8) ='Y' then 'true' else 'false' end   common_yn 
				, split_part(contents, '	', 9)  task_type_cd 
			from  ifi_recv 
			where file_name = p_file_name
			and   split_part(contents, '	', 2) = 'task'
			and   length(contents) > 0 
		loop

			begin
				select * into strict R_tdm10
				from   tdm10_task
				where  tdm10_company_id  =  w_company_id
				and    tdm10_task_nm     =  r1.task_nm;
		
			exception when no_data_found then

				R_tdm10 := null;
				R_tdm10.tdm10_task_id       :=  f_create_seq(); -- 책무정보ID(PK)
				R_tdm10.tdm10_company_id    :=  w_company_id; -- 회사ID
				R_tdm10.tdm10_task_class_cd :=  r1.task_class_cd; -- 책무분류(TdmTaskClassCode - A:지정책임자, B:금융영업, C:경영관리)
				R_tdm10.tdm10_task_type_cd  :=  r1.task_type_cd ; -- 책무유형(tdm14_task_type_cd)
				R_tdm10.tdm10_task_nm       :=  r1.task_nm  ; -- 책무명
				R_tdm10.tdm10_common_yn     :=  r1.common_yn; -- 공통책무여부
				R_tdm10.tdm10_ceo_yn        :=  r1.ceo_yn   ; -- CEO책무여부
				R_tdm10.tdm10_start_date    :=  w_start_date ; -- 사용시작일
				R_tdm10.tdm10_end_date      :=  null; -- 사용종료일
				R_tdm10.tdm10_upd_nm        :=  'system' ; -- 등록(변경)자
				R_tdm10.tdm10_upd_date      :=  w_upd_date;  -- 등록(변경)일시
				
				insert into tdm10_task values ( R_tdm10.* );

			end;

			R_tdm98 := null;
			R_tdm98.tdm98_company_id := w_company_id;
			R_tdm98.tdm98_load_id    := f_create_batchseq();
			R_tdm98.tdm98_data_tp    := 'task';
			R_tdm98.tdm98_data_id    := R_tdm10.tdm10_task_id ;
			R_tdm98.tdm98_data_cd    := r1.task_cd;
			R_tdm98.tdm98_data_nm    := r1.task_nm;
			insert into tdm98_load values ( R_tdm98.* );

			-- w_num_ret := ld_tdm_template_sub ( 'SAVE', w_company_id, 'task', r1.task_cd, R_tdm10.tdm10_task_id );
			
		end loop;


		-- Task 중복인지 Check
		for r1 in 
			select   tdm98_data_cd, count(*) cnt 
			from     tdm98_load  where tdm98_company_id= w_company_id and tdm98_data_tp ='task'
			group by tdm98_data_cd
			having count(*) >1 
		loop
			RAISE NOTICE 'task 코드 1개 이상  :  %(%) ' , r1.tdm98_data_cd, r1.cnt;   return 'N';
		end loop;

		
		----------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start task_law ';
		for r1 in 
			select   split_part(contents, '	', 3)  seq
				, split_part(contents, '	', 4)  task_cd 	
				, split_part(contents, '	', 5)  law_cd	
				, row_number() over (partition by split_part(contents, '	', 4) order by split_part(contents, '	', 3)  ) as  law_seq 
			from  ifi_recv 
			where file_name = p_file_name
			and   split_part(contents, '	', 2) = 'task_law'
			and   length(contents) > 0 
			and   contents not like 'No%' 
			and   length(split_part(contents, '	', 1)) >0
		loop
	
			R_tdm11 := null;
			R_tdm11.tdm11_task_relate_rule_id  :=  f_create_seq()  ; -- 책무연결정보-규정(법규/내규)ID(PK)
			-- R_tdm11.tdm11_task_id       :=  ld_tdm_template_sub ('GET', w_company_id, 'task', r1.task_cd )  ; -- 책무ID(tdm10_task_id)

			select  tdm98_data_id  into  R_tdm11.tdm11_task_id
			from    tdm98_load
			where   tdm98_company_id = w_company_id and  tdm98_data_tp = 'task' and  tdm98_data_cd  = r1.task_cd;
			
			
			R_tdm11.tdm11_relate_type   :=  '1'  ; -- 규정연결구분(1:법규/2:내규)
			R_tdm11.tdm11_rule_cd       :=  r1.law_cd ; -- 규정코드(법규:TdmLawCode, 내규:bbs15_company_rule_cd)
			R_tdm11.tdm11_seq           :=  r1.law_seq; -- 조회순서
			R_tdm11.tdm11_company_id    :=  w_company_id  ; -- 회사ID
			R_tdm11.tdm11_upd_nm        :=  'system' ; -- 등록(변경)자
			R_tdm11.tdm11_upd_date      :=  w_upd_date ; -- 등록(변경)일시

	
			insert into tdm11_task_relate_rule values ( R_tdm11.* );
			
		end loop;

	
		----------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start role_task ';
		for r1 in 
			select   split_part(contents, '	', 1+2)  seq
				, split_part(contents, '	', 2+2)  role_cd	
				, split_part(contents, '	', 3+2)  task_cd
			from  ifi_recv 
			where file_name = p_file_name
			and   split_part(contents, '	', 2) = 'role_task'
			and   length(contents) > 0 
			and   contents not like 'No%' 
			and   length(split_part(contents, '	', 1)) >0
		loop
			R_tdm21 := null;
			R_tdm21.tdm21_role_relate_task_id  :=  f_create_seq()   ; -- 직책연결정보-책무ID(PK)

			begin
				select  tdm98_data_id  into  R_tdm21.tdm21_role_id 
				from    tdm98_load
				where   tdm98_company_id = w_company_id and  tdm98_data_tp = 'role' and  tdm98_data_cd  = r1.role_cd;
			exception when no_data_found then
				return 'ERROR 999';
			end;

			select  tdm98_data_id  into  R_tdm21.tdm21_task_id 
			from    tdm98_load
			where   tdm98_company_id = w_company_id and  tdm98_data_tp = 'task' and  tdm98_data_cd  = r1.task_cd;
			
			insert into tdm21_role_relate_task values ( R_tdm21.* );
			
		end loop;


		-------------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start tdm98';
		begin

			R_tdm98 := null;
			R_tdm98.tdm98_company_id := w_company_id;
			R_tdm98.tdm98_data_tp := 'manual';
	
			for r1 in
				select   split_part(contents, '	', 3)  seq
					, rtrim( split_part(contents, '	', 4))  task_cd
					, rtrim( split_part(contents, '	', 5))  task_nm 
					, rtrim( split_part(contents, '	', 6))  detail_nm  
					, rtrim( split_part(contents, '	', 7))  duty_nm
					, rtrim( split_part(contents, '	', 8))  check_item
					, rtrim( split_part(contents, '	', 9))  check_how
				from  ifi_recv 
				where file_name = p_file_name
				and   split_part(contents, '	', 2) = 'task_manual'
				and   length(contents) > 0 
				order by id   --to_number( split_part(contents, '	', 3),'999999')
			loop
	
				-- 빈 Row는  Skip 
				if length(r1.check_how) =0 	then  
					continue;
				end if;
	
	
				-- 점검항목이 바뀔때마다 Insert 한다  
				if length(r1.check_item) >0  and R_tdm98.tdm98_check_how is not null  then
					R_tdm98.tdm98_load_id    := f_create_batchseq();
					insert into tdm98_load values ( R_tdm98.* );
					
					R_tdm98.tdm98_check_how := null;
				end if;
	
				w_cnt := w_cnt +1;
	
				if length(r1.task_cd) >0 	then  
					R_tdm98.tdm98_data_cd := r1.task_cd;
					
					select  tdm98_data_id  into  R_tdm98.tdm98_data_id
					from    tdm98_load
					where   tdm98_company_id = w_company_id and  tdm98_data_tp = 'task' and  tdm98_data_cd  = r1.task_cd;
					
				end if;
				
				if length(r1.task_nm) >0 	then  
					R_tdm98.tdm98_data_nm := r1.task_nm;
				end if;
				
				if length(r1.detail_nm) >0 	then  
					R_tdm98.tdm98_task_relate_detail_id := f_create_seq() ;
					R_tdm98.tdm98_task_relate_detail_nm := r1.detail_nm;
				end if;
	
				if length(r1.duty_nm) >0 	then  
					R_tdm98.tdm98_task_relate_duty_id := f_create_seq() ;
					R_tdm98.tdm98_task_relate_duty_nm := r1.duty_nm;
				end if;
	
				if length(r1.check_item) >0 	then  
					R_tdm98.tdm98_check_item := r1.check_item;
				end if;
				
				if length(r1.check_how) >0 	then  
	
					if R_tdm98.tdm98_check_how is null then
						R_tdm98.tdm98_check_how :=     r1.check_how;
					else 
						R_tdm98.tdm98_check_how :=  R_tdm98.tdm98_check_how || chr(10)  ||  r1.check_how;
					end if;
				end if;
				
			end loop;
	
			-- 마지막 Row 
			if R_tdm98.tdm98_check_how is not null then
				R_tdm98.tdm98_load_id := f_create_batchseq();
				insert into tdm98_load values ( R_tdm98.* );
			end if;

		end;
	
 
		----------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start tdm12 ';
	
		for r1 in
			select tdm98_data_cd                     task_cd
				, tdm98_data_id                      task_id
				, tdm98_task_relate_detail_id        task_detail_id
				, max( tdm98_task_relate_detail_nm ) task_detail_nm
				, row_number() over (partition by tdm98_data_cd  order by max(tdm98_task_relate_detail_id)  ) as  task_detail_seq
			from tdm98_load 
			where  tdm98_company_id = w_company_id 
			and    tdm98_data_tp='manual'
			group by tdm98_data_cd , tdm98_data_id, tdm98_task_relate_detail_id
			order by  max(	tdm98_load_id ) 
		loop
		
			R_tdm12 := null;
			
			R_tdm12.tdm12_task_relate_detail_id  :=   r1.task_detail_id  ; -- 책무연결정보-세부내용ID(PK)
			R_tdm12.tdm12_task_id   :=   r1.task_id; -- 책무ID(tdm10_task_id)
			R_tdm12.tdm12_content   :=   r1.task_detail_nm; -- 내용
			R_tdm12.tdm12_seq       :=   r1.task_detail_seq; -- 조회순서
			R_tdm12.tdm12_use_yn    :=   'true' ; -- 사용여부
			R_tdm12.tdm12_upd_nm    :=   'system'; -- 등록(변경)자
			R_tdm12.tdm12_upd_date  :=   w_upd_date ; -- 등록(변경)일시
	
			insert into tdm12_task_relate_detail values ( R_tdm12.* );
	
		end loop;
	
		----------------------------------------------------------------------------------------------------------
		RAISE NOTICE 'Start tdm13 ';
		for r1 in 
			select tdm98_data_cd                     task_cd
				, tdm98_data_id                      task_id
				, tdm98_task_relate_detail_id        task_detail_id
				, tdm98_task_relate_duty_id          task_duty_id
				, max(tdm98_task_relate_duty_nm)     task_duty_nm
				, row_number() over (partition by tdm98_task_relate_detail_id  order by max(tdm98_task_relate_duty_id)  ) as  task_duty_seq
			from tdm98_load 
			where    tdm98_company_id = w_company_id 
			and      tdm98_data_tp='manual'
			group by tdm98_data_cd , tdm98_data_id, tdm98_task_relate_detail_id, tdm98_task_relate_duty_id
			order by  max(	tdm98_load_id ) 
		loop
	
			R_tdm13 := null;
			R_tdm13.tdm13_task_relate_duty_id   :=   r1.task_duty_id; -- 책무연결정보-관리의무ID(PK)
			R_tdm13.tdm13_task_id               :=   r1.task_id ; -- 책무ID(tdm10_task_id)
			R_tdm13.tdm13_task_relate_detail_id :=   r1.task_detail_id; -- 책무ID(tdm12_task_relate_detail_id)
			R_tdm13.tdm13_content   :=   r1.task_duty_nm; -- 내용
			R_tdm13.tdm13_seq       :=   r1.task_duty_seq; -- 조회순서
			R_tdm13.tdm13_use_yn    :=   'true'; -- 사용여부
			R_tdm13.tdm13_upd_nm    :=   'system'; -- 등록(변경)자
			R_tdm13.tdm13_upd_date  :=   w_upd_date ; -- 등록(변경)일시
	
			insert into tdm13_task_relate_duty values ( R_tdm13.* );
			
		end loop;



		----------------------------------------------------------------------------------------------------------
		begin


			/*
			R_tdm40 := null;
			R_tdm40.tdm40_manl_job_id  :=  f_create_seq() ; -- 책무매뉴얼 작업ID(PK)
			R_tdm40.tdm40_company_id   :=  w_company_id ; -- 회사ID
			R_tdm40.tdm40_reg_date     :=  w_start_date ; -- 등록일
			R_tdm40.tdm40_job_nm       :=  '협회 소규모 예시안' ; -- 매뉴얼작업명
			R_tdm40.tdm40_role_id      :=  0 ; -- 직책ID(작업조건1, null이면 전체직책)
			R_tdm40.tdm40_org_id       :=  null ; -- 조직ID(작업조건2, null이면 전체조직)
			R_tdm40.tdm40_job_reason   :=  '협회 소규모 예시안' ; -- 작업사유
			R_tdm40.tdm40_start_date   :=  w_start_date ; -- 작성시작일
			R_tdm40.tdm40_end_date     :=  null; -- 작성마감일
			R_tdm40.tdm40_upd_nm       :=  'system'; -- 등록(변경)자
			R_tdm40.tdm40_upd_date     :=  w_upd_date   ; -- 등록(변경)일시
			R_tdm40.tdm40_allc_std_date     :=  to_date('2026-07-02','yyyy-mm-dd')    ; -- 배분기준일  

			
			insert into tdm40_manl_job values ( R_tdm40.* );
			*/

			begin

				select * into strict R_tdm40 from  tdm40_manl_job  where tdm40_company_id = w_company_id;
			exception when no_data_found then
				raise 'tdm40_manl_job 없음';
			end;


			----------------------------------------------------------------------------------------------------------
		
			for r1 in
				with list_role 
				as (
					select tdm21_role_id  role_id, tdm21_task_id task_id
					from   tdm21_role_relate_task   
					left outer join tdm20_role
					on     tdm21_role_id    = tdm20_role_id
					where  tdm20_company_id = w_company_id
				)
				,list_task
				as (
					select tdm13_task_id                  task_id
						   , tdm13_task_relate_detail_id  task_relate_detail_id
						   , tdm13_task_relate_duty_id     task_relate_duty_id
					from tdm13_task_relate_duty   
					left outer join tdm10_task
					on     tdm13_task_id    = tdm10_task_id
					where  tdm10_company_id = w_company_id
				)
				select a.role_id, a.task_id, b.task_relate_detail_id, b.task_relate_duty_id
				from   list_role a, list_task b
				where  a.task_id = b.task_id
			loop
		
				R_tdm41 := null;
				R_tdm41.tdm41_manl_duty_id          :=  f_create_seq() ; -- 책무매뉴얼 부서지정ID(PK)
				R_tdm41.tdm41_manl_job_id           :=  R_tdm40.tdm40_manl_job_id ; -- 책무매뉴얼 작업ID(tdm40_manl_job_id)
				R_tdm41.tdm41_role_id               :=  r1.role_id ; -- 직책ID(tdm20_role_id)
				R_tdm41.tdm41_task_id               :=  r1.task_id ; -- 책무ID(tdm10_task_id)
				R_tdm41.tdm41_task_relate_detail_id :=  r1.task_relate_detail_id; -- 책무세부ID(tdm12_task_relate_detail_id)
				R_tdm41.tdm41_task_relate_duty_id   :=  r1.task_relate_duty_id ; -- 관리의무ID(tdm13_task_relate_duty_id)
				R_tdm41.tdm41_upd_nm                :=  'system'; -- 등록(변경)자
				R_tdm41.tdm41_upd_date              :=  w_upd_date; -- 등록(변경)일시
				R_tdm41.tdm41_company_id            :=  w_company_id; -- 회사ID
		
				insert into tdm41_manl_duty values ( R_tdm41.* );
		
		
				R_tdm44 := null;
				R_tdm44.tdm44_manl_duty_org_id  :=  f_create_seq()  ; -- 책무매뉴얼 작업_부서지정ID(PK)
				R_tdm44.tdm44_manl_duty_id      :=  R_tdm41.tdm41_manl_duty_id; -- 책무매뉴얼 작업_관리의무ID(tdm41_manl_duty_id)
				-- R_tdm44.tdm44_org_id            :=   ; -- 조직ID
				R_tdm44.tdm44_end_yn            :=   null; -- 작성완료여부
				R_tdm44.tdm44_end_date          :=   null; -- 작성완료일
				R_tdm44.tdm44_end_emp_id        :=   null ; -- 작성자ID
				R_tdm44.tdm44_upd_nm            :=   'system'; -- 등록(변경)자
				R_tdm44.tdm44_upd_date          :=   w_upd_date ; -- 등록(변경)일시
		
				begin
					select  tdm23_org_id   into strict  R_tdm44.tdm44_org_id   -- 조직ID
					from    tdm23_role_relate_org 
					where  tdm23_role_id =  r1.role_id 
					limit 1;
				exception 
					when too_many_rows then RAISE NOTICE 'tdm44_org_id too_many_rows :  %' , r1.role_id;  
					when no_data_found then RAISE NOTICE 'tdm44_org_id no_data_found :  %' , r1.role_id;  
				end;
		
				insert into tdm44_manl_duty_org values ( R_tdm44.* );
		
		
			end loop ;
		 
		
			----------------------------------------------------------------------------------------------------------
			/* 재생성하지 않는다 
			for r1 in
				select  tdm20_role_id  role_id
					, ( select  tdm23_org_id   from tdm23_role_relate_org where  tdm23_role_id =  a.tdm20_role_id  limit 1)   org_id
					, ( select  tdm30_person_id from tdm30_role_allc       where  tdm30_role_id =  a.tdm20_role_id)  exct_id
				from    tdm20_role  a
				where   tdm20_company_id = w_company_id
			loop
		
				R_tdm42 := null;
				R_tdm42.tdm42_manl_org_id  :=  f_create_seq()  ; -- 부서 책무매뉴얼ID(PK)
				R_tdm42.tdm42_company_id   :=  w_company_id ; -- 회사ID
				R_tdm42.tdm42_org_id       :=  r1.org_id ; -- 조직ID
				R_tdm42.tdm42_exct_id      :=  r1.exct_id ; -- 임원ID(emp01_person_id)
				R_tdm42.tdm42_role_id      :=  r1.role_id ; -- 직책ID(tdm20_role_id)
				R_tdm42.tdm42_lock_yn      :=  'false' ; -- 잠금여부
				R_tdm42.tdm42_start_date   :=  to_date('2026-07-02','yyyy-mm-dd')  ; -- 적용시작일
				R_tdm42.tdm42_end_date     :=  null ; -- 적용종료일
				R_tdm42.tdm42_appr_id      :=  null ; -- 책무매뉴얼 상신ID
				R_tdm42.tdm42_manl_job_id  :=  R_tdm40.tdm40_manl_job_id ; -- 책무매뉴얼 작업ID(tdm40_manl_job_id)
				R_tdm42.tdm42_upd_nm       :=  'system' ; -- 등록(변경)자
				R_tdm42.tdm42_upd_date     :=  w_upd_date ; -- 등록(변경)일시
		
				insert into tdm42_manl_org values ( R_tdm42.* );
		
			end loop;
			*/
		

		
			----------------------------------------------------------------------------------------------------------
			RAISE NOTICE 'Start tdm43 ';
			w_cnt := 0;
			for r1 in
				with list_role_info
				as (
					select tdm41_role_id                 role_id
						, tdm41_task_id                  task_id
						, tdm41_task_relate_detail_id    task_relate_detail_id
						, tdm41_task_relate_duty_id      task_relate_duty_id
						, tdm20_role_nm              role_nm
						, tdm10_task_nm              task_nm
						, tdm12_content              task_relate_detail_nm
						, tdm13_content              task_relate_duty_nm
					from   tdm41_manl_duty 
					left outer join tdm20_role 
					on     tdm41_role_id    = tdm20_role_id
					left outer join tdm10_task
					on     tdm41_task_id    = tdm10_task_id
					left outer join tdm12_task_relate_detail 
					on     tdm41_task_relate_detail_id    = tdm12_task_relate_detail_id
					left outer join tdm13_task_relate_duty 
					on     tdm41_task_relate_duty_id    = tdm13_task_relate_duty_id
					where  tdm10_company_id = w_company_id
					and    tdm20_company_id = w_company_id
				),
				list_chek_info
				as (
					select tdm98_data_cd                     task_cd
						, tdm98_data_id                      task_id
						, tdm98_task_relate_detail_id        task_relate_detail_id
						, tdm98_task_relate_duty_id          task_relate_duty_id
						, tdm98_check_item                   check_item
						, tdm98_check_how                    check_how
						, row_number() over (partition by tdm98_check_item  order by tdm98_load_id  ) as  check_item_seq
						, tdm98_load_id
					from tdm98_load 
					where    tdm98_company_id = w_company_id 
					and      tdm98_data_tp='manual'
				)
				select a.*, b.check_item
							, b.check_how
							, b.check_item_seq
				from   list_role_info a,  list_chek_info b
				where  a.task_id = b.task_id
				and    a.task_relate_detail_id = b.task_relate_detail_id
				and    a.task_relate_duty_id  = b.task_relate_duty_id
				order by  role_id, task_id, tdm98_load_id
			loop
		
				R_tdm43 := null;
				
				R_tdm43.tdm43_manl_id        :=  f_create_seq() ; -- 책무매뉴얼 점검항목ID(PK)
				-- R_tdm43.tdm43_manl_org_id    :=   ; -- 부서 책무매뉴얼ID(tdm42_manl_org_id)
				R_tdm43.tdm43_company_id     :=  w_company_id ; -- 회사ID
				--R_tdm43.tdm43_org_id         :=   ; -- 조직ID
				--R_tdm43.tdm43_exct_id        :=    ; -- 임원ID(emp01_person_id)
				R_tdm43.tdm43_role_id        :=  r1.role_id  ; -- 직책ID(tdm20_role_id)
				R_tdm43.tdm43_role_nm        :=  r1.role_nm  ; -- 직책명(tdm20_role_nm)
				R_tdm43.tdm43_task_id        :=  r1.task_id ; -- 책무ID(tdm10_task_id)
				R_tdm43.tdm43_task_nm        :=  r1.task_nm ; -- 책무명(tdm10_task_nm)
				R_tdm43.tdm43_task_relate_detail_id  := r1.task_relate_detail_id  ; -- 책무세부ID(tdm12_task_relate_detail_id)
				R_tdm43.tdm43_task_relate_detail_nm  := r1.task_relate_detail_nm  ; -- 책무세부명(tdm12_content)
				R_tdm43.tdm43_task_relate_duty_id    := r1.task_relate_duty_id  ; -- 관리의무ID(tdm13_task_relate_duty_id)
				R_tdm43.tdm43_task_relate_duty_nm    := r1.task_relate_duty_nm  ; -- 관리의무명(tdm13_content)
				R_tdm43.tdm43_check_item             := r1.check_item; -- 점검항목명
				R_tdm43.tdm43_check_cycle_cd         := '03'; -- 점검주기코드(CycleCode004-03:월/04:분기/05:반기/06:연/98:특정월)
				R_tdm43.tdm43_check_month            := '111111111111'; -- 점검월( 1:점검월 해당, 0 : 해당없음) 
				R_tdm43.tdm43_check_evid_type        := '10'; -- 증빙구분코드(TdmEvidType-10:대외문서/11:사내문서/20:교육수행내역/90:기타(직접입력)/99:미설정)
				R_tdm43.tdm43_check_evid_etc         := null; -- 증빙구분기타
				R_tdm43.tdm43_check_how              := r1.check_how  ; -- 점검방법
				R_tdm43.tdm43_ref_basis              := null  ; -- 관련참고근거
				R_tdm43.tdm43_start_date             := null   ; -- (개별)적용시작일
				--R_tdm43.tdm43_manl_duty_id    :=   ; -- 책무매뉴얼작업 부서지정ID(tdm41_manl_duty_id)
				R_tdm43.tdm43_first_reg_emp_id       :=  null ; -- 최초작성자
				-- R_tdm43.tdm43_manl_cd                :=  null ; -- 책무매뉴얼 점검항목 코드
				R_tdm43.tdm43_upd_nm                 :=  'system' ; -- 등록(변경)자
				R_tdm43.tdm43_upd_date               :=  w_upd_date ; -- 등록(변경)일시
		
				select tdm42_manl_org_id, tdm42_exct_id, tdm42_org_id
				into   strict R_tdm43.tdm43_manl_org_id, R_tdm43.tdm43_exct_id, R_tdm43.tdm43_org_id
				from   tdm42_manl_org
				where  tdm42_company_id = w_company_id
				and    tdm42_role_id    = r1.role_id;

				select tdm41_manl_duty_id into  strict R_tdm43.tdm43_manl_duty_id
				from   tdm41_manl_duty
				where  tdm41_role_id                = r1.role_id
				and    tdm41_task_id                = r1.task_id
				and    tdm41_task_relate_detail_id  = r1.task_relate_detail_id
				and    tdm41_task_relate_duty_id    = r1.task_relate_duty_id;
		
				w_cnt := w_cnt +1;
		
				R_tdm43.tdm43_manl_cd  := to_char(w_upd_date ,'yy') || ltrim( to_char(w_cnt, '00000')  ) ;
		
		
				insert into tdm43_manl values ( R_tdm43.* );
				
			end loop;
		



			for r1 in 
				select '집합투자업무와 관련된 책무(경영)' fr_nm, '집합투자업무와 관련된 운영지원 책무' to_nm  union all
				select '집합투자업무와 관련된 운영지원 책무' fr_nm, '집합투자업무와 관련된 운용지원 책무' to_nm  union all
				select '자금세탁방지업무와 관련된 책무(CEO)' fr_nm, '자금세탁방지 감독업무와 관련된 책무' to_nm  union all
				select '소관 업무·조직의 내부통제등 총괄 관리에 대한 책무 (임원 공통)' fr_nm, '소관 업무·조직의 내부통제등 총괄 관리에 대한 책무' to_nm  
			loop
				update tdm10_task set tdm10_task_nm = r1.to_nm  where  tdm10_task_nm= r1.fr_nm;
				update tdm43_manl set tdm43_task_nm = r1.to_nm  where  tdm43_task_nm= r1.fr_nm;
			end loop;


			----------------------------------------------------------------------------------------------------------

			RAISE NOTICE 'Start 마무리 ';

	

		end;
 
		return 'Y';
	END;
	
	
END;
$function$
```
