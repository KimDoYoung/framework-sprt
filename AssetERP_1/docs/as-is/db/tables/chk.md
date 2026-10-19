# 테이블: chk

4개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `chk01_class_tree` | 체크리스트분류 | 8 |
| `chk02_daily_list` | 일일점검항목관리 | 11 |
| `chk03_daily_list_write` | 일일점검표 작성 | 12 |
| `chk50_act_notice` | 관리회계체크알림 | 10 |

## DBML

```dbml
Table "public"."chk01_class_tree" {
  "chk01_class_tree_id" "numeric" [pk, note: '체크리스트분류ID(PK)']
  "chk01_company_id" "numeric" [not null, note: '회사ID']
  "chk01_parent_tree_id" "numeric" [not null, note: '상위체크리스트분류ID']
  "chk01_class_tree_nm" "character varying(100)" [note: '체크리스트분류명']
  "chk01_seq" "numeric" [note: '조회순번']
  "chk01_use_yn" "character varying(5)" [note: '사용여부(true/false)']
  "chk01_note" "character varying(500)" [note: '비고']
  "chk01_link_cd" "character varying(2)" [note: 'ChkLinkCode']

  Note: '체크리스트분류'
}

Table "public"."chk02_daily_list" {
  "chk02_daily_list_id" "numeric" [pk, note: '일일점검항목관리ID(PK)']
  "chk02_company_id" "numeric" [not null, note: '회사ID']
  "chk02_class_tree_id" "numeric" [note: '체크리스트분류ID(chk01_class_tree_id)']
  "chk02_content" "text" [note: '점검내용']
  "chk02_explan" "text" [note: '설명']
  "chk02_cutoff" "character varying(100)" [note: 'CutOff']
  "chk02_window_no" "character varying(100)" [note: '화면번호']
  "chk02_seq" "numeric" [note: '조회순서']
  "chk02_use_yn" "character varying(5)" [note: '사용여부(true/false)']
  "chk02_write_group_id" "numeric" [note: '작성그룹ID(sch22_write_group_id)']
  "chk02_admin_daily_list_id" "numeric" [note: '관리자 일일점검항목관리ID(chk02_daily_list_id)']

  Note: '일일점검항목관리'
}

Table "public"."chk03_daily_list_write" {
  "chk03_daily_list_write_id" "numeric" [pk, note: '일일점검표 작성ID(PK)']
  "chk03_company_id" "numeric" [not null, note: '회사ID']
  "chk03_daily_list_id" "numeric" [note: '일일점검항목관리ID(chk02_daily_list_id)']
  "chk03_date" "date" [note: '작성일자']
  "chk03_answer_cd" "character varying(1)" [note: '답변코드(AnswerCode-Y/N/X)']
  "chk03_reason" "character varying(500)" [note: '사유']
  "chk03_person_id" "numeric" [note: '작성자(담당자)ID']
  "chk03_answer_datetime" "timestamp without time zone" [note: '답변일시']
  "chk03_confirm_yn" "character varying(5)" [note: '확인여부']
  "chk03_confirmer_id" "numeric" [note: '확인자ID']
  "chk03_confirm_datetime" "timestamp without time zone" [note: '확인일시']
  "chk03_note" "character varying(200)" [note: '비고']

  Note: '일일점검표 작성'
}

Table "public"."chk50_act_notice" {
  "chk50_act_notice_id" "numeric" [pk, note: '관리회계체크알림ID(PK)']
  "chk50_company_id" "numeric" [not null, note: '회사ID']
  "chk50_date" "date" [note: '체크대상일자']
  "chk50_tr_cd" "character varying(4)" [note: '체크대상거래코드']
  "chk50_tr_id" "numeric" [note: '체크대상거래ID']
  "chk50_notice" "text" [note: '알림메세지']
  "chk50_note" "text" [note: '비고']
  "chk50_check_yn" "character varying(5)" [note: '체크여부']
  "chk50_occ_date" "timestamp without time zone" [note: '발생일시']
  "chk50_person_id" "numeric" [note: '처리자ID']

  Note: '관리회계체크알림'
}

```
