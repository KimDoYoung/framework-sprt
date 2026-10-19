# 테이블: cmp

10개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `cmp01_advertise` | 광고심사 | 8 |
| `cmp02_inner_item` |  | 10 |
| `cmp03_item_check` |  | 5 |
| `cmp04_person_check` |  | 9 |
| `cmp10_mail_book` | 공용메일(회사별) | 5 |
| `cmp11_account` |  | 12 |
| `cmp11_mail_role` | 공용메일 권한 | 4 |
| `cmp12_account_master` |  | 9 |
| `cmp13_account_trans` |  | 11 |
| `cmp99_jongmok` |  | 6 |

## DBML

```dbml
Table "public"."cmp01_advertise" {
  "cmp01_advertise_id" "numeric" [pk, note: '광고심사ID']
  "cmp01_advertise_no" "character varying(20)" [not null, note: '심사번호']
  "cmp01_screening_date" "timestamp without time zone" [note: '심사일자']
  "cmp01_advertise_type" "character varying(100)" [note: '광고종류']
  "cmp01_media_type" "character varying(100)" [note: '매체종류']
  "cmp01_advertise_note" "character varying(200)" [note: '광고내용']
  "cmp01_manager_emp_id" "character varying(100)" [note: '담당자ID']
  "cmp01_advertise_count" "character varying(100)" [note: '수량']

  Note: '광고심사'
}

Table "public"."cmp02_inner_item" {
  "cmp02_inner_item_id" "numeric" [pk]
  "cmp02_inner_item_cd" "character varying(10)"
  "cmp02_inner_item_nm" "character varying(100)"
  "cmp02_inner_item_type" "character varying(10)"
  "cmp02_inner_start_dt" "timestamp without time zone"
  "cmp02_inner_close_dt" "timestamp without time zone"
  "cmp02_inner_item_use_yn" "character varying(10)"
  "cmp02_company_id" "numeric" [not null]
  "cmp02_inner_item_note" "character varying(2000)"
  "cmp02_note" "character varying(500)"
}

Table "public"."cmp03_item_check" {
  "cmp03_item_check_id" "numeric" [pk]
  "cmp03_item_title" "character varying(100)"
  "cmp03_item_check_dt" "timestamp without time zone"
  "cmp03_item_dut_dt" "timestamp without time zone"
  "cmp03_note" "character varying(500)"

  indexes {
    ("cmp03_item_check_dt", "cmp03_item_check_id") [unique, name: 'cmp03_item_check_cmp03_item_check_dt_cmp03_item_check_id_key']
  }
}

Table "public"."cmp04_person_check" {
  "cmp04_person_check_id" "numeric" [pk]
  "cmp04_inner_item_id" "numeric"
  "cmp04_item_check_id" "numeric"
  "cmp04_person_id" "numeric" [not null]
  "cmp04_inner_check_dt" "timestamp without time zone"
  "cmp04_inner_item_check" "character varying(10)"
  "cmp04_inner_comp_dt" "timestamp without time zone"
  "cmp04_inner_comp_check" "character varying(10)"
  "cmp04_note" "character varying(500)"
}

Table "public"."cmp10_mail_book" {
  "cmp10_mail_book_id" "numeric" [pk, note: '공용메일ID']
  "cmp10_company_id" "numeric" [not null, note: '회사ID']
  "cmp10_email_addr" "character varying(100)" [note: '공용이메일주소']
  "cmp10_password" "character varying(128)" [note: '이메일암호']
  "cmp10_note" "character varying(400)" [note: '비고']

  indexes {
    (cmp10_company_id) [name: 'cmp10_mail_book_idx01']
    (cmp10_company_id, cmp10_email_addr) [name: 'cmp10_mail_book_idx02']
  }

  Note: '공용메일(회사별)'
}

Table "public"."cmp11_account" {
  "cmp11_account_id" "numeric" [pk]
  "cmp11_account_no" "character varying(50)"
  "cmp11_account_nm" "character varying(50)"
  "cmp11_account_relation" "character varying(20)"
  "cmp11_account_type" "character varying(50)"
  "cmp11_account_input_dt" "timestamp without time zone"
  "cmp11_account_use_yn" "character varying(10)"
  "cmp11_person_id" "numeric" [not null]
  "cmp11_company_id" "numeric" [not null]
  "cmp11_comp_chk" "character varying(10)"
  "cmp11_comp_dt" "timestamp without time zone"
  "cmp11_note" "character varying(500)"
}

Table "public"."cmp11_mail_role" {
  "cmp11_mail_role_id" "numeric" [pk, note: '공용메일 권한ID']
  "cmp11_mail_book_id" "numeric" [not null, note: '공용메일ID']
  "cmp11_person_id" "numeric" [not null, note: '사원ID']
  "cmp11_note" "character varying(400)" [note: '비고']

  indexes {
    (cmp11_mail_book_id) [name: 'cmp11_mail_role_idx01']
  }

  Note: '공용메일 권한'
}

Table "public"."cmp12_account_master" {
  "cmp12_account_master_id" "numeric" [pk]
  "cmp12_account_id" "numeric" [not null]
  "cmp12_jm_nm" "character varying(50)"
  "cmp12_jango_dt" "timestamp without time zone"
  "cmp12_jango_jusu" "numeric"
  "cmp12_jango_amt" "numeric"
  "cmp12_comp_chk" "character varying(10)"
  "cmp12_comp_dt" "timestamp without time zone"
  "cmp12_note" "character varying(500)"
}

Table "public"."cmp13_account_trans" {
  "cmp13_account_trans_id" "numeric" [pk]
  "cmp13_account_master_id" "numeric" [not null]
  "cmp13_trans_dt" "timestamp without time zone"
  "cmp13_trans_gb" "character varying(10)"
  "cmp13_buy_jusu" "numeric" [not null]
  "cmp13_sell_jusu" "numeric" [not null]
  "cmp13_trans_price" "numeric" [not null]
  "cmp13_actual_status" "character varying(10)"
  "cmp13_comp_chk" "character varying(10)"
  "cmp13_comp_dt" "timestamp without time zone"
  "cmp13_note" "character varying(500)"
}

Table "public"."cmp99_jongmok" {
  "cmp99_jm_id" "numeric" [pk]
  "cmp99_jm_cd" "character varying(12)"
  "cmp99_jm_nm" "character varying(100)"
  "cmp99_sangp_gb" "character varying(10)"
  "cmp99_market_gb" "character varying(10)"
  "cmp99_note" "character varying(500)"
}

```
