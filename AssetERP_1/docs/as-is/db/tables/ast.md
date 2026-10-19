# 테이블: ast

27개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `ast01_class_tree` | 자산분류 | 29 |
| `ast02_detail` | 자산상세 | 10 |
| `ast03_cf_info` | 현금흐름표 기본정보 | 17 |
| `ast04_cf` | 현금흐름표 | 9 |
| `ast05_tr_code` | 거래코드관리 | 14 |
| `ast06_tr` | 거래내역 | 24 |
| `ast07_settle` | 결제내역(미수/미지급내역관리) | 13 |
| `ast08_tr_finance` | 금융상품 거래상세 | 25 |
| `ast09_book` | 고유자산(금융상품) 보유원장 | 25 |
| `ast10_manager` | 담당자정보 | 8 |
| `ast11_book_close` | 고유자산 마감원장 | 26 |
| `ast12_book_real` | 실제잔고(대사용으로 입력) | 9 |
| `ast13_book_depn` | 비품 보유원장 | 11 |
| `ast14_book_init` | 신규고객사 초기보유원장 (ast09 생성용) | 25 |
| `ast15_tr_code_window` | 화면별 사용 거래코드 | 5 |
| `ast16_non_deduct_tax` | 유/무형자산 불공제세액 추가분 관리 | 5 |
| `ast20_tr_tax` | 세금납부 | 7 |
| `ast21_tr_4insure` | 4대보험납부 | 17 |
| `ast24_fx_rate` | 환율관리 | 7 |
| `ast25_price` | 고유자산시세정보 | 8 |
| `ast30_book_fund_fee` | 펀드보수원장 | 22 |
| `ast31_book_fund_fee_close` | 펀드보수 결산원장 | 24 |
| `ast32_book_fund_fee_recovery` | 펀드보수원장 복구용 | 23 |
| `ast33_fund_trans` | 이관펀드정보 | 11 |
| `ast40_owner_capital` | 자기자본 | 5 |
| `ast41_invest_limit` | 자기자본투자한도 | 7 |
| `ast80_relate_appr` | 연관문서(고유자산) | 5 |

## DBML

