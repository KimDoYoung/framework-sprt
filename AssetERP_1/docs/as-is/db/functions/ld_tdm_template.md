# ld_tdm_template

## FUNCTION public.ld_tdm_template(p_company_name character varying)

- 반환: `character varying`
- 줄 수: 368

```sql
CREATE OR REPLACE FUNCTION public.ld_tdm_template(p_company_name character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
    
BEGIN

	CREATE OR REPLACE FUNCTION f_inner_get_id (i_company_id numeric, i_tp character varying, i_key character varying ) RETURNS numeric AS $inner$
	declare
		w_id   numeric default 0;
	 BEGIN

		begin
			select  sys99_long01  into strict w_id
			from    sys99_print
			where   sys99_group_id        = 0
			and     sys99_person_id       = i_company_id
			and     sys99_window_class_nm = 'TDM_SAVED_KEY'  
			and     sys99_string01        = i_tp 
			and     sys99_string02        = i_key ;
		exception 
			when too_many_rows then RAISE NOTICE 'ID too_many_rows :  %, %' , i_tp, i_key;  
			when no_data_found then RAISE NOTICE 'ID no_data_found :  %, %' , i_tp, i_key;  
		end;

		RETURN  w_id;
	END;
	$inner$ language plpgsql;



	CREATE OR REPLACE FUNCTION f_inner_save_id (icompany_id numeric, i_tp character varying, i_key character varying, i_id numeric ) 
	RETURNS text AS $inner$
	declare
		R_sys99      sys99_print%rowtype;
	 BEGIN

		R_sys99 := null;
		R_sys99.sys99_group_id        := 0;
		R_sys99.sys99_person_id       := i_company_id;
		R_sys99.sys99_window_class_nm := 'TDM_SAVED_KEY';
		R_sys99.sys99_string01        := i_tp;
		R_sys99.sys99_string02        := i_key;
		R_sys99.sys99_long01          := i_id;

		select  coalesce( max(sys99_print_id ),0) + 1 into R_sys99.sys99_print_id
		from    sys99_print
		where   sys99_group_id        = R_sys99.sys99_group_id
		and     sys99_window_class_nm = R_sys99.sys99_window_class_nm ;

		insert into sys99_print values ( R_sys99.* ) ;
		
		RETURN  'Y';
	END;
	$inner$ language plpgsql;
	

	CREATE OR REPLACE FUNCTION f_inner_kofia (p_company_name character varying, w_company_id numeric) RETURNS text AS $inner$
	declare
		w_upd_nm    varchar(10)  default 'system';
		R_tdm10   tdm10_task%rowtype;
		R_tdm11   tdm11_task_relate_rule%rowtype;
		R_tdm14   tdm14_task_type%rowtype;
		R_tdm12   tdm12_task_relate_detail%rowtype;
		R_tdm13   tdm13_task_relate_duty%rowtype;
		R_tdm20   tdm20_role%rowtype;
		R_tdm21   tdm21_role_relate_task%rowtype;
		R_tdm30   tdm30_role_allc%rowtype;
		w_cnt  integer default 0;
		w_ret  varchar(100);
 	BEGIN


	
		----------------------------------------------------------------------------------------------------------
	
		delete from tdm12_task_relate_detail
		where tdm12_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = w_company_id) ;
		
		delete from tdm13_task_relate_duty
		where tdm13_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = w_company_id) ;
	
		delete from tdm21_role_relate_task  
		where  tdm21_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = w_company_id);
	
		delete from tdm14_task_type         where tdm14_company_id = w_company_id;
		delete from tdm10_task              where tdm10_company_id = w_company_id;
		delete from tdm20_role              where tdm20_company_id = w_company_id;
		delete from tdm30_role_allc         where tdm30_company_id = w_company_id;
		delete from tdm11_task_relate_rule  where tdm11_company_id = w_company_id;
	
		----------------------------------------------------------------------------------------------------------
	
		delete from sys99_print where sys99_group_id =0  and sys99_person_id = p_company_id;
		
		w_start_date :=  to_date( to_char( now() ,'yyyymmdd') ,'yyyymmdd');
		
		----------------------------------------------------------------------------------------------------------
		
		for r1 in 
			select   split_part(contents, '	', 1)  seq
				, split_part(contents, '	', 2)  task_type_cd	
				, split_part(contents, '	', 3)  task_type_nm	
			from  ifi_recv 
			where file_name = 'task_type.txt'
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
			R_tdm14.tdm14_upd_date      := now()  ; -- 등록(변경)일시
			
			insert into tdm14_task_type values ( R_tdm14.* );
	
			-- RAISE NOTICE 'ID % ', R_tdm14.tdm14_task_type_id ;
			
			w_ret := f_inner_save_id ( 'task_type', r1.task_type_cd, R_tdm14.tdm14_task_type_id);
	
		end loop ;
	
		----------------------------------------------------------------------------------------------------------
		for r1 in
			select   split_part(contents, '	', 1)  seq
				, split_part(contents, '	', 2)  task_cd	
				, split_part(contents, '	', 3)  task_nm	
				, split_part(contents, '	', 4)  task_class_cd
				, case when split_part(contents, '	', 5) ='Y' then 'true' else 'false' end   ceo_yn 
				, case when split_part(contents, '	', 6) ='Y' then 'true' else 'false' end   common_yn 
				, split_part(contents, '	', 7)  task_type_cd 
			from  ifi_recv 
			where file_name = 'task.txt'
			and   length(contents) > 0 
		loop
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
			R_tdm10.tdm10_upd_date      :=  now();  -- 등록(변경)일시
			
			insert into tdm10_task values ( R_tdm10.* );
	
			w_ret := f_inner_save_id ( 'task', r1.task_cd, R_tdm10.tdm10_task_id );
			
		end loop;
	 
	
		----------------------------------------------------------------------------------------------------------
		
		for r1 in 
			select   split_part(contents, '	', 1)  seq
				, split_part(contents, '	', 2)  role_nm	
				, split_part(contents, '	', 3)  role_cd	
				, split_part(contents, '	', 4)  role_desc
				, case 
					when split_part(contents, '	', 2) = '이사회 의장' then 'A'
					when split_part(contents, '	', 2) = '대표이사' then 'C' 
					when split_part(contents, '	', 2) in ('감사','준법감시인') then 'D' 
					when split_part(contents, '	', 2) in ('경영관리본부장','투자운용본부장') then 'E' 
					end role_type
				, case 
					when split_part(contents, '	', 2) in ('경영관리본부장','투자운용본부장') then '대표이사지원' 
					end role_type_etc_nm
			from  ifi_recv 
			where file_name = 'role.txt'
			and   length(contents) > 0 
			and   contents not like 'No%' 
			and   length(split_part(contents, '	', 1)) >0
			order by  case when split_part(contents, '	', 2) = '대표이사' then 1 else 2 end
		loop 
		
			R_tdm20 := null;
			R_tdm20.tdm20_role_id           :=  f_create_seq(); -- 직책정보ID(PK)
			R_tdm20.tdm20_company_id        :=  w_company_id ; -- 회사ID
			R_tdm20.tdm20_role_nm           :=  r1.role_nm ; -- 직책명
			R_tdm20.tdm20_role_type         :=  r1.role_type ; -- 직책그룹코드(TdmRoleType-A:이사회의장/B:이사회지원/C:대표이사/D:대표이사지원/E:기타그룹)
			R_tdm20.tdm20_role_type_etc_nm  :=  r1.role_type_etc_nm ; -- 직책그룹기타코드명(직책그룹코드가 E인 경우만 해당)
	
			
			
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
			R_tdm20.tdm20_upd_date          :=  now() ; -- 등록(변경)일시
			
			insert into tdm20_role values ( R_tdm20.* );
	
			w_ret := f_inner_save_id ( 'role', r1.role_cd, R_tdm20.tdm20_role_id );
			
		end loop;
	 
		----------------------------------------------------------------------------------------------------------
		for r1 in 
			select   split_part(contents, '	', 1)  seq
				, split_part(contents, '	', 2)  task_cd 	
				, split_part(contents, '	', 3)  law_cd	
				, row_number() over (partition by split_part(contents, '	', 2) order by split_part(contents, '	', 1)  ) as  law_seq 
			from  ifi_recv 
			where file_name = 'task_raw.txt'
			and   length(contents) > 0 
			and   contents not like 'No%' 
			and   length(split_part(contents, '	', 1)) >0
		loop
	
			R_tdm11 := null;
			R_tdm11.tdm11_task_relate_rule_id  :=  f_create_seq()  ; -- 책무연결정보-규정(법규/내규)ID(PK)
			R_tdm11.tdm11_task_id       :=  f_inner_get_id ('task', r1.task_cd )  ; -- 책무ID(tdm10_task_id)
			R_tdm11.tdm11_relate_type   :=  '1'  ; -- 규정연결구분(1:법규/2:내규)
			R_tdm11.tdm11_rule_cd       :=  r1.law_cd ; -- 규정코드(법규:TdmLawCode, 내규:bbs15_company_rule_cd)
			R_tdm11.tdm11_seq           :=  r1.law_seq; -- 조회순서
			R_tdm11.tdm11_company_id    :=  w_company_id  ; -- 회사ID
			R_tdm11.tdm11_upd_nm        :=  'system' ; -- 등록(변경)자
			R_tdm11.tdm11_upd_date      :=  now() ; -- 등록(변경)일시
	
			insert into tdm11_task_relate_rule values ( R_tdm11.* );
			
		end loop;
	
	
		----------------------------------------------------------------------------------------------------------
	
		for r1 in
			with lists
			as (
				select   split_part(contents, '	', 1)  seq
					, split_part(contents, '	', 2)  task_cd 	
					, split_part(contents, '	', 3)  task_detail_cd	
					, split_part(contents, '	', 4)  task_duty_cd	
					, split_part(contents, '	', 5)  task_detail_nm	
					, split_part(contents, '	', 6)  task_duty_nm
				from  ifi_recv 
				where file_name = 'task_duty.txt'
				and   length(contents) > 0 
				and   contents not like 'No%' 
				and   length(split_part(contents, '	', 1)) >0
			)
			select  task_cd, task_detail_cd, max(task_detail_nm ) task_detail_nm
				, row_number() over (partition by task_cd  order by max(seq)  ) as  task_detail_seq
			from   lists
			group by task_cd, task_detail_cd
			order by  task_cd, task_detail_cd, max(seq)
	
		loop
		
			R_tdm12 := null;
			
			R_tdm12.tdm12_task_relate_detail_id  :=   f_create_seq()  ; -- 책무연결정보-세부내용ID(PK)
			R_tdm12.tdm12_task_id   :=   f_inner_get_id ('task', r1.task_cd ); -- 책무ID(tdm10_task_id)
			R_tdm12.tdm12_content   :=   r1.task_detail_nm; -- 내용
			R_tdm12.tdm12_seq       :=   r1.task_detail_seq; -- 조회순서
			R_tdm12.tdm12_use_yn    :=   'true' ; -- 사용여부
			R_tdm12.tdm12_upd_nm    :=   'system'; -- 등록(변경)자
			R_tdm12.tdm12_upd_date  :=   now(); -- 등록(변경)일시
	
			insert into tdm12_task_relate_detail values ( R_tdm12.* );
	
			w_ret := f_inner_save_id ( 'task_detail', r1.task_detail_cd, R_tdm12.tdm12_task_relate_detail_id );
	
		end loop;
	
		----------------------------------------------------------------------------------------------------------
		for r1 in 
			with lists
			as (
				select   split_part(contents, '	', 1)  seq
					, split_part(contents, '	', 2)  task_cd 	
					, split_part(contents, '	', 3)  task_detail_cd	
					, split_part(contents, '	', 4)  task_duty_cd	
					, split_part(contents, '	', 5)  task_detail_nm	
					, split_part(contents, '	', 6)  task_duty_nm
				from  ifi_recv 
				where file_name = 'task_duty.txt'
				and   length(contents) > 0 
				and   contents not like 'No%' 
				and   length(split_part(contents, '	', 1)) >0
			)
			select  task_cd, task_detail_cd, task_duty_cd, max(task_duty_nm ) task_duty_nm
					,row_number() over (partition by task_cd, task_detail_cd  order by max(seq)  ) as task_duty_seq 
			from   lists
			group by task_cd, task_detail_cd, task_duty_cd
			order by  task_cd, task_detail_cd, task_duty_cd, max(seq)
		loop
	
			R_tdm13 := null;
			R_tdm13.tdm13_task_relate_duty_id   :=   f_create_seq() ; -- 책무연결정보-관리의무ID(PK)
			R_tdm13.tdm13_task_id               :=   f_inner_get_id ('task', r1.task_cd ); -- 책무ID(tdm10_task_id)
			R_tdm13.tdm13_task_relate_detail_id :=   f_inner_get_id ('task_detail', r1.task_detail_cd ); -- 책무ID(tdm12_task_relate_detail_id)
			R_tdm13.tdm13_content   :=   r1.task_duty_nm; -- 내용
			R_tdm13.tdm13_seq       :=   r1.task_duty_seq; -- 조회순서
			R_tdm13.tdm13_use_yn    :=   'true'; -- 사용여부
			R_tdm13.tdm13_upd_nm    :=   'system'; -- 등록(변경)자
			R_tdm13.tdm13_upd_date  :=   now() ; -- 등록(변경)일시
	
			insert into tdm13_task_relate_duty values ( R_tdm13.* );
			
			w_ret := f_inner_save_id ( 'task_duty', r1.task_duty_cd, R_tdm13.tdm13_task_relate_duty_id );
		end loop;
	
	
	
		----------------------------------------------------------------------------------------------------------
		for r1 in 
			select   split_part(contents, '	', 1)  seq
				, split_part(contents, '	', 2)  role_cd	
				, split_part(contents, '	', 3)  task_cd
			from  ifi_recv 
			where file_name = 'role_task.txt'
			and   length(contents) > 0 
			and   contents not like 'No%' 
			and   length(split_part(contents, '	', 1)) >0
		loop
			R_tdm21 := null;
			R_tdm21.tdm21_role_relate_task_id  :=  f_create_seq()   ; -- 직책연결정보-책무ID(PK)
			R_tdm21.tdm21_role_id              :=  f_inner_get_id ('role', r1.role_cd ) ; -- 직책ID(tdm20_role_id)
			R_tdm21.tdm21_task_id              :=  f_inner_get_id ('task', r1.task_cd ) ; -- 책무ID(tdm10_task_id)
	
			insert into tdm21_role_relate_task values ( R_tdm21.* );
		end loop;
	
	 
		RETURN  'Y';

	END;
	$inner$ language plpgsql;

	

	declare
		w_company_id sys01_company.sys01_company_id%type;
	begin

		select sys01_company_id
		into   w_company_id
		from   sys01_company
		where  sys01_loc_nm = p_company_name;

        IF NOT FOUND THEN
            RAISE NOTICE 'Company not foud in sys01_company  ' ;
            RETURN 'N';
        END IF;		


		return 'Y';
	END;
	
END;
$function$
```
