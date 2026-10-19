# 뷰

7개.

## public.all_source

```sql
CREATE OR REPLACE VIEW public.all_source AS
 SELECT p.proowner::regrole AS owner,
    'function'::text AS type,
    p.proname AS name,
    regexp_split_to_table(p.prosrc, '\n+'::text) AS text
   FROM pg_proc p
     JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'::name
UNION ALL
 SELECT v.viewowner::regrole AS owner,
    'view'::text AS type,
    v.viewname AS name,
    regexp_split_to_table(v.definition, '\n+'::text) AS text
   FROM pg_views v
  WHERE v.schemaname = 'public'::name
UNION ALL
 SELECT CURRENT_USER::regrole AS owner,
    'trigger'::text AS type,
    t.tgname AS name,
    regexp_split_to_table(pg_get_triggerdef(t.oid), '\n+'::text) AS text
   FROM pg_trigger t
  WHERE NOT t.tgisinternal;
```

## public.crd00_slip_backup

```sql
CREATE OR REPLACE VIEW public.crd00_slip_backup AS
 SELECT a.crd00_slip_id,
    a.crd00_company_id,
    a.crd00_card_no_slip,
    a.crd00_card_no,
    a.crd00_slip_ym,
    a.crd00_slip_bank_cd,
    a.crd00_create_dt,
    a.crd00_gubun,
    a.crd00_acct_cd,
    a.crd00_budget,
    a.crd00_amount,
    a.crd00_fr_place,
    a.crd00_to_place,
    a.crd00_desc,
    a.crd00_org_id,
    a.crd00_person_id,
    a.crd00_biz_license_no,
    a.crd00_appr_dt,
    a.crd00_appr_time,
    a.crd00_load_yn,
    a.crd00_appr_id
   FROM ( SELECT crd10_slip_backup.crd10_slip_id AS crd00_slip_id,
            crd10_slip_backup.crd10_company_id AS crd00_company_id,
            crd10_slip_backup.crd10_card_no AS crd00_card_no_slip,
            ( SELECT crd01_card.crd01_card_no
                   FROM crd01_card,
                    crd03_trans
                  WHERE crd01_card.crd01_card_no_slip::text = crd10_slip_backup.crd10_card_no::text AND crd01_card.crd01_card_id = crd03_trans.crd03_card_id AND crd10_slip_backup.crd10_approval_dt >= crd03_trans.crd03_fr_dt AND crd10_slip_backup.crd10_approval_dt <= COALESCE(crd03_trans.crd03_to_dt, '2999-12-31 00:00:00'::timestamp without time zone)
                 LIMIT 1) AS crd00_card_no,
            crd10_slip_backup.crd10_slip_ym AS crd00_slip_ym,
            crd10_slip_backup.crd10_slip_bank_cd AS crd00_slip_bank_cd,
            crd10_slip_backup.crd10_approval_dt AS crd00_create_dt,
            NULL::text AS crd00_gubun,
            '000000'::text AS crd00_acct_cd,
            NULL::text AS crd00_budget,
            crd10_slip_backup.crd10_approval_amount AS crd00_amount,
            NULL::text AS crd00_fr_place,
            NULL::text AS crd00_to_place,
            crd10_slip_backup.crd10_franchise_nm AS crd00_desc,
            ( SELECT emp00_trans_info.emp00_org_code_id
                   FROM emp00_trans_info,
                    crd01_card,
                    crd03_trans
                  WHERE crd01_card.crd01_card_no_slip::text = crd10_slip_backup.crd10_card_no::text AND crd01_card.crd01_card_id = crd03_trans.crd03_card_id AND emp00_trans_info.emp00_person_id = crd03_trans.crd03_person_id AND crd10_slip_backup.crd10_approval_dt >= crd03_trans.crd03_fr_dt AND crd10_slip_backup.crd10_approval_dt <= COALESCE(crd03_trans.crd03_to_dt, '2999-12-31 00:00:00'::timestamp without time zone) AND crd10_slip_backup.crd10_approval_dt >= emp00_trans_info.emp00_trans_date AND crd10_slip_backup.crd10_approval_dt <= COALESCE(emp00_trans_info.emp00_close_date, '2999-12-31 00:00:00'::timestamp without time zone)
                 LIMIT 1) AS crd00_org_id,
            ( SELECT crd03_trans.crd03_person_id
                   FROM crd01_card,
                    crd03_trans
                  WHERE crd01_card.crd01_card_no_slip::text = crd10_slip_backup.crd10_card_no::text AND crd01_card.crd01_card_id = crd03_trans.crd03_card_id AND crd10_slip_backup.crd10_approval_dt >= crd03_trans.crd03_fr_dt AND crd10_slip_backup.crd10_approval_dt <= COALESCE(crd03_trans.crd03_to_dt, '2999-12-31 00:00:00'::timestamp without time zone)
                 LIMIT 1) AS crd00_person_id,
            crd10_slip_backup.crd10_biz_license_no AS crd00_biz_license_no,
            crd10_slip_backup.crd10_approval_dt AS crd00_appr_dt,
            crd10_slip_backup.crd10_approval_time AS crd00_appr_time,
            'true'::text AS crd00_load_yn,
            NULL::text AS crd00_appr_id
           FROM crd10_slip_backup) a;
```

