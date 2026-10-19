# ld_tdm_copy

## FUNCTION public.ld_tdm_copy(p_job_tp character varying, p_company_id numeric, p_task_id numeric, p_role_id numeric)

- 반환: `character varying`
- 줄 수: 1561

```sql
CREATE OR REPLACE FUNCTION public.ld_tdm_copy(p_job_tp character varying, p_company_id numeric, p_task_id numeric, p_role_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$


/*

	delete_tdm
	delete_sys01 


	copy_sys01_from_acs
	copy_tdm_from_acs_130
	copy_tdm_from_acs_248


	copy_tdm_from_acd

*/


declare
	w_str  varchar(200);
    
BEGIN

	if p_job_tp = 'delete_tdm' then

		-- 

		delete from tdm98_load  where tdm98_company_id = p_company_id;

		delete from tdm01_hr   where tdm01_company_id = p_company_id ;
		
		delete from tdm11_task_relate_rule  where tdm11_company_id = p_company_id and tdm11_relate_type ='1';

		delete from tdm12_task_relate_detail
		where tdm12_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = p_company_id) ;
		
		delete from tdm13_task_relate_duty
		where tdm13_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = p_company_id) ;

		delete from tdm14_task_type         where tdm14_company_id = p_company_id;

		delete from tdm10_task              where tdm10_company_id = p_company_id;


		delete from tdm21_role_relate_task
		where  tdm21_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = p_company_id);
		
		delete from tdm23_role_relate_org
		where  tdm23_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = p_company_id);

		delete from tdm20_role              where tdm20_company_id = p_company_id;

		delete from tdm34_role_allc_detail
		where  tdm34_role_allc_id  in (select  tdm30_role_allc_id from tdm30_role_allc where tdm30_company_id = p_company_id);
		delete from tdm30_role_allc         where tdm30_company_id = p_company_id;
		
		delete from tdm44_manl_duty_org   where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where  tdm41_company_id = p_company_id);
		delete from tdm40_manl_job   where tdm40_company_id = p_company_id;
		delete from tdm41_manl_duty  where tdm41_company_id = p_company_id;
		delete from tdm42_manl_org   where tdm42_company_id = p_company_id;
		delete from tdm43_manl       where tdm43_company_id = p_company_id;


	-----------------------------------------------------------------------------
	elsif p_job_tp = 'delete_sys01' then

		delete from sys01_company  where  sys01_company_id = p_company_id ;

	---------------------------------------------------------------------------------------------
	elsif p_job_tp = 'copy_tdm_from_acd' then

		if p_task_id = 0 then 
			raise '책무 ID 지정하세요 ';
		end if;

		if p_role_id = 0 then 
			raise '직책 ID를 지정하세요 ';
		end if;

		begin
			select tdm10_task_nm into strict  w_str from tdm10_task where tdm10_company_id = p_company_id and  tdm10_task_id = p_task_id;

			raise '책무가 이미 있습니다, 삭제후 Copy하세요 %', 	w_str;
		exception when no_data_found then
			null;
		end;

		begin
			select tdm20_role_nm into strict  w_str from tdm20_role where tdm20_company_id = p_company_id and  tdm20_role_id = p_role_id;
		exception when no_data_found then
			raise 'LocalDB에 직책ID는 존재하지 않습니다 %', 	p_role_id;
		end;


		insert into tdm10_task
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm10_task_id
				, tdm10_company_id
				, tdm10_task_class_cd
				, tdm10_task_type_cd
				, tdm10_task_nm
				, tdm10_common_yn
				, tdm10_ceo_yn
				, tdm10_start_date
				, tdm10_end_date
				, tdm10_upd_nm
			, tdm10_upd_date
			from  tdm10_task 
		'
		)
		as sys01 (
			tdm10_task_id numeric
			, tdm10_company_id numeric
			, tdm10_task_class_cd character varying
			, tdm10_task_type_cd character varying
			, tdm10_task_nm text
			, tdm10_common_yn character varying
			, tdm10_ceo_yn character varying
			, tdm10_start_date date
			, tdm10_end_date date
			, tdm10_upd_nm character varying
			, tdm10_upd_date timestamp without time zone
		)
		where  tdm10_company_id = p_company_id  and  tdm10_task_id = p_task_id;
		
		insert into tdm11_task_relate_rule
		select *
		from dblink('host=host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm11_task_relate_rule_id
				, tdm11_task_id
				, tdm11_relate_type
				, tdm11_rule_cd
				, tdm11_seq
				, tdm11_company_id
				, tdm11_upd_nm
				, tdm11_upd_date
			from tdm11_task_relate_rule
			'
		) as tdm11 (
			tdm11_task_relate_rule_id numeric
			, tdm11_task_id numeric
			, tdm11_relate_type character varying
			, tdm11_rule_cd character varying
			, tdm11_seq numeric
			, tdm11_company_id numeric
			, tdm11_upd_nm character varying
			, tdm11_upd_date timestamp without time zone
		)
	 	where tdm11_company_id = p_company_id and tdm11_task_id = p_task_id
		and   tdm11_relate_type ='1'; 

	
		insert into tdm12_task_relate_detail
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm12_task_relate_detail_id
				, tdm12_task_id
				, tdm12_content
				, tdm12_seq
				, tdm12_use_yn
				, tdm12_upd_nm
				, tdm12_upd_date
			from tdm12_task_relate_detail
			'
		) as tdm12 (
			tdm12_task_relate_detail_id numeric
			, tdm12_task_id numeric
			, tdm12_content text
			, tdm12_seq numeric
			, tdm12_use_yn character varying
			, tdm12_upd_nm character varying
			, tdm12_upd_date timestamp without time zone
		)
	 	where tdm12_task_id = p_task_id ;


		insert into tdm13_task_relate_duty
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm13_task_relate_duty_id
				, tdm13_task_id
				, tdm13_task_relate_detail_id
				, tdm13_content
				, tdm13_seq
				, tdm13_use_yn
				, tdm13_upd_nm
				, tdm13_upd_date
			from tdm13_task_relate_duty
			'
		) as tdm13 (
			tdm13_task_relate_duty_id numeric
			, tdm13_task_id numeric
			, tdm13_task_relate_detail_id numeric
			, tdm13_content text
			, tdm13_seq numeric
			, tdm13_use_yn character varying
			, tdm13_upd_nm character varying
			, tdm13_upd_date timestamp without time zone		
		)
	 	where tdm13_task_id = p_task_id;

		insert into tdm14_task_type
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm14_task_type_id
				, tdm14_company_id
				, tdm14_task_type_cd
				, tdm14_task_type_nm
				, tdm14_system_cd
				, tdm14_use_yn
				, tdm14_upd_nm
				, tdm14_upd_date
			from tdm14_task_type
			'
		) as tdm14 (
			tdm14_task_type_id numeric
			, tdm14_company_id numeric
			, tdm14_task_type_cd character varying
			, tdm14_task_type_nm character varying
			, tdm14_system_cd character varying
			, tdm14_use_yn character varying
			, tdm14_upd_nm character varying
			, tdm14_upd_date timestamp without time zone
		)
	 	where tdm14_company_id = p_company_id 
		and   tdm14_task_type_cd not in (select tdm14_task_type_cd from  tdm14_task_type);
		


		insert into tdm21_role_relate_task
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm21_role_relate_task_id
				, tdm21_role_id
				, tdm21_task_id
			from tdm21_role_relate_task
			'
		) as tdm21 (
			tdm21_role_relate_task_id numeric
			, tdm21_role_id numeric
			, tdm21_task_id numeric
		)
	 	where tdm21_task_id = p_task_id and tdm21_role_id = p_role_id ;


		insert into tdm41_manl_duty
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm41_manl_duty_id
				, tdm41_manl_job_id
				, tdm41_role_id
				, tdm41_task_id
				, tdm41_task_relate_detail_id
				, tdm41_task_relate_duty_id
				, tdm41_upd_nm
				, tdm41_upd_date
				, tdm41_company_id
			from tdm41_manl_duty
			'
		) as tdm41(
			tdm41_manl_duty_id numeric
			, tdm41_manl_job_id numeric
			, tdm41_role_id numeric
			, tdm41_task_id numeric
			, tdm41_task_relate_detail_id numeric
			, tdm41_task_relate_duty_id numeric
			, tdm41_upd_nm character varying
			, tdm41_upd_date timestamp without time zone
			, tdm41_company_id numeric
		)
		where   tdm41_company_id = p_company_id and tdm41_task_id = p_task_id and tdm41_role_id = p_role_id;

		insert into  tdm44_manl_duty_org
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm44_manl_duty_org_id
				, tdm44_manl_duty_id
				, tdm44_org_id
				, tdm44_end_yn
				, tdm44_end_date
				, tdm44_end_emp_id
				, tdm44_upd_nm
				, tdm44_upd_date
			from  tdm44_manl_duty_org
			'
		) as tdm44(
			tdm44_manl_duty_org_id numeric
			, tdm44_manl_duty_id numeric
			, tdm44_org_id numeric
			, tdm44_end_yn character varying
			, tdm44_end_date date
			, tdm44_end_emp_id numeric
			, tdm44_upd_nm character varying
			, tdm44_upd_date timestamp without time zone
		)
		where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where  tdm41_company_id = p_company_id and tdm41_task_id = p_task_id and tdm41_role_id = p_role_id);


		insert into  tdm43_manl
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=idmsdb  user=idmsuser password=idms8100'
			, 'SELECT 
				tdm43_manl_id
				, tdm43_manl_org_id
				, tdm43_company_id
				, tdm43_org_id
				, tdm43_exct_id
				, tdm43_role_id
				, tdm43_role_nm
				, tdm43_task_id
				, tdm43_task_nm
				, tdm43_task_relate_detail_id
				, tdm43_task_relate_detail_nm
				, tdm43_task_relate_duty_id
				, tdm43_task_relate_duty_nm
				, tdm43_check_item
				, tdm43_check_cycle_cd
				, tdm43_check_month
				, tdm43_check_evid_type
				, tdm43_check_evid_etc
				, tdm43_check_how
				, tdm43_ref_basis
				, tdm43_start_date
				, tdm43_manl_duty_id
				, tdm43_first_reg_emp_id
				, tdm43_manl_cd
				, tdm43_upd_nm
				, tdm43_upd_date
				, tdm43_check_evid_doc_nm
				, tdm43_ceo_duty_cd
				, tdm43_exct_duty_cd
				, tdm43_import_level_cd
			from  tdm43_manl
			'
		) as tdm43(
			tdm43_manl_id numeric
			, tdm43_manl_org_id numeric
			, tdm43_company_id numeric
			, tdm43_org_id numeric
			, tdm43_exct_id numeric
			, tdm43_role_id numeric
			, tdm43_role_nm character varying
			, tdm43_task_id numeric
			, tdm43_task_nm text
			, tdm43_task_relate_detail_id numeric
			, tdm43_task_relate_detail_nm text
			, tdm43_task_relate_duty_id numeric
			, tdm43_task_relate_duty_nm text
			, tdm43_check_item text
			, tdm43_check_cycle_cd character varying
			, tdm43_check_month character varying
			, tdm43_check_evid_type character varying
			, tdm43_check_evid_etc character varying
			, tdm43_check_how text
			, tdm43_ref_basis text
			, tdm43_start_date date
			, tdm43_manl_duty_id numeric
			, tdm43_first_reg_emp_id numeric
			, tdm43_manl_cd character varying
			, tdm43_upd_nm character varying
			, tdm43_upd_date timestamp without time zone
			, tdm43_check_evid_doc_nm text
			, tdm43_ceo_duty_cd character varying
			, tdm43_exct_duty_cd character varying
			, tdm43_import_level_cd character varying
		)
		where    tdm43_company_id  = p_company_id and tdm43_task_id = p_task_id and tdm43_role_id = p_role_id;



	elsif p_job_tp = 'copy_sys01_from_acs' then

		begin
			select sys01_company_nm into strict w_str
			from   sys01_company  where  sys01_company_id = p_company_id ;
			raise '회사 aloready exist %', 	w_str;
		exception when no_data_found then
			null;			 
		end;
		
	
		insert into sys01_company
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
			sys01_company_id
			, sys01_company_nm
			, sys01_biz_no
			, sys01_office_tel_no
			, sys01_emgrcy_passwd
			, sys01_office_fax_no
			, sys01_zip_cd
			, sys01_zip_addr
			, sys01_zip_detail
			, sys01_loc_nm
			, sys01_anniv_date
			, sys01_note
			, sys01_mail_info
			, sys01_mobile_tel_no
			, sys01_email_addr
			, sys01_start_date
			, sys01_close_date
			, sys01_use_yn
			, sys01_emp_info
			, sys01_cont_type
			, sys01_main_image_id
			, sys01_cycle_time
			, sys01_leave_yn
			, sys01_leave_month_cd
			, sys01_leave_form_cd
			, sys01_icam_company_cd
			, sys01_ast_manager_auto_yn
			, sys01_appr_step_lock_yn
			, sys01_account_close_month
			, sys01_leave_compulsion_rt
			, sys01_ics_check_cycle_type
			, sys01_tax_type
			, sys01_company_rep_nm
			, sys01_mail_log_yn
			, sys01_ics_comply_cycle_type
			, sys01_dcr_numbering_cd
			, sys01_dcr_detail_use_yn
			, sys01_apr_manager_info_yn
			, sys01_notice_date
			, sys01_owner_capital_apply_cd
			, sys01_ics_guide_yn
			, sys01_asset_yn
			, sys01_advis_yn
			, sys01_pbs_yn
			, sys01_ast_eval_cycle_cd
			, sys01_corp_reg_no
			, sys01_income_tax_filing_cd
			, sys01_icam_advis_company_cd
			, sys01_login_secure_yn
			, sys01_ics_non_stay_yn
			, sys01_emp_eval_cycle_cd
			, sys01_emp_eval_month_cd
			, sys01_card_real_user_yn
			, sys01_erp_product_cd
			, sys01_flt_only_curr_yn
			, sys01_dcr_preconfirm_skip_yn
			, sys01_secondary_auth_yn
			, sys01_leave_confirm_yn
			, sys01_commute_lock_yn
			from  sys01_company 
		'
		)
		as sys01 (
			sys01_company_id numeric
			, sys01_company_nm character varying
			, sys01_biz_no character varying
			, sys01_office_tel_no character varying
			, sys01_emgrcy_passwd character varying
			, sys01_office_fax_no character varying
			, sys01_zip_cd character varying
			, sys01_zip_addr character varying
			, sys01_zip_detail character varying
			, sys01_loc_nm character varying
			, sys01_anniv_date timestamp without time zone
			, sys01_note text
			, sys01_mail_info character varying
			, sys01_mobile_tel_no character varying
			, sys01_email_addr character varying
			, sys01_start_date timestamp without time zone
			, sys01_close_date timestamp without time zone
			, sys01_use_yn character varying
			, sys01_emp_info character varying
			, sys01_cont_type character varying
			, sys01_main_image_id numeric
			, sys01_cycle_time character varying
			, sys01_leave_yn character varying
			, sys01_leave_month_cd character varying
			, sys01_leave_form_cd character varying
			, sys01_icam_company_cd character varying
			, sys01_ast_manager_auto_yn character varying
			, sys01_appr_step_lock_yn character varying
			, sys01_account_close_month character varying
			, sys01_leave_compulsion_rt numeric
			, sys01_ics_check_cycle_type character varying
			, sys01_tax_type character varying
			, sys01_company_rep_nm character varying
			, sys01_mail_log_yn character varying
			, sys01_ics_comply_cycle_type character varying
			, sys01_dcr_numbering_cd character varying
			, sys01_dcr_detail_use_yn character varying
			, sys01_apr_manager_info_yn character varying
			, sys01_notice_date timestamp without time zone
			, sys01_owner_capital_apply_cd character varying
			, sys01_ics_guide_yn character varying
			, sys01_asset_yn character varying
			, sys01_advis_yn character varying
			, sys01_pbs_yn character varying
			, sys01_ast_eval_cycle_cd character varying
			, sys01_corp_reg_no character varying
			, sys01_income_tax_filing_cd character varying
			, sys01_icam_advis_company_cd character varying
			, sys01_login_secure_yn character varying
			, sys01_ics_non_stay_yn character varying
			, sys01_emp_eval_cycle_cd character varying
			, sys01_emp_eval_month_cd character varying
			, sys01_card_real_user_yn character varying
			, sys01_erp_product_cd character varying
			, sys01_flt_only_curr_yn character varying
			, sys01_dcr_preconfirm_skip_yn character varying
			, sys01_secondary_auth_yn character varying
			, sys01_leave_confirm_yn character varying
			, sys01_commute_lock_yn character varying
		)
		where  sys01_company_id = p_company_id;
		

		
	-----------------------------------------------------------------------------
	elsif p_job_tp = 'copy_tdm_from_acs_130' then

		begin
			select 'Y' into strict w_str
			from   tdm10_task  where  tdm10_company_id = p_company_id limit 1 ;

			raise '책무 already exist, 삭제를 먼저하십시오 ';
		exception when no_data_found then
			null;			 
		end;
		



		insert into tdm01_hr
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm01_hr_id
				, tdm01_company_id
				, tdm01_person_id
				, tdm01_person_nm
				, tdm01_person_no
				, tdm01_pos_cd
				, tdm01_title_cd
				, tdm01_hire_date
				, tdm01_retire_date
				, tdm01_end_date
				, tdm01_org_id
				, tdm01_org_nm
				, tdm01_org_head_nm
				, tdm01_upd_nm
				, tdm01_upd_date
			from  tdm01_hr 
		'
		)
		as sys01 (
			tdm01_hr_id numeric
				, tdm01_company_id numeric
				, tdm01_person_id numeric
				, tdm01_person_nm character varying
				, tdm01_person_no character varying
				, tdm01_pos_cd character varying
				, tdm01_title_cd character varying
				, tdm01_hire_date date
				, tdm01_retire_date date
				, tdm01_end_date date
				, tdm01_org_id numeric
				, tdm01_org_nm character varying
				, tdm01_org_head_nm character varying
				, tdm01_upd_nm character varying
				, tdm01_upd_date timestamp without time zone
		)
		where  tdm01_company_id = p_company_id;
		

	
		insert into tdm10_task
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm10_task_id
				, tdm10_company_id
				, tdm10_task_class_cd
				, tdm10_task_type_cd
				, tdm10_task_nm
				, tdm10_common_yn
				, tdm10_ceo_yn
				, tdm10_start_date
				, tdm10_end_date
				, tdm10_upd_nm
			, tdm10_upd_date
			from  tdm10_task 
		'
		)
		as sys01 (
			tdm10_task_id numeric
			, tdm10_company_id numeric
			, tdm10_task_class_cd character varying
			, tdm10_task_type_cd character varying
			, tdm10_task_nm text
			, tdm10_common_yn character varying
			, tdm10_ceo_yn character varying
			, tdm10_start_date date
			, tdm10_end_date date
			, tdm10_upd_nm character varying
			, tdm10_upd_date timestamp without time zone
		)
		where  tdm10_company_id = p_company_id;
		
		insert into tdm11_task_relate_rule
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm11_task_relate_rule_id
				, tdm11_task_id
				, tdm11_relate_type
				, tdm11_rule_cd
				, tdm11_seq
				, tdm11_company_id
				, tdm11_upd_nm
				, tdm11_upd_date
			from tdm11_task_relate_rule
			'
		) as tdm11 (
			tdm11_task_relate_rule_id numeric
			, tdm11_task_id numeric
			, tdm11_relate_type character varying
			, tdm11_rule_cd character varying
			, tdm11_seq numeric
			, tdm11_company_id numeric
			, tdm11_upd_nm character varying
			, tdm11_upd_date timestamp without time zone
		)
	 	where tdm11_company_id = p_company_id
		and   tdm11_relate_type ='1'; 

	
		insert into tdm12_task_relate_detail
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm12_task_relate_detail_id
				, tdm12_task_id
				, tdm12_content
				, tdm12_seq
				, tdm12_use_yn
				, tdm12_upd_nm
				, tdm12_upd_date
			from tdm12_task_relate_detail
			'
		) as tdm12 (
			tdm12_task_relate_detail_id numeric
			, tdm12_task_id numeric
			, tdm12_content text
			, tdm12_seq numeric
			, tdm12_use_yn character varying
			, tdm12_upd_nm character varying
			, tdm12_upd_date timestamp without time zone
		)
	 	where tdm12_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = p_company_id) ;


		insert into tdm13_task_relate_duty
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm13_task_relate_duty_id
				, tdm13_task_id
				, tdm13_task_relate_detail_id
				, tdm13_content
				, tdm13_seq
				, tdm13_use_yn
				, tdm13_upd_nm
				, tdm13_upd_date
			from tdm13_task_relate_duty
			'
		) as tdm13 (
			tdm13_task_relate_duty_id numeric
			, tdm13_task_id numeric
			, tdm13_task_relate_detail_id numeric
			, tdm13_content text
			, tdm13_seq numeric
			, tdm13_use_yn character varying
			, tdm13_upd_nm character varying
			, tdm13_upd_date timestamp without time zone		
		)
	 	where tdm13_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = p_company_id) ;

		insert into tdm14_task_type
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm14_task_type_id
				, tdm14_company_id
				, tdm14_task_type_cd
				, tdm14_task_type_nm
				, tdm14_system_cd
				, tdm14_use_yn
				, tdm14_upd_nm
				, tdm14_upd_date
			from tdm14_task_type
			'
		) as tdm14 (
			tdm14_task_type_id numeric
			, tdm14_company_id numeric
			, tdm14_task_type_cd character varying
			, tdm14_task_type_nm character varying
			, tdm14_system_cd character varying
			, tdm14_use_yn character varying
			, tdm14_upd_nm character varying
			, tdm14_upd_date timestamp without time zone
		)
	 	where tdm14_company_id = p_company_id ;
		

		insert into tdm20_role
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm20_role_id
				, tdm20_company_id
				, tdm20_role_nm
				, tdm20_role_type
				, tdm20_role_type_etc_nm
				, tdm20_overview
				, tdm20_start_date
				, tdm20_end_date
				, tdm20_upd_nm
				, tdm20_upd_date
				, tdm20_ceo_role_id
			from  tdm20_role 
		'
		)
		as tdm20 (
			tdm20_role_id numeric
			, tdm20_company_id numeric
			, tdm20_role_nm character varying
			, tdm20_role_type character varying
			, tdm20_role_type_etc_nm character varying
			, tdm20_overview text
			, tdm20_start_date date
			, tdm20_end_date date
			, tdm20_upd_nm character varying
			, tdm20_upd_date timestamp without time zone
			, tdm20_ceo_role_id numeric
		)
		where  tdm20_company_id = p_company_id;


		insert into tdm21_role_relate_task
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm21_role_relate_task_id
				, tdm21_role_id
				, tdm21_task_id
			from tdm21_role_relate_task
			'
		) as tdm21 (
			tdm21_role_relate_task_id numeric
			, tdm21_role_id numeric
			, tdm21_task_id numeric
		)
	 	where tdm21_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = p_company_id) ;

		insert into tdm23_role_relate_org
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm23_role_relate_org_id
				, tdm23_role_id
				, tdm23_org_id
			from tdm23_role_relate_org
			'
		) as tdm23 (
			tdm23_role_relate_org_id numeric
			, tdm23_role_id numeric
			, tdm23_org_id numeric
		)
	 	where tdm23_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = p_company_id) ;


		insert into tdm30_role_allc
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm30_role_allc_id
				, tdm30_company_id
				, tdm30_role_id
				, tdm30_person_id
				, tdm30_add_title_yn
				, tdm30_start_date
				, tdm30_end_date
				, tdm30_upd_nm
				, tdm30_upd_date
			from tdm30_role_allc
			'
		) as tdm30 (
			tdm30_role_allc_id numeric
			, tdm30_company_id numeric
			, tdm30_role_id numeric
			, tdm30_person_id numeric
			, tdm30_add_title_yn character varying
			, tdm30_start_date date
			, tdm30_end_date date
			, tdm30_upd_nm character varying
			, tdm30_upd_date timestamp without time zone
		)
	 	where tdm30_company_id = p_company_id ;


		insert into tdm34_role_allc_detail
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm34_role_allc_detail_id
				, tdm34_role_allc_id
				, tdm34_role_allc_date
				, tdm34_reg_reason
				, tdm34_deputy_emp_nm
				, tdm34_appr_id
				, tdm34_upd_nm
				, tdm34_upd_date
			from tdm34_role_allc_detail
			'
		) as tdm34 (
			tdm34_role_allc_detail_id numeric
			, tdm34_role_allc_id numeric
			, tdm34_role_allc_date date
			, tdm34_reg_reason text
			, tdm34_deputy_emp_nm character varying
			, tdm34_appr_id numeric
			, tdm34_upd_nm character varying
			, tdm34_upd_date timestamp without time zone
		)
		where  tdm34_role_allc_id  in (select  tdm30_role_allc_id from tdm30_role_allc where tdm30_company_id = p_company_id);


		insert into tdm40_manl_job
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm40_manl_job_id
				, tdm40_company_id
				, tdm40_reg_date
				, tdm40_job_nm
				, tdm40_role_id
				, tdm40_org_id
				, tdm40_job_reason
				, tdm40_start_date
				, tdm40_end_date
				, tdm40_upd_nm
				, tdm40_upd_date
				, tdm40_allc_std_date
			from tdm40_manl_job
			'
		) as tdm40 (
			tdm40_manl_job_id numeric
			, tdm40_company_id numeric
			, tdm40_reg_date date
			, tdm40_job_nm character varying
			, tdm40_role_id numeric
			, tdm40_org_id numeric
			, tdm40_job_reason character varying
			, tdm40_start_date date
			, tdm40_end_date date
			, tdm40_upd_nm character varying
			, tdm40_upd_date timestamp without time zone
			, tdm40_allc_std_date date
		)
		where   tdm40_company_id = p_company_id;

		insert into tdm41_manl_duty
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm41_manl_duty_id
				, tdm41_manl_job_id
				, tdm41_role_id
				, tdm41_task_id
				, tdm41_task_relate_detail_id
				, tdm41_task_relate_duty_id
				, tdm41_upd_nm
				, tdm41_upd_date
				, tdm41_company_id
			from tdm41_manl_duty
			'
		) as tdm41(
			tdm41_manl_duty_id numeric
			, tdm41_manl_job_id numeric
			, tdm41_role_id numeric
			, tdm41_task_id numeric
			, tdm41_task_relate_detail_id numeric
			, tdm41_task_relate_duty_id numeric
			, tdm41_upd_nm character varying
			, tdm41_upd_date timestamp without time zone
			, tdm41_company_id numeric
		)
		where   tdm41_company_id = p_company_id;


		insert into  tdm42_manl_org
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm42_manl_org_id
				, tdm42_company_id
				, tdm42_org_id
				, tdm42_exct_id
				, tdm42_role_id
				, tdm42_lock_yn
				, tdm42_start_date
				, tdm42_end_date
				, tdm42_appr_id
				, tdm42_manl_job_id
				, tdm42_upd_nm
				, tdm42_upd_date
			from  tdm42_manl_org
			'
		) as tdm42(
			tdm42_manl_org_id numeric
			, tdm42_company_id numeric
			, tdm42_org_id numeric
			, tdm42_exct_id numeric
			, tdm42_role_id numeric
			, tdm42_lock_yn character varying
			, tdm42_start_date date
			, tdm42_end_date date
			, tdm42_appr_id numeric
			, tdm42_manl_job_id numeric
			, tdm42_upd_nm character varying
			, tdm42_upd_date timestamp without time zone
		)
		where    tdm42_company_id  = p_company_id;

		insert into  tdm43_manl
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm43_manl_id
				, tdm43_manl_org_id
				, tdm43_company_id
				, tdm43_org_id
				, tdm43_exct_id
				, tdm43_role_id
				, tdm43_role_nm
				, tdm43_task_id
				, tdm43_task_nm
				, tdm43_task_relate_detail_id
				, tdm43_task_relate_detail_nm
				, tdm43_task_relate_duty_id
				, tdm43_task_relate_duty_nm
				, tdm43_check_item
				, tdm43_check_cycle_cd
				, tdm43_check_month
				, tdm43_check_evid_type
				, tdm43_check_evid_etc
				, tdm43_check_how
				, tdm43_ref_basis
				, tdm43_start_date
				, tdm43_manl_duty_id
				, tdm43_first_reg_emp_id
				, tdm43_manl_cd
				, tdm43_upd_nm
				, tdm43_upd_date
				, tdm43_check_evid_doc_nm
				, tdm43_ceo_duty_cd
				, tdm43_exct_duty_cd
				, tdm43_import_level_cd
			from  tdm43_manl
			'
		) as tdm43(
			tdm43_manl_id numeric
			, tdm43_manl_org_id numeric
			, tdm43_company_id numeric
			, tdm43_org_id numeric
			, tdm43_exct_id numeric
			, tdm43_role_id numeric
			, tdm43_role_nm character varying
			, tdm43_task_id numeric
			, tdm43_task_nm text
			, tdm43_task_relate_detail_id numeric
			, tdm43_task_relate_detail_nm text
			, tdm43_task_relate_duty_id numeric
			, tdm43_task_relate_duty_nm text
			, tdm43_check_item text
			, tdm43_check_cycle_cd character varying
			, tdm43_check_month character varying
			, tdm43_check_evid_type character varying
			, tdm43_check_evid_etc character varying
			, tdm43_check_how text
			, tdm43_ref_basis text
			, tdm43_start_date date
			, tdm43_manl_duty_id numeric
			, tdm43_first_reg_emp_id numeric
			, tdm43_manl_cd character varying
			, tdm43_upd_nm character varying
			, tdm43_upd_date timestamp without time zone
			, tdm43_check_evid_doc_nm text
			, tdm43_ceo_duty_cd character varying
			, tdm43_exct_duty_cd character varying
			, tdm43_import_level_cd character varying
		)
		where    tdm43_company_id  = p_company_id;

		insert into  tdm44_manl_duty_org
		select *
		from dblink('host=172.20.200.130  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm44_manl_duty_org_id
				, tdm44_manl_duty_id
				, tdm44_org_id
				, tdm44_end_yn
				, tdm44_end_date
				, tdm44_end_emp_id
				, tdm44_upd_nm
				, tdm44_upd_date
			from  tdm44_manl_duty_org
			'
		) as tdm44(
			tdm44_manl_duty_org_id numeric
			, tdm44_manl_duty_id numeric
			, tdm44_org_id numeric
			, tdm44_end_yn character varying
			, tdm44_end_date date
			, tdm44_end_emp_id numeric
			, tdm44_upd_nm character varying
			, tdm44_upd_date timestamp without time zone
		)
		where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where  tdm41_company_id = p_company_id);




	-----------------------------------------------------------------------------
	elsif p_job_tp = 'copy_tdm_from_acs_248' then

		begin
			select 'Y' into strict w_str
			from   tdm10_task  where  tdm10_company_id = p_company_id limit 1 ;

			raise '책무 already exist, 삭제를 먼저하십시오 ';
		exception when no_data_found then
			null;			 
		end;
		
	
		insert into tdm01_hr
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm01_hr_id
				, tdm01_company_id
				, tdm01_person_id
				, tdm01_person_nm
				, tdm01_person_no
				, tdm01_pos_cd
				, tdm01_title_cd
				, tdm01_hire_date
				, tdm01_retire_date
				, tdm01_end_date
				, tdm01_org_id
				, tdm01_org_nm
				, tdm01_org_head_nm
				, tdm01_upd_nm
				, tdm01_upd_date
			from  tdm01_hr 
		'
		)
		as sys01 (
			tdm01_hr_id numeric
				, tdm01_company_id numeric
				, tdm01_person_id numeric
				, tdm01_person_nm character varying
				, tdm01_person_no character varying
				, tdm01_pos_cd character varying
				, tdm01_title_cd character varying
				, tdm01_hire_date date
				, tdm01_retire_date date
				, tdm01_end_date date
				, tdm01_org_id numeric
				, tdm01_org_nm character varying
				, tdm01_org_head_nm character varying
				, tdm01_upd_nm character varying
				, tdm01_upd_date timestamp without time zone
		)
		where  tdm01_company_id = p_company_id;
		

	
		insert into tdm10_task
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm10_task_id
				, tdm10_company_id
				, tdm10_task_class_cd
				, tdm10_task_type_cd
				, tdm10_task_nm
				, tdm10_common_yn
				, tdm10_ceo_yn
				, tdm10_start_date
				, tdm10_end_date
				, tdm10_upd_nm
			, tdm10_upd_date
			from  tdm10_task 
		'
		)
		as sys01 (
			tdm10_task_id numeric
			, tdm10_company_id numeric
			, tdm10_task_class_cd character varying
			, tdm10_task_type_cd character varying
			, tdm10_task_nm text
			, tdm10_common_yn character varying
			, tdm10_ceo_yn character varying
			, tdm10_start_date date
			, tdm10_end_date date
			, tdm10_upd_nm character varying
			, tdm10_upd_date timestamp without time zone
		)
		where  tdm10_company_id = p_company_id;
		
		insert into tdm11_task_relate_rule
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm11_task_relate_rule_id
				, tdm11_task_id
				, tdm11_relate_type
				, tdm11_rule_cd
				, tdm11_seq
				, tdm11_company_id
				, tdm11_upd_nm
				, tdm11_upd_date
			from tdm11_task_relate_rule
			'
		) as tdm11 (
			tdm11_task_relate_rule_id numeric
			, tdm11_task_id numeric
			, tdm11_relate_type character varying
			, tdm11_rule_cd character varying
			, tdm11_seq numeric
			, tdm11_company_id numeric
			, tdm11_upd_nm character varying
			, tdm11_upd_date timestamp without time zone
		)
	 	where tdm11_company_id = p_company_id
		and   tdm11_relate_type ='1'; 

	
		insert into tdm12_task_relate_detail
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm12_task_relate_detail_id
				, tdm12_task_id
				, tdm12_content
				, tdm12_seq
				, tdm12_use_yn
				, tdm12_upd_nm
				, tdm12_upd_date
			from tdm12_task_relate_detail
			'
		) as tdm12 (
			tdm12_task_relate_detail_id numeric
			, tdm12_task_id numeric
			, tdm12_content text
			, tdm12_seq numeric
			, tdm12_use_yn character varying
			, tdm12_upd_nm character varying
			, tdm12_upd_date timestamp without time zone
		)
	 	where tdm12_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = p_company_id) ;


		insert into tdm13_task_relate_duty
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm13_task_relate_duty_id
				, tdm13_task_id
				, tdm13_task_relate_detail_id
				, tdm13_content
				, tdm13_seq
				, tdm13_use_yn
				, tdm13_upd_nm
				, tdm13_upd_date
			from tdm13_task_relate_duty
			'
		) as tdm13 (
			tdm13_task_relate_duty_id numeric
			, tdm13_task_id numeric
			, tdm13_task_relate_detail_id numeric
			, tdm13_content text
			, tdm13_seq numeric
			, tdm13_use_yn character varying
			, tdm13_upd_nm character varying
			, tdm13_upd_date timestamp without time zone		
		)
	 	where tdm13_task_id  in (select  tdm10_task_id from tdm10_task where tdm10_company_id = p_company_id) ;

		insert into tdm14_task_type
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm14_task_type_id
				, tdm14_company_id
				, tdm14_task_type_cd
				, tdm14_task_type_nm
				, tdm14_system_cd
				, tdm14_use_yn
				, tdm14_upd_nm
				, tdm14_upd_date
			from tdm14_task_type
			'
		) as tdm14 (
			tdm14_task_type_id numeric
			, tdm14_company_id numeric
			, tdm14_task_type_cd character varying
			, tdm14_task_type_nm character varying
			, tdm14_system_cd character varying
			, tdm14_use_yn character varying
			, tdm14_upd_nm character varying
			, tdm14_upd_date timestamp without time zone
		)
	 	where tdm14_company_id = p_company_id ;
		

		insert into tdm20_role
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm20_role_id
				, tdm20_company_id
				, tdm20_role_nm
				, tdm20_role_type
				, tdm20_role_type_etc_nm
				, tdm20_overview
				, tdm20_start_date
				, tdm20_end_date
				, tdm20_upd_nm
				, tdm20_upd_date
				, tdm20_ceo_role_id
			from  tdm20_role 
		'
		)
		as tdm20 (
			tdm20_role_id numeric
			, tdm20_company_id numeric
			, tdm20_role_nm character varying
			, tdm20_role_type character varying
			, tdm20_role_type_etc_nm character varying
			, tdm20_overview text
			, tdm20_start_date date
			, tdm20_end_date date
			, tdm20_upd_nm character varying
			, tdm20_upd_date timestamp without time zone
			, tdm20_ceo_role_id numeric
		)
		where  tdm20_company_id = p_company_id;


		insert into tdm21_role_relate_task
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm21_role_relate_task_id
				, tdm21_role_id
				, tdm21_task_id
			from tdm21_role_relate_task
			'
		) as tdm21 (
			tdm21_role_relate_task_id numeric
			, tdm21_role_id numeric
			, tdm21_task_id numeric
		)
	 	where tdm21_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = p_company_id) ;

		insert into tdm23_role_relate_org
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm23_role_relate_org_id
				, tdm23_role_id
				, tdm23_org_id
			from tdm23_role_relate_org
			'
		) as tdm23 (
			tdm23_role_relate_org_id numeric
			, tdm23_role_id numeric
			, tdm23_org_id numeric
		)
	 	where tdm23_role_id  in (select  tdm20_role_id from tdm20_role where tdm20_company_id = p_company_id) ;


		insert into tdm30_role_allc
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm30_role_allc_id
				, tdm30_company_id
				, tdm30_role_id
				, tdm30_person_id
				, tdm30_add_title_yn
				, tdm30_start_date
				, tdm30_end_date
				, tdm30_upd_nm
				, tdm30_upd_date
			from tdm30_role_allc
			'
		) as tdm30 (
			tdm30_role_allc_id numeric
			, tdm30_company_id numeric
			, tdm30_role_id numeric
			, tdm30_person_id numeric
			, tdm30_add_title_yn character varying
			, tdm30_start_date date
			, tdm30_end_date date
			, tdm30_upd_nm character varying
			, tdm30_upd_date timestamp without time zone
		)
	 	where tdm30_company_id = p_company_id ;


		insert into tdm34_role_allc_detail
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm34_role_allc_detail_id
				, tdm34_role_allc_id
				, tdm34_role_allc_date
				, tdm34_reg_reason
				, tdm34_deputy_emp_nm
				, tdm34_appr_id
				, tdm34_upd_nm
				, tdm34_upd_date
			from tdm34_role_allc_detail
			'
		) as tdm34 (
			tdm34_role_allc_detail_id numeric
			, tdm34_role_allc_id numeric
			, tdm34_role_allc_date date
			, tdm34_reg_reason text
			, tdm34_deputy_emp_nm character varying
			, tdm34_appr_id numeric
			, tdm34_upd_nm character varying
			, tdm34_upd_date timestamp without time zone
		)
		where  tdm34_role_allc_id  in (select  tdm30_role_allc_id from tdm30_role_allc where tdm30_company_id = p_company_id);


		insert into tdm40_manl_job
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm40_manl_job_id
				, tdm40_company_id
				, tdm40_reg_date
				, tdm40_job_nm
				, tdm40_role_id
				, tdm40_org_id
				, tdm40_job_reason
				, tdm40_start_date
				, tdm40_end_date
				, tdm40_upd_nm
				, tdm40_upd_date
				, tdm40_allc_std_date
			from tdm40_manl_job
			'
		) as tdm40 (
			tdm40_manl_job_id numeric
			, tdm40_company_id numeric
			, tdm40_reg_date date
			, tdm40_job_nm character varying
			, tdm40_role_id numeric
			, tdm40_org_id numeric
			, tdm40_job_reason character varying
			, tdm40_start_date date
			, tdm40_end_date date
			, tdm40_upd_nm character varying
			, tdm40_upd_date timestamp without time zone
			, tdm40_allc_std_date date
		)
		where   tdm40_company_id = p_company_id;

		insert into tdm41_manl_duty
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm41_manl_duty_id
				, tdm41_manl_job_id
				, tdm41_role_id
				, tdm41_task_id
				, tdm41_task_relate_detail_id
				, tdm41_task_relate_duty_id
				, tdm41_upd_nm
				, tdm41_upd_date
				, tdm41_company_id
			from tdm41_manl_duty
			'
		) as tdm41(
			tdm41_manl_duty_id numeric
			, tdm41_manl_job_id numeric
			, tdm41_role_id numeric
			, tdm41_task_id numeric
			, tdm41_task_relate_detail_id numeric
			, tdm41_task_relate_duty_id numeric
			, tdm41_upd_nm character varying
			, tdm41_upd_date timestamp without time zone
			, tdm41_company_id numeric
		)
		where   tdm41_company_id = p_company_id;


		insert into  tdm42_manl_org
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm42_manl_org_id
				, tdm42_company_id
				, tdm42_org_id
				, tdm42_exct_id
				, tdm42_role_id
				, tdm42_lock_yn
				, tdm42_start_date
				, tdm42_end_date
				, tdm42_appr_id
				, tdm42_manl_job_id
				, tdm42_upd_nm
				, tdm42_upd_date
			from  tdm42_manl_org
			'
		) as tdm42(
			tdm42_manl_org_id numeric
			, tdm42_company_id numeric
			, tdm42_org_id numeric
			, tdm42_exct_id numeric
			, tdm42_role_id numeric
			, tdm42_lock_yn character varying
			, tdm42_start_date date
			, tdm42_end_date date
			, tdm42_appr_id numeric
			, tdm42_manl_job_id numeric
			, tdm42_upd_nm character varying
			, tdm42_upd_date timestamp without time zone
		)
		where    tdm42_company_id  = p_company_id;

		insert into  tdm43_manl
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm43_manl_id
				, tdm43_manl_org_id
				, tdm43_company_id
				, tdm43_org_id
				, tdm43_exct_id
				, tdm43_role_id
				, tdm43_role_nm
				, tdm43_task_id
				, tdm43_task_nm
				, tdm43_task_relate_detail_id
				, tdm43_task_relate_detail_nm
				, tdm43_task_relate_duty_id
				, tdm43_task_relate_duty_nm
				, tdm43_check_item
				, tdm43_check_cycle_cd
				, tdm43_check_month
				, tdm43_check_evid_type
				, tdm43_check_evid_etc
				, tdm43_check_how
				, tdm43_ref_basis
				, tdm43_start_date
				, tdm43_manl_duty_id
				, tdm43_first_reg_emp_id
				, tdm43_manl_cd
				, tdm43_upd_nm
				, tdm43_upd_date
				, tdm43_check_evid_doc_nm
				, tdm43_ceo_duty_cd
				, tdm43_exct_duty_cd
				, tdm43_import_level_cd
			from  tdm43_manl
			'
		) as tdm43(
			tdm43_manl_id numeric
			, tdm43_manl_org_id numeric
			, tdm43_company_id numeric
			, tdm43_org_id numeric
			, tdm43_exct_id numeric
			, tdm43_role_id numeric
			, tdm43_role_nm character varying
			, tdm43_task_id numeric
			, tdm43_task_nm text
			, tdm43_task_relate_detail_id numeric
			, tdm43_task_relate_detail_nm text
			, tdm43_task_relate_duty_id numeric
			, tdm43_task_relate_duty_nm text
			, tdm43_check_item text
			, tdm43_check_cycle_cd character varying
			, tdm43_check_month character varying
			, tdm43_check_evid_type character varying
			, tdm43_check_evid_etc character varying
			, tdm43_check_how text
			, tdm43_ref_basis text
			, tdm43_start_date date
			, tdm43_manl_duty_id numeric
			, tdm43_first_reg_emp_id numeric
			, tdm43_manl_cd character varying
			, tdm43_upd_nm character varying
			, tdm43_upd_date timestamp without time zone
			, tdm43_check_evid_doc_nm text
			, tdm43_ceo_duty_cd character varying
			, tdm43_exct_duty_cd character varying
			, tdm43_import_level_cd character varying
		)
		where    tdm43_company_id  = p_company_id;

		insert into  tdm44_manl_duty_org
		select *
		from dblink('host=172.20.200.248  port=5432 dbname=kfiamdb  user=kfiamuser password=kfiam5100'
			, 'SELECT 
				tdm44_manl_duty_org_id
				, tdm44_manl_duty_id
				, tdm44_org_id
				, tdm44_end_yn
				, tdm44_end_date
				, tdm44_end_emp_id
				, tdm44_upd_nm
				, tdm44_upd_date
			from  tdm44_manl_duty_org
			'
		) as tdm44(
			tdm44_manl_duty_org_id numeric
			, tdm44_manl_duty_id numeric
			, tdm44_org_id numeric
			, tdm44_end_yn character varying
			, tdm44_end_date date
			, tdm44_end_emp_id numeric
			, tdm44_upd_nm character varying
			, tdm44_upd_date timestamp without time zone
		)
		where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where  tdm41_company_id = p_company_id);


	end if;

	return 'Y';

END;
$function$
```
