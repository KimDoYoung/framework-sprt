# 테이블: rpt

6개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `rpt01_daily` | 일일업무보고 | 10 |
| `rpt02_month` | 월간보고자료 | 6 |
| `rpt03_week` | 주간업무보고 | 12 |
| `rpt04_week_confirm` | 주간업무보고 확인자정보 | 7 |
| `rpt05_week_biz_class` | 주간업무보고 업무구분(사원별 미사용 체크) | 5 |
| `rpt10_fss_submit` | 금감원 업무보고서 | 8 |

## DBML

```dbml
Table "public"."rpt01_daily" {
  "rpt01_daily_id" "numeric" [pk, note: '일일업무보고ID(PK)']
  "rpt01_company_id" "numeric" [not null, note: '회사ID']
  "rpt01_date" "date" [note: '일자']
  "rpt01_content" "text" [note: '업무내용']
  "rpt01_note" "text" [note: '비고']
  "rpt01_person_id" "numeric" [note: '사원ID']
  "rpt01_confirm_yn" "character varying(5)" [note: '확인여부']
  "rpt01_confirm_datetime" "timestamp without time zone" [note: '확인일시']
  "rpt01_confirmer_id" "numeric" [note: '확인자ID']
  "rpt01_confirm_note" "character varying(500)" [note: '확인자비고']

  Note: '일일업무보고'
}

Table "public"."rpt02_month" {
  "rpt02_month_id" "numeric" [pk, note: '월간보고자료ID(PK)']
  "rpt02_company_id" "numeric" [note: '회사ID']
  "rpt02_person_id" "numeric" [note: '사원ID']
  "rpt02_yyyymm" "character varying(7)" [note: '보고년월(YYYY.MM)']
  "rpt02_content" "text" [note: '내용']
  "rpt02_note" "text" [note: '비고']

  Note: '월간보고자료'
}

Table "public"."rpt03_week" {
  "rpt03_week_id" "numeric" [pk, note: '주간업무보고ID(PK)']
  "rpt03_company_id" "numeric" [note: '회사ID']
  "rpt03_person_id" "numeric" [note: '사원ID']
  "rpt03_week_start_date" "date" [note: '주간업무 시작일자']
  "rpt03_week_close_date" "date" [note: '주간업무 종료일자']
  "rpt03_biz_type" "character varying(3)" [note: '업무구분(WeekBizType)']
  "rpt03_content" "text" [note: '업무내용']
  "rpt03_due_date" "character varying(50)" [note: '일정(완료예정일)']
  "rpt03_seq" "numeric" [note: '순번']
  "rpt03_bold" "character varying(5)" [note: '굵게']
  "rpt03_note" "text" [note: '비고']
  "rpt03_fix_yn" "character varying(5)" [note: '확정(제출)여부']

  indexes {
    (rpt03_company_id, rpt03_week_start_date) [name: 'rpt03_week_idx01']
    (rpt03_company_id, rpt03_person_id, rpt03_week_start_date) [name: 'rpt03_week_idx02']
  }

  Note: '주간업무보고'
}

Table "public"."rpt04_week_confirm" {
  "rpt04_week_confirm_id" "numeric" [pk, note: '주간업무보고 확인자정보ID(PK)']
  "rpt04_company_id" "numeric" [note: '회사ID']
  "rpt04_person_id" "numeric" [note: '사원ID']
  "rpt04_week_start_date" "date" [note: '주간업무 시작일자']
  "rpt04_confirmer_id" "numeric" [note: '확인자ID']
  "rpt04_confirm_datetime" "timestamp without time zone" [note: '확인일시']
  "rpt04_note" "text" [note: '확인자비고']

  indexes {
    (rpt04_company_id, rpt04_person_id, rpt04_week_start_date) [name: 'rpt04_week_confirm_idx01']
  }

  Note: '주간업무보고 확인자정보'
}

Table "public"."rpt05_week_biz_class" {
  "rpt05_week_biz_class_id" "numeric" [pk, note: '업무구분ID(PK)']
  "rpt05_company_id" "numeric" [note: '회사ID']
  "rpt05_person_id" "numeric" [note: '사원ID']
  "rpt05_week_biz_type" "character varying(3)" [note: '업무구분코드(WeekBizType)']
  "rpt05_un_use_yn" "character varying(5)" [note: '미사용여부']

  indexes {
    (rpt05_person_id) [name: 'rpt05_week_biz_class_idx01']
  }

  Note: '주간업무보고 업무구분(사원별 미사용 체크)'
}

Table "public"."rpt10_fss_submit" {
  "rpt10_fss_submit_id" "numeric" [pk, note: '금감원 업무보고서ID(PK)']
  "rpt10_report_cd" "character varying(5)" [not null, unique, note: '보고서코드']
  "rpt10_report_nm" "character varying(200)" [note: '보고서명']
  "rpt10_submit_cycle_cd" "character varying(5)" [note: '제출주기코드(CycleCode001)']
  "rpt10_write_target" "character varying(200)" [note: '작성대상']
  "rpt10_write_guide" "text" [note: '작성요령']
  "rpt10_revise_history" "text" [note: '개정연혁']
  "rpt10_note" "text" [note: '비고']

  indexes {
    (rpt10_report_cd) [name: 'rpt10_fss_submit_idx01']
  }

  Note: '금감원 업무보고서'
}

```
