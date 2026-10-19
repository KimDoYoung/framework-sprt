# 테이블: fbx

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `fbx01_box` | 파일보관함 | 11 |
| `fbx02_history` | 파일보관함-History | 8 |
| `fbx03_file` | 파일보관함-File | 8 |

## DBML

```dbml
Table "public"."fbx01_box" {
  "fbx01_box_id" "numeric" [pk, note: '보관함ID']
  "fbx01_dcr_class_id" "numeric" [note: '문서분류ID(dcr01_class_tree_id)']
  "fbx01_org_code_id" "numeric" [not null, note: '생성자조직ID(org02_code_id)']
  "fbx01_crt_date" "timestamp without time zone" [not null, default: `CURRENT_TIMESTAMP`, note: '생성일시']
  "fbx01_crt_emp_id" "numeric" [not null, note: '생성자id(emp01_person_id)']
  "fbx01_title" "character varying(400)" [not null, note: '파일보관함의 제목']
  "fbx01_status_cd" "character varying(2)" [not null, default: `'01'::character varying`, note: '01:진행, 99:종료']
  "fbx01_close_date" "timestamp without time zone" [note: '종료일시']
  "fbx01_close_emp_id" "numeric" [note: '종료한 emp_id']
  "fbx01_company_id" "numeric" [not null, note: '회사id']
  "fbx01_note" "character varying(500)" [note: '비고']

  indexes {
    (fbx01_company_id) [name: 'fbx01_box_idx01']
  }

  Note: '파일보관함'
}

Table "public"."fbx02_history" {
  "fbx02_history_id" "numeric" [pk, note: 'history id']
  "fbx02_box_id" "numeric" [not null, note: '보관함id']
  "fbx02_seq" "numeric" [not null, note: 'seq 보관함id에 따라서 증가하는 숫자']
  "fbx02_act_cd" "character varying(2)" [not null, note: '동작코드 : 01:생성, 02: 삭제, 03:이동, 04:다운로드, 05:보기']
  "fbx02_act_emp_id" "numeric" [not null, note: '동작자ID emp01_person_id']
  "fbx02_act_date" "timestamp without time zone" [not null, default: `CURRENT_TIMESTAMP`, note: '동작일시']
  "fbx02_act_content" "character varying(500)" [not null, note: '동작내용 : file명 기술, 이동시 from dcr_class_id, to dcr_class_id 기술']
  "fbx02_act_org_code_id" "numeric" [note: '동작자 조직코드 (org02_code_id)']

  indexes {
    (fbx02_box_id) [name: 'fbx02_history_idx01']
  }

  Note: '파일보관함-History'
}

Table "public"."fbx03_file" {
  "fbx03_file_id" "numeric" [pk, note: '파일id(sys10_parent_id)']
  "fbx03_box_id" "numeric" [note: '보관함id']
  "fbx03_dcr_class_id" "numeric" [note: '문서분류id']
  "fbx03_org_code_id" "numeric" [note: '생성자조직id']
  "fbx03_emp_id" "numeric" [note: '생성자id']
  "fbx03_status_cd" "character varying(2)" [note: '상태코드 default 00 일반, 99:삭제']
  "fbx03_crt_date" "timestamp without time zone" [not null, default: `CURRENT_TIMESTAMP`, note: '생성일시']
  "fbx03_note" "character varying(500)" [note: '비고']

  indexes {
    (fbx03_box_id) [name: 'fbx03_file_idx01']
  }

  Note: '파일보관함-File'
}

```
