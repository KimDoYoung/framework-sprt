# 테이블: scm

8개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `scm01_sr` | 시스템 개발의뢰 (SR) | 20 |
| `scm02_sr_appr_step` | 시스템 개발의뢰 결재단계 정보 | 10 |
| `scm03_expect_program` | 예상프로그램 | 3 |
| `scm10_dev` | 시스템 개발 | 7 |
| `scm11_dev_step` | 개발단계 정보 | 10 |
| `scm12_dev_step_rule` | 개발단계규칙 기본설정 | 3 |
| `scm13_dev_program` | 개발 프로그램 및 배포정보 | 10 |
| `scm30_program` | 프로그램 | 11 |

## DBML

```dbml
Table "public"."scm01_sr" {
  "scm01_sr_id" "numeric" [pk, note: '시스템 개발의뢰ID(PK)']
  "scm01_system_cd" "character varying(2)" [not null, note: '시스템구분코드(SystemCode - 10:ICAM / 20:AssetERP)']
  "scm01_sr_date" "date" [not null, note: '등록일(요청일)']
  "scm01_person_id" "numeric" [not null, note: '등록자ID']
  "scm01_corp_id" "numeric" [note: '요청회사ID(sys15_corp_id)']
  "scm01_requestor" "character varying(50)" [note: '요청자']
  "scm01_sr_type" "character varying(2)" [note: '요청구분(SrType - 10:신규개발 / 20:변경/추가개발 / 30:하자보수 / 40:데이터변경 / 50:데이터이관 / 90:기타지원)']
  "scm01_sr_content" "text" [note: '요청내용']
  "scm01_appr_status_cd" "character varying(2)" [note: '요청승인상태(AprStatusCode)']
  "scm01_sr_status_cd" "character varying(2)" [note: '처리상태(SrStatus - 10:대기 / 20:진행중 / 30:완료 / 90:이행불가)']
  "scm01_start_date" "date" [note: '처리시작일']
  "scm01_due_date" "date" [note: '처리완료예정일']
  "scm01_close_date" "date" [note: '처리완료일']
  "scm01_result_content" "text" [note: '처리내용']
  "scm01_dev_importance_cd" "character varying(1)" [note: '개발중요도(DevImportanceCode - 1:상 / 2:중 / 3:하)']
  "scm01_expect_period" "character varying(50)" [note: '예상기간']
  "scm01_dev_content" "text" [note: '개발내용요약']
  "scm01_dev_target" "character varying(5)" [note: '개발대상(1or0으로 구성, 화면프로그램|서버프로그램|보고서|DB(DDL/DML)|기타)']
  "scm01_dev_target_etc" "character varying(200)" [note: '개발대상-기타']
  "scm01_sr_no" "character varying" [note: '의뢰번호']

  indexes {
    (scm01_system_cd, scm01_sr_date) [name: 'scm01_sr_idx01']
  }

  Note: '시스템 개발의뢰 (SR)'
}

Table "public"."scm02_sr_appr_step" {
  "scm02_sr_appr_step_id" "numeric" [pk, note: '개발의뢰 결재단계 정보ID(PK)']
  "scm02_sr_id" "numeric" [not null, note: '시스템 개발의뢰ID(scm01_sr_id)']
  "scm02_step_type_cd" "character varying(2)" [not null, note: '결재단계코드(AprStepTypeCode)']
  "scm02_seq" "character varying(10)" [note: '결재단계순서']
  "scm02_step_status_cd" "character varying(2)" [note: '결재상태(AprStepStatusCode)']
  "scm02_appr_date" "timestamp without time zone" [note: '승인/반려일']
  "scm02_note" "character varying(500)" [note: '비고']
  "scm02_reject_reason" "character varying(500)" [note: '반려사유']
  "scm02_step_emp_id" "numeric" [note: '원 결재자 EMP ID']
  "scm02_appr_emp_id" "numeric" [note: '실제 결재자 EMP ID']

  indexes {
    (scm02_sr_id) [name: 'scm02_sr_appr_step_idx01']
  }

  Note: '시스템 개발의뢰 결재단계 정보'
}

Table "public"."scm03_expect_program" {
  "scm03_expect_program_id" "numeric" [pk, note: '예상프로그램ID(PK)']
  "scm03_sr_id" "numeric" [not null, note: '시스템 개발의뢰ID(scm01_sr_id)']
  "scm03_program_id" "numeric" [not null, note: '프로그램ID(scm30_program_id)']

  indexes {
    (scm03_sr_id) [name: 'scm03_expect_program_idx01']
  }

  Note: '예상프로그램'
}

Table "public"."scm10_dev" {
  "scm10_dev_id" "numeric" [pk, note: '시스템 개발ID(PK)']
  "scm10_sr_id" "numeric" [not null, note: '시스템 개발의뢰ID(scm01_sr_id)']
  "scm10_person_id" "numeric" [note: '개발자ID']
  "scm10_start_date" "date" [note: '처리시작일']
  "scm10_due_date" "date" [note: '처리완료예정일']
  "scm10_note" "text" [note: '비고(개발내용)']
  "scm10_reg_date" "date" [note: '등록일']

  indexes {
    (scm10_sr_id) [name: 'scm10_dev_idx01']
    (scm10_sr_id, scm10_person_id) [name: 'scm10_dev_idx02']
  }

  Note: '시스템 개발'
}

Table "public"."scm11_dev_step" {
  "scm11_dev_step_id" "numeric" [pk, note: '개발단계 정보ID(PK)']
  "scm11_dev_id" "numeric" [not null, note: '시스템 개발ID(scm10_dev_id)']
  "scm11_dev_step_seq" "character varying(10)" [not null, note: '개발단계순서']
  "scm11_dev_step_cd" "character varying(2)" [not null, note: '개발단계구분(DevStepCode - 10:개발 / 20:QA / 25:UAT / 90:배포)']
  "scm11_dev_status_cd" "character varying(2)" [note: '개발상태코드(AfterStateCode - 10:이행불가 / 20:진행중 / 90:완료)']
  "scm11_person_id" "numeric" [note: '담당자ID']
  "scm11_result_cd" "character varying(1)" [note: '확인(결과)코드(DevStepResultCode - 1:완료 / 2:반려)']
  "scm11_result_date" "timestamp without time zone" [note: '확인(결과)일시']
  "scm11_result" "text" [note: '확인(결과)상세']
  "scm11_note" "text" [note: '비고']

  indexes {
    (scm11_dev_id) [name: 'scm11_dev_step_idx01']
    (scm11_dev_id, scm11_person_id) [name: 'scm11_dev_step_idx02']
  }

  Note: '개발단계 정보'
}

Table "public"."scm12_dev_step_rule" {
  "scm12_dev_step_rule_id" "numeric" [pk, note: '개발단계규칙 기본설정ID(PK)']
  "scm12_dev_step_seq" "character varying(10)" [not null, note: '개발단계순서']
  "scm12_dev_step_cd" "character varying(2)" [not null, note: '개발단계구분(DevStepCode - 10:개발 / 20 : QA / 25:UAT / 90:배포)']

  Note: '개발단계규칙 기본설정'
}

Table "public"."scm13_dev_program" {
  "scm13_dev_program_id" "numeric" [pk, note: '개발프로그램ID(PK)']
  "scm13_dev_id" "numeric" [not null, note: '시스템 개발ID(scm10_dev_id)']
  "scm13_program_id" "numeric" [not null, note: '프로그램ID(scm30_program_id)']
  "scm13_modi_type" "character varying(1)" [note: '변경구분(ProgramModiType - N:NEW / M:MODI / D:DEL)']
  "scm13_deploy_tgt_yn" "character varying(5)" [note: '배포대상여부']
  "scm13_deploy_seq" "numeric" [note: '배포순서']
  "scm13_deploy_yn" "character varying(5)" [note: '배포여부']
  "scm13_deployer_id" "numeric" [note: '배포자ID']
  "scm13_deploy_date" "timestamp without time zone" [note: '배포일시']
  "scm13_deploy_note" "text" [note: '배포자비고']

  indexes {
    (scm13_dev_id) [name: 'scm13_dev_program_idx01']
    (scm13_program_id) [name: 'scm13_dev_program_idx02']
  }

  Note: '개발 프로그램 및 배포정보'
}

Table "public"."scm30_program" {
  "scm30_program_id" "numeric" [pk, note: '프로그램ID(PK)']
  "scm30_system_cd" "character varying(2)" [not null, note: '시스템구분코드(SystemCode - 10:ICAM / 20:AssetERP)']
  "scm30_program_type" "character varying(2)" [not null, note: '프로그램 구분(ProgramType - 10:PB / 20:SP / 21:SF / 50:RD / 70:JAVA)']
  "scm30_program_cd" "character varying(100)" [not null, note: '프로그램 식별코드']
  "scm30_program_nm" "character varying(300)" [note: '프로그램명']
  "scm30_source" "text" [note: '소스']
  "scm30_version" "numeric" [note: '버전']
  "scm30_person_id" "numeric" [note: '등록자']
  "scm30_reg_date" "timestamp without time zone" [note: '등록일시']
  "scm30_note" "text" [note: '비고']
  "scm30_use_yn" "character varying(5)" [note: '사용여부(true/false)']

  indexes {
    (scm30_system_cd, scm30_program_cd) [name: 'scm30_program_idx01']
  }

  Note: '프로그램'
}

```
