# 테이블: sys

52개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `sys01_company` | 회사정보 | 62 |
| `sys02_user` | 사용자정보 | 11 |
| `sys03_company_menu` | 회사별메뉴 | 5 |
| `sys04_role` | ROLE정보 | 7 |
| `sys05_user_role` | 사용자별ROLE정보 | 6 |
| `sys06_menu` | 메뉴정보 | 15 |
| `sys06_menu_20211118` |  | 7 |
| `sys07_role_menu` | 권한관련메뉴 | 5 |
| `sys08_code_kind` | 공통코드종류구분 | 5 |
| `sys09_code` | 공통코드 | 11 |
| `sys10_file` | 파일목록 | 19 |
| `sys11_relate_file` | 연관파일목록 | 4 |
| `sys12_calendar` | SYS12_CALENDAR | 7 |
| `sys13_code_group` | 공통코드 그룹관리 | 6 |
| `sys14_holiday` |  | 5 |
| `sys15_corp` | 기관정보관리 | 12 |
| `sys16_file_law_record` | 법규/경영공지 첨부파일 DML기록 | 21 |
| `sys17_corp_account` | 거래처 계좌번호 | 6 |
| `sys21_license_code` | 자격증코드 | 7 |
| `sys22_mail` | 회사메일 | 5 |
| `sys23_mail_role` | 회사메일권한 | 4 |
| `sys25_password` | 비밀번호관리 | 6 |
| `sys26_login` | 로그인정보 | 9 |
| `sys27_login_manage` | 회사별 로그인 관리 | 9 |
| `sys28_login_real_time` | 실시간 로그인 정보관리 | 5 |
| `sys29_login_secure` | 보안로그인여부(공인IP) | 6 |
| `sys30_leave_year` | 근속년수별 연차발생 갯수 | 4 |
| `sys31_leave_company` | 고객사별 휴가기준관리 | 8 |
| `sys40_bookmark` | 북마크 | 6 |
| `sys50_specific_menu` | 회사별 특정메뉴 관리 | 5 |
| `sys51_specific_menu_person` | 회사별 특정메뉴 사원관리 | 6 |
| `sys52_specific_menu_link` | 회사별 특정메뉴 LinkCode관리 | 5 |
| `sys53_specific_menu_request` | 회사별 특정메뉴 사용요청 | 9 |
| `sys54_specific_menu_history` | 회사별 특정메뉴 요청이력 | 6 |
| `sys60_file_policy` | 파일정책 | 4 |
| `sys61_file_del` | 파일삭제 | 7 |
| `sys71_security_audit_log` | 보안 감사 로그 (로그인/잠금/세션/파일 이벤트) | 10 |
| `sys80_admin_user_list` | 관리자 유저 | 5 |
| `sys81_admin_user_history` | 관리자 접속기록 | 4 |
| `sys82_admin_user_menu` | Admin유저 권한관련메뉴 | 5 |
| `sys83_secondary_auth_user` | 2차인증 사용자 | 7 |
| `sys85_client_info` |  | 8 |
| `sys90_after_service` | 개선 및 오류처리내역 | 12 |
| `sys91_advice_member` | AssetERP 자문위원 | 11 |
| `sys92_management_team` |  AssetERP 관리팀 | 7 |
| `sys93_company_id_rel` | Company ID 관계 (Table간 관계 등록) | 11 |
| `sys95_manual` | AssetERP 매뉴얼 | 6 |
| `sys96_menu_log` | 매뉴로그(사용X) | 7 |
| `sys96_open_menu_log` | 매뉴로그 | 7 |
| `sys97_notice_log` | 알림로그 | 6 |
| `sys98_log` | 시스템 로그 | 5 |
| `sys99_print` | 임시출력용 | 155 |

## DBML

