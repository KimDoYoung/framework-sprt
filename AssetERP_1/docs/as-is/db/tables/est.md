# 테이블: est

4개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `est01_pf_fee_type` | 부동산PF 수수료항목관리 | 7 |
| `est02_pf_contract` | 부동산PF 용역계약체결 | 12 |
| `est03_pf_history` | 부동산PF 용역수행이력 | 12 |
| `est04_pf_file` | 부동산PF 수행이력 증빙자료 | 4 |

## DBML

```dbml
Table "public"."est01_pf_fee_type" {
  "est01_pf_fee_type_id" "numeric" [pk, note: '부동산PF 수수료항목관리ID(PK)']
  "est01_company_id" "numeric" [note: '회사ID']
  "est01_fee_cd" "character varying(10)" [note: '수수료코드(EstPfFeeCode)']
  "est01_start_date" "date" [note: '사용시작일']
  "est01_close_date" "date" [note: '사용종료일']
  "est01_seq" "numeric" [note: '조회순서']
  "est01_note" "text" [note: '비고']

  Note: '부동산PF 수수료항목관리'
}

Table "public"."est02_pf_contract" {
  "est02_pf_contract_id" "numeric" [pk, note: '부동산PF 용역계약체결ID(PK)']
  "est02_company_id" "numeric" [note: '회사ID']
  "est02_borrower" "character varying(100)" [note: '차주명']
  "est02_project_site_nm" "character varying(100)" [note: '사업장명']
  "est02_project_site_addr" "character varying(100)" [note: '사업장주소지']
  "est02_pf_fee_type_id" "numeric" [note: '수수료ID(est01_pf_fee_type_id)']
  "est02_start_date" "date" [note: '수행시작일']
  "est02_close_date" "date" [note: '수행종료일']
  "est02_manager_id" "numeric" [note: '담당자ID']
  "est02_plan" "text" [note: '수행계획']
  "est02_plan_appr_id" "numeric" [note: '상신ID(수행계획서)']
  "est02_result_appr_id" "numeric" [note: '상신ID(결과보고서)']

  Note: '부동산PF 용역계약체결'
}

Table "public"."est03_pf_history" {
  "est03_pf_history_id" "numeric" [pk, note: '부동산PF 용역수행이력ID(PK)']
  "est03_company_id" "numeric" [note: '회사ID']
  "est03_pf_contract_id" "numeric" [note: '용역계약체결ID(est02_pf_contract_id)']
  "est03_no" "numeric" [note: '수행번호']
  "est03_start_date" "date" [note: '수행시작일']
  "est03_close_date" "date" [note: '수행종료일']
  "est03_content" "character varying(100)" [note: '수행내역']
  "est03_detail" "text" [note: '수행상세내역']
  "est03_person_id" "numeric" [note: '담당자ID']
  "est03_status_cd" "character varying(2)" [note: '승인상태(StatusCode0001-10:신청/20:승인)']
  "est03_confirmer_id" "numeric" [note: '승인자ID(조직장)']
  "est03_confirm_time" "timestamp without time zone" [note: '승인일시']

  indexes {
    (est03_pf_contract_id) [name: 'est03_pf_history_idx01']
  }

  Note: '부동산PF 용역수행이력'
}

Table "public"."est04_pf_file" {
  "est04_pf_file_id" "numeric" [pk, note: '부동산PF 수행이력 증빙자료ID(PK)']
  "est04_pf_history_id" "numeric" [note: '용역수행이력ID(est03_pf_history_id)']
  "est04_file_desc" "character varying(100)" [note: '증빙파일형식']
  "est04_check_route" "character varying(200)" [note: '증빙확인경로(증빙첨부 불가시)']

  indexes {
    (est04_pf_history_id) [name: 'est04_pf_file_idx01']
  }

  Note: '부동산PF 수행이력 증빙자료'
}

```
