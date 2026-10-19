# 테이블: flt

15개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `flt01_company_std` | 임직원매매 기준관리 - 회사 | 21 |
| `flt02_emp` | 임직원매매 기준관리 - 직원별 | 6 |
| `flt03_account` | 임직원 계좌 | 14 |
| `flt04_oath` | 임직원 서약서 | 6 |
| `flt05_item_type` | 자기매매 종목유형정보 | 11 |
| `flt06_account_close` | 임직원 폐쇄계좌 | 5 |
| `flt07_family_consent` | 가족금융거래정보 이용동의서 | 2 |
| `flt08_buy_lockup` | 매수제한주식종목 | 6 |
| `flt09_fund_item` | 임직원매매체크용-펀드보유주식 | 6 |
| `flt10_tr` | 임직원 금융상품 매매 | 32 |
| `flt11_book` | 임직원 금융상품 보유내역 | 14 |
| `flt12_book_month` | 임직원 금융상품 보유내역(월말잔고 직접입력) | 9 |
| `flt13_book_init` | 임직원 금융상품 보유내역(최초원장) | 11 |
| `flt14_relate_appr` | 임직원매매 정기보고 상신문서 연결 | 5 |
| `flt15_tr_status` | 임직원매매현황 | 5 |

## DBML

```dbml
Table "public"."flt01_company_std" {
  "flt01_company_std_id" "numeric" [pk, note: '회사기준ID(PK)']
  "flt01_company_id" "numeric" [not null, note: '회사ID']
  "flt01_start_date" "date" [not null, note: '기준시작일자']
  "flt01_total_invest_amt" "numeric" [note: '총누적투자금액']
  "flt01_turnover_rate" "numeric" [note: '월간매매회전율(%)']
  "flt01_appr_over_rate" "numeric" [note: '사전승인금액 초과비율(%)']
  "flt01_appr_valid_days" "numeric" [note: '사전승인 유효기간 (영업일기준)']
  "flt01_lock_up_days" "numeric" [note: '의무보유기간(계산기준코드에 따라 영업일or개월)']
  "flt01_rpt_start_date" "date" [note: '자기매매 보고 시작일(예, 2024년 1분기 또는 1월부터 시작이면 2024-01-01임)']
  "flt01_lock_up_cd" "character varying(1)" [note: '의무보유기간 위반체크 코드(FloorTrLockUpCheckCode-1:보유기간/2:매수주문건수)']
  "flt01_buy_opr_day_yn" "character varying(5)" [note: '매수주문건수(일)체크여부']
  "flt01_buy_opr_month_yn" "character varying(5)" [note: '매수주문건수(월)체크여부']
  "flt01_fund_hold_stk_yn" "character varying(5)" [note: '운용펀드보유주식 매수제한체크여부']
  "flt01_tr_file_evid_yn" "character varying(5)" [note: '거래내역 증빙자료 필수여부']
  "flt01_std_date_type" "character varying(1)" [note: '사전승인주문유효일 계산기준일(FloorTrStdDateType-1:신청일/2:승인일) ']
  "flt01_invest_amt_calc_target_cd" "character varying(1)" [note: '투자금액 계산대상코드(FloorTrInvestCalcTargetCode-1:매매금액/2:입출금액)']
  "flt01_lock_up_calc_std_cd" "character varying(1)" [note: '의무보유기간 계산기준코드(FloorTrLockUpCalcStdCode-D:영업일/M:개월)']
  "flt01_invest_amt_over_check_yn" "character varying(5)" [note: '투자금액 초과 매수제한 여부']
  "flt01_no_account_skip_yn" "character varying(5)" [note: '계좌미존재시 정기보고 안함 여부']
  "flt01_invest_limit_unvisible_yn" "character varying(5)" [note: '투자한도금액 표시제한 여부']
  "flt01_appr_qty_over_rate" "numeric" [note: '사전승인수량 초과비율(%)']

  indexes {
    (flt01_company_id) [name: 'flt01_company_std_idx01']
  }

  Note: '임직원매매 기준관리 - 회사'
}

Table "public"."flt02_emp" {
  "flt02_emp_id" "numeric" [pk, note: '직원별기준ID(PK)']
  "flt02_company_id" "numeric" [not null, note: '회사ID']
  "flt02_person_id" "numeric" [not null, note: '사원ID']
  "flt02_start_date" "date" [not null, note: '기준시작일자']
  "flt02_year_invest_limit" "numeric" [note: '연간추가 투자한도 (연봉한도)']
  "flt02_check_cycle" "character varying(1)" [note: '점검주기(분기별/월별) - FloorTrCheckCycle']

  indexes {
    (flt02_company_id, flt02_person_id) [name: 'flt02_emp_idx01']
  }

  Note: '임직원매매 기준관리 - 직원별'
}

Table "public"."flt03_account" {
  "flt03_account_id" "numeric" [pk, note: '임직원 계좌ID(PK)']
  "flt03_company_id" "numeric" [not null, note: '회사ID']
  "flt03_person_id" "numeric" [not null, note: '사원ID']
  "flt03_setup_date" "date" [note: '계좌개설일']
  "flt03_reg_reason" "character varying(1)" [note: '신고사유(신규입사/계좌개설) - AccountRegReason']
  "flt03_corp_id" "numeric" [note: '개설기관ID']
  "flt03_corp_branch_nm" "character varying(50)" [note: '개설점포명']
  "flt03_account_no" "character varying(128)" [note: '계좌번호']
  "flt03_account_nm" "character varying(50)" [note: '계좌명']
  "flt03_item_type" "character varying(6)" [note: '종목유형(지분증권/증권예탁증서/주권관련 사채권/파생결합증권/장내파생상품/장외파생상품)']
  "flt03_appr_id" "numeric" [note: '상신ID']
  "flt03_family_relate_cd" "character varying(1)" [note: '가족관계코드(FamilyRelateCode)']
  "flt03_main_account_yn" "character varying(5)" [note: '주거래계좌 여부']
  "flt03_note" "text" [note: '비고']

  indexes {
    (flt03_company_id, flt03_person_id) [name: 'flt03_account_idx01']
  }

  Note: '임직원 계좌'
}

Table "public"."flt04_oath" {
  "flt04_oath_id" "numeric" [pk, note: '임직원 서약서ID(PK)']
  "flt04_company_id" "numeric" [not null, note: '회사ID']
  "flt04_person_id" "numeric" [not null, note: '사원ID']
  "flt04_start_date" "date" [not null, note: '기준시작일자']
  "flt04_appr_id" "numeric" [note: '상신ID']
  "flt04_use_yn" "character varying(5)" [note: '사용여부']

  indexes {
    (flt04_company_id, flt04_person_id) [name: 'flt04_oath_idx01']
  }

  Note: '임직원 서약서'
}

Table "public"."flt05_item_type" {
  "flt05_item_type_id" "numeric" [pk, note: '자기매매 종목유형정보ID(PK)']
  "flt05_company_id" "numeric" [note: '회사ID']
  "flt05_item_type_cd" "character varying(2)" [note: '종목유형코드']
  "flt05_item_type_nm" "character varying(50)" [note: '종목유형명']
  "flt05_seq" "numeric" [note: '조회순서']
  "flt05_target_yn" "character varying(5)" [note: '신고대상여부']
  "flt05_start_date" "date" [note: '적용시작일']
  "flt05_stk_price_yn" "character varying(5)" [note: '주식시세적용여부(종목코드 필수)']
  "flt05_lock_up_check_yn" "character varying(5)" [note: '의무보유기간 체크여부']
  "flt05_sell_pre_appr_yn" "character varying(5)" [note: '매도사전승인여부']
  "flt05_list_stk_yn" "character varying(5)" [note: '상장지분증권여부']

  indexes {
    (flt05_company_id) [name: 'flt05_item_type_idx01']
    (flt05_company_id, flt05_item_type_cd) [name: 'flt05_item_type_idx02']
    (flt05_company_id, flt05_item_type_cd, flt05_start_date) [name: 'flt05_item_type_idx03']
  }

  Note: '자기매매 종목유형정보'
}

Table "public"."flt06_account_close" {
  "flt06_account_close_id" "numeric" [pk, note: '임직원 폐쇄계좌ID(PK)']
  "flt06_account_id" "numeric" [note: '임직원 계좌ID(flt03_account_id)']
  "flt06_close_date" "date" [note: '폐쇄일자']
  "flt06_appr_id" "numeric" [note: '상신ID']
  "flt06_note" "text" [note: '비고']

  indexes {
    (flt06_account_id) [name: 'flt06_account_close_idx01']
  }

  Note: '임직원 폐쇄계좌'
}

Table "public"."flt07_family_consent" {
  "flt07_family_consent_id" "numeric" [pk, note: '가족금융거래정보 이용동의서ID(PK)']
  "flt07_person_id" "numeric" [note: '직원ID']

  indexes {
    (flt07_person_id) [name: 'flt07_family_consent_idx01']
  }

  Note: '가족금융거래정보 이용동의서'
}

Table "public"."flt08_buy_lockup" {
  "flt08_buy_lockup_id" "numeric" [pk, note: '매수제한주식종목ID(PK)']
  "flt08_company_id" "numeric" [note: '회사ID']
  "flt08_item_cd" "character varying(12)" [note: '종목코드']
  "flt08_start_date" "date" [note: '제한시작일자']
  "flt08_close_date" "date" [note: '제한종료일자']
  "flt08_lockup_type" "character varying(1)" [note: '제한구분(BuyLockupType-1:매수주의/2:매수제한)']

  indexes {
    (flt08_company_id, flt08_item_cd) [name: 'flt08_buy_lockup_idx01']
  }

  Note: '매수제한주식종목'
}

Table "public"."flt09_fund_item" {
  "flt09_fund_item_id" "numeric" [pk, note: '임직원매매체크용-펀드보유주식ID(PK)']
  "flt09_company_id" "numeric" [note: '회사ID']
  "flt09_std_date" "date" [note: '기준일자']
  "flt09_item_type" "character varying(4)" [note: '종목구분(ItemMClassCode001-2010:주식/2050:집합투자증권)']
  "flt09_item_cd" "character varying(12)" [note: '종목코드']
  "flt09_item_nm" "character varying(100)" [note: '종목명']

  indexes {
    (flt09_company_id, flt09_std_date) [name: 'flt09_fund_item_idx01']
    (flt09_company_id, flt09_std_date, flt09_item_cd) [name: 'flt09_fund_item_idx02']
  }

  Note: '임직원매매체크용-펀드보유주식'
}

Table "public"."flt10_tr" {
  "flt10_tr_id" "numeric" [pk, note: '임직원 금융상품 매매ID(PK)']
  "flt10_company_id" "numeric" [not null, note: '회사ID']
  "flt10_person_id" "numeric" [not null, note: '사원ID']
  "flt10_tr_type" "character varying(3)" [note: '매매구분(FloorTrCode-10I:매수/20O:매도/..)']
  "flt10_account_id" "numeric" [note: '계좌ID(FLT03_ACCOUNT_ID)']
  "flt10_item_nm" "character varying(100)" [note: '종목명']
  "flt10_item_type" "character varying(2)" [note: '종목유형코드(flt05_item_type_cd)']
  "flt10_reg_date" "date" [note: '사전승인신고일']
  "flt10_expect_tr_date" "date" [note: '매매유효일']
  "flt10_expect_tr_amt" "numeric" [note: '사전신고 매매(예상)금액']
  "flt10_expect_tr_qty" "numeric" [note: '사전신고 매매수량']
  "flt10_appr_yn" "character varying(5)" [note: '사전신고 승인여부 (사용안함)']
  "flt10_tr_date" "date" [note: '실거래일']
  "flt10_tr_item_nm" "character varying(100)" [note: '실종목명']
  "flt10_tr_item_type" "character varying(2)" [note: '실거래 종목유형코드(flt05_item_type_cd)']
  "flt10_tr_amt" "numeric" [note: '실매매금액']
  "flt10_tr_qty" "numeric" [note: '실매매수량']
  "flt10_note" "character varying(100)" [note: '비고']
  "flt10_appr_id" "numeric" [note: '상신ID (거래보고용-사용X)']
  "flt10_expect_appr_id" "numeric" [note: '상신ID (사전신고용)']
  "flt10_item_cd" "character varying(12)" [note: '종목코드']
  "flt10_tr_item_cd" "character varying(12)" [note: '실종목코드']
  "flt10_status_cd" "character varying(2)" [note: '상태코드(FloorTrStatusCode-10:신청/20:승인/30:반려)']
  "flt10_tr_reason" "text" [note: '매매사유']
  "flt10_reject_reason" "text" [note: '반려사유']
  "flt10_out_account_id" "numeric" [note: '출고계좌ID(flt03_account_id)']
  "flt10_confirmer_id" "numeric" [note: '승인자ID']
  "flt10_confirm_datetime" "timestamp without time zone" [note: '승인일시']
  "flt10_confirm_sms_yn" "character varying(5)" [note: '승인/반려 문자발송여부']
  "flt10_tr_note" "text" [note: '비고(실거래 등록시 입력)']
  "flt10_unfill_yn" "character varying(5)" [note: '미체결여부']
  "flt10_pur_amt" "numeric" [note: '취득금액']

  indexes {
    (flt10_company_id, flt10_person_id) [name: 'flt10_tr_idx01']
    (flt10_company_id, flt10_person_id, flt10_account_id) [name: 'flt10_tr_idx02']
  }

  Note: '임직원 금융상품 매매'
}

Table "public"."flt11_book" {
  "flt11_book_id" "numeric" [pk, note: '임직원 금융상품 보유내역ID(PK)']
  "flt11_company_id" "numeric" [not null, note: '회사ID']
  "flt11_person_id" "numeric" [not null, note: '사원ID']
  "flt11_account_id" "numeric" [note: '계좌ID(FLT03_ACCOUNT_ID)']
  "flt11_item_nm" "character varying(100)" [note: '종목명']
  "flt11_item_type" "character varying(2)" [note: '종목유형코드(flt05_item_type_cd)']
  "flt11_book_date" "date" [note: '보유기준일']
  "flt11_book_amt" "numeric" [note: '보유금액']
  "flt11_book_qty" "numeric" [note: '보유수량']
  "flt11_note" "character varying(100)" [note: '비고']
  "flt11_init_buy_date" "date" [note: '최초매수일']
  "flt11_pur_price" "numeric" [note: '취득단가']
  "flt11_pur_amt" "numeric" [note: '취득금액']
  "flt11_item_cd" "character varying(12)" [note: '종목코드']

  indexes {
    (flt11_company_id, flt11_person_id, flt11_book_date) [name: 'flt11_book_idx01']
    (flt11_company_id, flt11_person_id, flt11_account_id, flt11_book_date) [name: 'flt11_book_idx02']
  }

  Note: '임직원 금융상품 보유내역'
}

Table "public"."flt12_book_month" {
  "flt12_book_month_id" "numeric" [pk, note: '보유내역ID(PK)']
  "flt12_company_id" "numeric" [not null, note: '회사ID']
  "flt12_person_id" "numeric" [not null, note: '사원ID']
  "flt12_account_id" "numeric" [note: '계좌ID(FLT03_ACCOUNT_ID)']
  "flt12_item_nm" "character varying(100)" [note: '종목명']
  "flt12_item_type" "character varying(2)" [note: '종목유형코드(flt05_item_type_cd)']
  "flt12_book_date" "date" [note: '보유기준일']
  "flt12_book_amt" "numeric" [note: '보유금액']
  "flt12_item_cd" "character varying(12)" [note: '종목코드']

  indexes {
    (flt12_company_id, flt12_person_id) [name: 'flt12_book_month_idx01']
    (flt12_company_id, flt12_person_id, flt12_book_date) [name: 'flt12_book_month_idx02']
    (flt12_company_id, flt12_person_id, flt12_book_date, flt12_account_id) [name: 'flt12_book_month_idx03']
  }

  Note: '임직원 금융상품 보유내역(월말잔고 직접입력)'
}

Table "public"."flt13_book_init" {
  "flt13_book_init_id" "numeric" [pk, note: '임직원 금융상품 보유내역(최초원장)ID(PK)']
  "flt13_company_id" "numeric" [note: '회사ID']
  "flt13_person_id" "numeric" [note: '사원ID']
  "flt13_account_id" "numeric" [note: '계좌ID(flt03_account_id)']
  "flt13_item_nm" "character varying(100)" [note: '종목명']
  "flt13_item_type" "character varying(2)" [note: '종목유형코드(flt05_item_type_cd)']
  "flt13_book_date" "date" [note: '보유일자']
  "flt13_book_amt" "numeric" [note: '보유금액']
  "flt13_book_qty" "numeric" [note: '보유수량']
  "flt13_note" "character varying(100)" [note: '비고']
  "flt13_item_cd" "character varying(12)" [note: '종목코드']

  indexes {
    (flt13_company_id, flt13_person_id) [name: 'flt13_book_init_idx01']
    (flt13_person_id, flt13_account_id) [name: 'flt13_book_init_idx02']
  }

  Note: '임직원 금융상품 보유내역(최초원장)'
}

Table "public"."flt14_relate_appr" {
  "flt14_relate_appr_id" "numeric" [pk, note: '임직원매매 정기보고 상신문서 연결ID(PK)']
  "flt14_person_id" "numeric" [note: '사원ID']
  "flt14_std_date" "date" [note: '기준일(보고월말일)']
  "flt14_appr_id" "numeric" [note: '상신ID']
  "flt14_check_cycle" "character varying(1)" [note: '점검주기(flt02_check_cycle, FloorTrCheckCycle-1:분기별/2:월별)']

  indexes {
    (flt14_person_id, flt14_std_date) [name: 'flt14_relate_appr_idx01']
  }

  Note: '임직원매매 정기보고 상신문서 연결'
}

Table "public"."flt15_tr_status" {
  "flt15_tr_status_id" "numeric" [pk, note: '임직원매매현황ID(PK)']
  "flt15_company_id" "numeric" [note: '회사ID']
  "flt15_person_id" "numeric" [note: '사원ID']
  "flt15_date" "date" [note: '기준일']
  "flt15_note" "text" [note: '비고']

  indexes {
    (flt15_person_id, flt15_date) [name: 'flt15_tr_status_idx01']
  }

  Note: '임직원매매현황'
}

```
