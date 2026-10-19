# 테이블: act

17개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `act01_account_code` | 계정코드 | 17 |
| `act01_account_code_fss` |  | 12 |
| `act02_journal` | 분개장 | 17 |
| `act03_journal_dtl` | 분개장-분개상세 | 13 |
| `act04_gen_ledger` | 계정원장 | 12 |
| `act05_gen_ledger_close` | 계정원장(결산마감)-월말기준 | 13 |
| `act06_journal_tmp` | 임시분개장 | 11 |
| `act07_gen_ledger_closetmp` | 계정원장(가결산-결산전 재무제표 조회용)-월말기준 | 13 |
| `act08_journal_upload` | 분개장-업로드자료 | 12 |
| `act09_account_num` | 결산회기관리 | 6 |
| `act10_repr_account` | 대표계정코드 | 7 |
| `act11_tr_map` | 거래맵핑 | 8 |
| `act12_journal_map` | 분개맵핑 | 10 |
| `act13_real_account_map` | 실계정맵핑 | 6 |
| `act14_link` | 이익제공 계정코드 연결 | 5 |
| `act15_close_check` | 마감검증 체크항목별 사용여부 | 15 |
| `act80_relate_appr` | 상신문서 연결 | 4 |

## DBML

```dbml
Table "public"."act01_account_code" {
  "act01_account_code_id" "numeric" [pk, note: '계정코드ID(PK)']
  "act01_company_id" "numeric" [not null, note: '회사ID']
  "act01_account_cd" "character varying(20)" [not null, note: '계정코드']
  "act01_account_nm" "character varying(200)" [not null, note: '계정명']
  "act01_account_nm2" "character varying(200)" [note: '계정명2(보고서용)']
  "act01_account_enm" "character varying(200)" [note: '계정영문명']
  "act01_parent_cd" "character varying(20)" [note: '상위계정코드']
  "act01_attribute_cd" "character varying(1)" [note: '계정속성코드(AccountAttributeCode)']
  "act01_drcr_type" "character varying(1)" [note: '차대구분(DrcrType)']
  "act01_slip_yn" "character varying(5)" [note: '전표생성여부']
  "act01_use_yn" "character varying(5)" [note: '사용여부']
  "act01_content" "text" [note: '내용']
  "act01_fss_yn" "character varying(5)" [note: '금감원보고코드여부']
  "act01_fss_account_nm" "character varying(200)" [note: '금감원계정명']
  "act01_fss_slip_yn" "character varying(5)" [note: '금감원기준 전표생성여부']
  "act01_print_yn" "character varying(5)" [note: '출력여부']
  "act01_print_seq" "character varying(20)" [note: '출력순서']

  indexes {
    (act01_company_id, act01_account_cd) [name: 'act01_account_code_idx01']
    (act01_company_id, act01_print_seq, act01_account_cd) [name: 'act01_account_code_idx02']
  }

  Note: '계정코드'
}

Table "public"."act01_account_code_fss" {
  "act01_account_code_fss_id" "numeric" [pk]
  "act01_company_id" "numeric" [not null]
  "act01_account_cd" "character varying(20)" [not null]
  "act01_account_nm" "character varying(200)" [not null]
  "act01_account_nm2" "character varying(200)"
  "act01_account_enm" "character varying(200)"
  "act01_parent_cd" "character varying(20)"
  "act01_attribute_cd" "character varying(1)"
  "act01_drcr_type" "character varying(1)"
  "act01_slip_yn" "character varying(5)"
  "act01_use_yn" "character varying(5)"
  "act01_content" "text"
}

Table "public"."act02_journal" {
  "act02_journal_id" "numeric" [pk, note: '분개장ID(PK)']
  "act02_company_id" "numeric" [not null, note: '회사ID']
  "act02_person_id" "numeric" [not null, note: '등록사원ID']
  "act02_date" "date" [not null, note: '분개일자']
  "act02_note" "character varying(500)" [note: '비고']
  "act02_close_yn" "character varying(5)" [note: '결산여부']
  "act02_corp_id" "numeric" [note: '거래처ID']
  "act02_tr_id" "numeric" [note: '거래ID(ast06_tr_id, ast07_settle_id)']
  "act02_biz_id" "numeric" [note: '이익제공ID(biz01_promo_id)']
  "act02_bmt_id" "numeric" [note: '물품구매내역ID(bmt01_buy_id)']
  "act02_pay_month_cd" "character varying(2)" [note: '월급여지급구분(PayMonthCode)']
  "act02_cur_cd" "character varying(3)" [note: '통화코드']
  "act02_journal_no" "numeric" [note: '분개장번호(전표번호)']
  "act02_retire_id" "numeric" [note: '퇴직정산서ID(pay07_retire_id)']
  "act02_fix_yn" "character varying(5)" [note: '분개확정여부']
  "act02_fix_person_nm" "character varying(50)" [note: '분개확정자명']
  "act02_fix_date" "timestamp without time zone" [note: '분개확정일시']

  indexes {
    (act02_company_id, act02_date) [name: 'act02_journal_idx01']
    (act02_tr_id) [name: 'act02_journal_idx02']
    (act02_biz_id) [name: 'act02_journal_idx03']
  }

  Note: '분개장'
}

Table "public"."act03_journal_dtl" {
  "act03_journal_dtl_id" "numeric" [pk, note: '분개장 상세ID(PK)']
  "act03_journal_id" "numeric" [not null, note: '분개장ID']
  "act03_seq" "numeric" [not null, note: '순번']
  "act03_dr_account_cd" "character varying(20)" [note: '차변 계정코드']
  "act03_dr_amt" "numeric" [default: `0`, note: '차변 금액']
  "act03_cr_account_cd" "character varying(20)" [note: '대변 계정코드']
  "act03_cr_amt" "numeric" [default: `0`, note: '대변 금액']
  "act03_dr_ast_id" "numeric" [note: '차변 자산ID(관리계좌)']
  "act03_cr_ast_id" "numeric" [note: '대변 자산ID(관리계좌)']
  "act03_dr_note" "character varying(100)" [note: '차변 비고']
  "act03_cr_note" "character varying(100)" [note: '대변 비고']
  "act03_dr_for_amt" "numeric" [note: '차변 외화금액']
  "act03_cr_for_amt" "numeric" [note: '대변 외화금액']

  indexes {
    (act03_journal_id) [name: 'act03_journal_dtl_idx01']
  }

  Note: '분개장-분개상세'
}

Table "public"."act04_gen_ledger" {
  "act04_gen_ledger_id" "numeric" [pk, note: '계정원장ID(PK)']
  "act04_company_id" "numeric" [not null, note: '회사ID']
  "act04_std_date" "date" [not null, note: '기준일자']
  "act04_account_cd" "character varying(20)" [note: '계정코드']
  "act04_dr_today_bal_amt" "numeric" [default: `0`, note: '차변당일잔액']
  "act04_dr_today_diff_amt" "numeric" [default: `0`, note: '차변당일증감액']
  "act04_dr_preday_bal_amt" "numeric" [default: `0`, note: '차변전일잔액']
  "act04_cr_today_bal_amt" "numeric" [default: `0`, note: '대변당일잔액']
  "act04_cr_today_diff_amt" "numeric" [default: `0`, note: '대변당일증감액']
  "act04_cr_preday_bal_amt" "numeric" [default: `0`, note: '대변전일잔액']
  "act04_insert_date" "timestamp without time zone" [note: '생성일시']
  "act04_ast_class_tree_id" "numeric" [note: '관리계좌ID(ast01_class_tree_id)']

  indexes {
    (act04_company_id, act04_std_date) [name: 'act04_gen_ledger_idx01']
    (act04_company_id, act04_std_date, act04_account_cd) [name: 'act04_gen_ledger_idx02']
  }

  Note: '계정원장'
}

Table "public"."act05_gen_ledger_close" {
  "act05_gen_ledger_close_id" "numeric" [pk, note: '계정원장(결산마감)ID(PK)']
  "act05_gen_ledger_id" "numeric" [not null, note: '계정원장ID(act04_gen_ledger_id)']
  "act05_company_id" "numeric" [not null, note: '회사ID']
  "act05_std_date" "date" [not null, note: '기준일자']
  "act05_account_cd" "character varying(20)" [note: '계정코드']
  "act05_dr_today_bal_amt" "numeric" [default: `0`, note: '차변당일잔액']
  "act05_dr_today_diff_amt" "numeric" [default: `0`, note: '차변당일증감액']
  "act05_dr_preday_bal_amt" "numeric" [default: `0`, note: '차변전일잔액']
  "act05_cr_today_bal_amt" "numeric" [default: `0`, note: '대변당일잔액']
  "act05_cr_today_diff_amt" "numeric" [default: `0`, note: '대변당일증감액']
  "act05_cr_preday_bal_amt" "numeric" [default: `0`, note: '대변전일잔액']
  "act05_insert_date" "timestamp without time zone" [note: '생성일시']
  "act05_ast_class_tree_id" "numeric" [note: '관리계좌ID(ast01_class_tree_id)']

  indexes {
    (act05_company_id, act05_std_date) [name: 'act05_gen_ledger_close_idx01']
    (act05_company_id, act05_std_date, act05_account_cd) [name: 'act05_gen_ledger_close_idx02']
    (act05_gen_ledger_id) [name: 'act05_gen_ledger_close_idx03']
  }

  Note: '계정원장(결산마감)-월말기준'
}

Table "public"."act06_journal_tmp" {
  "act06_journal_tmp_id" "numeric" [pk, note: '임시분개장ID(PK)']
  "act06_journal_id" "numeric" [not null, note: '분개장ID']
  "act06_seq" "numeric" [note: '순번']
  "act06_repr_account_cd" "character varying(4)" [note: '대표계정코드']
  "act06_real_account_cd" "character varying(20)" [note: '실계정코드']
  "act06_drcr_type" "character varying(1)" [note: '차대구분']
  "act06_amt" "numeric" [note: '금액']
  "act06_deposit_id" "numeric" [note: '예금관리계정ID(ast01_class_tree_id)']
  "act06_note" "character varying(200)" [note: '비고']
  "act06_account_map" "character varying(10)" [note: '계정맵핑ID(act13_account_map)']
  "act06_for_amt" "numeric" [note: '외화금액']

  indexes {
    (act06_journal_id) [name: 'act06_journal_tmp_idx01']
  }

  Note: '임시분개장'
}

Table "public"."act07_gen_ledger_closetmp" {
  "act07_gen_ledger_closetmp_id" "numeric" [pk, note: '계정원장(가결산)ID(PK)']
  "act07_gen_ledger_id" "numeric" [note: '계정원장ID(act04_gen_ledger_id)']
  "act07_company_id" "numeric" [note: '회사ID']
  "act07_std_date" "date" [note: '기준일자']
  "act07_account_cd" "character varying(20)" [note: '계정코드']
  "act07_dr_today_bal_amt" "numeric" [note: '차변당일금액']
  "act07_dr_today_diff_amt" "numeric" [note: '차변당일증감액']
  "act07_dr_preday_bal_amt" "numeric" [note: '차변전일잔액']
  "act07_cr_today_bal_amt" "numeric" [note: '대변당일잔액']
  "act07_cr_today_diff_amt" "numeric" [note: '대변당일증감액']
  "act07_cr_preday_bal_amt" "numeric" [note: '대변전일잔액']
  "act07_insert_date" "timestamp without time zone" [note: '생성일시']
  "act07_ast_class_tree_id" "numeric" [note: '관리계좌ID(ast01_class_tree_id)']

  indexes {
    (act07_company_id, act07_std_date) [name: 'act07_gen_ledger_closetmp_idx01']
  }

  Note: '계정원장(가결산-결산전 재무제표 조회용)-월말기준'
}

Table "public"."act08_journal_upload" {
  "act08_journal_upload_id" "numeric" [pk, note: '분개장-업로드자료ID(PK)']
  "act08_company_id" "numeric" [note: '회사ID']
  "act08_date" "date" [note: '분개일자']
  "act08_journal_no" "character varying(10)" [note: '분개장번호(전표번호)']
  "act08_account_cd" "text" [note: '계정과목코드']
  "act08_account_nm" "text" [note: '계정과목명']
  "act08_dr_amt" "numeric" [note: '차변금액']
  "act08_cr_amt" "numeric" [note: '대변금액']
  "act08_account_note" "text" [note: '계정별 적요(거래처)']
  "act08_note" "text" [note: '적요']
  "act08_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "act08_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (act08_company_id, act08_date, act08_journal_no) [name: 'act08_journal_upload_idx01']
  }

  Note: '분개장-업로드자료'
}

Table "public"."act09_account_num" {
  "act09_account_num_id" "numeric" [pk, note: '결산회기관리ID(PK)']
  "act09_company_id" "numeric" [note: '회사ID']
  "act09_num" "numeric" [note: '회기']
  "act09_start_date" "date" [note: '회기시작일']
  "act09_close_date" "date" [note: '회기종료일']
  "act09_note" "character varying(200)" [note: '비고']

  indexes {
    (act09_company_id) [name: 'act09_account_num_idx01']
  }

  Note: '결산회기관리'
}

Table "public"."act10_repr_account" {
  "act10_repr_account_id" "numeric" [pk, note: '대표계정코드ID(PK)']
  "act10_company_id" "numeric" [not null, note: '회사ID']
  "act10_repr_account_cd" "character varying(4)" [not null, note: '대표계정코드']
  "act10_repr_account_nm" "character varying(50)" [not null, note: '대표계정명']
  "act10_attribute_cd" "character varying(1)" [not null, note: '계정속성코드']
  "act10_tgt_repr_account_cd" "character varying(4)" [note: '상대 대표계정코드']
  "act10_note" "character varying(200)" [note: '비고']

  indexes {
    (act10_company_id, act10_repr_account_cd) [name: 'act10_repr_account_idx01']
  }

  Note: '대표계정코드'
}

Table "public"."act11_tr_map" {
  "act11_tr_map_id" "numeric" [pk, note: '거래맵핑ID(PK)']
  "act11_company_id" "numeric" [not null, note: '회사ID']
  "act11_tr_cd" "character varying(4)" [not null, note: '거래코드']
  "act11_journal_group" "character varying(6)" [note: '분개그룹코드']
  "act11_use_yn" "character varying(5)" [note: '사용여부']
  "act11_note" "character varying(100)" [note: '비고']
  "act11_book_io_type" "character varying(1)" [note: '원장 입출고 구분(BookInOutType)']
  "act11_pl_repr_account_cd" "character varying(4)" [note: '손익대표계정코드']

  indexes {
    (act11_company_id, act11_tr_cd) [name: 'act11_tr_map_idx01']
  }

  Note: '거래맵핑'
}

Table "public"."act12_journal_map" {
  "act12_journal_map_id" "numeric" [pk, note: '분개맵핑ID(PK)']
  "act12_company_id" "numeric" [not null, note: '회사ID']
  "act12_journal_group" "character varying(6)" [not null, note: '분개그룹코드']
  "act12_seq" "numeric" [not null, note: '순번']
  "act12_repr_account_cd" "character varying(4)" [note: '대표계정코드']
  "act12_drcr_type" "character varying(1)" [note: '차대구분']
  "act12_use_yn" "character varying(5)" [note: '사용여부']
  "act12_note" "character varying(100)" [note: '비고']
  "act12_formula" "character varying(100)" [note: '계산식']
  "act12_for_formula" "character varying(100)" [note: '외화 계산식']

  indexes {
    (act12_company_id, act12_journal_group) [name: 'act12_journal_map_idx01']
  }

  Note: '분개맵핑'
}

Table "public"."act13_real_account_map" {
  "act13_real_account_map_id" "numeric" [pk, note: '실계정맵핑ID(PK)']
  "act13_company_id" "numeric" [not null, note: '회사ID']
  "act13_repr_account_cd" "character varying(4)" [not null, note: '대표계정코드']
  "act13_account_map" "character varying(10)" [note: '계정맵핑ID(조합코드)']
  "act13_real_account_cd" "character varying(20)" [note: '실계정코드']
  "act13_note" "character varying(100)" [note: '비고']

  indexes {
    (act13_company_id, act13_repr_account_cd, act13_account_map) [name: 'act13_real_account_map_idx01']
    (act13_company_id, act13_real_account_cd) [name: 'act13_real_account_map_idx02']
  }

  Note: '실계정맵핑'
}

Table "public"."act14_link" {
  "act14_link_id" "numeric" [pk, note: '계정코드 연결정보ID(PK)']
  "act14_company_id" "numeric" [note: '회사ID']
  "act14_account_cd" "character varying(20)" [note: '계정코드']
  "act14_provide_content_cd" "character varying(4)" [note: '제공(수령)내용코드(ProvideContentCode(1001:식사/..))']
  "act14_seq" "numeric" [note: '조회순서']

  Note: '이익제공 계정코드 연결'
}

Table "public"."act15_close_check" {
  "act15_close_check_id" "numeric" [pk, note: '마감검증 체크항목별 사용여부ID(PK)']
  "act15_company_id" "numeric" [note: '회사ID']
  "act15_deposit_real_match_yn" "character varying(5)" [note: '예금원장 vs 실예금잔고 대사']
  "act15_deposit_appr_yn" "character varying(5)" [note: '예금대사 결과보고 상신문서 결재완료 체크']
  "act15_deposit_ledger_match_yn" "character varying(5)" [note: '예금원장 vs 계정원장(예금계정) 대사']
  "act15_finance_eval_yn" "character varying(5)" [note: '금융자산 평가체크']
  "act15_finance_ledger_match_yn" "character varying(5)" [note: '금융상품 원장대사 (보유원장 vs 계정원장)']
  "act15_fx_eval_yn" "character varying(5)" [note: '환평가 체크']
  "act15_depn_yn" "character varying(5)" [note: '감가상각 체크']
  "act15_tangible_match_yn" "character varying(5)" [note: '유형자산 원장대사 (잔여상각액 vs 유형자산 상위집계계정)']
  "act15_intangible_match_yn" "character varying(5)" [note: '무형자산 원장대사 (잔여상각액 vs 계정원장)']
  "act15_fund_fee_match_yn" "character varying(5)" [note: '펀드보수 대사 (ICAM vs AssetERP)']
  "act15_fund_fee_eval_yn" "character varying(5)" [note: '펀드보수 결산처리여부 체크']
  "act15_unfix_yn" "character varying(5)" [note: '미승인 전표여부 체크']
  "act15_supply_match_yn" "character varying(5)" [note: '소모품(비품) 원장대사 (계정원장 vs 비품대장(당기건만))']

  indexes {
    (act15_company_id) [name: 'act15_close_check_idx01']
  }

  Note: '마감검증 체크항목별 사용여부'
}

Table "public"."act80_relate_appr" {
  "act80_relate_appr_id" "numeric" [pk, note: '상신문서 연결ID(PK)']
  "act80_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']
  "act80_journal_id" "numeric" [note: '분개ID(act02_journal_id)']
  "act80_tr_id" "numeric" [note: '거래ID(ast06_tr_id)']

  Note: '상신문서 연결'
}

```
