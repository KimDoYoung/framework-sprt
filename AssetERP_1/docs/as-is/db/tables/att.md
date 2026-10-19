# 테이블: att

6개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `att01_work_policy` | 근태 기준 정책 (회사별 출퇴근 기준) | 14 |
| `att02_commute` | 출퇴근 기록 | 17 |
| `att03_overtime_req` | 연장근무 신청 | 14 |
| `att04_commute_hist` | 출퇴근 수정 이력 | 9 |
| `att05_excluded_person` | 출퇴근 미사용 사원 | 9 |
| `att05_pm_work` | 오후근무 신청 | 6 |

## DBML

```dbml
Table "public"."att01_work_policy" {
  "att01_work_policy_id" "numeric" [pk, note: '근태정책ID']
  "att01_company_id" "numeric" [not null, note: '회사ID']
  "att01_start_date" "timestamp without time zone" [not null, note: '적용시작일']
  "att01_work_start_time" "character varying(10)" [note: '출근시간']
  "att01_work_end_time" "character varying(10)" [note: '퇴근시간']
  "att01_break_minutes" "numeric" [note: '휴게시간(분)']
  "att01_overtime_minutes" "numeric" [note: '연장허용시간(분)']
  "att01_start_grace_after_minutes" "numeric" [note: '출근 지각 허용시간(분)']
  "att01_end_grace_before_minutes" "numeric" [note: '퇴근 조기 허용시간(분)']
  "att01_end_grace_after_minutes" "numeric" [note: '퇴근 초과 인정 유예시간(분)']
  "att01_use_yn" "character varying(5)" [note: '사용여부']
  "att01_note" "character varying(500)" [note: '비고']
  "att01_pm_work_start_time" "character varying(10)" [note: '오후근무 출근시간']
  "att01_pm_work_end_time" "character varying(10)" [note: '오후근무 퇴근시간']

  Note: '근태 기준 정책 (회사별 출퇴근 기준)'
}

Table "public"."att02_commute" {
  "att02_commute_id" "numeric" [pk, note: '출퇴근ID']
  "att02_company_id" "numeric" [not null, note: '회사ID']
  "att02_person_id" "numeric" [not null, note: '사원ID']
  "att02_work_date" "timestamp without time zone" [note: '근무일자']
  "att02_check_in_time" "timestamp without time zone" [note: '출근시간']
  "att02_check_out_time" "timestamp without time zone" [note: '퇴근시간']
  "att02_work_type_cd" "character varying(10)" [note: '근무유형코드']
  "att02_actual_minutes" "numeric" [note: '실제 근로시간(분)']
  "att02_calc_minutes" "numeric" [note: '계산 근로시간(분)']
  "att02_note" "character varying(500)" [note: '비고']
  "att02_mod_date" "timestamp without time zone" [note: '수정일시']
  "att02_mod_person_id" "numeric" [note: '수정자ID']
  "att02_in_reason" "text" [note: '출근사유']
  "att02_out_reason" "text" [note: '퇴근사유']
  "att02_admin_check_yn" "character varying(5)" [note: '관리자 확인필요']
  "att02_ext_check_out_yn" "character varying(5)" [note: '외근 후 퇴근 여부']
  "att02_batch_yn" "character varying(5)"

  Note: '출퇴근 기록'
}

Table "public"."att03_overtime_req" {
  "att03_overtime_req_id" "numeric" [pk, note: '연장근무신청ID']
  "att03_company_id" "numeric" [not null, note: '회사ID']
  "att03_person_id" "numeric" [not null, note: '사원ID']
  "att03_work_date" "timestamp without time zone" [note: '근무일자']
  "att03_overtime_min" "numeric" [note: '연장근무시간(분)']
  "att03_req_status_cd" "character varying(5)" [note: '신청상태 (AprStepStatusCode / 10:대기, 20:승인, 30:반려 )']
  "att03_reason" "text" [note: '사유']
  "att03_confirm_yn" "character varying(5)" [note: '승인여부']
  "att03_confirm_person_id" "numeric" [note: '승인자ID']
  "att03_confirm_reason" "text" [note: '승인자 반려사유']
  "att03_confirm_date" "timestamp without time zone" [note: '승인일시']
  "att03_work_type_cd" "character varying(2)" [note: '구분 (WorkTypeCode / 10:연장근무, 20:야간근무, 30:오후근무 )']
  "att03_work_reward_type_cd" "character varying(2)" [note: '구분 (WorkRewardTypeCode / 10:연장근로수당, 20:보상휴가 )']
  "att03_appr_id" "numeric" [note: '상신ID']

  Note: '연장근무 신청'
}

Table "public"."att04_commute_hist" {
  "att04_commute_hist_id" "numeric" [pk, note: '이력이력ID']
  "att04_commute_id" "numeric" [not null, note: '출퇴근ID']
  "att04_before_in" "timestamp without time zone" [note: '변경전 출근시간']
  "att04_before_out" "timestamp without time zone" [note: '변경전 퇴근시간']
  "att04_after_in" "timestamp without time zone" [note: '변경후 출근시간']
  "att04_after_out" "timestamp without time zone" [note: '변경후 퇴근시간']
  "att04_change_reason" "text" [note: '변경사유']
  "att04_reg_date" "timestamp without time zone" [note: '등록일시']
  "att04_reg_person_id" "numeric" [note: '등록자']

  Note: '출퇴근 수정 이력'
}

Table "public"."att05_excluded_person" {
  "att05_excluded_person_id" "numeric" [pk, note: '출퇴근 미사용 사원ID']
  "att05_company_id" "numeric" [not null, note: '회사ID']
  "att05_person_id" "numeric" [not null, note: '사원ID']
  "att05_start_date" "timestamp without time zone" [note: '시작일']
  "att05_close_date" "timestamp without time zone" [note: '종료일']
  "att05_reason" "text" [note: '사유']
  "att05_note" "text" [note: '비고']
  "att05_reg_date" "timestamp without time zone" [note: '등록일시']
  "att05_reg_person_id" "numeric" [note: '등록자']

  Note: '출퇴근 미사용 사원'
}

Table "public"."att05_pm_work" {
  "att05_pm_work_id" "numeric" [pk, note: '오후근무신청ID']
  "att05_company_id" "numeric" [not null, note: '회사ID']
  "att05_person_id" "numeric" [not null, note: '사원ID']
  "att05_work_date" "timestamp without time zone" [note: '근무일자']
  "att05_reason" "text" [note: '사유']
  "att05_appr_id" "numeric" [note: '상신ID']

  Note: '오후근무 신청'
}

```
