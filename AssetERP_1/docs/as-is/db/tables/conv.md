# 테이블: conv

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `conv01_journal` | 데이터이행_전표_케이프리덤 | 10 |
| `conv10_tdm_base` | 책무컨설팅자료(안진) | 19 |
| `conv11_tdm_law` | 책무컨설팅자료(안진)_관련법령내규 | 8 |

## DBML

```dbml
Table "public"."conv01_journal" {
  "conv01_date" "date" [note: '전표일자']
  "conv01_journal_no" "numeric" [note: '전표번호']
  "conv01_corp_nm" "character varying(100)" [note: '거래처명']
  "conv01_note" "text" [note: '적요']
  "conv01_drcr" "character varying(2)" [note: '차변/대변']
  "conv01_account_cd" "character varying(10)" [note: '계정코드']
  "conv01_account_nm" "character varying(100)" [note: '계정명']
  "conv01_amt" "numeric" [note: '금액']
  "conv01_ast_nm" "character varying(100)" [note: '관리계좌명']
  "conv01_tr_yn" "character varying(1)" [note: '거래발생유무']

  Note: '데이터이행_전표_케이프리덤'
}

Table "public"."conv10_tdm_base" {
  "conv10_tdm_base_id" "numeric" [pk, note: '책무컨설팅자료_안진ID(PK)']
  "conv10_company_id" "numeric" [note: '회사ID']
  "conv10_duty_cd" "text" [note: '관리의무코드']
  "conv10_role_cd" "text" [note: '직책코드']
  "conv10_role_nm" "text" [note: '직책']
  "conv10_task_nm" "text" [note: '책무']
  "conv10_task_detail" "text" [note: '책무세부내용']
  "conv10_task_detail_duty" "text" [note: '주요관리의무']
  "conv10_org_nm01" "text" [note: '본부/부문']
  "conv10_org_nm02" "text" [note: '부서명']
  "conv10_item_type" "text" [note: '항목구분(개별/공통)']
  "conv10_item_title" "text" [note: '내부통제업무(점검항목명)']
  "conv10_exec_body" "text" [note: '수행주체']
  "conv10_int_rule" "text" [note: '관련근거(내규)']
  "conv10_ext_rule" "text" [note: '관련근거(외규)']
  "conv10_check_cycle" "text" [note: '점검시기']
  "conv10_check_step1" "text" [note: '점검방법 step1']
  "conv10_check_step2" "text" [note: '점검방법 step2']
  "conv10_check_evid_doc" "text" [note: '증빙자료']

  indexes {
    (conv10_company_id) [name: 'conv10_tdm_base_idx01']
  }

  Note: '책무컨설팅자료(안진)'
}

Table "public"."conv11_tdm_law" {
  "conv11_tdm_law_id" "numeric" [pk, note: '책무컨설팅자료(안진)_관련법령내규ID(PK)']
  "conv11_company_id" "numeric" [note: '회사ID']
  "conv11_role_nm" "text" [note: '직책명']
  "conv11_task_type" "text" [note: '책무유형']
  "conv11_task_nm" "text" [note: '책무명']
  "conv11_law_type" "text" [note: '법규/내규 구분']
  "conv11_law_cd" "text" [note: '법령 및 내규 코드']
  "conv11_law_nm" "text" [note: '법령 및 내규 명']

  Note: '책무컨설팅자료(안진)_관련법령내규'
}

```
