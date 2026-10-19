# 테이블: icr

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `icr01_class_tree` | 내부규정 | 12 |
| `icr05_relate_manager` | 관리그룹 연결 | 4 |
| `icr99_class_tree_del` | 내규 삭제이력 | 14 |

## DBML

```dbml
Table "public"."icr01_class_tree" {
  "icr01_class_tree_id" "numeric" [pk, note: '내규ID(PK)']
  "icr01_class_tree_cd" "character varying(10)" [note: '내규코드']
  "icr01_class_tree_nm" "text" [note: '내규명']
  "icr01_parent_tree_id" "numeric" [note: '상위내규ID']
  "icr01_seq" "character varying(10)" [note: '조회순번']
  "icr01_related_law" "character varying(400)" [note: '관련법규(조문)']
  "icr01_submit_to" "character varying(200)" [note: '제출처']
  "icr01_company_id" "numeric" [note: '회사ID']
  "icr01_type_cd" "character varying(2)" [note: '유형코드(IC:상위분류 / IT:최하위분류)']
  "icr01_use_yn" "character varying(5)" [note: '사용여부']
  "icr01_content" "text" [note: '상세내용']
  "icr01_note" "text" [note: '비고']

  Note: '내부규정'
}

Table "public"."icr05_relate_manager" {
  "icr05_relate_manager_id" "numeric" [pk, note: '관리그룹 연결ID(PK)']
  "icr05_company_id" "numeric" [note: '회사ID']
  "icr05_icr_class_tree_id" "numeric" [note: '내규ID(icr01_class_tree_id)']
  "icr05_manager_id" "numeric" [note: '관리그룹ID(ics02_manager_id)']

  Note: '관리그룹 연결'
}

Table "public"."icr99_class_tree_del" {
  "icr99_class_tree_del_id" "numeric" [pk, note: '내규 삭제이력ID(PK)']
  "icr99_person_id" "numeric" [not null]
  "icr99_delete_date" "date" [not null]
  "icr99_class_tree_id" "numeric" [not null]
  "icr99_parent_tree_id" "numeric" [not null]
  "icr99_class_tree_cd" "character varying(10)"
  "icr99_class_tree_nm" "text"
  "icr99_seq" "character varying(10)"
  "icr99_related_law" "character varying(400)"
  "icr99_submit_to" "character varying(200)"
  "icr99_company_id" "numeric"
  "icr99_type_cd" "character varying(5)"
  "icr99_use_yn" "character varying(5)"
  "icr99_content" "text"

  Note: '내규 삭제이력'
}

```
