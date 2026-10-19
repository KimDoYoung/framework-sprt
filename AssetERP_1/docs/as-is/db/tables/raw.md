# 테이블: raw

2개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `raw10_miraeasset_org` | 미래에셋운용_조직정보RawData | 10 |
| `raw11_miraeasset_emp` | 미래에셋운용_임직원정보RawData | 13 |

## DBML

```dbml
Table "public"."raw10_miraeasset_org" {
  "raw10_miraeasset_org_id" "numeric" [pk, note: '미래에셋운용_조직정보RawData ID(PK)']
  "raw10_batch_id" "character varying(14)" [note: '배치작업ID']
  "raw10_org_cd" "character varying(5)" [note: '조직코드']
  "raw10_org_nm" "character varying(200)" [note: '조직명']
  "raw10_start_date" "character varying(8)" [note: '시작일자']
  "raw10_close_date" "character varying(8)" [note: '종료일자']
  "raw10_org_level_cd" "character varying(2)" [note: '조직레벨코드(20:총괄-24:부문-01:본부-26:팀,22:위원회)']
  "raw10_org_cap_cd" "character varying(6)" [note: '조직장사번']
  "raw10_org_cap_nm" "character varying(100)" [note: '조직장명']
  "raw10_parent_org_cd" "character varying(5)" [note: '상위조직코드']

  Note: '미래에셋운용_조직정보RawData'
}

Table "public"."raw11_miraeasset_emp" {
  "raw11_miraeasset_emp_id" "numeric" [pk, note: '미래에셋운용_임직원정보RawData ID(PK)']
  "raw11_batch_id" "character varying(14)"
  "raw11_emp_cd" "character varying(6)"
  "raw11_emp_nm" "character varying(100)"
  "raw11_org_cd" "character varying(5)"
  "raw11_pos_cd" "character varying(3)"
  "raw11_pos_nm" "character varying(50)"
  "raw11_title_cd" "character varying(3)"
  "raw11_title_nm" "character varying(50)"
  "raw11_start_date" "character varying(8)"
  "raw11_close_date" "character varying(8)"
  "raw11_email" "character varying(100)"
  "raw11_emp_enm" "character varying(100)" [note: '영문명']

  Note: '미래에셋운용_임직원정보RawData'
}

```
