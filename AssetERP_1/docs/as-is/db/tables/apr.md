# 테이블: apr

35개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `apr01_appr` | 전자결재상신내용 | 23 |
| `apr01_appr_temp` |  | 24 |
| `apr03_relate_fund` | 상신연관펀드맵핑 | 5 |
| `apr04_appr_step` | 결재단계정보 | 13 |
| `apr05_relate_doc` | 연관문서 | 4 |
| `apr06_appr_step_rule` | 전자결재 결재자 설정정보 | 10 |
| `apr07_alt_appr` | 대결자지정 | 10 |
| `apr08_appr_role` |  | 7 |
| `apr09_appr_agree` |  | 8 |
| `apr10_stamp` | 인장등록 | 14 |
| `apr11_advert_book` | 광고대장 | 8 |
| `apr12_relate_adv` | 상신 연관계좌 매핑 | 3 |
| `apr12_relate_bond` | 상신 연관채권 매핑 | 3 |
| `apr13_person_auth` | 문서공람 | 3 |
| `apr14_relate_ast` | 상신 연관종목 매핑 | 3 |
| `apr15_repr_corp` | 추가 대표명의 관리 | 9 |
| `apr15_stamp_cert` | 인감증명서(부수관리) - 사용X (apr17로 변경) | 12 |
| `apr16_relate_stamp_cert` | 연관문서 연결 - 사용X | 3 |
| `apr16_stamp_doc` | 법인서류 및 날인신청 관리 | 21 |
| `apr17_corp_doc` | 인감날인 및 법인서류 부수관리 - 사용X (apr16로 변경) | 15 |
| `apr18_relate_corp_doc` | 인감날인 및 법인서류 연결문서 - 사용X (apr16로 변경) | 3 |
| `apr19_relate_stamp` | 인감날인 상세 - 사용X (apr16로 변경) | 9 |
| `apr20_relate_ics` | 연관내부통제 | 10 |
| `apr21_relate_appr` | 상신 연관문서 매핑 | 3 |
| `apr22_relate_icr` | 연관내규 | 10 |
| `apr30_appr_step_group` | 결재선 지정그룹 | 4 |
| `apr31_appr_step_group_member` | 결재선 지정그룹멤버 | 6 |
| `apr40_download_history` |  | 5 |
| `apr41_open_history` |  | 6 |
| `apr42_comment` | 상신문서 댓글 | 7 |
| `apr50_bookmark` | 상신문서 북마크 | 5 |
| `apr90_disposal_list` | 폐기문서 신청 | 10 |
| `apr91_disposal_history` | 폐기문서 이력 | 6 |
| `apr92_appr_modi` |  | 15 |
| `apr99_appr_del` |  | 24 |

## DBML

