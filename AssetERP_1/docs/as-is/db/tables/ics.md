# 테이블: ics

24개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `ics01_class_tree` | 내부통제 분류 | 13 |
| `ics02_manager` | 내부통제 회사별 담당자정보 | 6 |
| `ics03_company_info` | 내부통제 회사별 관리 | 7 |
| `ics04_share` | 내부통제 공유 | 6 |
| `ics05_relate_manager` | 담당자 연결 | 4 |
| `ics10_checklist` | 내부통제 체크리스트 | 7 |
| `ics11_checklist_company` | 내부통제 체크리스트(고객사정보관리) | 5 |
| `ics15_checklist_write` | 내부통제 체크리스트 작성 | 14 |
| `ics16_relate_appr` | 상신 연관문서 매핑 | 7 |
| `ics17_user_request` | 법규등록요청 | 14 |
| `ics19_revision_relate_ics` | 개정내역 법규 연결 | 3 |
| `ics20_revision_history` | 법규정보 개정내역 | 10 |
| `ics21_checklist_l_class` | 내부통제 체크리스트 대분류 | 7 |
| `ics22_checklist_l_class_company` | 내부통제 체크리스트 대분류(고객사별정보) | 6 |
| `ics23_checklist_m_class` | 내부통제 체크리스트 중분류 | 8 |
| `ics24_checklist_m_class_company` | 내부통제 체크리스트 중분류(고객사별정보) | 6 |
| `ics30_compliance` | 임직원 내부통제 준수리스트 | 11 |
| `ics31_compliance_write` | 임직원 내부통제 준수서약서 | 15 |
| `ics32_relate_appr` | 임직원 내부통제 준수서약서 상신문서 연결 | 5 |
| `ics33_compliance_answer` | 임직원 내부통제 준수리스트 준수답변 | 10 |
| `ics35_extr_activity` | 대외활동신청 | 12 |
| `ics40_dcr_preconfirm` | 준감인 사전확인대장 | 24 |
| `ics41_dcr_type` | 준감인 사전확인대장분류 | 6 |
| `ics99_class_tree_del` | 내부통제 삭제이력 | 16 |

## DBML