## public.dcr00_doc_list

```sql
CREATE OR REPLACE VIEW public.dcr00_doc_list AS
 SELECT d1.dcr01_class_tree_nm AS dcr00_class_tree_nm,
    d1.dcr01_parent_tree_id AS dcr00_parent_tree_id,
    a3.fnd00_fund_type_nm AS dcr00_fund_type_nm,
    a3.fnd00_fund_id AS dcr00_fund_id,
    a3.fnd00_fund_cd AS dcr00_fund_cd,
    a3.fnd00_fund_nm AS dcr00_fund_nm,
    s10.sys10_file_nm AS dcr00_file_nm,
    a1.apr01_reg_date AS dcr00_reg_date,
    a1.apr01_reg_emp_id AS dcr00_reg_emp_id,
    e1.emp01_kor_nm AS dcr00_emp_nm,
    a3.fnd00_close_yn AS dcr00_fund_close_yn,
    a3.fnd00_public_yn AS dcr00_fund_public_yn,
    a3.fnd00_sintak_gb AS dcr00_fund_sintak_gb,
    a3.fnd00_fund_type_cd AS dcr00_fund_type_cd,
    a3.fnd00_start_date AS dcr00_fund_start_date,
    a1.apr01_title AS dcr00_apr_title,
    e0.emp00_org_kor_nm AS dcr00_org_nm,
    a1.apr01_appr_id AS dcr00_appr_id,
    d1.dcr01_class_tree_id AS dcr00_class_tree_id
   FROM apr01_appr a1
     LEFT JOIN sys10_file s10 ON a1.apr01_appr_id = s10.sys10_parent_id
     JOIN dcr01_class_tree d1 ON a1.apr01_class_tree_id = d1.dcr01_class_tree_id
     LEFT JOIN ( SELECT a.fnd00_fund_id,
            a.fnd00_fund_cd,
            a.fnd00_fund_nm,
            a.fnd00_fund_type_cd,
            a.fnd00_fund_type_nm,
            a.fnd00_start_date,
            a.fnd00_end_date,
            a.fnd00_close_yn,
            a.fnd00_close_nm,
            a.fnd00_plan_yn,
            a.fnd00_plan_nm,
            a.fnd00_real_fund_id,
            a.fnd00_company_id,
            a.fnd00_fund_info_id,
            a.fnd00_work_date,
            a.fnd00_sintak_gb,
            a.fnd00_sintak_gb_nm,
            a.fnd00_public_yn,
            a.fnd00_public_nm,
            a.fnd00_seolj_aek,
            a.fnd00_sunjasan_aek,
            a.fnd00_org_code_id,
            a.fnd00_org_code_nm,
            a.fnd00_emp1_id,
            a.fnd00_emp1_nm,
            a.fnd00_emp2_id,
            a.fnd00_emp2_nm,
            a.fnd00_management_rate,
            a.fnd00_sales_rate,
            a.fnd00_consignment_cd,
            a.fnd00_consignment_rate,
            a.fnd00_office_work_cd,
            a.fnd00_office_work_rate,
            a.fnd00_plan_date,
            a.fnd00_plan_sales_dscr,
            a.fnd00_plan_investor_dscr,
            a.fnd00_plan_note,
            b.fnd01_fund_code_id,
            b.fnd01_fund_cd,
            b.fnd01_start_date,
            b.fnd01_end_date,
            b.fnd01_close_yn,
            b.fnd01_plan_yn,
            b.fnd01_real_fund_id,
            b.fnd01_company_id,
            c.apr03_relate_fund_id,
            c.apr03_appr_id,
            c.apr03_fund_id
           FROM fnd00_fund a
             LEFT JOIN fnd01_fund_code b ON a.fnd00_fund_id = b.fnd01_real_fund_id
             LEFT JOIN apr03_relate_fund c ON c.apr03_fund_id = COALESCE(b.fnd01_fund_code_id, a.fnd00_fund_id)
          WHERE 1 = 1 AND a.fnd00_work_date = f_max_workdate(a.fnd00_fund_id, CURRENT_TIMESTAMP::timestamp without time zone)) a3 ON a1.apr01_appr_id = a3.apr03_appr_id
     JOIN emp00_trans_info e0 ON a1.apr01_reg_emp_id = e0.emp00_person_id
     JOIN emp01_person e1 ON a1.apr01_reg_emp_id = e1.emp01_person_id
  WHERE 1 = 1 AND s10.sys10_title_yn::text = 'true'::text AND e0.emp00_all_title = 0 AND a1.apr01_reg_date >= e0.emp00_trans_date AND a1.apr01_reg_date <= COALESCE(e0.emp00_close_date, '2999-12-31 00:00:00'::timestamp without time zone) AND COALESCE(a3.fnd00_plan_yn, 'false'::character varying)::text = 'false'::text;
```

