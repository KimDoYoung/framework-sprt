# 테이블: _etc

14개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `app_user` |  | 8 |
| `ifi_recv` |  | 3 |
| `tdm_qaz_task_chkitm` |  | 7 |
| `tmp_log` |  | 2 |
| `tmp_token` | 토큰 | 5 |
| `v_apr01` |  | 18 |
| `v_ast90` |  | 25 |
| `v_map_id` |  | 1 |
| `v_name` |  | 1 |
| `v_nm` |  | 1 |
| `v_parent_appr_yn` |  | 1 |
| `v_tmp_map_id` |  | 1 |
| `v_tr` |  | 15 |
| `v_with_fee` |  | 27 |

## DBML

```dbml
Table "public"."app_user" {
  "user_id" "bigint" [pk, increment]
  "company_id" "integer"
  "username" "character varying(50)" [not null, unique]
  "password" "character varying(100)" [not null]
  "full_name" "character varying(100)" [not null]
  "role" "character varying(20)" [not null, default: `'ROLE_USER'::character varying`]
  "created_at" "timestamp with time zone" [default: `CURRENT_TIMESTAMP`]
  "lock_yn" "character varying(1)" [not null, default: `'N'::character varying`, note: '잠금여부 (Y/N) - 로그인 실패 횟수 초과 시 Y']
}

Table "public"."ifi_recv" {
  "id" "bigint" [not null, increment]
  "file_name" "character varying(30)"
  "contents" "text"
}

Table "public"."tdm_qaz_task_chkitm" {
  "qaz_key_id" "numeric" [not null]
  "qaz_item_seq" "numeric"
  "qaz_chk_seq" "numeric"
  "qaz_item_nm" "character varying(1000)"
  "qaz_task_id" "numeric"
  "qaz_detail_id" "numeric"
  "qaz_duty_id" "numeric"
}

Table "public"."tmp_log" {
  "tmp_id" "character varying(12)"
  "tmp_str" "text"
}

Table "public"."tmp_token" {
  "token_id" "numeric" [not null]
  "token_company_id" "numeric" [not null]
  "token_person_id" "numeric" [not null]
  "token_value" "text" [not null]
  "token_date" "timestamp without time zone"

  Note: '토큰'
}

Table "public"."v_apr01" {
  "apr01_appr_id" "numeric"
  "apr01_title" "character varying(400)"
  "apr01_reg_date" "timestamp without time zone"
  "apr01_status_cd" "character varying(10)"
  "apr01_content" "text"
  "apr01_note" "character varying(400)"
  "apr01_reg_emp_id" "numeric"
  "apr01_effect_date" "timestamp without time zone"
  "apr01_class_tree_id" "numeric"
  "apr01_stamp_id" "numeric"
  "apr01_receive_nm" "character varying(400)"
  "apr01_reference_nm" "character varying(400)"
  "apr01_stamp_seq" "numeric"
  "apr01_inout_cd" "character varying(10)"
  "apr01_put_seal_emp_id" "numeric"
  "apr01_put_seal_dt" "timestamp without time zone"
  "apr01_company_id" "numeric"
  "apr01_form_type" "character varying(1)"
}

Table "public"."v_ast90" {
  "ast90_tr_back_id" "numeric"
  "ast90_dml_type" "character varying(10)"
  "ast90_dml_date" "timestamp without time zone"
  "ast90_tr_id" "numeric"
  "ast90_ast_class_tree_id" "numeric"
  "ast90_date" "date"
  "ast90_tr_cd" "character varying(4)"
  "ast90_amt" "numeric"
  "ast90_settle_mng_yn" "character varying(5)"
  "ast90_note" "character varying(200)"
  "ast90_person_id" "numeric"
  "ast90_company_id" "numeric"
  "ast90_corp_id" "numeric"
  "ast90_tax" "numeric"
  "ast90_deposit_id" "numeric"
  "ast90_cur_cd" "character varying(3)"
  "ast90_for_amt" "numeric"
  "ast90_fx_rate" "numeric"
  "ast90_cont_amt" "numeric"
  "ast90_for_cont_amt" "numeric"
  "ast90_fee" "numeric"
  "ast90_book_amt" "numeric"
  "ast90_pur_tr_id" "numeric"
  "ast90_card_approval_no" "character varying(10)"
  "ast90_org_tr_id" "numeric"
}

Table "public"."v_map_id" {
  "?column?" "text"
}

Table "public"."v_name" {
  "ics_nm" "text"
}

Table "public"."v_nm" {
  "case" "text"
}

Table "public"."v_parent_appr_yn" {
  "case" "boolean"
}

Table "public"."v_tmp_map_id" {
  "?column?" "text"
}

Table "public"."v_tr" {
  "ast06_tr_id" "numeric"
  "ast06_ast_class_tree_id" "numeric"
  "ast06_date" "date"
  "ast06_tr_cd" "character varying(4)"
  "ast06_amt" "numeric"
  "ast06_settle_mng_yn" "character varying(5)"
  "ast06_note" "character varying(200)"
  "ast06_person_id" "numeric"
  "ast06_company_id" "numeric"
  "ast06_corp_id" "numeric"
  "ast06_tax" "numeric"
  "ast06_deposit_id" "numeric"
  "ast06_cur_cd" "character varying(3)"
  "ast06_for_amt" "numeric"
  "act11_pl_repr_account_cd" "character varying(4)"
}

Table "public"."v_with_fee" {
  "biz20_fee_charge_id" "numeric"
  "biz20_company_id" "numeric"
  "biz20_charge_date" "date"
  "biz20_corp_id" "numeric"
  "biz20_occ_start_date" "date"
  "biz20_occ_close_date" "date"
  "biz20_occ_days" "numeric"
  "biz20_occ_fee" "numeric"
  "biz20_min_start_date" "date"
  "biz20_min_close_date" "date"
  "biz20_min_days" "numeric"
  "biz20_min_fee" "numeric"
  "biz20_with_start_date" "date"
  "biz20_with_close_date" "date"
  "biz20_with_days" "numeric"
  "biz20_with_fee" "numeric"
  "biz20_target_yn" "character varying(5)"
  "biz20_charge_fee" "numeric"
  "biz20_tax" "numeric"
  "biz20_fix_yn" "character varying(5)"
  "biz20_appr_id" "numeric"
  "biz20_tr_id" "numeric"
  "biz20_note" "character varying(200)"
  "biz20_calc_start_date" "date"
  "biz20_calc_close_date" "date"
  "biz20_calc_days" "numeric"
  "biz20_cont_corp_id" "numeric"
}

```
