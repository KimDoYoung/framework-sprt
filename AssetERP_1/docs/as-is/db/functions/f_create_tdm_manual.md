# f_create_tdm_manual

## FUNCTION public.f_create_tdm_manual(p_job_tp character varying, p_company_id numeric, p_manl_job_id numeric)

- 반환: `character varying`
- 줄 수: 568

```sql
CREATE OR REPLACE FUNCTION public.f_create_tdm_manual(p_job_tp character varying, p_company_id numeric, p_manl_job_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$

declare
	/*
		REDEFINE_BY_ROLE    -- 점검매뉴얼 재생성 ( 책무, 임원 재정의 후 생성 ) 
		REMAKE_FROM_LATEST   -- 최근 매뉴얼로 작성 
	*/

 	w_company_id   numeric  ;
	w_task_id      tdm10_task.tdm10_task_id%type  ;
	w_role_id      tdm20_role.tdm20_role_id%type  ;

	w_start_date  date;
	w_exct_id     numeric  ;   -- 임원 Person ID
	w_manl_job_id   numeric  ;
	w_role_nm       tdm20_role.tdm20_role_nm%type;

	w_recent_role_id         numeric ;
	w_recent_manl_job_id     numeric ;

	R_tdm40_manl_job          tdm40_manl_job%rowtype; 
	R_tdm41_manl_duty         tdm41_manl_duty%rowtype;
	R_tdm44_manl_duty_org     tdm44_manl_duty_org%rowtype;
	R_tdm42_manl_org          tdm42_manl_org%rowtype;
	R_tdm43_manl              tdm43_manl%rowtype;

/*
	w_fr_role_id   tdm20_role.tdm20_role_id%type  ;
	w_to_role_id   tdm20_role.tdm20_role_id%type  ;
	w_to_role_nm   tdm20_role.tdm20_role_nm%type  ;
	w_detail_id    tdm12_task_relate_detail.tdm12_task_relate_detail_id%type  ;
	
	w_fr_org_id    numeric;  -- 지원부서 
	w_to_org_id    numeric;

	w_fr_exct_id    numeric;  -- 임원
	w_to_exct_id    numeric;

	w_tmp_date      tdm30_role_allc.tdm30_start_date%type;

	w_fr_tdm42_manl_org_id   tdm42_manl_org.tdm42_manl_org_id%type; 
	w_to_tdm42_manl_org_id   tdm42_manl_org.tdm42_manl_org_id%type; 

	R_sys01      sys01_company%rowtype;
*/
	r1      record;
	r2      record;
	r3      record;
	w_cnt  integer default 0;
	w_ret  varchar(100) ;
BEGIN

 	w_company_id   := p_company_id;
	w_manl_job_id  := p_manl_job_id;

	begin
		select 'Y' into strict  w_ret from sys01_company where sys01_company_id = w_company_id ;
	exception when no_data_found then
		raise 'Error 회사 Not found in  sys01_company ';
	end;


	------------------------------------------------------------------------------------------------ 
	if p_job_tp = 'REDEFINE_BY_ROLE'  then



			begin
				select tdm40_role_id, tdm40_allc_std_date
				into   strict  w_role_id, w_start_date
				from   tdm40_manl_job  
				where  tdm40_manl_job_id = w_manl_job_id;
			exception when no_data_found then
				raise 'No Data in tdm30_role_allc %, %', p_company_id, w_manl_job_id ;
			end;

			begin
				select tdm20_role_nm into strict w_role_nm
				from   tdm20_role 
				where  tdm20_company_id = p_company_id  and tdm20_role_id = w_role_id;
			exception when no_data_found then
				raise 'No Data in tdm20_role %, %', p_company_id, w_role_id ;
			end;

		raise notice 'w_role_id w_role_nm  %, %', w_role_id , w_role_nm;


			begin
				select tdm30_person_id  into strict w_exct_id
				from   tdm30_role_allc
				join   tdm34_role_allc_detail on  tdm34_role_allc_id = tdm30_role_allc_id
				where  tdm30_role_id =  w_role_id 
				and    tdm34_role_allc_date = w_start_date;
			exception when no_data_found then
				raise 'No Data in tdm30_role_allc %, %, %', p_company_id, w_role_id, to_char(w_start_date,'yyyy-mm-dd');
			end;



			delete from tdm45_manl_relate_ics  where tdm45_manl_id   in (
				select  tdm43_manl_id 
				from    tdm43_manl  
				join    tdm41_manl_duty on tdm41_manl_duty_id = tdm43_manl_duty_id
				where tdm41_manl_job_id = w_manl_job_id );
			delete from tdm47_manl_relate_dcr  where tdm47_manl_id   in (
				select  tdm43_manl_id 
				from    tdm43_manl  
				join    tdm41_manl_duty on tdm41_manl_duty_id = tdm43_manl_duty_id
				where tdm41_manl_job_id = w_manl_job_id );
			delete from sys11_relate_file      where sys11_parent_id in (
				select  tdm43_manl_id 
				from    tdm43_manl  
				join    tdm41_manl_duty on tdm41_manl_duty_id = tdm43_manl_duty_id
				where tdm41_manl_job_id = w_manl_job_id );
		
			delete from tdm44_manl_duty_org  where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where tdm41_manl_job_id = w_manl_job_id);
			delete from tdm43_manl           where tdm43_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where tdm41_manl_job_id = w_manl_job_id);
			delete from tdm41_manl_duty      where tdm41_manl_job_id = w_manl_job_id;
			delete from tdm42_manl_org       where tdm42_manl_job_id = w_manl_job_id;


			----------------------------------------------------------------------
			for r1 in (
				select tdm21_task_id task_id, tdm10_common_yn
				from   tdm21_role_relate_task 
				join   tdm10_task on tdm10_task_id = tdm21_task_id
				where  tdm21_role_id = w_role_id

			) loop
				-- 최근의 Role을 찾는다 
				-- 초근에는 다른 Role이었을 수 있다
				-- 직책에 새로운 책무가 연결되었으면,  최근에  그 책무의직책을 찾는다 
				
				if r1.tdm10_common_yn ='true' then
					-- 공통업무는 최근 Role을 찾지 않는다 
					w_recent_role_id := w_role_id;
				else
					begin
						select tdm43_role_id into strict w_recent_role_id
						from
						(
							select tdm43_role_id, row_number() over (order by tdm43_manl_id desc) seq
							from   tdm43_manl 
							where  tdm43_task_id = r1.task_id
						) t 
						where seq = 1;
					exception when no_data_found then
						raise 'No Data in tdm43_manl % ', r1.task_id ;
					end;
				end if;
		
		
				-- 최근의 tdm41_manl_job_id 
				begin
					select tdm41_manl_job_id  into strict w_recent_manl_job_id
					from
					(
						select tdm41_manl_job_id , row_number() over (order by tdm41_manl_job_id desc)  seq
						from   tdm41_manl_duty
						where  tdm41_role_id = w_recent_role_id and tdm41_task_id = r1.task_id 
						group by tdm41_manl_job_id
					) t
					where seq = 1;
				exception when no_data_found then
					raise 'Fail to Get manl_job_id % % ', w_recent_role_id, r1.task_id ;
				end;
		
		-- raise notice ' r1.task_id  w_recent_role_id  w_recent_manl_job_id % % % ',  r1.task_id , w_recent_role_id,  w_recent_manl_job_id ;

				------------------------------------------------------------------------------
				for r2 in 
					select *
					from   tdm41_manl_duty
					where  1=1
					and    tdm41_manl_job_id = w_recent_manl_job_id and tdm41_role_id = w_recent_role_id and tdm41_task_id = r1.task_id
				loop
					R_tdm41_manl_duty := r2;
					R_tdm41_manl_duty.tdm41_manl_duty_id := f_create_seq() ;
					R_tdm41_manl_duty.tdm41_manl_job_id  := w_manl_job_id  ;
					R_tdm41_manl_duty.tdm41_role_id      := w_role_id  ;
		
					insert into tdm41_manl_duty values ( R_tdm41_manl_duty.* );
		
					for r3 in
						select * from tdm44_manl_duty_org where tdm44_manl_duty_id = r2.tdm41_manl_duty_id
					loop
						R_tdm44_manl_duty_org := r3;
						R_tdm44_manl_duty_org.tdm44_manl_duty_org_id := f_create_seq();
						R_tdm44_manl_duty_org.tdm44_manl_duty_id     := R_tdm41_manl_duty.tdm41_manl_duty_id;

						R_tdm44_manl_duty_org.tdm44_end_yn    := 'false' ;
						R_tdm44_manl_duty_org.tdm44_end_date  := null;
						
						insert into tdm44_manl_duty_org values ( R_tdm44_manl_duty_org.* );
					end loop;
				end loop;
		
		
		
				update tdm42_manl_org set tdm42_end_date =  w_start_date -1
				where  tdm42_manl_job_id = w_recent_manl_job_id
				and    tdm42_role_id     = w_role_id;
		
		
		
				------------------------------------------------------------------------------
				for r2 in 
					select * from tdm43_manl where tdm43_role_id = w_recent_role_id and tdm43_task_id = r1.task_id
				loop
					R_tdm43_manl        := r2;
					R_tdm43_manl.tdm43_role_id    := w_role_id;
					R_tdm43_manl.tdm43_role_nm    := w_role_nm;
					R_tdm43_manl.tdm43_manl_id    := f_create_seq();
					R_tdm43_manl.tdm43_exct_id    := w_exct_id;

 
		
					begin
						select tdm42_manl_org_id into strict R_tdm43_manl.tdm43_manl_org_id
						from   tdm42_manl_org
						where  tdm42_manl_job_id = w_manl_job_id 
						and    tdm42_role_id     = w_role_id
						and    tdm42_org_id      = R_tdm43_manl.tdm43_org_id
						and    tdm42_exct_id     = R_tdm43_manl.tdm43_exct_id;
					exception when no_data_found then
						R_tdm42_manl_org                    := null;
						R_tdm42_manl_org.tdm42_manl_org_id  := f_create_seq();
						R_tdm42_manl_org.tdm42_company_id   := p_company_id ;
						R_tdm42_manl_org.tdm42_org_id       := R_tdm43_manl.tdm43_org_id ;
						R_tdm42_manl_org.tdm42_manl_job_id  := w_manl_job_id ;
						R_tdm42_manl_org.tdm42_role_id      := w_role_id;
						R_tdm42_manl_org.tdm42_exct_id      := w_exct_id ;
						R_tdm42_manl_org.tdm42_start_date   := w_start_date; 
						R_tdm42_manl_org.tdm42_appr_id      := null;
						
						insert into tdm42_manl_org values ( R_tdm42_manl_org.* );
		
						R_tdm43_manl.tdm43_manl_org_id := R_tdm42_manl_org.tdm42_manl_org_id ;
					end;
			
			
					select tdm41_manl_duty_id into strict R_tdm43_manl.tdm43_manl_duty_id
					from   tdm41_manl_duty
					where  tdm41_manl_job_id           = w_manl_job_id
					and    tdm41_role_id               = w_role_id
					and    tdm41_task_id               = r2.tdm43_task_id
					and    tdm41_task_relate_detail_id = r2.tdm43_task_relate_detail_id
					and    tdm41_task_relate_duty_id   = r2.tdm43_task_relate_duty_id;

					-- Manual Code
					begin
						select 'Y' into strict w_ret
						from   tdm43_manl
						where  tdm43_manl_org_id = R_tdm43_manl.tdm43_manl_org_id  and tdm43_manl_cd = R_tdm43_manl.tdm43_manl_cd;
					exception 	
					when no_data_found then  w_ret := 'N';
					end;

					if w_ret ='Y' then
							select to_char( to_number( max(tdm43_manl_cd),'9999999') +1,'9999999')
							into   R_tdm43_manl.tdm43_manl_cd
							from   tdm43_manl 
							--where  tdm43_manl_org_id = R_tdm43_manl.tdm43_manl_org_id;
							where  tdm43_company_id = p_company_id;	

							raise notice ' tdm43_manl_cd Re-New %', R_tdm43_manl.tdm43_manl_cd;
					end if;


					
					insert into tdm43_manl values ( R_tdm43_manl.* );
			
			
					--  연관법규
					insert into  tdm45_manl_relate_ics (tdm45_manl_relate_ics_id, tdm45_manl_id, tdm45_ics_class_tree_id)
					select  f_create_seq(), R_tdm43_manl.tdm43_manl_id, tdm45_ics_class_tree_id
					from    tdm45_manl_relate_ics a
					where   tdm45_manl_id = r2.tdm43_manl_id;
					
					--연관문서분류
					insert into tdm47_manl_relate_dcr (tdm47_manl_relate_dcr_id, tdm47_manl_id, tdm47_dcr_class_tree_id)
					select f_create_seq(), R_tdm43_manl.tdm43_manl_id, tdm47_dcr_class_tree_id 
					from   tdm47_manl_relate_dcr 
					where  tdm47_manl_id = r2.tdm43_manl_id;
			
					--  이행점검 연관양식 등록
					insert into sys11_relate_file (sys11_relate_file_id, sys11_file_id, sys11_parent_id, sys11_parent_table)
					select f_create_seq(), sys11_file_id, R_tdm43_manl.tdm43_manl_id, sys11_parent_table
					from   sys11_relate_file
					where  sys11_parent_id  = r2.tdm43_manl_id;
				end loop;
		
			end loop; 
		


			-- TDM35 재작성 
			

			for r1 in
				select tdm34_role_allc_detail_id
				from   tdm30_role_allc
				join   tdm34_role_allc_detail on  tdm34_role_allc_id = tdm30_role_allc_id
				where  tdm30_role_id =  w_role_id 
				and    tdm34_role_allc_date = w_start_date
			loop
				delete from tdm35_role_allc_task   where  tdm35_role_allc_detail_id = r1.tdm34_role_allc_detail_id;
			
				insert into tdm35_role_allc_task
				SELECT f_create_seq()
				     , tdm34_role_allc_detail_id
				     , tdm10_task_id
				     , tdm10_task_nm
				     , tdm12_task_relate_detail_id
				     , tdm12_content
				     , tdm12_seq
				     , tdm13_task_relate_duty_id
				     , tdm13_content
				     , tdm13_seq
				     , current_setting('app.current_user',true)
				     , f_sysdate()
				  FROM tdm34_role_allc_detail
				       INNER JOIN tdm30_role_allc           ON tdm30_role_allc_id = tdm34_role_allc_id
				       INNER JOIN tdm21_role_relate_task    ON tdm21_role_id      = tdm30_role_id
				       INNER JOIN tdm10_task                ON ( tdm10_task_id    = tdm21_task_id                                                               AND
				                                                 tdm34_role_allc_date BETWEEN tdm10_start_date AND COALESCE(tdm10_end_date,'9999-12-31'::date)  )
				       INNER JOIN tdm12_task_relate_detail  ON ( tdm12_task_id                  = tdm10_task_id AND
				                                                 COALESCE(tdm12_use_yn,'false') = 'true'        )
				       INNER JOIN tdm13_task_relate_duty    ON ( tdm13_task_id               = tdm12_task_id                AND
				                                                 tdm13_task_relate_detail_id = tdm12_task_relate_detail_id  AND
				                                                 COALESCE(tdm13_use_yn,'false') = 'true'                    )
				WHERE tdm34_role_allc_detail_id = r1.tdm34_role_allc_detail_id ;
			end loop;
		

 


	------------------------------------------------------------------------------------------------ 
	elsif p_job_tp = 'REMAKE_FROM_LATEST'  then
		-- 최근의  매뉴얼로 만든다 


		begin
			select coalesce(tdm40_role_id,0), tdm40_manl_apply_start_date 
			into   strict  w_role_id, w_start_date
			from   tdm40_manl_job  
			where  tdm40_manl_job_id = w_manl_job_id;
		exception when no_data_found then
			raise 'No Data in tdm40_manl_job %, %', p_company_id, w_manl_job_id ;
		end;

		w_start_date := to_date('2026-09-01','yyyy-mm-dd');

		if w_start_date is null then
			raise 'No tdm40_manl_apply_start_date in tdm40_manl_job %, %', p_company_id, w_manl_job_id ;
		end if;



		raise notice 'w_role_id   %', w_role_id  ;



		delete from tdm45_manl_relate_ics  where tdm45_manl_id   in (
			select  tdm43_manl_id 
			from    tdm43_manl  
			join    tdm41_manl_duty on tdm41_manl_duty_id = tdm43_manl_duty_id
			where tdm41_manl_job_id = w_manl_job_id );
		delete from tdm47_manl_relate_dcr  where tdm47_manl_id   in (
			select  tdm43_manl_id 
			from    tdm43_manl  
			join    tdm41_manl_duty on tdm41_manl_duty_id = tdm43_manl_duty_id
			where tdm41_manl_job_id = w_manl_job_id );
		delete from sys11_relate_file      where sys11_parent_id in (
			select  tdm43_manl_id 
			from    tdm43_manl  
			join    tdm41_manl_duty on tdm41_manl_duty_id = tdm43_manl_duty_id
			where tdm41_manl_job_id = w_manl_job_id );
	
		delete from tdm44_manl_duty_org  where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where tdm41_manl_job_id = w_manl_job_id);
		delete from tdm43_manl           where tdm43_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where tdm41_manl_job_id = w_manl_job_id);
		delete from tdm41_manl_duty      where tdm41_manl_job_id = w_manl_job_id;
		delete from tdm42_manl_org       where tdm42_manl_job_id = w_manl_job_id;


		----------------------------------------------------------------------
		for r1 in (
			select tdm43_role_id  role_id,   tdm43_task_id task_id
			from   tdm43_manl
			join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
			JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
			where  tdm43_company_id = p_company_id
			and    tdm43_role_id = case when w_role_id = 0 then  tdm43_role_id else w_role_id end
			and    coalesce( tdm42_end_date, f_today() +1)  >= w_start_date -1 
			and    coalesce( tdm42_start_date, f_today() -1 )  < w_start_date -1
			group by tdm43_role_id, tdm43_task_id
		) loop
	
	
			-- 최근의 tdm41_manl_job_id 
			begin
				select tdm41_manl_job_id  into strict w_recent_manl_job_id
				from
				(
					select tdm41_manl_job_id , row_number() over (order by tdm41_manl_job_id desc)  seq
					from   tdm41_manl_duty
					where  tdm41_role_id = r1.role_id and tdm41_task_id = r1.task_id 
					group by tdm41_manl_job_id
				) t
				where seq = 1;
			exception when no_data_found then
				raise 'Fail to Get manl_job_id % % ', r1.role_id, r1.task_id ;
			end;
	
			raise notice ' r1.task_id  w_recent_role_id  w_recent_manl_job_id % % % ',  r1.task_id , r1.role_id,  w_recent_manl_job_id ;

			------------------------------------------------------------------------------
			for r2 in 
				select *
				from   tdm41_manl_duty
				where  1=1
				and    tdm41_manl_job_id = w_recent_manl_job_id and tdm41_role_id = r1.role_id and tdm41_task_id = r1.task_id
			loop
				R_tdm41_manl_duty := r2;
				R_tdm41_manl_duty.tdm41_manl_duty_id := f_create_seq() ;
				R_tdm41_manl_duty.tdm41_manl_job_id  := w_manl_job_id  ;
				R_tdm41_manl_duty.tdm41_role_id      := r1.role_id  ;
	
				insert into tdm41_manl_duty values ( R_tdm41_manl_duty.* );
	
				for r3 in
					select * from tdm44_manl_duty_org where tdm44_manl_duty_id = r2.tdm41_manl_duty_id
				loop
					R_tdm44_manl_duty_org := r3;
					R_tdm44_manl_duty_org.tdm44_manl_duty_org_id := f_create_seq();
					R_tdm44_manl_duty_org.tdm44_manl_duty_id     := R_tdm41_manl_duty.tdm41_manl_duty_id;

					R_tdm44_manl_duty_org.tdm44_end_yn    := 'false' ;
					R_tdm44_manl_duty_org.tdm44_end_date  := null;
					
					insert into tdm44_manl_duty_org values ( R_tdm44_manl_duty_org.* );
				end loop;
			end loop;
	
	
			update tdm42_manl_org set tdm42_end_date =  w_start_date -1
			where  tdm42_manl_job_id = w_recent_manl_job_id
			and    tdm42_role_id     = r1.role_id;
	
	
	
			------------------------------------------------------------------------------
			for r2 in 
				select tdm43_manl.* 
				from   tdm43_manl 
				join   tdm42_manl_org  on tdm42_manl_org_id = tdm43_manl_org_id
				JOIN   tdm44_manl_duty_org  ON tdm44_manl_duty_id = tdm43_manl_duty_id and  tdm44_org_id = tdm43_org_id	
				where tdm43_role_id = r1.role_id and tdm43_task_id = r1.task_id
				and    coalesce( tdm42_end_date, f_today() +1)  >= w_start_date -1 
				and    coalesce( tdm42_start_date, f_today() -1 )  < w_start_date -1

			loop
				R_tdm43_manl        := r2;
				--R_tdm43_manl.tdm43_role_id    := w_role_id;
				--R_tdm43_manl.tdm43_role_nm    := w_role_nm;
				R_tdm43_manl.tdm43_manl_id    := f_create_seq();
				-- R_tdm43_manl.tdm43_exct_id    := w_exct_id;

	
				begin
					select tdm42_manl_org_id into strict R_tdm43_manl.tdm43_manl_org_id
					from   tdm42_manl_org
					where  tdm42_manl_job_id = w_manl_job_id 
					and    tdm42_role_id     = R_tdm43_manl.tdm43_role_id
					and    tdm42_org_id      = R_tdm43_manl.tdm43_org_id
					and    tdm42_exct_id     = R_tdm43_manl.tdm43_exct_id;
				exception when no_data_found then
					R_tdm42_manl_org                    := null;
					R_tdm42_manl_org.tdm42_manl_org_id  := f_create_seq();
					R_tdm42_manl_org.tdm42_company_id   := p_company_id ;
					R_tdm42_manl_org.tdm42_org_id       := R_tdm43_manl.tdm43_org_id ;
					R_tdm42_manl_org.tdm42_manl_job_id  := w_manl_job_id ;
					R_tdm42_manl_org.tdm42_role_id      := R_tdm43_manl.tdm43_role_id;
					R_tdm42_manl_org.tdm42_exct_id      := R_tdm43_manl.tdm43_exct_id ;
					R_tdm42_manl_org.tdm42_start_date   := w_start_date; 
					R_tdm42_manl_org.tdm42_appr_id      := null;
					
					insert into tdm42_manl_org values ( R_tdm42_manl_org.* );
	
					R_tdm43_manl.tdm43_manl_org_id := R_tdm42_manl_org.tdm42_manl_org_id ;
				end;
		
		
				select tdm41_manl_duty_id into strict R_tdm43_manl.tdm43_manl_duty_id
				from   tdm41_manl_duty
				where  tdm41_manl_job_id           = w_manl_job_id
				and    tdm41_role_id               = r2.tdm43_role_id
				and    tdm41_task_id               = r2.tdm43_task_id
				and    tdm41_task_relate_detail_id = r2.tdm43_task_relate_detail_id
				and    tdm41_task_relate_duty_id   = r2.tdm43_task_relate_duty_id;

				-- Manual Code
				begin
					select 'Y' into strict w_ret
					from   tdm43_manl
					where  tdm43_manl_org_id = R_tdm43_manl.tdm43_manl_org_id  and tdm43_manl_cd = R_tdm43_manl.tdm43_manl_cd;
				exception 	
				when no_data_found then  w_ret := 'N';
				end;

				if w_ret ='Y' then
						select to_char( to_number( max(tdm43_manl_cd),'9999999') +1,'9999999')
						into   R_tdm43_manl.tdm43_manl_cd
						from   tdm43_manl 
						where  tdm43_company_id = p_company_id;	

						raise notice ' tdm43_manl_cd Re-New %', R_tdm43_manl.tdm43_manl_cd;
				end if;


				
				insert into tdm43_manl values ( R_tdm43_manl.* );
		
		
				--  연관법규
				insert into  tdm45_manl_relate_ics (tdm45_manl_relate_ics_id, tdm45_manl_id, tdm45_ics_class_tree_id)
				select  f_create_seq(), R_tdm43_manl.tdm43_manl_id, tdm45_ics_class_tree_id
				from    tdm45_manl_relate_ics a
				where   tdm45_manl_id = r2.tdm43_manl_id;
				
				--연관문서분류
				insert into tdm47_manl_relate_dcr (tdm47_manl_relate_dcr_id, tdm47_manl_id, tdm47_dcr_class_tree_id)
				select f_create_seq(), R_tdm43_manl.tdm43_manl_id, tdm47_dcr_class_tree_id 
				from   tdm47_manl_relate_dcr 
				where  tdm47_manl_id = r2.tdm43_manl_id;
		
				--  이행점검 연관양식 등록
				insert into sys11_relate_file (sys11_relate_file_id, sys11_file_id, sys11_parent_id, sys11_parent_table)
				select f_create_seq(), sys11_file_id, R_tdm43_manl.tdm43_manl_id, sys11_parent_table
				from   sys11_relate_file
				where  sys11_parent_id  = r2.tdm43_manl_id;
			end loop;


		end loop;


		-- TDM35 변경사항이 없으 므로 재작성 하지 않는다   
		

	------------------------------------------------------------------------------------------------ 
	else
		raise 'JOB Not defines % ', p_job_tp;
	
	end if;



	return 'Y';

END;
$function$
```
