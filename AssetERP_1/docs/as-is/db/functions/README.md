# 함수·프로시저 색인

함수 221개, 프로시저 8개. 트리거 함수(`RETURNS trigger`, 주로 `*_backup()`) 112개는 제외했다 (`../triggers.md` 참고).

본문은 `functions/{이름}.md`. 오버로드는 같은 파일에 있다.

| 이름 | 종류 | 인자 | 반환 | 줄 수 |
|:---|:---|:---|:---|---:|
| [`array_reverse`](array_reverse.md) | FUNCTION | anyarray | anyarray | 16 |
| [`calc_4insure_hi_month_amt`](calc_4insure_hi_month_amt.md) | PROCEDURE | IN p_person_id numeric, IN p_std_date date, INOUT o_insure_apply record, INOUT o_first_pay_date date, INOUT o_month_amt numeric | - | 105 |
| [`dcr01_import_from_admin`](dcr01_import_from_admin.md) | PROCEDURE | IN p_company_id numeric | - | 64 |
| [`dcr01_import_from_dcr99`](dcr01_import_from_dcr99.md) | PROCEDURE | IN p_company_id numeric | - | 59 |
| [`f_account_nm_allpath`](f_account_nm_allpath.md) | FUNCTION | p_account_id numeric | character varying | 49 |
| [`f_add_day`](f_add_day.md) | FUNCTION | d timestamp without time zone, i integer | timestamp without time zone | 9 |
| [`f_apr_get_title_nm`](f_apr_get_title_nm.md) | FUNCTION | p_emp_id numeric, p_date timestamp without time zone | character varying | 37 |
| [`f_ast_class_tree_nm`](f_ast_class_tree_nm.md) | FUNCTION | p_class_tree_id numeric | character varying | 19 |
| [`f_ast_class_tree_nm_allpath`](f_ast_class_tree_nm_allpath.md) | FUNCTION | p_class_tree_id numeric | character varying | 41 |
| [`f_ast_class_tree_nm_allpath2`](f_ast_class_tree_nm_allpath2.md) | FUNCTION | p_class_tree_id numeric | character varying | 49 |
| [`f_booking_car_check`](f_booking_car_check.md) | FUNCTION | p_booking_id numeric, p_info_id numeric, p_start_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying | character varying | 48 |
| [`f_booking_check`](f_booking_check.md) | FUNCTION | p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying | character varying | 43 |
| [`f_booking_check1`](f_booking_check1.md) | FUNCTION | p_booking_id numeric, p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying, p_company_id numeric | character varying | 48 |
| [`f_booking_check1`](f_booking_check1.md) | FUNCTION | p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying | character varying | 41 |
| [`f_calc_4insure_adjust`](f_calc_4insure_adjust.md) | FUNCTION | p_person_id numeric, p_std_year character varying, p_insure_cd character varying | character varying | 577 |
| [`f_calc_4insure_ei`](f_calc_4insure_ei.md) | FUNCTION | p_person_id numeric, p_std_date date | numeric | 304 |
| [`f_calc_4insure_hi`](f_calc_4insure_hi.md) | FUNCTION | p_person_id numeric, p_std_date date, p_adj_except_yn boolean | numeric | 151 |
| [`f_calc_4insure_ltc`](f_calc_4insure_ltc.md) | FUNCTION | p_person_id numeric, p_std_date date | numeric | 99 |
| [`f_calc_4insure_nps`](f_calc_4insure_nps.md) | FUNCTION | p_person_id numeric, p_std_date date | numeric | 305 |
| [`f_calc_4insure_retire`](f_calc_4insure_retire.md) | FUNCTION | p_person_id numeric, p_per_year_yn character varying, p_proc_type character varying | character varying | 425 |
| [`f_calc_chargefee`](f_calc_chargefee.md) | FUNCTION | p_cont_corp_id numeric, p_charge_date date | character varying | 222 |
| [`f_calc_dual_fund_fee`](f_calc_dual_fund_fee.md) | FUNCTION | p_company_id numeric, p_corp_cd character varying, p_fund_cd character varying, p_std_date date, p_fee numeric | numeric | 98 |
| [`f_calc_fundbookavg`](f_calc_fundbookavg.md) | FUNCTION | p_company_id numeric, p_std_date date, p_type character varying, p_fund_type character varying | numeric | 70 |
| [`f_calc_income_tax`](f_calc_income_tax.md) | FUNCTION | p_pay_month_id numeric | numeric | 267 |
| [`f_calc_income_tax_retire`](f_calc_income_tax_retire.md) | FUNCTION | p_person_id numeric, p_per_year_yn character varying, p_proc_step numeric | character varying | 775 |
| [`f_calc_income_tax_retire_c`](f_calc_income_tax_retire_c.md) | FUNCTION | p_person_id numeric, p_proc_step numeric | character varying | 173 |
| [`f_calc_leave_pay_retire`](f_calc_leave_pay_retire.md) | FUNCTION | p_person_id numeric, p_proc_type character varying | character varying | 255 |
| [`f_calc_local_tax`](f_calc_local_tax.md) | FUNCTION | p_std_date date, p_income_tax numeric | numeric | 17 |
| [`f_calc_rem_leave_days`](f_calc_rem_leave_days.md) | FUNCTION | p_person_id numeric, p_std_date date | character varying | 179 |
| [`f_cdnm`](f_cdnm.md) | FUNCTION | av_code_kind character varying, av_code character varying, av_company_id numeric, av_date timestamp without time zone | character varying | 58 |
| [`f_check_use_ast_id`](f_check_use_ast_id.md) | FUNCTION | p_ast_id numeric | numeric | 49 |
| [`f_check_use_corp_id`](f_check_use_corp_id.md) | FUNCTION | p_corp_id numeric | numeric | 44 |
| [`f_check_use_person_id`](f_check_use_person_id.md) | FUNCTION | p_person_id numeric | numeric | 55 |
| [`f_class_tree_nm_allpath`](f_class_tree_nm_allpath.md) | FUNCTION | p_class_tree_id numeric | character varying | 41 |
| [`f_code_seq`](f_code_seq.md) | FUNCTION | v_company_id numeric, v_kind_cd character varying, v_code character varying | character varying | 28 |
| [`f_conv_emptitlecode`](f_conv_emptitlecode.md) | FUNCTION | p_type character varying, p_code character varying, p_company_id numeric | character varying | 103 |
| [`f_conv_pay`](f_conv_pay.md) | FUNCTION |  | character varying | 282 |
| [`f_conv_tdm`](f_conv_tdm.md) | FUNCTION | p_company_id numeric | character varying | 798 |
| [`f_conv_tdm_exct`](f_conv_tdm_exct.md) | FUNCTION | p_company_id numeric, p_role_nm character varying | numeric | 62 |
| [`f_conv_tdm_tasktype`](f_conv_tdm_tasktype.md) | FUNCTION | p_company_type character varying, p_task_cd character varying | character varying | 89 |
| [`f_create_4insure_adjust_modi`](f_create_4insure_adjust_modi.md) | FUNCTION | p_person_id numeric, p_insure_cd character varying, p_pay_date date | character varying | 174 |
| [`f_create_4insure_adjust_pay`](f_create_4insure_adjust_pay.md) | FUNCTION | p_person_id numeric, p_insure_cd character varying, p_pay_date date | numeric | 228 |
| [`f_create_ast_class_tree_cd`](f_create_ast_class_tree_cd.md) | FUNCTION | p_parent_id numeric, p_type_cd character varying, p_company_id numeric | character varying | 47 |
| [`f_create_back_journal`](f_create_back_journal.md) | FUNCTION | p_tr_id numeric | character varying | 147 |
| [`f_create_batchseq`](f_create_batchseq.md) | FUNCTION |  | numeric | 20 |
| [`f_create_compliancestatelist`](f_create_compliancestatelist.md) | FUNCTION | p_group_id numeric | numeric | 143 |
| [`f_create_compliancestatelist11`](f_create_compliancestatelist11.md) | FUNCTION | p_group_id numeric | text | 120 |
| [`f_create_ddl`](f_create_ddl.md) | FUNCTION | p_table text, p_type text, p_drop_yn boolean | text | 275 |
| [`f_create_depnbook`](f_create_depnbook.md) | FUNCTION | p_proc_type character varying, p_tr_id numeric | character varying | 219 |
| [`f_create_depositbook`](f_create_depositbook.md) | FUNCTION | p_company_id numeric, p_std_date date | character varying | 64 |
| [`f_create_depositbook1`](f_create_depositbook1.md) | FUNCTION | p_company_id numeric, p_std_date date, p_ast_id numeric | character varying | 367 |
| [`f_create_depositbook_close`](f_create_depositbook_close.md) | FUNCTION | p_company_id numeric, p_std_date date, p_close_date date | character varying | 67 |
| [`f_create_depositbook_run`](f_create_depositbook_run.md) | FUNCTION | p_company_id numeric, p_std_date date | character varying | 380 |
| [`f_create_empbatch`](f_create_empbatch.md) | FUNCTION | p_proc_type character varying, p_company_id numeric | character varying | 549 |
| [`f_create_financebook`](f_create_financebook.md) | FUNCTION | p_proc_type character varying, p_tr_id numeric | character varying | 316 |
| [`f_create_financebook_carrforward`](f_create_financebook_carrforward.md) | FUNCTION | p_company_id numeric, p_ast_class_tree_id numeric, p_account_id numeric, p_date date | character varying | 190 |
| [`f_create_financebook_in`](f_create_financebook_in.md) | FUNCTION | p_book_id numeric, p_tr record | character varying | 150 |
| [`f_create_financebook_out`](f_create_financebook_out.md) | FUNCTION | p_book_id numeric, p_out_qty numeric, p_cur_cd character varying | character varying | 114 |
| [`f_create_fundfeebook`](f_create_fundfeebook.md) | FUNCTION | p_company_id numeric, p_std_date date, p_fund_cd character varying | character varying | 421 |
| [`f_create_fundfeebook2`](f_create_fundfeebook2.md) | FUNCTION | p_company_id numeric, p_std_date date, p_corp_id numeric, p_fund_cd character varying | character varying | 475 |
| [`f_create_fundfeercvtr`](f_create_fundfeercvtr.md) | FUNCTION | p_company_id numeric, p_std_date date | character varying | 413 |
| [`f_create_fundfeercvtr_officemng`](f_create_fundfeercvtr_officemng.md) | FUNCTION | p_company_id numeric, p_std_date date, p_corp_id numeric | character varying | 414 |
| [`f_create_genledger`](f_create_genledger.md) | FUNCTION | p_company_id numeric, p_fromdate date, p_todate date | character varying | 234 |
| [`f_create_genledger_eicp`](f_create_genledger_eicp.md) | FUNCTION | p_company_id numeric, p_date date | character varying | 106 |
| [`f_create_genledgerclose_eicp`](f_create_genledgerclose_eicp.md) | FUNCTION | p_company_id numeric, p_date date | character varying | 114 |
| [`f_create_genledgerclosetmp_eicp`](f_create_genledgerclosetmp_eicp.md) | FUNCTION | p_company_id numeric, p_date date | character varying | 107 |
| [`f_create_ipomismatch`](f_create_ipomismatch.md) | FUNCTION |  | character varying | 244 |
| [`f_create_journal`](f_create_journal.md) | FUNCTION | p_proc_type character varying, p_company_id numeric, p_person_id numeric, p_tr_cd character varying, p_tr_id numeric, p_except_yn boolean | character varying | 808 |
| [`f_create_journal_no`](f_create_journal_no.md) | FUNCTION | p_company_id numeric, p_date date | numeric | 27 |
| [`f_create_journal_r`](f_create_journal_r.md) | FUNCTION | p_journal_id numeric | character varying | 306 |
| [`f_create_journal_rr`](f_create_journal_rr.md) | FUNCTION | p_journal_id numeric | character varying | 113 |
| [`f_create_journal_upload`](f_create_journal_upload.md) | FUNCTION | p_company_id numeric, p_person_id numeric | text | 142 |
| [`f_create_journalexpense`](f_create_journalexpense.md) | FUNCTION | p_company_id numeric, p_person_id numeric, p_occ_date date, p_desc text, p_corp_id numeric, p_expense_id numeric, p_expense_ids numeric[] | character varying | 127 |
| [`f_create_journalexpense_sub`](f_create_journalexpense_sub.md) | FUNCTION | p_journal_id numeric, p_pay50 record | character varying | 170 |
| [`f_create_journalpaymonth`](f_create_journalpaymonth.md) | FUNCTION | p_company_id numeric, p_person_id numeric, p_pay_date date, p_pay_type character varying, p_retire_id numeric | character varying | 269 |
| [`f_create_law`](f_create_law.md) | FUNCTION | p_type character varying | character varying | 86 |
| [`f_create_notice_no`](f_create_notice_no.md) | FUNCTION | p_company_id numeric | character varying | 51 |
| [`f_create_schdeadlineday`](f_create_schdeadlineday.md) | FUNCTION | p_deadline_id numeric, p_std_date date | character varying | 73 |
| [`f_create_seq`](f_create_seq.md) | FUNCTION |  | numeric | 20 |
| [`f_create_tdm10copy`](f_create_tdm10copy.md) | FUNCTION | p_old_task_id numeric, p_new_task_id numeric | character varying | 80 |
| [`f_create_tdm59`](f_create_tdm59.md) | FUNCTION | p_proc_type character varying, p_tdm51_id numeric | character varying | 234 |
| [`f_create_tdm62`](f_create_tdm62.md) | FUNCTION | p_tdm59_id numeric, p_tdm51_id numeric | character varying | 28 |
| [`f_create_tdm_manual`](f_create_tdm_manual.md) | FUNCTION | p_job_tp character varying, p_company_id numeric, p_manl_job_id numeric | character varying | 568 |
| [`f_create_tdmapprstep_init`](f_create_tdmapprstep_init.md) | FUNCTION | p_company_id numeric | character varying | 163 |
| [`f_create_tdmchangehistory`](f_create_tdmchangehistory.md) | FUNCTION | p_data jsonb | text | 270 |
| [`f_dud`](f_dud.md) | FUNCTION |  | character varying | 1305 |
| [`f_dud2`](f_dud2.md) | FUNCTION |  | character varying | 146 |
| [`f_emp_kor_nm`](f_emp_kor_nm.md) | FUNCTION | p_person_id numeric | character varying | 35 |
| [`f_get_4insure_yn`](f_get_4insure_yn.md) | FUNCTION | p_person_id numeric, p_std_date date, p_4insure_cd character varying | boolean | 129 |
| [`f_get_account_close_date`](f_get_account_close_date.md) | FUNCTION | p_company_id numeric, p_stddate date, p_type numeric | date | 39 |
| [`f_get_account_nm`](f_get_account_nm.md) | FUNCTION | p_company_id numeric, p_account_cd character varying | character varying | 25 |
| [`f_get_alarm_date_nm`](f_get_alarm_date_nm.md) | FUNCTION | p_alarm_id numeric | character varying | 44 |
| [`f_get_alarm_datetime`](f_get_alarm_datetime.md) | FUNCTION | p_alarm_id numeric, p_std_date date | timestamp without time zone | 70 |
| [`f_get_alarm_info`](f_get_alarm_info.md) | FUNCTION | p_alarm_id numeric | character varying | 66 |
| [`f_get_appr_close_date`](f_get_appr_close_date.md) | FUNCTION | p_appr_id numeric, p_deadline_id numeric, p_company_id numeric | date | 38 |
| [`f_get_biz_date`](f_get_biz_date.md) | FUNCTION | p_company_id numeric, p_stddate date, p_prd character varying | date | 83 |
| [`f_get_biz_date2`](f_get_biz_date2.md) | FUNCTION | p_company_id numeric, p_stddate date, p_prd character varying, p_chk_yn character varying | date | 36 |
| [`f_get_biz_days`](f_get_biz_days.md) | FUNCTION | p_company_id numeric, p_start_date date, p_close_date date | numeric | 26 |
| [`f_get_close_date`](f_get_close_date.md) | FUNCTION | p_company_id numeric, p_year character varying, p_type character varying | date | 37 |
| [`f_get_company_nm`](f_get_company_nm.md) | FUNCTION | p_company_id numeric | character varying | 22 |
| [`f_get_compliance_result`](f_get_compliance_result.md) | FUNCTION | p_person_id numeric, p_std_date date, p_cycle_type character varying, p_compliance_type character varying, p_start_date date | character varying | 137 |
| [`f_get_confirmer`](f_get_confirmer.md) | FUNCTION | p_person_id numeric, p_std_date date | numeric | 66 |
| [`f_get_confirmer_limit`](f_get_confirmer_limit.md) | FUNCTION | p_person_id numeric, p_std_date date, p_level_cd character varying | numeric | 94 |
| [`f_get_confirmer_parent`](f_get_confirmer_parent.md) | FUNCTION | p_person_id numeric, p_std_date date | numeric | 90 |
| [`f_get_corp_cd`](f_get_corp_cd.md) | FUNCTION | p_company_id numeric, p_corp_type character varying, p_corp_cd character varying, p_office_type character varying, p_office_work_cd character varying | character varying | 91 |
| [`f_get_corp_nm`](f_get_corp_nm.md) | FUNCTION | p_corp_id numeric | character varying | 35 |
| [`f_get_crdmanagerid`](f_get_crdmanagerid.md) | FUNCTION | p_card_id numeric, p_std_date date | numeric | 26 |
| [`f_get_crdmanagerid2`](f_get_crdmanagerid2.md) | FUNCTION | p_card_id numeric, p_std_date date | numeric | 33 |
| [`f_get_date`](f_get_date.md) | FUNCTION | p_stddate date, p_prd numeric | date | 17 |
| [`f_get_datedif`](f_get_datedif.md) | FUNCTION | p_start_date date, p_close_date date, p_type character varying | numeric | 31 |
| [`f_get_datediff`](f_get_datediff.md) | FUNCTION | p_start_date date, p_close_date date, p_type character varying | character varying | 63 |
| [`f_get_dcr_no`](f_get_dcr_no.md) | FUNCTION | p_appr_id numeric | character varying | 45 |
| [`f_get_deadline_nm`](f_get_deadline_nm.md) | FUNCTION | p_deadline_id numeric, p_type character varying | character varying | 72 |
| [`f_get_deadline_nm_tmp`](f_get_deadline_nm_tmp.md) | FUNCTION | p_deadline_id numeric, p_type character varying | character varying | 31 |
| [`f_get_dev_status`](f_get_dev_status.md) | FUNCTION | p_dev_id numeric | character varying | 65 |
| [`f_get_empevalgrade`](f_get_empevalgrade.md) | FUNCTION | p_eval_list_std_id numeric, p_score numeric, p_type character varying | character varying | 35 |
| [`f_get_empevalgradeid`](f_get_empevalgradeid.md) | FUNCTION | p_eval_list_std_id numeric, p_score numeric | numeric | 31 |
| [`f_get_empperiod`](f_get_empperiod.md) | FUNCTION | p_person_id numeric, p_std_date date, p_period_type character varying | character varying | 71 |
| [`f_get_emptrans`](f_get_emptrans.md) | FUNCTION | p_person_id numeric, p_std_date date, p_type character varying | character varying | 87 |
| [`f_get_exctdutymap_nm`](f_get_exctdutymap_nm.md) | FUNCTION | p_exct_duty_map character varying | character varying | 47 |
| [`f_get_extrdate`](f_get_extrdate.md) | FUNCTION | p_datestr character varying | date[] | 38 |
| [`f_get_extrdate2`](f_get_extrdate2.md) | FUNCTION | p_datestr character varying | character varying | 46 |
| [`f_get_floortrappr`](f_get_floortrappr.md) | FUNCTION | p_company_id numeric, p_person_id numeric, p_stddate date, p_checkcycle character varying | character varying | 172 |
| [`f_get_floortrbuymonthcount`](f_get_floortrbuymonthcount.md) | FUNCTION | p_person_id numeric, p_startdate date, p_closedate date | numeric | 143 |
| [`f_get_floortrcheck`](f_get_floortrcheck.md) | FUNCTION | p_type character varying, p_company_id numeric, p_person_id numeric, p_stddate date, p_expect_yn boolean | numeric | 462 |
| [`f_get_floortrfundholdcheck`](f_get_floortrfundholdcheck.md) | FUNCTION | p_company_id numeric, p_item_cd character varying, p_std_date date | boolean | 93 |
| [`f_get_floortrrcntbuydate`](f_get_floortrrcntbuydate.md) | FUNCTION | p_company_id numeric, p_person_id numeric, p_account_id numeric, p_item_type character varying, p_item_nm character varying, p_item_cd character varying, p_std_date date, p_expect_yn boolean | date | 104 |
| [`f_get_fss_account_cd`](f_get_fss_account_cd.md) | FUNCTION | p_company_id numeric, p_account_cd character varying | character varying | 53 |
| [`f_get_fund_nm`](f_get_fund_nm.md) | FUNCTION | p_company_id numeric, p_fund_cd character varying, p_std_date date | character varying | 29 |
| [`f_get_fund_nm2`](f_get_fund_nm2.md) | FUNCTION | p_fund_id numeric, p_std_date date | character varying | 27 |
| [`f_get_icr_nm`](f_get_icr_nm.md) | FUNCTION | p_icr_class_tree_id numeric, p_type character varying | character varying | 62 |
| [`f_get_ics_manager`](f_get_ics_manager.md) | FUNCTION | p_company_id numeric, p_ics_class_tree_id numeric | numeric | 34 |
| [`f_get_ics_nm`](f_get_ics_nm.md) | FUNCTION | p_ics_class_tree_id numeric, p_type character varying | character varying | 62 |
| [`f_get_ics_unmanage`](f_get_ics_unmanage.md) | FUNCTION | p_company_id numeric, p_ics_class_tree_id numeric, p_person_id numeric | character varying | 72 |
| [`f_get_insert_script`](f_get_insert_script.md) | FUNCTION | p_table_name character varying, p_id numeric | text | 275 |
| [`f_get_ipo_valid_item_cd`](f_get_ipo_valid_item_cd.md) | FUNCTION | p_item_cd character varying | character varying | 26 |
| [`f_get_itemtype_nm`](f_get_itemtype_nm.md) | FUNCTION | p_flt03_id numeric | character varying | 70 |
| [`f_get_itemtype_nm`](f_get_itemtype_nm.md) | FUNCTION | p_item_type character varying, p_company_id numeric | character varying | 47 |
| [`f_get_journal_corp_nm`](f_get_journal_corp_nm.md) | FUNCTION | p_journal_id numeric | character varying | 45 |
| [`f_get_journal_note`](f_get_journal_note.md) | FUNCTION | p_journal_id numeric | character varying | 38 |
| [`f_get_journal_tr_cd`](f_get_journal_tr_cd.md) | FUNCTION | p_journal_id numeric | character varying | 34 |
| [`f_get_last_day`](f_get_last_day.md) | FUNCTION | p_stddate date | date | 17 |
| [`f_get_leave_count`](f_get_leave_count.md) | FUNCTION | p_start_date date, p_close_date date, p_leave_cd character varying, p_company_id numeric | numeric | 33 |
| [`f_get_leave_count_by_date`](f_get_leave_count_by_date.md) | FUNCTION | p_start_date date, p_close_date date, p_leave_cd character varying, p_company_id numeric | numeric | 32 |
| [`f_get_leave_days`](f_get_leave_days.md) | FUNCTION | p_person_id numeric, p_std_year character varying, p_days_type character varying, p_std_date date, p_appr_chk_yn character varying | numeric | 441 |
| [`f_get_leave_days2`](f_get_leave_days2.md) | FUNCTION | p_person_id numeric, p_std_year character varying, p_days_type character varying, p_std_date date, p_appr_chk_yn character varying | numeric | 65 |
| [`f_get_leave_days_hire`](f_get_leave_days_hire.md) | FUNCTION | p_person_id numeric, p_std_date date, p_month_id numeric | numeric | 132 |
| [`f_get_leave_year`](f_get_leave_year.md) | FUNCTION | p_company_id numeric, p_year numeric | numeric | 96 |
| [`f_get_orgtrcode`](f_get_orgtrcode.md) | FUNCTION | p_expense_id numeric, p_tr_cd character varying | text | 61 |
| [`f_get_personidbytoken`](f_get_personidbytoken.md) | FUNCTION | p_token text | numeric | 26 |
| [`f_get_price`](f_get_price.md) | FUNCTION | p_std_date date, p_ast_class_tree_id numeric | numeric | 60 |
| [`f_get_price_stk`](f_get_price_stk.md) | FUNCTION | p_std_date date, p_item_cd character varying | numeric | 29 |
| [`f_get_quarter_date`](f_get_quarter_date.md) | FUNCTION | p_date date, p_type character varying | date | 45 |
| [`f_get_rate`](f_get_rate.md) | FUNCTION | p_rate_cd character varying, p_std_date date | numeric | 31 |
| [`f_get_real_account_code`](f_get_real_account_code.md) | FUNCTION | p_company_id numeric, p_repr_account_cd character varying, p_map_id character varying | character varying | 116 |
| [`f_get_relate_dcr_count`](f_get_relate_dcr_count.md) | FUNCTION | p_journal_id numeric | numeric | 113 |
| [`f_get_sellpossibleqty`](f_get_sellpossibleqty.md) | FUNCTION | p_book_id numeric | numeric | 40 |
| [`f_get_sellpossibleqty`](f_get_sellpossibleqty.md) | FUNCTION | p_book_id numeric, p_std_date date | numeric | 40 |
| [`f_get_simple_income_tax`](f_get_simple_income_tax.md) | FUNCTION | p_person_id numeric, p_std_date date, p_month_pay numeric | numeric | 123 |
| [`f_get_std_date`](f_get_std_date.md) | FUNCTION | p_deadline_id numeric, p_stddate date, p_company_id numeric | date | 359 |
| [`f_get_std_date_new`](f_get_std_date_new.md) | FUNCTION | p_deadline_id numeric, p_stddate date, p_company_id numeric | date | 280 |
| [`f_get_tdmcheckcycle`](f_get_tdmcheckcycle.md) | FUNCTION | p_manl_id numeric | character varying | 37 |
| [`f_get_tdmevidcount`](f_get_tdmevidcount.md) | FUNCTION | p_target_id numeric | numeric | 34 |
| [`f_get_tdmorg_id`](f_get_tdmorg_id.md) | FUNCTION | p_person_id numeric, p_std_date date | numeric | 31 |
| [`f_get_tdmorg_id2`](f_get_tdmorg_id2.md) | FUNCTION | p_company_id numeric, p_org_id numeric, p_std_date date | numeric | 55 |
| [`f_get_tdmpersoninfo`](f_get_tdmpersoninfo.md) | FUNCTION | p_person_id numeric, p_std_date date, p_type character varying | character varying | 185 |
| [`f_get_tdmsubmitpossibleyn`](f_get_tdmsubmitpossibleyn.md) | FUNCTION | p_company_id numeric, p_check_ym character varying, p_role_id numeric, p_person_id numeric, p_type character varying | boolean | 95 |
| [`f_get_week_date`](f_get_week_date.md) | FUNCTION | p_stddate date, p_week_cd character varying, p_day_cd character varying | date | 148 |
| [`f_icr_class_tree_nm`](f_icr_class_tree_nm.md) | FUNCTION | p_class_tree_id numeric | character varying | 27 |
| [`f_icr_class_tree_nm_allpath`](f_icr_class_tree_nm_allpath.md) | FUNCTION | p_class_tree_id numeric | character varying | 40 |
| [`f_ics_class_tree_nm`](f_ics_class_tree_nm.md) | FUNCTION | p_class_tree_id numeric | character varying | 27 |
| [`f_ics_class_tree_nm_allpath`](f_ics_class_tree_nm_allpath.md) | FUNCTION | p_class_tree_id numeric | character varying | 40 |
| [`f_inner_make_chck`](f_inner_make_chck.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 280 |
| [`f_inner_make_desc`](f_inner_make_desc.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 462 |
| [`f_inner_make_digm`](f_inner_make_digm.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 213 |
| [`f_inner_make_fss`](f_inner_make_fss.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp character varying | text | 331 |
| [`f_inner_make_manual`](f_inner_make_manual.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 183 |
| [`f_insert_floortrbook`](f_insert_floortrbook.md) | FUNCTION | p_company_id numeric, p_person_id numeric, p_account_id character varying, p_item_type character varying, p_item_nm character varying, p_item_cd character varying, p_std_date date | character varying | 387 |
| [`f_insert_icam50`](f_insert_icam50.md) | FUNCTION | p_std_date date, p_source_nm character varying | character varying | 74 |
| [`f_job_nm`](f_job_nm.md) | FUNCTION | p_job_code_id numeric, p_job_date timestamp without time zone | character varying | 25 |
| [`f_log`](f_log.md) | FUNCTION | p_job_tp character varying, p_str character varying | character varying | 18 |
| [`f_max_workdate`](f_max_workdate.md) | FUNCTION | p_fund_code_id numeric, p_work_date timestamp without time zone | timestamp without time zone | 17 |
| [`f_menu_nm_allpath`](f_menu_nm_allpath.md) | FUNCTION | p_menu_id numeric | character varying | 39 |
| [`f_nvl`](f_nvl.md) | FUNCTION | p_amt numeric, p_default numeric | numeric | 16 |
| [`f_org_nm`](f_org_nm.md) | FUNCTION | p_org_id numeric, p_date timestamp without time zone | character varying | 32 |
| [`f_org_parent_full_nm`](f_org_parent_full_nm.md) | FUNCTION | p_org_id numeric, p_date timestamp without time zone | character varying | 84 |
| [`f_org_parent_info_id`](f_org_parent_info_id.md) | FUNCTION | av_parent_code_id numeric, av_date timestamp without time zone | numeric | 32 |
| [`f_org_parent_info_nm`](f_org_parent_info_nm.md) | FUNCTION | p_org_id numeric, p_date timestamp without time zone | character varying | 46 |
| [`f_org_seq`](f_org_seq.md) | FUNCTION | v_code_id numeric, v_base_date timestamp without time zone, v_company numeric | character varying | 96 |
| [`f_password_rule`](f_password_rule.md) | FUNCTION | p_pwd character varying | character varying | 98 |
| [`f_recon_tdm`](f_recon_tdm.md) | FUNCTION | p_tp character varying, p_date date, p_company_id numeric, p_emp_id numeric | text | 1130 |
| [`f_sysdate`](f_sysdate.md) | FUNCTION |  | timestamp without time zone | 9 |
| [`f_tablename_by_id`](f_tablename_by_id.md) | FUNCTION | p_id numeric | character varying | 42 |
| [`f_to_number`](f_to_number.md) | FUNCTION | v character varying | numeric | 9 |
| [`f_to_ymd`](f_to_ymd.md) | FUNCTION | d timestamp without time zone | character varying | 9 |
| [`f_today`](f_today.md) | FUNCTION |  | date | 14 |
| [`f_trunc`](f_trunc.md) | FUNCTION | d timestamp without time zone | timestamp without time zone | 9 |
| [`f_trunc`](f_trunc.md) | FUNCTION | p_amt numeric, p_cur_cd character varying, p_type character varying | numeric | 23 |
| [`f_update_financebook`](f_update_financebook.md) | FUNCTION | p_tr_id numeric, p_book_id numeric | character varying | 271 |
| [`find_orphan_sys10_files`](find_orphan_sys10_files.md) | FUNCTION |  | TABLE(sys10_file_id numeric, sys10_parent_id numeric, sys10_file_nm character varying, sys10_server_path character varying, sys10_size numeric, sys10_reg_date timestamp without time zone, is_orphan boolean) | 80 |
| [`getasseterpuser`](getasseterpuser.md) | FUNCTION | p_email_addr character varying | TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying, emp_id numeric, emp_no character varying, emp_nm character varying, email_addr character varying, email_pw character varying, mobile_telno character varying, org_cd character varying, org_nm character varying, title_cd character varying, pos_cd character varying, pos_nm character varying, retire_yn character varying, pw character varying, int_tel_no character varying) | 45 |
| [`getasseterpuserbyid`](getasseterpuserbyid.md) | FUNCTION | p_person_id numeric | TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying, emp_id numeric, emp_no character varying, emp_nm character varying, email_addr character varying, email_pw character varying, mobile_telno character varying, org_cd character varying, org_nm character varying, title_cd character varying, pos_cd character varying, pos_nm character varying, retire_yn character varying, pw character varying, int_tel_no character varying) | 42 |
| [`getcompany`](getcompany.md) | FUNCTION |  | TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying) | 22 |
| [`getcompanyrule`](getcompanyrule.md) | FUNCTION | p_company_id numeric, p_rule_cd character varying | SETOF bbs15_company_rule | 20 |
| [`getnotice`](getnotice.md) | FUNCTION | p_notice_type character varying, p_person_id numeric | SETOF bbs02_notice | 14 |
| [`getorg`](getorg.md) | FUNCTION | p_company_id numeric, p_std_date date | TABLE(org00_org_id numeric, org00_company_id numeric, org00_org_cd character varying, org00_open_date date, org00_close_date date, org00_open_reason character varying, org00_close_reason character varying, org00_kor_nm character varying, org00_mod_date date, org00_mod_reason character varying, org00_parent_code_id numeric, org00_inner_type character varying, org00_eng_nm character varying, org00_note character varying, org00_level_cd character varying, org00_sort_order character varying, org00_mod_detail character varying, org00_dcr_id_word character varying, org00_tdm_yn character varying) | 36 |
| [`getperson`](getperson.md) | FUNCTION | p_company_id numeric, p_std_date date | TABLE(emp00_trans_id numeric, emp00_company_id numeric, emp00_person_id numeric, emp00_kor_nm character varying, emp00_emp_no character varying, emp00_email_addr character varying, emp00_email_pw character varying, emp00_mobile_telno character varying, emp00_hire_date date, emp00_retire_date date, emp00_trans_date date, emp00_trans_cd character varying, emp00_kind_cd character varying, emp00_pos_cd character varying, emp00_title_cd character varying, emp00_grade_cd character varying, emp00_duty character varying, emp00_non_stay_yn character varying, emp00_org_head_yn character varying, emp00_org_code_id numeric, emp00_org_cd character varying, emp00_org_code_nm character varying, emp00_org_head_nm character varying, emp00_officer_yn character varying, emp00_expiry_date date, emp00_tdm_target_yn character varying, emp00_director_yn character varying, emp00_office_detail character varying) | 76 |
| [`getsuborg`](getsuborg.md) | FUNCTION | p_org_id numeric, p_std_date date | TABLE(org_id numeric, org_nm character varying, depth numeric, seq numeric, tdm_yn character varying) | 71 |
| [`getsubtdmorg`](getsubtdmorg.md) | FUNCTION | p_tdm53_chck_exct_id numeric, p_org_id numeric | TABLE(org_id numeric, depth numeric) | 40 |
| [`gettdm30roleallc`](gettdm30roleallc.md) | FUNCTION | p_company_id numeric, p_std_date date, p_appr_yn boolean | TABLE(tdm30_role_allc_id numeric, tdm30_company_id numeric, tdm30_role_id numeric, tdm30_person_id numeric, tdm30_add_title_yn character varying, tdm30_reg_reason text, tdm30_deputy_emp_nm character varying, tdm30_start_date date, tdm30_end_date date, tdm30_role_allc_date date, tdm30_appr_id numeric, tdm30_role_allc_detail_id numeric) | 60 |
| [`ld_fundhouse_data`](ld_fundhouse_data.md) | FUNCTION | p_file_name character varying, p_fundhouse_name character varying | text | 316 |
| [`ld_tdm_copy`](ld_tdm_copy.md) | FUNCTION | p_job_tp character varying, p_company_id numeric, p_task_id numeric, p_role_id numeric | character varying | 1561 |
| [`ld_tdm_template`](ld_tdm_template.md) | FUNCTION | p_company_name character varying | character varying | 368 |
| [`ld_tdm_template_acd`](ld_tdm_template_acd.md) | FUNCTION | p_file_name character varying, p_company_id numeric | character varying | 850 |
| [`log_message`](log_message.md) | FUNCTION | p_level text, p_message text, p_add_data text | void | 36 |
| [`p_log`](p_log.md) | PROCEDURE | IN p_job_tp character varying, IN p_str character varying | - | 54 |
| [`pay07_retire_create`](pay07_retire_create.md) | PROCEDURE | IN p_person_id numeric, IN p_user_id numeric, IN p_calc_month numeric, IN p_fix_hi numeric, IN p_fix_lt numeric, IN p_fix_ei numeric | - | 199 |
| [`pay07_retire_create`](pay07_retire_create.md) | PROCEDURE | IN p_person_id numeric, IN p_user_id numeric, IN p_calc_month numeric, IN p_fix_hi numeric, IN p_fix_lt numeric, IN p_fix_ei numeric, IN p_non_hi_yn boolean, IN p_non_lt_yn boolean, IN p_non_ei_yn boolean | - | 215 |
| [`pay07_retire_delete`](pay07_retire_delete.md) | PROCEDURE | IN p_person_id numeric, IN p_user_id numeric | - | 90 |
| [`sp_create_mrb01_booking`](sp_create_mrb01_booking.md) | PROCEDURE | IN p_type character varying, IN p_booking_id numeric, IN p_company_id numeric, IN p_emp_id numeric, IN p_subject character varying, IN p_room_cd character varying, IN p_booking_dt timestamp without time zone, IN p_start_hour character varying, IN p_start_min character varying, IN p_close_hour character varying, IN p_close_min character varying, IN p_attendance character varying, IN p_forwarding character varying, IN p_parent_id numeric, IN p_resrv_start_dt timestamp without time zone, IN p_resrv_close_dt timestamp without time zone, IN p_repeat_type character varying, IN p_months character varying, IN p_week_cnt character varying, IN p_day_of_week character varying, IN p_resrv_workday character varying, INOUT p_msg character varying | - | 161 |
| [`tdm_create_data`](tdm_create_data.md) | FUNCTION | p_job_tp character varying, p_ymd character varying, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | character varying | 1395 |
| [`tdm_create_data_chck`](tdm_create_data_chck.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 331 |
| [`tdm_create_data_desc`](tdm_create_data_desc.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 367 |
| [`tdm_create_data_digm`](tdm_create_data_digm.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 213 |
| [`tdm_create_data_fss`](tdm_create_data_fss.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp character varying | text | 506 |
| [`tdm_create_data_manual`](tdm_create_data_manual.md) | FUNCTION | w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric | text | 188 |
| [`tdm_deletable_yn`](tdm_deletable_yn.md) | FUNCTION | p_column_nm character varying, p_id numeric | character varying | 23 |
| [`to_decrypts`](to_decrypts.md) | FUNCTION | data character varying | character varying | 8 |
| [`to_encrypts`](to_encrypts.md) | FUNCTION | data character varying | character varying | 8 |
