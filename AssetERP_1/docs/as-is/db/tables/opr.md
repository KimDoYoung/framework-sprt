# 테이블: opr

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `opr01_create` | 운용보고서_등록정보 | 10 |
| `opr02_fund` | 운용보고서_펀드정보 | 3 |
| `opr03_reg` | 운용보고서_담당자정보 | 8 |

## DBML

```dbml
Table "public"."opr01_create" {
  "opr01_create_id" "numeric" [pk, note: '등록ID']
  "opr01_year" "character varying(10)" [note: '년도']
  "opr01_term_cd" "character varying(10)" [note: '기간구분(TermCodeOpr)']
  "opr01_create_emp_id" "numeric" [note: '등록자 사원정보ID']
  "opr01_title" "character varying(400)" [note: '제목']
  "opr01_start_date" "timestamp without time zone" [note: '시작일자']
  "opr01_due_date" "timestamp without time zone" [note: '종료예정일자']
  "opr01_note" "character varying(400)" [note: '비고']
  "opr01_company_id" "numeric" [not null, note: '회사ID']
  "opr01_appr_id" "numeric" [note: '상신ID']

  Note: '운용보고서_등록정보'
}

Table "public"."opr02_fund" {
  "opr02_fund_id" "numeric" [pk, note: '펀드ID']
  "opr02_create_id" "numeric" [not null, note: '등록ID']
  "opr02_reg_fund_id" "numeric" [not null, note: '등록펀드ID']

  indexes {
    ("opr02_create_id", "opr02_reg_fund_id") [unique, name: 'opr02_fund_opr02_create_id_opr02_reg_fund_id_key']
    (opr02_create_id) [name: 'opr02_fund_idx01']
  }

  Note: '운용보고서_펀드정보'
}

Table "public"."opr03_reg" {
  "opr03_reg_id" "numeric" [pk, note: '등록ID']
  "opr03_create_id" "numeric" [not null, note: '등록ID(운용보고서)']
  "opr03_reg_emp_id" "numeric" [not null, note: '담당자 사원정보ID']
  "opr03_seq" "character varying(10)" [not null, note: '순서']
  "opr03_doc_nm" "character varying(200)" [note: '파일명']
  "opr03_reg_date" "timestamp without time zone" [note: '등록일자']
  "opr03_close_yn" "character varying(10)" [note: '완료여부']
  "opr03_note" "character varying(400)" [note: '비고']

  indexes {
    (opr03_create_id) [name: 'opr03_reg_idx01']
  }

  Note: '운용보고서_담당자정보'
}

```
