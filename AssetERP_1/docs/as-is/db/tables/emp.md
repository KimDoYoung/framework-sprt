# 테이블: emp

55개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `emp01_person` | 개인정보 | 18 |
| `emp02_others` | Others 개인정보 | 21 |
| `emp03_trans` | 발령정보 | 19 |
| `emp04_add_title` | 겸직발령 | 9 |
| `emp05_academic` | 학력정보 | 11 |
| `emp06_family` | 가족사항 | 12 |
| `emp07_career` | 경력사항 | 14 |
| `emp08_license` | 자격사항 | 10 |
| `emp09_evaluation` | 고과평가 | 8 |
| `emp10_addr_book` | 주소록 | 10 |
| `emp11_reward` | 상벌내역 | 8 |
| `emp12_event` | 행사내역 | 7 |
| `emp13_project` | 프로젝트 | 6 |
| `emp14_account` | 급여계좌관리 | 7 |
| `emp15_cert` | 증명서발급 | 9 |
| `emp16_cert_mapping` | 증명서 맵핑 => com10_form_mapping 사용으로 안쓰는 테이블이 됨 | 7 |
| `emp17_benefit` | 복리후생비 | 15 |
| `emp18_relate_file` | 사원 연관파일 | 3 |
| `emp19_education` | 교육사항 | 7 |
| `emp20_leave` | 휴가관리 | 21 |
| `emp21_un_leave` | 미사용휴가관리 | 10 |
| `emp22_etc_leave` | 기타휴가 | 9 |
| `emp23_etc_leave_person` | 기타휴가-대상직원 | 3 |
| `emp24_joint_leave` | 공동휴가 | 8 |
| `emp25_mypage_notice` | MyPage알림권한 | 6 |
| `emp26_init_leave` | 사용휴가일수 초기설정 | 5 |
| `emp27_leave_old` | 휴가사용내역(AssetERP 사용전) | 10 |
| `emp28_joint_leave_except` | 공동휴가 제외사원 | 4 |
| `emp29_over_leave` | 초과연차 | 4 |
| `emp30_appr_step_except` | 문서결재라인 예외 | 6 |
| `emp31_director` | 임원정보 | 13 |
| `emp32_relate_license` | 금융투자전문인력구분연결 | 4 |
| `emp33_except_biz` | 사원별 예외업무 관리 | 8 |
| `emp35_deduct` | 급여공제항목 | 11 |
| `emp36_add_deduct` | 추가인적공제정보 | 4 |
| `emp40_eval_list_std` | 인사평가리스트 적용기준 | 4 |
| `emp41_eval_list` | 인사평가 평가리스트 | 7 |
| `emp42_eval_grade` | 인사평가 평가등급관리 | 7 |
| `emp43_eval_target` | 인사평가 대상자 | 23 |
| `emp44_eval_write` | 인사평가수행 | 6 |
| `emp45_eval_relate_appr` | 인사평가 상신문서 연결 | 6 |
| `emp50_transport_expense` | 여비교통비 | 12 |
| `emp51_relate_appr` | 여비교통비 신청서 | 9 |
| `emp52_relate_appr` | 여비교통비 지출결의서 | 4 |
| `emp53_biz_trip` | 출장 | 16 |
| `emp54_errand` | 외출 | 13 |
| `emp55_benefit_info` | 복리후생비 고객사별 설정 | 7 |
| `emp56_share` | 출장,외출등 공유지정 | 6 |
| `emp57_addr_book_group` | 주소록그룹 | 8 |
| `emp60_sign` | 결재서명관리 | 5 |
| `emp90_notice` | 캘린더알림 | 4 |
| `emp91_menu_info_notice` | 매뉴소개 알람여부 | 4 |
| `emp92_sms_notice` | SMS 알림 | 7 |
| `emp93_sms_notice_target` | SMS구분코드별 알림 | 5 |
| `emp99_person_del` |  | 21 |

## DBML

