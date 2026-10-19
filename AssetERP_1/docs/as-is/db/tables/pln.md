# 테이블: pln

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `pln01_fund` | 기획펀드 | 20 |
| `pln02_plan` | 기획펀드일정 | 9 |
| `pln03_resrch` | 리서치 | 14 |

## DBML

```dbml
Table "public"."pln01_fund" {
  "pln01_fund_id" "numeric" [pk, note: '기획펀드ID']
  "pln01_fund_cd" "character varying(12)" [not null, note: '기획펀드코드']
  "pln01_fund_nm" "character varying(100)" [note: '기획펀드명']
  "pln01_fund_type_cd" "character varying(10)" [note: '펀드분류코드(FundTypeCode)']
  "pln01_team_cd" "character varying(10)" [note: '운용부서']
  "pln01_create_date" "timestamp without time zone" [note: '생성일자']
  "pln01_plan_date" "timestamp without time zone" [note: '개시예정일자']
  "pln01_plan_amount" "numeric" [note: '예상설정액']
  "pln01_management_rate" "numeric" [note: '운용보수']
  "pln01_sales_rate" "numeric" [note: '판매보수']
  "pln01_consignment_rate" "numeric" [note: '수탁보수']
  "pln01_officework_rate" "numeric" [note: '사무수탁보수']
  "pln01_public_or_private" "character varying(10)" [note: '공모사모구분']
  "pln01_fund_info_cd" "character varying(12)" [note: '확정펀드ID']
  "pln01_sales_dscr" "character varying(200)" [note: '판매사정보']
  "pln01_consignment_dscr" "character varying(100)" [note: '수탁사정보']
  "pln01_investor_dscr" "character varying(200)" [note: '투자자정보']
  "pln01_note" "character varying(400)" [note: '비고']
  "pln01_note2" "character varying(400)" [note: '비고2']
  "pln01_company_id" "numeric" [not null, note: '회사ID']

  Note: '기획펀드'
}

Table "public"."pln02_plan" {
  "pln02_plan_id" "numeric" [pk, note: '기획일정ID']
  "pln02_fund_id" "numeric" [not null, note: '기획펀드ID']
  "pln02_class_tree_id" "numeric" [not null, note: '문서분류ID']
  "pln02_start_date" "timestamp without time zone" [note: '시작일자']
  "pln02_due_date" "timestamp without time zone" [note: '마감예정일자']
  "pln02_appr_id" "numeric" [note: '상신문서ID']
  "pln02_doc_id" "numeric" [note: '일반문서ID']
  "pln02_emp_id" "numeric" [note: '사원번호ID']
  "pln02_note" "character varying(400)" [note: '비고']

  indexes {
    (pln02_fund_id) [name: 'pln02_plan_idx01']
  }

  Note: '기획펀드일정'
}

Table "public"."pln03_resrch" {
  "pln03_resrch_id" "numeric" [pk, note: '리서치ID']
  "pln03_class_tree_id" "numeric" [note: '문서분류ID(리서치일정관리/마케팅일정관리)']
  "pln03_issuing_entity_id" "numeric" [note: '발행기관ID(조사대상기관)']
  "pln03_visit_reason" "text" [note: '개요']
  "pln03_reg_emp_id" "numeric" [note: '등록자(운용역) 사원정보ID']
  "pln03_reg_date" "timestamp without time zone" [note: '등록일자']
  "pln03_close_date" "timestamp without time zone" [note: '완료일자']
  "pln03_close_yn" "character varying(10)" [note: '완료여부']
  "pln03_resrch_start_date" "timestamp without time zone" [note: '조사시작일자']
  "pln03_resrch_close_date" "timestamp without time zone" [note: '조사종료일자']
  "pln03_cfrm_emp_id" "numeric" [note: '확인자 사원정보ID']
  "pln03_cfrm_date" "timestamp without time zone" [note: '확인일자']
  "pln03_note" "character varying(400)" [note: '비고']
  "pln03_target_type_code" "character varying(10)" [note: '조사대상구분 코드ID(ResrchTargetTypeCode)']

  Note: '리서치'
}

```