```dbml
Table "public"."ics01_class_tree" {
  "ics01_class_tree_id" "numeric" [pk, note: '내부통제 분류ID(PK)']
  "ics01_parent_tree_id" "numeric" [not null, note: '상위문서분류ID']
  "ics01_class_tree_cd" "character varying(10)" [not null, note: '문서분류코드']
  "ics01_class_tree_nm" "text" [not null, note: '내부통제 분류명']
  "ics01_seq" "character varying(10)" [note: '순번']
  "ics01_related_law" "character varying(400)" [note: '관련법령_1']
  "ics01_submit_to" "character varying(200)" [note: '제출처']
  "ics01_company_id" "numeric" [note: '회사ID']
  "ics01_type_cd" "character varying(5)" [note: '내부통제 분류구분']
  "ics01_use_yn" "character varying(5)" [note: '사용여부']
  "ics01_content" "text" [note: '상세내용']
  "ics01_public_type" "character varying(1)" [note: '공모구분(IcsPublicType)']
  "ics01_advis_yn" "character varying(5)" [note: '자문(일임)관련법규 여부']

  indexes {
    (ics01_parent_tree_id) [name: 'ics01_class_tree_idx01']
  }

  Note: '내부통제 분류'
}

Table "public"."ics02_manager" {
  "ics02_manager_id" "numeric" [pk, note: '회사별 담당자 정보ID(PK)']
  "ics02_company_id" "numeric" [not null, note: '회사ID']
  "ics02_manager_group_nm" "character varying(100)" [note: '담당자 그룹명']
  "ics02_person_id" "numeric" [note: '담당자(사원ID)']
  "ics02_note" "character varying(500)" [note: '비고']
  "ics02_default_yn" "character varying(5)" [note: '기본설정(미지정담당자(true)))']

  indexes {
    (ics02_company_id, ics02_manager_group_nm) [name: 'ics02_manager_idx01']
  }

  Note: '내부통제 회사별 담당자정보'
}

Table "public"."ics03_company_info" {
  "ics03_company_info_id" "numeric" [pk, note: 'Key-ID(PK)']
  "ics03_company_id" "numeric" [not null, note: '회사ID']
  "ics03_ics_class_tree_id" "numeric" [note: '내부통제분류ID']
  "ics03_note" "character varying(500)" [note: '비고']
  "ics03_except_yn" "character varying(5)" [note: '제외여부']
  "ics03_auto_yn" "character varying(5)" [note: 'ICAM(시스템)자동처리']
  "ics03_advis_yn" "character varying(5)" [note: '자문(일임)관련법규 여부']

  indexes {
    (ics03_company_id, ics03_ics_class_tree_id) [name: 'ics03_company_info_idx01']
  }

  Note: '내부통제 회사별 관리'
}

Table "public"."ics04_share" {
  "ics04_share_id" "numeric" [pk, note: '내부통제 공유ID(PK)']
  "ics04_manager_id" "numeric" [not null, note: '담당자 ID(ics02_manager_id))']
  "ics04_share_cd" "character varying(1)" [not null, note: '공유자 구분(직원/부서)']
  "ics04_person_id" "numeric" [note: '공유자ID']
  "ics04_org_id" "numeric" [note: '공유 부서ID']
  "ics04_company_id" "numeric" [note: '회사ID']

  Note: '내부통제 공유'
}

Table "public"."ics05_relate_manager" {
  "ics05_relate_manager_id" "numeric" [pk, note: '담당자 연결ID(PK)']
  "ics05_company_id" "numeric" [not null, note: '회사ID']
  "ics05_ics_class_tree_id" "numeric" [not null, note: '내부통제ID(ics01_class_tree_id)']
  "ics05_manager_id" "numeric" [not null, note: '담당자ID(ics02_manager_id)']

  Note: '담당자 연결'
}

Table "public"."ics10_checklist" {
  "ics10_checklist_id" "numeric" [pk, note: '내부통제 체크리스트ID(PK)']
  "ics10_company_id" "numeric" [not null, note: '회사ID(공통관리-0번회사만 사용)']
  "ics10_content" "text" [note: '체크내용']
  "ics10_criterion" "text" [note: '근거(관련법령)']
  "ics10_use_yn" "character varying(5)" [note: '사용여부(true/false)']
  "ics10_checklist_m_class_id" "numeric" [note: '내부통제 체크리스트 중분류ID(ics23_checklist_m_class_id)']
  "ics10_seq" "numeric" [note: '조회순서']

  indexes {
    (ics10_company_id, ics10_checklist_m_class_id) [name: 'ics10_checklist_idx01']
  }

  Note: '내부통제 체크리스트'
}

Table "public"."ics11_checklist_company" {
  "ics11_checklist_company_id" "numeric" [pk, note: '내부통제 체크리스트(고객사정보관리)ID(PK)']
  "ics11_company_id" "numeric" [not null, note: '회사ID']
  "ics11_checklist_id" "numeric" [note: '내부통제 체크리스트ID(ics10_checklist_id)']
  "ics11_write_group_id" "numeric" [note: '작성그룹ID(sch22_write_group_id)']
  "ics11_use_yn" "character varying(5)" [note: '사용여부(true/false)']

  indexes {
    (ics11_checklist_id) [name: 'ics11_checklist_company_idx01']
    (ics11_company_id, ics11_checklist_id) [name: 'ics11_checklist_company_idx02']
  }

  Note: '내부통제 체크리스트(고객사정보관리)'
}

Table "public"."ics15_checklist_write" {
  "ics15_checklist_write_id" "numeric" [pk, note: '내부통제 체크리스트 작성ID(PK)']
  "ics15_company_id" "numeric" [not null, note: '회사ID']
  "ics15_checklist_id" "numeric" [note: '내부통제 체크리스트ID(ics10_checklist_id)']
  "ics15_check_yyyymm" "character varying(7)" [note: '체크년월(YYYY.MM)']
  "ics15_answer_cd" "character varying(1)" [note: '답변코드(Y/N/X)']
  "ics15_reason" "character varying(500)" [note: '사유']
  "ics15_person_id" "numeric" [note: '작성자(담당자)ID']
  "ics15_answer_datetime" "timestamp without time zone" [note: '답변일시']
  "ics15_confirm_yn" "character varying(5)" [note: '확인여부']
  "ics15_confirmer_id" "numeric" [note: '확인자ID']
  "ics15_confirm_datetime" "timestamp without time zone" [note: '확인일시']
  "ics15_note" "character varying(200)" [note: '비고']
  "ics15_cycle_type" "character varying(1)" [note: '체크주기구분(M:월/Q:분기)-IcsCheckListCycleType']
  "ics15_fix_yn" "character varying(5)" [note: '확정여부']

  indexes {
    (ics15_checklist_id, ics15_company_id, ics15_check_yyyymm, ics15_cycle_type, ics15_person_id) [name: 'ics15_checklist_write_idx01']
    (ics15_company_id, ics15_check_yyyymm, ics15_cycle_type, ics15_person_id) [name: 'ics15_checklist_write_idx02']
  }

  Note: '내부통제 체크리스트 작성'
}

Table "public"."ics16_relate_appr" {
  "ics16_relate_appr_id" "numeric" [pk, note: '연관문서 ID(PK)']
  "ics16_company_id" "numeric" [not null, note: '회사ID']
  "ics16_check_yyyymm" "character varying(7)" [note: '체크년월(YYYY.MM)']
  "ics16_cycle_type" "character varying(1)" [note: '체크주기구분(M:월/Q:분기)']
  "ics16_appr_id" "numeric" [not null, note: '상신ID']
  "ics16_confirmer_id" "numeric" [note: '확인자ID']
  "ics16_checklist_l_class_id" "numeric" [note: '내부통제 체크리스트 대분류ID(ics21_checklist_l_class_id)']

  indexes {
    (ics16_company_id, ics16_check_yyyymm, ics16_cycle_type, ics16_checklist_l_class_id) [name: 'ics16_relate_appr_idx01']
  }

  Note: '상신 연관문서 매핑'
}

Table "public"."ics17_user_request" {
  "ics17_user_request_id" "numeric" [pk, note: '법규등록요청ID(PK)']
  "ics17_company_id" "numeric" [note: '요청회사ID']
  "ics17_person_id" "numeric" [note: '요청자ID']
  "ics17_reg_date" "date" [note: '요청(등록)일']
  "ics17_law_title" "character varying(200)" [note: '법규명']
  "ics17_law_content" "text" [note: '법규내용']
  "ics17_submit_to" "character varying(200)" [note: '보고처']
  "ics17_related_law" "character varying(200)" [note: '법규조항']
  "ics17_report_cycle" "character varying(100)" [note: '보고주기']
  "ics17_result" "text" [note: '처리내용']
  "ics17_note" "text" [note: '비고']
  "ics17_state_cd" "character varying(2)" [note: '상태(AfterStateCode)']
  "ics17_close_date" "date" [note: '완료일']
  "ics17_confirm_yn" "character varying(5)" [note: '요청자확인여부']

  Note: '법규등록요청'
}

Table "public"."ics19_revision_relate_ics" {
  "ics19_revision_relate_ics_id" "numeric" [pk, note: '법규개정내역법규연결ID(PK)']
  "ics19_revision_history_id" "numeric" [note: '법규개정내역ID(ics20_revision_history_id)']
  "ics19_class_tree_id" "numeric" [note: '법규ID(ics01_class_tree_id)']

  indexes {
    (ics19_revision_history_id) [name: 'ics19_revision_relate_ics_idx01']
  }

  Note: '개정내역 법규 연결'
}

Table "public"."ics20_revision_history" {
  "ics20_revision_history_id" "numeric" [pk, note: '법규정보 개정내역 ID(PK)']
  "ics20_reg_date" "timestamp without time zone" [note: '등록일']
  "ics20_effect_date" "timestamp without time zone" [note: '시행일']
  "ics20_title" "character varying(500)" [note: '제목']
  "ics20_finance_agency_cd" "character varying(2)" [note: '관할기관(FinanceAgencyCode : 금융위원회/금융감독원/금융투자협회)']
  "ics20_note" "text" [note: '비고']
  "ics20_before_notice_date" "timestamp without time zone" [note: '사전예고일']
  "ics20_submission_date" "timestamp without time zone" [note: '의견제출일']
  "ics20_reflection_date" "timestamp without time zone" [note: '법규반영일']
  "ics20_related_law" "text" [note: '관련법령(조문)']

  Note: '법규정보 개정내역'
}

Table "public"."ics21_checklist_l_class" {
  "ics21_checklist_l_class_id" "numeric" [pk, note: '내부통제 체크리스트 대분류ID(PK)']
  "ics21_checklist_l_class_nm" "character varying(100)" [not null, note: '내부통제 체크리스트 대분류명']
  "ics21_company_id" "numeric" [not null, note: '회사ID']
  "ics21_use_yn" "character varying(5)" [note: '사용여부']
  "ics21_note" "text" [note: '비고']
  "ics21_seq" "numeric" [note: '조회순서']
  "ics21_close_date" "date" [note: '사용종료일']

  Note: '내부통제 체크리스트 대분류'
}

Table "public"."ics22_checklist_l_class_company" {
  "ics22_checklist_l_class_company_id" "numeric" [pk, note: '내부통제 체크리스트 대분류(고객사별정보)ID(PK)']
  "ics22_company_id" "numeric" [not null, note: '회사ID']
  "ics22_checklist_l_class_id" "numeric" [not null, note: '내부통제 체크리스트 대분류ID(ics21_checklist_l_class_id)']
  "ics22_use_yn" "character varying(5)" [note: '사용여부']
  "ics22_note" "text" [note: '비고']
  "ics22_close_date" "date" [note: '사용종료일']

  indexes {
    (ics22_company_id, ics22_checklist_l_class_id) [unique, name: 'ics22_checklist_l_class_company_idx01']
  }

  Note: '내부통제 체크리스트 대분류(고객사별정보)'
}

Table "public"."ics23_checklist_m_class" {
  "ics23_checklist_m_class_id" "numeric" [pk, note: '내부통제 체크리스트 중분류ID(PK)']
  "ics23_checklist_m_class_nm" "character varying(100)" [not null, note: '내부통제 체크리스트 중분류명']
  "ics23_checklist_l_class_id" "numeric" [not null, note: '내부통제 체크리스트 대분류ID(ics21_checklist_l_class_id)']
  "ics23_company_id" "numeric" [not null, note: '회사ID']
  "ics23_use_yn" "character varying(5)" [note: '사용여부']
  "ics23_note" "text" [note: '비고']
  "ics23_seq" "numeric" [note: '조회순서']
  "ics23_close_date" "date" [note: '사용종료일']

  indexes {
    (ics23_company_id, ics23_checklist_l_class_id) [name: 'ics23_checklist_m_class_idx01']
  }

  Note: '내부통제 체크리스트 중분류'
}

Table "public"."ics24_checklist_m_class_company" {
  "ics24_checklist_m_class_company_id" "numeric" [pk, note: '내부통제 체크리스트 중분류(고객사별정보)ID(PK)']
  "ics24_company_id" "numeric" [not null, note: '회사ID']
  "ics24_checklist_m_class_id" "numeric" [not null, note: '내부통제 체크리스트 중분류ID(ics23_checklist_m_class_id)']
  "ics24_use_yn" "character varying(5)" [note: '사용여부']
  "ics24_note" "text" [note: '비고']
  "ics24_close_date" "date" [note: '사용종료일']

  indexes {
    (ics24_company_id, ics24_checklist_m_class_id) [unique, name: 'ics24_checklist_m_class_company_idx01']
  }

  Note: '내부통제 체크리스트 중분류(고객사별정보)'
}

Table "public"."ics30_compliance" {
  "ics30_compliance_id" "numeric" [pk, note: '임직원 내부통제 준수리스트ID(PK)']
  "ics30_company_id" "numeric" [not null, note: '회사ID']
  "ics30_start_date" "date" [not null, note: '기준적용시작일']
  "ics30_compliance_type" "character varying(3)" [not null, note: '임직원 내부통제 준수구분(IcsComplianceType)']
  "ics30_sub_num" "character varying(5)" [note: '내부번호']
  "ics30_content" "text" [note: '내용']
  "ics30_na_use_yn" "character varying(5)" [note: '해당없음 사용여부']
  "ics30_use_yn" "character varying(5)" [note: '사용여부']
  "ics30_use_close_date" "date" [note: '사용종료일']
  "ics30_note" "text" [note: '비고']
  "ics30_date_fix_yn" "character varying(5)" [note: '준수리스트 확정여부']

  indexes {
    (ics30_start_date) [name: 'ics30_compliance_idx01']
  }

  Note: '임직원 내부통제 준수리스트'
}

Table "public"."ics31_compliance_write" {
  "ics31_compliance_write_id" "numeric" [pk, note: '임직원 내부통제 준수서약서ID(PK)']
  "ics31_company_id" "numeric" [not null, note: '회사ID']
  "ics31_compliance_id" "numeric" [not null, note: '임직원 내부통제 준수리스트ID(ics30_compliance_id)']
  "ics31_yyyymm" "character varying(7)" [note: '준수년월(YYYY.MM)']
  "ics31_person_id" "numeric" [note: '사원ID']
  "ics31_answer_cd" "character varying(1)" [note: '답변코드(AnswerCode-Y:예/N:아니오/X:해당없음)']
  "ics31_reason" "text" [note: '사유']
  "ics31_note" "text" [note: '비고']
  "ics31_write_datetime" "timestamp without time zone" [note: '작성일시']
  "ics31_fix_yn" "character varying(5)" [note: '확정여부']
  "ics31_fix_datetime" "timestamp without time zone" [note: '확정일시']
  "ics31_confirmer_id" "numeric" [note: '확인자ID']
  "ics31_confirm_yn" "character varying(5)" [note: '확인여부']
  "ics31_confirm_datetime" "timestamp without time zone" [note: '확인일시']
  "ics31_cycle_type" "character varying(1)" [note: '작성주기구분(M:월/Q:분기)-IcsCheckListCycleType']

  indexes {
    (ics31_company_id, ics31_yyyymm) [name: 'ics31_compliance_write_idx01']
    (ics31_company_id, ics31_yyyymm, ics31_person_id) [name: 'ics31_compliance_write_idx02']
    (ics31_company_id, ics31_yyyymm, ics31_compliance_id) [name: 'ics31_compliance_write_idx03']
  }

  Note: '임직원 내부통제 준수서약서'
}

Table "public"."ics32_relate_appr" {
  "ics32_relate_appr_id" "numeric" [pk, note: '임직원 내부통제 준수서약서 상신문서 연결ID(PK)']
  "ics32_company_id" "numeric" [not null, note: '회사ID']
  "ics32_yyyymm" "character varying(7)" [note: '준수년월(YYYY.MM)']
  "ics32_appr_id" "numeric" [note: '상신ID']
  "ics32_cycle_type" "character varying(1)" [note: '작성주기구분(M:월/Q:분기)-IcsCheckListCycleType']

  indexes {
    (ics32_company_id, ics32_yyyymm) [name: 'ics32_relate_appr_idx01']
  }

  Note: '임직원 내부통제 준수서약서 상신문서 연결'
}

Table "public"."ics33_compliance_answer" {
  "ics33_compliance_answer_id" "numeric" [pk, note: '임직원 내부통제 준수리스트 준수답변ID(PK)']
  "ics33_company_id" "numeric" [not null, note: '회사ID']
  "ics33_start_date" "date" [not null, note: '기준적용시작일']
  "ics33_compliance_type" "character varying(3)" [not null, note: '임직원 내부통제 준수구분(IcsComplianceType)']
  "ics33_case_no" "numeric" [note: '케이스번호']
  "ics33_answer1_cd" "character varying(1)" [note: '답변코드1(AnswerCode-Y:예/N:아니오/X:해당없음)']
  "ics33_answer2_cd" "character varying(1)" [note: '답변코드2(AnswerCode-Y:예/N:아니오/X:해당없음)']
  "ics33_answer3_cd" "character varying(1)" [note: '답변코드3(AnswerCode-Y:예/N:아니오/X:해당없음)']
  "ics33_answer4_cd" "character varying(1)" [note: '답변코드4(AnswerCode-Y:예/N:아니오/X:해당없음)']
  "ics33_answer5_cd" "character varying(1)" [note: '답변코드5(AnswerCode-Y:예/N:아니오/X:해당없음)']

  indexes {
    (ics33_company_id, ics33_compliance_type, ics33_start_date) [name: 'ics33_compliance_answer_idx01']
  }

  Note: '임직원 내부통제 준수리스트 준수답변'
}

Table "public"."ics35_extr_activity" {
  "ics35_extr_activity_id" "numeric" [pk, note: '대외활동신청ID(PK)']
  "ics35_company_id" "numeric" [note: '회사ID']
  "ics35_person_id" "numeric" [note: '사원ID']
  "ics35_reg_date" "date" [note: '신청일자']
  "ics35_activity_corp" "character varying(100)" [note: '활동처']
  "ics35_activity_tgt_cd" "character varying(2)" [note: '활동대상코드(ExtrActivityTargetCode)']
  "ics35_activity_tgt_etc" "character varying(100)" [note: '활동대상 직접기재']
  "ics35_activity_period" "character varying(50)" [note: '활동기간']
  "ics35_activity_desc" "text" [note: '활동내용']
  "ics35_activity_pay" "character varying(50)" [note: '활동보수']
  "ics35_appr_id" "numeric" [note: '활동신청 상신ID']
  "ics35_result_appr_id" "numeric" [note: '결과보고 상신ID']

  indexes {
    (ics35_company_id, ics35_reg_date) [name: 'ics35_extr_activity_idx01']
    (ics35_person_id) [name: 'ics35_extr_activity_idx02']
  }

  Note: '대외활동신청'
}

Table "public"."ics40_dcr_preconfirm" {
  "ics40_dcr_preconfirm_id" "numeric" [pk, note: '준감인 사전확인대장ID(PK)']
  "ics40_company_id" "numeric" [note: '회사ID']
  "ics40_reg_date" "date" [note: '신청일']
  "ics40_person_id" "numeric" [note: '신청자']
  "ics40_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']
  "ics40_dcr_type_cd" "character varying(5)" [note: '대장분류코드(ics41_dcr_type_cd)']
  "ics40_provide_co" "character varying(100)" [note: '제공처']
  "ics40_content" "character varying(200)" [note: '내용']
  "ics40_appr_no_prefix" "character varying(10)" [note: '심사필번호1(년도-대장분류코드)']
  "ics40_appr_no_seq" "numeric" [note: '심사필번호2(순번)']
  "ics40_pre_appr_no" "character varying(50)" [note: '사전 심사필번호']
  "ics40_ad_type" "character varying(2)" [note: '광고종류코드(AdType)']
  "ics40_media_type" "character varying(2)" [note: '매체종류코드(MediaType)']
  "ics40_ad_item_nm" "character varying(100)" [note: '광고상품명']
  "ics40_ad_content" "character varying(200)" [note: '광고내용']
  "ics40_start_date" "date" [note: '최초사용예정일']
  "ics40_close_date" "date" [note: '최종사용예정일']
  "ics40_spec" "character varying(50)" [note: '규격']
  "ics40_qty_cnt" "character varying(50)" [note: '수량/회수']
  "ics40_status_cd" "character varying(2)" [note: '승인상태(StatusCode0003-10:신청/20:승인/80:PASS)']
  "ics40_confirmer_id" "numeric" [note: '승인자']
  "ics40_confirm_date" "date" [note: '승인일']
  "ics40_confirm_msg" "text" [note: '승인자(준감인)의견']
  "ics40_reg_emp_msg" "text" [note: '신청자의견']

  indexes {
    (ics40_company_id, ics40_reg_date) [name: 'ics40_dcr_preconfirm_idx01']
    (ics40_appr_id) [name: 'ics40_dcr_preconfirm_idx02']
  }

  Note: '준감인 사전확인대장'
}

Table "public"."ics41_dcr_type" {
  "ics41_dcr_type_id" "numeric" [pk, note: '준감인 사전확인대장분류ID(PK)']
  "ics41_company_id" "numeric" [note: '회사ID']
  "ics41_dcr_type_cd" "character varying(3)" [note: '대장분류코드']
  "ics41_dcr_type_nm" "character varying(50)" [note: '대장분류명']
  "ics41_ad_yn" "character varying(5)" [note: '광고물여부']
  "ics41_use_yn" "character varying(5)" [note: '사용여부']

  indexes {
    (ics41_company_id, ics41_dcr_type_cd) [name: 'ics41_dcr_type_idx01']
  }

  Note: '준감인 사전확인대장분류'
}

Table "public"."ics99_class_tree_del" {
  "ics99_class_tree_del_id" "numeric" [pk, note: '내부통제 삭제이력ID(PK)']
  "ics99_person_id" "numeric" [not null]
  "ics99_delete_date" "date" [not null]
  "ics99_class_tree_id" "numeric" [not null]
  "ics99_parent_tree_id" "numeric" [not null]
  "ics99_class_tree_cd" "character varying(10)"
  "ics99_class_tree_nm" "text"
  "ics99_seq" "character varying(10)"
  "ics99_related_law" "character varying(400)"
  "ics99_submit_to" "character varying(200)"
  "ics99_company_id" "numeric"
  "ics99_type_cd" "character varying(5)"
  "ics99_use_yn" "character varying(5)"
  "ics99_content" "text"
  "ics99_public_type" "character varying(1)"
  "ics99_advis_yn" "character varying(5)" [note: '자문(일임)관련법규 여부']

  Note: '내부통제 삭제이력'
}

```