```dbml
Table "public"."apr01_appr" {
  "apr01_appr_id" "numeric" [pk, note: '전자결재상신내용ID']
  "apr01_title" "character varying(400)" [not null, note: '상신 제목']
  "apr01_reg_date" "timestamp without time zone" [not null, default: `CURRENT_TIMESTAMP`, note: '등록일']
  "apr01_status_cd" "character varying(10)" [not null, note: '상태코드(AprStatusCode)']
  "apr01_content" "text" [note: '상신내용']
  "apr01_note" "character varying(400)" [note: '비고']
  "apr01_reg_emp_id" "numeric" [not null, note: '등록자 ID']
  "apr01_effect_date" "timestamp without time zone" [note: '시행일']
  "apr01_class_tree_id" "numeric" [note: '상신문서분류ID']
  "apr01_stamp_id" "numeric" [note: '인장ID']
  "apr01_receive_nm" "character varying(400)" [note: '수신인명']
  "apr01_reference_nm" "character varying(400)" [note: '참조인명']
  "apr01_stamp_seq" "character varying(50)" [note: '인장순번']
  "apr01_inout_cd" "character varying(10)" [note: '문서구분(대외문서/사내문서)']
  "apr01_put_seal_emp_id" "numeric" [note: '인감입력사원번호']
  "apr01_put_seal_dt" "timestamp without time zone" [note: '인감입력일']
  "apr01_company_id" "numeric" [not null, note: '회사ID']
  "apr01_form_type" "character varying(1)" [note: '양식구분(0:기본양식/1:증명서양식)']
  "apr01_dcr_id_word" "character varying(10)" [note: '문서번호식별단어']
  "apr01_stamp_position" "character varying(1)" [note: '인감위치(StampLocation)']
  "apr01_sign_company" "character varying(50)" [note: '대표회사']
  "apr01_sign_ceo" "character varying(50)" [note: '대표서명']
  "apr01_link_cd" "character varying(3)" [note: 'LinkCode']

  indexes {
    (apr01_company_id, apr01_reg_date) [name: 'apr01_appr_idx01']
    (apr01_class_tree_id) [name: 'apr01_appr_idx02']
  }

  Note: '전자결재상신내용'
}

Table "public"."apr01_appr_temp" {
  "apr01_appr_id" "numeric" [pk]
  "apr01_title" "character varying(400)" [not null]
  "apr01_reg_date" "timestamp without time zone" [not null]
  "apr01_status_cd" "character varying(10)" [not null]
  "apr01_content" "text"
  "apr01_note" "character varying(400)"
  "apr01_reg_emp_id" "numeric" [not null]
  "apr01_effect_date" "timestamp without time zone"
  "apr01_class_tree_id" "numeric"
  "apr01_stamp_id" "numeric"
  "apr01_receive_nm" "character varying(400)"
  "apr01_reference_nm" "character varying(400)"
  "apr01_stamp_seq" "character varying(50)"
  "apr01_inout_cd" "character varying(10)"
  "apr01_put_seal_emp_id" "numeric"
  "apr01_put_seal_dt" "timestamp without time zone"
  "apr01_company_id" "numeric" [not null, note: '회사ID']
  "apr01_form_type" "character varying(1)"
  "apr01_dcr_id_word" "character varying(10)" [note: '문서번호식별단어']
  "apr01_stamp_xy" "character varying(50)"
  "apr01_stamp_position" "character varying(1)" [note: '인감위치(StampLocation)']
  "apr01_sign_company" "character varying(50)" [note: '대표회사']
  "apr01_sign_ceo" "character varying(50)" [note: '대표서명']
  "apr01_link_cd" "character varying(3)" [note: 'LinkCode']
}

Table "public"."apr03_relate_fund" {
  "apr03_relate_fund_id" "numeric" [pk, note: '연관펀드ID']
  "apr03_appr_id" "numeric" [not null, note: '상신ID']
  "apr03_fund_id" "numeric" [not null, note: '펀드ID']
  "apr03_print_yn" "character varying(10)" [note: '대외문서 출력여부']
  "apr03_after_yn" "character varying(5)" [note: '결재후등록여부']

  indexes {
    ("apr03_appr_id", "apr03_fund_id") [unique, name: 'apr03_relate_fund_apr03_appr_id_apr03_fund_id_key']
    (apr03_appr_id) [name: 'apr03_relate_fund_idx01']
  }

  Note: '상신연관펀드맵핑'
}

Table "public"."apr04_appr_step" {
  "apr04_appr_step_id" "numeric" [pk, note: 'PK ID']
  "apr04_appr_id" "numeric" [not null, note: '상신내용 ID']
  "apr04_step_type_cd" "character varying(10)" [not null, note: '결재단계코드(AprStepTypeCode)']
  "apr04_seq" "character varying(10)" [note: '결재단계순서']
  "apr04_step_status_cd" "character varying(10)" [note: '결재상태(AprStepStatusCode)']
  "apr04_appr_date" "timestamp without time zone" [note: '승인/반려일']
  "apr04_note" "character varying(2000)" [note: '비고']
  "apr04_reject_reason" "character varying(400)" [note: '반려사유']
  "apr04_step_emp_id" "numeric" [not null, note: '원 결재자 EMP ID']
  "apr04_appr_emp_id" "numeric" [note: '실제 결재자 EMP ID']
  "apr04_lock_yn" "character varying(5)" [note: '결재선 잠금여부(Default: true)']
  "apr04_add_emp_id" "numeric" [note: '결재선추가한 사원ID']
  "apr04_sign_id" "numeric"

  indexes {
    ("apr04_appr_step_id", "apr04_appr_id", "apr04_step_emp_id") [unique, name: 'apr04_appr_step_apr04_appr_step_id_apr04_appr_id_apr04_step_key']
    (apr04_appr_id) [name: 'apr04_appr_step_idx01']
  }

  Note: '결재단계정보'
}

Table "public"."apr05_relate_doc" {
  "apr05_relate_doc_id" "numeric" [pk, note: '연관문서ID']
  "apr05_appr_id" "numeric" [not null, note: '상신ID']
  "apr05_file_id" "numeric" [not null, note: '문서ID']
  "apr05_gubun" "character varying(20)" [note: '구분']

  indexes {
    ("apr05_appr_id", "apr05_file_id") [unique, name: 'apr05_relate_doc_apr05_appr_id_apr05_file_id_key']
    (apr05_appr_id) [name: 'apr05_relate_doc_idx01']
  }

  Note: '연관문서'
}

Table "public"."apr06_appr_step_rule" {
  "apr06_appr_step_rule_id" "numeric" [pk, note: '상신단계ID']
  "apr06_company_id" "numeric" [not null, note: '회사ID']
  "apr06_appr_step_rule_cd" "character varying(10)" [not null, note: '상신단계코드']
  "apr06_appr_step_rule_nm" "character varying(40)" [not null, note: '상신단계명']
  "apr06_appr_line01" "character varying(20)" [note: '상신내용1']
  "apr06_appr_line02" "character varying(20)" [note: '상신내용2']
  "apr06_appr_line03" "character varying(20)" [note: '상신내용3']
  "apr06_appr_line04" "character varying(20)" [note: '상신내용4']
  "apr06_appr_line05" "character varying(20)" [note: '상신내용5']
  "apr06_appr_seq" "character varying(10)" [not null, note: '순번']

  indexes {
    ("apr06_company_id", "apr06_appr_step_rule_cd") [unique, name: 'apr06_appr_step_rule_apr06_company_id_apr06_appr_step_rule__key']
    (apr06_company_id) [name: 'apr06_appr_step_rule_idx01']
  }

  Note: '전자결재 결재자 설정정보'
}

Table "public"."apr07_alt_appr" {
  "apr07_alt_appr_id" "numeric" [pk, note: 'KEYID']
  "apr07_target_emp_id" "numeric" [note: '원결재자 EMP ID']
  "apr07_start_date" "timestamp without time zone" [not null, note: '대결시작일']
  "apr07_close_date" "timestamp without time zone" [not null, note: '대결종료일']
  "apr07_alt_emp_id" "numeric" [not null, note: '대결재자 EMP ID']
  "apr07_reason_cd" "character varying(400)" [not null, note: '대결사유']
  "apr07_emgr_point" "character varying(400)" [note: '비상연락처']
  "apr07_note" "character varying(400)" [note: '비고']
  "apr07_stamp_yn" "character varying(5)" [note: '인감대결자지정']
  "apr07_leave_id" "numeric" [note: '휴가신청ID']

  indexes {
    ("apr07_target_emp_id", "apr07_start_date", "apr07_alt_emp_id") [unique, name: 'apr07_alt_appr_apr07_target_emp_id_apr07_start_date_apr07_a_key']
    (apr07_target_emp_id) [name: 'apr07_alt_appr_idx01']
  }

  Note: '대결자지정'
}

Table "public"."apr08_appr_role" {
  "apr08_appr_role_id" "numeric" [pk, note: 'KEYID']
  "apr08_company_id" "numeric" [not null, note: '회사 ID']
  "apr08_title_cd" "character varying(10)" [not null, note: '직책코드']
  "apr08_seq" "character varying(10)" [not null, note: '우선순위']
  "apr08_appr_step" "character varying(10)" [not null, note: '결재등급코드']
  "apr08_use_yn" "character varying(10)" [not null, note: '사용여부']
  "apr08_note" "character varying(400)" [note: '비고']

  indexes {
    ("apr08_company_id", "apr08_title_cd") [unique, name: 'apr08_appr_role_apr08_company_id_apr08_title_cd_key']
  }
}

Table "public"."apr09_appr_agree" {
  "apr09_appr_agree_id" "numeric" [pk]
  "apr09_company_id" "numeric" [not null]
  "apr09_title_cd" "character varying(10)" [not null]
  "apr09_person_id" "numeric" [not null]
  "apr09_org_code_id" "numeric" [not null]
  "apr09_appr_step" "character varying(10)" [not null]
  "apr09_use_yn" "character varying(10)" [not null]
  "apr09_note" "character varying(400)"

  indexes {
    ("apr09_company_id", "apr09_title_cd", "apr09_org_code_id") [unique, name: 'apr09_appr_agree_apr09_company_id_apr09_title_cd_apr09_org__key']
  }
}

Table "public"."apr10_stamp" {
  "apr10_stamp_id" "numeric" [pk, note: '인장ID']
  "apr10_org_id" "numeric" [not null, note: '조직ID']
  "apr10_stamp_nm" "character varying(200)" [not null, note: '인장명']
  "apr10_start_date" "timestamp without time zone" [not null, note: '사용시작일']
  "apr10_close_date" "timestamp without time zone" [note: '사용종료일']
  "apr10_use_nm" "character varying(400)" [note: '사용자명']
  "apr10_note" "character varying(400)" [note: '비고']
  "apr10_company_id" "numeric" [not null, default: `1000001`, note: '회사ID']
  "apr10_emp_id" "numeric" [note: 'APR10_EMP_ID']
  "apr10_corporation_yn" "character varying(5)" [note: '법인인감 여부(사용X)']
  "apr10_all_use_yn" "character varying(5)" [note: '전체사용여부']
  "apr10_second_emp_id" "numeric" [note: '(부)책임자']
  "apr10_step_use_yn" "character varying(5)" [note: '인감합의여부(true:결재선에 인감책임자 추가)']
  "apr10_corp_stamp_yn" "character varying(5)" [note: '법인인감여부']

  indexes {
    (apr10_company_id) [name: 'apr10_stamp_idx01']
  }

  Note: '인장등록'
}

Table "public"."apr11_advert_book" {
  "apr11_advert_book_id" "numeric" [pk, note: '광고대장ID']
  "apr11_advert_seq" "character varying(40)" [not null, note: '광고대장순번']
  "apr11_advert_type_nm" "character varying(100)" [note: '광고종류']
  "apr11_media_nm" "character varying(100)" [note: '매체종류']
  "apr11_cnt" "numeric" [note: '수량']
  "apr11_note" "character varying(400)" [note: '비고']
  "apr11_appr_id" "numeric" [not null, note: '결재문서ID']
  "apr11_company_id" "numeric" [not null, note: '회사ID']

  indexes {
    ("apr11_company_id", "apr11_advert_seq") [unique, name: 'apr11_advert_book_apr11_company_id_apr11_advert_seq_key']
  }

  Note: '광고대장'
}

Table "public"."apr12_relate_adv" {
  "apr12_relate_adv_id" "numeric" [pk, note: '상신 연관계좌 매핑 ID']
  "apr12_appr_id" "numeric" [not null, note: '상신ID']
  "apr12_adv_id" "numeric" [not null, note: '일임계좌ID']

  Note: '상신 연관계좌 매핑'
}

Table "public"."apr12_relate_bond" {
  "apr12_relate_bond_id" "numeric" [pk, note: '연관채권ID']
  "apr12_appr_id" "numeric" [not null, note: '상신ID']
  "apr12_bond_id" "numeric" [not null, note: '채권ID']

  indexes {
    ("apr12_appr_id", "apr12_bond_id") [unique, name: 'apr12_relate_bond_apr12_appr_id_apr12_bond_id_key']
    (apr12_appr_id) [name: 'apr12_relate_bond_idx01']
  }

  Note: '상신 연관채권 매핑'
}

Table "public"."apr13_person_auth" {
  "apr13_person_auth_id" "numeric" [pk, note: '문서공람ID']
  "apr13_person_id" "numeric" [not null, note: '사원ID']
  "apr13_appr_id" "numeric" [not null, note: '문서ID']

  indexes {
    (apr13_appr_id) [name: 'apr13_person_auth_idx01']
  }

  Note: '문서공람'
}

Table "public"."apr14_relate_ast" {
  "apr14_relate_ast_id" "numeric" [pk, note: '연관종목 ID']
  "apr14_appr_id" "numeric" [not null, note: '상신ID']
  "apr14_ast_id" "numeric" [not null, note: '종목(자산)ID']

  indexes {
    (apr14_appr_id) [name: 'apr14_relate_ast_idx01']
  }

  Note: '상신 연관종목 매핑'
}

Table "public"."apr15_repr_corp" {
  "apr15_repr_corp_id" "numeric" [pk, note: '추가 대표명의 관리ID(PK)']
  "apr15_company_id" "numeric" [note: '회사ID']
  "apr15_corp_type" "character varying(2)" [note: '대표명의구분(ReprCorpType-10:PEF/20:리츠)']
  "apr15_corp_nm" "character varying(100)" [note: '대표회사']
  "apr15_repr_nm" "character varying(50)" [note: '대표자']
  "apr15_corp_reg_yn" "character varying(5)" [note: '법인등기여부']
  "apr15_stamp_id" "numeric" [note: '인감ID(apr10_stamp_id)']
  "apr15_use_yn" "character varying(5)" [note: '사용여부']
  "apr15_note" "text" [note: '비고']

  indexes {
    (apr15_company_id) [name: 'apr15_repr_corp_idx01']
  }

  Note: '추가 대표명의 관리'
}

Table "public"."apr15_stamp_cert" {
  "apr15_stamp_cert_id" "numeric" [pk, note: '인감증명서ID']
  "apr15_company_id" "numeric" [not null, note: '회사ID']
  "apr15_person_id" "numeric" [not null, note: '등록사원ID']
  "apr15_stamp_id" "numeric" [not null, note: '인장ID']
  "apr15_start_date" "timestamp without time zone" [not null, note: '발급(사용)일']
  "apr15_issue" "numeric" [note: '발급매수']
  "apr15_use" "numeric" [note: '사용매수']
  "apr15_note" "character varying(500)" [note: '비고']
  "apr15_stamp_cert_cd" "character varying(1)" [note: '부수관리구분 코드 (stampCertCode : "1/법인인감증명서, 2/법인등기부등본")']
  "apr15_provide_co" "character varying(200)" [note: '제공처']
  "apr15_purpose" "character varying(200)" [note: '목적']
  "apr15_requester" "character varying(100)" [note: '요청자']

  indexes {
    (apr15_company_id, apr15_start_date) [name: 'apr15_stamp_cert_idx01']
    (apr15_stamp_id) [name: 'apr15_stamp_cert_idx02']
  }

  Note: '인감증명서(부수관리) - 사용X (apr17로 변경)'
}

Table "public"."apr16_relate_stamp_cert" {
  "apr16_relate_stamp_cert_id" "numeric" [pk, note: '상신문서 연결ID(PK)']
  "apr16_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']
  "apr16_stamp_cert_id" "numeric" [note: '인감증명서ID(apr15_stamp_cert_id)']

  indexes {
    (apr16_stamp_cert_id) [name: 'apr16_relate_stamp_cert_idx01']
  }

  Note: '연관문서 연결 - 사용X'
}

Table "public"."apr16_stamp_doc" {
  "apr16_stamp_doc_id" "numeric" [pk, note: '법인서류 및 날인신청 관리ID(PK)']
  "apr16_company_id" "numeric" [note: '회사ID']
  "apr16_appl_date" "date" [note: '신청일자']
  "apr16_appl_emp_id" "numeric" [note: '신청사원ID']
  "apr16_appl_type" "character varying(1)" [note: '신청구분(CorpDocStampApplType-1:법인인감증명서, 2:법인등기부등본, 3:인감날인)']
  "apr16_stamp_id" "numeric" [note: '인감ID(apr10_stamp_id)']
  "apr16_repr_corp_id" "numeric" [note: '대표명의ID(apr15_repr_corp_id)']
  "apr16_doc_issue_qty" "numeric" [note: '발급매수']
  "apr16_doc_appl_qty" "numeric" [note: '신청매수']
  "apr16_doc_use_qty" "numeric" [note: '사용매수']
  "apr16_stamp_qty" "numeric" [note: '인감날인부수']
  "apr16_stamp_out_yn" "character varying(5)" [note: '인감반출여부']
  "apr16_provide_co" "text" [note: '제출처']
  "apr16_purpose" "text" [note: '목적(내용)']
  "apr16_requester" "text" [note: '요청자']
  "apr16_note" "text" [note: '비고']
  "apr16_reg_date" "date" [note: '등록일자']
  "apr16_stamp_date" "date" [note: '인감날인일자']
  "apr16_confirmer_id" "numeric" [note: '인감날인본 업로드여부 확인자ID']
  "apr16_confirm_date" "date" [note: '인감날인본 업로드여부 확인자일자']
  "apr16_appr_id" "numeric" [note: '연관상신ID']

  indexes {
    (apr16_company_id, apr16_appl_date, apr16_appl_emp_id, apr16_appl_type) [name: 'apr16_stamp_doc_idx01']
    (apr16_company_id, apr16_reg_date, apr16_appl_type) [name: 'apr16_stamp_doc_idx02']
    (apr16_appr_id) [name: 'apr16_stamp_doc_idx03']
  }

  Note: '법인서류 및 날인신청 관리'
}

Table "public"."apr17_corp_doc" {
  "apr17_corp_doc_id" "numeric" [pk, note: '인감날인 및 법인서류 부수관리ID(PK)']
  "apr17_company_id" "numeric" [not null, note: '회사ID']
  "apr17_call_date" "date" [note: '신청일자']
  "apr17_reg_date" "date" [note: '등록일자']
  "apr17_stamp_cert_issue_cnt" "numeric" [note: '법인인감증명서 발급매수']
  "apr17_stamp_cert_call_cnt" "numeric" [note: '법인인감증명서 신청매수']
  "apr17_stamp_cert_use_cnt" "numeric" [note: '법인인감증명서 사용매수']
  "apr17_corp_reg_issue_cnt" "numeric" [note: '법인등기부등본 발급매수']
  "apr17_corp_reg_call_cnt" "numeric" [note: '법인등기부등본 신청매수']
  "apr17_corp_reg_use_cnt" "numeric" [note: '법인등기부등본 사용매수']
  "apr17_provide_co" "character varying(200)" [note: '제출처']
  "apr17_purpose" "character varying(200)" [note: '목적(내용)']
  "apr17_requester" "character varying(100)" [note: '요청자']
  "apr17_call_emp_id" "numeric" [note: '신청사원ID']
  "apr17_note" "text" [note: '비고']

  indexes {
    (apr17_company_id) [name: 'apr17_corp_doc_idx01']
    (apr17_company_id, apr17_call_date) [name: 'apr17_corp_doc_idx02']
  }

  Note: '인감날인 및 법인서류 부수관리 - 사용X (apr16로 변경)'
}

Table "public"."apr18_relate_corp_doc" {
  "apr18_relate_corp_doc_id" "numeric" [pk, note: '인감날인 및 법인서류 연결문서ID(PK)']
  "apr18_corp_doc_id" "numeric" [note: '인감날인 및 법인서류 부수관리ID(apr17_corp_doc_id)']
  "apr18_appr_id" "numeric" [note: '상신문서ID(apr01_appr_id)']

  Note: '인감날인 및 법인서류 연결문서 - 사용X (apr16로 변경)'
}

Table "public"."apr19_relate_stamp" {
  "apr19_relate_stamp_id" "numeric" [pk, note: '인감날인 상세ID(PK)']
  "apr19_corp_doc_id" "numeric" [note: '인감날인 및 법인서류 부수관리ID(apr17_corp_doc_id)']
  "apr19_stamp_id" "numeric" [note: '인감ID']
  "apr19_stamp_cnt" "numeric" [note: '인감날인부수']
  "apr19_appr_id" "numeric" [note: '상신문서ID(apr01_appr_id) - 신청화면에서 들어온 경우 상신ID 없음']
  "apr19_stamp_date" "date" [note: '날인일자']
  "apr19_confirmer_id" "numeric" [note: '인감날인본 업로드여부 확인자ID']
  "apr19_confirm_date" "date" [note: '인감날인본 업로드여부 확인일자']
  "apr19_out_yn" "character varying(5)" [note: '반출여부']

  Note: '인감날인 상세 - 사용X (apr16로 변경)'
}

Table "public"."apr20_relate_ics" {
  "apr20_relate_ics_id" "numeric" [pk, note: '연관내부통제ID']
  "apr20_appr_id" "numeric" [note: '상신문서ID']
  "apr20_class_tree_id" "numeric" [note: '내부통제 분류ID']
  "apr20_stand_cd" "character varying(5)" [note: '기준코드(10:결재일/20:지정일)']
  "apr20_stand_date" "date" [note: '지정일']
  "apr20_close_date" "date" [note: '마감일']
  "apr20_note" "character varying(200)" [note: '비고']
  "apr20_deadline_id" "numeric" [note: '기일관리ID']
  "apr20_stand_yn" "character varying(10)" [note: '지정일 자동계산 확인']
  "apr20_org_appr_id" "numeric" [note: '원상신문서ID']

  indexes {
    (apr20_appr_id) [name: 'apr20_relate_ics_idx01']
  }

  Note: '연관내부통제'
}

Table "public"."apr21_relate_appr" {
  "apr21_relate_appr_id" "numeric" [pk, note: '연관문서 ID(PK)']
  "apr21_appr_id" "numeric" [not null, note: '상신ID']
  "apr21_targer_appr_id" "numeric" [not null, note: '상신ID(대상)']

  Note: '상신 연관문서 매핑'
}

Table "public"."apr22_relate_icr" {
  "apr22_relate_icr_id" "numeric" [pk, note: '연관내규ID(PK)']
  "apr22_appr_id" "numeric" [note: '상신문서ID(apr01_appr_id)']
  "apr22_class_tree_id" "numeric" [note: '내규ID(icr01_class_tree_id)']
  "apr22_stand_cd" "character varying(2)" [note: '기준코드(10:결재완료일/20:발생일지정)']
  "apr22_stand_date" "date" [note: '기준일자']
  "apr22_close_date" "date" [note: '마감일자']
  "apr22_note" "character varying(200)" [note: '비고']
  "apr22_stand_yn" "character varying(5)" [note: '마감일 자동계산 여부']
  "apr22_deadline_id" "numeric" [note: '기일관리ID(sch03_deadline_id)']
  "apr22_org_appr_id" "numeric" [note: '원상신문서ID(apr01_appr_id)']

  Note: '연관내규'
}

Table "public"."apr30_appr_step_group" {
  "apr30_appr_step_group_id" "numeric" [pk, note: '결재선 지정그룹ID(PK)']
  "apr30_company_id" "numeric" [not null, note: '회사ID']
  "apr30_appr_step_group_nm" "character varying(20)" [note: '결재선 지정그룹명']
  "apr30_note" "character varying(200)" [note: '비고']

  Note: '결재선 지정그룹'
}

Table "public"."apr31_appr_step_group_member" {
  "apr31_appr_step_group_member_id" "numeric" [pk, note: '결재선 지정그룹멤버ID(PK)']
  "apr31_appr_step_group_id" "numeric" [not null, note: '결재선 지정그룹ID']
  "apr31_step_type_cd" "character varying(10)" [note: '결재단계코드(AprStepTypeCode)']
  "apr31_seq" "character varying(10)" [note: '결재단계순서']
  "apr31_note" "character varying(2000)" [note: '비고']
  "apr31_step_emp_id" "numeric" [not null, note: '원 결재자 EMP ID']

  Note: '결재선 지정그룹멤버'
}

Table "public"."apr40_download_history" {
  "apr40_download_history_id" "numeric" [pk, note: '문서 다운로드 신청 ID']
  "apr40_company_id" "numeric" [not null, note: '회사 ID']
  "apr40_person_id" "numeric" [not null, note: '사원 ID']
  "apr40_appr_id" "numeric" [note: '문서 ID']
  "apr40_reg_date" "timestamp without time zone" [note: '다운로드일자']
}

Table "public"."apr41_open_history" {
  "apr41_open_history_id" "numeric" [pk, note: '문서 열람기록 ID']
  "apr41_company_id" "numeric" [not null, note: '회사 ID']
  "apr41_person_id" "numeric" [not null, note: '사원 ID']
  "apr41_appr_id" "numeric" [not null, note: '문서 ID']
  "apr41_open_date" "timestamp without time zone" [not null, note: '열람일자']
  "apr41_login_mode" "character varying(1)" [not null, note: '로그인모드(P:데스크탑/M:모바일)']
}

Table "public"."apr42_comment" {
  "apr42_comment_id" "numeric" [pk, note: '상신문서 댓글ID(PK)']
  "apr42_company_id" "numeric" [not null, note: '회사ID']
  "apr42_person_id" "numeric" [not null, note: '사원ID']
  "apr42_appr_id" "numeric" [not null, note: '문서ID']
  "apr42_date" "timestamp without time zone" [not null, note: '등록일']
  "apr42_time" "character varying(8)" [not null, note: '등록시간']
  "apr42_comment" "text" [not null, note: '내용']

  Note: '상신문서 댓글'
}

Table "public"."apr50_bookmark" {
  "apr50_bookmark_id" "numeric" [pk, note: '상신문서 북마크ID']
  "apr50_company_id" "numeric" [not null, note: '회사ID']
  "apr50_person_id" "numeric" [note: '사원ID']
  "apr50_appr_id" "numeric" [not null, note: '상신문서ID']
  "apr50_public_yn" "character varying(5)" [note: '전체공유여부']

  Note: '상신문서 북마크'
}

Table "public"."apr90_disposal_list" {
  "apr90_disposal_list_id" "numeric" [pk, note: '폐기문서 신청 ID(PK)']
  "apr90_company_id" "numeric" [not null, note: '회사ID']
  "apr90_reg_emp_id" "numeric" [not null, note: '신청사원ID']
  "apr90_reg_date" "timestamp without time zone" [not null, note: '신청일']
  "apr90_reason" "character varying(500)" [note: '사유']
  "apr90_confirm_emp_id" "numeric" [note: '승인자ID']
  "apr90_confirm_date" "timestamp without time zone" [note: '승인일']
  "apr90_confirm_yn" "character varying(5)" [note: '승인여부']
  "apr90_appr_id" "numeric" [note: '문서ID']
  "apr90_disposal_cd" "character varying(5)" [note: '폐기구분(DisposalCode)']

  Note: '폐기문서 신청'
}

Table "public"."apr91_disposal_history" {
  "apr91_disposal_history_id" "numeric" [pk, note: '폐기문서 이력 ID(PK)']
  "apr91_company_id" "numeric" [not null, note: '회사ID']
  "apr91_reg_emp_id" "numeric" [not null, note: '사원ID']
  "apr91_reg_date" "timestamp without time zone" [not null, note: '처리일자']
  "apr91_appr_id" "numeric" [not null, note: '문서ID']
  "apr91_disposal_cd" "character varying(5)" [not null, note: '폐기구분(DisposalCode)']

  Note: '폐기문서 이력'
}

Table "public"."apr92_appr_modi" {
  "apr92_appr_modi_id" "numeric" [pk]
  "apr92_appr_id" "numeric" [not null]
  "apr92_company_id" "numeric" [not null]
  "apr92_reg_date" "timestamp without time zone" [not null]
  "apr92_reg_emp_id" "numeric" [not null]
  "apr92_title" "character varying(400)"
  "apr92_content" "text"
  "apr92_receive_nm" "character varying(400)"
  "apr92_reference_nm" "character varying(400)"
  "apr92_note" "character varying(400)"
  "apr92_reason" "text"
  "apr92_sign_company" "character varying(50)" [note: '대표회사']
  "apr92_sign_ceo" "character varying(50)" [note: '대표서명']
  "apr92_stamp_position" "character varying(3)" [note: '인감위치']
  "apr92_link_cd" "character varying(3)" [note: 'LinkCode']
}

Table "public"."apr99_appr_del" {
  "apr99_appr_del_id" "numeric" [pk]
  "apr99_appr_id" "numeric" [not null]
  "apr99_title" "character varying(400)" [not null]
  "apr99_reg_date" "timestamp without time zone" [not null, default: `CURRENT_TIMESTAMP`]
  "apr99_status_cd" "character varying(10)" [not null]
  "apr99_content" "text"
  "apr99_note" "character varying(400)"
  "apr99_reg_emp_id" "numeric" [not null]
  "apr99_effect_date" "timestamp without time zone"
  "apr99_class_tree_id" "numeric"
  "apr99_stamp_id" "numeric"
  "apr99_receive_nm" "character varying(400)"
  "apr99_reference_nm" "character varying(400)"
  "apr99_stamp_seq" "character varying(50)"
  "apr99_inout_cd" "character varying(10)"
  "apr99_del_date" "timestamp without time zone"
  "apr99_del_emp_id" "numeric"
  "apr99_company_id" "numeric"
  "apr99_form_type" "character varying(1)"
  "apr99_dcr_id_word" "character varying(10)" [note: '문서번호식별단어']
  "apr99_sign_company" "character varying(50)" [note: '대표회사']
  "apr99_sign_ceo" "character varying(50)" [note: '대표서명']
  "apr99_stamp_position" "character varying(1)" [note: '인감위치']
  "apr99_link_cd" "character varying(3)" [note: 'LinkCode']

  indexes {
    (apr99_company_id, apr99_reg_date) [name: 'apr99_appr_del_idx01']
  }
}

```