```dbml
Table "public"."sys01_company" {
  "sys01_company_id" "numeric" [pk, note: '회사ID']
  "sys01_company_nm" "character varying(400)" [not null, note: '회사명']
  "sys01_biz_no" "character varying(20)" [not null, unique, note: '사업자등록번호']
  "sys01_office_tel_no" "character varying(20)" [note: '전화번호1']
  "sys01_emgrcy_passwd" "character varying(20)" [note: '전화번호2']
  "sys01_office_fax_no" "character varying(20)" [note: '팩스번호1']
  "sys01_zip_cd" "character varying(10)" [note: '우편번호']
  "sys01_zip_addr" "character varying(400)" [note: '주소']
  "sys01_zip_detail" "character varying(400)" [note: '상세주소']
  "sys01_loc_nm" "character varying(40)" [note: '지역']
  "sys01_anniv_date" "timestamp without time zone" [note: '기념일']
  "sys01_note" "text" [note: '비고']
  "sys01_mail_info" "character varying(20)" [note: '메일서버정보']
  "sys01_mobile_tel_no" "character varying(20)" [note: '비상전화']
  "sys01_email_addr" "character varying(20)" [note: '비상이메일']
  "sys01_start_date" "timestamp without time zone" [note: '설립일']
  "sys01_close_date" "timestamp without time zone" [note: '계약종료일']
  "sys01_use_yn" "character varying(10)" [note: '사용여부']
  "sys01_emp_info" "character varying(400)" [note: '담당자(이름/부서/직책)']
  "sys01_cont_type" "character varying(100)" [note: 'X']
  "sys01_main_image_id" "numeric" [note: 'X']
  "sys01_cycle_time" "character varying(10)" [default: `60`, note: 'X']
  "sys01_leave_yn" "character varying(10)" [note: '휴가초과허용여부']
  "sys01_leave_month_cd" "character varying(2)" [note: '휴가결산월(MonthsCode)']
  "sys01_leave_form_cd" "character varying(2)" [note: '휴가신청서 양식코드(LeaveFormCode)']
  "sys01_icam_company_cd" "character varying(8)" [note: 'ICAM운용사코드']
  "sys01_ast_manager_auto_yn" "character varying(5)" [note: '자산담당자 자동생성 여부(전체부서가 담당부서로 지정)']
  "sys01_appr_step_lock_yn" "character varying(5)" [note: '결재선 잠금여부(Default: true)']
  "sys01_account_close_month" "character varying(2)" [note: '회계결산월(MonthsCode)']
  "sys01_leave_compulsion_rt" "numeric" [note: '휴가의무사용율(%)']
  "sys01_ics_check_cycle_type" "character varying(1)" [note: '내부통제 체크리스트 주기구분(M:월/Q:분기)-IcsCheckListCycleType']
  "sys01_tax_type" "character varying(1)" [note: '과세구분(TaxType-1:면세/2:과세/3:공통)']
  "sys01_company_rep_nm" "character varying(20)" [note: '대외문서(대표이사)']
  "sys01_mail_log_yn" "character varying(5)" [note: '메일기록여부']
  "sys01_ics_comply_cycle_type" "character varying(1)" [note: '임직원 내부통제 준수점검 주기구분(M:월/Q:분기)-IcsCheckListCycleType']
  "sys01_dcr_numbering_cd" "character varying(1)" [note: '문서번호채번방식코드(DcrNumberingCode) - 1:연도별(기본)/2:연도-부서별 ']
  "sys01_dcr_detail_use_yn" "character varying(5)" [note: '문서세부분류 사용여부']
  "sys01_apr_manager_info_yn" "character varying(5)" [note: '대외문서 담당자정보포함여부']
  "sys01_notice_date" "timestamp without time zone" [note: '공지시작일']
  "sys01_owner_capital_apply_cd" "character varying(2)" [note: '자기자본적용일코드(OwnerCapitalApplyDateType-10:최근/20:전전월말)']
  "sys01_ics_guide_yn" "character varying(5)" [note: '내부통제 문서연결 가이드 사용여부']
  "sys01_asset_yn" "character varying(5)" [note: '고객사(자산)여부']
  "sys01_advis_yn" "character varying(5)" [note: '고객사(자문)여부']
  "sys01_pbs_yn" "character varying(5)" [note: '고객사(PBS)여부']
  "sys01_ast_eval_cycle_cd" "character varying(1)" [note: '평가주기 AssetEvalCycleCode(M:월평가,W:주평가(or일평가))']
  "sys01_corp_reg_no" "character varying(128)" [note: '법인등록번호']
  "sys01_income_tax_filing_cd" "character varying(1)" [note: '소득세신고주기코드(IncomeTaxFilingCode-M:매월/H:반기별)']
  "sys01_icam_advis_company_cd" "character varying(8)" [note: 'ICAM자문사코드']
  "sys01_login_secure_yn" "character varying(5)" [note: '보안로그인여부(공인IP)']
  "sys01_ics_non_stay_yn" "character varying(5)" [note: '내부통제 비상근인력 체크여부']
  "sys01_emp_eval_cycle_cd" "character varying(10)" [note: '인사평가 평가기간(CycleCode002 - 05:반기별/06:연별)']
  "sys01_emp_eval_month_cd" "character varying(10)" [note: '인사평가 시작월(MonthsCode)']
  "sys01_card_real_user_yn" "character varying(5)" [note: '법인카드 실사용자 사용여부']
  "sys01_erp_product_cd" "character varying(2)" [note: 'AssetERP상품코드(ErpProductCode-S1/S2/S3/A1)']
  "sys01_flt_only_curr_yn" "character varying(5)" [note: '사전신고 소급 미사용']
  "sys01_dcr_preconfirm_skip_yn" "character varying(5)" [note: '준감인 문서사전확인 승인Skip 여부(심사필번호 신청시 부여)']
  "sys01_secondary_auth_yn" "character varying(5)" [note: '2차인증사용여부']
  "sys01_leave_confirm_yn" "character varying(5)" [note: '초과휴가승인 사용여부(sys01_leave_yn=true 시 추가 조건)']
  "sys01_commute_lock_yn" "character varying(5)" [note: '근태잠금사용여부']
  "sys01_tdm_start_date" "date" [note: '책무이행점검 기산일']
  "sys01_ics_check_confirmer_type" "character varying(1)" [note: '내부통제 체크리스트 확인자 구분(IcsCheckListConfirmerType-1:조직장/2:준법감시인)']
  "sys01_commute_popup_yn" "character varying(5)" [note: '근태관리 팝업설정']

  Note: '회사정보'
}

Table "public"."sys02_user" {
  "sys02_user_id" "numeric" [pk, note: '관리자ID']
  "sys02_company_id" "numeric" [not null, note: '회사ID']
  "sys02_kor_nm" "character varying(100)" [not null, note: '성명']
  "sys02_email" "character varying(100)" [note: 'E-Mail 주소']
  "sys02_tel1" "character varying(40)" [note: '전화번호1']
  "sys02_tel2" "character varying(40)" [note: '전화번호2']
  "sys02_fax" "character varying(40)" [note: '팩스번호']
  "sys02_note" "character varying(1000)" [note: '비고']
  "sys02_login_id" "character varying(100)" [note: '로그인ID']
  "sys02_passwd" "character varying(128)" [note: '패스워드']
  "sys02_admin_yn" "character varying(5)" [note: '메뉴권한유무']

  indexes {
    (sys02_company_id) [name: 'sys02_user_idx01']
  }

  Note: '사용자정보'
}

Table "public"."sys03_company_menu" {
  "sys03_company_menu_id" "numeric" [pk, note: 'SYS03_COMPANY_MENU_ID']
  "sys03_company_id" "numeric" [not null, note: 'SYS03_COMPANY_ID']
  "sys03_menu_id" "numeric" [not null, note: 'SYS03_MENU_ID']
  "sys03_use_yn" "character varying(10)" [note: 'SYS03_USE_YN']
  "sys03_note" "character varying(400)" [note: 'SYS03_NOTE']

  indexes {
    (sys03_company_id) [name: 'sys03_company_menu_idx01']
  }

  Note: '회사별메뉴'
}

Table "public"."sys04_role" {
  "sys04_role_id" "numeric" [pk, note: 'SYS04_ROLE_ID']
  "sys04_role_nm" "character varying(100)" [not null, note: 'SYS04_ROLE_NM']
  "sys04_note" "character varying(400)" [note: 'SYS04_NOTE']
  "sys04_seq" "character varying(10)" [note: 'SYS04_SEQ']
  "sys04_company_id" "numeric" [note: 'SYS04_COMPANY_ID']
  "sys04_default_role" "character varying(10)" [note: 'SYS04_DEFAULT_ROLE']
  "sys04_admin_yn" "character varying(5)" [note: '관리자권한여부(true/false)']

  indexes {
    (sys04_company_id) [name: 'sys04_role_idx01']
  }

  Note: 'ROLE정보'
}

Table "public"."sys05_user_role" {
  "sys05_user_role_id" "numeric" [pk, note: 'SYS05_USER_ROLE_ID']
  "sys05_user_id" "numeric" [note: 'SYS05_USER_ID']
  "sys05_role_id" "numeric" [note: 'SYS05_ROLE_ID']
  "sys05_seq" "character varying(10)" [note: 'SYS05_SEQ']
  "sys05_note" "character varying(400)" [note: 'SYS05_NOTE']
  "sys05_auth_org_id" "numeric" [note: 'SYS05_AUTH_ORG_ID']

  indexes {
    ("sys05_user_id", "sys05_role_id") [unique, name: 'sys05_user_role_sys05_user_id_sys05_role_id_key']
    (sys05_user_id) [name: 'sys05_user_role_idx01']
  }

  Note: '사용자별ROLE정보'
}

Table "public"."sys06_menu" {
  "sys06_menu_id" "numeric" [pk, note: 'SYS06_MENU_ID']
  "sys06_menu_nm" "character varying(100)" [not null, note: 'SYS06_MENU_NM']
  "sys06_seq" "character varying(100)" [note: 'SYS06_SEQ']
  "sys06_note" "character varying(400)" [note: '화면안내']
  "sys06_parent_id" "numeric" [not null, note: 'SYS06_PARENT_ID']
  "sys06_use_yn" "character varying(10)" [note: 'SYS06_USE_YN']
  "sys06_class_nm" "character varying(400)" [note: 'SYS06_CLASS_NM']
  "sys06_menual_url" "text" [note: '매뉴얼URL']
  "sys06_add_title_use_yn" "character varying(5)"
  "sys06_mobi_use_yn" "character varying(5)"
  "sys06_mobi_class_nm" "character varying(400)"
  "sys06_menu_no" "character varying(4)" [unique, note: '메뉴번호']
  "sys06_note2" "text" [note: '비고']
  "sys06_sensitive_info_yn" "character varying(5)" [note: '민감정보(연봉/급여 등)']
  "sys06_personal_info_yn" "character varying(5)" [note: '개인정보(주민번호 등)']

  Note: '메뉴정보'
}

Table "public"."sys06_menu_20211118" {
  "sys06_menu_id" "numeric"
  "sys06_menu_nm" "character varying(100)"
  "sys06_seq" "character varying(100)"
  "sys06_note" "character varying(400)"
  "sys06_parent_id" "numeric"
  "sys06_use_yn" "character varying(10)"
  "sys06_class_nm" "character varying(400)"
}

Table "public"."sys07_role_menu" {
  "sys07_role_menu_id" "numeric" [pk, note: 'SYS07_ROLE_MENU_ID']
  "sys07_role_id" "numeric" [not null, note: 'SYS07_ROLE_ID']
  "sys07_menu_id" "numeric" [not null, note: 'SYS07_MENU_ID']
  "sys07_use_yn" "character varying(10)" [not null, note: 'SYS07_USE_YN']
  "sys07_note" "character varying(400)" [note: 'SYS07_NOTE']

  indexes {
    ("sys07_role_id", "sys07_menu_id") [unique, name: 'sys07_role_menu_sys07_role_id_sys07_menu_id_key']
    (sys07_role_id) [name: 'sys07_role_menu_idx01']
  }

  Note: '권한관련메뉴'
}

Table "public"."sys08_code_kind" {
  "sys08_code_kind_id" "numeric" [pk]
  "sys08_kind_cd" "character varying(50)" [not null]
  "sys08_kind_nm" "character varying(100)" [not null]
  "sys08_sys_yn" "character varying(10)"
  "sys08_note" "character varying(400)"

  Note: '공통코드종류구분'
}

Table "public"."sys09_code" {
  "sys09_code_id" "numeric" [pk]
  "sys09_code" "character varying(10)" [not null]
  "sys09_name" "character varying(400)" [not null]
  "sys09_seq" "character varying(10)"
  "sys09_note" "character varying(1000)"
  "sys09_apply_date" "timestamp without time zone" [not null]
  "sys09_close_yn" "character varying(10)"
  "sys09_code_kind_id" "numeric" [not null]
  "sys09_company_id" "numeric" [not null]
  "sys09_close_date" "timestamp without time zone"
  "sys09_desc" "text" [note: '코드설명(정의)']

  indexes {
    (sys09_company_id, sys09_code, sys09_apply_date) [name: 'idx_sys09_companyid_code_applydate']
    (sys09_company_id, sys09_code_kind_id) [name: 'sys09_code_idx01']
    (sys09_company_id, sys09_code_kind_id, sys09_code) [name: 'sys09_code_idx02']
  }

  Note: '공통코드'
}

Table "public"."sys10_file" {
  "sys10_file_id" "numeric" [pk, note: '파일ID']
  "sys10_parent_id" "numeric" [not null, note: '부모파일ID']
  "sys10_file_nm" "character varying(400)" [not null, note: '파일명']
  "sys10_reg_date" "timestamp without time zone" [not null, note: '저장일']
  "sys10_server_path" "character varying(1000)" [not null, note: '서버위치']
  "sys10_del_date" "timestamp without time zone" [note: '삭제일']
  "sys10_note" "character varying(1000)" [note: '비고']
  "sys10_size" "numeric" [note: '파일크기']
  "sys10_file_ext" "character varying(50)" [note: '파일확장자']
  "sys10_title_yn" "character varying(10)" [note: '표지여부']
  "sys10_file_yn" "character varying(10)" [note: '확정문서여부(결재완료후 파일등록)']
  "sys10_admin_yn" "character varying(5)" [note: '관리자등록여부(내부통제 서식파일)']
  "sys10_law_type" "character varying(3)" [note: '법령구분(LawType) / 내부통제 서식파일 구분']
  "sys10_print_yn" "character varying(5)" [note: '문서 출력여부']
  "sys10_stamp_yn" "character varying(5)" [note: '인감날인본 여부']
  "sys10_seq" "character varying(3)"
  "sys10_ext_yn" "character varying(5)" [note: '확장자 출력여부']
  "sys10_tdm_check_form_type" "character varying(5)" [note: '책무이행점검양식구분(TdmCheckFormType)']
  "sys10_person_id" "numeric" [note: '등록자ID']

  indexes {
    (sys10_parent_id) [name: 'idx_sys10_parent_id']
  }

  Note: '파일목록'
}

Table "public"."sys11_relate_file" {
  "sys11_relate_file_id" "numeric" [pk, note: '연관파일목록ID']
  "sys11_file_id" "numeric" [not null, note: '파일ID']
  "sys11_parent_id" "numeric" [not null, note: '연관부모ID']
  "sys11_parent_table" "text" [note: '연관부모Table']

  indexes {
    (sys11_file_id) [name: 'sys11_relate_file_idx01']
    (sys11_parent_id) [name: 'sys11_relate_file_idx02']
  }

  Note: '연관파일목록'
}

Table "public"."sys12_calendar" {
  "sys12_calendar_id" "numeric" [pk, note: 'keyId']
  "sys12_company_id" "numeric" [note: '회사ID']
  "sys12_day" "timestamp without time zone" [not null, note: '일자']
  "sys12_weekday" "character varying(10)" [not null, note: '요일']
  "sys12_working_yn" "character varying(10)" [not null, note: '영업일여부(true/false)']
  "sys12_off_reason" "character varying(100)" [note: '휴일사유']
  "sys12_note" "character varying(400)" [note: '비고']

  indexes {
    ("sys12_company_id", "sys12_day") [unique, name: 'sys12_calendar_sys12_company_id_sys12_day_key']
    (sys12_company_id, sys12_day) [name: 'sys12_calendar_idx01']
  }

  Note: 'SYS12_CALENDAR'
}

Table "public"."sys13_code_group" {
  "sys13_code_group_id" "numeric" [pk, note: '공통코드그룹관리ID(PK)']
  "sys13_kind_group_cd" "character varying(50)" [not null, note: '그룹코드']
  "sys13_kind_group_nm" "character varying(100)" [not null, note: '그룹설명']
  "sys13_code_kind_id" "numeric" [not null, note: '공통코드ID']
  "sys13_code_id" "numeric" [not null, note: '코드ID']
  "sys13_note" "character varying(200)" [note: '비고']

  Note: '공통코드 그룹관리'
}

Table "public"."sys14_holiday" {
  "sys14_holiday_id" "numeric" [pk]
  "sys14_company_id" "numeric"
  "sys14_day" "timestamp without time zone"
  "sys14_holiday_nm" "character varying(100)"
  "sys14_note" "character varying(200)"
}

Table "public"."sys15_corp" {
  "sys15_corp_id" "numeric" [pk, note: '기관정보관리ID(PK)']
  "sys15_company_id" "numeric" [not null, note: '회사ID']
  "sys15_corp_nm" "character varying(100)" [note: '기관명']
  "sys15_corp_type" "character varying(1)" [note: '기관구분(CorpType)']
  "sys15_iss_corp_cd" "character varying(5)" [note: '발행기관코드']
  "sys15_use_yn" "character varying(5)" [note: '사용여부']
  "sys15_seq" "numeric" [note: '조회순서']
  "sys15_note" "character varying(200)" [note: '비고']
  "sys15_corp_cd" "character varying(12)" [note: '기관코드']
  "sys15_biz_no" "character varying(12)" [note: '사업자등록번호']
  "sys15_tel" "character varying(50)" [note: '전화번호']
  "sys15_addr" "character varying(200)" [note: '주소']

  Note: '기관정보관리'
}

Table "public"."sys16_file_law_record" {
  "sys16_file_law_record_id" "numeric" [pk, note: '법규/경영공지 첨부파일 DML기록ID']
  "sys16_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "sys16_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "sys16_dml_user_id" "character varying(50)" [note: '데이터조작 User ID(emp01_person_Id)']
  "sys16_dml_user_ip" "character varying(50)" [note: '데이터조작 User IP']
  "sys16_file_id" "numeric" [not null, note: '파일ID(sys10_file_id)']
  "sys16_parent_id" "numeric" [note: '부모파일ID']
  "sys16_file_nm" "character varying(400)" [note: '파일명']
  "sys16_reg_date" "timestamp without time zone" [note: '저장일']
  "sys16_server_path" "character varying(1000)" [note: '서버위치']
  "sys16_del_date" "timestamp without time zone" [note: '삭제일']
  "sys16_note" "character varying(100)" [note: '비고']
  "sys16_size" "numeric" [note: '파일크기']
  "sys16_file_ext" "character varying(50)" [note: '파일확장자']
  "sys16_title_yn" "character varying(10)" [note: '표지여부']
  "sys16_file_yn" "character varying(10)" [note: '확정문서여부(결재완료후 파일등록)']
  "sys16_admin_yn" "character varying(5)" [note: '관리자등록여부(내부통제 서식파일)']
  "sys16_law_type" "character varying(3)" [note: '법령구분(LawType) / 내부통제 서식파일 구분']
  "sys16_print_yn" "character varying(5)" [note: '문서 출력여부']
  "sys16_stamp_yn" "character varying(5)" [note: '인감날인본 여부']
  "sys16_seq" "character varying(3)" [note: '조회순서']

  Note: '법규/경영공지 첨부파일 DML기록'
}

Table "public"."sys17_corp_account" {
  "sys17_corp_account_id" "numeric" [pk, note: '거래처 계좌번호ID(PK)']
  "sys17_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "sys17_bank_cd" "character varying(3)" [note: '은행코드(BankCode)']
  "sys17_account_no" "character varying(128)" [note: '계좌번호']
  "sys17_account_nm" "character varying(20)" [note: '계좌명']
  "sys17_main_account_yn" "character varying(5)" [note: '대표계좌여부']

  indexes {
    (sys17_corp_id) [name: 'sys17_corp_account_idx01']
  }

  Note: '거래처 계좌번호'
}

Table "public"."sys21_license_code" {
  "sys21_license_code_id" "numeric" [pk, note: 'SYS21_LICENSE_CODE_ID']
  "sys21_license_cd" "character varying(20)" [not null, note: 'SYS21_LICENSE_CD']
  "sys21_license_nm" "character varying(400)" [not null, note: 'SYS21_LICENSE_NM']
  "sys21_issue_org_nm" "character varying(100)" [note: 'SYS21_ISSUE_ORG_NM']
  "sys21_apply_date" "timestamp without time zone" [not null, note: 'SYS21_APPLY_DATE']
  "sys21_close_yn" "character varying(10)" [note: 'SYS21_CLOSE_YN']
  "sys21_note" "character varying(400)" [note: 'SYS21_NOTE']

  indexes {
    ("sys21_license_cd", "sys21_apply_date") [unique, name: 'sys21_license_code_sys21_license_cd_sys21_apply_date_key']
  }

  Note: '자격증코드'
}

Table "public"."sys22_mail" {
  "sys22_mail_id" "numeric" [pk, note: '회사메일ID']
  "sys22_company_id" "numeric" [not null, note: '회사ID']
  "sys22_mail_address" "character varying(100)" [not null, note: '주소']
  "sys22_mail_passwd" "character varying(100)" [note: '패스워드']
  "sys22_note" "character varying(400)" [note: '비고']

  Note: '회사메일'
}

Table "public"."sys23_mail_role" {
  "sys23_mail_role_id" "numeric" [pk, note: '회사메일권한ID']
  "sys23_mail_id" "numeric" [not null, note: '회사메일ID']
  "sys23_person_id" "numeric" [not null, note: '사원ID']
  "sys23_note" "character varying(400)" [note: '비고']

  Note: '회사메일권한'
}

Table "public"."sys25_password" {
  "sys25_password_id" "numeric" [pk, note: '비밀번호관리ID(PK)']
  "sys25_company_id" "numeric" [not null, note: '회사ID']
  "sys25_person_id" "numeric" [not null, note: '사원ID']
  "sys25_seq" "numeric" [not null, note: '순번']
  "sys25_pwd" "character varying(128)" [note: '비밀번호']
  "sys25_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (sys25_company_id, sys25_person_id) [name: 'sys25_password_idx01']
  }

  Note: '비밀번호관리'
}

Table "public"."sys26_login" {
  "sys26_login_id" "numeric" [pk, note: '로그인정보ID(PK)']
  "sys26_person_id" "numeric" [not null, note: '사원ID']
  "sys26_open_date" "timestamp without time zone" [not null, note: '로그인일시']
  "sys26_ip_address" "character varying(100)" [note: '로그인IP']
  "sys26_status_cd" "character varying(10)" [note: '로그인상태']
  "sys26_login_mode" "character varying(1)" [note: '로그인모드(P:데스크탑/M:모바일)']
  "sys26_mac_address" "character varying(24)" [note: 'Mac주소']
  "sys26_os" "character varying(100)" [note: 'OS명']
  "sys26_browser" "character varying(100)" [note: '브라우저명']

  Note: '로그인정보'
}

Table "public"."sys27_login_manage" {
  "sys27_login_manage_id" "numeric" [pk, note: '회사별 로그인 관리 ID(PK)']
  "sys27_company_id" "numeric" [not null, note: '회사ID']
  "sys27_person_id" "numeric" [not null, note: '사원ID']
  "sys27_open_date" "timestamp without time zone" [not null, note: '접속허용 시작일']
  "sys27_mac_address" "character varying(24)" [note: 'Mac주소']
  "sys27_place_cd" "character varying(2)" [note: '접속장소(LoginPlaceCode : 01/집, 02/회사, 03/기타)']
  "sys27_reason" "character varying(500)" [note: '사유']
  "sys27_confirm_date" "timestamp without time zone" [note: '승인일']
  "sys27_confirm_yn" "character varying(5)" [note: '승인여부']

  Note: '회사별 로그인 관리'
}

Table "public"."sys28_login_real_time" {
  "sys28_login_real_time_id" "numeric" [pk, note: '실시간 로그인 정보관리 ID(PK)']
  "sys28_person_id" "numeric" [not null, note: '사원ID']
  "sys28_login_time" "timestamp without time zone" [not null, note: '접속시간']
  "sys28_ip_address" "character varying(50)" [note: 'IP주소']
  "sys28_session_id" "numeric" [note: 'Session ID']

  Note: '실시간 로그인 정보관리'
}

Table "public"."sys29_login_secure" {
  "sys29_login_secure_id" "numeric" [pk, note: '보안로그인여부(공인IP) ID']
  "sys29_company_id" "numeric" [not null, note: '회사ID']
  "sys29_start_date" "timestamp without time zone" [note: '시작일']
  "sys29_close_date" "timestamp without time zone" [note: '종료일']
  "sys29_public_ip" "character varying(100)" [not null, note: '공인IP']
  "sys29_note" "character varying(400)" [note: '비고']

  Note: '보안로그인여부(공인IP)'
}

Table "public"."sys30_leave_year" {
  "sys30_leave_year_id" "numeric" [pk, note: 'Key ID']
  "sys30_company_id" "numeric" [not null, note: '회사ID']
  "sys30_year" "numeric" [not null, note: '근속년수']
  "sys30_leave_days" "numeric" [not null, note: '발생연차']

  Note: '근속년수별 연차발생 갯수'
}

Table "public"."sys31_leave_company" {
  "sys31_leave_company_id" "numeric" [pk, note: '고객사별 휴가기준관리ID(PK)']
  "sys31_company_id" "numeric" [note: '회사ID']
  "sys31_leave_cd" "character varying(2)" [note: '휴가코드(leaveCode)']
  "sys31_spc_leave_cd" "character varying(2)" [note: '특별휴가코드(SpecialLeaveCode)']
  "sys31_days" "numeric" [note: '일수']
  "sys31_calc_cd" "character varying(1)" [note: '휴가일수계산구분(LeaveDaysCalcType)']
  "sys31_un_use_yn" "character varying(5)" [note: '미사용여부']
  "sys31_note" "text" [note: '비고']

  Note: '고객사별 휴가기준관리'
}

Table "public"."sys40_bookmark" {
  "sys40_bookmark_id" "numeric" [pk, note: '북마크ID']
  "sys40_company_id" "numeric" [not null, note: '회사ID']
  "sys40_person_id" "numeric" [not null, note: '사원ID']
  "sys40_menu_id" "numeric" [not null, note: '메뉴ID']
  "sys40_seq" "character varying(100)" [note: '메뉴순서']
  "sys40_parent_title_nm" "character varying(100)" [note: '그룹명']

  indexes {
    (sys40_company_id, sys40_person_id) [name: 'sys40_bookmark_idx01']
  }

  Note: '북마크'
}

Table "public"."sys50_specific_menu" {
  "sys50_specific_menu_id" "numeric" [pk, note: '회사별 특정메뉴 관리Id']
  "sys50_company_id" "numeric" [not null, note: '회사Id']
  "sys50_menu_id" "numeric" [not null, note: '매뉴Id']
  "sys50_note" "text" [note: '비고']
  "sys50_specific_work_cd" "character varying(3)" [note: '특정업무 구분코드(SpecificWorkCode)']

  Note: '회사별 특정메뉴 관리'
}

Table "public"."sys51_specific_menu_person" {
  "sys51_specific_menu_person_id" "numeric" [pk, note: '회사별 특정메뉴 사원관리Id']
  "sys51_specific_menu_id" "numeric" [not null, note: '회사별 특정메뉴 관리Id']
  "sys51_person_id" "numeric" [not null, note: '사원Id']
  "sys51_use_yn" "character varying(5)" [note: '사용여부']
  "sys51_note" "text" [note: '비고']
  "sys51_specific_work_cd" "character varying(3)" [note: '특정업무 구분코드(SpecificWorkCode)']

  Note: '회사별 특정메뉴 사원관리'
}

Table "public"."sys52_specific_menu_link" {
  "sys52_specific_menu_link_id" "numeric" [pk, note: '회사별 특정메뉴 LinkCode관리Id']
  "sys52_company_id" "numeric" [not null, note: '회사Id']
  "sys52_specific_work_cd" "character varying(3)" [note: '특정업무 구분코드(SpecificWorkCode)']
  "sys52_link_cd" "character varying(3)" [note: 'LinkCode']
  "sys52_note" "text" [note: '비고']

  Note: '회사별 특정메뉴 LinkCode관리'
}

Table "public"."sys53_specific_menu_request" {
  "sys53_specific_menu_request_id" "numeric" [pk, note: '회사별 특정메뉴 사용요청Id']
  "sys53_company_id" "numeric" [not null, note: '회사Id']
  "sys53_person_id" "numeric" [not null, note: '사원Id(신청자)']
  "sys53_reg_date" "timestamp without time zone" [note: '신청일자']
  "sys53_state_cd" "character varying(3)" [note: '상태구분(SpecificStateCode)']
  "sys53_specific_work_cd" "character varying(3)" [note: '특정업무 구분코드(SpecificWorkCode)']
  "sys53_appr_id" "numeric" [note: '상신문서Id']
  "sys53_confirm_nm" "text" [note: '확인자명(admin)']
  "sys53_confirm_date" "timestamp without time zone"

  Note: '회사별 특정메뉴 사용요청'
}

Table "public"."sys54_specific_menu_history" {
  "sys54_specific_menu_history_id" "numeric" [pk, note: '회사별 특정메뉴 요청이력 ID']
  "sys54_company_id" "numeric" [not null, note: '회사 ID']
  "sys54_reg_date" "timestamp without time zone" [note: '요청일']
  "sys54_confirm_nm" "character varying(50)" [note: '처리(확인)자명']
  "sys54_confirm_date" "timestamp without time zone" [note: '처리일']
  "sys54_note" "text" [note: '비고']

  Note: '회사별 특정메뉴 요청이력'
}

Table "public"."sys60_file_policy" {
  "sys60_file_policy_id" "numeric" [pk, note: '파일정책ID']
  "sys60_ext" "text" [note: '확장자']
  "sys60_mime_type" "text" [note: 'MIME']
  "sys60_note" "text" [note: '비고']

  Note: '파일정책'
}

Table "public"."sys61_file_del" {
  "sys61_file_del_id" "numeric" [pk, note: '파일삭제ID']
  "sys61_file_id" "numeric" [not null, note: '파일ID']
  "sys61_parent_id" "numeric" [not null, note: 'sys10_parent_id']
  "sys61_del_date" "timestamp without time zone" [not null, note: '삭제일']
  "sys61_reason" "text" [note: '사유']
  "sys61_note" "character varying(1000)" [note: '비고']
  "sys61_person_id" "numeric" [note: '등록자ID']

  Note: '파일삭제'
}

Table "public"."sys71_security_audit_log" {
  "audit_id" "bigint" [pk, increment]
  "event_type" "character varying(40)" [not null, note: '이벤트 유형 (AuditEventType)']
  "result" "character varying(10)" [not null, note: '결과 (SUCCESS/FAIL)']
  "user_id" "character varying(50)" [note: '행위자 로그인 아이디 (app_user.username)']
  "target_id" "character varying(100)" [note: '대상 식별자 (대상 사용자, 파일ID 등)']
  "detail" "character varying(500)"
  "client_ip" "character varying(45)"
  "user_agent" "character varying(300)"
  "trace_id" "character varying(32)" [note: '요청 추적 ID (X-Trace-Id, 애플리케이션 로그와 연결)']
  "created_at" "timestamp without time zone" [not null, default: `now()`]

  indexes {
    (created_at) [name: 'idx_sys71_security_audit_log_created']
    (user_id, created_at) [name: 'idx_sys71_security_audit_log_user']
  }

  Note: '보안 감사 로그 (로그인/잠금/세션/파일 이벤트)'
}

Table "public"."sys80_admin_user_list" {
  "sys80_admin_user_list_id" "numeric" [pk, note: '관리자 유저ID']
  "sys80_user_nm" "character varying(20)" [note: '관리자 유저명']
  "sys80_user_phone" "character varying(13)" [note: '관리자 유저연락처']
  "sys80_note" "character varying(200)" [note: '비고']
  "sys80_temp_password" "character varying(6)" [note: '임시 비밀번호']

  Note: '관리자 유저'
}

Table "public"."sys81_admin_user_history" {
  "sys81_admin_user_history_id" "numeric" [pk, note: '관리자 접속기록ID']
  "sys81_user" "character varying(50)" [note: '접속기록유저정보']
  "sys81_reg_date" "timestamp without time zone" [note: '접속일자']
  "sys81_sms_content" "character varying(100)" [note: '내용']

  Note: '관리자 접속기록'
}

Table "public"."sys82_admin_user_menu" {
  "sys82_admin_user_menu_id" "numeric" [pk, note: 'Admin유저 권한관련메뉴 ID']
  "sys82_user_id" "numeric" [not null, note: '회사별 관리자유저ID']
  "sys82_menu_id" "numeric" [not null, note: '메뉴ID']
  "sys82_use_yn" "character varying(10)" [not null, note: '사용유무']
  "sys82_note" "character varying(400)" [note: '비고']

  Note: 'Admin유저 권한관련메뉴'
}

Table "public"."sys83_secondary_auth_user" {
  "sys83_secondary_auth_user_id" "numeric" [pk, note: '2차인증 사용자ID']
  "sys83_company_id" "numeric" [not null, note: '회사ID']
  "sys83_person_id" "numeric" [not null, note: '사원ID']
  "sys83_phone" "character varying(13)" [note: '휴대폰번호']
  "sys83_temp_password" "character varying(6)" [note: '인증번호']
  "sys83_reg_date" "timestamp without time zone" [note: '발급일시']
  "sys83_note" "text" [note: '비고']

  Note: '2차인증 사용자'
}

Table "public"."sys85_client_info" {
  "sys85_client_info_id" "numeric" [pk, note: '고객사개인정보ID']
  "sys85_company_nm" "character varying(50)" [note: '고객사명']
  "sys85_org_nm" "character varying(50)" [note: '고객사 부서명']
  "sys85_pos_nm" "character varying(50)" [note: '고객사 사원직위']
  "sys85_client_nm" "character varying(50)" [note: '고객사 사원명']
  "sys85_moblie_telno" "character varying(50)" [note: '휴대폰번호']
  "sys85_note" "character varying(200)" [note: '비고']
  "sys85_reg_date" "timestamp without time zone" [note: '등록일']
}

Table "public"."sys90_after_service" {
  "sys90_after_service_id" "numeric" [pk, note: '서비스id']
  "sys90_company_id" "numeric" [note: 'SYS90_COMPANY_ID']
  "sys90_reg_emp_nm" "character varying(100)"
  "sys90_type_yn" "character varying(10)" [note: '구분->10:오류,20:개선,30:건의,40:기타']
  "sys90_happen_date" "timestamp without time zone" [not null, note: '발생일자']
  "sys90_happen_reason" "text" [note: '개선 및 오류내용']
  "sys90_happen_remedy" "text" [note: '처리방안']
  "sys90_worker" "character varying(100)" [note: '담당자']
  "sys90_due_date" "timestamp without time zone" [note: '완료예정일']
  "sys90_state_cd" "character varying(10)"
  "sys90_remarks" "text" [note: '비고']
  "sys90_confirm_yn" "character varying(5)" [note: '요청자 확인여부(true/false)']

  Note: '개선 및 오류처리내역'
}

Table "public"."sys91_advice_member" {
  "sys91_advice_member_id" "numeric" [pk, note: 'AssetERP 자문위원ID(PK)']
  "sys91_company_id" "numeric" [not null, note: '회사ID']
  "sys91_field" "character varying(100)" [note: '분야']
  "sys91_company_nm" "character varying(50)" [note: '회사명']
  "sys91_member_nm" "character varying(50)" [note: '성명']
  "sys91_career" "text" [note: '약력']
  "sys91_homepage" "character varying(50)" [note: '홈페이지']
  "sys91_telno" "character varying(50)" [note: '연락처']
  "sys91_email" "character varying(100)" [note: '이메일']
  "sys91_address" "character varying(300)" [note: '주소']
  "sys91_note" "text" [note: '비고']

  Note: 'AssetERP 자문위원'
}

Table "public"."sys92_management_team" {
  "sys92_management_team_id" "numeric" [pk, note: 'AssetERP 관리팀ID(PK)']
  "sys92_company_id" "numeric" [not null, note: '회사ID']
  "sys92_person_id" "numeric" [note: '사원ID']
  "sys92_charge_part" "character varying(100)" [note: '담당업무']
  "sys92_work_year" "text" [note: '관련업무 근속년수']
  "sys92_main_career" "text" [note: '주요경력']
  "sys92_note" "text" [note: '비고']

  Note: ' AssetERP 관리팀'
}

Table "public"."sys93_company_id_rel" {
  "sys93_company_id_rel_id" "numeric" [pk]
  "sys93_table_name" "character varying(40)"
  "sys93_table_company_id" "character varying(40)" [note: 'Table내의 Company-id ColumnName']
  "sys93_fst_rel_column_name" "character varying(40)" [note: '1차 연결Table과의 참조 ColumnName']
  "sys93_fst_table_name" "character varying(40)" [note: '1차 연결Table Name']
  "sys93_fst_column_name" "character varying(40)" [note: '1차 연결Table의 Key-ID ColumnName']
  "sys93_fst_company_id" "character varying(40)" [note: '1차 연결Table의 Company-id ColumnName']
  "sys93_snd_rel_column_name" "character varying(40)" [note: '2차 연결Table과의 참조 ColumnName']
  "sys93_snd_table_name" "character varying(40)" [note: '2차 연결Table Name']
  "sys93_snd_column_name" "character varying(40)" [note: '2차 연결Table의 Key-ID ColumnName']
  "sys93_snd_company_id" "character varying(40)" [note: '2차 연결Table의 Company-id ColumnName']

  Note: 'Company ID 관계 (Table간 관계 등록)'
}

Table "public"."sys95_manual" {
  "sys95_manual_id" "numeric" [pk, note: '메뉴얼ID']
  "sys95_company_id" "numeric" [not null, note: '회사ID']
  "sys95_reg_date" "timestamp without time zone" [not null, note: '등록일']
  "sys95_note" "text" [note: '비고']
  "sys95_manual_type" "character varying(3)" [note: '매뉴얼구분(ManualType)']
  "sys95_public_yn" "character varying(5)" [note: '공개여부']

  Note: 'AssetERP 매뉴얼'
}

Table "public"."sys96_menu_log" {
  "sys96_menu_log_id" "numeric" [pk, note: '매뉴로그ID']
  "sys96_company_id" "numeric" [not null, note: '회사ID']
  "sys96_person_id" "numeric" [not null, note: '사원ID']
  "sys96_first_date" "timestamp without time zone" [not null, note: '최초접속일']
  "sys96_last_date" "timestamp without time zone" [not null, note: '최근접속일']
  "sys96_class_nm" "character varying(200)" [note: '매뉴Class명']
  "sys96_cnt" "numeric" [note: '총접속횟수']

  Note: '매뉴로그(사용X)'
}

Table "public"."sys96_open_menu_log" {
  "sys96_open_menu_log_id" "numeric" [pk, note: '매뉴로그ID']
  "sys96_login_id" "numeric" [not null, note: '로그인정보ID(sys26_login_id)']
  "sys96_company_id" "numeric" [not null, note: '회사ID']
  "sys96_person_id" "numeric" [not null, note: '사원ID']
  "sys96_date" "timestamp without time zone" [not null, note: '접속시간']
  "sys96_class_nm" "character varying(200)" [note: '매뉴Class명']
  "sys96_second" "numeric" [note: '초단위']

  Note: '매뉴로그'
}

Table "public"."sys97_notice_log" {
  "sys97_notice_log_id" "integer" [pk, increment, note: '알림로그ID(PK)']
  "sys97_log_date" "timestamp without time zone" [default: `CURRENT_TIMESTAMP`, note: '로그생성일시']
  "sys97_proc_nm" "text" [note: '발생프로세스']
  "sys97_notice_msg" "text" [note: '알림메세지']
  "sys97_err_msg" "text" [note: '에러메세지']
  "sys97_note" "text" [note: '비고']

  Note: '알림로그'
}

Table "public"."sys98_log" {
  "sys98_log_id" "integer" [pk, increment]
  "sys98_log_time" "timestamp without time zone" [default: `CURRENT_TIMESTAMP`]
  "sys98_log_level" "text"
  "sys98_message" "text"
  "sys98_additional_data" "text"

  Note: '시스템 로그'
}

Table "public"."sys99_print" {
  "sys99_print_id" "numeric" [pk, note: '증명서발급ID(PK)']
  "sys99_company_id" "numeric" [note: '회사ID']
  "sys99_person_id" "numeric" [note: '출력자ID']
  "sys99_window_class_nm" "character varying(200)" [note: '화면 클래스명']
  "sys99_group_id" "numeric" [note: '출력그룹ID']
  "sys99_string01" "character varying(400)"
  "sys99_string02" "character varying(400)"
  "sys99_string03" "character varying(400)"
  "sys99_string04" "character varying(400)"
  "sys99_string05" "character varying(400)"
  "sys99_string06" "character varying(400)"
  "sys99_string07" "character varying(400)"
  "sys99_string08" "character varying(400)"
  "sys99_string09" "character varying(400)"
  "sys99_string10" "character varying(400)"
  "sys99_string11" "character varying(400)"
  "sys99_string12" "character varying(400)"
  "sys99_string13" "character varying(400)"
  "sys99_string14" "character varying(400)"
  "sys99_string15" "character varying(400)"
  "sys99_string16" "character varying(400)"
  "sys99_string17" "character varying(400)"
  "sys99_string18" "character varying(400)"
  "sys99_string19" "character varying(400)"
  "sys99_string20" "character varying(400)"
  "sys99_string21" "character varying(400)"
  "sys99_string22" "character varying(400)"
  "sys99_string23" "character varying(400)"
  "sys99_string24" "character varying(400)"
  "sys99_string25" "character varying(400)"
  "sys99_string26" "character varying(400)"
  "sys99_string27" "character varying(400)"
  "sys99_string28" "character varying(400)"
  "sys99_string29" "character varying(400)"
  "sys99_string30" "character varying(400)"
  "sys99_string31" "character varying(400)"
  "sys99_string32" "character varying(400)"
  "sys99_string33" "character varying(400)"
  "sys99_string34" "character varying(400)"
  "sys99_string35" "character varying(400)"
  "sys99_string36" "character varying(400)"
  "sys99_string37" "character varying(400)"
  "sys99_string38" "character varying(400)"
  "sys99_string39" "character varying(400)"
  "sys99_string40" "character varying(400)"
  "sys99_string41" "character varying(400)"
  "sys99_string42" "character varying(400)"
  "sys99_string43" "character varying(400)"
  "sys99_string44" "character varying(400)"
  "sys99_string45" "character varying(400)"
  "sys99_string46" "character varying(400)"
  "sys99_string47" "character varying(400)"
  "sys99_string48" "character varying(400)"
  "sys99_string49" "character varying(400)"
  "sys99_string50" "character varying(400)"
  "sys99_long01" "numeric"
  "sys99_long02" "numeric"
  "sys99_long03" "numeric"
  "sys99_long04" "numeric"
  "sys99_long05" "numeric"
  "sys99_long06" "numeric"
  "sys99_long07" "numeric"
  "sys99_long08" "numeric"
  "sys99_long09" "numeric"
  "sys99_long10" "numeric"
  "sys99_long11" "numeric"
  "sys99_long12" "numeric"
  "sys99_long13" "numeric"
  "sys99_long14" "numeric"
  "sys99_long15" "numeric"
  "sys99_long16" "numeric"
  "sys99_long17" "numeric"
  "sys99_long18" "numeric"
  "sys99_long19" "numeric"
  "sys99_long20" "numeric"
  "sys99_long21" "numeric"
  "sys99_long22" "numeric"
  "sys99_long23" "numeric"
  "sys99_long24" "numeric"
  "sys99_long25" "numeric"
  "sys99_long26" "numeric"
  "sys99_long27" "numeric"
  "sys99_long28" "numeric"
  "sys99_long29" "numeric"
  "sys99_long30" "numeric"
  "sys99_long31" "numeric"
  "sys99_long32" "numeric"
  "sys99_long33" "numeric"
  "sys99_long34" "numeric"
  "sys99_long35" "numeric"
  "sys99_long36" "numeric"
  "sys99_long37" "numeric"
  "sys99_long38" "numeric"
  "sys99_long39" "numeric"
  "sys99_long40" "numeric"
  "sys99_long41" "numeric"
  "sys99_long42" "numeric"
  "sys99_long43" "numeric"
  "sys99_long44" "numeric"
  "sys99_long45" "numeric"
  "sys99_long46" "numeric"
  "sys99_long47" "numeric"
  "sys99_long48" "numeric"
  "sys99_long49" "numeric"
  "sys99_long50" "numeric"
  "sys99_double01" "numeric"
  "sys99_double02" "numeric"
  "sys99_double03" "numeric"
  "sys99_double04" "numeric"
  "sys99_double05" "numeric"
  "sys99_double06" "numeric"
  "sys99_double07" "numeric"
  "sys99_double08" "numeric"
  "sys99_double09" "numeric"
  "sys99_double10" "numeric"
  "sys99_double11" "numeric"
  "sys99_double12" "numeric"
  "sys99_double13" "numeric"
  "sys99_double14" "numeric"
  "sys99_double15" "numeric"
  "sys99_double16" "numeric"
  "sys99_double17" "numeric"
  "sys99_double18" "numeric"
  "sys99_double19" "numeric"
  "sys99_double20" "numeric"
  "sys99_double21" "numeric"
  "sys99_double22" "numeric"
  "sys99_double23" "numeric"
  "sys99_double24" "numeric"
  "sys99_double25" "numeric"
  "sys99_double26" "numeric"
  "sys99_double27" "numeric"
  "sys99_double28" "numeric"
  "sys99_double29" "numeric"
  "sys99_double30" "numeric"
  "sys99_date01" "date"
  "sys99_date02" "date"
  "sys99_date03" "date"
  "sys99_date04" "date"
  "sys99_date05" "date"
  "sys99_date06" "date"
  "sys99_date07" "date"
  "sys99_date08" "date"
  "sys99_date09" "date"
  "sys99_date10" "date"
  "sys99_text01" "text"
  "sys99_text02" "text"
  "sys99_text03" "text"
  "sys99_text04" "text"
  "sys99_text05" "text"
  "sys99_text06" "text"
  "sys99_text07" "text"
  "sys99_text08" "text"
  "sys99_text09" "text"
  "sys99_text10" "text"

  indexes {
    (sys99_group_id) [name: 'sys99_print_idx01']
  }

  Note: '임시출력용'
}

```
