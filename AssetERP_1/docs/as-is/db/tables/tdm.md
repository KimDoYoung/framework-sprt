# 테이블: tdm

54개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `tdm01_hr` | 인사(임원)정보 | 15 |
| `tdm02_hr_record` | 인사변동사항 반영정보 | 12 |
| `tdm03_add_title` | 직무겸직정보 | 9 |
| `tdm05_cncl` | 위원회(회의체) 정보 | 10 |
| `tdm06_cncl_record` | 이사회 의결기록 | 7 |
| `tdm07_rule` | 내규관리 | 7 |
| `tdm08_manager_info` | 책무관리자 | 9 |
| `tdm09_appr_step` | 책무승인단계 | 10 |
| `tdm09_appr_step_20260512` |  | 10 |
| `tdm10_task` | 책무정보 | 11 |
| `tdm11_task_relate_rule` | 책무연결정보-규정(법규/내규) | 8 |
| `tdm12_task_relate_detail` | 책무연결정보-세부내용 | 7 |
| `tdm13_task_relate_duty` | 책무연결정보-관리의무 | 8 |
| `tdm14_task_type` | 책무유형정의 | 8 |
| `tdm20_role` | 직책정보 | 11 |
| `tdm21_role_relate_task` | 직책연결정보-책무 | 3 |
| `tdm22_role_relate_cncl` | 직책연결정보-위원회 | 6 |
| `tdm23_role_relate_org` | 직책연결정보-담당부서 | 3 |
| `tdm30_role_allc` | 직책(책무)배분 | 9 |
| `tdm31_role_desc` | 임원별 직책(책무)기술서 | 12 |
| `tdm32_role_digm` | 책무체계도 | 9 |
| `tdm33_role_digm_file` | 책무체계도_파일정보 | 3 |
| `tdm34_role_allc_detail` | 직책(책무)배분-상세정보 | 8 |
| `tdm35_role_allc_task` | 직책(책무)배분-확정책무 | 12 |
| `tdm36_role_report` | 책무구조도 제출 | 18 |
| `tdm40_manl_job` | 책무매뉴얼 작업 | 13 |
| `tdm41_manl_duty` | 책무매뉴얼 작업_관리의무 | 9 |
| `tdm42_manl_org` | 부서 책무매뉴얼 | 12 |
| `tdm43_manl` | 책무매뉴얼 점검항목 | 31 |
| `tdm44_manl_duty_org` | 책무매뉴얼 작업_부서지정 | 8 |
| `tdm45_manl_relate_ics` | 책무매뉴얼 점검항목 연결법규 | 3 |
| `tdm46_manl_relate_icr` | 책무매뉴얼 점검항목 연결내규 | 3 |
| `tdm47_manl_relate_dcr` | 책무매뉴얼 점검항목 연결문서분류 | 3 |
| `tdm50_chck_job` | 이행점검 작업 | 9 |
| `tdm51_chck_org` | 이행점검_부서점검현황 | 10 |
| `tdm52_chck_manl` | 이행점검 | 11 |
| `tdm53_chck_exct` | 이행점검_임원승인현황 | 10 |
| `tdm54_chck_insuff` | 미흡/개선 내역 | 17 |
| `tdm55_chck_record` | 이행점검 기록 | 10 |
| `tdm56_chck_relate_appr` | 이행점검 연결 상신문서(임원책무 이행점검 보고) | 5 |
| `tdm57_chck_ceo_report` | 대표이사 총괄관리의무 이행점검 보고 | 8 |
| `tdm58_chck_appr_step` | 이행점검_부서승인단계설정 | 6 |
| `tdm59_chck_appr_cmnt` | 이행점검_종합의견 | 12 |
| `tdm60_chck_manl_appr` | 이행점검_승인 | 8 |
| `tdm61_chck_insuff_appr` | 미흡/개선 내역 승인 | 10 |
| `tdm62_chck_cmnt_relate_org` | 이행점검_종합의견 연결 부서점검현황 | 3 |
| `tdm63_chck_insuff_record` | 미흡/개선 조치기록 | 8 |
| `tdm64_chck_evid_extr` | 이행점검_증빙자료(외부시스템 문서정보) | 10 |
| `tdm91_company_setup` | 책무사용 기본설정 | 10 |
| `tdm95_change_history` | 책무데이터 변경이력 | 9 |
| `tdm96_change_detail` | 책무데이터 변경이력 상세 | 6 |
| `tdm98_load` |  | 17 |
| `tdm98_task_check` |  | 11 |
| `tdm99_conv` |  | 11 |

## DBML