## public.emp00_trans_info

```sql
CREATE OR REPLACE VIEW public.emp00_trans_info AS
 SELECT a.emp00_trans_id,
    a.emp00_trans_date,
    a.emp00_person_id,
    a.emp00_close_date,
    a.emp00_trans_cd,
    a.emp00_kind_cd,
    a.emp00_pos_cd,
    a.emp00_pos_nm,
    a.emp00_title_cd,
    a.emp00_title_nm,
    a.emp00_grade_cd,
    a.emp00_grade_nm,
    a.emp00_org_code_id,
    a.emp00_org_kor_nm,
    a.emp00_parent_kor_nm,
    a.emp00_note,
    a.emp00_company_id,
    a.emp00_emp_no,
    a.emp00_all_title,
    a.emp00_officer_yn,
    a.emp00_duty
   FROM ( SELECT t.emp03_trans_id AS emp00_trans_id,
            t.emp03_trans_date AS emp00_trans_date,
            t.emp03_person_id AS emp00_person_id,
                CASE
                    WHEN t.emp03_trans_cd::text = '900'::text THEN t.emp03_trans_date
                    ELSE ( SELECT min(x_1.emp03_trans_date) - '1 day'::interval
                       FROM emp03_trans x_1
                      WHERE x_1.emp03_person_id = t.emp03_person_id AND x_1.emp03_trans_date > t.emp03_trans_date)
                END AS emp00_close_date,
            t.emp03_trans_cd AS emp00_trans_cd,
            t.emp03_kind_cd AS emp00_kind_cd,
            t.emp03_pos_cd AS emp00_pos_cd,
            f_cdnm('EmpPosCode'::character varying, t.emp03_pos_cd, x.emp01_company_id, t.emp03_trans_date) AS emp00_pos_nm,
            t.emp03_title_cd AS emp00_title_cd,
            f_get_emptrans(t.emp03_person_id, t.emp03_trans_date::date, 'title_nm'::character varying) AS emp00_title_nm,
            t.emp03_grade_cd AS emp00_grade_cd,
            f_cdnm('EmpGradeCode'::character varying, t.emp03_grade_cd, x.emp01_company_id, t.emp03_trans_date) AS emp00_grade_nm,
            t.emp03_org_code_id AS emp00_org_code_id,
            f_org_nm(t.emp03_org_code_id, t.emp03_trans_date) AS emp00_org_kor_nm,
            f_org_parent_full_nm(t.emp03_org_code_id, t.emp03_trans_date) AS emp00_parent_kor_nm,
            t.emp03_note AS emp00_note,
            x.emp01_company_id AS emp00_company_id,
            x.emp01_emp_no AS emp00_emp_no,
            0 AS emp00_all_title,
            t.emp03_officer_yn AS emp00_officer_yn,
            t.emp03_duty AS emp00_duty
           FROM emp03_trans t,
            emp01_person x
          WHERE t.emp03_person_id = x.emp01_person_id) a;
```

