# 테이블: icam

15개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `icam01_data_info` | ICAM 데이터 정보기본 | 7 |
| `icam02_data` | ICAM 데이터 | 22 |
| `icam03_fund` | ICAM 펀드기본 | 41 |
| `icam04_item` | ICAM 종목기본 | 10 |
| `icam05_fund_item` | ICAM 펀드별 보유종목 | 7 |
| `icam06_fund_book` | ICMA 펀드원장 | 22 |
| `icam10_fee` | ICAM펀드보수 당일발생내역 | 20 |
| `icam11_fee_deposit` | ICAM펀드보수 입금계좌 | 7 |
| `icam12_fee_book` | ICAM펀드보수 월말잔액 | 15 |
| `icam13_fee_book_check` | ICAM펀드보수 월말 잔액대사 결과 | 7 |
| `icam20_price` | ICAM시세정보 | 13 |
| `icam25_ipo` | ICMA공모주 | 10 |
| `icam50_source` | ICAM DB소스 | 9 |
| `icam51_source_tmp` | ICAM all_source | 9 |
| `icam55_icam_user` | ICAM 사용자ID 관리 | 22 |

## DBML

```dbml
Table "public"."icam01_data_info" {
  "icam01_data_info_id" "numeric" [pk, note: 'ICAM 데이터 정보기본(PK)']
  "icam01_info_cd" "character varying(4)" [not null, note: '정보코드']
  "icam01_info_nm" "character varying(200)" [not null, note: '정보명']
  "icam01_tr_cd" "character varying(4)" [not null, note: '거래코드']
  "icam01_tr_nm" "character varying(200)" [not null, note: '거래명']
  "icam01_ics_class_tree_id" "numeric" [note: '내부통제분류ID']
  "icam01_note" "character varying(200)" [note: '비고']

  Note: 'ICAM 데이터 정보기본'
}

Table "public"."icam02_data" {
  "icam02_data_id" "numeric" [pk, note: 'ICAM 데이터(PK)']
  "icam02_icam_company_cd" "character varying(8)" [not null, note: 'ICAM회사(운용사)코드']
  "icam02_icam_date" "date" [not null, note: 'ICAM자료생성일']
  "icam02_fund_cd" "character varying(12)" [note: '펀드코드']
  "icam02_fund_nm" "character varying(100)" [note: '펀드명']
  "icam02_item_cd" "character varying(12)" [note: '종목코드']
  "icam02_item_nm" "character varying(200)" [note: '종목명']
  "icam02_seq" "numeric" [note: '순번']
  "icam02_info_cd" "character varying(4)" [not null, note: '정보코드']
  "icam02_tr_cd" "character varying(4)" [not null, note: '거래코드']
  "icam02_asset_cd" "character varying(7)" [note: '자산(유가증권)구분코드 (select * from SZX0GR where gr_cd like \'96\')']
  "icam02_asset_nm" "character varying(100)" [note: '자산(유가증권)구분명']
  "icam02_tgt_date" "date" [note: '대상(예정)일자']
  "icam02_tgt_amt" "numeric" [note: '대상(예정)금액']
  "icam02_tgt_std_date" "date" [note: '대상기준일자']
  "icam02_note" "character varying(500)" [note: '상세내용']
  "icam02_ics_class_tree_id" "numeric" [note: '내부통제분류ID']
  "icam02_ics_deadline_id" "numeric" [note: '내부통제기한ID']
  "icam02_create_date" "timestamp without time zone" [note: '생성일시']
  "icam02_creater" "character varying(50)" [note: '생성자']
  "icam02_confirm_yn" "character varying(5)" [note: '확인여부']
  "icam02_confirm_person_id" "numeric" [note: '확인자ID']

  indexes {
    (icam02_icam_company_cd) [name: 'icam02_data_idx01']
    (icam02_icam_company_cd, icam02_tgt_date) [name: 'icam02_data_idx02']
  }

  Note: 'ICAM 데이터'
}

Table "public"."icam03_fund" {
  "icam03_fund_id" "numeric" [pk, note: 'ICAM 펀드기본(PK)']
  "icam03_icam_company_cd" "character varying(8)" [not null, note: 'ICAM회사코드(ICAM - CORP_GR 코드)']
  "icam03_icam_company_nm" "character varying(200)" [note: 'ICAM회사명']
  "icam03_std_date" "date" [not null, note: '기준일자']
  "icam03_fund_cd" "character varying(12)" [not null, note: '펀드코드']
  "icam03_fund_nm" "character varying(200)" [not null, note: '펀드명']
  "icam03_kofia_fund_cd" "character varying(12)" [note: '협회등록코드']
  "icam03_trust_cd" "character varying(1)" [note: '신탁구분(select * from SZX0GR where gr_cd = \'AA\')']
  "icam03_fund_type_cd" "character varying(2)" [note: '펀드유형(select * from SZX0GR where gr_cd = \'17\' ⇒ \'AB\')']
  "icam03_public_cd" "character varying(1)" [note: '공모/사모코드(select * from SZX0GR where gr_cd = \'AC\')']
  "icam03_parent_cd" "character varying(1)" [note: '모자구분코드(select * from SZX0GR where gr_cd = \'AD\')']
  "icam03_class_type_cd" "character varying(1)" [note: '클래스구분코드(select * from SZX0GR where gr_cd = \'AE\')']
  "icam03_fund_unit_cd" "character varying(1)" [note: '단위구분(select * from SZX0GR where gr_cd = \'AF\')']
  "icam03_char_class_cd" "character varying(2)" [note: '특성분류코드(select * from SZX0GR where gr_cd = \'AI\')']
  "icam03_set_date" "date" [note: '설정일']
  "icam03_end_date" "date" [note: '해지일']
  "icam03_end_expect_date" "date" [note: '만기예정일']
  "icam03_operator1" "character varying(50)" [note: '운용역1']
  "icam03_operator2" "character varying(50)" [note: '운용역2']
  "icam03_opr_dept" "character varying(50)" [note: '운용부서']
  "icam03_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "icam03_consignment_nm" "character varying(50)" [note: '수탁사명']
  "icam03_trust_bank_cd" "character varying(5)" [note: '수탁은행코드']
  "icam03_trust_bank_nm" "character varying(50)" [note: '수탁은행명']
  "icam03_office_work_cd" "character varying(5)" [note: '사무수탁사코드']
  "icam03_office_work_nm" "character varying(50)" [note: '사무수탁사명']
  "icam03_cur" "character varying(3)" [note: '기준통화']
  "icam03_close_date" "date" [note: '다음결산일']
  "icam03_fee_date" "date" [note: '다음보수인출일']
  "icam03_work_date" "timestamp without time zone" [note: '작업일시']
  "icam03_worker" "character varying(50)" [note: '작업자']
  "icam03_ksd_fund_cd" "character varying(12)" [note: '예탁원등록코드']
  "icam03_ksd_item_cd" "character varying(12)" [note: '예탁원등록종목코드']
  "icam03_management_rate" "numeric" [note: '운용보수율(bp)']
  "icam03_sales_rate" "numeric" [note: '판매보수율(bp)']
  "icam03_consignment_rate" "numeric" [note: '수탁보수율(bp)']
  "icam03_office_work_rate" "numeric" [note: '사무수탁보수율(bp)']
  "icam03_set_amt" "numeric" [note: '설정액']
  "icam03_nav" "numeric" [note: '순자산액(NetAssetValue)']
  "icam03_diff_div_yn" "character varying(5)" [note: '손익차등분배여부']
  "icam03_fund_full_nm" "text" [note: '펀드명(Full)']

  indexes {
    (icam03_icam_company_cd, icam03_std_date) [name: 'icam03_fund_idx01']
    (icam03_icam_company_cd, icam03_std_date, icam03_fund_cd) [name: 'icam03_fund_idx02']
  }

  Note: 'ICAM 펀드기본'
}

Table "public"."icam04_item" {
  "icam04_item_id" "numeric" [pk, note: '종목ID(PK)']
  "icam04_icam_company_cd" "character varying(8)" [not null, note: 'ICAM회사코드']
  "icam04_item_cd" "character varying(12)" [not null, note: '종목코드']
  "icam04_item_nm" "character varying(200)" [not null, note: '종목명']
  "icam04_isin" "character varying(12)" [note: '표준코드']
  "icam04_item_l_class" "character varying(200)" [note: '종목대분류']
  "icam04_item_m_class" "character varying(200)" [note: '종목중분류']
  "icam04_item_s_class" "character varying(200)" [note: '종목소분류']
  "icam04_work_date" "timestamp without time zone" [note: '작업일시']
  "icam04_worker" "character varying(50)" [note: '작업자']

  Note: 'ICAM 종목기본'
}

Table "public"."icam05_fund_item" {
  "icam05_fund_item_id" "numeric" [pk, note: '펀드별 보유종목ID(PK)']
  "icam05_icam_company_cd" "character varying(8)" [not null, note: 'ICAM회사코드']
  "icam05_std_date" "date" [not null, note: '기준일자']
  "icam05_fund_cd" "character varying(12)" [not null, note: '펀드코드']
  "icam05_item_cd" "character varying(12)" [not null, note: '종목코드']
  "icam05_work_date" "timestamp without time zone" [note: '작업일시']
  "icam05_worker" "character varying(50)" [note: '작업자']

  Note: 'ICAM 펀드별 보유종목'
}

Table "public"."icam06_fund_book" {
  "icam06_fund_book_id" "numeric" [pk, note: 'ICMA펀드원장ID(PK)']
  "icam06_icam_company_cd" "character varying(8)" [not null, note: 'ICAM회사코드(CORP_GR)']
  "icam06_std_date" "date" [not null, note: '기준일자']
  "icam06_fund_cd" "character varying(12)" [not null, note: '펀드코드']
  "icam06_fund_nm" "character varying(200)" [note: '펀드명']
  "icam06_multi_class_cd" "character varying(12)" [note: 'Multi Class 운용 펀드코드']
  "icam06_cur" "character varying(3)" [note: '펀드기준통화']
  "icam06_set_qty" "numeric" [note: '설정좌수']
  "icam06_set_amt" "numeric" [note: '설정금액']
  "icam06_principal" "numeric" [note: '원본액(투자원금)']
  "icam06_nav" "numeric" [note: '순자산액(NetAssetValue)']
  "icam06_total_asset" "numeric" [note: '자산총계']
  "icam06_std_price" "numeric" [note: '기준가']
  "icam06_work_date" "timestamp without time zone" [note: '작업일시']
  "icam06_worker" "character varying(50)" [note: '작업자']
  "icam06_tax_price" "numeric" [note: '과표기준가']
  "icam06_for_set_amt" "numeric" [note: '외화 설정금액']
  "icam06_for_principal" "numeric" [note: '외화 원본액(투자원금)']
  "icam06_for_nav" "numeric" [note: '외화 순자산액']
  "icam06_for_total_asset" "numeric" [note: '외화 자산총계']
  "icam06_for_std_price" "numeric" [note: '외화 기준가']
  "icam06_for_tax_price" "numeric" [note: '외화 과표기준가']

  indexes {
    (icam06_icam_company_cd, icam06_std_date) [name: 'icam06_fund_book_idx01']
  }

  Note: 'ICMA 펀드원장'
}

Table "public"."icam10_fee" {
  "icam10_fee_id" "numeric" [pk, note: 'ICAM 보수ID(PK)']
  "icam10_company_id" "numeric" [note: '회사ID']
  "icam10_std_date" "date" [note: '기준일자']
  "icam10_icam_company_cd" "character varying(8)" [note: 'ICAM회사코드(ICAM - CORP_GR 코드)']
  "icam10_icam_company_nm" "character varying(200)" [note: 'ICAM회사명']
  "icam10_fee_type" "character varying(5)" [note: '보수구분(FundFeeType, ICAM 계정과목 코드)']
  "icam10_rmk_cd" "character varying(3)" [note: '적요코드(szx0gy)']
  "icam10_rmk_nm" "character varying(100)" [note: '적요명']
  "icam10_drcr_type" "character varying(1)" [note: '차대구분(D:차변/C:대변)']
  "icam10_fund_cd" "character varying(12)" [note: '펀드코드']
  "icam10_fund_nm" "character varying(200)" [note: '펀드명']
  "icam10_fee" "numeric" [note: '보수']
  "icam10_cur_cd" "character varying(3)" [note: '통화코드']
  "icam10_fx_rate" "numeric" [note: '적용환율']
  "icam10_af_pay_date" "date" [note: '다음보수인출일']
  "icam10_bf_pay_date" "date" [note: '전보수인출일']
  "icam10_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "icam10_consignment_nm" "character varying(100)" [note: '수탁사명']
  "icam10_work_date" "timestamp without time zone" [note: '작업일시']
  "icam10_worker" "character varying(50)" [note: '작업자']

  indexes {
    (icam10_company_id, icam10_std_date, icam10_icam_company_cd) [name: 'icam10_fee_idx01']
  }

  Note: 'ICAM펀드보수 당일발생내역'
}

Table "public"."icam11_fee_deposit" {
  "icam11_fee_deposit_id" "numeric" [pk, note: 'ICAM 펀드보수 입금계좌ID(PK)']
  "icam11_company_id" "numeric" [note: '회사ID']
  "icam11_icam_company_cd" "character varying(8)" [note: 'ICAM회사코드(ICAM - CORP_GR 코드)']
  "icam11_fund_cd" "character varying(12)" [note: '펀드코드']
  "icam11_start_date" "date" [note: '기준시작일자']
  "icam11_deposit_id" "numeric" [note: '예금관리계좌ID(ast01_class_tree_id)']
  "icam11_note" "character varying(200)" [note: '비고']

  indexes {
    (icam11_company_id, icam11_icam_company_cd, icam11_fund_cd) [name: 'icam11_fee_deposit_idx01']
  }

  Note: 'ICAM펀드보수 입금계좌'
}

Table "public"."icam12_fee_book" {
  "icam12_fee_book_id" "numeric" [pk, note: 'ICAM펀드보수 당일잔액ID(PK)']
  "icam12_company_id" "numeric" [note: '회사ID']
  "icam12_icam_company_cd" "character varying(8)" [note: 'ICAM회사코드(ICAM - CORP_GR 코드)']
  "icam12_icam_company_nm" "character varying(200)" [note: 'ICAM회사명']
  "icam12_std_date" "date" [note: '기준일자']
  "icam12_fund_cd" "character varying(12)" [note: '펀드코드']
  "icam12_fund_nm" "character varying(200)" [note: '펀드명']
  "icam12_cur_cd" "character varying(3)" [note: '통화코드']
  "icam12_for_fee" "numeric" [note: '외화보수 당일잔액']
  "icam12_fee" "numeric" [note: '보수 당일잔액']
  "icam12_consignment_cd" "character varying(5)" [note: '수탁사코드']
  "icam12_consignment_nm" "character varying(100)" [note: '수탁사명']
  "icam12_note" "character varying(200)" [note: '비고']
  "icam12_work_date" "timestamp without time zone" [note: '작업일시']
  "icam12_worker" "character varying(50)" [note: '작업자']

  indexes {
    (icam12_company_id, icam12_std_date, icam12_icam_company_cd) [name: 'icam12_fee_book_idx01']
    (icam12_company_id, icam12_std_date) [name: 'icam12_fee_book_idx02']
  }

  Note: 'ICAM펀드보수 월말잔액'
}

Table "public"."icam13_fee_book_check" {
  "icam13_fee_book_check_id" "numeric" [pk, note: 'ICAM펀드보수 월말 잔액대사 결과ID(PK)']
  "icam13_company_id" "numeric" [not null, note: '회사ID']
  "icam13_std_date" "date" [note: '기준일자']
  "icam13_result" "text" [note: '결과']
  "icam13_diff_amt" "numeric" [note: '차이금액']
  "icam13_worker" "numeric" [note: '작업자']
  "icam13_work_date" "timestamp without time zone" [note: '작업일시']

  Note: 'ICAM펀드보수 월말 잔액대사 결과'
}

Table "public"."icam20_price" {
  "icam20_price_id" "numeric" [pk, note: 'ICAM시세정보ID(PK)']
  "icam20_std_date" "date" [not null, note: '기준일자']
  "icam20_item_type" "character varying(4)" [not null, note: '종목구분(ItemMClassCode001-2010:주식/2050:집합투자증권)']
  "icam20_item_cd" "character varying(12)" [not null, note: '종목코드(주식인경우 코스콤코드, 펀드인경우 예탁원코드)']
  "icam20_item_nm" "character varying(200)" [note: '종목명']
  "icam20_koscom_cd" "character varying(12)" [note: '코스콤코드(단축코드)']
  "icam20_isin" "character varying(12)" [note: '표준코드']
  "icam20_ksd_item_cd" "character varying(12)" [note: '예탁원종목코드']
  "icam20_close_price" "numeric" [note: '종가(기준가)']
  "icam20_pre_close_price" "numeric" [note: '전일종가(전일기준가)']
  "icam20_market_type" "character varying(1)" [note: '시장구분(IcamMarketCode-A:시장/B:비시장/..)']
  "icam20_work_date" "timestamp without time zone" [note: '작업일시']
  "icam20_worker" "character varying(100)" [note: '작업자']

  indexes {
    (icam20_std_date, icam20_item_type, icam20_item_cd) [name: 'icam20_price_idx01']
    (icam20_std_date, icam20_item_type) [name: 'icam20_price_idx02']
    (icam20_std_date, icam20_item_type, icam20_isin) [name: 'icam20_price_idx03']
  }

  Note: 'ICAM시세정보'
}

Table "public"."icam25_ipo" {
  "icam25_ipo_id" "numeric" [pk, note: 'ICMA공모주ID(PK)']
  "icam25_item_nm" "character varying(120)" [not null, note: '종목명']
  "icam25_iss_corp_cd" "character varying(5)" [not null, note: '발행기관코드']
  "icam25_start_date" "date" [not null, note: '청약시작일']
  "icam25_close_date" "date" [not null, note: '청약종료일']
  "icam25_company_count" "numeric" [note: '청약신청회사건수']
  "icam25_work_date" "timestamp without time zone" [note: '작업일시']
  "icam25_worker" "character varying(50)" [note: '작업자']
  "icam25_total_company_count" "numeric" [note: 'ICAM운용사 전체건수']
  "icam25_reg_rate" "numeric" [note: '청약률(%) - ICAM사용 운용사 기준']

  indexes {
    (icam25_start_date, icam25_iss_corp_cd) [name: 'icam25_ipo_idx01']
  }

  Note: 'ICMA공모주'
}

Table "public"."icam50_source" {
  "icam50_source_id" "numeric" [pk, note: 'ICAM DB소스ID(PK)']
  "icam50_server_type" "character varying(50)" [note: '서버구분']
  "icam50_std_date" "date" [note: '기준일자']
  "icam50_owner" "character varying(50)" [note: '소스Owner']
  "icam50_type" "character varying(50)" [note: '소스구분']
  "icam50_name" "character varying(100)" [note: '소스명']
  "icam50_text" "text" [note: '소스내용']
  "icam50_line_cnt" "numeric" [note: '라인수']
  "icam50_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (icam50_std_date, icam50_server_type, icam50_owner, icam50_type, icam50_name) [name: 'icam50_source_idx01']
  }

  Note: 'ICAM DB소스'
}

Table "public"."icam51_source_tmp" {
  "icam51_source_tmp_id" "numeric" [pk, note: 'ICAM all_sourceID(PK)']
  "icam51_server_type" "character varying(50)" [note: '서버구분']
  "icam51_std_date" "date" [note: '기준일자']
  "icam51_owner" "character varying(50)" [note: '소스Owner']
  "icam51_type" "character varying(50)" [note: '소스구분']
  "icam51_name" "character varying(100)" [note: '소스명']
  "icma51_line" "numeric" [note: '소스Line']
  "icam51_text" "text" [note: '소스Text']
  "icam51_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (icam51_std_date) [name: 'icam51_source_tmp_idx01']
    (icam51_std_date, icam51_name) [name: 'icam51_source_tmp_idx02']
    (icam51_std_date, icam51_server_type, icam51_owner, icam51_type, icam51_name) [name: 'icam51_source_tmp_idx03']
  }

  Note: 'ICAM all_source'
}

Table "public"."icam55_icam_user" {
  "icam55_icam_user_id" "numeric" [pk, note: 'ICAM 사용자ID 관리ID(PK)']
  "icam55_reg_date" "date" [not null, note: '신청(기준)일자']
  "icam55_reg_type" "character varying(1)" [not null, note: '신청구분(IcamUserRegType - 1:사용자ID 신청/2:미사용ID 권한정지 신청)']
  "icam55_company_nm" "character varying(100)" [not null, note: '회사명']
  "icam55_user_nm" "character varying(100)" [not null, note: '사용자명']
  "icam55_user_id" "character varying(100)" [note: '사용자ID']
  "icam55_proc_add_yn" "character varying(5)" [note: '처리구분-추가']
  "icam55_proc_modi_yn" "character varying(5)" [note: '처리구분-변경']
  "icam55_proc_del_yn" "character varying(5)" [note: '처리구분-삭제']
  "icam55_proc_stop_yn" "character varying(5)" [note: '처리구분-정지']
  "icam55_appr_id" "numeric" [note: '상신ID']
  "icam55_proc_state_cd" "character varying(1)" [note: '처리상태코드(ProcStateCode - 1:완료/9:이행불가)']
  "icam55_proc_note" "text" [note: '처리상세']
  "icam55_proc_date" "date" [note: '처리일자(권한정지일)']
  "icam55_del_date" "date" [note: '사용자ID 삭제일자']
  "icam55_unstop_date" "date" [note: '권한정지 해제일자']
  "icam55_note" "text" [note: '비고']
  "icam55_reg_emp_id" "numeric" [note: '등록자ID']
  "icam55_proc_emp_id" "numeric" [note: '신청서 처리자ID']
  "icam55_mng_emp_id" "numeric" [note: '미사용ID 기록관리자ID']
  "icam55_email" "character varying(100)" [note: '이메일']
  "icam55_reg_content" "text" [note: '신청내용']

  indexes {
    (icam55_reg_date) [name: 'icam55_icam_user_idx01']
    (icam55_reg_type, icam55_reg_date) [name: 'icam55_icam_user_idx02']
  }

  Note: 'ICAM 사용자ID 관리'
}

```