```dbml
Table "public"."tdm01_hr" {
  "tdm01_hr_id" "numeric" [pk, note: '인사(임원)정보ID(PK)']
  "tdm01_company_id" "numeric" [note: '회사ID']
  "tdm01_person_id" "numeric" [note: '사원(임원)ID']
  "tdm01_person_nm" "character varying(50)" [note: '사원(임원)명']
  "tdm01_person_no" "character varying(20)" [note: '사번']
  "tdm01_pos_cd" "character varying(3)" [note: '직위코드(EmpPosCode)']
  "tdm01_title_cd" "character varying(3)" [note: '직책코드(EmpTitleCode)']
  "tdm01_hire_date" "date" [note: '입사일']
  "tdm01_retire_date" "date" [note: '퇴사일']
  "tdm01_end_date" "date" [note: '책무대상 종료일']
  "tdm01_org_id" "numeric" [note: '조직ID']
  "tdm01_org_nm" "character varying(100)" [note: '조직명']
  "tdm01_org_head_nm" "character varying(50)" [note: '조직장명']
  "tdm01_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm01_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm01_company_id, tdm01_person_id) [name: 'tdm01_hr_idx01']
  }

  Note: '인사(임원)정보'
}

Table "public"."tdm02_hr_record" {
  "tdm02_hr_record_id" "numeric" [pk, note: '인사변동사항 반영정보ID(PK)']
  "tdm02_company_id" "numeric" [note: '회사ID']
  "tdm02_reg_date" "date" [note: '등록일']
  "tdm02_reg_type" "character varying(3)" [note: '등록구분(신규:NEW/변동:UPD/제거:DEL)']
  "tdm02_person_nm" "character varying(50)" [note: '사원(임원)명']
  "tdm02_change_data" "text" [note: '변경 데이터']
  "tdm02_init_nm" "character varying(50)" [note: '등록자(인사정보반영자)']
  "tdm02_init_date" "timestamp without time zone" [note: '등록(일사정보반영)일시']
  "tdm02_note" "text" [note: '비고']
  "tdm02_apply_cd" "character varying(1)" [note: '적용여부(ApplyStatusCode-0:미적용/1:적용완료/9:해당없음)']
  "tdm02_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm02_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm02_company_id, tdm02_reg_date) [name: 'tdm02_hr_record_idx01']
  }

  Note: '인사변동사항 반영정보'
}

Table "public"."tdm03_add_title" {
  "tdm03_add_title_id" "numeric" [pk, note: '직무겸직정보ID(PK)']
  "tdm03_company_id" "numeric" [note: '회사ID']
  "tdm03_person_id" "numeric" [note: '사원ID']
  "tdm03_add_title_nm" "text" [note: '겸직명']
  "tdm03_start_date" "date" [note: '적용시작일']
  "tdm03_close_date" "date" [note: '적용종료일']
  "tdm03_note" "text" [note: '비고']
  "tdm03_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm03_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm03_person_id) [name: 'tdm03_add_title_idx01']
  }

  Note: '직무겸직정보'
}

Table "public"."tdm05_cncl" {
  "tdm05_cncl_id" "numeric" [pk, note: '위원회정보ID(PK)']
  "tdm05_company_id" "numeric" [note: '회사ID']
  "tdm05_cncl_nm" "character varying(100)" [note: '위원회명']
  "tdm05_open_cycle_cd" "character varying(2)" [note: '개최주기(CycleCode003-04:분기별/05:반기별/06:연별/99:수시)']
  "tdm05_main_decision" "text" [note: '주요의결사항']
  "tdm05_start_date" "date" [note: '사용시작일']
  "tdm05_end_date" "date" [note: '사용종료일']
  "tdm05_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm05_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm05_note" "text" [note: '비고']

  indexes {
    (tdm05_company_id) [name: 'tdm05_cncl_idx01']
  }

  Note: '위원회(회의체) 정보'
}

Table "public"."tdm06_cncl_record" {
  "tdm06_cncl_record_id" "numeric" [pk, note: '이사회 의결기록ID(PK)']
  "tdm06_company_id" "numeric" [note: '회사ID']
  "tdm06_cncl_id" "character varying(100)" [note: '위원회ID(tdm05_cncl_id)']
  "tdm06_open_date" "date" [note: '개최일']
  "tdm06_decision" "text" [note: '안건']
  "tdm06_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm06_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm06_company_id, tdm06_open_date) [name: 'tdm06_cncl_record_idx01']
  }

  Note: '이사회 의결기록'
}

Table "public"."tdm07_rule" {
  "tdm07_rule_id" "numeric" [pk, note: '내규관리ID(PK)']
  "tdm07_company_id" "numeric" [note: '회사ID']
  "tdm07_company_rule_cd" "character varying(8)" [note: '내규코드(bbs15_company_rule_cd)']
  "tdm07_org_id" "numeric" [note: '제개정 소관부서ID']
  "tdm07_use_yn" "character varying(5)" [note: '사용여부']
  "tdm07_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm07_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm07_company_id, tdm07_company_rule_cd) [name: 'tdm07_rule_idx01']
  }

  Note: '내규관리'
}

Table "public"."tdm08_manager_info" {
  "tdm08_manager_info_id" "numeric" [pk, note: '책무관리자ID(PK)']
  "tdm08_company_id" "numeric" [note: '회사ID']
  "tdm08_manager_type" "character varying(2)" [note: '책무이행관리자구분(TdmManagerType-10:회사책무관리자/11:회사책무담당자/21:부서책무담당자)']
  "tdm08_org_id" "numeric" [note: '조직ID(회사책무관리자/담당자인 경우 null)']
  "tdm08_person_id" "numeric" [note: '사원ID']
  "tdm08_start_date" "date" [note: '적용시작일']
  "tdm08_end_date" "date" [note: '적용종료일']
  "tdm08_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm08_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm08_company_id) [name: 'tdm08_manager_info_idx01']
  }

  Note: '책무관리자'
}

Table "public"."tdm09_appr_step" {
  "tdm09_appr_step_id" "numeric" [pk, note: '책무승인단계ID(PK)']
  "tdm09_company_id" "numeric" [note: '회사ID']
  "tdm09_role_id" "numeric" [note: '직책ID']
  "tdm09_org_id" "numeric" [note: '부서ID']
  "tdm09_type_cd" "character varying(1)" [note: '분류구분(C:상위분류/T:하위분류)']
  "tdm09_parent_id" "numeric" [note: '상위분류ID']
  "tdm09_appr_seq" "character varying(2)" [note: '승인순서']
  "tdm09_appr_emp_id" "numeric" [note: '승인자ID']
  "tdm09_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm09_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm09_company_id) [name: 'tdm09_appr_step_idx01']
    (tdm09_company_id, tdm09_role_id, tdm09_org_id) [name: 'tdm09_appr_step_idx02']
  }

  Note: '책무승인단계'
}

Table "public"."tdm09_appr_step_20260512" {
  "tdm09_appr_step_id" "numeric"
  "tdm09_company_id" "numeric"
  "tdm09_role_id" "numeric"
  "tdm09_org_id" "numeric"
  "tdm09_type_cd" "character varying(1)"
  "tdm09_parent_id" "numeric"
  "tdm09_appr_seq" "character varying(2)"
  "tdm09_appr_emp_id" "numeric"
  "tdm09_upd_nm" "character varying(50)"
  "tdm09_upd_date" "timestamp without time zone"
}

Table "public"."tdm10_task" {
  "tdm10_task_id" "numeric" [pk, note: '책무정보ID(PK)']
  "tdm10_company_id" "numeric" [note: '회사ID']
  "tdm10_task_class_cd" "character varying(1)" [note: '책무분류(TdmTaskClassCode - A:지정책임자, B:금융영업, C:경영관리)']
  "tdm10_task_type_cd" "character varying(3)" [note: '책무유형(tdm14_task_type_cd)']
  "tdm10_task_nm" "text" [note: '책무명']
  "tdm10_common_yn" "character varying(5)" [note: '공통책무여부']
  "tdm10_ceo_yn" "character varying(5)" [note: 'CEO책무여부']
  "tdm10_start_date" "date" [note: '사용시작일']
  "tdm10_end_date" "date" [note: '사용종료일']
  "tdm10_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm10_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm10_company_id) [name: 'tdm10_task_idx01']
  }

  Note: '책무정보'
}

Table "public"."tdm11_task_relate_rule" {
  "tdm11_task_relate_rule_id" "numeric" [pk, note: '책무연결정보-규정(법규/내규)ID(PK)']
  "tdm11_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdm11_relate_type" "character varying(1)" [note: '규정연결구분(1:법규/2:내규)']
  "tdm11_rule_cd" "character varying(8)" [note: '규정코드(법규:TdmLawCode, 내규:bbs15_company_rule_cd)']
  "tdm11_seq" "numeric" [note: '조회순서']
  "tdm11_company_id" "numeric" [note: '회사ID']
  "tdm11_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm11_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm11_task_id) [name: 'tdm11_task_relate_rule_idx01']
  }

  Note: '책무연결정보-규정(법규/내규)'
}

Table "public"."tdm12_task_relate_detail" {
  "tdm12_task_relate_detail_id" "numeric" [pk, note: '책무연결정보-세부내용ID(PK)']
  "tdm12_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdm12_content" "text" [note: '내용']
  "tdm12_seq" "numeric" [note: '조회순서']
  "tdm12_use_yn" "character varying(5)" [note: '사용여부']
  "tdm12_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm12_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm12_task_id) [name: 'tdm12_task_relate_detail_idx01']
  }

  Note: '책무연결정보-세부내용'
}

Table "public"."tdm13_task_relate_duty" {
  "tdm13_task_relate_duty_id" "numeric" [pk, note: '책무연결정보-관리의무ID(PK)']
  "tdm13_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdm13_task_relate_detail_id" "numeric" [note: '책무ID(tdm12_task_relate_detail_id)']
  "tdm13_content" "text" [note: '내용']
  "tdm13_seq" "numeric" [note: '조회순서']
  "tdm13_use_yn" "character varying(5)" [note: '사용여부']
  "tdm13_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm13_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm13_task_id) [name: 'tdm13_task_relate_duty_idx01']
    (tdm13_task_relate_detail_id) [name: 'tdm13_task_relate_duty_idx02']
  }

  Note: '책무연결정보-관리의무'
}

Table "public"."tdm14_task_type" {
  "tdm14_task_type_id" "numeric" [pk, note: '책무유형정의ID(PK)']
  "tdm14_company_id" "numeric" [note: '회사ID']
  "tdm14_task_type_cd" "character varying(3)" [note: '책무유형코드']
  "tdm14_task_type_nm" "character varying(50)" [note: '책무유형명']
  "tdm14_system_cd" "character varying(3)" [note: '책무유형코드(ADMIN)']
  "tdm14_use_yn" "character varying(5)" [note: '사용여부']
  "tdm14_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm14_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm14_company_id, tdm14_task_type_cd) [name: 'tdm14_task_type_idx01']
  }

  Note: '책무유형정의'
}

Table "public"."tdm20_role" {
  "tdm20_role_id" "numeric" [pk, note: '직책정보ID(PK)']
  "tdm20_company_id" "numeric" [note: '회사ID']
  "tdm20_role_nm" "character varying(100)" [note: '직책명']
  "tdm20_role_type" "character varying(1)" [note: '직책그룹코드(TdmRoleType-A:이사회의장/B:이사회지원/C:대표이사/D:대표이사지원/E:기타그룹)']
  "tdm20_role_type_etc_nm" "character varying(50)" [note: '직책그룹기타코드명(직책그룹코드가 E인 경우만 해당)']
  "tdm20_overview" "text" [note: '개요']
  "tdm20_start_date" "date" [note: '사용시작일']
  "tdm20_end_date" "date" [note: '사용종료일']
  "tdm20_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm20_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm20_ceo_role_id" "numeric" [note: '보고CEO 직책ID(tdm20_role_id)']

  indexes {
    (tdm20_company_id) [name: 'tdm20_role_idx01']
  }

  Note: '직책정보'
}

Table "public"."tdm21_role_relate_task" {
  "tdm21_role_relate_task_id" "numeric" [pk, note: '직책연결정보-책무ID(PK)']
  "tdm21_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm21_task_id" "numeric" [note: '책무ID(tdm10_task_id)']

  indexes {
    (tdm21_role_id) [name: 'tdm21_role_relate_task_idx01']
  }

  Note: '직책연결정보-책무'
}

Table "public"."tdm22_role_relate_cncl" {
  "tdm22_role_relate_cncl_id" "numeric" [pk, note: '직책연결정보-위원회ID(PK)']
  "tdm22_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm22_cncl_id" "numeric" [note: '위원회ID(tdm05_cncl_id)']
  "tdm22_member_type" "character varying(2)" [note: '역할(TdmCnclMemberType-CM:위원장/MB:위원)']
  "tdm22_start_date" "date" [note: '적용시작일']
  "tdm22_end_date" "date" [note: '적용종료일']

  indexes {
    (tdm22_role_id) [name: 'tdm22_role_relate_cncl_idx01']
  }

  Note: '직책연결정보-위원회'
}

Table "public"."tdm23_role_relate_org" {
  "tdm23_role_relate_org_id" "numeric" [pk, note: '직책연결정보-담당부서ID(PK)']
  "tdm23_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm23_org_id" "numeric" [note: '부서ID(org01_code_id)']

  indexes {
    (tdm23_role_id) [name: 'tdm23_role_relate_org_idx01']
  }

  Note: '직책연결정보-담당부서'
}

Table "public"."tdm30_role_allc" {
  "tdm30_role_allc_id" "numeric" [pk, note: '직책(책무)배분ID(PK)']
  "tdm30_company_id" "numeric" [note: '회사ID']
  "tdm30_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm30_person_id" "numeric" [note: '임원ID(tdm01_person_id)']
  "tdm30_add_title_yn" "character varying(5)" [note: '겸직여부']
  "tdm30_start_date" "date" [note: '직책부여일']
  "tdm30_end_date" "date" [note: '직책해제일']
  "tdm30_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm30_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm30_company_id) [name: 'tdm30_role_allc_idx01']
    (tdm30_company_id, tdm30_person_id) [name: 'tdm30_role_allc_idx02']
  }

  Note: '직책(책무)배분'
}

Table "public"."tdm31_role_desc" {
  "tdm31_role_desc_id" "numeric" [pk, note: '임원별 직책(책무)기술서ID(PK)']
  "tdm31_company_id" "numeric" [note: '회사ID']
  "tdm31_reg_date" "date" [note: '등록일자']
  "tdm31_person_id" "numeric" [note: '사원(임원)ID']
  "tdm31_role_allc_id" "numeric" [note: '본직책(책무) 배분ID(tdm30_role_allc_id)']
  "tdm31_reason_cd" "character varying(3)" [note: '생성사유코드(TdmDescRegReason)']
  "tdm31_appr_id" "numeric" [note: '책무기술서 상신ID']
  "tdm31_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm31_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm31_lock_yn" "character varying(5)" [note: '잠금여부(사용X)']
  "tdm31_allc_std_date" "date" [note: '책무배분기준일']
  "tdm31_work_date" "timestamp without time zone" [note: '(파일생성)작업일시']

  indexes {
    (tdm31_company_id, tdm31_reg_date) [name: 'tdm31_role_desc_idx01']
  }

  Note: '임원별 직책(책무)기술서'
}

Table "public"."tdm32_role_digm" {
  "tdm32_role_digm_id" "numeric" [pk, note: '책무체계도ID(PK)']
  "tdm32_company_id" "numeric" [note: '회사ID']
  "tdm32_reg_date" "date" [note: '등록일자']
  "tdm32_reason_cd" "character varying(3)" [note: '생성사유코드(TdmDescRegReason)']
  "tdm32_use_file_type" "character varying(1)" [note: '최종사용파일구분(TdmUseFileType-1:시스템 생성파일/2:사용자 업로드파일)']
  "tdm32_appr_id" "numeric" [note: '책무체계도 상신ID']
  "tdm32_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm32_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm32_allc_std_date" "date" [note: '책무배분기준일']

  indexes {
    (tdm32_company_id, tdm32_reg_date) [name: 'tdm32_role_digm_idx01']
  }

  Note: '책무체계도'
}

Table "public"."tdm33_role_digm_file" {
  "tdm33_role_digm_file_id" "numeric" [pk, note: '책무체계도_파일정보ID(PK)']
  "tdm33_role_digm_id" "numeric" [note: '책무체계도ID(tdm32_role_digm_id)']
  "tdm33_file_type" "character varying(1)" [note: '파일구분(TdmUseFileType-1:시스템 생성파일/2:사용자 업로드파일)']

  indexes {
    (tdm33_role_digm_id) [name: 'tdm33_role_digm_file_idx01']
  }

  Note: '책무체계도_파일정보'
}

Table "public"."tdm34_role_allc_detail" {
  "tdm34_role_allc_detail_id" "numeric" [pk, note: '직책(책무)배분-상세정보ID(PK)']
  "tdm34_role_allc_id" "numeric" [note: '직책(책무)배분ID(tdm30_role_allc_id)']
  "tdm34_role_allc_date" "date" [note: '책무배분일(이사회결의일)']
  "tdm34_reg_reason" "text" [note: '등록사유']
  "tdm34_deputy_emp_nm" "character varying(50)" [note: '유고시 대체 임직원명']
  "tdm34_appr_id" "numeric" [note: '임원동의서 상신ID']
  "tdm34_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm34_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm34_role_allc_id) [name: 'tdm34_role_allc_detail_idx01']
  }

  Note: '직책(책무)배분-상세정보'
}

Table "public"."tdm35_role_allc_task" {
  "tdm35_role_allc_task_id" "numeric" [pk, note: '직책(책무)배분-확정책무ID(PK)']
  "tdm35_role_allc_detail_id" "numeric" [note: '직책(책무)배분-상세정보ID(tdm34_role_allc_detail_id)']
  "tdm35_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdm35_task_nm" "text" [note: '책무명(tdm10_task_nm)']
  "tdm35_task_relate_detail_id" "numeric" [note: '책무세부ID(tdm12_task_relate_detail_id)']
  "tdm35_task_relate_detail_nm" "text" [note: '책무세부명(tdm12_content)']
  "tdm35_task_relate_detail_seq" "numeric" [note: '책무세부순번(tdm12_seq)']
  "tdm35_task_relate_duty_id" "numeric" [note: '관리의무ID(tdm13_task_relate_duty_id)']
  "tdm35_task_relate_duty_nm" "text" [note: '관리의무명(tdm13_content)']
  "tdm35_task_relate_duty_seq" "numeric" [note: '관리의무순번(tdm13_seq)']
  "tdm35_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm35_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm35_role_allc_detail_id) [name: 'tdm35_role_allc_task_idx01']
  }

  Note: '직책(책무)배분-확정책무'
}

Table "public"."tdm36_role_report" {
  "tdm36_role_report_id" "numeric" [pk, note: '책무구조도 제출 ID(PK)']
  "tdm36_company_id" "numeric" [not null, note: '회사ID']
  "tdm36_report_date" "date" [note: '보고일자']
  "tdm36_board_open_date" "date" [note: '개최일자']
  "tdm36_board_open_loc" "character varying(100)" [note: '개최장소']
  "tdm36_board_open_agenda" "character varying(100)" [note: '안건']
  "tdm36_memb_tot_cnt" "numeric" [note: '이사회 총수 ']
  "tdm36_memb_attend_cnt" "numeric" [note: '이사회 참석자수']
  "tdm36_memb_yes_nm" "character varying(200)" [note: '찬성의견 이사']
  "tdm36_memb_nai_nm" "character varying(200)" [note: '반대의견 이사']
  "tdm36_rpt_cover_file_id" "numeric" [note: '업로드 File ID (표지)']
  "tdm36_rpt_overview_file_id" "numeric" [note: '업로드 File ID (개요)']
  "tdm36_rpt_ceo_cfrm_file_id" "numeric" [note: '업로드 File ID (대표이사 확인서 )']
  "tdm36_rpt_board_vote_file_id" "numeric" [note: '업로드 File ID (이사회 결의서 )']
  "tdm36_appr_id" "numeric" [note: '상신ID']
  "tdm36_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm36_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm36_allc_std_date" "date" [note: '책무배분기준일']

  Note: '책무구조도 제출'
}

Table "public"."tdm40_manl_job" {
  "tdm40_manl_job_id" "numeric" [pk, note: '책무매뉴얼 작업ID(PK)']
  "tdm40_company_id" "numeric" [note: '회사ID']
  "tdm40_reg_date" "date" [note: '등록일']
  "tdm40_job_nm" "character varying(50)" [note: '매뉴얼작업명']
  "tdm40_role_id" "numeric" [note: '직책ID(작업조건1, null이면 전체직책)']
  "tdm40_org_id" "numeric" [note: '조직ID(작업조건2, null이면 전체조직)']
  "tdm40_job_reason" "character varying(100)" [note: '작업사유']
  "tdm40_start_date" "date" [note: '작성시작일']
  "tdm40_end_date" "date" [note: '작성마감일']
  "tdm40_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm40_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm40_allc_std_date" "date" [note: '책무배분기준일(사용X)']
  "tdm40_manl_apply_start_date" "date" [note: '매뉴얼적용시작일']

  indexes {
    (tdm40_company_id) [name: 'tdm40_manl_job_idx01']
  }

  Note: '책무매뉴얼 작업'
}

Table "public"."tdm41_manl_duty" {
  "tdm41_manl_duty_id" "numeric" [pk, note: '책무매뉴얼 부서지정ID(PK)']
  "tdm41_manl_job_id" "numeric" [note: '책무매뉴얼 작업ID(tdm40_manl_job_id)']
  "tdm41_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm41_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdm41_task_relate_detail_id" "numeric" [note: '책무세부ID(tdm12_task_relate_detail_id)']
  "tdm41_task_relate_duty_id" "numeric" [note: '관리의무ID(tdm13_task_relate_duty_id)']
  "tdm41_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm41_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm41_company_id" "numeric" [note: '회사ID']

  indexes {
    (tdm41_manl_job_id) [name: 'tdm41_manl_duty_idx01']
  }

  Note: '책무매뉴얼 작업_관리의무'
}

Table "public"."tdm42_manl_org" {
  "tdm42_manl_org_id" "numeric" [pk, note: '부서 책무매뉴얼ID(PK)']
  "tdm42_company_id" "numeric" [note: '회사ID']
  "tdm42_org_id" "numeric" [note: '조직ID']
  "tdm42_exct_id" "numeric" [note: '임원ID(emp01_person_id)']
  "tdm42_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm42_lock_yn" "character varying(5)" [note: '잠금여부']
  "tdm42_start_date" "date" [note: '적용시작일']
  "tdm42_end_date" "date" [note: '적용종료일']
  "tdm42_appr_id" "numeric" [note: '책무매뉴얼 상신ID']
  "tdm42_manl_job_id" "numeric" [note: '책무매뉴얼 작업ID(tdm40_manl_job_id)']
  "tdm42_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm42_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm42_company_id) [name: 'tdm42_manl_org_idx01']
  }

  Note: '부서 책무매뉴얼'
}

Table "public"."tdm43_manl" {
  "tdm43_manl_id" "numeric" [pk, note: '책무매뉴얼 점검항목ID(PK)']
  "tdm43_manl_org_id" "numeric" [note: '부서 책무매뉴얼ID(tdm42_manl_org_id)']
  "tdm43_company_id" "numeric" [note: '회사ID']
  "tdm43_org_id" "numeric" [note: '조직ID']
  "tdm43_exct_id" "numeric" [note: '임원ID(emp01_person_id)']
  "tdm43_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdm43_role_nm" "character varying(100)" [note: '직책명(tdm20_role_nm)']
  "tdm43_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdm43_task_nm" "text" [note: '책무명(tdm10_task_nm)']
  "tdm43_task_relate_detail_id" "numeric" [note: '책무세부ID(tdm12_task_relate_detail_id)']
  "tdm43_task_relate_detail_nm" "text" [note: '책무세부명(tdm12_content)']
  "tdm43_task_relate_duty_id" "numeric" [note: '관리의무ID(tdm13_task_relate_duty_id)']
  "tdm43_task_relate_duty_nm" "text" [note: '관리의무명(tdm13_content)']
  "tdm43_check_item" "text" [note: '점검항목명']
  "tdm43_check_cycle_cd" "character varying(2)" [note: '점검주기코드(CycleCode004-03:월/04:분기/05:반기/06:연/98:특정월)']
  "tdm43_check_month" "character varying(12)" [note: '점검월(위치:월, 1:true/0:false)']
  "tdm43_check_evid_type" "character varying(2)" [note: '(사용X)증빙구분코드(TdmEvidType-10:대외문서/11:사내문서/20:교육수행내역/90:기타(직접입력)/99:미설정)']
  "tdm43_check_evid_etc" "character varying(100)" [note: '(사용X)증빙구분기타']
  "tdm43_check_how" "text" [note: '점검방법']
  "tdm43_ref_basis" "text" [note: '관련참고근거']
  "tdm43_start_date" "date" [note: '(개별)적용시작일']
  "tdm43_manl_duty_id" "numeric" [note: '책무매뉴얼작업 부서지정ID(tdm41_manl_duty_id)']
  "tdm43_first_reg_emp_id" "numeric" [note: '최초작성자']
  "tdm43_manl_cd" "character varying(10)" [note: '책무매뉴얼 점검항목 코드']
  "tdm43_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm43_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm43_check_evid_doc_nm" "text" [note: '증빙문서명']
  "tdm43_ceo_duty_cd" "character varying(2)" [note: '대표이사 총괄관리의무 코드(TdmCeoDutyCode)']
  "tdm43_exct_duty_cd" "character varying(2)" [note: '(사용X)임원의 상당한 주의의무 코드(TdmExctDutyCode)']
  "tdm43_import_level_cd" "character varying(1)" [note: '중요도 코드(TdmImportLevelCode-1:상/2:중/3:하)']
  "tdm43_exct_duty_map" "character varying(6)" [note: '임원의 상당한 주의의무 (6항목 다중선택(TdmExctDutyCode, 1:true/0:false)']

  indexes {
    ("tdm43_manl_org_id", "tdm43_manl_cd") [unique, name: 'tdm43_manl_ukey']
    (tdm43_company_id) [name: 'tdm43_manl_idx01']
    (tdm43_company_id, tdm43_org_id) [name: 'tdm43_manl_idx02']
  }

  Note: '책무매뉴얼 점검항목'
}

Table "public"."tdm44_manl_duty_org" {
  "tdm44_manl_duty_org_id" "numeric" [pk, note: '책무매뉴얼 작업_부서지정ID(PK)']
  "tdm44_manl_duty_id" "numeric" [note: '책무매뉴얼 작업_관리의무ID(tdm41_manl_duty_id)']
  "tdm44_org_id" "numeric" [note: '조직ID']
  "tdm44_end_yn" "character varying(5)" [note: '작성완료여부']
  "tdm44_end_date" "date" [note: '작성완료일']
  "tdm44_end_emp_id" "numeric" [note: '작성자ID']
  "tdm44_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm44_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm44_manl_duty_id) [name: 'tdm44_manl_duty_org_idx01']
  }

  Note: '책무매뉴얼 작업_부서지정'
}

Table "public"."tdm45_manl_relate_ics" {
  "tdm45_manl_relate_ics_id" "numeric" [pk, note: '책무매뉴얼 점검항목 연결법규ID(PK)']
  "tdm45_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdm45_ics_class_tree_id" "numeric" [note: '법규ID(ics01_class_tree_id)']

  indexes {
    (tdm45_manl_id) [name: 'tdm45_manl_relate_ics_idx01']
    (tdm45_manl_id) [name: 'tdm46_manl_relate_ics_idx01']
  }

  Note: '책무매뉴얼 점검항목 연결법규'
}

Table "public"."tdm46_manl_relate_icr" {
  "tdm46_manl_relate_icr_id" "numeric" [pk, note: '책무매뉴얼 점검항목 연결내규ID(PK)']
  "tdm46_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdm46_icr_class_tree_id" "numeric" [note: '내규ID(icr01_class_tree_id)']

  Note: '책무매뉴얼 점검항목 연결내규'
}

Table "public"."tdm47_manl_relate_dcr" {
  "tdm47_manl_relate_dcr_id" "numeric" [pk, note: '책무매뉴얼 점검항목 연결문서분류ID(PK)']
  "tdm47_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdm47_dcr_class_tree_id" "numeric" [note: '문서분류ID(dcr01_class_tree_id)']

  indexes {
    (tdm47_manl_id) [name: 'tdm47_manl_relate_dcr_idx01']
  }

  Note: '책무매뉴얼 점검항목 연결문서분류'
}

Table "public"."tdm50_chck_job" {
  "tdm50_chck_job_id" "numeric" [pk, note: '이행점검 작업ID(PK)']
  "tdm50_company_id" "numeric" [note: '회사ID']
  "tdm50_check_ym" "character varying(7)" [note: '점검년월(YYYY.MM)']
  "tdm50_check_nm" "character varying(100)" [note: '이행점검 작업명']
  "tdm50_start_date" "date" [note: '점검시작일']
  "tdm50_end_date" "date" [note: '점검마감일']
  "tdm50_end_yn" "character varying(5)" [note: '마감여부']
  "tdm50_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm50_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm50_company_id, tdm50_check_ym) [name: 'tdm50_chck_job_idx01']
  }

  Note: '이행점검 작업'
}

Table "public"."tdm51_chck_org" {
  "tdm51_chck_org_id" "numeric" [pk, note: '이행점검_부서점검현황ID(PK)']
  "tdm51_company_id" "numeric" [note: '회사ID']
  "tdm51_check_ym" "character varying(7)" [note: '점검년월(YYYY.MM)']
  "tdm51_role_id" "numeric" [note: '직책ID']
  "tdm51_exct_id" "numeric" [note: '임원ID']
  "tdm51_org_id" "numeric" [note: '부서ID']
  "tdm51_chck_job_id" "numeric" [note: '이행점검 작업ID(tdm50_chck_job_id)']
  "tdm51_manl_org_id" "numeric" [note: '부서책무매뉴얼ID(tdm42_manl_org_id)']
  "tdm51_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm51_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm51_company_id, tdm51_check_ym) [name: 'tdm51_chck_org_idx01']
  }

  Note: '이행점검_부서점검현황'
}

Table "public"."tdm52_chck_manl" {
  "tdm52_chck_manl_id" "numeric" [pk, note: '이행점검ID(PK)']
  "tdm52_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(tdm51_chck_org_id)']
  "tdm52_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdm52_company_id" "numeric" [note: '회사ID']
  "tdm52_checker_id" "numeric" [note: '점검자ID']
  "tdm52_check_date" "date" [note: '점검일']
  "tdm52_check_result_cd" "character varying(1)" [note: '점검결과코드(TdmCheckResult0001-1:적정/2:미흡/9:해당없음)']
  "tdm52_check_cmnt" "text" [note: '점검의견']
  "tdm52_check_status_cd" "character varying(2)" [note: '점검상태(TdmCheckStatus-10:점검대기/11:점검진행/19:점검완료/20:승인요청/21:승인진행/25:승인완료/26:승인반려)']
  "tdm52_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm52_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm52_chck_org_id) [name: 'tdm52_chck_manl_idx01']
  }

  Note: '이행점검'
}

Table "public"."tdm53_chck_exct" {
  "tdm53_chck_exct_id" "numeric" [pk, note: '이행점검_임원승인현황ID(PK)']
  "tdm53_company_id" "numeric" [note: '회사ID']
  "tdm53_check_ym" "character varying(7)" [note: '점검년월(YYYY.MM)']
  "tdm53_role_id" "numeric" [note: '직책ID']
  "tdm53_exct_id" "numeric" [note: '임원ID']
  "tdm53_exct_appr_yn" "character varying(5)" [note: '임원승인 완료여부']
  "tdm53_lock_yn" "character varying(5)" [note: '잠금여부']
  "tdm53_chck_job_id" "numeric" [note: '이행점검 작업ID(tdm50_chck_job_id)']
  "tdm53_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm53_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm53_chck_job_id) [name: 'tdm53_chck_exct_idx01']
    (tdm53_company_id, tdm53_check_ym) [name: 'tdm53_chck_exct_idx02']
  }

  Note: '이행점검_임원승인현황'
}

Table "public"."tdm54_chck_insuff" {
  "tdm54_chck_insuff_id" "numeric" [pk, note: '미흡/개선 내역ID(PK)']
  "tdm54_company_id" "numeric" [note: '회사ID']
  "tdm54_role_id" "numeric" [note: '직책ID']
  "tdm54_org_id" "numeric" [note: '부서ID']
  "tdm54_reg_date" "date" [note: '등록일']
  "tdm54_due_date" "date" [note: '조치완료예정일']
  "tdm54_plan_action_emp_id" "numeric" [note: '조치예정자ID']
  "tdm54_action_nm" "text" [note: '조치명']
  "tdm54_action_plan" "text" [note: '조치계획']
  "tdm54_plan_reg_emp_id" "numeric" [note: '조치계획 등록자ID']
  "tdm54_action_emp_id" "numeric" [note: '조치자ID']
  "tdm54_action_cmnt" "text" [note: '조치결과의견']
  "tdm54_action_date" "date" [note: '조치완료일']
  "tdm54_status_cd" "character varying(2)" [note: '미흡/개선 상태(TdmInsuffStatus-10:발생/11:조치중/19:조치완료/20:승인요청/21:승인중/25:승인완료/26:승인반려)']
  "tdm54_chck_manl_id" "numeric" [note: '이행점검ID(tdm52_chck_manl_id)']
  "tdm54_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm54_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm54_chck_manl_id) [name: 'tdm54_chck_insuff_idx01']
    (tdm54_company_id, tdm54_org_id, tdm54_reg_date) [name: 'tdm54_chck_insuff_idx02']
  }

  Note: '미흡/개선 내역'
}

Table "public"."tdm55_chck_record" {
  "tdm55_chck_record_id" "numeric" [pk, note: '이행점검 기록ID(PK)']
  "tdm55_relate_table_id" "numeric" [note: '연결TableID']
  "tdm55_relate_table" "character varying(5)" [note: '연결Table(tdm52, tdm54, tdm59)']
  "tdm55_proc_type" "character varying(10)" [note: '처리구분(tdm52:점검시작/점검완료/승인요청/승인진행/승인완료, tdm54,59:요청/승인/반려)']
  "tdm55_person_id" "numeric" [note: '처리자(점검자/승인자)']
  "tdm55_person_info" "text" [note: '처리자정보(처리자 직위(부서))']
  "tdm55_proc_result" "character varying(10)" [note: '처리결과(tdm52:적정/미흡/개선/해당없음, tdm54,59:승인/반려)']
  "tdm55_result_cmnt" "text" [note: '점검의견/승인(반려)의견']
  "tdm55_report_cmnt" "text" [note: '종합보고의견']
  "tdm55_upd_date" "timestamp without time zone" [note: '처리일시']

  indexes {
    (tdm55_relate_table_id) [name: 'tdm55_chck_record_idx01']
  }

  Note: '이행점검 기록'
}

Table "public"."tdm56_chck_relate_appr" {
  "tdm56_chck_relate_appr_id" "numeric" [pk, note: '이행점검 연결 상신문서ID(PK)']
  "tdm56_relate_table_id" "numeric" [note: '연결TableID(tdm50_chck_job_id, tdm57_ceo_report_id)']
  "tdm56_appr_id" "numeric" [note: '이행점검']
  "tdm56_appr_date" "timestamp without time zone" [note: '이행점검']
  "tdm56_ceo_role_id" "numeric" [note: '보고CEO 직책ID(tdm20_role_id)']

  indexes {
    (tdm56_relate_table_id) [name: 'tdm56_chck_relate_appr_idx01']
  }

  Note: '이행점검 연결 상신문서(임원책무 이행점검 보고)'
}

Table "public"."tdm57_chck_ceo_report" {
  "tdm57_chck_ceo_report_id" "numeric" [pk, note: '대표이사 총괄관리의무 이행점검 보고ID(PK)']
  "tdm57_company_id" "numeric" [note: '회사ID']
  "tdm57_start_std_ym" "character varying(7)" [note: '점검시작 기준년월']
  "tdm57_end_std_ym" "character varying(7)" [note: '점검종료 기준년월']
  "tdm57_ceo_cmnt" "text" [note: '대표이사 종합의견']
  "tdm57_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm57_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm57_ceo_role_id" "numeric" [note: '보고CEO 직책ID(tdm20_role_id)']

  indexes {
    (tdm57_company_id, tdm57_start_std_ym) [name: 'tdm57_chck_ceo_report_idx01']
  }

  Note: '대표이사 총괄관리의무 이행점검 보고'
}

Table "public"."tdm58_chck_appr_step" {
  "tdm58_chck_appr_step_id" "numeric" [pk, note: '이행점검_승인단계ID(PK)']
  "tdm58_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(tdm51_chck_org_id)']
  "tdm58_appr_seq" "character varying(2)" [note: '승인순서']
  "tdm58_appr_emp_id" "numeric" [note: '승인자ID']
  "tdm58_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm58_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm58_chck_org_id) [name: 'tdm58_chck_appr_step_idx01']
  }

  Note: '이행점검_부서승인단계설정'
}

Table "public"."tdm59_chck_appr_cmnt" {
  "tdm59_chck_appr_cmnt_id" "numeric" [pk, note: '이행점검_종합의견ID(PK)']
  "tdm59_chck_exct_id" "numeric" [note: '이행점검_임원승인현황ID(tdm53_chck_exct_id)']
  "tdm59_appr_org_id" "numeric" [note: '승인부서ID']
  "tdm59_appr_emp_id" "numeric" [note: '승인자ID']
  "tdm59_cmnt_type" "character varying(4)" [note: '의견구분(SELF:자기조직 종합의견, SUB:하위조직별 의견)']
  "tdm59_parent_org_id" "numeric" [note: '상위조직ID']
  "tdm59_child_org_id" "numeric" [note: '하위조직ID']
  "tdm59_appr_status_cd" "character varying(2)" [note: '승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)']
  "tdm59_appr_cmnt" "text" [note: '승인의견']
  "tdm59_report_cmnt" "text" [note: '보고의견(종합의견)']
  "tdm59_submit_yn" "character varying(5)" [note: '제출여부']
  "tdm59_submit_date" "timestamp without time zone" [note: '제출일시']

  indexes {
    (tdm59_chck_exct_id) [name: 'tdm59_chck_appr_cmnt_idx01']
  }

  Note: '이행점검_종합의견'
}

Table "public"."tdm60_chck_manl_appr" {
  "tdm60_chck_manl_appr_id" "numeric" [pk, note: '이행점검_승인ID(PK)']
  "tdm60_chck_manl_id" "numeric" [note: '이행점검ID(tdm52_chck_manl_id)']
  "tdm60_appr_seq" "character varying(2)" [note: '승인순서']
  "tdm60_appr_org_id" "numeric" [note: '승인부서ID']
  "tdm60_appr_emp_id" "numeric" [note: '승인자ID']
  "tdm60_appr_status_cd" "character varying(2)" [note: '승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)']
  "tdm60_appr_cmnt" "text" [note: '승인의견']
  "tdm60_appr_date" "timestamp without time zone" [note: '승인일시']

  indexes {
    (tdm60_chck_manl_id) [name: 'tdm60_chck_manl_appr_idx01']
  }

  Note: '이행점검_승인'
}

Table "public"."tdm61_chck_insuff_appr" {
  "tdm61_chck_insuff_appr_id" "numeric" [pk, note: '미흡/개선 내역 승인ID(PK)']
  "tdm61_chck_insuff_id" "numeric" [note: '미흡/개선 내역ID(tdm54_chck_insuff_id)']
  "tdm61_step_type" "character varying(1)" [note: '단계구분(TdmInsuffStepType-1:발생(사용안함.이행점검승인(tdm60) 사용)/2:조치)']
  "tdm61_appr_seq" "character varying(2)" [note: '승인순서']
  "tdm61_appr_org_id" "numeric" [note: '승인부서ID']
  "tdm61_appr_emp_id" "numeric" [note: '승인자ID']
  "tdm61_appr_status_cd" "character varying(2)" [note: '승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)']
  "tdm61_appr_cmnt" "text" [note: '승인의견']
  "tdm61_appr_date" "timestamp without time zone" [note: '승인일시']
  "tdm61_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(tdm51_chck_org_id)']

  indexes {
    (tdm61_chck_insuff_id) [name: 'tdm61_chck_insuff_appr_idx01']
  }

  Note: '미흡/개선 내역 승인'
}

Table "public"."tdm62_chck_cmnt_relate_org" {
  "tdm62_chck_cmnt_relate_org_id" "numeric" [pk, note: '이행점검_종합의견 연결 부서점검현황ID(PK)']
  "tdm62_chck_appr_cmnt_id" "numeric" [note: '종합의견ID(tdm59_chck_appr_cmnt_id)']
  "tdm62_chck_org_id" "numeric" [note: '부서점검현황ID(tdm51_chck_org_id)']

  indexes {
    (tdm62_chck_appr_cmnt_id) [name: 'tdm62_chck_cmnt_relate_org_idx01']
  }

  Note: '이행점검_종합의견 연결 부서점검현황'
}

Table "public"."tdm63_chck_insuff_record" {
  "tdm63_chck_insuff_record_id" "numeric" [pk, note: '미흡/개선 조치기록ID(PK)']
  "tdm63_chck_insuff_id" "numeric" [note: '미흡/개선 내역ID(tdm54_chck_insuff_id)']
  "tdm63_reg_date" "date" [note: '등록일(조치일)']
  "tdm63_reg_emp_id" "numeric" [note: '등록자ID']
  "tdm63_content" "text" [note: '조치내용']
  "tdm63_note" "text" [note: '비고']
  "tdm63_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm63_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm63_chck_insuff_id) [name: 'tdm63_chck_insuff_record_idx01']
  }

  Note: '미흡/개선 조치기록'
}

Table "public"."tdm64_chck_evid_extr" {
  "tdm64_chck_evid_extr_id" "numeric" [pk, note: '이행점검_증빙자료(외부시스템 문서정보)ID(PK)']
  "tdm64_target_id" "numeric" [note: '대상ID(tdm52_chck_manl_id, tdm63_chck_insuff_record_id)']
  "tdm64_system_nm" "character varying(100)" [note: '외부시스템명']
  "tdm64_doc_no" "character varying(50)" [note: '문서번호']
  "tdm64_doc_nm" "character varying(200)" [note: '문서명']
  "tdm64_doc_date" "date" [note: '문서작성일자']
  "tdm64_doc_url" "text" [note: '문서연결URL']
  "tdm64_note" "text" [note: '비고']
  "tdm64_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm64_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (tdm64_target_id) [name: 'tdm64_chck_evid_extr_idx01']
  }

  Note: '이행점검_증빙자료(외부시스템 문서정보)'
}

Table "public"."tdm91_company_setup" {
  "tdm91_company_setup_id" "numeric" [pk, note: '책무사용 기본설정ID(PK)']
  "tdm91_company_id" "numeric" [note: '회사ID']
  "tdm91_start_date" "date" [note: '적용시작일']
  "tdm91_cmnt_min_limit" "numeric" [note: '의견입력 최소 글자수']
  "tdm91_batch_appr_use_yn" "character varying(5)" [note: '일괄승인 사용여부']
  "tdm91_evid_file_check_yn" "character varying(5)" [note: '증빙파일 필수등록 체크여부']
  "tdm91_note" "text" [note: '비고']
  "tdm91_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdm91_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdm91_batch_check_use_yn" "character varying(5)" [note: '일괄점검 사용여부']

  indexes {
    (tdm91_company_id, tdm91_start_date) [name: 'tdm91_company_setup_idx01']
  }

  Note: '책무사용 기본설정'
}

Table "public"."tdm95_change_history" {
  "tdm95_change_history_id" "numeric" [pk, note: '책무데이터 변경이력ID(PK)']
  "tdm95_company_id" "numeric" [note: '회사ID']
  "tdm95_change_emp_nm" "text" [note: '변경사원명']
  "tdm95_change_date" "timestamp without time zone" [note: '변경일시']
  "tdm95_change_type" "character varying(5)" [note: '변경구분(수정/삭제)']
  "tdm95_reason" "text" [note: '변경사유']
  "tdm95_menu_no" "text" [note: '변경화면번호']
  "tdm95_target_table" "text" [note: '변경대상Table']
  "tdm95_target_id" "numeric" [note: '변경대상TableKeyId']

  indexes {
    (tdm95_target_id) [name: 'tdm95_change_history_idx01']
    (tdm95_company_id, tdm95_target_table, tdm95_target_id) [name: 'tdm95_change_history_idx02']
  }

  Note: '책무데이터 변경이력'
}

Table "public"."tdm96_change_detail" {
  "tdm96_change_detail_id" "numeric" [pk, note: '책무데이터 변경이력 상세ID(PK)']
  "tdm96_change_history_id" "numeric" [note: '책무데이터 변경이력ID(tdm95_change_history_id)']
  "tdm96_window_item_nm" "character varying(100)" [note: '화면항목명']
  "tdm96_column_nm" "character varying(200)" [note: '컬럼명']
  "tdm96_before_data" "text" [note: '변경전데이터']
  "tdm96_after_data" "text" [note: '변경후데이터']

  indexes {
    (tdm96_change_history_id) [name: 'tdm96_change_detail_idx01']
  }

  Note: '책무데이터 변경이력 상세'
}

Table "public"."tdm98_load" {
  "tdm98_load_id" "numeric" [pk]
  "tdm98_company_id" "numeric" [not null]
  "tdm98_data_tp" "character varying(10)"
  "tdm98_data_id" "numeric"
  "tdm98_data_cd" "character varying(12)"
  "tdm98_data_nm" "text"
  "tdm98_task_relate_detail_id" "numeric"
  "tdm98_task_relate_detail_nm" "text"
  "tdm98_task_relate_duty_id" "numeric"
  "tdm98_task_relate_duty_nm" "text"
  "tdm98_check_item" "text"
  "tdm98_check_how" "text"
  "tdm98_check_cycle_cd" "character varying(2)"
  "tdm98_check_month" "character varying(50)"
  "tdm98_check_evid_type" "character varying(2)"
  "tdm98_check_evid_etc" "character varying(100)"
  "tdm98_manl_cd" "character varying(5)"
}

Table "public"."tdm98_task_check" {
  "tdm98_company_id" "numeric" [not null]
  "tdm98_no" "numeric" [not null]
  "tdm98_task_nm" "text"
  "tdm98_task_relate_detail_nm" "text"
  "tdm98_task_relate_duty_nm" "text"
  "tdm98_check_item" "text"
  "tdm98_check_how" "text"
  "tdm98_task_id" "numeric"
  "tdm98_task_relate_detail_id" "numeric"
  "tdm98_task_relate_duty_id" "numeric"
  "tdm98_check_item_seq" "numeric"

  indexes {
    ("tdm98_company_id", "tdm98_no") [pk]
  }
}

Table "public"."tdm99_conv" {
  "tdm99_fr_company_id" "numeric" [not null]
  "tdm99_fr_key_id" "numeric" [not null]
  "tdm99_to_company_id" "numeric" [not null]
  "tdm99_to_key_id" "numeric"
  "tdm99_table_name" "character varying(50)" [not null]
  "tdm99_upd_nm" "character varying(50)"
  "tdm99_upd_date" "timestamp without time zone"
  "tdm99_exct_id" "numeric"
  "tdm99_deputy_nm" "character varying(30)"
  "tdm99_org_id" "numeric"
  "tdm99_add_title_yn" "character varying(5)"

  indexes {
    ("tdm99_fr_company_id", "tdm99_to_company_id", "tdm99_fr_key_id") [pk]
  }
}

```
