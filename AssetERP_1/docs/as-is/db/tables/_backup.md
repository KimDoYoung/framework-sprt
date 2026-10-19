# 테이블: _backup

86개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `act90_journal_back` | 분개장(백업) | 20 |
| `act91_journal_dtl_back` | 분개장 상세(백업) | 16 |
| `act92_journal_tmp_back` | 분개장 임시(백업) | 14 |
| `ast90_tr_back` | 거래내역(백업) | 27 |
| `ast91_settle_back` | 결제내역(미수/미지급내역관리)(백업) | 16 |
| `bbsbak15_company_rule` | [백업]회사규정 | 20 |
| `biz95_cont_corp_back` | 계약사관리(백업) | 7 |
| `biz96_cont_history_back` | 계약사별 이력관리(백업) | 23 |
| `biz97_fee_info_back` | 보수정보(백업) | 14 |
| `biz98_with_corp_back` | 계약사 운영정보(백업) | 12 |
| `biz99_dual_manage_fund_back` | 이중사무관리 펀드(백업) | 14 |
| `crd05_slip_backup` | (사용안함) | 20 |
| `crd06_guest_backup` | (사용안함) | 6 |
| `crd10_slip_backup` | 법인카드내역(사용안함) | 27 |
| `empbak01_person` | [백업]개인정보 | 22 |
| `empbak02_others` | [백업]Others 개인정보 | 25 |
| `empbak03_trans` | [백업]발령정보 | 23 |
| `flt90_tr_back` | 임직원 금융상품 매매(백업) | 35 |
| `icam90_fee_back` | ICAM펀드보수 당일발생내역(백업) | 23 |
| `paybak34_work_time_config` | [백업]근로시간 기준관리 | 15 |
| `sys90_after_service_backup` | 개선 및 오류처리내역(백업) | 15 |
| `sysbak01_company` | [백업]회사정보 | 65 |
| `tdm_bak01_emp` | 인사정보(직원정보) | 10 |
| `tdm_bak02_dept` | 인사정보(부서정보) | 12 |
| `tdm_bak03_role` | 직책정보 (직책마스터) | 11 |
| `tdm_bak04_task` | 책무정보 (책무마스터) | 11 |
| `tdm_bak05_cncl` | 회의체정보 (회의체마스터) | 10 |
| `tdm_bak06_rule` | 내규정보 (내규 마스터) | 9 |
| `tdm_bak11_task_def` | 책무 정의서  | 10 |
| `tdm_bak12_role_task` | 직책별 책무 정의서  | 8 |
| `tdm_bak13_role_cncl` | 직책별 위원회  | 9 |
| `tdm_bak14_cncl_record` | 이사회 의결기록  | 7 |
| `tdm_bak15_rule_def` | 내규 이력 (내규 개정이력) | 8 |
| `tdm_bak21_allc` | 책무배분 (직책별 담당임원등록)  | 12 |
| `tdm_bak22_desc` | 책무기술서 Master  | 12 |
| `tdm_bak40_manl_job` | 업무매뉴얼작업 Master  | 10 |
| `tdm_bak41_manl_duty` |  | 19 |
| `tdm_bak42_manl` |  | 19 |
| `tdm_bak43_manl_status` |  | 11 |
| `tdmbak01_hr` | [백업]인사(임원)정보 | 19 |
| `tdmbak02_hr_record` | [백업]인사변동사항 반영정보 | 16 |
| `tdmbak05_cncl` | [백업]위원회(회의체) 정보 | 14 |
| `tdmbak06_cncl_record` | [백업]이사회 의결기록 | 11 |
| `tdmbak07_rule` | [백업]내규관리 | 11 |
| `tdmbak08_manager_info` | [백업]책무관리자 | 13 |
| `tdmbak09_appr_step` | [백업]책무승인단계 | 14 |
| `tdmbak10_task` | [백업]책무정보 | 15 |
| `tdmbak11_task_relate_rule` | [백업]책무연결정보-규정(법규/내규) | 12 |
| `tdmbak12_task_relate_detail` | [백업]책무연결정보-세부내용 | 11 |
| `tdmbak13_task_relate_duty` | [백업]책무연결정보-관리의무 | 12 |
| `tdmbak14_task_type` | [백업]책무유형정의 | 12 |
| `tdmbak20_role` | [백업]직책정보 | 15 |
| `tdmbak21_role_relate_task` | [백업]직책연결정보-책무 | 7 |
| `tdmbak22_role_relate_cncl` | [백업]직책연결정보-위원회 | 10 |
| `tdmbak23_role_relate_org` | [백업]직책연결정보-담당부서 | 7 |
| `tdmbak30_role_allc` | [백업]직책(책무)배분 | 13 |
| `tdmbak31_role_desc` | [백업]임원별 직책(책무)기술서 | 16 |
| `tdmbak32_role_digm` | [백업]책무체계도 | 13 |
| `tdmbak33_role_digm_file` | [백업]책무체계도_파일정보 | 7 |
| `tdmbak34_role_allc_detail` | [백업]직책(책무)배분-상세정보 | 12 |
| `tdmbak35_role_allc_task` | [백업]직책(책무)배분-확정책무 | 16 |
| `tdmbak36_role_report` | [백업]책무구조도 제출 | 22 |
| `tdmbak40_manl_job` | [백업]책무매뉴얼 작업 | 17 |
| `tdmbak41_manl_duty` | [백업]책무매뉴얼 작업_관리의무 | 13 |
| `tdmbak42_manl_org` | [백업]부서 책무매뉴얼 | 16 |
| `tdmbak43_manl` | [백업]책무매뉴얼 점검항목 | 35 |
| `tdmbak44_manl_duty_org` | [백업]책무매뉴얼 작업_부서지정 | 12 |
| `tdmbak45_manl_relate_ics` | [백업]책무매뉴얼 점검항목 연결법규 | 7 |
| `tdmbak46_manl_relate_icr` | [백업]책무매뉴얼 점검항목 연결내규 | 7 |
| `tdmbak47_manl_relate_dcr` | [백업]책무매뉴얼 점검항목 연결문서분류 | 7 |
| `tdmbak50_chck_job` | [백업]이행점검 작업 | 13 |
| `tdmbak51_chck_org` | [백업]이행점검_부서점검현황 | 14 |
| `tdmbak52_chck_manl` | [백업]이행점검 | 15 |
| `tdmbak53_chck_exct` | [백업]이행점검_임원승인현황 | 14 |
| `tdmbak54_chck_insuff` | [백업]미흡/개선 내역 | 21 |
| `tdmbak55_chck_record` | [백업]이행점검 기록 | 14 |
| `tdmbak56_chck_relate_appr` | [백업]이행점검 연결 상신문서(임원책무 이행점검 보고) | 9 |
| `tdmbak57_chck_ceo_report` | [백업]대표이사 총괄관리의무 이행점검 보고 | 12 |
| `tdmbak58_chck_appr_step` | [백업]이행점검_부서승인단계설정 | 10 |
| `tdmbak59_chck_appr_cmnt` | [백업]이행점검_종합의견 | 16 |
| `tdmbak60_chck_manl_appr` | [백업]이행점검_승인 | 12 |
| `tdmbak61_chck_insuff_appr` | [백업]미흡/개선 내역 승인 | 14 |
| `tdmbak62_chck_cmnt_relate_org` | [백업]이행점검_종합의견 연결 부서점검현황 | 7 |
| `tdmbak63_chck_insuff_record` | [백업]미흡/개선 조치기록 | 12 |
| `tdmbak64_chck_evid_extr` | [백업]이행점검_증빙자료(외부시스템 문서정보) | 14 |
| `tdmbak91_company_setup` | [백업]책무사용 기본설정 | 14 |

## DBML