## public.fnd00_fund

```sql
CREATE OR REPLACE VIEW public.fnd00_fund AS
 SELECT t1.fnd01_fund_code_id AS fnd00_fund_id,
    t1.fnd01_fund_cd AS fnd00_fund_cd,
    t2.fnd02_fund_nm AS fnd00_fund_nm,
    t2.fnd02_fund_type_cd AS fnd00_fund_type_cd,
    f_cdnm('FundTypeCode'::character varying, t2.fnd02_fund_type_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_fund_type_nm,
    t1.fnd01_start_date AS fnd00_start_date,
    t1.fnd01_end_date AS fnd00_end_date,
    t1.fnd01_close_yn AS fnd00_close_yn,
    f_cdnm('ClosedFundCode'::character varying, t1.fnd01_close_yn, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_close_nm,
    t1.fnd01_plan_yn AS fnd00_plan_yn,
        CASE
            WHEN t1.fnd01_plan_yn::text = 'true'::text THEN '임시펀드'::text
            ELSE '펀드'::text
        END AS fnd00_plan_nm,
    t1.fnd01_real_fund_id AS fnd00_real_fund_id,
    t1.fnd01_company_id AS fnd00_company_id,
    t2.fnd02_fund_info_id AS fnd00_fund_info_id,
    t2.fnd02_work_date AS fnd00_work_date,
    t2.fnd02_sintak_gb AS fnd00_sintak_gb,
    f_cdnm('SintakCode'::character varying, t2.fnd02_sintak_gb, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_sintak_gb_nm,
    t2.fnd02_public_yn AS fnd00_public_yn,
    f_cdnm('PublicCode'::character varying, t2.fnd02_public_yn, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_public_nm,
    t2.fnd02_seolj_aek AS fnd00_seolj_aek,
    t2.fnd02_sunjasan_aek AS fnd00_sunjasan_aek,
    t2.fnd02_org_code_id AS fnd00_org_code_id,
    t2.fnd02_org_code_nm AS fnd00_org_code_nm,
    t2.fnd02_emp1_id AS fnd00_emp1_id,
    f_emp_kor_nm(t2.fnd02_emp1_id) AS fnd00_emp1_nm,
    t2.fnd02_emp2_id AS fnd00_emp2_id,
    f_emp_kor_nm(t2.fnd02_emp2_id) AS fnd00_emp2_nm,
    t2.fnd02_management_rate AS fnd00_management_rate,
    t2.fnd02_sales_rate AS fnd00_sales_rate,
    t2.fnd02_consignment_cd AS fnd00_consignment_cd,
    ( SELECT fnd03_consignment.fnd03_consignment_nm
           FROM fnd03_consignment
          WHERE fnd03_consignment.fnd03_consignment_cd::text = t2.fnd02_consignment_cd::text AND fnd03_consignment.fnd03_company_id = t1.fnd01_company_id) AS fnd00_consignment_nm,
    t2.fnd02_consignment_rate AS fnd00_consignment_rate,
    t2.fnd02_office_work_cd AS fnd00_office_work_cd,
    ( SELECT fnd06_office_work.fnd06_office_work_nm
           FROM fnd06_office_work
          WHERE fnd06_office_work.fnd06_office_work_cd::text = t2.fnd02_office_work_cd::text AND fnd06_office_work.fnd06_company_id = t1.fnd01_company_id) AS fnd00_office_work_nm,
    t2.fnd02_office_work_rate AS fnd00_office_work_rate,
    t2.fnd02_plan_date AS fnd00_plan_date,
    t2.fnd02_plan_sales_dscr AS fnd00_plan_sales_dscr,
    t2.fnd02_plan_investor_dscr AS fnd00_plan_investor_dscr,
    t2.fnd02_plan_note AS fnd00_plan_note,
    t1.fnd01_icam_yn AS fnd00_icam_yn,
    t1.fnd01_note AS fnd00_note,
    t2.fnd02_kofia_fund_cd AS fnd00_kofia_fund_cd,
    t2.fnd02_kofia_trust_cd AS fnd00_kofia_trust_cd,
    f_cdnm('IcamTrustCode'::character varying, t2.fnd02_kofia_trust_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_trust_nm,
    t2.fnd02_kofia_fund_type_cd AS fnd00_kofia_fund_type_cd,
    f_cdnm('IcamFundType'::character varying, t2.fnd02_kofia_fund_type_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_fund_type_nm,
    t2.fnd02_kofia_public_cd AS fnd00_kofia_public_cd,
    f_cdnm('IcamPublicCode'::character varying, t2.fnd02_kofia_public_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_public_nm,
    t2.fnd02_kofia_parent_cd AS fnd00_kofia_parent_cd,
    f_cdnm('IcamParentCode'::character varying, t2.fnd02_kofia_parent_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_parent_nm,
    t2.fnd02_kofia_class_type_cd AS fnd00_kofia_class_type_cd,
    f_cdnm('IcamClassType'::character varying, t2.fnd02_kofia_class_type_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_class_type_nm,
    t2.fnd02_kofia_fund_unit_cd AS fnd00_kofia_fund_unit_cd,
    f_cdnm('IcamFundUnitCode'::character varying, t2.fnd02_kofia_fund_unit_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_fund_unit_nm,
    t2.fnd02_kofia_char_class_cd AS fnd00_kofia_char_class_cd,
    f_cdnm('IcamCharClassCode'::character varying, t2.fnd02_kofia_char_class_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_char_class_nm,
    t2.fnd02_end_expect_date AS fnd00_end_expect_date,
    t2.fnd02_trust_bank_cd AS fnd00_trust_bank_cd,
    ( SELECT fnd09_trust_bank.fnd09_trust_bank_nm
           FROM fnd09_trust_bank
          WHERE fnd09_trust_bank.fnd09_trust_bank_cd::text = t2.fnd02_trust_bank_cd::text AND fnd09_trust_bank.fnd09_company_id = t1.fnd01_company_id) AS fnd00_trust_bank_nm,
    t2.fnd02_operator1 AS fnd00_operator1,
    t2.fnd02_operator2 AS fnd00_operator2,
    t2.fnd02_cur AS fnd00_cur,
    t2.fnd02_next_close_date AS fnd00_next_close_date,
    t2.fnd02_next_fee_date AS fnd00_next_fee_date,
    t2.fnd02_ksd_fund_cd AS fnd00_ksd_fund_cd,
    t2.fnd02_ksd_item_cd AS fnd00_ksd_item_cd,
    t2.fnd02_diff_div_yn AS fnd00_diff_div_yn,
    t2.fnd02_fund_full_nm AS fnd00_fund_full_nm
   FROM fnd01_fund_code t1,
    fnd02_fund_info t2
  WHERE t1.fnd01_fund_code_id = t2.fnd02_fund_code_id;
```