```dbml
Table "public"."emp01_person" {
  "emp01_person_id" "numeric" [pk, note: '개인정보ID']
  "emp01_emp_no" "character varying(20)" [note: '사번']
  "emp01_order_seq" "character varying(10)"
  "emp01_kor_nm" "character varying(40)" [note: '한글성명']
  "emp01_hire_cd" "character varying(10)" [note: '입사유형코드']
  "emp01_apply_cd" "character varying(10)"
  "emp01_hire_date" "date" [note: '입사일']
  "emp01_email_addr" "character varying(100)" [note: '이메일주소']
  "emp01_office_telno" "character varying(20)" [note: '회사전화번호:emp01_emgrcy_telno']
  "emp01_office_detail" "character varying(20)" [note: '내선번호']
  "emp01_mobile_telno" "character varying(20)" [note: '휴대폰번호']
  "emp01_password" "character varying(128)" [note: '암호 (메일암호)']
  "emp01_company_id" "numeric" [not null, note: '회사ID']
  "emp01_note" "character varying(400)" [note: '비고']
  "emp01_location_cd" "character varying(10)" [note: '개인위치(상태)코드']
  "emp01_theme_cd" "character varying(10)" [note: '개인테마코드']
  "emp01_lock_yn" "character varying(5)" [note: '잠금여부']
  "emp01_menu_fix_yn" "character varying(5)" [note: '메뉴고정여부']

  indexes {
    (emp01_emp_no) [name: 'emp01_person_idx02']
    (emp01_email_addr) [name: 'emp01_person_idx03']
    (emp01_company_id, emp01_emp_no) [unique, name: 'idx_emp01_company_id_emp_no']
  }

  Note: '개인정보'
}

Table "public"."emp02_others" {
  "emp02_others_id" "numeric" [pk, note: 'Key ID']
  "emp02_person_id" "numeric" [not null, note: '개인정보ID']
  "emp02_chn_nm" "character varying(40)" [note: '한자성명']
  "emp02_ctz_no" "character varying(128)" [note: '주민번호']
  "emp02_birthday" "timestamp without time zone" [note: '생일']
  "emp02_lunar_cd" "character varying(10)"
  "emp02_eng_nm" "character varying(100)" [note: '영문성명']
  "emp02_gender_cd" "character varying(10)" [note: '성별코드']
  "emp02_nat_cd" "character varying(10)" [note: '국적코드']
  "emp02_email_other" "character varying(100)" [note: '이메일주소']
  "emp02_military_cd" "character varying(10)"
  "emp02_family_dscr" "character varying(100)"
  "emp02_marriage_cd" "character varying(10)"
  "emp02_zip_cd" "character varying(10)" [note: '우편번호']
  "emp02_zip_addr" "character varying(200)" [note: '우편번호주소']
  "emp02_addr_detail" "character varying(200)" [note: '상세주소']
  "emp02_home_telno" "character varying(20)" [note: '집전화번호']
  "emp02_note" "character varying(400)" [note: '비고']
  "emp02_note_admin" "text" [note: '비고(시스템관리자전용)']
  "emp02_hire_date_group" "date" [note: '입사일(그룹사기준)']
  "emp02_hire_date_leave_calc" "date" [note: '입사일(연차계산용)']

  indexes {
    (emp02_person_id) [name: 'emp02_others_idx01']
  }

  Note: 'Others 개인정보'
}

Table "public"."emp03_trans" {
  "emp03_trans_id" "numeric" [pk, note: '발령ID']
  "emp03_trans_date" "timestamp without time zone" [not null, note: '발령일자']
  "emp03_trans_cd" "character varying(40)" [not null, note: '100:채용/200:이동/../800:겸직/900:퇴직']
  "emp03_trans_reason" "character varying(400)" [note: '발령사유']
  "emp03_pos_cd" "character varying(40)" [not null, note: '직위코드(EmpPosCode)']
  "emp03_title_cd" "character varying(40)" [note: '직책코드(EmpTitleCode)']
  "emp03_grade_cd" "character varying(40)" [note: '특정직코드 (EmpGradeCode)']
  "emp03_org_code_id" "numeric" [not null, note: '조직코드ID']
  "emp03_note" "character varying(400)" [note: '비고']
  "emp03_person_id" "numeric" [not null, note: '직원ID']
  "emp03_kind_cd" "character varying(40)" [note: '유형코드 (EmpKindCode)']
  "emp03_job_code_id" "numeric" [note: '조직코드ID (사용안함)']
  "emp03_officer_yn" "character varying(5)" [note: '임원등기여부']
  "emp03_duty" "character varying(200)" [note: '주요업무']
  "emp03_org_head_yn" "character varying(5)" [note: '조직 장여부']
  "emp03_non_stay_yn" "character varying(5)" [note: '비상근 여부']
  "emp03_expiry_date" "timestamp without time zone" [note: '계약만료일자']
  "emp03_tdm_target_yn" "character varying(5)" [note: '책무대상여부']
  "emp03_director_yn" "character varying(5)" [note: '(일반)임원여부']

  indexes {
    ("emp03_person_id", "emp03_trans_date", "emp03_trans_cd") [unique, name: 'emp03_trans_emp03_person_id_emp03_trans_date_emp03_trans_cd_key']
    (emp03_person_id) [name: 'emp03_trans_idx01']
  }

  Note: '발령정보'
}

Table "public"."emp04_add_title" {
  "emp04_add_title_id" "numeric" [pk]
  "emp04_org_code_id" "numeric" [not null]
  "emp04_person_id" "numeric" [not null]
  "emp04_start_date" "timestamp without time zone" [not null]
  "emp04_close_date" "timestamp without time zone"
  "emp04_title_cd" "character varying(10)" [not null]
  "emp04_note" "character varying(400)"
  "emp04_trans_reason" "character varying(400)"
  "emp04_add_person_id" "numeric" [note: '파생된 겸직사원ID']

  indexes {
    ("emp04_org_code_id", "emp04_person_id", "emp04_start_date") [unique, name: 'emp04_add_title_emp04_org_code_id_emp04_person_id_emp04_sta_key']
    (emp04_person_id) [name: 'emp04_add_title_idx01']
    (emp04_add_person_id) [name: 'emp04_add_title_idx02']
  }

  Note: '겸직발령'
}

Table "public"."emp05_academic" {
  "emp05_academic_id" "numeric" [pk]
  "emp05_person_id" "numeric"
  "emp05_fr_ym" "character varying(7)"
  "emp05_to_ym" "character varying(7)"
  "emp05_school_name" "character varying(100)"
  "emp05_bachelor_degree" "character varying(10)"
  "emp05_degree_credit" "character varying(10)"
  "emp05_graduate_degree" "character varying(10)"
  "emp05_school_location" "character varying(200)"
  "emp05_note" "character varying(500)"
  "emp05_finance_relate_yn" "character varying(5)" [note: '금융관련 학력 여부']

  indexes {
    (emp05_person_id) [name: 'emp05_academic_idx01']
  }

  Note: '학력정보'
}

Table "public"."emp06_family" {
  "emp06_family_id" "numeric" [pk]
  "emp06_person_id" "numeric" [not null]
  "emp06_family_nm" "character varying(30)"
  "emp06_relation_cd" "character varying(10)" [note: '가족관계(FamilyRelateCode2-10:부/11:모/20:배우자/30:자녀/..)']
  "emp06_disability_grade" "character varying(10)"
  "emp06_birthday" "timestamp without time zone"
  "emp06_family_school" "character varying(100)"
  "emp06_family_job" "character varying(100)"
  "emp06_locate_cd" "character varying(10)"
  "emp06_family_location" "character varying(100)"
  "emp06_school_location" "character varying(200)"
  "emp06_note" "character varying(500)"

  indexes {
    (emp06_person_id) [name: 'emp06_family_idx01']
  }

  Note: '가족사항'
}

Table "public"."emp07_career" {
  "emp07_career_id" "numeric" [pk]
  "emp07_person_id" "numeric" [not null]
  "emp07_fr_ym" "character varying(7)"
  "emp07_to_ym" "character varying(7)"
  "emp07_company_nm" "character varying(100)"
  "emp07_final_org" "character varying(100)"
  "emp07_final_title" "character varying(100)"
  "emp07_final_role" "character varying(100)"
  "emp07_career_ty_cd" "character varying(10)"
  "emp07_note" "character varying(500)"
  "emp07_finance_relate_yn" "character varying(5)" [note: '금융관련 경력 여부']
  "emp07_main_career_yn" "character varying(5)" [note: '주요경력 여부']
  "emp07_extr_add_title_yn" "character varying(5)" [note: '대외겸직여부(책무기술서 겸직사항 기술)']
  "emp07_industry" "text" [note: '업종']

  indexes {
    (emp07_person_id) [name: 'emp07_career_idx01']
  }

  Note: '경력사항'
}

Table "public"."emp08_license" {
  "emp08_license_id" "numeric" [pk]
  "emp08_person_id" "numeric" [not null]
  "emp08_certified_dt" "timestamp without time zone" [note: '취득일자']
  "emp08_certified_nm" "character varying(100)" [note: '자격증명']
  "emp08_license_no" "character varying(100)" [note: '자격증번호']
  "emp08_issuing_agency" "character varying(100)" [note: '발급기관']
  "emp08_issuing_grade" "character varying(100)" [note: '발급등급']
  "emp08_note" "character varying(500)" [note: '비고']
  "emp08_finance_relate_yn" "character varying(5)" [note: '금융관련 자격증 여부']
  "emp08_kofia_reg_date" "date" [note: '협회등록일']

  indexes {
    (emp08_person_id) [name: 'emp08_license_idx01']
  }

  Note: '자격사항'
}

Table "public"."emp09_evaluation" {
  "emp09_evaluation_id" "numeric" [pk]
  "emp09_person_id" "numeric" [not null]
  "emp09_evaluation_dt" "timestamp without time zone"
  "emp09_evaluation_org" "character varying(100)"
  "emp09_evaluation_emp" "character varying(100)"
  "emp09_evaluation_grade" "character varying(100)"
  "emp09_evaluation_desc" "character varying(1000)"
  "emp09_note" "character varying(500)"

  indexes {
    (emp09_person_id) [name: 'emp09_evaluation_idx01']
  }

  Note: '고과평가'
}

Table "public"."emp10_addr_book" {
  "emp10_addr_book_id" "numeric" [pk, note: '주소록ID']
  "emp10_contacter_nm" "character varying(100)"
  "emp10_email_addr" "character varying(100)"
  "emp10_mobile_telno" "character varying(20)" [note: '휴대전화번호']
  "emp10_office_telno" "character varying(20)" [note: '회사전화번호']
  "emp10_company_nm" "character varying(100)" [note: '회사명']
  "emp10_pos_nm" "character varying(100)" [note: '직위']
  "emp10_person_id" "numeric" [not null, note: 'empId']
  "emp10_note" "text" [note: '비고']
  "emp10_public_yn" "character varying(5)"

  indexes {
    (emp10_person_id) [name: 'emp10_addr_book_idx01']
  }

  Note: '주소록'
}

Table "public"."emp11_reward" {
  "emp11_reward_id" "numeric" [pk]
  "emp11_person_id" "numeric" [not null]
  "emp11_reward_cd" "character varying(10)"
  "emp11_reward_dt" "timestamp without time zone"
  "emp11_reward_group" "character varying(100)"
  "emp11_reward_nm" "character varying(100)"
  "emp11_reward_desc" "character varying(1000)"
  "emp11_note" "character varying(500)"

  Note: '상벌내역'
}

Table "public"."emp12_event" {
  "emp12_event_id" "numeric" [pk]
  "emp12_person_id" "numeric" [not null]
  "emp12_event_dt" "timestamp without time zone"
  "emp12_event_nm" "character varying(100)"
  "emp12_event_part" "character varying(100)"
  "emp12_event_desc" "character varying(1000)"
  "emp12_note" "character varying(500)"

  Note: '행사내역'
}

Table "public"."emp13_project" {
  "emp13_project_id" "numeric" [pk]
  "emp13_person_id" "numeric" [not null]
  "emp13_fr_ym" "character varying(7)"
  "emp13_to_ym" "character varying(7)"
  "emp13_project_nm" "character varying(100)"
  "emp13_note" "character varying(500)"

  Note: '프로젝트'
}

Table "public"."emp14_account" {
  "emp14_account_id" "numeric" [pk, note: '급여계좌관리ID']
  "emp14_company_id" "numeric" [not null, note: '회사ID']
  "emp14_start_date" "date" [not null, note: '적용기준일']
  "emp14_person_id" "numeric" [not null, note: '사원ID']
  "emp14_bank_cd" "character varying(3)" [note: '은행코드(BankCode)']
  "emp14_account_no" "character varying(128)" [note: '계좌번호']
  "emp14_note" "character varying(200)" [note: '비고']

  indexes {
    (emp14_person_id) [name: 'emp14_account_idx01']
    (emp14_company_id) [name: 'emp14_account_idx02']
  }

  Note: '급여계좌관리'
}

Table "public"."emp15_cert" {
  "emp15_cert_id" "numeric" [pk, note: '증명서발급ID(PK)']
  "emp15_company_id" "numeric" [not null, note: '회사ID']
  "emp15_issue_date" "date" [not null, note: '발급일']
  "emp15_link_cd" "character varying(3)" [not null, note: '문서분류연결코드(증명서종류코드) - LinkCode(11:재직증명서/12:퇴직증명서/13:경력증명서/14:징계내역확인서)']
  "emp15_person_id" "numeric" [not null, note: '사원ID']
  "emp15_cert_use_cd" "character varying(1)" [not null, note: '용도코드(CertUseCode(1:금융기관 제출용/2:공공기관 제출용/3:회사 제출용/9:직접입력))']
  "emp15_cert_use" "character varying(200)" [note: '용도(직접입력시)']
  "emp15_dcr_class_tree_id" "numeric" [not null, note: '문서분류ID']
  "emp15_appr_id" "numeric" [note: '상신ID']

  indexes {
    (emp15_company_id, emp15_link_cd, emp15_issue_date) [name: 'emp15_cert_idx01']
    (emp15_person_id) [name: 'emp15_cert_idx02']
  }

  Note: '증명서발급'
}

Table "public"."emp16_cert_mapping" {
  "emp16_cert_mapping_id" "numeric" [pk, note: '증명서 맵핑ID']
  "emp16_company_id" "numeric" [not null, note: '회사ID']
  "emp16_title" "character varying(150)" [not null, note: '제목']
  "emp16_content" "text" [note: '내용']
  "emp16_link_cd" "character varying(5)" [not null, note: '코드 (LINKCODE / 01:휴가관리, 02:급여대장, 03:연봉계약)']
  "emp16_default_yn" "character varying(5)" [not null, note: '기본사용설정여부']
  "emp16_note" "character varying(500)" [note: '비고']

  indexes {
    (emp16_company_id, emp16_link_cd) [name: 'emp16_cert_mapping_idx01']
  }

  Note: '증명서 맵핑 => com10_form_mapping 사용으로 안쓰는 테이블이 됨'
}

Table "public"."emp17_benefit" {
  "emp17_benefit_id" "numeric" [pk, note: '복리후생비ID(PK)']
  "emp17_company_id" "numeric" [not null, note: '회사ID']
  "emp17_issue_date" "date" [not null, note: '신청일']
  "emp17_link_cd" "character varying(3)" [note: '문서분류연결코드(신청구분코드) - LinkCode (사용X)']
  "emp17_person_id" "numeric" [not null, note: '사원ID']
  "emp17_benefit_yn" "character varying(5)" [note: '지급여부']
  "emp17_dcr_class_tree_id" "numeric" [not null, note: '문서분류ID']
  "emp17_appr_id" "numeric" [note: '상신ID']
  "emp17_note" "character varying(200)" [note: '비고']
  "emp17_benefit_cd" "character varying(5)" [note: '복리후생비 신청구분(EmpBenefitType)']
  "emp17_issue_amt" "numeric" [note: '신청금액']
  "emp17_occ_date" "date" [note: '발생일자']
  "emp17_benefit_detail" "character varying(100)" [note: '복리후생비 상세(기타복리후생(ex,자기계발비/체력단련비)인 경우 반드시 입력)']
  "emp17_pay_request_yyyymm" "character varying(7)" [note: '지출결의서 기준년월']
  "emp17_pay_request_appr_id" "numeric" [note: '지출결의서 상신ID']

  Note: '복리후생비'
}

Table "public"."emp18_relate_file" {
  "emp18_relate_file_id" "numeric" [pk, note: '사원 연관파일 ID(PK)']
  "emp18_person_id" "numeric" [not null, note: '사원ID']
  "emp18_note" "character varying(200)" [note: '비고']

  Note: '사원 연관파일'
}

Table "public"."emp19_education" {
  "emp19_education_id" "numeric" [pk, note: '교육사항ID(PK)']
  "emp19_person_id" "numeric" [not null, note: '사원ID']
  "emp19_issue_date" "date" [note: '교육일자']
  "emp19_content" "character varying(500)" [note: '교육내용']
  "emp19_education_yn" "character varying(5)" [note: '수료여부(true/false)']
  "emp19_note" "character varying(500)" [note: '비고']
  "emp19_education_corp_nm" "text" [note: '교육기관명']

  Note: '교육사항'
}

Table "public"."emp20_leave" {
  "emp20_leave_id" "numeric" [pk, note: '휴가관리ID']
  "emp20_company_id" "numeric" [not null, note: '회사ID']
  "emp20_person_id" "numeric" [not null, note: '사원ID']
  "emp20_leave_cd" "character varying(2)" [not null, note: '휴가구분코드']
  "emp20_reg_date" "date" [not null, note: '등록일']
  "emp20_start_date" "date" [not null, note: '휴가시작일']
  "emp20_close_date" "date" [not null, note: '휴가종료일']
  "emp20_leave_count" "numeric" [not null, note: '기간']
  "emp20_reason" "text" [note: '사유']
  "emp20_emergency_telno" "character varying(50)" [not null, note: '비상연락처']
  "emp20_note" "text" [note: '비고']
  "emp20_appr_id" "numeric" [note: '상신ID (apr01_appr_id)']
  "emp20_class_tree_id" "numeric" [note: '문서분류ID']
  "emp20_cancel" "character varying(10)" [note: '취소여부(이미 결재가 진행되어 상신취소가 안될때 관리자에게 요청하여 취소함)']
  "emp20_spc_leave_cd" "character varying(2)" [note: '특별휴가코드(SpecialLeaveCode)']
  "emp20_manager_nm" "text" [note: '직무대행자']
  "emp20_over_confirm_status_cd" "character varying(2)" [note: '초과사용승인상태']
  "emp20_over_confirm_reason" "text" [note: '초과사용승인(반려)사유']
  "emp20_over_confirmer_id" "numeric" [note: '초과사용승인자ID']
  "emp20_over_confirm_date" "timestamp without time zone" [note: '초과사용승인일시']
  "emp20_etc_leave_id" "numeric" [note: '기타(포상)휴가ID(emp22_etc_leave_id)']

  indexes {
    (emp20_company_id, emp20_person_id) [name: 'emp20_leave_idx01']
    (emp20_company_id, emp20_reg_date) [name: 'emp20_leave_idx02']
    (emp20_etc_leave_id) [name: 'emp20_leave_idx03']
  }

  Note: '휴가관리'
}

Table "public"."emp21_un_leave" {
  "emp21_un_leave_id" "numeric" [pk, note: '미사용휴가관리ID']
  "emp21_company_id" "numeric" [not null, note: '회사ID']
  "emp21_person_id" "numeric" [not null, note: '사원ID']
  "emp21_un_leave_cd" "character varying(2)" [not null, note: '미사용휴가 구분(unLeaveCode : 01:1차통지 , 02:2차통지(2개월전)']
  "emp21_start_date" "timestamp without time zone" [not null, note: '생성일자']
  "emp21_total_days" "numeric" [not null, note: '발생휴가']
  "emp21_use_days" "numeric" [not null, note: '사용휴가']
  "emp21_remain_days" "numeric" [not null, note: '잔여휴가']
  "emp21_appr_id" "numeric" [note: '상신문서ID (사용촉진)']
  "emp21_expect_appr_id" "numeric" [note: '휴가사용 예상 상신문서ID (지정통보)']

  indexes {
    (emp21_company_id, emp21_un_leave_cd) [name: 'emp21_un_leave_idx01']
    (emp21_company_id, emp21_person_id) [name: 'emp21_un_leave_idx02']
  }

  Note: '미사용휴가관리'
}

Table "public"."emp22_etc_leave" {
  "emp22_etc_leave_id" "numeric" [pk, note: '기타휴가ID(PK)']
  "emp22_company_id" "numeric" [not null, note: '회사ID']
  "emp22_leave_cd" "character varying(2)" [note: '휴가코드(leaveCode)']
  "emp22_days" "numeric" [note: '휴가총일수']
  "emp22_start_date" "date" [note: '기간시작일']
  "emp22_close_date" "date" [note: '기간종료일']
  "emp22_reason" "character varying(200)" [note: '사유']
  "emp22_note" "character varying(200)" [note: '비고']
  "emp22_appr_id" "numeric" [note: '상신ID']

  Note: '기타휴가'
}

Table "public"."emp23_etc_leave_person" {
  "emp23_etc_leave_person_id" "numeric" [pk, note: '기타휴가-대상직원ID(PK)']
  "emp23_etc_leave_id" "numeric" [not null, note: '기타휴가ID(emp22_etc_leave_id)']
  "emp23_person_id" "numeric" [not null, note: '사원ID']

  Note: '기타휴가-대상직원'
}

Table "public"."emp24_joint_leave" {
  "emp24_joint_leave_id" "numeric" [pk, note: '공동휴가ID(PK)']
  "emp24_company_id" "numeric" [not null, note: '회사ID']
  "emp24_start_date" "date" [note: '공동연차 시작일자']
  "emp24_close_date" "date" [note: '공동연차 종료일자']
  "emp24_reason" "character varying(200)" [note: '사유']
  "emp24_note" "character varying(200)" [note: '비고']
  "emp24_leave_reg_yn" "character varying(5)" [note: '휴가등록여부(true/false)']
  "emp24_appr_id" "numeric" [note: '상신ID']

  Note: '공동휴가'
}

Table "public"."emp25_mypage_notice" {
  "emp25_mypage_notice_id" "numeric" [pk, note: 'MyPage알림권한ID(PK)']
  "emp25_company_id" "numeric" [not null, note: '회사ID']
  "emp25_person_id" "numeric" [not null, note: '사원ID']
  "emp25_ics_yn" "character varying(5)" [note: '내부통제 알림여부']
  "emp25_note" "character varying(200)" [note: '비고']
  "emp25_appr_yn" "character varying(5)" [note: '특정인 상신문서 알림여부']

  indexes {
    (emp25_company_id, emp25_person_id) [name: 'emp25_mypage_notice_idx01']
    (emp25_person_id) [name: 'emp25_mypage_notice_idx02']
  }

  Note: 'MyPage알림권한'
}

Table "public"."emp26_init_leave" {
  "emp26_init_leave_id" "numeric" [pk, note: '초기휴가정보ID(PK)']
  "emp26_company_id" "numeric" [not null, note: '회사ID']
  "emp26_person_id" "numeric" [not null, note: '사원ID']
  "emp26_year" "character varying(4)" [not null, note: '초기년도']
  "emp26_use_days" "numeric" [not null, note: '사용횟수']

  Note: '사용휴가일수 초기설정'
}

Table "public"."emp27_leave_old" {
  "emp27_leave_old_id" "numeric" [pk, note: '휴가사용내역ID(PK)']
  "emp27_company_id" "numeric" [note: '회사ID']
  "emp27_person_id" "numeric" [note: '사원ID']
  "emp27_leave_cd" "character varying(2)" [note: '휴가구분코드(leaveCode-01:연차/02~03:반차/04:특별휴가/05:포상휴가)']
  "emp27_reg_date" "date" [note: '등록일']
  "emp27_start_date" "date" [note: '휴가시작일']
  "emp27_close_date" "date" [note: '휴가종료일']
  "emp27_leave_count" "numeric" [note: '휴가기간']
  "emp27_reason" "text" [note: '사유']
  "emp27_note" "text" [note: '비고']

  indexes {
    (emp27_company_id) [name: 'emp27_leave_old_idx01']
    (emp27_company_id, emp27_person_id) [name: 'emp27_leave_old_idx02']
  }

  Note: '휴가사용내역(AssetERP 사용전)'
}

Table "public"."emp28_joint_leave_except" {
  "emp28_joint_leave_except_id" "numeric" [pk, note: '공동휴가 제외사원ID(PK)']
  "emp28_joint_leave_id" "numeric" [note: '공동휴가ID(emp24_joint_leave_id)']
  "emp28_person_id" "numeric" [note: '사원ID']
  "emp28_reason" "text" [note: '제외사유']

  indexes {
    (emp28_joint_leave_id) [name: 'emp28_joint_leave_except_idx01']
  }

  Note: '공동휴가 제외사원'
}

Table "public"."emp29_over_leave" {
  "emp29_over_leave_id" "numeric" [pk, note: '초과연차ID(PK)']
  "emp29_person_id" "numeric" [note: '사원ID']
  "emp29_over_year" "text" [note: '초과사용 년도']
  "emp29_over_used_days" "numeric" [note: '초과사용 연차일수']

  indexes {
    (emp29_person_id, emp29_over_year) [name: 'emp29_over_leave_idx01']
  }

  Note: '초과연차'
}

Table "public"."emp30_appr_step_except" {
  "emp30_appr_step_except_id" "numeric" [pk, note: '문서결재라인 예외ID(PK)']
  "emp30_company_id" "numeric" [not null, note: '회사ID']
  "emp30_reg_date" "date" [not null, note: '등록일']
  "emp30_person_id" "numeric" [not null, note: '사원ID']
  "emp30_use_yn" "character varying(5)" [note: '사용여부']
  "emp30_note" "character varying(200)" [note: '비고']

  Note: '문서결재라인 예외'
}

Table "public"."emp31_director" {
  "emp31_director_id" "numeric" [pk, note: '임원정보ID(PK)']
  "emp31_person_id" "numeric"
  "emp31_init_assign_date" "date" [note: '최초선임일']
  "emp31_rcnt_assing_date" "date" [note: '최근선임일']
  "emp31_expire_date" "date" [note: '임기만료일']
  "emp31_assign_cnt" "numeric" [note: '선임횟수']
  "emp31_add_title" "character varying(200)" [note: '겸직사항']
  "emp31_prefer_stock" "numeric" [note: '우선주 보유수']
  "emp31_common_stock" "numeric" [note: '보통주 보유수']
  "emp31_note" "text" [note: '비고']
  "emp31_qualified" "character varying(200)" [note: '자격요건확인']
  "emp31_end_date" "date" [note: '해임일']
  "emp31_end_reason" "text" [note: '해임사유']

  indexes {
    (emp31_person_id) [name: 'emp31_director_idx01']
  }

  Note: '임원정보'
}

Table "public"."emp32_relate_license" {
  "emp32_relate_license_id" "numeric" [pk, note: '금융투자전문인력구분연결ID(PK)']
  "emp32_license_id" "numeric" [note: '자격사항ID(emp08_license_id)']
  "emp32_finance_pro_type" "character varying(2)" [note: '금융투자전문인력구분(FinanceProType)']
  "emp32_title_yn" "character varying(5)" [note: '대표여부']

  Note: '금융투자전문인력구분연결'
}

Table "public"."emp33_except_biz" {
  "emp33_except_biz_id" "numeric" [pk, note: '사원별 예외업무 관리ID(PK)']
  "emp33_company_id" "numeric" [note: '회사ID']
  "emp33_person_id" "numeric" [note: '사원ID']
  "emp33_except_biz_cd" "character varying(2)" [note: '예외업무코드(ExceptBizCode-10:내부통제 준수확인서 작성)']
  "emp33_start_date" "date" [note: '예외시작일']
  "emp33_close_date" "date" [note: '예외종료일']
  "emp33_reason" "text" [note: '예외사유']
  "emp33_unvisible_yn" "character varying(5)" [note: '표시안함 여부(체크시 리스트에서 제거, 미체크시 해당없음으로 표시)']

  indexes {
    (emp33_person_id, emp33_except_biz_cd) [name: 'emp33_except_biz_idx01']
    (emp33_company_id, emp33_except_biz_cd) [name: 'emp33_except_biz_idx02']
  }

  Note: '사원별 예외업무 관리'
}

Table "public"."emp35_deduct" {
  "emp35_deduct_id" "numeric" [pk, note: '급여공제항목ID(PK)']
  "emp35_company_id" "numeric" [not null, note: '회사ID']
  "emp35_person_id" "numeric" [not null, note: '사원ID']
  "emp35_start_date" "date" [not null, note: '적용기준시작일']
  "emp35_basic_deduct_cnt" "numeric" [note: '공제대상(기본공제)가족수']
  "emp35_add_deduct_yn" "character varying(5)" [note: '추가인적공제 여부']
  "emp35_insure_yn" "character varying(5)" [note: '4대보험가입여부']
  "emp35_repr_yn" "character varying(5)" [note: '대표자여부(고용보험 미납대상)']
  "emp35_with_hold_rate" "numeric" [note: '원천징수비율(80%, 100%, 120%)']
  "emp35_note" "character varying(200)" [note: '비고']
  "emp35_child_deduct_cnt" "numeric" [note: '공제대상 8세이상 20세이하 자녀수']

  indexes {
    (emp35_person_id) [name: 'emp35_deduct_idx01']
  }

  Note: '급여공제항목'
}

Table "public"."emp36_add_deduct" {
  "emp36_add_deduct_id" "numeric" [pk, note: '추가인적공제정보ID(PK)']
  "emp36_deduct_id" "numeric" [not null, note: '급여공제항목ID(emp35_deduct_id)']
  "emp36_add_deduct_type" "character varying(1)" [not null, note: '추가공제대상구분(AddDeductType - 1:경로우대/2:장애인/3:부녀자/4:한부모)']
  "emp36_add_deduct_cnt" "numeric" [note: '추가공제대상수']

  indexes {
    (emp36_deduct_id) [name: 'emp36_add_deduct_idx01']
  }

  Note: '추가인적공제정보'
}

Table "public"."emp40_eval_list_std" {
  "emp40_eval_list_std_id" "numeric" [pk, note: '인사평가리스트 적용기준일 관리ID(PK)']
  "emp40_company_id" "numeric" [note: '회사ID']
  "emp40_start_date" "date" [note: '적용시작일']
  "emp40_fix_yn" "character varying(5)" [note: '확정여부']

  Note: '인사평가리스트 적용기준'
}

Table "public"."emp41_eval_list" {
  "emp41_eval_list_id" "numeric" [pk, note: '인사평가 평가리스트ID(PK)']
  "emp41_eval_list_std_id" "numeric" [note: '인사평가리스트 적용기준ID(emp40_eval_list_std_id)']
  "emp41_eval_class_cd" "character varying(3)" [note: '인사평가항목 분류코드(EmpEvalClassCode)']
  "emp41_content" "text" [note: '내용(평가요소)']
  "emp41_weight_member" "numeric" [note: '가중치-조직원(%)']
  "emp41_weight_leader" "numeric" [note: '가중치-조직장(%)']
  "emp41_seq" "numeric" [note: '조회순번']

  indexes {
    (emp41_eval_list_std_id) [name: 'emp41_eval_list_idx01']
  }

  Note: '인사평가 평가리스트'
}

Table "public"."emp42_eval_grade" {
  "emp42_eval_grade_id" "numeric" [pk, note: '인사평가 평가등급관리ID(PK)']
  "emp42_eval_list_std_id" "numeric" [note: '인사평가리스트 적용기준ID(emp40_eval_list_std_id)']
  "emp42_grade" "character varying(10)" [note: '평가등급']
  "emp42_grade_weight" "numeric" [note: '등급가중치']
  "emp42_grade_score" "numeric" [note: '등급기준점수']
  "emp42_compare_cd" "character varying(1)" [note: '이상/미만(CompareCode-1:이상/3:미만)']
  "emp42_reason_yn" "character varying(5)" [note: '평정사유 필수여부']

  indexes {
    (emp42_eval_list_std_id, emp42_grade) [name: 'emp42_eval_grade_idx01']
  }

  Note: '인사평가 평가등급관리'
}

Table "public"."emp43_eval_target" {
  "emp43_eval_target_id" "numeric" [pk, note: '인사평가 대상자ID(PK)']
  "emp43_company_id" "numeric" [note: '회사ID']
  "emp43_std_year" "character varying(4)" [note: '평가기준년도']
  "emp43_std_term_cd" "character varying(2)" [note: '평가기간코드(EmpEvalTermCode-10:전체/20:상반기/30:하반기)']
  "emp43_eval_start_date" "date" [note: '평가기간 시작일']
  "emp43_eval_close_date" "date" [note: '평가기간 종료일']
  "emp43_eval_list_std_id" "numeric" [note: '인사평가리스트 적용기준ID(emp40_eval_list_std_id)']
  "emp43_person_id" "numeric" [note: '평가대상자ID']
  "emp43_first_evaluator_id" "numeric" [note: '1차 평가자ID']
  "emp43_first_eval_weight" "numeric" [note: '1차 평가비중(%)']
  "emp43_first_eval_score" "numeric" [note: '1차 평가점수']
  "emp43_first_eval_reason" "text" [note: '1차 평정사유']
  "emp43_first_eval_end_yn" "character varying(5)" [note: '1차 평가완료여부']
  "emp43_second_evaluator_id" "numeric" [note: '2차 평가자ID']
  "emp43_second_eval_weight" "numeric" [note: '2차 평가비중(%)']
  "emp43_second_eval_score" "numeric" [note: '2차 평가점수']
  "emp43_second_eval_reason" "text" [note: '2차 평정사유']
  "emp43_second_eval_end_yn" "character varying(5)" [note: '2차 평가완료여부']
  "emp43_plus_score" "numeric" [note: '상점']
  "emp43_minus_score" "numeric" [note: '벌점']
  "emp43_reason_adjust_score" "numeric" [note: '평정사유가감']
  "emp43_ceo_eval_bonus" "numeric" [note: '대표이사 평가 가점']
  "emp43_ceo_eval_penalty" "numeric" [note: '대표이사 평가 감점']

  indexes {
    (emp43_company_id, emp43_std_year, emp43_std_term_cd) [name: 'emp43_eval_target_idx01']
  }

  Note: '인사평가 대상자'
}

Table "public"."emp44_eval_write" {
  "emp44_eval_write_id" "numeric" [pk, note: '인사평가수행ID(PK)']
  "emp44_eval_target_id" "numeric" [note: '인사평가 대상자ID(emp43_eval_target_id)']
  "emp44_evaluator_id" "numeric" [note: '인사평가 평가자ID']
  "emp44_eval_list_id" "numeric" [note: '인사평가 평가리스트ID(emp41_eval_list_id)']
  "emp44_eval_grade_id" "numeric" [note: '평가등급ID(emp42_eval_grade_id)']
  "emp44_eval_grade_score" "numeric" [note: '평가등급 환산점수']

  indexes {
    (emp44_eval_target_id) [name: 'emp44_eval_write_idx01']
  }

  Note: '인사평가수행'
}

Table "public"."emp45_eval_relate_appr" {
  "emp45_eval_relate_appr_id" "numeric" [pk, note: '인사평가 상신문서 연결ID(PK)']
  "emp45_company_id" "numeric" [note: '회사ID']
  "emp45_std_year" "character varying(4)" [note: '평가기준년도']
  "emp45_std_term_cd" "character varying(2)" [note: '평가기간코드(EmpEvalTermCode-10:전체/20:상반기/30:하반기)']
  "emp45_appr_id" "numeric" [note: '1차 보고 상신ID']
  "emp45_final_appr_id" "numeric" [note: '최종 보고 상신ID']

  Note: '인사평가 상신문서 연결'
}

Table "public"."emp50_transport_expense" {
  "emp50_transport_expense_id" "numeric" [pk, note: '여비교통비ID(PK)']
  "emp50_company_id" "numeric" [note: '회사ID']
  "emp50_person_id" "numeric" [note: '사용자ID']
  "emp50_yyyymm" "character varying(7)" [note: '기준년월(YYYY.MM)']
  "emp50_date" "date" [note: '사용일자']
  "emp50_start_point" "character varying(50)" [note: '출발지']
  "emp50_close_point" "character varying(50)" [note: '도착지']
  "emp50_start_time" "character varying(5)" [note: '출발시간']
  "emp50_close_time" "character varying(5)" [note: '도착시간']
  "emp50_amt" "numeric" [note: '사용금액']
  "emp50_transport_cd" "character varying(2)" [note: '교통수단코드(TransportCode-01:택시/02:버스/03:지하철/90:기타)']
  "emp50_note" "text" [note: '비고']

  indexes {
    (emp50_company_id, emp50_person_id, emp50_yyyymm) [name: 'emp50_transport_expense_idx01']
  }

  Note: '여비교통비'
}

Table "public"."emp51_relate_appr" {
  "emp51_relate_appr_id" "numeric" [pk, note: '여비교통비 신청서ID(PK)']
  "emp51_company_id" "numeric" [note: '회사ID']
  "emp51_person_id" "numeric" [note: '사용자ID']
  "emp51_yyyymm" "character varying(7)" [note: '기준년월(YYYY.MM)']
  "emp51_reg_no" "character varying(3)" [note: '신청번호']
  "emp51_reg_date" "date" [note: '신청일자']
  "emp51_reg_amt" "numeric" [note: '신청금액']
  "emp51_appr_id" "numeric" [note: '상신문서ID']
  "emp51_close_yn" "character varying(5)" [note: '마감여부']

  indexes {
    (emp51_company_id, emp51_person_id, emp51_yyyymm) [name: 'emp51_relate_appr_idx01']
    (emp51_company_id, emp51_yyyymm) [name: 'emp51_relate_appr_idx02']
  }

  Note: '여비교통비 신청서'
}

Table "public"."emp52_relate_appr" {
  "emp52_relate_appr_id" "numeric" [pk, note: '여비교통비 지출결의서ID(PK)']
  "emp52_company_id" "numeric" [note: '회사ID']
  "emp52_yyyymm" "character varying(7)" [note: '기준년월(YYYY.MM)']
  "emp52_appr_id" "numeric" [note: '상신문서ID']

  indexes {
    (emp52_company_id, emp52_yyyymm) [name: 'emp52_relate_appr_idx01']
  }

  Note: '여비교통비 지출결의서'
}

Table "public"."emp53_biz_trip" {
  "emp53_biz_trip_id" "numeric" [pk, note: '출장ID(PK)']
  "emp53_company_id" "numeric" [note: '회사ID']
  "emp53_person_id" "numeric" [note: '사원ID']
  "emp53_start_date" "date" [note: '출장시작일']
  "emp53_close_date" "date" [note: '출장종료일']
  "emp53_biz_trip_cd" "character varying(1)" [note: '출장구분(BizTripCode-1:국내출장/2:해외출장)']
  "emp53_destination" "character varying(100)" [note: '출장지']
  "emp53_purpose" "text" [note: '출장목적']
  "emp53_num" "character varying(10)" [note: '출장인원']
  "emp53_companion" "character varying(100)" [note: '동반인']
  "emp53_appr_id" "numeric" [note: '품의서ID']
  "emp53_result_appr_id" "numeric" [note: '결과보고서ID']
  "emp53_note" "text" [note: '비고']
  "emp53_result_skip_yn" "character varying(5)" [note: '결과보고서 면제여부']
  "emp53_skip_reason" "text" [note: '결과보고서 면제사유']
  "emp53_public_yn" "character varying(5)" [note: '전체공개']

  indexes {
    (emp53_company_id, emp53_person_id) [name: 'emp53_biz_trip_idx01']
    (emp53_company_id, emp53_start_date) [name: 'emp53_biz_trip_idx02']
  }

  Note: '출장'
}

Table "public"."emp54_errand" {
  "emp54_errand_id" "numeric" [pk, note: '외출ID(PK)']
  "emp54_company_id" "numeric" [note: '회사ID']
  "emp54_person_id" "numeric" [note: '사원ID']
  "emp54_errand_cd" "character varying(1)" [note: '외출코드(ErrandCode)']
  "emp54_date" "date" [note: '일자']
  "emp54_depart_time" "character varying(10)" [note: '외출시각']
  "emp54_return_time" "character varying(10)" [note: '복귀시각']
  "emp54_reason" "text" [note: '사유']
  "emp54_host" "character varying(50)" [note: '주최자']
  "emp54_venue" "character varying(100)" [note: '장소']
  "emp54_note" "text" [note: '비고']
  "emp54_appr_id" "numeric" [note: '상신ID']
  "emp54_public_yn" "character varying(5)" [note: '전체공개']

  indexes {
    (emp54_company_id, emp54_person_id) [name: 'emp54_errand_idx01']
    (emp54_company_id, emp54_date) [name: 'emp54_errand_idx02']
  }

  Note: '외출'
}

Table "public"."emp55_benefit_info" {
  "emp55_benefit_info_id" "numeric" [pk, note: '복리후생비 고객사별 설정ID(PK)']
  "emp55_company_id" "numeric" [note: '회사ID']
  "emp55_benefit_cd" "character varying(5)" [note: '복리후생비 구분(EmpBenefitType)']
  "emp55_issue_link_cd" "character varying(3)" [note: '신청서 링크코드(LinkCode0001)']
  "emp55_expense_link_cd" "character varying(3)" [note: '지출결의서 링크코드(LinkCode0005)']
  "emp55_account_cd" "character varying(20)" [note: '계정과목(act01_account_cd)']
  "emp55_un_use_yn" "character varying(5)" [note: '미사용여부']

  indexes {
    (emp55_company_id, emp55_benefit_cd) [name: 'emp55_benefit_info_idx01']
  }

  Note: '복리후생비 고객사별 설정'
}

Table "public"."emp56_share" {
  "emp56_share_id" "numeric" [pk, note: '출장,외출등 공유지정ID(PK)']
  "emp56_parent_id" "numeric" [note: '상위ID(emp53_biz_trip_id, emp54_errand_id)']
  "emp56_share_cd" "character varying(2)" [note: '공유구분(ShareCode-1:직원/2:부서)']
  "emp56_person_id" "numeric" [note: '사원ID']
  "emp56_org_id" "numeric" [note: '부서ID']
  "emp56_company_id" "numeric" [note: '회사ID']

  indexes {
    (emp56_parent_id) [name: 'emp56_share_idx01']
  }

  Note: '출장,외출등 공유지정'
}

Table "public"."emp57_addr_book_group" {
  "emp57_addr_book_group_id" "numeric" [pk, note: '주소록그룹ID']
  "emp57_company_id" "numeric" [not null, note: '회사ID']
  "emp57_parent_id" "numeric" [not null, note: '상위ID']
  "emp57_relate_id" "numeric" [not null, note: '주소록ID, 사원ID']
  "emp57_group_nm" "character varying(100)" [note: '그룹명']
  "emp57_public_yn" "character varying(5)" [note: '전체공유여부']
  "emp57_person_id" "numeric" [not null, note: '등록자ID']
  "emp57_note" "text" [note: '비고']

  Note: '주소록그룹'
}

Table "public"."emp60_sign" {
  "emp60_sign_id" "numeric" [pk, note: '결재서명관리ID']
  "emp60_person_id" "numeric" [not null, note: '사원ID']
  "emp60_company_id" "numeric" [not null, note: '회사ID']
  "emp60_use_yn" "character varying(5)" [note: '사용여부']
  "emp60_note" "text" [note: '비고']

  Note: '결재서명관리'
}

Table "public"."emp90_notice" {
  "emp90_notice_id" "numeric" [pk]
  "emp90_person_id" "numeric" [not null, note: '캘린더알림ID']
  "emp90_notice_keyword" "character varying(100)" [note: '알림문구(차단)']
  "emp90_note" "text" [note: '비고']

  Note: '캘린더알림'
}

Table "public"."emp91_menu_info_notice" {
  "emp91_menu_info_notice_id" "numeric" [pk, note: '매뉴소개 알람여부ID']
  "emp91_menu_id" "numeric" [not null, note: '매뉴ID(0입력시, 전체 false)']
  "emp91_date" "timestamp without time zone" [note: '차단날짜']
  "emp91_person_id" "numeric" [not null, note: '사원ID']

  Note: '매뉴소개 알람여부'
}

Table "public"."emp92_sms_notice" {
  "emp92_sms_notice_id" "numeric" [pk, note: 'SMS 알림ID']
  "emp92_person_id" "numeric" [not null, note: '사원ID']
  "emp92_sms_notice_cd" "character varying(5)" [note: 'SMS구분코드(SmsNoticeCode)']
  "emp92_sms_notice_yn" "character varying(5)" [note: 'SMS 알림여부']
  "emp92_mail_notice_yn" "character varying(5)"
  "emp92_note" "text"
  "emp92_talk_notice_yn" "character varying(5)"

  Note: 'SMS 알림'
}

Table "public"."emp93_sms_notice_target" {
  "emp93_sms_notice_target_id" "numeric" [pk, note: 'SMS구분코드별 알림ID']
  "emp93_company_id" "numeric" [not null, note: '회사ID']
  "emp93_person_id" "numeric" [not null, note: '사원ID']
  "emp93_sms_notice_cd" "character varying(3)" [note: 'SMS구분코드(SmsNoticeCode)']
  "emp93_note" "text" [note: '비고']

  Note: 'SMS구분코드별 알림'
}

Table "public"."emp99_person_del" {
  "emp99_person_del_id" "numeric" [not null]
  "emp99_person_id" "numeric" [pk]
  "emp99_emp_no" "character varying(20)"
  "emp99_order_seq" "character varying(10)"
  "emp99_kor_nm" "character varying(40)"
  "emp99_hire_cd" "character varying(10)"
  "emp99_apply_cd" "character varying(10)"
  "emp99_hire_date" "timestamp without time zone"
  "emp99_email_addr" "character varying(100)"
  "emp99_office_telno" "character varying(20)"
  "emp99_office_detail" "character varying(20)"
  "emp99_mobile_telno" "character varying(20)"
  "emp99_password" "character varying(128)"
  "emp99_company_id" "numeric" [not null]
  "emp99_note" "character varying(400)"
  "emp99_location_cd" "character varying(10)"
  "emp99_theme_cd" "character varying(10)"
  "emp99_lock_yn" "character varying(5)"
  "emp99_menu_fix_yn" "character varying(5)"
  "emp99_delete_date" "timestamp without time zone"
  "emp99_emp_id" "numeric" [not null]
}

```