```dbml
Table "public"."ast01_class_tree" {
  "ast01_class_tree_id" "numeric" [pk, note: '자산분류ID(PK)']
  "ast01_company_id" "numeric" [not null, note: '회사ID']
  "ast01_class_tree_cd" "character varying(10)" [not null, note: '자산분류코드 (자체코드 10자리 (3자리 + 7자리) ⇒ FUNCTION 제공)']
  "ast01_class_tree_nm" "character varying(200)" [not null, note: '자산분류명']
  "ast01_parent_tree_id" "numeric" [not null, note: '상위자산분류ID']
  "ast01_seq" "numeric" [not null, note: '순번']
  "ast01_type_cd" "character varying(2)" [not null, note: '유형코드 (IC:상위분류 / IT:최하위분류)']
  "ast01_content" "text" [note: '특이사항']
  "ast01_note" "character varying(200)" [note: '비고']
  "ast01_use_yn" "character varying(5)" [note: '사용여부 (TRUE / FALSE (DEFAULT TRUE))']
  "ast01_isin" "character varying(12)" [note: '표준코드']
  "ast01_item_l_class_cd" "character varying(2)" [note: '종목대분류']
  "ast01_item_m_class_cd" "character varying(4)" [note: '종목중분류']
  "ast01_item_s_class_cd" "character varying(6)" [note: '종목소분류']
  "ast01_account_type" "character varying(2)" [note: '회계구분']
  "ast01_asset_type" "character varying(1)" [note: '자산구분(1:고유자산/2:운용자산)']
  "ast01_icam_yn" "character varying(5)" [note: 'ICAM자료여부']
  "ast01_detail_cd" "character varying(8)" [note: 'ICAM상세구분(부동산상세(나머지는 %))']
  "ast01_tr_unit" "numeric" [note: '거래단위']
  "ast01_issue_date" "date" [note: '발행일자']
  "ast01_mat_date" "date" [note: '만기일자']
  "ast01_corp_id" "numeric" [note: '보관처ID(sys15_corp_id)']
  "ast01_cur_cd" "character varying(3)" [note: '통화코드']
  "ast01_depn_year" "numeric" [note: '감가상각기간(년)']
  "ast01_depn_rt" "numeric" [note: '감가상각율(%)']
  "ast01_depn_type" "character varying(1)" [note: '감가상각방식(DepnType)']
  "ast01_ipo_assign_yn" "character varying(5)" [note: 'IPO 종목분류 지정 여부 ']
  "ast01_item_d_class_cd" "character varying(8)" [note: '종목상세분류코드(ItemDClassCode)']
  "ast01_eval_type" "character varying(1)" [note: '평가구분(AssetEvalType-1:시가평가/2:이자평가/3:장부가평가)']

  indexes {
    (ast01_company_id, ast01_asset_type) [name: 'ast01_class_tree_idx01']
    (ast01_parent_tree_id) [name: 'ast01_class_tree_idx02']
  }

  Note: '자산분류'
}

Table "public"."ast02_detail" {
  "ast02_detail_id" "numeric" [pk, note: '자산상세ID']
  "ast02_ast_class_tree_id" "numeric" [not null, note: '자산분류ID (AST01_CLASS_TREE_ID)']
  "ast02_seq" "numeric" [not null, note: '순번']
  "ast02_title" "character varying(200)" [not null, note: '항목명']
  "ast02_value" "character varying(200)" [note: '값']
  "ast02_note" "character varying(200)" [note: '비고']
  "ast02_use_yn" "character varying(5)" [note: '사용여부 (TRUE / FALSE (DEFAULT TRUE))']
  "ast02_default_yn" "character varying(5)" [note: '디폴트 사용여부 (TRUE / FALSE))']
  "ast02_tag" "character varying(300)" [note: '태그']
  "ast02_company_id" "numeric" [not null, note: '회사ID']

  indexes {
    (ast02_ast_class_tree_id) [name: 'ast02_detail_idx01']
  }

  Note: '자산상세'
}

Table "public"."ast03_cf_info" {
  "ast03_cf_info_id" "numeric" [pk, note: '현금흐름표 기본정보ID']
  "ast03_ast_class_tree_id" "numeric" [not null, note: '자산분류ID (AST01_CLASS_TREE_ID)']
  "ast03_cf_cd" "character varying(3)" [not null, note: '현금흐름표 코드']
  "ast03_cf_nm" "character varying(100)" [not null, note: '현금흐름표 코드명']
  "ast03_tr_cd" "character varying(4)" [not null, note: '거래코드 (AST05_TR_CD)']
  "ast03_start_ym" "character varying(7)" [note: '계산시작일']
  "ast03_close_ym" "character varying(7)" [note: '계산종료일']
  "ast03_cycle" "numeric" [note: '계산주기 (개월단위로 입력)']
  "ast03_date_cd" "character varying(2)" [note: '결제일 코드 (01일~말일)']
  "ast03_holiday_settle_cd" "character varying(1)" [note: '휴일결제코드 (0:해당없음/1:직전영업일/2:직후영업일)']
  "ast03_amt" "numeric" [note: '금액']
  "ast03_note" "character varying(200)" [note: '비고']
  "ast03_round" "numeric" [note: '회차']
  "ast03_icam_yn" "character varying(5)" [note: 'ICAM사용']
  "ast03_cont_amt" "numeric" [note: '약정금액']
  "ast03_tax" "numeric" [note: '세금']
  "ast03_corp_id" "numeric" [note: '기관ID']

  indexes {
    (ast03_ast_class_tree_id) [name: 'ast03_cf_info_idx01']
  }

  Note: '현금흐름표 기본정보'
}

Table "public"."ast04_cf" {
  "ast04_cf_id" "numeric" [pk, note: '현금흐름표ID']
  "ast04_cf_info_id" "numeric" [not null, note: '현금흐름표 기본ID (AST03_CF_INFO_ID)']
  "ast04_seq" "numeric" [note: '회차']
  "ast04_date" "date" [note: '일자']
  "ast04_settle_date" "date" [note: '실수령/지급일']
  "ast04_settle_amt" "numeric" [note: '실수령/지급액']
  "ast04_note" "character varying(200)" [note: '비고']
  "ast04_cont_amt" "numeric" [note: '약정금액']
  "ast04_tax" "numeric" [note: '세금']

  indexes {
    (ast04_cf_info_id) [name: 'ast04_cf_idx01']
  }

  Note: '현금흐름표'
}

Table "public"."ast05_tr_code" {
  "ast05_tr_code_id" "numeric" [pk, note: '거래코드관리ID']
  "ast05_company_id" "numeric" [not null, note: '회사ID']
  "ast05_tr_cd" "character varying(4)" [not null, note: '거래코드']
  "ast05_tr_nm" "character varying(100)" [not null, note: '거래명']
  "ast05_rcv_pay_cd" "character varying(2)" [not null, note: '수령지급구분 (RcvPayCode-01:수령 / 02:지급)']
  "ast05_use_yn" "character varying(5)" [note: '사용여부 (TRUE / FALSE (DEFAULT TRUE))']
  "ast05_note" "character varying(200)" [note: '비고']
  "ast05_asset_type" "character varying(1)" [note: '자산구분(1:고유자산/2:운용자산)']
  "ast05_finance_yn" "character varying(5)" [note: '금융상품 관련거래 여부']
  "ast05_lock_yn" "character varying(5)" [note: '수정불가 여부(시스템영역코드)']
  "ast05_ast_class_tree_id" "numeric" [note: '자산ID (ast01_class_tree_id)']
  "ast05_dcr_class_tree_id" "numeric" [note: '문서분류ID (dcr01_class_tree_id)']
  "ast05_tr_occ_type" "character varying(2)" [note: '거래발생구분(TrOccType)']
  "ast05_item_class_group_cd" "character varying(50)" [note: '종목분류 그룹코드(sys13_kind_group_cd)']

  indexes {
    (ast05_company_id, ast05_tr_cd) [name: 'ast05_tr_code_idx01']
  }

  Note: '거래코드관리'
}

Table "public"."ast06_tr" {
  "ast06_tr_id" "numeric" [pk, note: '거래내역ID']
  "ast06_ast_class_tree_id" "numeric" [note: '자산분류ID (AST01_CLASS_TREE_ID)']
  "ast06_date" "date" [not null, note: '거래일자']
  "ast06_tr_cd" "character varying(4)" [note: '거래코드 (AST05_TR_CD)']
  "ast06_amt" "numeric" [note: '거래금액(실결제금액)']
  "ast06_settle_mng_yn" "character varying(5)" [note: '결제내역(미수/미지급)관리여부 (TRUE / FALSE (DEFAULT FALSE))']
  "ast06_note" "character varying(200)" [note: '비고']
  "ast06_person_id" "numeric" [note: '등록자ID']
  "ast06_company_id" "numeric" [note: '회사ID']
  "ast06_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "ast06_tax" "numeric" [note: '세금']
  "ast06_deposit_id" "numeric" [note: '예금관리계좌ID(ast01_class_tree_id)']
  "ast06_cur_cd" "character varying(3)" [note: '통화코드']
  "ast06_for_amt" "numeric" [note: '외화거래금액']
  "ast06_fx_rate" "numeric" [note: '적용환율']
  "ast06_cont_amt" "numeric" [note: '약정(계약)금액']
  "ast06_for_cont_amt" "numeric" [note: '외화 약정(계약)금액']
  "ast06_fee" "numeric" [note: '수수료']
  "ast06_book_amt" "numeric" [note: '장부금액']
  "ast06_pur_tr_id" "numeric" [note: '취득거래ID(ast06_tr_id)']
  "ast06_card_approval_no" "character varying(10)" [note: '법인카드 승인번호(crd02_approval_no)']
  "ast06_org_tr_id" "numeric" [note: '원 거래ID(ast06_tr_id)']
  "ast06_expense_id" "numeric" [note: '지출결의서ID(pay50_expense_id)']
  "ast06_appr_id" "numeric" [note: '상신ID']

  indexes {
    (ast06_company_id, ast06_date) [name: 'ast06_tr_idx01']
    (ast06_expense_id) [name: 'ast06_tr_idx02']
  }

  Note: '거래내역'
}

Table "public"."ast07_settle" {
  "ast07_settle_id" "numeric" [pk, note: '결제내역ID']
  "ast07_tr_id" "numeric" [not null, note: '거래내역ID (AST06_TR_ID)']
  "ast07_settle_date" "date" [not null, note: '결제일자 (실수령/지급일자)']
  "ast07_settle_amt" "numeric" [not null, note: '결제금액 (실수령/지급액)']
  "ast07_note" "character varying(200)" [note: '비고']
  "ast07_deposit_id" "numeric" [note: '예금관리계좌ID(ast01_class_tree_id)']
  "ast07_tr_cd" "character varying(4)" [note: '거래코드(ast05_tr_cd)']
  "ast07_person_id" "numeric" [note: '등록자ID']
  "ast07_for_settle_amt" "numeric" [note: '외화결제금액']
  "ast07_fx_rate" "numeric" [note: '적용환율']
  "ast07_amt" "numeric" [note: '미수/미지급 발생시점 환율의 원화금액']
  "ast07_for_amt" "numeric" [note: '외화 미수/미지급금']
  "ast07_expense_id" "numeric" [note: '지출결의서ID(pay50_expense_id)']

  indexes {
    (ast07_tr_id) [name: 'ast07_settle_idx01']
    (ast07_expense_id) [name: 'ast07_settle_idx02']
  }

  Note: '결제내역(미수/미지급내역관리)'
}

Table "public"."ast08_tr_finance" {
  "ast08_tr_finance_id" "numeric" [pk, note: '금융상품 거래상세ID(PK)']
  "ast08_tr_id" "numeric" [not null, note: '거래ID(ast06_tr_id)']
  "ast08_account_id" "numeric" [note: '보관계좌ID 또는 출고계좌ID (ast01_class_tree_id)']
  "ast08_qty" "numeric" [note: '수량']
  "ast08_price" "numeric" [note: '단가']
  "ast08_tr_amt" "numeric" [note: '거래금액']
  "ast08_fee" "numeric" [note: '수수료']
  "ast08_tr_tax" "numeric" [note: '거래세']
  "ast08_corp_tax" "numeric" [note: '법인세']
  "ast08_local_tax" "numeric" [note: '지방세']
  "ast08_book_amt" "numeric" [note: '장부금액']
  "ast08_int_amt" "numeric" [note: '이자금액']
  "ast08_pl" "numeric" [note: '손익']
  "ast08_in_account_id" "numeric" [note: '입고계좌ID(ast01_class_tree_id)']
  "ast08_acr_int_amt" "numeric" [note: '경과이자금액']
  "ast08_oci" "numeric" [note: '기타포괄손익']
  "ast08_lock_up_period_cd" "character varying(2)" [note: '의무보유확약기간(LockUpPeriodCode)']
  "ast08_lock_up_date" "date" [note: '의무보유일(매도제한일)']
  "ast08_pur_amt" "numeric" [note: '취득금액']
  "ast08_list_date" "date" [note: '상장일자']
  "ast08_for_tr_amt" "numeric" [note: '외화 거래금액']
  "ast08_for_book_amt" "numeric" [note: '외화 장부금액']
  "ast08_for_pur_amt" "numeric" [note: '외화 취득금액']
  "ast08_for_pl" "numeric" [note: '외화 손익']
  "ast08_fx_pl" "numeric" [note: '환차 손익']

  indexes {
    (ast08_tr_id) [name: 'ast08_tr_finance_idx01']
  }

  Note: '금융상품 거래상세'
}

Table "public"."ast09_book" {
  "ast09_book_id" "numeric" [pk, note: '고유자산 보유원장ID(PK)']
  "ast09_hold_date" "date" [not null, note: '보유일자']
  "ast09_ast_class_tree_id" "numeric" [note: '자산분류ID(ast01_class_tree_id)']
  "ast09_keep_account_id" "numeric" [note: '보관계좌ID(ast01_class_tree_id)']
  "ast09_hold_qty" "numeric" [note: '보유수량']
  "ast09_pur_amt" "numeric" [note: '취득금액']
  "ast09_book_amt" "numeric" [note: '장부금액']
  "ast09_eval_amt" "numeric" [note: '평가금액']
  "ast09_eval_pl" "numeric" [note: '평가손익']
  "ast09_first_pur_amt" "numeric" [note: '최초취득금액']
  "ast09_first_pur_date" "date" [note: '최초취득일자']
  "ast09_company_id" "numeric" [note: '회사ID']
  "ast09_for_pur_amt" "numeric" [note: '외화취득금액']
  "ast09_for_book_amt" "numeric" [note: '외화장부금액']
  "ast09_for_eval_amt" "numeric" [note: '외화평가금액']
  "ast09_for_eval_pl" "numeric" [note: '외화평가손익']
  "ast09_fx_pl" "numeric" [note: '환산손익']
  "ast09_book_end_yn" "character varying(5)" [note: '원장종료여부']
  "ast09_acr_int_amt" "numeric" [note: '경과이자금액']
  "ast09_for_acr_int_amt" "numeric" [note: '외화경과이자금액']
  "ast09_oci" "numeric" [note: '기타포괄손익']
  "ast09_for_oci" "numeric" [note: '외화기타포괄손익']
  "ast09_lock_up_period_cd" "character varying(2)" [note: '의무보유확약기간(LockUpPeriodCode)']
  "ast09_lock_up_date" "date" [note: '의무보유일(매도제한일)']
  "ast09_lock_up_qty" "numeric" [note: '의무보유수량(매도제한수량)']

  indexes {
    (ast09_company_id, ast09_hold_date) [name: 'ast09_book_idx01']
    (ast09_company_id, ast09_ast_class_tree_id, ast09_hold_date) [name: 'ast09_book_idx02']
    (ast09_ast_class_tree_id) [name: 'ast09_book_idx03']
  }

  Note: '고유자산(금융상품) 보유원장'
}

Table "public"."ast10_manager" {
  "ast10_manager_id" "numeric" [pk, note: '담당자정보ID(PK)']
  "ast10_link_id" "numeric" [not null, note: '연결분류ID']
  "ast10_manager_type" "character varying(1)" [note: '담당자구분(ManagerType(1:직원/2:부서))']
  "ast10_person_id" "numeric" [note: '담당자ID']
  "ast10_org_id" "numeric" [note: '담당부서ID']
  "ast10_company_id" "numeric" [not null, note: '회사ID']
  "ast10_link_content" "character varying(100)" [note: '연결내용(자산:ast01_class_tree_id, 거래:ast06_tr_id)']
  "ast10_repr_yn" "character varying(5)" [note: '대표여부']

  indexes {
    (ast10_link_id) [name: 'ast10_manager_idx01']
  }

  Note: '담당자정보'
}

Table "public"."ast11_book_close" {
  "ast11_book_close_id" "numeric" [pk, note: '고유자산 보유원장(결산마감)ID(PK)']
  "ast11_book_id" "numeric" [not null, note: '고유자산 보유원장ID(ast09_book_id)']
  "ast11_hold_date" "date" [not null, note: '보유일자']
  "ast11_ast_class_tree_id" "numeric" [note: '자산분류ID(ast01_class_tree_id)']
  "ast11_keep_account_id" "numeric" [note: '보관계좌ID(ast01_class_tree_id)']
  "ast11_hold_qty" "numeric" [note: '보유수량']
  "ast11_pur_amt" "numeric" [note: '취득금액']
  "ast11_book_amt" "numeric" [note: '장부금액']
  "ast11_eval_amt" "numeric" [note: '평가금액']
  "ast11_eval_pl" "numeric" [note: '평가손익']
  "ast11_first_pur_amt" "numeric" [note: '최초취득금액']
  "ast11_first_pur_date" "date" [note: '최초취득일자']
  "ast11_company_id" "numeric" [note: '회사ID']
  "ast11_for_pur_amt" "numeric" [note: '외화취득금액']
  "ast11_for_book_amt" "numeric" [note: '외화장부금액']
  "ast11_for_eval_amt" "numeric" [note: '외화평가금액']
  "ast11_for_eval_pl" "numeric" [note: '외화평가손익']
  "ast11_fx_pl" "numeric" [note: '환산손익']
  "ast11_book_end_yn" "character varying(5)" [note: '원장종료여부']
  "ast11_acr_int_amt" "numeric" [note: '경과이자금액']
  "ast11_for_acr_int_amt" "numeric" [note: '외화경과이자금액']
  "ast11_oci" "numeric" [note: '기타포괄손익']
  "ast11_for_oci" "numeric" [note: '외화기타포괄손익']
  "ast11_lock_up_period_cd" "character varying(2)" [note: '의무보유확약기간(LockUpPeriodCode)']
  "ast11_lock_up_date" "date" [note: '의무보유일(매도제한일)']
  "ast11_lock_up_qty" "numeric" [note: '의무보유수량(매도제한수량)']

  indexes {
    (ast11_book_id) [name: 'ast11_book_close_idx01']
    (ast11_company_id, ast11_hold_date) [name: 'ast11_book_close_idx02']
  }

  Note: '고유자산 마감원장'
}

Table "public"."ast12_book_real" {
  "ast12_book_real_id" "numeric" [pk, note: '실제잔고ID(PK)']
  "ast12_company_id" "numeric" [note: '회사ID']
  "ast12_hold_date" "date" [note: '보유일자']
  "ast12_ast_class_tree_id" "numeric" [note: '자산분류ID(ast01_class_tree_id)']
  "ast12_keep_account_id" "numeric" [note: '보관계좌ID(ast01_class_tree_id)']
  "ast12_real_qty" "numeric" [note: '실제수량']
  "ast12_real_amt" "numeric" [note: '실제금액']
  "ast12_real_for_amt" "numeric" [note: '실제외화금액']
  "ast12_note" "character varying(200)" [note: '비고']

  indexes {
    (ast12_company_id, ast12_hold_date) [name: 'ast12_book_real_idx01']
  }

  Note: '실제잔고(대사용으로 입력)'
}

Table "public"."ast13_book_depn" {
  "ast13_book_depn_id" "numeric" [pk, note: '비품원장ID(PK)']
  "ast13_company_id" "numeric" [note: '회사ID']
  "ast13_ast_class_tree_id" "numeric" [note: '자산분류ID(ast01_class_tree_id)']
  "ast13_pur_tr_id" "numeric" [note: '취득거래ID']
  "ast13_pur_date" "date" [note: '취득일자']
  "ast13_pur_amt" "numeric" [note: '취득금액(상각대상금액)']
  "ast13_retire_date" "date" [note: '폐기일자']
  "ast13_depn_date" "date" [note: '감가상각일자(거래발생일)']
  "ast13_depn_cost" "numeric" [note: '감가상각비(당기계상분)']
  "ast13_acm_depn_cost" "numeric" [note: '감가상각누계액']
  "ast13_month_depn_cost" "numeric" [note: '감가상각비(당기 현재까지 감가상각비 - 당기계상 감가상각비 = 당월분)']

  indexes {
    (ast13_company_id, ast13_depn_date) [name: 'ast13_book_depn_idx01']
    (ast13_ast_class_tree_id) [name: 'ast13_book_depn_idx02']
  }

  Note: '비품 보유원장'
}

Table "public"."ast14_book_init" {
  "ast14_book_init_id" "numeric" [pk, note: '신규고객사 초기보유원장ID(PK)']
  "ast14_hold_date" "date" [not null, note: '보유일자']
  "ast14_ast_class_tree_id" "numeric" [note: '자산분류ID(ast01_class_tree_id)']
  "ast14_keep_account_id" "numeric" [note: '보관계좌ID(ast01_class_tree_id)']
  "ast14_hold_qty" "numeric" [note: '보유수량']
  "ast14_pur_amt" "numeric" [note: '취득금액']
  "ast14_book_amt" "numeric" [note: '장부금액']
  "ast14_eval_amt" "numeric" [note: '평가금액']
  "ast14_eval_pl" "numeric" [note: '평가손익']
  "ast14_first_pur_amt" "numeric" [note: '최초취득금액']
  "ast14_first_pur_date" "date" [note: '최초취득일자']
  "ast14_company_id" "numeric" [note: '회사ID']
  "ast14_for_pur_amt" "numeric" [note: '외화취득금액']
  "ast14_for_book_amt" "numeric" [note: '외화장부금액']
  "ast14_for_eval_amt" "numeric" [note: '외화평가금액']
  "ast14_for_eval_pl" "numeric" [note: '외화평가손익']
  "ast14_fx_pl" "numeric" [note: '환산손익']
  "ast14_book_end_yn" "character varying(5)" [note: '원장종료여부']
  "ast14_acr_int_amt" "numeric" [note: '경과이자금액']
  "ast14_for_acr_int_amt" "numeric" [note: '외화경과이자금액']
  "ast14_oci" "numeric" [note: '기타포괄손익']
  "ast14_for_oci" "numeric" [note: '외화기타포괄손익']
  "ast14_lock_up_period_cd" "character varying(2)" [note: '의무보유확약기간(LockUpPeriodCode)']
  "ast14_lock_up_date" "date" [note: '의무보유일(매도제한일)']
  "ast14_lock_up_qty" "numeric" [note: '의무보유수량(매도제한수량)']

  Note: '신규고객사 초기보유원장 (ast09 생성용)'
}

Table "public"."ast15_tr_code_window" {
  "ast15_tr_code_window_id" "numeric" [pk, note: '화면별 사용 거래코드ID(PK)']
  "ast15_company_id" "numeric" [note: '회사ID']
  "ast15_window_class_nm" "character varying(200)" [note: '화면 클래스명']
  "ast15_tr_cd" "character varying(4)" [note: '거래코드(ast05_tr_cd)']
  "ast15_note" "character varying(200)" [note: '비고']

  indexes {
    (ast15_company_id, ast15_window_class_nm) [name: 'ast15_tr_code_window_idx01']
  }

  Note: '화면별 사용 거래코드'
}

Table "public"."ast16_non_deduct_tax" {
  "ast16_non_deduct_tax_id" "numeric" [pk, note: '유/무형자산 불공제세액 관리ID(PK)']
  "ast16_pur_tr_id" "numeric" [not null, note: '유/무형자산 취득거래ID (ast13_pur_tr_id)']
  "ast16_apply_date" "date" [not null, note: '적용일자']
  "ast16_apply_non_deduct_tax" "numeric" [note: '적용 불공제세액']
  "ast16_note" "text" [note: '비고']

  indexes {
    (ast16_pur_tr_id) [name: 'ast16_non_deduct_tax_idx01']
  }

  Note: '유/무형자산 불공제세액 추가분 관리'
}

Table "public"."ast20_tr_tax" {
  "ast20_tr_tax_id" "numeric" [pk, note: '세금납부ID(PK)']
  "ast20_tr_id" "numeric" [note: '거래내역ID (AST06_TR_ID)']
  "ast20_income_tax" "numeric" [note: '소득세(근로소득원천세)']
  "ast20_local_tax" "numeric" [note: '지방세(근로소득원천세)']
  "ast20_etc_tax" "numeric" [note: '기타원천징수(근로소득원천세)']
  "ast20_pre_pay_vat" "numeric" [note: '선급부가세(비용에서 발생)']
  "ast20_pre_rcv_vat" "numeric" [note: '예수부가세(수익에서 발생)']

  indexes {
    (ast20_tr_id) [name: 'ast20_tr_tax_idx01']
  }

  Note: '세금납부'
}

Table "public"."ast21_tr_4insure" {
  "ast21_tr_4insure_id" "numeric" [pk, note: '4대보험납부ID(PK)']
  "ast21_tr_id" "numeric" [note: '거래ID(ast06_tr_id)']
  "ast21_np_withholding" "numeric" [note: '국민연금 원천징수']
  "ast21_np_company" "numeric" [note: '국민연금 회사부담금']
  "ast21_np_etc" "numeric" [note: '국민연금 기타금액']
  "ast21_np_etc_note" "text" [note: '국민연금 기타적요']
  "ast21_hi_withholding" "numeric" [note: '건강보험 원천징수']
  "ast21_hi_company" "numeric" [note: '건강보험 회사부담금']
  "ast21_hi_etc" "numeric" [note: '건강보험 기타금액']
  "ast21_hi_etc_note" "text" [note: '건강보험 기타적요']
  "ast21_ei_withholding" "numeric" [note: '고용보험 원천징수']
  "ast21_ei_company" "numeric" [note: '고용보험 회사부담금']
  "ast21_ei_etc" "numeric" [note: '고용보험 기타금액']
  "ast21_ei_etc_note" "text" [note: '고용보험 기타적요']
  "ast21_oh_company" "numeric" [note: '산재보험 회사부담금']
  "ast21_oh_etc" "numeric" [note: '산재보험 기타금액']
  "ast21_oh_etc_note" "text" [note: '산재보험 기타적요']

  indexes {
    (ast21_tr_id) [name: 'ast21_tr_4insure_idx01']
  }

  Note: '4대보험납부'
}

Table "public"."ast24_fx_rate" {
  "ast24_fx_rate_id" "numeric" [pk, note: '환율관리ID(PK)']
  "ast24_company_id" "numeric" [note: '회사ID']
  "ast24_fx_rate_type" "character varying(2)" [note: '환율구분(FxRateType-01:평가환율)']
  "ast24_cur_cd" "character varying(3)" [note: '통화코드(CurCode)']
  "ast24_std_date" "date" [note: '기준일자']
  "ast24_apply_fx_rate" "numeric" [note: '적용환율']
  "ast24_note" "character varying(200)" [note: '비고']

  indexes {
    (ast24_company_id, ast24_std_date) [name: 'ast24_fx_rate_idx01']
  }

  Note: '환율관리'
}

Table "public"."ast25_price" {
  "ast25_price_id" "numeric" [pk, note: '고유자산시세정보ID(PK)']
  "ast25_company_id" "numeric" [not null, note: '회사ID']
  "ast25_std_date" "date" [not null, note: '기준일자']
  "ast25_item_type" "character varying(4)" [not null, note: '종목구분(ItemMClassCode001-2010:주식/2050:집합투자증권)']
  "ast25_item_cd" "character varying(12)" [not null, note: '종목코드(주식인경우 코스콤코드, 펀드인경우 예탁원코드)']
  "ast25_item_nm" "character varying(200)" [note: '종목명']
  "ast25_eval_price" "numeric" [note: '평가단가']
  "ast25_note" "text" [note: '비고']

  indexes {
    (ast25_company_id, ast25_std_date) [name: 'ast25_price_idx01']
    (ast25_company_id, ast25_std_date, ast25_item_type) [name: 'ast25_price_idx02']
    (ast25_company_id, ast25_std_date, ast25_item_type, ast25_item_cd) [unique, name: 'ast25_price_idx03']
  }

  Note: '고유자산시세정보'
}

Table "public"."ast30_book_fund_fee" {
  "ast30_book_fund_fee_id" "numeric" [pk, note: '펀드보수원장ID(PK)']
  "ast30_hold_date" "date" [note: '보유일자']
  "ast30_company_id" "numeric" [note: '회사ID']
  "ast30_ast_class_tree_id" "numeric" [note: '자산ID(ast01_class_tree_id)']
  "ast30_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "ast30_fund_cd" "character varying(12)" [note: '펀드코드']
  "ast30_fund_nm" "character varying(200)" [note: '펀드명']
  "ast30_cur_cd" "character varying(3)" [note: '통화코드']
  "ast30_for_fee_today" "numeric" [note: '외화 당일보수']
  "ast30_fee_today" "numeric" [note: '당일보수']
  "ast30_for_fee" "numeric" [note: '외화 보수(누적)']
  "ast30_fee" "numeric" [note: '보수(누적)']
  "ast30_fx_rate" "numeric" [note: '적용환율']
  "ast30_note" "character varying(200)" [note: '비고']
  "ast30_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "ast30_consignment_nm" "character varying(100)" [note: '수탁사명']
  "ast30_calc_start_date" "date" [note: '보수계산시작일(전보수인출일)']
  "ast30_calc_close_date" "date" [note: '보수계산종료일(다음보수인출일-1일)']
  "ast30_for_un_rcv_fee" "numeric" [note: '외화 유보보수']
  "ast30_un_rcv_fee" "numeric" [note: '유보보수']
  "ast30_for_fix_fee" "numeric" [note: '외화 확정 미수보수(연결산시)']
  "ast30_fix_fee" "numeric" [note: '확정 미수보수(연결산시)']

  indexes {
    (ast30_company_id, ast30_hold_date) [name: 'ast30_book_fund_fee_idx01']
  }

  Note: '펀드보수원장'
}

Table "public"."ast31_book_fund_fee_close" {
  "ast31_book_fund_fee_close_id" "numeric" [pk, note: '펀드보수 결산원장ID(PK)']
  "ast31_tr_id" "numeric" [note: '결산거래ID(ast06_tr_id)']
  "ast31_book_fund_fee_id" "numeric" [note: '펀드보수원장ID(ast30_book_fund_fee_id)']
  "ast31_hold_date" "date" [note: '보유일자']
  "ast31_company_id" "numeric" [note: '회사ID']
  "ast31_ast_class_tree_id" "numeric" [note: '자산ID(ast01_class_tree_id)']
  "ast31_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "ast31_fund_cd" "character varying(12)" [note: '펀드코드']
  "ast31_fund_nm" "character varying(200)" [note: '펀드명']
  "ast31_cur_cd" "character varying(3)" [note: '통화코드']
  "ast31_for_fee_today" "numeric" [note: '외화 당일보수']
  "ast31_fee_today" "numeric" [note: '당일보수']
  "ast31_for_fee" "numeric" [note: '외화 보수(누적)']
  "ast31_fee" "numeric" [note: '보수(누적)']
  "ast31_fx_rate" "numeric" [note: '적용환율']
  "ast31_note" "character varying(200)" [note: '비고']
  "ast31_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "ast31_consignment_nm" "character varying(100)" [note: '수탁사명']
  "ast31_calc_start_date" "date" [note: '보수계산시작일(전보수인출일)']
  "ast31_calc_close_date" "date" [note: '보수계산종료일(다음보수인출일-1일)']
  "ast31_for_un_rcv_fee" "numeric" [note: '외화 유보보수']
  "ast31_un_rcv_fee" "numeric" [note: '유보보수']
  "ast31_for_fix_fee" "numeric" [note: '외화 확정 미수보수(연결산시)']
  "ast31_fix_fee" "numeric" [note: '확정 미수보수(연결산시)']

  indexes {
    (ast31_tr_id) [name: 'ast31_book_fund_fee_close_idx01']
  }

  Note: '펀드보수 결산원장'
}

Table "public"."ast32_book_fund_fee_recovery" {
  "ast32_book_fund_fee_recovery_id" "numeric" [pk, note: '펀드보수원장 복구용ID(PK)']
  "ast32_book_fund_fee_id" "numeric" [note: '펀드보수원장ID(ast30_book_fund_fee_id)']
  "ast32_hold_date" "date" [note: '보유일자']
  "ast32_company_id" "numeric" [note: '회사ID']
  "ast32_ast_class_tree_id" "numeric" [note: '자산ID(ast01_class_tree_id)']
  "ast32_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "ast32_fund_cd" "character varying(12)" [note: '펀드코드']
  "ast32_fund_nm" "character varying(200)" [note: '펀드명']
  "ast32_cur_cd" "character varying(3)" [note: '통화코드']
  "ast32_for_fee_today" "numeric" [note: '외화 당일보수']
  "ast32_fee_today" "numeric" [note: '당일보수']
  "ast32_for_fee" "numeric" [note: '외화 보수(누적)']
  "ast32_fee" "numeric" [note: '보수(누적)']
  "ast32_fx_rate" "numeric" [note: '적용환율']
  "ast32_note" "character varying(200)" [note: '비고']
  "ast32_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "ast32_consignment_nm" "character varying(100)" [note: '수탁사명']
  "ast32_calc_start_date" "date" [note: '보수계산시작일(전보수인출일)']
  "ast32_calc_close_date" "date" [note: '보수계산종료일(다음보수인출일-1일)']
  "ast32_for_un_rcv_fee" "numeric" [note: '외화 유보보수']
  "ast32_un_rcv_fee" "numeric" [note: '유보보수']
  "ast32_for_fix_fee" "numeric" [note: '외화 확정 미수보수(연결산시SET)']
  "ast32_fix_fee" "numeric" [note: '확정 미수보수(연결산시SET)']

  indexes {
    (ast32_book_fund_fee_id) [name: 'ast32_book_fund_fee_recovery_idx01']
  }

  Note: '펀드보수원장 복구용'
}

Table "public"."ast33_fund_trans" {
  "ast33_fund_trans_id" "numeric" [pk, note: '이관펀드정보ID(PK)']
  "ast33_company_id" "numeric" [not null, note: '회사ID']
  "ast33_fund_trans_cd" "character varying(1)" [note: '펀드이관코드(FundTransCode - 1:이관(출)/2:이관(입))']
  "ast33_date" "date" [note: '해지일/이관일']
  "ast33_corp_id" "numeric" [note: '운용사ID']
  "ast33_fund_cd" "character varying(12)" [note: '펀드코드']
  "ast33_fee" "numeric" [note: '미수보수(이관(출)인 경우에만 입력)']
  "ast33_for_fee" "numeric" [note: '외화미수보수(이관(출)인 경우에만 입력)']
  "ast33_cur_cd" "character varying(3)" [note: '통화코드']
  "ast33_note" "character varying(500)" [note: '비고']
  "ast33_tr_id" "numeric" [note: '거래ID(ast06_tr_id)(이관(출)인 경우에만 해당)']

  Note: '이관펀드정보'
}

Table "public"."ast40_owner_capital" {
  "ast40_owner_capital_id" "numeric" [pk, note: '자기자본ID(PK)']
  "ast40_company_id" "numeric" [not null, note: '회사ID']
  "ast40_std_date" "date" [not null, note: '기준일자']
  "ast40_amt" "numeric" [not null, note: '자기자본금액']
  "ast40_note" "text" [note: '비고']

  indexes {
    (ast40_std_date) [name: 'ast40_owner_capital_idx01']
  }

  Note: '자기자본'
}

Table "public"."ast41_invest_limit" {
  "ast41_invest_limit_id" "numeric" [pk, note: '자기자본투자한도ID(PK)']
  "ast41_company_id" "numeric" [not null, note: '회사ID']
  "ast41_start_date" "date" [not null, note: '적용시작일자']
  "ast41_invest_asset_type" "character varying(6)" [not null, note: '투자자산구분(InvestAssetType)']
  "ast41_limit_rate" "numeric" [note: '투자한도비율(%)']
  "ast41_stop_loss_rate" "numeric" [note: 'StopLoss기준율(%)']
  "ast41_note" "text" [note: '비고']

  indexes {
    (ast41_start_date) [name: 'ast41_invest_limit_idx01']
    (ast41_start_date, ast41_invest_asset_type) [name: 'ast41_invest_limit_idx02']
  }

  Note: '자기자본투자한도'
}

Table "public"."ast80_relate_appr" {
  "ast80_relate_appr_id" "numeric" [pk, note: '연관문서(고유자산)ID(PK)']
  "ast80_company_id" "numeric" [note: '회사ID']
  "ast80_date" "date" [note: '일자']
  "ast80_link_cd" "character varying(3)" [note: '링크코드(LinkCode)']
  "ast80_appr_id" "numeric" [note: '상신문서ID']

  Note: '연관문서(고유자산)'
}

```