## public.fnd00_fund_sysdate

```sql
CREATE OR REPLACE VIEW public.fnd00_fund_sysdate AS
 SELECT t1.fnd01_fund_code_id AS fnd00_fund_id,
    t1.fnd01_fund_cd AS fnd00_fund_cd,
    t2.fnd02_fund_nm AS fnd00_fund_nm,
    t2.fnd02_fund_type_cd AS fnd00_fund_type_cd,
    f_cdnm('FundTypeCode'::character varying, t2.fnd02_fund_type_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_fund_type_nm,
    t1.fnd01_start_date AS fnd00_start_date,
    t1.fnd01_end_date AS fnd00_end_date,
    t1.fnd01_close_yn AS fnd00_close_yn,
    f_cdnm('ClosedFundCode'::character varying, t1.fnd01_close_yn, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_close_nm,
    t1.fnd01_plan_yn AS fnd00_plan_yn,
        CASE
            WHEN t1.fnd01_plan_yn::text = 'true'::text THEN '임시펀드'::text
            ELSE '펀드'::text
        END AS fnd00_plan_nm,
    t1.fnd01_real_fund_id AS fnd00_real_fund_id,
    t1.fnd01_company_id AS fnd00_company_id,
    t2.fnd02_fund_info_id AS fnd00_fund_info_id,
    t2.fnd02_work_date AS fnd00_work_date,
    t2.fnd02_sintak_gb AS fnd00_sintak_gb,
    f_cdnm('SintakCode'::character varying, t2.fnd02_sintak_gb, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_sintak_gb_nm,
    t2.fnd02_public_yn AS fnd00_public_yn,
    f_cdnm('PublicCode'::character varying, t2.fnd02_public_yn, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_public_nm,
    t2.fnd02_seolj_aek AS fnd00_seolj_aek,
    t2.fnd02_sunjasan_aek AS fnd00_sunjasan_aek,
    t2.fnd02_org_code_id AS fnd00_org_code_id,
    t2.fnd02_org_code_nm AS fnd00_org_code_nm,
    t2.fnd02_emp1_id AS fnd00_emp1_id,
    f_emp_kor_nm(t2.fnd02_emp1_id) AS fnd00_emp1_nm,
    t2.fnd02_emp2_id AS fnd00_emp2_id,
    f_emp_kor_nm(t2.fnd02_emp2_id) AS fnd00_emp2_nm,
    t2.fnd02_management_rate AS fnd00_management_rate,
    t2.fnd02_sales_rate AS fnd00_sales_rate,
    t2.fnd02_consignment_cd AS fnd00_consignment_cd,
    ( SELECT fnd03_consignment.fnd03_consignment_nm
           FROM fnd03_consignment
          WHERE fnd03_consignment.fnd03_consignment_cd::text = t2.fnd02_consignment_cd::text AND fnd03_consignment.fnd03_company_id = t1.fnd01_company_id) AS fnd00_consignment_nm,
    t2.fnd02_consignment_rate AS fnd00_consignment_rate,
    t2.fnd02_office_work_cd AS fnd00_office_work_cd,
    ( SELECT fnd06_office_work.fnd06_office_work_nm
           FROM fnd06_office_work
          WHERE fnd06_office_work.fnd06_office_work_cd::text = t2.fnd02_office_work_cd::text AND fnd06_office_work.fnd06_company_id = t1.fnd01_company_id) AS fnd00_office_work_nm,
    t2.fnd02_office_work_rate AS fnd00_office_work_rate,
    t2.fnd02_plan_date AS fnd00_plan_date,
    t2.fnd02_plan_sales_dscr AS fnd00_plan_sales_dscr,
    t2.fnd02_plan_investor_dscr AS fnd00_plan_investor_dscr,
    t2.fnd02_plan_note AS fnd00_plan_note,
    t1.fnd01_icam_yn AS fnd00_icam_yn,
    t1.fnd01_note AS fnd00_note,
    t2.fnd02_kofia_fund_cd AS fnd00_kofia_fund_cd,
    t2.fnd02_kofia_trust_cd AS fnd00_kofia_trust_cd,
    f_cdnm('IcamTrustCode'::character varying, t2.fnd02_kofia_trust_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_trust_nm,
    t2.fnd02_kofia_fund_type_cd AS fnd00_kofia_fund_type_cd,
    f_cdnm('IcamFundType'::character varying, t2.fnd02_kofia_fund_type_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_fund_type_nm,
    t2.fnd02_kofia_public_cd AS fnd00_kofia_public_cd,
    f_cdnm('IcamPublicCode'::character varying, t2.fnd02_kofia_public_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_public_nm,
    t2.fnd02_kofia_parent_cd AS fnd00_kofia_parent_cd,
    f_cdnm('IcamParentCode'::character varying, t2.fnd02_kofia_parent_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_parent_nm,
    t2.fnd02_kofia_class_type_cd AS fnd00_kofia_class_type_cd,
    f_cdnm('IcamClassType'::character varying, t2.fnd02_kofia_class_type_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_class_type_nm,
    t2.fnd02_kofia_fund_unit_cd AS fnd00_kofia_fund_unit_cd,
    f_cdnm('IcamFundUnitCode'::character varying, t2.fnd02_kofia_fund_unit_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_fund_unit_nm,
    t2.fnd02_kofia_char_class_cd AS fnd00_kofia_char_class_cd,
    f_cdnm('IcamCharClassCode'::character varying, t2.fnd02_kofia_char_class_cd, t1.fnd01_company_id, t2.fnd02_work_date) AS fnd00_kofia_char_class_nm,
    t2.fnd02_end_expect_date AS fnd00_end_expect_date,
    t2.fnd02_trust_bank_cd AS fnd00_trust_bank_cd,
    ( SELECT fnd09_trust_bank.fnd09_trust_bank_nm
           FROM fnd09_trust_bank
          WHERE fnd09_trust_bank.fnd09_trust_bank_cd::text = t2.fnd02_trust_bank_cd::text AND fnd09_trust_bank.fnd09_company_id = t1.fnd01_company_id) AS fnd00_trust_bank_nm,
    t2.fnd02_operator1 AS fnd00_operator1,
    t2.fnd02_operator2 AS fnd00_operator2,
    t2.fnd02_cur AS fnd00_cur,
    t2.fnd02_next_close_date AS fnd00_next_close_date,
    t2.fnd02_next_fee_date AS fnd00_next_fee_date,
    t2.fnd02_ksd_fund_cd AS fnd00_ksd_fund_cd,
    t2.fnd02_ksd_item_cd AS fnd00_ksd_item_cd,
    t2.fnd02_diff_div_yn AS fnd00_diff_div_yn,
    t2.fnd02_fund_full_nm
   FROM fnd01_fund_code t1,
    fnd02_fund_info t2
  WHERE t1.fnd01_fund_code_id = t2.fnd02_fund_code_id AND ((t1.fnd01_company_id, t2.fnd02_fund_code_id, t2.fnd02_work_date) IN ( SELECT fnd01_fund_code.fnd01_company_id,
            fnd02_fund_info.fnd02_fund_code_id,
            max(fnd02_fund_info.fnd02_work_date) AS max
           FROM fnd01_fund_code,
            fnd02_fund_info
          WHERE fnd01_fund_code.fnd01_fund_code_id = fnd02_fund_info.fnd02_fund_code_id AND fnd01_fund_code.fnd01_company_id = t1.fnd01_company_id AND fnd02_fund_info.fnd02_work_date <= f_sysdate()
          GROUP BY fnd01_fund_code.fnd01_company_id, fnd02_fund_info.fnd02_fund_code_id));
```

