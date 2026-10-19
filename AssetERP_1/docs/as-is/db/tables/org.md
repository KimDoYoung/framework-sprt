# 테이블: org

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `org01_code` | 조직코드 | 8 |
| `org02_info` | 조직정보 | 14 |
| `org10_role_stamp` | 인감권한 | 5 |

## DBML

```dbml
Table "public"."org01_code" {
  "org01_code_id" "numeric" [pk, note: '조직코드ID']
  "org01_company_id" "numeric" [note: '회사코드ID']
  "org01_org_cd" "character varying(10)" [not null, note: '조직코드']
  "org01_open_date" "timestamp without time zone" [not null, note: '개설일']
  "org01_close_date" "timestamp without time zone" [note: '폐쇄일']
  "org01_open_reason" "character varying(200)" [note: '개설사유']
  "org01_close_reason" "character varying(200)" [note: '폐쇄사유']
  "org01_note" "character varying(400)" [note: '비고']

  indexes {
    (org01_company_id, org01_code_id) [name: 'idx_org01_companyid_code']
  }

  Note: '조직코드'
}

Table "public"."org02_info" {
  "org02_info_id" "numeric" [pk, note: '조직정보ID']
  "org02_kor_nm" "character varying(100)" [not null, note: '조직한글명']
  "org02_mod_date" "timestamp without time zone" [not null, note: '조직변경일']
  "org02_mod_reason" "character varying(200)" [not null, note: '변경사유']
  "org02_code_id" "numeric" [not null, note: '조직코드ID']
  "org02_parent_code_id" "numeric" [not null, note: '상위조직코드ID']
  "org02_inner_type" "character varying(10)"
  "org02_eng_nm" "character varying(200)" [note: '조직영문명']
  "org02_note" "character varying(400)" [note: '비고']
  "org02_level_cd" "character varying(10)" [not null, note: '조직등급코드']
  "org02_sort_order" "character varying(10)" [note: '조직정렬순서']
  "org02_mod_detail" "character varying(400)" [note: '조직변경상세사유']
  "org02_dcr_id_word" "character varying(10)" [note: '문서번호식별단어']
  "org02_tdm_yn" "character varying(5)" [note: '책무점검부서여부']

  indexes {
    ("org02_code_id", "org02_mod_date") [unique, name: 'org02_info_org02_code_id_org02_mod_date_key']
    (org02_code_id, org02_parent_code_id, org02_mod_date) [name: 'idx_org02_code_dates']
  }

  Note: '조직정보'
}

Table "public"."org10_role_stamp" {
  "org10_role_stamp_id" "numeric" [pk, note: '인감권한ID']
  "org10_org_code_id" "numeric" [not null, note: '부서ID']
  "org10_stamp_id" "numeric" [not null, note: '인감ID']
  "org10_use_yn" "character varying(10)" [not null, note: '사용여부']
  "org10_note" "character varying(400)" [note: '비고']

  Note: '인감권한'
}

```