```dbml
Table "public"."act90_journal_back" {
  "act90_journal_back_id" "numeric" [pk, note: '분개장(백업) ID(PK)']
  "act90_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "act90_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "act90_journal_id" "numeric" [note: '분개장ID(PK)']
  "act90_company_id" "numeric" [note: '회사ID']
  "act90_person_id" "numeric" [note: '등록사원ID']
  "act90_date" "date" [note: '분개일자']
  "act90_note" "character varying(500)" [note: '비고']
  "act90_close_yn" "character varying(5)" [note: '결산여부']
  "act90_corp_id" "numeric" [note: '거래처ID']
  "act90_tr_id" "numeric" [note: '거래ID(ast06_tr_id, ast07_settle_id)']
  "act90_biz_id" "numeric" [note: '이익제공ID(biz01_promo_id)']
  "act90_bmt_id" "numeric" [note: '물품구매내역ID(bmt01_buy_id)']
  "act90_pay_month_cd" "character varying(2)" [note: '월급여지급구분(PayMonthCode)']
  "act90_cur_cd" "character varying(3)" [note: '통화코드']
  "act90_journal_no" "numeric" [note: '분개장번호(전표번호)']
  "act90_retire_id" "numeric" [note: '퇴직정산서ID(pay07_retire_id)']
  "act90_fix_yn" "character varying(5)" [note: '분개확정여부']
  "act90_fix_person_nm" "character varying(50)" [note: '분개확정자명']
  "act90_fix_date" "timestamp without time zone" [note: '분개확정일시']

  Note: '분개장(백업)'
}

Table "public"."act91_journal_dtl_back" {
  "act91_journal_dtl_back_id" "numeric" [pk, note: '분개장 상세(백업) ID(PK)']
  "act91_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "act91_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "act91_journal_dtl_id" "numeric" [note: '분개장 상세ID(PK)']
  "act91_journal_id" "numeric" [note: '분개장ID']
  "act91_seq" "numeric" [note: '순번']
  "act91_dr_account_cd" "character varying(20)" [note: '차변 계정코드']
  "act91_dr_amt" "numeric" [note: '차변 금액']
  "act91_cr_account_cd" "character varying(20)" [note: '대변 계정코드']
  "act91_cr_amt" "numeric" [note: '대변 금액']
  "act91_dr_ast_id" "numeric" [note: '차변 자산ID(관리계좌)']
  "act91_cr_ast_id" "numeric" [note: '대변 자산ID(관리계좌)']
  "act91_dr_note" "character varying(100)" [note: '차변 비고']
  "act91_cr_note" "character varying(100)" [note: '대변 비고']
  "act91_dr_for_amt" "numeric" [note: '차변 외화금액']
  "act91_cr_for_amt" "numeric" [note: '대변 외화금액']

  Note: '분개장 상세(백업)'
}

Table "public"."act92_journal_tmp_back" {
  "act92_journal_tmp_back_id" "numeric" [pk, note: '분개장 임시(백업) ID(PK)']
  "act92_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "act92_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "act92_journal_tmp_id" "numeric" [note: '임시분개장ID(PK)']
  "act92_journal_id" "numeric" [note: '분개장ID']
  "act92_seq" "numeric" [note: '순번']
  "act92_repr_account_cd" "character varying(4)" [note: '대표계정코드']
  "act92_real_account_cd" "character varying(20)" [note: '실계정코드']
  "act92_drcr_type" "character varying(1)" [note: '차대구분']
  "act92_amt" "numeric" [note: '금액']
  "act92_deposit_id" "numeric" [note: '예금관리계정ID(ast01_class_tree_id)']
  "act92_note" "character varying(200)" [note: '비고']
  "act92_account_map" "character varying(10)" [note: '계정맵핑ID(act13_account_map)']
  "act92_for_amt" "numeric" [note: '외화금액']

  Note: '분개장 임시(백업)'
}

Table "public"."ast90_tr_back" {
  "ast90_tr_back_id" "numeric" [pk, note: '임직원 금융상품 매매(백업)ID(PK)']
  "ast90_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "ast90_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "ast90_tr_id" "numeric" [note: '거래내역ID']
  "ast90_ast_class_tree_id" "numeric" [note: '자산분류ID (AST01_CLASS_TREE_ID)']
  "ast90_date" "date" [note: '거래일자']
  "ast90_tr_cd" "character varying(4)" [note: '거래코드(ast05_tr_cd)']
  "ast90_amt" "numeric" [note: '거래금액(실결제금액)']
  "ast90_settle_mng_yn" "character varying(5)" [note: '결제내역(미수/미지급)관리여부 (TRUE / FALSE (DEFAULT FALSE))']
  "ast90_note" "character varying(200)" [note: '비고']
  "ast90_person_id" "numeric" [note: '등록자ID']
  "ast90_company_id" "numeric" [note: '회사ID']
  "ast90_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "ast90_tax" "numeric" [note: '세금']
  "ast90_deposit_id" "numeric" [note: '예금관리계좌ID(ast01_class_tree_id)']
  "ast90_cur_cd" "character varying(3)" [note: '통화코드']
  "ast90_for_amt" "numeric" [note: '외화거래금액']
  "ast90_fx_rate" "numeric" [note: '적용환율']
  "ast90_cont_amt" "numeric" [note: '약정(계약)금액']
  "ast90_for_cont_amt" "numeric" [note: '외화 약정(계약)금액']
  "ast90_fee" "numeric" [note: '수수료']
  "ast90_book_amt" "numeric" [note: '장부금액']
  "ast90_pur_tr_id" "numeric" [note: '취득거래ID(ast06_tr_id)']
  "ast90_card_approval_no" "character varying(10)" [note: '법인카드 승인번호(crd02_approval_no)']
  "ast90_org_tr_id" "numeric" [note: '원 거래ID(ast06_tr_id)']
  "ast90_expense_id" "numeric" [note: '지출결의서ID(pay50_expense_id)']
  "ast90_appr_id" "numeric" [note: '상신ID']

  Note: '거래내역(백업)'
}

Table "public"."ast91_settle_back" {
  "ast91_settle_back_id" "numeric" [pk, note: '임직원 금융상품 매매(백업)ID(PK)']
  "ast91_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "ast91_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "ast91_settle_id" "numeric" [note: '결제내역ID']
  "ast91_tr_id" "numeric" [note: '거래내역ID (AST06_TR_ID)']
  "ast91_settle_date" "date" [note: '결제일자 (실수령/지급일자)']
  "ast91_settle_amt" "numeric" [note: '결제금액 (실수령/지급액)']
  "ast91_note" "character varying(200)" [note: '비고']
  "ast91_deposit_id" "numeric" [note: '예금관리계좌ID(ast01_class_tree_id)']
  "ast91_tr_cd" "character varying(4)" [note: '거래코드(ast05_tr_cd)']
  "ast91_person_id" "numeric" [note: '등록자ID']
  "ast91_for_settle_amt" "numeric" [note: '외화결제금액']
  "ast91_fx_rate" "numeric" [note: '적용환율']
  "ast91_amt" "numeric" [note: '미수/미지급 발생시점 환율의 원화금액']
  "ast91_for_amt" "numeric" [note: '외화 미수/미지급금']
  "ast91_expense_id" "numeric" [note: '지출결의서ID(pay50_expense_id)']

  Note: '결제내역(미수/미지급내역관리)(백업)'
}

Table "public"."bbsbak15_company_rule" {
  "bbsbak15_id" "numeric" [pk, note: '[백업]회사규정ID(PK)']
  "bbsbak15_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "bbsbak15_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "bbsbak15_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "bbsbak15_company_rule_id" "numeric" [note: '회사규정ID(PK)']
  "bbsbak15_company_id" "numeric" [note: '회사ID']
  "bbsbak15_rule_type" "character varying(3)" [note: '회사규정구분(CompanyRuleType)']
  "bbsbak15_title" "character varying(200)" [note: '회사규정명']
  "bbsbak15_content" "text" [note: '내용']
  "bbsbak15_note" "text" [note: '비고']
  "bbsbak15_seq" "numeric" [note: '조회순서']
  "bbsbak15_work_date" "timestamp without time zone" [note: '등록(수정)일자(사용X)']
  "bbsbak15_revision_date" "date" [note: '제개정일']
  "bbsbak15_revision_no" "numeric" [note: '개정회차']
  "bbsbak15_public_yn" "character varying(5)" [note: '공개여부']
  "bbsbak15_company_rule_cd" "character varying(10)" [note: '회사규정코드']
  "bbsbak15_close_date" "date" [note: '종료일자']
  "bbsbak15_cre_nm" "character varying(50)" [note: '작성자']
  "bbsbak15_upd_nm" "character varying(50)" [note: '변경자']
  "bbsbak15_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]회사규정'
}

Table "public"."biz95_cont_corp_back" {
  "biz95_cont_corp_back_id" "numeric" [pk, note: '계약사관리(백업)ID(PK)']
  "biz95_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "biz95_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "biz95_dml_user_id" "character varying(50)" [note: '데이터조작 User ID(emp01_person_Id)']
  "biz95_dml_user_ip" "character varying(50)" [note: '데이터조작 User IP']
  "biz95_cont_corp_id" "numeric" [not null, note: '계약사관리ID(biz10_cont_corp_id)']
  "biz95_company_id" "numeric" [note: '회사ID']

  Note: '계약사관리(백업)'
}

Table "public"."biz96_cont_history_back" {
  "biz96_cont_history_back_id" "numeric" [pk, note: '계약사관리(백업)ID']
  "biz96_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "biz96_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "biz96_dml_user_id" "character varying(50)" [note: '데이터조작 User ID(emp01_person_Id)']
  "biz96_dml_user_ip" "character varying(50)" [note: '데이터조작 User IP']
  "biz96_cont_history_id" "numeric" [not null, note: '계약사별 이력관리ID(biz11_cont_history_id)']
  "biz96_cont_corp_id" "numeric" [note: '계약사관리ID(biz10_cont_corp_id)']
  "biz96_reg_date" "date" [note: '등록일자']
  "biz96_cont_corp_nm" "character varying(100)" [note: '계약사명']
  "biz96_cont_status_cd" "character varying(1)" [note: '계약상태(ContStatusCode)']
  "biz96_corp_status_cd" "character varying(2)" [note: '거래유무코드(고객상태)(ContCorpStatusCode)']
  "biz96_tr_type" "character varying(50)" [note: '거래형태']
  "biz96_cont_period_cd" "character varying(2)" [note: '계약기간코드(ContPeriodCode)']
  "biz96_cont_date" "date" [note: '(재)계약일자']
  "biz96_start_date" "date" [note: '거래개시일자']
  "biz96_close_date" "date" [note: '거래종료일자']
  "biz96_base_fee" "character varying(50)" [note: '기본보수(bp)']
  "biz96_manager" "character varying(100)" [note: '계약사 담당자명']
  "biz96_manager_tel" "character varying(100)" [note: '계약사 담당자연락처']
  "biz96_note" "character varying(500)" [note: '비고']
  "biz96_person_id" "numeric" [note: '담당자ID']
  "biz96_address" "character varying(200)" [note: '주소']
  "biz96_ceo" "character varying(50)" [note: '대표이사']

  Note: '계약사별 이력관리(백업)'
}

Table "public"."biz97_fee_info_back" {
  "biz97_fee_info_back_id" "numeric" [pk, note: '보수정보(백업)ID']
  "biz97_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "biz97_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "biz97_dml_user_id" "character varying(50)" [note: '데이터조작 User ID(emp01_person_id)']
  "biz97_dml_user_ip" "character varying(50)" [note: '데이터조작 User IP']
  "biz97_fee_info_id" "numeric" [note: '보수정보ID(biz12_fee_info_id)']
  "biz97_cont_history_id" "numeric" [note: '계약사별 이력관리ID(biz11_cont_history_id)']
  "biz97_min_fee_yn" "character varying(5)" [note: '최저보수여부']
  "biz97_manage_min_fee" "numeric" [note: '운용최저보수(연)']
  "biz97_adv_min_fee" "numeric" [note: '자문최저보수(연)']
  "biz97_discr_min_fee" "numeric" [note: '일임최저보수(연)']
  "biz97_fee_charge_type" "character varying(1)" [note: '보수청구구분(FundFeeChargeType)']
  "biz97_with_yn" "character varying(5)" [note: '병행보수여부']
  "biz97_with_fee" "numeric" [note: '병행보수(연)']

  Note: '보수정보(백업)'
}

Table "public"."biz98_with_corp_back" {
  "biz98_with_corp_back_id" "numeric" [pk, note: '계약사 운영정보(백업)ID']
  "biz98_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "biz98_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "biz98_dml_user_id" "character varying(50)" [note: '데이터조작 User ID(emp01_person_id)']
  "biz98_dml_user_ip" "character varying(50)" [note: '데이터조작 User IP']
  "biz98_with_corp_id" "numeric" [note: '계약사 운영정보ID(biz13_with_corp_id)']
  "biz98_cont_corp_id" "numeric" [note: '계약사 관리ID(biz10_cont_corp_id)']
  "biz98_company_id" "numeric" [note: '회사ID']
  "biz98_manage_type" "character varying(1)" [note: '운영구분(ManageType)']
  "biz98_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "biz98_first_start_date" "date" [note: '최초업무시작일']
  "biz98_last_close_date" "date" [note: '최종업무종료일']

  Note: '계약사 운영정보(백업)'
}

Table "public"."biz99_dual_manage_fund_back" {
  "biz99_dual_manage_fund_back_id" "numeric" [pk, note: '이중사무관리 펀드(백업)ID']
  "biz99_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "biz99_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "biz99_dml_user_id" "character varying(50)" [note: '데이터조작 User ID(emp01_person_id)']
  "biz99_dml_user_ip" "character varying(50)" [note: '데이터조작 User IP']
  "biz99_dual_manage_fund_id" "numeric" [note: '이중사무관리 펀드ID(biz17_dual_manage_fund_id)']
  "biz99_company_id" "numeric" [note: '회사ID']
  "biz99_cont_corp_id" "numeric" [note: '계약사 관리ID(biz10_cont_corp_id)']
  "biz99_fund_cd" "character varying(12)" [note: '펀드코드']
  "biz99_start_date" "date" [note: '적용시작일']
  "biz99_fund_fee" "numeric" [note: '사무관리보수율(bp)']
  "biz99_fund_sub_fee" "numeric" [note: '부사무관리보수율(bp)']
  "biz99_note" "character varying(500)" [note: '비고']
  "biz99_position_type" "character varying(1)" [note: '펀드사무관리 포지션구분(FundMngPositionType - 1:주사무/2:부사무)']

  Note: '이중사무관리 펀드(백업)'
}

Table "public"."crd05_slip_backup" {
  "crd05_slip_id" "numeric" [pk]
  "crd05_company_id" "numeric" [not null]
  "crd05_card_no" "character varying(20)"
  "crd05_slip_ym" "character varying(10)"
  "crd05_slip_bank_cd" "character varying(10)"
  "crd05_create_dt" "timestamp without time zone"
  "crd05_gubun" "character varying(10)"
  "crd05_acct_cd" "character varying(10)"
  "crd05_budget" "character varying(10)"
  "crd05_amount" "numeric"
  "crd05_fr_place" "character varying(100)"
  "crd05_to_place" "character varying(100)"
  "crd05_desc" "character varying(400)"
  "crd05_org_id" "numeric"
  "crd05_person_id" "numeric"
  "crd05_biz_license_no" "character varying(10)"
  "crd05_appr_dt" "timestamp without time zone"
  "crd05_appr_time" "character varying(10)"
  "crd05_load_yn" "character varying(10)"
  "crd05_appr_id" "numeric"

  Note: '(사용안함)'
}

Table "public"."crd06_guest_backup" {
  "crd06_guest_id" "numeric" [pk]
  "crd06_slip_id" "numeric" [not null]
  "crd06_company_nm" "character varying(100)"
  "crd06_part_nm" "character varying(100)"
  "crd06_guest_nm" "character varying(100)"
  "crd06_dscr" "character varying(400)"

  Note: '(사용안함)'
}

Table "public"."crd10_slip_backup" {
  "crd10_slip_id" "numeric" [pk, note: '법인카드내역ID']
  "crd10_company_id" "numeric" [not null, note: '회사ID']
  "crd10_slip_ym" "character varying(10)" [note: '사용년월(YYYY.MM)']
  "crd10_slip_bank_cd" "character varying(10)" [note: '은행(카드)코드(CreditCardCompany)']
  "crd10_approval_dt" "timestamp without time zone" [note: '승인일']
  "crd10_approval_time" "character varying(10)" [note: '승인시간']
  "crd10_part_cd" "character varying(10)" [note: '부서번호']
  "crd10_part_nm" "character varying(50)" [note: '부서명']
  "crd10_card_no" "character varying(20)" [note: '카드번호(Excel)']
  "crd10_card_nm" "character varying(50)" [note: '이용자명']
  "crd10_franchise_nm" "character varying(100)" [note: '가맹점명']
  "crd10_sector_nm" "character varying(30)" [note: '업종명']
  "crd10_payment_method" "character varying(10)" [note: '결제방법']
  "crd10_monthly_payments" "numeric" [note: '할부개월수']
  "crd10_approval_amount" "numeric" [note: '승인금액']
  "crd10_surtax" "numeric" [note: '부가세']
  "crd10_approval_classification" "character varying(10)" [note: '승인구분']
  "crd10_approval_method" "character varying(10)" [note: '승인방식']
  "crd10_approval_no" "character varying(10)" [note: '승인번호']
  "crd10_state_nm" "character varying(20)" [note: '상태']
  "crd10_tax_ty" "character varying(20)" [note: '과세유형']
  "crd10_merchant_status" "character varying(10)" [note: '가맹점상태']
  "crd10_merchant_no" "character varying(20)" [note: '가맹점번호']
  "crd10_biz_license_no" "character varying(10)" [note: '사업자번호']
  "crd10_representative_nm" "character varying(50)" [note: '대표자명']
  "crd10_merchant_addr" "character varying(200)" [note: '주소']
  "crd10_merchant_phone" "character varying(20)" [note: '전화번호']

  Note: '법인카드내역(사용안함)'
}

Table "public"."empbak01_person" {
  "empbak01_id" "numeric" [pk, note: '[백업]개인정보ID(PK)']
  "empbak01_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "empbak01_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "empbak01_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "empbak01_person_id" "numeric" [note: '개인정보ID']
  "empbak01_emp_no" "character varying(20)" [note: '사번']
  "empbak01_order_seq" "character varying(10)"
  "empbak01_kor_nm" "character varying(40)" [note: '한글성명']
  "empbak01_hire_cd" "character varying(10)" [note: '입사유형코드']
  "empbak01_apply_cd" "character varying(10)"
  "empbak01_hire_date" "date" [note: '입사일']
  "empbak01_email_addr" "character varying(100)" [note: '이메일주소']
  "empbak01_office_telno" "character varying(20)" [note: '회사전화번호:emp01_emgrcy_telno']
  "empbak01_office_detail" "character varying(20)"
  "empbak01_mobile_telno" "character varying(20)" [note: '휴대폰번호']
  "empbak01_password" "character varying(128)" [note: '암호 (메일암호)']
  "empbak01_company_id" "numeric" [note: '회사ID']
  "empbak01_note" "character varying(400)" [note: '비고']
  "empbak01_location_cd" "character varying(10)" [note: '개인위치(상태)코드']
  "empbak01_theme_cd" "character varying(10)" [note: '개인테마코드']
  "empbak01_lock_yn" "character varying(5)" [note: '잠금여부']
  "empbak01_menu_fix_yn" "character varying(5)" [note: '메뉴고정여부']

  Note: '[백업]개인정보'
}

Table "public"."empbak02_others" {
  "empbak02_id" "numeric" [pk, note: '[백업]Others 개인정보ID(PK)']
  "empbak02_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "empbak02_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "empbak02_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "empbak02_others_id" "numeric" [note: 'Key ID']
  "empbak02_person_id" "numeric" [note: '개인정보ID']
  "empbak02_chn_nm" "character varying(40)" [note: '한자성명']
  "empbak02_ctz_no" "character varying(128)" [note: '주민번호']
  "empbak02_birthday" "timestamp without time zone" [note: '생일']
  "empbak02_lunar_cd" "character varying(10)"
  "empbak02_eng_nm" "character varying(100)" [note: '영문성명']
  "empbak02_gender_cd" "character varying(10)" [note: '성별코드']
  "empbak02_nat_cd" "character varying(10)" [note: '국적코드']
  "empbak02_email_other" "character varying(100)" [note: '이메일주소']
  "empbak02_military_cd" "character varying(10)"
  "empbak02_family_dscr" "character varying(100)"
  "empbak02_marriage_cd" "character varying(10)"
  "empbak02_zip_cd" "character varying(10)" [note: '우편번호']
  "empbak02_zip_addr" "character varying(200)" [note: '우편번호주소']
  "empbak02_addr_detail" "character varying(200)" [note: '상세주소']
  "empbak02_home_telno" "character varying(20)" [note: '집전화번호']
  "empbak02_note" "character varying(400)" [note: '비고']
  "empbak02_note_admin" "text" [note: '비고(시스템관리자전용)']
  "empbak02_hire_date_group" "date" [note: '입사일(그룹사기준)']
  "empbak02_hire_date_leave_calc" "date" [note: '입사일(연차계산용)']

  Note: '[백업]Others 개인정보'
}

Table "public"."empbak03_trans" {
  "empbak03_id" "numeric" [pk, note: '[백업]발령정보ID(PK)']
  "empbak03_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "empbak03_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "empbak03_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "empbak03_trans_id" "numeric" [note: '발령ID']
  "empbak03_trans_date" "timestamp without time zone" [note: '발령일자']
  "empbak03_trans_cd" "character varying(40)" [note: '100:채용/200:이동/../800:겸직/900:퇴직']
  "empbak03_trans_reason" "character varying(400)" [note: '발령사유']
  "empbak03_pos_cd" "character varying(40)" [note: '직위코드(EmpPosCode)']
  "empbak03_title_cd" "character varying(40)" [note: '직책코드(EmpTitleCode)']
  "empbak03_grade_cd" "character varying(40)" [note: '특정직코드 (EmpGradeCode)']
  "empbak03_org_code_id" "numeric" [note: '조직코드ID']
  "empbak03_note" "character varying(400)" [note: '비고']
  "empbak03_person_id" "numeric" [note: '직원ID']
  "empbak03_kind_cd" "character varying(40)" [note: '유형코드 (EmpKindCode)']
  "empbak03_job_code_id" "numeric" [note: '조직코드ID (사용안함)']
  "empbak03_officer_yn" "character varying(5)" [note: '임원등기여부']
  "empbak03_duty" "character varying(200)" [note: '주요업무']
  "empbak03_org_head_yn" "character varying(5)" [note: '조직 장여부']
  "empbak03_non_stay_yn" "character varying(5)" [note: '비상근 여부']
  "empbak03_expiry_date" "timestamp without time zone" [note: '계약만료일자']
  "empbak03_tdm_target_yn" "character varying(5)" [note: '책무대상여부']
  "empbak03_director_yn" "character varying(5)" [note: '(일반)임원여부']

  Note: '[백업]발령정보'
}

Table "public"."flt90_tr_back" {
  "flt90_tr_back_id" "numeric" [pk, note: '임직원 금융상품 매매(백업)ID(PK)']
  "flt90_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "flt90_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "flt90_tr_id" "numeric" [note: '임직원 금융상품 매매ID(PK)']
  "flt90_company_id" "numeric" [note: '회사ID']
  "flt90_person_id" "numeric" [note: '사원ID']
  "flt90_tr_type" "character varying(3)" [note: '매매구분 (매수/매도) - BuySellType']
  "flt90_account_id" "numeric" [note: '계좌ID(FLT03_ACCOUNT_ID)']
  "flt90_item_nm" "character varying(100)" [note: '종목명']
  "flt90_item_type" "character varying(2)" [note: '종목유형코드(flt05_item_type_cd)']
  "flt90_reg_date" "date" [note: '사전승인신고일']
  "flt90_expect_tr_date" "date" [note: '매매유효일']
  "flt90_expect_tr_amt" "numeric" [note: '사전신고 매매(예상)금액']
  "flt90_expect_tr_qty" "numeric" [note: '사전신고 매매수량']
  "flt90_appr_yn" "character varying(5)" [note: '사전신고 승인여부']
  "flt90_tr_date" "date" [note: '실거래일']
  "flt90_tr_item_nm" "character varying(100)" [note: '실종목명']
  "flt90_tr_item_type" "character varying(2)" [note: '실거래 종목유형코드(flt05_item_type_cd)']
  "flt90_tr_amt" "numeric" [note: '실매매금액']
  "flt90_tr_qty" "numeric" [note: '실매매수량']
  "flt90_note" "character varying(100)" [note: '비고']
  "flt90_appr_id" "numeric" [note: '상신ID (거래보고용)']
  "flt90_expect_appr_id" "numeric" [note: '상신ID (사전신고용)']
  "flt90_item_cd" "character varying(12)" [note: '종목코드']
  "flt90_tr_item_cd" "character varying(12)" [note: '실종목코드']
  "flt90_status_cd" "character varying(2)"
  "flt90_tr_reason" "text"
  "flt90_reject_reason" "text"
  "flt90_out_account_id" "numeric"
  "flt90_confirmer_id" "numeric" [note: '승인자ID']
  "flt90_confirm_datetime" "timestamp without time zone" [note: '승인일시']
  "flt90_confirm_sms_yn" "character varying(5)" [note: '승인/반려 문자발송여부']
  "flt90_tr_note" "text" [note: '비고(실거래 등록시 입력)']
  "flt90_unfill_yn" "character varying(5)" [note: '미체결여부']
  "flt90_pur_amt" "numeric" [note: '취득금액']

  Note: '임직원 금융상품 매매(백업)'
}

Table "public"."icam90_fee_back" {
  "icam90_fee_back_id" "numeric" [pk, note: 'ICAM 보수(백업)ID(PK)']
  "icam90_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "icam90_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "icam90_fee_id" "numeric" [note: 'ICAM 보수ID(icam10_fee_id)']
  "icam90_company_id" "numeric" [note: '회사ID']
  "icam90_std_date" "date" [note: '기준일자']
  "icam90_icam_company_cd" "character varying(8)" [note: 'ICAM회사코드(ICAM - CORP_GR 코드)']
  "icam90_icam_company_nm" "character varying(200)" [note: 'ICAM회사명']
  "icam90_fee_type" "character varying(5)" [note: '보수구분(FundFeeType, ICAM 계정과목 코드)']
  "icam90_rmk_cd" "character varying(3)" [note: '적요코드(szx0gy)']
  "icam90_rmk_nm" "character varying(100)" [note: '적요명']
  "icam90_drcr_type" "character varying(1)" [note: '차대구분(D:차변/C:대변)']
  "icam90_fund_cd" "character varying(12)" [note: '펀드코드']
  "icam90_fund_nm" "character varying(200)" [note: '펀드명']
  "icam90_fee" "numeric" [note: '보수']
  "icam90_cur_cd" "character varying(3)" [note: '통화코드']
  "icam90_fx_rate" "numeric" [note: '적용환율']
  "icam90_af_pay_date" "date" [note: '다음보수인출일']
  "icam90_bf_pay_date" "date" [note: '전보수인출일']
  "icam90_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "icam90_consignment_nm" "character varying(100)" [note: '수탁사명']
  "icam90_work_date" "timestamp without time zone" [note: '작업일시(생성일시)']
  "icam90_worker" "character varying(50)" [note: '작업자(생성자)']

  indexes {
    (icam90_company_id, icam90_std_date) [name: 'icam90_fee_back_idx01']
  }

  Note: 'ICAM펀드보수 당일발생내역(백업)'
}

Table "public"."paybak34_work_time_config" {
  "paybak34_id" "numeric" [pk, note: '[백업]근로시간 기준관리ID(PK)']
  "paybak34_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "paybak34_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "paybak34_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "paybak34_work_time_config_id" "numeric" [note: '근로시간 기준관리ID(PK)']
  "paybak34_company_id" "numeric" [note: '회사ID']
  "paybak34_start_date" "date" [note: '적용시작일']
  "paybak34_day_work_hours" "numeric" [note: '일 법정 근로시간(8시간)']
  "paybak34_week_max_add_hours" "numeric" [note: '주 최대 추가(연장/야간/휴일)근로시간(2시간*6일=12시간)']
  "paybak34_ot_mult_rate" "numeric" [note: '연장근로 가산배수(1.5배)']
  "paybak34_nt_mult_rate" "numeric" [note: '야간근로 가산배수(2배)']
  "paybak34_holi_std_mult_rate" "numeric" [note: '휴일근로 법정근로시간(8시간이전) 가산배수']
  "paybak34_holi_over_mult_rate" "numeric" [note: '휴일근로 법정근로 초과시간(8시간초과) 가산배수']
  "paybak34_nt_start_time" "character varying(5)" [note: '야간근로 시작시간(22:00)']
  "paybak34_nt_end_time" "character varying(5)" [note: '야간근로 종료시간(06:00)']

  Note: '[백업]근로시간 기준관리'
}

Table "public"."sys90_after_service_backup" {
  "sys90_after_service_backup_id" "numeric" [pk, note: '개선 및 오류처리내역(백업)ID(PK)']
  "sys90_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "sys90_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "sys90_after_service_id" "numeric" [note: '개선 및 오류처리내역ID']
  "sys90_company_id" "numeric" [note: '회사ID']
  "sys90_reg_emp_nm" "character varying(100)" [note: '등록사원명']
  "sys90_type_yn" "character varying(10)" [note: '구분->10:오류,20:개선,30:건의,40:기타']
  "sys90_happen_date" "timestamp without time zone" [note: '발생일자']
  "sys90_happen_reason" "text" [note: '개선 및 오류내용']
  "sys90_happen_remedy" "text" [note: '처리방안']
  "sys90_worker" "character varying(100)" [note: '담당자']
  "sys90_due_date" "timestamp without time zone" [note: '완료예정일']
  "sys90_state_cd" "character varying(10)" [note: '처리상태(완료여부)-이행불가/진행중/완료']
  "sys90_remarks" "text" [note: '비고']
  "sys90_confirm_yn" "character varying(5)" [note: '요청자 확인여부(true/false)']

  Note: '개선 및 오류처리내역(백업)'
}

Table "public"."sysbak01_company" {
  "sysbak01_id" "numeric" [pk, note: '[백업]회사정보ID(PK)']
  "sysbak01_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "sysbak01_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "sysbak01_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "sysbak01_company_id" "numeric" [note: '회사ID']
  "sysbak01_company_nm" "character varying(400)" [note: '회사명']
  "sysbak01_biz_no" "character varying(20)" [note: '사업자등록번호']
  "sysbak01_office_tel_no" "character varying(20)" [note: '전화번호1']
  "sysbak01_emgrcy_passwd" "character varying(20)" [note: '전화번호2']
  "sysbak01_office_fax_no" "character varying(20)" [note: '팩스번호1']
  "sysbak01_zip_cd" "character varying(10)" [note: '우편번호']
  "sysbak01_zip_addr" "character varying(400)" [note: '주소']
  "sysbak01_zip_detail" "character varying(400)" [note: '상세주소']
  "sysbak01_loc_nm" "character varying(40)" [note: '지역']
  "sysbak01_anniv_date" "timestamp without time zone" [note: '기념일']
  "sysbak01_note" "text" [note: '비고']
  "sysbak01_mail_info" "character varying(20)" [note: '메일서버정보']
  "sysbak01_mobile_tel_no" "character varying(20)" [note: '비상전화']
  "sysbak01_email_addr" "character varying(20)" [note: '비상이메일']
  "sysbak01_start_date" "timestamp without time zone" [note: '설립일']
  "sysbak01_close_date" "timestamp without time zone" [note: '계약종료일']
  "sysbak01_use_yn" "character varying(10)" [note: '사용여부']
  "sysbak01_emp_info" "character varying(400)" [note: '담당자(이름/부서/직책)']
  "sysbak01_cont_type" "character varying(100)" [note: 'X']
  "sysbak01_main_image_id" "numeric" [note: 'X']
  "sysbak01_cycle_time" "character varying(10)" [note: 'X']
  "sysbak01_leave_yn" "character varying(10)" [note: '휴가초과허용여부']
  "sysbak01_leave_month_cd" "character varying(2)" [note: '휴가결산월(MonthsCode)']
  "sysbak01_leave_form_cd" "character varying(2)" [note: '휴가신청서 양식코드(LeaveFormCode)']
  "sysbak01_icam_company_cd" "character varying(8)" [note: 'ICAM운용사코드']
  "sysbak01_ast_manager_auto_yn" "character varying(5)" [note: '자산담당자 자동생성 여부(전체부서가 담당부서로 지정)']
  "sysbak01_appr_step_lock_yn" "character varying(5)" [note: '결재선 잠금여부(Default: true)']
  "sysbak01_account_close_month" "character varying(2)" [note: '회계결산월(MonthsCode)']
  "sysbak01_leave_compulsion_rt" "numeric" [note: '휴가의무사용율(%)']
  "sysbak01_ics_check_cycle_type" "character varying(1)" [note: '내부통제 체크리스트 주기구분(M:월/Q:분기)-IcsCheckListCycleType']
  "sysbak01_tax_type" "character varying(1)" [note: '과세구분(TaxType-1:면세/2:과세/3:공통)']
  "sysbak01_company_rep_nm" "character varying(20)" [note: '대외문서(대표이사)']
  "sysbak01_mail_log_yn" "character varying(5)" [note: '메일기록여부']
  "sysbak01_ics_comply_cycle_type" "character varying(1)" [note: '임직원 내부통제 준수점검 주기구분(M:월/Q:분기)-IcsCheckListCycleType']
  "sysbak01_dcr_numbering_cd" "character varying(1)" [note: '문서번호채번방식코드(DcrNumberingCode) - 1:연도별(기본)/2:연도-부서별 ']
  "sysbak01_dcr_detail_use_yn" "character varying(5)" [note: '문서세부분류 사용여부']
  "sysbak01_apr_manager_info_yn" "character varying(5)" [note: '대외문서 담당자정보포함여부']
  "sysbak01_notice_date" "timestamp without time zone" [note: '공지시작일']
  "sysbak01_owner_capital_apply_cd" "character varying(2)" [note: '자기자본적용일코드(OwnerCapitalApplyDateType-10:최근/20:전전월말)']
  "sysbak01_ics_guide_yn" "character varying(5)" [note: '내부통제 문서연결 가이드 사용여부']
  "sysbak01_asset_yn" "character varying(5)" [note: '고객사(자산)여부']
  "sysbak01_advis_yn" "character varying(5)" [note: '고객사(자문)여부']
  "sysbak01_pbs_yn" "character varying(5)" [note: '고객사(PBS)여부']
  "sysbak01_ast_eval_cycle_cd" "character varying(1)" [note: '평가주기 AssetEvalCycleCode(M:월평가,W:주평가(or일평가))']
  "sysbak01_corp_reg_no" "character varying(128)" [note: '법인등록번호']
  "sysbak01_income_tax_filing_cd" "character varying(1)" [note: '소득세신고주기코드(IncomeTaxFilingCode-M:매월/H:반기별)']
  "sysbak01_icam_advis_company_cd" "character varying(8)" [note: 'ICAM자문사코드']
  "sysbak01_login_secure_yn" "character varying(5)" [note: '보안로그인여부(공인IP)']
  "sysbak01_ics_non_stay_yn" "character varying(5)" [note: '내부통제 비상근인력 체크여부']
  "sysbak01_emp_eval_cycle_cd" "character varying(10)" [note: '인사평가 평가기간(CycleCode002 - 05:반기별/06:연별)']
  "sysbak01_emp_eval_month_cd" "character varying(10)" [note: '인사평가 시작월(MonthsCode)']
  "sysbak01_card_real_user_yn" "character varying(5)" [note: '법인카드 실사용자 사용여부']
  "sysbak01_erp_product_cd" "character varying(2)" [note: 'AssetERP상품코드(ErpProductCode-S1/S2/S3/A1)']
  "sysbak01_flt_only_curr_yn" "character varying(5)" [note: '사전신고 소급 미사용']
  "sysbak01_dcr_preconfirm_skip_yn" "character varying(5)" [note: '준감인 문서사전확인 승인Skip 여부(심사필번호 신청시 부여)']
  "sysbak01_secondary_auth_yn" "character varying(5)" [note: '2차인증사용여부']
  "sysbak01_leave_confirm_yn" "character varying(5)" [note: '초과휴가승인 사용여부(sys01_leave_yn=true 시 추가 조건)']
  "sysbak01_commute_lock_yn" "character varying(5)" [note: '근태잠금사용여부']
  "sysbak01_tdm_start_date" "date" [note: '책무이행점검 시작일자']
  "sysbak01_ics_check_confirmer_type" "character varying(1)" [note: '내부통제 체크리스트 확인자 구분(IcsCheckListConfirmerType-1:조직장/2:준법감시인)']

  Note: '[백업]회사정보'
}

Table "public"."tdm_bak01_emp" {
  "tdm01_emp_id" "numeric" [pk, note: '인사정보(직원정보)ID(PK)']
  "tdm01_company_id" "numeric" [not null]
  "tdm01_emp_nm" "character varying(100)" [note: '성명']
  "tdm01_position_nm" "character varying(100)"
  "tdm01_dept_id" "numeric"
  "tdm01_dept_nm" "character varying(100)"
  "tdm01_start_date" "date"
  "tdm01_end_date" "date"
  "tdm01_upd_id" "numeric"
  "tdm01_upd_date" "date"

  indexes {
    (tdm01_company_id, tdm01_emp_id) [name: 'tdm01_emp_idx01']
  }

  Note: '인사정보(직원정보)'
}

Table "public"."tdm_bak02_dept" {
  "tdm02_dept_id" "numeric" [pk, note: '인사정보(부서정보)ID(PK)']
  "tdm02_company_id" "numeric" [not null]
  "tdm02_dept_nm" "character varying(100)"
  "tdm02_head_id" "numeric"
  "tdm02_head_nm" "character varying(30)"
  "tdm02_role_yn" "character varying(5)" [note: '직책 마스터코드에 포함되는지 여부']
  "tdm02_upper_dept_id" "numeric" [note: '상위 부서장 ID']
  "tdm02_upper_dept_nm" "character varying(100)" [note: '상위 부서장 성명']
  "tdm02_start_date" "date"
  "tdm02_end_date" "date"
  "tdm02_upd_id" "numeric"
  "tdm02_upd_date" "date"

  indexes {
    (tdm02_company_id, tdm02_dept_id) [name: 'tdm02_dept_idx01']
  }

  Note: '인사정보(부서정보)'
}

Table "public"."tdm_bak03_role" {
  "tdm03_role_id" "numeric" [pk, note: '직책ID(PK)']
  "tdm03_company_id" "numeric" [not null]
  "tdm03_dept_id" "numeric"
  "tdm03_role_nm" "character varying(50)" [note: '직책명']
  "tdm03_role_tp" "character varying(1)"
  "tdm03_role_cd" "character varying(5)" [note: '직책코드(외부용)']
  "tdm03_role_overview" "character varying(200)"
  "tdm03_start_date" "date"
  "tdm03_end_date" "date"
  "tdm03_upd_id" "numeric"
  "tdm03_upd_date" "date"

  indexes {
    (tdm03_company_id, tdm03_role_id) [name: 'tdm03_role_idx01']
  }

  Note: '직책정보 (직책마스터)'
}

Table "public"."tdm_bak04_task" {
  "tdm04_task_id" "numeric" [pk, note: '책무ID(PK)']
  "tdm04_task_nm" "character varying(200)" [note: '책무명']
  "tdm04_company_id" "numeric" [not null]
  "tdm04_task_tp" "character varying(1)" [note: '책무구분(코드 : TdmTaskType)']
  "tdm04_task_cd" "character varying(5)"
  "tdm04_common_yn" "character varying(5)" [note: '공통책무 여부']
  "tdm04_ceo_yn" "character varying(5)" [note: 'CEO책무 여부']
  "tdm04_start_date" "date"
  "tdm04_end_date" "date"
  "tdm04_upd_id" "numeric"
  "tdm04_upd_date" "date"

  indexes {
    (tdm04_company_id, tdm04_task_id) [name: 'tdm04_task_idx01']
  }

  Note: '책무정보 (책무마스터)'
}

Table "public"."tdm_bak05_cncl" {
  "tdm05_cncl_id" "numeric" [pk, note: '회의체ID(PK)']
  "tdm05_cncl_nm" "character varying(100)" [note: '회의체명']
  "tdm05_cncl_cd" "character varying(5)" [note: '회의체코드(외부용)']
  "tdm05_company_id" "numeric" [not null]
  "tdm05_open_cycle" "character varying(2)" [note: '회의체 개최주기(코드 : TdmCnclOpenCycle)']
  "tdm05_key_decision" "character varying(200)" [note: '주요의결사항']
  "tdm05_start_date" "date"
  "tdm05_end_date" "date"
  "tdm05_upd_id" "numeric"
  "tdm05_upd_date" "date"

  Note: '회의체정보 (회의체마스터)'
}

Table "public"."tdm_bak06_rule" {
  "tdm06_rule_id" "numeric" [pk, note: '내규ID(PK)']
  "tdm06_rule_nm" "character varying(100)" [note: '내규명']
  "tdm06_company_id" "numeric" [not null]
  "tdm06_rule_class" "character varying(20)" [note: '내규 분류']
  "tdm06_rule_overview" "character varying(200)" [note: '내규 개요']
  "tdm06_start_date" "date"
  "tdm06_end_date" "date"
  "tdm06_upd_id" "numeric"
  "tdm06_upd_date" "date"

  indexes {
    (tdm06_company_id, tdm06_rule_id) [name: 'tdm06_rule_idx01']
  }

  Note: '내규정보 (내규 마스터)'
}

Table "public"."tdm_bak11_task_def" {
  "tdm11_task_def_id" "numeric" [pk, note: '책무정의ID(PK)']
  "tdm11_company_id" "numeric" [not null]
  "tdm11_task_id" "numeric" [not null, note: '책무ID, tdm04_task_id']
  "tdm11_task_def_tp" "character varying(12)" [note: '책무구분 (코드 : TdmTaskDefType   개요, 세부, 의무, 법규)']
  "tdm11_order_no" "numeric" [note: '출력순서']
  "tdm11_def_nm" "character varying(400)" [note: '정의문(문자열)']
  "tdm11_law_cd" "character varying(12)" [note: '법령종류(코드: TdmLawCode,  TdmTaskDefType=LAW 일때)']
  "tdm11_detail_id" "numeric" [note: '세부ID( TdmTaskDefType=DUTY 일때)']
  "tdm11_upd_id" "numeric"
  "tdm11_upd_date" "date"

  indexes {
    (tdm11_company_id, tdm11_task_id, tdm11_task_def_tp, tdm11_order_no) [name: 'tdm11_task_def_idx01']
  }

  Note: '책무 정의서 '
}

Table "public"."tdm_bak12_role_task" {
  "tdm12_role_task_id" "numeric" [pk, note: '직책별 책무ID(PK)']
  "tdm12_company_id" "numeric" [not null]
  "tdm12_role_id" "numeric" [not null, note: '직급ID, tdm04_task_id']
  "tdm12_task_id" "numeric" [not null, note: '책무ID, tdm03_role_id']
  "tdm12_start_date" "date"
  "tdm12_end_date" "date"
  "tdm12_upd_id" "numeric"
  "tdm12_upd_date" "date"

  indexes {
    (tdm12_company_id, tdm12_role_id, tdm12_task_id) [name: 'tdm12_role_task_idx01']
  }

  Note: '직책별 책무 정의서 '
}

Table "public"."tdm_bak13_role_cncl" {
  "tdm13_role_cncl_id" "numeric" [pk, note: '직책별 위원회ID(PK)']
  "tdm13_company_id" "numeric" [not null]
  "tdm13_role_id" "numeric" [not null, note: '직급ID, tdm04_task_id']
  "tdm13_cncl_id" "numeric" [not null, note: '책무ID, tdm05_cncl_id']
  "tdm13_cncl_memb_tp" "character varying(3)" [note: '회의체 멤버 구분 (코드 : TdmCnclMemberType)']
  "tdm13_start_date" "date"
  "tdm13_end_date" "date"
  "tdm13_upd_id" "numeric"
  "tdm13_upd_date" "date"

  indexes {
    (tdm13_company_id, tdm13_role_id, tdm13_cncl_id) [name: 'tdm13_role_cncl_idx01']
  }

  Note: '직책별 위원회 '
}

Table "public"."tdm_bak14_cncl_record" {
  "tdm14_cncl_record_id" "numeric" [pk, note: '이사회 의결기록ID(PK)']
  "tdm14_company_id" "numeric" [not null]
  "tdm14_cncl_id" "numeric" [not null, note: '회의채ID, tdm05_cncl_id']
  "tdm14_open_date" "date" [note: '개최일']
  "tdm14_decision" "character varying(400)" [note: '안건']
  "tdm14_upd_id" "numeric"
  "tdm14_upd_date" "date"

  indexes {
    (tdm14_company_id, tdm14_cncl_id, tdm14_open_date) [name: 'tdm14_cncl_record_idx01']
  }

  Note: '이사회 의결기록 '
}

Table "public"."tdm_bak15_rule_def" {
  "tdm15_rule_def_id" "numeric" [pk]
  "tdm15_company_id" "numeric" [not null]
  "tdm15_rule_id" "numeric" [not null]
  "tdm15_start_date" "date" [not null, note: '개정일']
  "tdm15_dept_id" "numeric" [not null, note: '소관부서']
  "tdm15_attach_file" "character varying(100)"
  "tdm15_upd_id" "numeric"
  "tdm15_upd_date" "date"

  indexes {
    (tdm15_company_id, tdm15_rule_id, tdm15_start_date) [name: 'tdm15_rule_def_idx01']
  }

  Note: '내규 이력 (내규 개정이력)'
}

Table "public"."tdm_bak21_allc" {
  "tdm21_allc_id" "numeric" [pk, note: '책무배분 ID(PK)']
  "tdm21_company_id" "numeric" [not null]
  "tdm21_role_id" "numeric" [not null, note: '직책ID, tdm03_role']
  "tdm21_emp_id" "numeric" [not null, note: '임원ID tdm01_emp']
  "tdm21_reg_reason" "character varying(100)"
  "tdm21_deputy_emp_nm" "character varying(100)" [note: '유고시 대체 임직원 ']
  "tdm21_emp_appr_date" "date" [note: '임원동의 여부  ']
  "tdm21_emp_appr_yn" "character varying(5)"
  "tdm21_start_date" "date"
  "tdm21_end_date" "date"
  "tdm21_upd_id" "numeric"
  "tdm21_upd_date" "date"

  indexes {
    (tdm21_company_id, tdm21_emp_id, tdm21_role_id) [name: 'tdm21_allc_idx01']
  }

  Note: '책무배분 (직책별 담당임원등록) '
}

Table "public"."tdm_bak22_desc" {
  "tdm22_desc_id" "numeric" [pk, note: '책무기술서 Master ID(PK)']
  "tdm22_company_id" "numeric" [not null]
  "tdm22_allc_id" "numeric" [not null, note: '책무 배분ID tdm21_allc_id']
  "tdm22_start_date" "date" [note: '책무기술서 생성 시작일']
  "tdm22_end_date" "date" [note: '책무기술서 생성 완료일']
  "tdm22_reg_reason_tp" "character varying(3)" [note: '등록사유 (코드 :  TdmDescRegReason)']
  "tdm22_desc_attach_file" "character varying(100)" [note: '책무기술서  첨부화일']
  "tdm22_digm_attach_file" "character varying(100)" [note: '책무체계도  첨부화일']
  "tdm22_cncl_appr_date" "date" [note: '이사회 개최']
  "tdm22_submit_date" "date" [note: '감독기관 제출일자']
  "tdm22_upd_id" "numeric"
  "tdm22_upd_date" "date"

  indexes {
    (tdm22_company_id, tdm22_desc_id) [name: 'tdm22_desc_idx01']
  }

  Note: '책무기술서 Master '
}

Table "public"."tdm_bak40_manl_job" {
  "tdm40_manl_job_id" "numeric" [pk, note: '업무매뉴얼작업 Master ID(PK)']
  "tdm40_company_id" "numeric" [not null]
  "tdm40_manl_job_nm" "character varying(100)"
  "tdm40_role_id" "numeric" [not null, note: '대상 직책(0은 전체)']
  "tdm40_due_fr_date" "date"
  "tdm40_due_to_date" "date"
  "tdm40_start_date" "date" [note: '업무매뉴얼 효력 시작일']
  "tdm40_end_date" "date" [note: '업무매뉴얼 효력  종료일']
  "tdm40_upd_nm" "character varying(50)"
  "tdm40_upd_date" "timestamp without time zone"

  Note: '업무매뉴얼작업 Master '
}

Table "public"."tdm_bak41_manl_duty" {
  "tdm41_manl_duty_id" "numeric" [pk]
  "tdm41_manl_job_id" "numeric" [not null]
  "tdm41_company_id" "numeric" [not null]
  "tdm41_role_id" "numeric" [not null]
  "tdm41_task_id" "numeric" [not null]
  "tdm41_detail_seq" "numeric" [not null]
  "tdm41_detail_id" "numeric" [not null]
  "tdm41_duty_seq" "numeric" [not null]
  "tdm41_duty_id" "numeric" [not null]
  "tdm41_duty_cd" "character varying(12)"
  "tdm41_role_nm" "character varying(400)"
  "tdm41_task_nm" "character varying(400)"
  "tdm41_detail_nm" "character varying(400)"
  "tdm41_duty_nm" "character varying(400)"
  "tdm41_dept_id" "numeric"
  "tdm41_complete_yn" "character varying(5)"
  "tdm41_complete_date" "date"
  "tdm41_upd_id" "numeric"
  "tdm41_upd_date" "timestamp without time zone"
}

Table "public"."tdm_bak42_manl" {
  "tdm42_manl_id" "numeric" [pk]
  "tdm42_manl_job_id" "numeric" [not null]
  "tdm42_company_id" "numeric" [not null]
  "tdm42_role_id" "numeric" [not null]
  "tdm42_task_id" "numeric" [not null]
  "tdm42_detail_id" "numeric" [not null]
  "tdm42_duty_id" "numeric" [not null]
  "tdm42_dept_id" "numeric"
  "tdm42_person_id" "numeric"
  "tdm42_chk_no" "numeric"
  "tdm42_chk_item" "character varying(400)"
  "tdm42_chk_how" "character varying(2000)"
  "tdm42_chk_cycle" "character varying(3)"
  "tdm42_chk_mon" "character varying(30)"
  "tdm42_chk_evid_tp" "character varying(2)"
  "tdm42_complete_yn" "character varying(5)"
  "tdm42_complete_date" "date"
  "tdm42_upd_id" "numeric"
  "tdm42_upd_dt" "timestamp without time zone"
}

Table "public"."tdm_bak43_manl_status" {
  "tdm43_manl_status_id" "numeric" [pk]
  "tdm43_manl_job_id" "numeric" [not null]
  "tdm43_company_id" "numeric" [not null]
  "tdm43_dept_id" "numeric" [not null]
  "tdm43_role_id" "numeric" [not null]
  "tdm43_exct_id" "numeric"
  "tdm43_manl_attach_file" "character varying(100)"
  "tdm43_appr_id" "numeric"
  "tdm43_appr_date" "date"
  "tdm43_upd_id" "numeric"
  "tdm43_upd_dt" "timestamp without time zone"
}

Table "public"."tdmbak01_hr" {
  "tdmbak01_id" "numeric" [pk, note: '[백업]인사(임원)정보ID(PK)']
  "tdmbak01_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak01_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak01_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak01_hr_id" "numeric" [note: '인사(임원)정보ID(PK)']
  "tdmbak01_company_id" "numeric" [note: '회사ID']
  "tdmbak01_person_id" "numeric" [note: '사원(임원)ID']
  "tdmbak01_person_nm" "character varying(50)" [note: '사원(임원)명']
  "tdmbak01_person_no" "character varying(20)" [note: '사번']
  "tdmbak01_pos_cd" "character varying(3)" [note: '직위코드(EmpPosCode)']
  "tdmbak01_title_cd" "character varying(3)" [note: '직책코드(EmpTitleCode)']
  "tdmbak01_hire_date" "date" [note: '입사일']
  "tdmbak01_retire_date" "date" [note: '퇴사일']
  "tdmbak01_end_date" "date" [note: '책무대상 종료일']
  "tdmbak01_org_id" "numeric" [note: '조직ID']
  "tdmbak01_org_nm" "character varying(100)" [note: '조직명']
  "tdmbak01_org_head_nm" "character varying(50)" [note: '조직장명']
  "tdmbak01_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak01_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]인사(임원)정보'
}

Table "public"."tdmbak02_hr_record" {
  "tdmbak02_id" "numeric" [pk, note: '[백업]인사변동사항 반영정보ID(PK)']
  "tdmbak02_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak02_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak02_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak02_hr_record_id" "numeric" [note: '인사변동사항 반영정보ID(PK)']
  "tdmbak02_company_id" "numeric" [note: '회사ID']
  "tdmbak02_reg_date" "date" [note: '등록일']
  "tdmbak02_reg_type" "character varying(3)" [note: '등록구분(신규:NEW/변동:UPD/제거:DEL)']
  "tdmbak02_person_nm" "character varying(50)" [note: '사원(임원)명']
  "tdmbak02_change_data" "text" [note: '변경 데이터']
  "tdmbak02_init_nm" "character varying(50)" [note: '등록자(인사정보반영자)']
  "tdmbak02_init_date" "timestamp without time zone" [note: '등록(일사정보반영)일시']
  "tdmbak02_note" "text" [note: '비고']
  "tdmbak02_apply_cd" "character varying(1)" [note: '적용여부(ApplyStatusCode-0:미적용/1:적용완료/9:해당없음)']
  "tdmbak02_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak02_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]인사변동사항 반영정보'
}

Table "public"."tdmbak05_cncl" {
  "tdmbak05_id" "numeric" [pk, note: '[백업]위원회(회의체) 정보ID(PK)']
  "tdmbak05_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak05_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak05_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak05_cncl_id" "numeric" [note: '위원회정보ID(PK)']
  "tdmbak05_company_id" "numeric" [note: '회사ID']
  "tdmbak05_cncl_nm" "character varying(100)" [note: '위원회명']
  "tdmbak05_open_cycle_cd" "character varying(2)" [note: '개최주기(CycleCode003-04:분기별/05:반기별/06:연별/99:수시)']
  "tdmbak05_main_decision" "text" [note: '주요의결사항']
  "tdmbak05_start_date" "date" [note: '사용시작일']
  "tdmbak05_end_date" "date" [note: '사용종료일']
  "tdmbak05_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak05_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak05_note" "text" [note: '비고']

  Note: '[백업]위원회(회의체) 정보'
}

Table "public"."tdmbak06_cncl_record" {
  "tdmbak06_id" "numeric" [pk, note: '[백업]이사회 의결기록ID(PK)']
  "tdmbak06_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak06_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak06_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak06_cncl_record_id" "numeric" [note: '이사회 의결기록ID(PK)']
  "tdmbak06_company_id" "numeric" [note: '회사ID']
  "tdmbak06_cncl_id" "character varying(100)" [note: '위원회ID(tdm05_cncl_id)']
  "tdmbak06_open_date" "date" [note: '개최일']
  "tdmbak06_decision" "text" [note: '안건']
  "tdmbak06_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak06_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이사회 의결기록'
}

Table "public"."tdmbak07_rule" {
  "tdmbak07_id" "numeric" [pk, note: '[백업]내규관리ID(PK)']
  "tdmbak07_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak07_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak07_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak07_rule_id" "numeric" [note: '내규관리ID(PK)']
  "tdmbak07_company_id" "numeric" [note: '회사ID']
  "tdmbak07_company_rule_cd" "character varying(8)" [note: '내규코드(bbs15_company_rule_cd)']
  "tdmbak07_org_id" "numeric" [note: '제개정 소관부서ID']
  "tdmbak07_use_yn" "character varying(5)" [note: '사용여부']
  "tdmbak07_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak07_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]내규관리'
}

Table "public"."tdmbak08_manager_info" {
  "tdmbak08_id" "numeric" [pk, note: '[백업]책무관리자ID(PK)']
  "tdmbak08_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak08_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak08_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak08_manager_info_id" "numeric" [note: '책무관리자ID(PK)']
  "tdmbak08_company_id" "numeric" [note: '회사ID']
  "tdmbak08_manager_type" "character varying(2)" [note: '책무이행관리자구분(TdmManagerType-10:회사책무관리자/11:회사책무담당자/21:부서책무담당자)']
  "tdmbak08_org_id" "numeric" [note: '조직ID(회사책무관리자/담당자인 경우 null)']
  "tdmbak08_person_id" "numeric" [note: '사원ID']
  "tdmbak08_start_date" "date" [note: '적용시작일']
  "tdmbak08_end_date" "date" [note: '적용종료일']
  "tdmbak08_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak08_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무관리자'
}

Table "public"."tdmbak09_appr_step" {
  "tdmbak09_id" "numeric" [pk, note: '[백업]책무승인단계ID(PK)']
  "tdmbak09_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak09_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak09_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak09_appr_step_id" "numeric" [note: '책무승인단계ID(PK)']
  "tdmbak09_company_id" "numeric" [note: '회사ID']
  "tdmbak09_role_id" "numeric" [note: '직책ID']
  "tdmbak09_org_id" "numeric" [note: '부서ID']
  "tdmbak09_type_cd" "character varying(1)" [note: '분류구분(C:상위분류/T:하위분류)']
  "tdmbak09_parent_id" "numeric" [note: '상위분류ID']
  "tdmbak09_appr_seq" "character varying(2)" [note: '승인순서']
  "tdmbak09_appr_emp_id" "numeric" [note: '승인자ID']
  "tdmbak09_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak09_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무승인단계'
}

Table "public"."tdmbak10_task" {
  "tdmbak10_id" "numeric" [pk, note: '[백업]책무정보ID(PK)']
  "tdmbak10_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak10_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak10_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak10_task_id" "numeric" [note: '책무정보ID(PK)']
  "tdmbak10_company_id" "numeric" [note: '회사ID']
  "tdmbak10_task_class_cd" "character varying(1)" [note: '책무분류(TdmTaskClassCode - A:지정책임자, B:금융영업, C:경영관리)']
  "tdmbak10_task_type_cd" "character varying(3)" [note: '책무유형(tdm14_task_type_cd)']
  "tdmbak10_task_nm" "text" [note: '책무명']
  "tdmbak10_common_yn" "character varying(5)" [note: '공통책무여부']
  "tdmbak10_ceo_yn" "character varying(5)" [note: 'CEO책무여부']
  "tdmbak10_start_date" "date" [note: '사용시작일']
  "tdmbak10_end_date" "date" [note: '사용종료일']
  "tdmbak10_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak10_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무정보'
}

Table "public"."tdmbak11_task_relate_rule" {
  "tdmbak11_id" "numeric" [pk, note: '[백업]책무연결정보-규정(법규/내규)ID(PK)']
  "tdmbak11_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak11_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak11_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak11_task_relate_rule_id" "numeric" [note: '책무연결정보-규정(법규/내규)ID(PK)']
  "tdmbak11_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdmbak11_relate_type" "character varying(1)" [note: '규정연결구분(1:법규/2:내규)']
  "tdmbak11_rule_cd" "character varying(8)" [note: '규정코드(법규:TdmLawCode, 내규:bbs15_company_rule_cd)']
  "tdmbak11_seq" "numeric" [note: '조회순서']
  "tdmbak11_company_id" "numeric" [note: '회사ID']
  "tdmbak11_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak11_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무연결정보-규정(법규/내규)'
}

Table "public"."tdmbak12_task_relate_detail" {
  "tdmbak12_id" "numeric" [pk, note: '[백업]책무연결정보-세부내용ID(PK)']
  "tdmbak12_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak12_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak12_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak12_task_relate_detail_id" "numeric" [note: '책무연결정보-세부내용ID(PK)']
  "tdmbak12_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdmbak12_content" "text" [note: '내용']
  "tdmbak12_seq" "numeric" [note: '조회순서']
  "tdmbak12_use_yn" "character varying(5)" [note: '사용여부']
  "tdmbak12_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak12_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무연결정보-세부내용'
}

Table "public"."tdmbak13_task_relate_duty" {
  "tdmbak13_id" "numeric" [pk, note: '[백업]책무연결정보-관리의무ID(PK)']
  "tdmbak13_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak13_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak13_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak13_task_relate_duty_id" "numeric" [note: '책무연결정보-관리의무ID(PK)']
  "tdmbak13_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdmbak13_task_relate_detail_id" "numeric" [note: '책무ID(tdm12_task_relate_detail_id)']
  "tdmbak13_content" "text" [note: '내용']
  "tdmbak13_seq" "numeric" [note: '조회순서']
  "tdmbak13_use_yn" "character varying(5)" [note: '사용여부']
  "tdmbak13_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak13_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무연결정보-관리의무'
}

Table "public"."tdmbak14_task_type" {
  "tdmbak14_id" "numeric" [pk, note: '[백업]책무유형정의ID(PK)']
  "tdmbak14_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak14_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak14_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak14_task_type_id" "numeric" [note: '책무유형정의ID(PK)']
  "tdmbak14_company_id" "numeric" [note: '회사ID']
  "tdmbak14_task_type_cd" "character varying(3)" [note: '책무유형코드']
  "tdmbak14_task_type_nm" "character varying(50)" [note: '책무유형명']
  "tdmbak14_system_cd" "character varying(3)" [note: '책무유형코드(ADMIN)']
  "tdmbak14_use_yn" "character varying(5)" [note: '사용여부']
  "tdmbak14_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak14_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무유형정의'
}

Table "public"."tdmbak20_role" {
  "tdmbak20_id" "numeric" [pk, note: '[백업]직책정보ID(PK)']
  "tdmbak20_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak20_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak20_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak20_role_id" "numeric" [note: '직책정보ID(PK)']
  "tdmbak20_company_id" "numeric" [note: '회사ID']
  "tdmbak20_role_nm" "character varying(100)" [note: '직책명']
  "tdmbak20_role_type" "character varying(1)" [note: '직책그룹코드(TdmRoleType-A:이사회의장/B:이사회지원/C:대표이사/D:대표이사지원/E:기타그룹)']
  "tdmbak20_role_type_etc_nm" "character varying(50)" [note: '직책그룹기타코드명(직책그룹코드가 E인 경우만 해당)']
  "tdmbak20_overview" "text" [note: '개요']
  "tdmbak20_start_date" "date" [note: '사용시작일']
  "tdmbak20_end_date" "date" [note: '사용종료일']
  "tdmbak20_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak20_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak20_ceo_role_id" "numeric" [note: '보고CEO 직책ID(tdm20_role_id)']

  Note: '[백업]직책정보'
}

Table "public"."tdmbak21_role_relate_task" {
  "tdmbak21_id" "numeric" [pk, note: '[백업]직책연결정보-책무ID(PK)']
  "tdmbak21_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak21_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak21_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak21_role_relate_task_id" "numeric" [note: '직책연결정보-책무ID(PK)']
  "tdmbak21_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak21_task_id" "numeric" [note: '책무ID(tdm10_task_id)']

  Note: '[백업]직책연결정보-책무'
}

Table "public"."tdmbak22_role_relate_cncl" {
  "tdmbak22_id" "numeric" [pk, note: '[백업]직책연결정보-위원회ID(PK)']
  "tdmbak22_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak22_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak22_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak22_role_relate_cncl_id" "numeric" [note: '직책연결정보-위원회ID(PK)']
  "tdmbak22_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak22_cncl_id" "numeric" [note: '위원회ID(tdm05_cncl_id)']
  "tdmbak22_member_type" "character varying(2)" [note: '역할(TdmCnclMemberType-CM:위원장/MB:위원)']
  "tdmbak22_start_date" "date" [note: '적용시작일']
  "tdmbak22_end_date" "date" [note: '적용종료일']

  Note: '[백업]직책연결정보-위원회'
}

Table "public"."tdmbak23_role_relate_org" {
  "tdmbak23_id" "numeric" [pk, note: '[백업]직책연결정보-담당부서ID(PK)']
  "tdmbak23_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak23_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak23_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak23_role_relate_org_id" "numeric" [note: '직책연결정보-담당부서ID(PK)']
  "tdmbak23_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak23_org_id" "numeric" [note: '부서ID(org01_code_id)']

  Note: '[백업]직책연결정보-담당부서'
}

Table "public"."tdmbak30_role_allc" {
  "tdmbak30_id" "numeric" [pk, note: '[백업]직책(책무)배분ID(PK)']
  "tdmbak30_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak30_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak30_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak30_role_allc_id" "numeric" [note: '직책(책무)배분ID(PK)']
  "tdmbak30_company_id" "numeric" [note: '회사ID']
  "tdmbak30_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak30_person_id" "numeric" [note: '임원ID(tdm01_person_id)']
  "tdmbak30_add_title_yn" "character varying(5)" [note: '겸직여부']
  "tdmbak30_start_date" "date" [note: '직책부여일']
  "tdmbak30_end_date" "date" [note: '직책해제일']
  "tdmbak30_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak30_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]직책(책무)배분'
}

Table "public"."tdmbak31_role_desc" {
  "tdmbak31_id" "numeric" [pk, note: '[백업]임원별 직책(책무)기술서ID(PK)']
  "tdmbak31_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak31_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak31_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak31_role_desc_id" "numeric" [note: '임원별 직책(책무)기술서ID(PK)']
  "tdmbak31_company_id" "numeric" [note: '회사ID']
  "tdmbak31_reg_date" "date" [note: '등록일자']
  "tdmbak31_person_id" "numeric" [note: '사원(임원)ID']
  "tdmbak31_role_allc_id" "numeric" [note: '본직책(책무) 배분ID(tdm30_role_allc_id)']
  "tdmbak31_reason_cd" "character varying(3)" [note: '생성사유코드(TdmDescRegReason)']
  "tdmbak31_appr_id" "numeric" [note: '책무기술서 상신ID']
  "tdmbak31_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak31_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak31_lock_yn" "character varying(5)" [note: '잠금여부']
  "tdmbak31_allc_std_date" "date" [note: '책무배분기준일']
  "tdmbak31_work_date" "timestamp without time zone" [note: '(파일생성)작업일시']

  Note: '[백업]임원별 직책(책무)기술서'
}

Table "public"."tdmbak32_role_digm" {
  "tdmbak32_id" "numeric" [pk, note: '[백업]책무체계도ID(PK)']
  "tdmbak32_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak32_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak32_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak32_role_digm_id" "numeric" [note: '책무체계도ID(PK)']
  "tdmbak32_company_id" "numeric" [note: '회사ID']
  "tdmbak32_reg_date" "date" [note: '등록일자']
  "tdmbak32_reason_cd" "character varying(3)" [note: '생성사유코드(TdmDescRegReason)']
  "tdmbak32_use_file_type" "character varying(1)" [note: '최종사용파일구분(TdmUseFileType-1:시스템 생성파일/2:사용자 업로드파일)']
  "tdmbak32_appr_id" "numeric" [note: '책무체계도 상신ID']
  "tdmbak32_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak32_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak32_allc_std_date" "date" [note: '책무배분기준일']

  Note: '[백업]책무체계도'
}

Table "public"."tdmbak33_role_digm_file" {
  "tdmbak33_id" "numeric" [pk, note: '[백업]책무체계도_파일정보ID(PK)']
  "tdmbak33_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak33_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak33_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak33_role_digm_file_id" "numeric" [note: '책무체계도_파일정보ID(PK)']
  "tdmbak33_role_digm_id" "numeric" [note: '책무체계도ID(tdm32_role_digm_id)']
  "tdmbak33_file_type" "character varying(1)" [note: '파일구분(TdmUseFileType-1:시스템 생성파일/2:사용자 업로드파일)']

  Note: '[백업]책무체계도_파일정보'
}

Table "public"."tdmbak34_role_allc_detail" {
  "tdmbak34_id" "numeric" [pk, note: '[백업]직책(책무)배분-상세정보ID(PK)']
  "tdmbak34_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak34_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak34_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak34_role_allc_detail_id" "numeric" [note: '직책(책무)배분-상세정보ID(PK)']
  "tdmbak34_role_allc_id" "numeric" [note: '직책(책무)배분ID(tdm30_role_allc_id)']
  "tdmbak34_role_allc_date" "date" [note: '책무배분일(이사회결의일)']
  "tdmbak34_reg_reason" "text" [note: '등록사유']
  "tdmbak34_deputy_emp_nm" "character varying(50)" [note: '유고시 대체 임직원명']
  "tdmbak34_appr_id" "numeric" [note: '임원동의서 상신ID']
  "tdmbak34_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak34_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]직책(책무)배분-상세정보'
}

Table "public"."tdmbak35_role_allc_task" {
  "tdmbak35_id" "numeric" [pk, note: '[백업]직책(책무)배분-확정책무ID(PK)']
  "tdmbak35_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak35_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak35_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak35_role_allc_task_id" "numeric" [note: '직책(책무)배분-확정책무ID(PK)']
  "tdmbak35_role_allc_detail_id" "numeric" [note: '직책(책무)배분-상세정보ID(tdm34_role_allc_detail_id)']
  "tdmbak35_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdmbak35_task_nm" "text" [note: '책무명(tdm10_task_nm)']
  "tdmbak35_task_relate_detail_id" "numeric" [note: '책무세부ID(tdm12_task_relate_detail_id)']
  "tdmbak35_task_relate_detail_nm" "text" [note: '책무세부명(tdm12_content)']
  "tdmbak35_task_relate_detail_seq" "numeric" [note: '책무세부순번(tdm12_seq)']
  "tdmbak35_task_relate_duty_id" "numeric" [note: '관리의무ID(tdm13_task_relate_duty_id)']
  "tdmbak35_task_relate_duty_nm" "text" [note: '관리의무명(tdm13_content)']
  "tdmbak35_task_relate_duty_seq" "numeric" [note: '관리의무순번(tdm13_seq)']
  "tdmbak35_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak35_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]직책(책무)배분-확정책무'
}

Table "public"."tdmbak36_role_report" {
  "tdmbak36_id" "numeric" [pk, note: '[백업]책무구조도 제출ID(PK)']
  "tdmbak36_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak36_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak36_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak36_role_report_id" "numeric" [note: '책무구조도 제출 ID(PK)']
  "tdmbak36_company_id" "numeric" [note: '회사ID']
  "tdmbak36_report_date" "date" [note: '보고일자']
  "tdmbak36_board_open_date" "date" [note: '개최일자']
  "tdmbak36_board_open_loc" "character varying(100)" [note: '개최장소']
  "tdmbak36_board_open_agenda" "character varying(100)" [note: '안건']
  "tdmbak36_memb_tot_cnt" "numeric" [note: '이사회 총수 ']
  "tdmbak36_memb_attend_cnt" "numeric" [note: '이사회 참석자수']
  "tdmbak36_memb_yes_nm" "character varying(200)" [note: '찬성의견 이사']
  "tdmbak36_memb_nai_nm" "character varying(200)" [note: '반대의견 이사']
  "tdmbak36_rpt_cover_file_id" "numeric" [note: '업로드 File ID (표지)']
  "tdmbak36_rpt_overview_file_id" "numeric" [note: '업로드 File ID (개요)']
  "tdmbak36_rpt_ceo_cfrm_file_id" "numeric" [note: '업로드 File ID (대표이사 확인서 )']
  "tdmbak36_rpt_board_vote_file_id" "numeric" [note: '업로드 File ID (이사회 결의서 )']
  "tdmbak36_appr_id" "numeric" [note: '상신ID']
  "tdmbak36_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak36_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak36_allc_std_date" "date" [note: '책무배분기준일']

  Note: '[백업]책무구조도 제출'
}

Table "public"."tdmbak40_manl_job" {
  "tdmbak40_id" "numeric" [pk, note: '[백업]책무매뉴얼 작업ID(PK)']
  "tdmbak40_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak40_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak40_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak40_manl_job_id" "numeric" [note: '책무매뉴얼 작업ID(PK)']
  "tdmbak40_company_id" "numeric" [note: '회사ID']
  "tdmbak40_reg_date" "date" [note: '등록일']
  "tdmbak40_job_nm" "character varying(50)" [note: '매뉴얼작업명']
  "tdmbak40_role_id" "numeric" [note: '직책ID(작업조건1, null이면 전체직책)']
  "tdmbak40_org_id" "numeric" [note: '조직ID(작업조건2, null이면 전체조직)']
  "tdmbak40_job_reason" "character varying(100)" [note: '작업사유']
  "tdmbak40_start_date" "date" [note: '작성시작일']
  "tdmbak40_end_date" "date" [note: '작성마감일']
  "tdmbak40_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak40_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak40_allc_std_date" "date" [note: '책무배분기준일']
  "tdmbak40_manl_apply_start_date" "date" [note: '매뉴얼적용시작일']

  Note: '[백업]책무매뉴얼 작업'
}

Table "public"."tdmbak41_manl_duty" {
  "tdmbak41_id" "numeric" [pk, note: '[백업]책무매뉴얼 작업_관리의무ID(PK)']
  "tdmbak41_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak41_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak41_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak41_manl_duty_id" "numeric" [note: '책무매뉴얼 부서지정ID(PK)']
  "tdmbak41_manl_job_id" "numeric" [note: '책무매뉴얼 작업ID(tdm40_manl_job_id)']
  "tdmbak41_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak41_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdmbak41_task_relate_detail_id" "numeric" [note: '책무세부ID(tdm12_task_relate_detail_id)']
  "tdmbak41_task_relate_duty_id" "numeric" [note: '관리의무ID(tdm13_task_relate_duty_id)']
  "tdmbak41_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak41_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak41_company_id" "numeric" [note: '회사ID']

  Note: '[백업]책무매뉴얼 작업_관리의무'
}

Table "public"."tdmbak42_manl_org" {
  "tdmbak42_id" "numeric" [pk, note: '[백업]부서 책무매뉴얼ID(PK)']
  "tdmbak42_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak42_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak42_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak42_manl_org_id" "numeric" [note: '부서 책무매뉴얼ID(PK)']
  "tdmbak42_company_id" "numeric" [note: '회사ID']
  "tdmbak42_org_id" "numeric" [note: '조직ID']
  "tdmbak42_exct_id" "numeric" [note: '임원ID(emp01_person_id)']
  "tdmbak42_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak42_lock_yn" "character varying(5)" [note: '잠금여부']
  "tdmbak42_start_date" "date" [note: '적용시작일']
  "tdmbak42_end_date" "date" [note: '적용종료일']
  "tdmbak42_appr_id" "numeric" [note: '책무매뉴얼 상신ID']
  "tdmbak42_manl_job_id" "numeric" [note: '책무매뉴얼 작업ID(tdm40_manl_job_id)']
  "tdmbak42_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak42_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]부서 책무매뉴얼'
}

Table "public"."tdmbak43_manl" {
  "tdmbak43_id" "numeric" [pk, note: '[백업]책무매뉴얼 점검항목ID(PK)']
  "tdmbak43_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak43_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak43_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak43_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(PK)']
  "tdmbak43_manl_org_id" "numeric" [note: '부서 책무매뉴얼ID(tdm42_manl_org_id)']
  "tdmbak43_company_id" "numeric" [note: '회사ID']
  "tdmbak43_org_id" "numeric" [note: '조직ID']
  "tdmbak43_exct_id" "numeric" [note: '임원ID(emp01_person_id)']
  "tdmbak43_role_id" "numeric" [note: '직책ID(tdm20_role_id)']
  "tdmbak43_role_nm" "character varying(100)" [note: '직책명(tdm20_role_nm)']
  "tdmbak43_task_id" "numeric" [note: '책무ID(tdm10_task_id)']
  "tdmbak43_task_nm" "text" [note: '책무명(tdm10_task_nm)']
  "tdmbak43_task_relate_detail_id" "numeric" [note: '책무세부ID(tdm12_task_relate_detail_id)']
  "tdmbak43_task_relate_detail_nm" "text" [note: '책무세부명(tdm12_content)']
  "tdmbak43_task_relate_duty_id" "numeric" [note: '관리의무ID(tdm13_task_relate_duty_id)']
  "tdmbak43_task_relate_duty_nm" "text" [note: '관리의무명(tdm13_content)']
  "tdmbak43_check_item" "text" [note: '점검항목명']
  "tdmbak43_check_cycle_cd" "character varying(2)" [note: '점검주기코드(CycleCode004-03:월/04:분기/05:반기/06:연/98:특정월)']
  "tdmbak43_check_month" "character varying(12)" [note: '점검월(위치:월, 1:true/0:false)']
  "tdmbak43_check_evid_type" "character varying(2)" [note: '(사용X)증빙구분코드(TdmEvidType-10:대외문서/11:사내문서/20:교육수행내역/90:기타(직접입력)/99:미설정)']
  "tdmbak43_check_evid_etc" "character varying(100)" [note: '(사용X)증빙구분기타']
  "tdmbak43_check_how" "text" [note: '점검방법']
  "tdmbak43_ref_basis" "text" [note: '관련참고근거']
  "tdmbak43_start_date" "date" [note: '(개별)적용시작일']
  "tdmbak43_manl_duty_id" "numeric" [note: '책무매뉴얼작업 부서지정ID(tdm41_manl_duty_id)']
  "tdmbak43_first_reg_emp_id" "numeric" [note: '최초작성자']
  "tdmbak43_manl_cd" "character varying(10)" [note: '책무매뉴얼 점검항목 코드']
  "tdmbak43_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak43_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak43_check_evid_doc_nm" "text" [note: '증빙문서명']
  "tdmbak43_ceo_duty_cd" "character varying(2)" [note: '대표이사 총괄관리의무 코드(TdmCeoDutyCode)']
  "tdmbak43_exct_duty_cd" "character varying(2)" [note: '임원의 상당한 주의의무 코드(TdmExctDutyCode)']
  "tdmbak43_import_level_cd" "character varying(1)" [note: '중요도 코드(TdmImportLevelCode-1:상/2:중/3:하)']
  "tdmbak43_exct_duty_map" "character varying(6)" [note: '임원의 상당한 주의의무 (6항목 다중선택(TdmExctDutyCode, 1:true/0:false)']

  Note: '[백업]책무매뉴얼 점검항목'
}

Table "public"."tdmbak44_manl_duty_org" {
  "tdmbak44_id" "numeric" [pk, note: '[백업]책무매뉴얼 작업_부서지정ID(PK)']
  "tdmbak44_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak44_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak44_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak44_manl_duty_org_id" "numeric" [note: '책무매뉴얼 작업_부서지정ID(PK)']
  "tdmbak44_manl_duty_id" "numeric" [note: '책무매뉴얼 작업_관리의무ID(tdm41_manl_duty_id)']
  "tdmbak44_org_id" "numeric" [note: '조직ID']
  "tdmbak44_end_yn" "character varying(5)" [note: '작성완료여부']
  "tdmbak44_end_date" "date" [note: '작성완료일']
  "tdmbak44_end_emp_id" "numeric" [note: '작성자ID']
  "tdmbak44_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak44_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]책무매뉴얼 작업_부서지정'
}

Table "public"."tdmbak45_manl_relate_ics" {
  "tdmbak45_id" "numeric" [pk, note: '[백업]책무매뉴얼 점검항목 연결법규ID(PK)']
  "tdmbak45_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak45_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak45_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak45_manl_relate_ics_id" "numeric" [note: '책무매뉴얼 점검항목 연결법규ID(PK)']
  "tdmbak45_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdmbak45_ics_class_tree_id" "numeric" [note: '법규ID(ics01_class_tree_id)']

  Note: '[백업]책무매뉴얼 점검항목 연결법규'
}

Table "public"."tdmbak46_manl_relate_icr" {
  "tdmbak46_id" "numeric" [pk, note: '[백업]책무매뉴얼 점검항목 연결내규ID(PK)']
  "tdmbak46_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak46_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak46_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak46_manl_relate_icr_id" "numeric" [note: '책무매뉴얼 점검항목 연결내규ID(PK)']
  "tdmbak46_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdmbak46_icr_class_tree_id" "numeric" [note: '내규ID(icr01_class_tree_id)']

  Note: '[백업]책무매뉴얼 점검항목 연결내규'
}

Table "public"."tdmbak47_manl_relate_dcr" {
  "tdmbak47_id" "numeric" [pk, note: '[백업]책무매뉴얼 점검항목 연결문서분류ID(PK)']
  "tdmbak47_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak47_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak47_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak47_manl_relate_dcr_id" "numeric" [note: '책무매뉴얼 점검항목 연결문서분류ID(PK)']
  "tdmbak47_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdmbak47_dcr_class_tree_id" "numeric" [note: '문서분류ID(dcr01_class_tree_id)']

  Note: '[백업]책무매뉴얼 점검항목 연결문서분류'
}

Table "public"."tdmbak50_chck_job" {
  "tdmbak50_id" "numeric" [pk, note: '[백업]이행점검 작업ID(PK)']
  "tdmbak50_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak50_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak50_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak50_chck_job_id" "numeric" [note: '이행점검 작업ID(PK)']
  "tdmbak50_company_id" "numeric" [note: '회사ID']
  "tdmbak50_check_ym" "character varying(7)" [note: '점검년월(YYYY.MM)']
  "tdmbak50_check_nm" "character varying(100)" [note: '이행점검 작업명']
  "tdmbak50_start_date" "date" [note: '점검시작일']
  "tdmbak50_end_date" "date" [note: '점검마감일']
  "tdmbak50_end_yn" "character varying(5)" [note: '마감여부']
  "tdmbak50_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak50_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이행점검 작업'
}

Table "public"."tdmbak51_chck_org" {
  "tdmbak51_id" "numeric" [pk, note: '[백업]이행점검_부서점검현황ID(PK)']
  "tdmbak51_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak51_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak51_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak51_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(PK)']
  "tdmbak51_company_id" "numeric" [note: '회사ID']
  "tdmbak51_check_ym" "character varying(7)" [note: '점검년월(YYYY.MM)']
  "tdmbak51_role_id" "numeric" [note: '직책ID']
  "tdmbak51_exct_id" "numeric" [note: '임원ID']
  "tdmbak51_org_id" "numeric" [note: '부서ID']
  "tdmbak51_chck_job_id" "numeric" [note: '이행점검 작업ID(tdm50_chck_job_id)']
  "tdmbak51_manl_org_id" "numeric" [note: '부서책무매뉴얼ID(tdm42_manl_org_id)']
  "tdmbak51_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak51_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이행점검_부서점검현황'
}

Table "public"."tdmbak52_chck_manl" {
  "tdmbak52_id" "numeric" [pk, note: '[백업]이행점검ID(PK)']
  "tdmbak52_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak52_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak52_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak52_chck_manl_id" "numeric" [note: '이행점검ID(PK)']
  "tdmbak52_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(tdm51_chck_org_id)']
  "tdmbak52_manl_id" "numeric" [note: '책무매뉴얼 점검항목ID(tdm43_manl_id)']
  "tdmbak52_company_id" "numeric" [note: '회사ID']
  "tdmbak52_checker_id" "numeric" [note: '점검자ID']
  "tdmbak52_check_date" "date" [note: '점검일']
  "tdmbak52_check_result_cd" "character varying(1)" [note: '점검결과코드(TdmCheckResult0001-1:적정/2:미흡/9:해당없음)']
  "tdmbak52_check_cmnt" "text" [note: '점검의견']
  "tdmbak52_check_status_cd" "character varying(2)" [note: '점검상태(TdmCheckStatus-10:점검대기/11:점검진행/19:점검완료/20:승인요청/21:승인진행/25:승인완료/26:승인반려)']
  "tdmbak52_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak52_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이행점검'
}

Table "public"."tdmbak53_chck_exct" {
  "tdmbak53_id" "numeric" [pk, note: '[백업]이행점검_임원승인현황ID(PK)']
  "tdmbak53_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak53_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak53_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak53_chck_exct_id" "numeric" [note: '이행점검_임원승인현황ID(PK)']
  "tdmbak53_company_id" "numeric" [note: '회사ID']
  "tdmbak53_check_ym" "character varying(7)" [note: '점검년월(YYYY.MM)']
  "tdmbak53_role_id" "numeric" [note: '직책ID']
  "tdmbak53_exct_id" "numeric" [note: '임원ID']
  "tdmbak53_exct_appr_yn" "character varying(5)" [note: '임원승인 완료여부']
  "tdmbak53_lock_yn" "character varying(5)" [note: '잠금여부']
  "tdmbak53_chck_job_id" "numeric" [note: '이행점검 작업ID(tdm50_chck_job_id)']
  "tdmbak53_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak53_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이행점검_임원승인현황'
}

Table "public"."tdmbak54_chck_insuff" {
  "tdmbak54_id" "numeric" [pk, note: '[백업]미흡/개선 내역ID(PK)']
  "tdmbak54_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak54_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak54_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak54_chck_insuff_id" "numeric" [note: '미흡/개선 내역ID(PK)']
  "tdmbak54_company_id" "numeric" [note: '회사ID']
  "tdmbak54_role_id" "numeric" [note: '직책ID']
  "tdmbak54_org_id" "numeric" [note: '부서ID']
  "tdmbak54_reg_date" "date" [note: '등록일']
  "tdmbak54_due_date" "date" [note: '조치완료예정일']
  "tdmbak54_plan_action_emp_id" "numeric" [note: '조치예정자ID']
  "tdmbak54_action_nm" "text" [note: '조치명']
  "tdmbak54_action_plan" "text" [note: '조치계획']
  "tdmbak54_plan_reg_emp_id" "numeric" [note: '조치계획 등록자ID']
  "tdmbak54_action_emp_id" "numeric" [note: '조치자ID']
  "tdmbak54_action_cmnt" "text" [note: '조치결과의견']
  "tdmbak54_action_date" "date" [note: '조치완료일']
  "tdmbak54_status_cd" "character varying(2)" [note: '미흡/개선 상태(TdmInsuffStatus-10:발생/11:조치중/19:조치완료/20:승인요청/21:승인중/25:승인완료/26:승인반려)']
  "tdmbak54_chck_manl_id" "numeric" [note: '이행점검ID(tdm52_chck_manl_id)']
  "tdmbak54_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak54_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]미흡/개선 내역'
}

Table "public"."tdmbak55_chck_record" {
  "tdmbak55_id" "numeric" [pk, note: '[백업]이행점검 기록ID(PK)']
  "tdmbak55_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak55_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak55_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak55_chck_record_id" "numeric" [note: '이행점검 기록ID(PK)']
  "tdmbak55_relate_table_id" "numeric" [note: '연결TableID']
  "tdmbak55_relate_table" "character varying(5)" [note: '연결Table(tdm52, tdm54, tdm59)']
  "tdmbak55_proc_type" "character varying(10)" [note: '처리구분(tdm52:점검시작/점검완료/승인요청/승인진행/승인완료, tdm54,59:요청/승인/반려)']
  "tdmbak55_person_id" "numeric" [note: '처리자(점검자/승인자)']
  "tdmbak55_person_info" "text" [note: '처리자정보(처리자 직위(부서))']
  "tdmbak55_proc_result" "character varying(10)" [note: '처리결과(tdm52:적정/미흡/개선/해당없음, tdm54,59:승인/반려)']
  "tdmbak55_result_cmnt" "text" [note: '점검의견/승인(반려)의견']
  "tdmbak55_report_cmnt" "text" [note: '종합보고의견']
  "tdmbak55_upd_date" "timestamp without time zone" [note: '처리일시']

  Note: '[백업]이행점검 기록'
}

Table "public"."tdmbak56_chck_relate_appr" {
  "tdmbak56_id" "numeric" [pk, note: '[백업]이행점검 연결 상신문서(임원책무 이행점검 보고)ID(PK)']
  "tdmbak56_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak56_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak56_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak56_chck_relate_appr_id" "numeric" [note: '이행점검 연결 상신문서ID(PK)']
  "tdmbak56_relate_table_id" "numeric" [note: '연결TableID(tdm50_chck_job_id, tdm57_ceo_report_id)']
  "tdmbak56_appr_id" "numeric" [note: '이행점검']
  "tdmbak56_appr_date" "timestamp without time zone" [note: '이행점검']
  "tdmbak56_ceo_role_id" "numeric" [note: '보고CEO 직책ID(tdm20_role_id)']

  Note: '[백업]이행점검 연결 상신문서(임원책무 이행점검 보고)'
}

Table "public"."tdmbak57_chck_ceo_report" {
  "tdmbak57_id" "numeric" [pk, note: '[백업]대표이사 총괄관리의무 이행점검 보고ID(PK)']
  "tdmbak57_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak57_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak57_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak57_chck_ceo_report_id" "numeric" [note: '대표이사 총괄관리의무 이행점검 보고ID(PK)']
  "tdmbak57_company_id" "numeric" [note: '회사ID']
  "tdmbak57_start_std_ym" "character varying(7)" [note: '점검시작 기준년월']
  "tdmbak57_end_std_ym" "character varying(7)" [note: '점검종료 기준년월']
  "tdmbak57_ceo_cmnt" "text" [note: '대표이사 종합의견']
  "tdmbak57_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak57_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak57_ceo_role_id" "numeric" [note: '보고CEO 직책ID(tdm20_role_id)']

  Note: '[백업]대표이사 총괄관리의무 이행점검 보고'
}

Table "public"."tdmbak58_chck_appr_step" {
  "tdmbak58_id" "numeric" [pk, note: '[백업]이행점검_부서승인단계설정ID(PK)']
  "tdmbak58_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak58_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak58_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak58_chck_appr_step_id" "numeric" [note: '이행점검_승인단계ID(PK)']
  "tdmbak58_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(tdm51_chck_org_id)']
  "tdmbak58_appr_seq" "character varying(2)" [note: '승인순서']
  "tdmbak58_appr_emp_id" "numeric" [note: '승인자ID']
  "tdmbak58_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak58_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이행점검_부서승인단계설정'
}

Table "public"."tdmbak59_chck_appr_cmnt" {
  "tdmbak59_id" "numeric" [pk, note: '[백업]이행점검_종합의견ID(PK)']
  "tdmbak59_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak59_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak59_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak59_chck_appr_cmnt_id" "numeric" [note: '이행점검_종합의견ID(PK)']
  "tdmbak59_chck_exct_id" "numeric" [note: '이행점검_임원승인현황ID(tdm53_chck_exct_id)']
  "tdmbak59_appr_org_id" "numeric" [note: '승인부서ID']
  "tdmbak59_appr_emp_id" "numeric" [note: '승인자ID']
  "tdmbak59_cmnt_type" "character varying(4)" [note: '의견구분(SELF:자기조직 종합의견, SUB:하위조직별 의견)']
  "tdmbak59_parent_org_id" "numeric" [note: '상위조직ID']
  "tdmbak59_child_org_id" "numeric" [note: '하위조직ID']
  "tdmbak59_appr_status_cd" "character varying(2)" [note: '승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)']
  "tdmbak59_appr_cmnt" "text" [note: '승인의견']
  "tdmbak59_report_cmnt" "text" [note: '보고의견(종합의견)']
  "tdmbak59_submit_yn" "character varying(5)" [note: '제출여부']
  "tdmbak59_submit_date" "timestamp without time zone" [note: '제출일시']

  Note: '[백업]이행점검_종합의견'
}

Table "public"."tdmbak60_chck_manl_appr" {
  "tdmbak60_id" "numeric" [pk, note: '[백업]이행점검_승인ID(PK)']
  "tdmbak60_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak60_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak60_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak60_chck_manl_appr_id" "numeric" [note: '이행점검_승인ID(PK)']
  "tdmbak60_chck_manl_id" "numeric" [note: '이행점검ID(tdm52_chck_manl_id)']
  "tdmbak60_appr_seq" "character varying(2)" [note: '승인순서']
  "tdmbak60_appr_org_id" "numeric" [note: '승인부서ID']
  "tdmbak60_appr_emp_id" "numeric" [note: '승인자ID']
  "tdmbak60_appr_status_cd" "character varying(2)" [note: '승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)']
  "tdmbak60_appr_cmnt" "text" [note: '승인의견']
  "tdmbak60_appr_date" "timestamp without time zone" [note: '승인일시']

  Note: '[백업]이행점검_승인'
}

Table "public"."tdmbak61_chck_insuff_appr" {
  "tdmbak61_id" "numeric" [pk, note: '[백업]미흡/개선 내역 승인ID(PK)']
  "tdmbak61_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak61_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak61_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak61_chck_insuff_appr_id" "numeric" [note: '미흡/개선 내역 승인ID(PK)']
  "tdmbak61_chck_insuff_id" "numeric" [note: '미흡/개선 내역ID(tdm54_chck_insuff_id)']
  "tdmbak61_step_type" "character varying(1)" [note: '단계구분(TdmInsuffStepType-1:발생(사용안함.이행점검승인(tdm60) 사용)/2:조치)']
  "tdmbak61_appr_seq" "character varying(2)" [note: '승인순서']
  "tdmbak61_appr_org_id" "numeric" [note: '승인부서ID']
  "tdmbak61_appr_emp_id" "numeric" [note: '승인자ID']
  "tdmbak61_appr_status_cd" "character varying(2)" [note: '승인상태(AprStepStatusCode-10:대기/20:승인/30:반려)']
  "tdmbak61_appr_cmnt" "text" [note: '승인의견']
  "tdmbak61_appr_date" "timestamp without time zone" [note: '승인일시']
  "tdmbak61_chck_org_id" "numeric" [note: '이행점검_부서점검현황ID(tdm51_chck_org_id)']

  Note: '[백업]미흡/개선 내역 승인'
}

Table "public"."tdmbak62_chck_cmnt_relate_org" {
  "tdmbak62_id" "numeric" [pk, note: '[백업]이행점검_종합의견 연결 부서점검현황ID(PK)']
  "tdmbak62_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak62_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak62_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak62_chck_cmnt_relate_org_id" "numeric" [note: '이행점검_종합의견 연결 부서점검현황ID(PK)']
  "tdmbak62_chck_appr_cmnt_id" "numeric" [note: '종합의견ID(tdm59_chck_appr_cmnt_id)']
  "tdmbak62_chck_org_id" "numeric" [note: '부서점검현황ID(tdm51_chck_org_id)']

  Note: '[백업]이행점검_종합의견 연결 부서점검현황'
}

Table "public"."tdmbak63_chck_insuff_record" {
  "tdmbak63_id" "numeric" [pk, note: '[백업]미흡/개선 조치기록ID(PK)']
  "tdmbak63_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak63_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak63_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak63_chck_insuff_record_id" "numeric" [note: '미흡/개선 조치기록ID(PK)']
  "tdmbak63_chck_insuff_id" "numeric" [note: '미흡/개선 내역ID(tdm54_chck_insuff_id)']
  "tdmbak63_reg_date" "date" [note: '등록일(조치일)']
  "tdmbak63_reg_emp_id" "numeric" [note: '등록자ID']
  "tdmbak63_content" "text" [note: '조치내용']
  "tdmbak63_note" "text" [note: '비고']
  "tdmbak63_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak63_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]미흡/개선 조치기록'
}

Table "public"."tdmbak64_chck_evid_extr" {
  "tdmbak64_id" "numeric" [pk, note: '[백업]이행점검_증빙자료(외부시스템 문서정보)ID(PK)']
  "tdmbak64_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak64_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak64_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak64_chck_evid_extr_id" "numeric" [note: '이행점검_증빙자료(외부시스템 문서정보)ID(PK)']
  "tdmbak64_target_id" "numeric" [note: '대상ID(tdm52_chck_manl_id, tdm63_chck_insuff_record_id)']
  "tdmbak64_system_nm" "character varying(100)" [note: '외부시스템명']
  "tdmbak64_doc_no" "character varying(50)" [note: '문서번호']
  "tdmbak64_doc_nm" "character varying(200)" [note: '문서명']
  "tdmbak64_doc_date" "date" [note: '문서작성일자']
  "tdmbak64_doc_url" "text" [note: '문서연결URL']
  "tdmbak64_note" "text" [note: '비고']
  "tdmbak64_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak64_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '[백업]이행점검_증빙자료(외부시스템 문서정보)'
}

Table "public"."tdmbak91_company_setup" {
  "tdmbak91_id" "numeric" [pk, note: '[백업]책무사용 기본설정ID(PK)']
  "tdmbak91_dml_type" "character varying(10)" [note: '데이터조작구분(UPDATE/DELETE)']
  "tdmbak91_dml_user_nm" "character varying(50)" [note: '데이터조작자']
  "tdmbak91_dml_date" "timestamp without time zone" [note: '데이터조작일시']
  "tdmbak91_company_setup_id" "numeric" [note: '책무사용 기본설정ID(PK)']
  "tdmbak91_company_id" "numeric" [note: '회사ID']
  "tdmbak91_start_date" "date" [note: '적용시작일']
  "tdmbak91_cmnt_min_limit" "numeric" [note: '의견입력 최소 글자수']
  "tdmbak91_batch_appr_use_yn" "character varying(5)" [note: '일괄승인 사용여부']
  "tdmbak91_evid_file_check_yn" "character varying(5)" [note: '증빙파일 필수등록 체크여부']
  "tdmbak91_note" "text" [note: '비고']
  "tdmbak91_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "tdmbak91_upd_date" "timestamp without time zone" [note: '등록(변경)일시']
  "tdmbak91_batch_check_use_yn" "character varying(5)" [note: '일괄점검 사용여부']

  Note: '[백업]책무사용 기본설정'
}

```