## public.org00_org_info

```sql
CREATE OR REPLACE VIEW public.org00_org_info AS
 SELECT org01_code.org01_code_id AS org00_org_code_id,
    org01_code.org01_company_id AS org00_company_id,
    org01_code.org01_org_cd AS org00_org_cd,
    org01_code.org01_open_date AS org00_open_date,
    org01_code.org01_close_date AS org00_close_date,
    org01_code.org01_open_reason AS org00_open_reason,
    org01_code.org01_close_reason AS org00_close_reason,
    org02_info.org02_info_id AS org00_org_info_id,
    org02_info.org02_kor_nm AS org00_kor_nm,
    org02_info.org02_mod_date AS org00_mod_date,
    org02_info.org02_mod_reason AS org00_mod_reason,
    org02_info.org02_parent_code_id AS org00_parent_code_id,
    org02_info.org02_inner_type AS org00_inner_type,
    org02_info.org02_eng_nm AS org00_eng_nm,
    org02_info.org02_note AS org00_note,
    org02_info.org02_level_cd AS org00_level_cd,
    org02_info.org02_sort_order AS org00_seq,
    org02_info.org02_mod_detail AS org00_mod_detail,
    org02_info.org02_dcr_id_word AS org00_dcr_id_word,
    f_org_parent_full_nm(org01_code.org01_code_id, org01_code.org01_close_date) AS org00_parent_full_nm,
    f_org_parent_info_nm(org01_code.org01_code_id, org01_code.org01_close_date) AS org00_parent_code_nm,
        CASE substr(org01_code.org01_org_cd::text, 1, 2)
            WHEN '11'::text THEN 'true'::text
            ELSE 'false'::text
        END AS org00_ignore_stamp
   FROM org01_code
     JOIN org02_info ON org01_code.org01_code_id = org02_info.org02_code_id;
```
