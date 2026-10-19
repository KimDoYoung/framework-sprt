# 테이블: biz

24개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `biz01_promo` | 이익제공(수령) 내역 | 25 |
| `biz02_person` | 이익제공(수령) 인원정보 | 7 |
| `biz03_account_map` | 법인카드 사용항목별 계정과목 맵핑 | 5 |
| `biz04_provide_setup` | 이익제공(수령) 설정정보 | 4 |
| `biz05_relate_appr` | 상신문서 연결 | 7 |
| `biz10_cont_corp` | 계약사 관리 | 2 |
| `biz11_cont_history` | 계약사별 이력관리 | 18 |
| `biz12_fee_info` | 보수정보 | 9 |
| `biz13_with_corp` | 계약사 운영정보 | 7 |
| `biz14_relate_appr` | 연관문서 | 3 |
| `biz15_share` | 계약사 공유자관리 | 6 |
| `biz16_each_contract` | 개별계약서 | 13 |
| `biz17_dual_manage_fund` | 이중사무관리 펀드 | 9 |
| `biz20_fee_charge` | 최저보수청구 | 27 |
| `biz21_fee_charge_dtl` | 최저보수청구 상세내역 | 16 |
| `biz22_fee_charge_calc` | 최저보수청구 구간계산정보 | 27 |
| `biz29_account` | 보수입금계좌 | 9 |
| `biz50_erp_setup` | AssetERP 기본설정 | 15 |
| `biz51_erp_cont_corp` | AssetERP 계약사 관리 | 17 |
| `biz52_erp_fee` | AssetERP 계약사별 사용료 설정 | 21 |
| `biz55_erp_fee_charge` | AssetERP 사용료 청구 | 26 |
| `biz60_fund_price_modi` | 기준가정정보고 | 34 |
| `biz61_modi_rpt_relate_appr` | 기준가정정보고 월상신 | 4 |
| `biz90_limit` | 이익제공(수령) 한도관리 | 9 |

## DBML

```dbml
Table "public"."biz01_promo" {
  "biz01_promo_id" "numeric" [pk, note: '이익제공(수령) 내역ID(PK)']
  "biz01_company_id" "numeric" [not null, note: '회사ID']
  "biz01_provide_date" "date" [not null, note: '제공(수령)일자']
  "biz01_provide_rcv_type" "character varying(1)" [not null, note: '제공/수령 구분(ProvideRcvType(1:이익제공/2:이익수령))']
  "biz01_settle_type" "character varying(1)" [note: '결제구분(SettleType(1:법인카드/2:현예금))']
  "biz01_card_data_id" "numeric" [note: '법인카드내역ID(crd02_data_id)']
  "biz01_card_id" "numeric" [note: '법인카드관리ID(crd01_card_id)']
  "biz01_buy_id" "numeric" [note: '물품구매내역ID(bmt01_buy_id)']
  "biz01_provide_pur_cd" "character varying(2)" [note: '제공(수령)목적코드(ProvidePurCode(10:판매(일반)/11:판매(경조)/20:운용(일반)/..))']
  "biz01_provide_content_cd" "character varying(4)" [note: '제공(수령)내용코드(ProvideContentCode(1001:식사/..))']
  "biz01_provide_amt" "numeric" [note: '제공(수령)금액']
  "biz01_person_id" "numeric" [note: '제공(수령)자ID (담당자)']
  "biz01_reg_emp_id" "numeric" [note: '등록자ID']
  "biz01_appr_id1" "numeric" [note: '상신ID (한도초과 사전승인 신청서 - 인별1회)']
  "biz01_appr_id2" "numeric" [note: '상신ID (한도초과 사전승인 신청서 - 인별연간)']
  "biz01_appr_id3" "numeric" [note: '상신ID (한도초과 사전승인 신청서 - 회사별연간)']
  "biz01_note" "character varying(200)" [note: '비고']
  "biz01_close_yn" "character varying(5)" [note: '마감여부']
  "biz01_account_code_id" "numeric" [note: '계정코드ID']
  "biz01_tax" "numeric" [note: '세금']
  "biz01_std_ym" "character varying(7)" [note: '기준년월(YYYY.MM)']
  "biz01_tax_type" "character varying(1)" [note: '과세구분(TaxType-1:면세/2:과세/3:공통)']
  "biz01_peple_count" "numeric" [note: '인원']
  "biz01_provide_company" "character varying(200)" [note: '제공(수령)회사(거래상대방)']
  "biz01_real_person_id" "numeric" [note: '실사용자ID']

  indexes {
    (biz01_company_id, biz01_provide_date) [name: 'biz01_promo_idx01']
  }

  Note: '이익제공(수령) 내역'
}

Table "public"."biz02_person" {
  "biz02_person_id" "numeric" [pk, note: '이익제공(수령) 인원정보ID(PK)']
  "biz02_promo_id" "numeric" [not null, note: '이익제공(수령) 내역ID']
  "biz02_emp_yn" "character varying(5)" [not null, note: '사원여부(true/false)']
  "biz02_emp_id" "numeric" [note: '사원ID']
  "biz02_target_company_nm" "character varying(100)" [note: '상대회사명']
  "biz02_target_emp_nm" "character varying(50)" [note: '상대직원명']
  "biz02_target_org_nm" "character varying(100)" [note: '상대직원부서명']

  indexes {
    (biz02_promo_id) [name: 'biz02_person_idx01']
  }

  Note: '이익제공(수령) 인원정보'
}

Table "public"."biz03_account_map" {
  "biz03_account_map_id" "numeric" [pk, note: '계정과목 맵핑ID(PK)']
  "biz03_company_id" "numeric" [note: '회사ID']
  "biz03_use_item_cd" "character varying(2)" [note: '법인카드 사용항목코드(BizCardUseItemCode)']
  "biz03_account_code_id" "numeric" [note: '계정과목ID(act01_account_code_id)']
  "biz03_note" "text" [note: '비고']

  indexes {
    (biz03_company_id, biz03_account_code_id) [name: 'biz03_account_map_idx01']
  }

  Note: '법인카드 사용항목별 계정과목 맵핑'
}

Table "public"."biz04_provide_setup" {
  "biz04_provide_setup_id" "numeric" [pk, note: '이익제공(수령) 설정정보ID(PK)']
  "biz04_company_id" "numeric" [note: '회사ID']
  "biz04_provide_content_cd" "character varying(4)" [note: '이익제공(수령)내용코드(ProvideContentCode)']
  "biz04_emp_set_yn" "character varying(5)" [note: '직원자동설정여부']

  indexes {
    (biz04_company_id) [name: 'biz04_provide_setup_idx01']
  }

  Note: '이익제공(수령) 설정정보'
}

Table "public"."biz05_relate_appr" {
  "biz05_relate_appr_id" "numeric" [pk, note: '상신문서 연결ID(PK)']
  "biz05_promo_id" "numeric" [note: '이익제공(수령) 내역ID(biz01_promo_id)']
  "biz05_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']
  "biz05_company_id" "numeric" [note: '회사ID']
  "biz05_std_ym" "character varying(7)" [note: '기준년월(YYYY.MM)']
  "biz05_link_cd" "character varying(3)" [note: '링크코드(LinkCode)']
  "biz05_person_id" "numeric" [note: '상신자ID(링크코드 A41-이익제공(법인카드) 사용내역보고인 경우)']

  indexes {
    (biz05_promo_id) [name: 'biz05_relate_appr_idx01']
  }

  Note: '상신문서 연결'
}

Table "public"."biz10_cont_corp" {
  "biz10_cont_corp_id" "numeric" [pk, note: '계약사 관리ID(PK)']
  "biz10_company_id" "numeric" [note: '회사ID']

  indexes {
    (biz10_company_id) [name: 'biz10_cont_corp_idx01']
  }

  Note: '계약사 관리'
}

Table "public"."biz11_cont_history" {
  "biz11_cont_history_id" "numeric" [pk, note: '계약사별 이력관리ID(PK)']
  "biz11_cont_corp_id" "numeric" [not null, note: '계약사 관리ID(biz10_cont_corp_id)']
  "biz11_reg_date" "date" [note: '등록일자']
  "biz11_cont_corp_nm" "character varying(100)" [note: '계약사명']
  "biz11_cont_status_cd" "character varying(1)" [note: '계약상태(ContStatusCode)']
  "biz11_corp_status_cd" "character varying(2)" [note: '거래유무코드(고객상태)(ContCorpStatusCode)']
  "biz11_tr_type" "character varying(50)" [note: '거래형태']
  "biz11_cont_period_cd" "character varying(2)" [note: '계약기간코드(ContPeriodCode)']
  "biz11_cont_date" "date" [note: '(재)계약일자']
  "biz11_start_date" "date" [note: '거래개시일자']
  "biz11_close_date" "date" [note: '거래종료일자']
  "biz11_base_fee" "character varying(50)" [note: '기본보수(bp)']
  "biz11_manager" "character varying(100)" [note: '계약사 담당자명']
  "biz11_manager_tel" "character varying(100)" [note: '계약사 담당자연락처']
  "biz11_note" "character varying(500)" [note: '비고']
  "biz11_person_id" "numeric" [note: '담당자ID']
  "biz11_address" "character varying(200)" [note: '주소']
  "biz11_ceo" "character varying(50)" [note: '대표이사']

  indexes {
    (biz11_cont_corp_id) [name: 'biz11_cont_history_idx01']
    (biz11_cont_corp_id, biz11_reg_date) [name: 'biz11_cont_history_idx02']
  }

  Note: '계약사별 이력관리'
}

Table "public"."biz12_fee_info" {
  "biz12_fee_info_id" "numeric" [pk, note: '보수정보ID(PK)']
  "biz12_cont_history_id" "numeric" [not null, note: '계약사별 이력관리ID(biz11_cont_history_id)']
  "biz12_min_fee_yn" "character varying(5)" [note: '최저보수여부']
  "biz12_manage_min_fee" "numeric" [note: '운용최저보수(연)']
  "biz12_adv_min_fee" "numeric" [note: '자문최저보수(연)']
  "biz12_discr_min_fee" "numeric" [note: '일임최저보수(연)']
  "biz12_fee_charge_type" "character varying(1)" [note: '보수청구구분(FundFeeChargeType)']
  "biz12_with_yn" "character varying(5)" [note: '병행보수여부']
  "biz12_with_fee" "numeric" [note: '병행보수(연)']

  indexes {
    (biz12_cont_history_id) [name: 'biz12_fee_info_idx01']
  }

  Note: '보수정보'
}

Table "public"."biz13_with_corp" {
  "biz13_with_corp_id" "numeric" [pk, note: '계약사 운영정보ID(PK)']
  "biz13_cont_corp_id" "numeric" [note: '계약사 관리ID(biz10_cont_corp_id)']
  "biz13_company_id" "numeric" [note: '회사ID']
  "biz13_manage_type" "character varying(1)" [note: '운영구분(ManageType)']
  "biz13_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "biz13_first_start_date" "date" [note: '최초업무시작일']
  "biz13_last_close_date" "date" [note: '최종업무종료일']

  indexes {
    (biz13_cont_corp_id) [name: 'biz13_with_corp_idx01']
    (biz13_corp_id) [name: 'biz13_with_corp_idx02']
  }

  Note: '계약사 운영정보'
}

Table "public"."biz14_relate_appr" {
  "biz14_relate_appr_id" "numeric" [pk, note: '연관문서ID(PK)']
  "biz14_appr_id" "numeric" [not null, note: '상신ID(apr01_appr_id)']
  "biz14_cont_history_id" "numeric" [not null, note: '계약사별 이력관리ID(biz11_cont_history_id)']

  indexes {
    (biz14_cont_history_id) [name: 'biz14_relate_appr_idx01']
  }

  Note: '연관문서'
}

Table "public"."biz15_share" {
  "biz15_share_id" "numeric" [pk, note: '계약사 공유자관리ID(PK)']
  "biz15_cont_history_id" "numeric" [not null, note: '계약사별 이력관리ID']
  "biz15_share_cd" "character varying(1)" [not null, note: '공유자 구분(직원/부서)']
  "biz15_person_id" "numeric" [note: '공유자ID']
  "biz15_org_id" "numeric" [note: '공유 부서ID']
  "biz15_company_id" "numeric" [note: '회사ID']

  Note: '계약사 공유자관리'
}

Table "public"."biz16_each_contract" {
  "biz16_each_contract_id" "numeric" [pk, note: '개별계약서ID(PK)']
  "biz16_company_id" "numeric" [not null, note: '회사ID']
  "biz16_cont_corp_id" "numeric" [not null, note: '계약사 관리ID(biz10_cont_corp_id)']
  "biz16_date" "date" [note: '계약일']
  "biz16_fund_nm" "character varying(200)" [note: '집합투자기구명']
  "biz16_fund_type" "character varying(200)" [note: '투자신탁의 형태']
  "biz16_fund_fee" "character varying(50)" [note: '일반사무관리보수율']
  "biz16_cont_start_date" "date" [note: '계약시작일']
  "biz16_cont_close_date" "date" [note: '계약종료일']
  "biz16_reason" "character varying(300)" [note: '개별계약사유']
  "biz16_note" "character varying(500)" [note: '비고']
  "biz16_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']
  "biz16_fund_start_date" "date" [note: '펀드설정일']

  Note: '개별계약서'
}

Table "public"."biz17_dual_manage_fund" {
  "biz17_dual_manage_fund_id" "numeric" [pk, note: '이중사무관리 펀드ID(PK)']
  "biz17_company_id" "numeric" [not null, note: '회사ID']
  "biz17_cont_corp_id" "numeric" [not null, note: '계약사 관리ID(biz10_cont_corp_id)']
  "biz17_fund_cd" "character varying(12)" [note: '펀드코드']
  "biz17_start_date" "date" [note: '적용시작일']
  "biz17_fund_fee" "numeric" [note: '사무관리보수율(bp)']
  "biz17_fund_sub_fee" "numeric" [note: '부사무관리보수율(bp)']
  "biz17_note" "character varying(500)" [note: '비고']
  "biz17_position_type" "character varying(1)" [note: '펀드사무관리 포지션구분(FundMngPositionType - 1:주사무/2:부사무)']

  Note: '이중사무관리 펀드'
}

Table "public"."biz20_fee_charge" {
  "biz20_fee_charge_id" "numeric" [pk, note: '최저보수청구ID(PK)']
  "biz20_company_id" "numeric" [note: '회사ID']
  "biz20_charge_date" "date" [note: '청구일자']
  "biz20_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "biz20_occ_start_date" "date" [note: '발생기간시작일자']
  "biz20_occ_close_date" "date" [note: '발생기간종료일자']
  "biz20_occ_days" "numeric" [note: '발생일수']
  "biz20_occ_fee" "numeric" [note: '발생보수']
  "biz20_min_start_date" "date" [note: '최저보수시작일자']
  "biz20_min_close_date" "date" [note: '최저보수종료일자']
  "biz20_min_days" "numeric" [note: '최저보수일수']
  "biz20_min_fee" "numeric" [note: '최저보수']
  "biz20_with_start_date" "date" [note: '병행기간시작일자']
  "biz20_with_close_date" "date" [note: '병행기간종료일자']
  "biz20_with_days" "numeric" [note: '병행일수']
  "biz20_with_fee" "numeric" [note: '병행보수']
  "biz20_target_yn" "character varying(5)" [note: '청구대상여부([(최저보수 - 발생보수) > 0]이면 true 아니면 false)']
  "biz20_charge_fee" "numeric" [note: '청구보수(최저보수 - 발생보수)']
  "biz20_tax" "numeric" [note: '세금']
  "biz20_fix_yn" "character varying(5)" [note: '확정여부']
  "biz20_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']
  "biz20_tr_id" "numeric" [note: '거래ID(ast06_tr_id)']
  "biz20_note" "character varying(200)" [note: '비고']
  "biz20_calc_start_date" "date" [note: '보수계산구간시작일자']
  "biz20_calc_close_date" "date" [note: '보수계산구간종료일자']
  "biz20_calc_days" "numeric" [note: '보수계산구간일수']
  "biz20_cont_corp_id" "numeric" [note: '계약사 관리ID(biz10_cont_corp_id)']

  indexes {
    (biz20_company_id, biz20_charge_date) [name: 'biz20_fee_charge_idx01']
    (biz20_company_id, biz20_charge_date, biz20_corp_id) [name: 'biz20_fee_charge_idx02']
  }

  Note: '최저보수청구'
}

Table "public"."biz21_fee_charge_dtl" {
  "biz21_fee_charge_dtl_id" "numeric" [pk, note: '최저보수청구 상세내역ID(PK)']
  "biz21_fee_charge_id" "numeric" [not null, note: '최저보수청구ID(biz20_fee_charge_id)']
  "biz21_company_id" "numeric" [note: '회사ID']
  "biz21_fund_cd" "character varying(12)" [note: '펀드코드']
  "biz21_fund_nm" "character varying(200)" [note: '펀드명']
  "biz21_cur_cd" "character varying(3)" [note: '통화코드']
  "biz21_occ_date" "date" [note: '보수발생일자']
  "biz21_total_net_asset" "numeric" [note: '순자산총액']
  "biz21_for_total_net_asset" "numeric" [note: '외화 순자산총액']
  "biz21_occ_fee" "numeric" [note: '발생보수']
  "biz21_for_occ_fee" "numeric" [note: '외화 발생보수']
  "biz21_create_date" "timestamp without time zone" [note: '생성일시']
  "biz21_fee_type_nm" "character varying(50)" [note: '보수구분명']
  "biz21_target_account_cnt" "numeric" [note: '대상계좌수']
  "biz21_change_account_cnt" "numeric" [note: '변동계좌수']
  "biz21_fee_rate" "numeric" [note: '보수율(bp)']

  indexes {
    (biz21_fee_charge_id) [name: 'biz21_fee_charge_dtl_idx01']
  }

  Note: '최저보수청구 상세내역'
}

Table "public"."biz22_fee_charge_calc" {
  "biz22_fee_charge_calc_id" "numeric" [pk, note: '최저보수청구 구간계산정보ID(PK)']
  "biz22_cont_corp_id" "numeric" [note: '계약사관리ID(biz10_cont_corp_id)']
  "biz22_charge_date" "date" [note: '청구일자']
  "biz22_term_start_date" "date" [note: '구간시작일']
  "biz22_term_close_date" "date" [note: '구간종료일']
  "biz22_term_days" "numeric" [note: '구간일수']
  "biz22_min_fee_yn" "character varying(5)" [note: '최저보수있음여부']
  "biz22_manage_min_fee" "numeric" [note: '운용-청구기간 최저보수']
  "biz22_manage_term_min_fee" "numeric" [note: '운용-구간 최저보수']
  "biz22_manage_term_occ_fee" "numeric" [note: '운용-구간 발생보수']
  "biz22_manage_term_with_fee" "numeric" [note: '운용-구간 병행보수']
  "biz22_manage_term_charge_fee" "numeric" [note: '운용-구간 청구보수']
  "biz22_adv_min_fee" "numeric" [note: '자문-청구기간 최저보수']
  "biz22_adv_term_min_fee" "numeric" [note: '자문-구간 최저보수']
  "biz22_adv_term_occ_fee" "numeric" [note: '자문-구간 발생보수']
  "biz22_adv_term_with_fee" "numeric" [note: '자문-구간 병행보수']
  "biz22_adv_term_charge_fee" "numeric" [note: '자문-구간 청구보수']
  "biz22_discr_min_fee" "numeric" [note: '일임-청구기간 최저보수']
  "biz22_discr_term_min_fee" "numeric" [note: '일임-구간 최저보수']
  "biz22_discr_term_occ_fee" "numeric" [note: '일임-구간 발생보수']
  "biz22_discr_term_with_fee" "numeric" [note: '일임-구간 병행보수']
  "biz22_discr_term_charge_fee" "numeric" [note: '일임-구간 청구보수']
  "biz22_with_yn" "character varying(5)" [note: '병행적용여부']
  "biz22_with_fee" "numeric" [note: '병행-청구기간 병행보수']
  "biz22_with_term_with_fee" "numeric" [note: '병행-구간 병행보수']
  "biz22_with_term_occ_fee" "numeric" [note: '병행-구간 발생보수']
  "biz22_with_term_charge_fee" "numeric" [note: '병행-구간 청구보수']

  Note: '최저보수청구 구간계산정보'
}

Table "public"."biz29_account" {
  "biz29_account_id" "numeric" [pk, note: '보수입금계좌ID(PK)']
  "biz29_company_id" "numeric" [note: '회사ID']
  "biz29_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']
  "biz29_start_date" "date" [note: '시작일자']
  "biz29_bank_cd" "character varying(3)" [note: '은행코드(BankCode)']
  "biz29_account_no" "character varying(50)" [note: '계좌번호']
  "biz29_account_nm" "character varying(50)" [note: '계좌명(예금주)']
  "biz29_ast_class_tree_id" "numeric" [note: '자산ID(ast01_class_tree_id)']
  "biz29_note" "character varying(200)" [note: '비고']

  indexes {
    (biz29_company_id, biz29_corp_id) [name: 'biz29_account_idx01']
  }

  Note: '보수입금계좌'
}

Table "public"."biz50_erp_setup" {
  "biz50_erp_setup_id" "numeric" [pk, note: 'AssetERP 기본설정ID(PK)']
  "biz50_start_date" "date" [note: '적용시작일']
  "biz50_sms_base_count" "numeric" [note: '기본제공 월문자건수']
  "biz50_sms_add_price" "numeric" [note: '추가건당 문자사용료(원)']
  "biz50_server_base_usage" "numeric" [note: '기본제공 서버사용량(GB)']
  "biz50_server_add_unit" "numeric" [note: '서버사용량 추가단위(GB)']
  "biz50_server_add_price" "numeric" [note: '서버사용량 추가단위당 금액(원)']
  "biz50_charge_day" "character varying(2)" [note: '월청구일(DateCode)']
  "biz50_vat_cd" "character varying(1)" [note: 'VAT구분(VatCode-1:별도/2:포함)']
  "biz50_note" "text" [note: '비고']
  "biz50_note_yn" "character varying(5)" [note: '메모전용으로 사용']
  "biz50_user_base_count" "numeric" [note: '기본제공 사용인원']
  "biz50_user_add_price" "numeric" [note: '추가인당 사용료(원)']
  "biz50_deposit_due_day" "character varying(2)" [note: '입금기한일']
  "biz50_mail_form" "text" [note: '사용료청구 메일 양식']

  Note: 'AssetERP 기본설정'
}

Table "public"."biz51_erp_cont_corp" {
  "biz51_erp_cont_corp_id" "numeric" [pk, note: 'AssetERP 계약사 관리ID(PK)']
  "biz51_cont_corp_nm" "character varying(100)" [note: '계약사명(사용X)']
  "biz51_service_type" "character varying(2)" [note: '서비스종류(ErpServiceType-10:구독형/20:구축형)']
  "biz51_first_cont_date" "date" [note: '최초계약일']
  "biz51_cont_date" "date" [note: '(재)계약일자']
  "biz51_cont_end_date" "date" [note: '계약종료일']
  "biz51_cont_status_cd" "character varying(1)" [note: '계약상태코드(ContStatusCode03-0:미계약/1:계약/9:계약종료)']
  "biz51_erp_start_date" "date" [note: '시스템 사용시작일']
  "biz51_erp_end_date" "date" [note: '시스템 사용종료일']
  "biz51_manager_nm" "character varying(50)" [note: '계약사 담당자']
  "biz51_manager_tel" "character varying(50)" [note: '계약사 담당자 연락처']
  "biz51_manager_email" "character varying(100)" [note: '계약사 담당자 이메일']
  "biz51_company_ceo" "character varying(50)" [note: '계약사 대표이사']
  "biz51_company_addr" "character varying(200)" [note: '계약사 주소']
  "biz51_note" "text" [note: '비고']
  "biz51_company_id" "numeric" [note: '회사ID(sys01_company_id)']
  "biz51_corp_id" "numeric" [note: '거래처ID(sys15_corp_id)']

  Note: 'AssetERP 계약사 관리'
}

Table "public"."biz52_erp_fee" {
  "biz52_erp_fee_id" "numeric" [pk, note: 'AssetERP 계약사별 사용료 설정ID(PK)']
  "biz52_erp_cont_corp_id" "numeric" [note: 'AssetERP 계약사 관리ID(biz51_erp_cont_corp_id)']
  "biz52_start_date" "date" [note: '적용시작일']
  "biz52_close_date" "date" [note: '적용종료일']
  "biz52_erp_fee" "numeric" [note: '시스템사용료(월)']
  "biz52_data_fee" "numeric" [note: 'DATA사용료(월)']
  "biz52_charge_day" "character varying(2)" [note: '월청구일(DateCode)']
  "biz52_vat_cd" "character varying(1)" [note: 'VAT구분(VatCode-1:별도/2:포함)']
  "biz52_deposit_due_day" "character varying(2)" [note: '입금기한일']
  "biz52_add_fee_sms_yn" "character varying(5)" [note: '추가요금청구여부_문자']
  "biz52_add_fee_server_yn" "character varying(5)" [note: '추가요금청구여부_서버']
  "biz52_add_fee_user_yn" "character varying(5)" [note: '추가요금청구여부_사용자']
  "biz52_sms_base_count" "numeric" [note: '기본제공 월문자건수']
  "biz52_sms_add_price" "numeric" [note: '추가건당 문자사용료(원)']
  "biz52_server_base_usage" "numeric" [note: '기본제공 서버사용량(GB)']
  "biz52_server_add_unit" "numeric" [note: '서버사용량 추가단위(GB)']
  "biz52_server_add_price" "numeric" [note: '서버사용량 추가단위당 금액(원)']
  "biz52_user_base_count" "numeric" [note: '기본제공 사용인원']
  "biz52_user_add_price" "numeric" [note: '추가인당 사용료(원)']
  "biz52_user_count_std_cd" "character varying(1)" [note: '인원산정기준월(UserCountStdMonthCode-1:전월말/2:전년도말)']
  "biz52_charge_calc_month_type" "character varying(1)" [note: '청구계산월구분(MonthType-1:당월/2:전월)']

  indexes {
    (biz52_erp_cont_corp_id) [name: 'biz52_erp_fee_idx01']
  }

  Note: 'AssetERP 계약사별 사용료 설정'
}

Table "public"."biz55_erp_fee_charge" {
  "biz55_erp_fee_charge_id" "numeric" [pk, note: 'AssetERP 사용료 청구ID(PK)']
  "biz55_charge_date" "date" [note: '청구일자']
  "biz55_start_date" "date" [note: '사용시작일']
  "biz55_close_date" "date" [note: '사용종료일']
  "biz55_erp_cont_corp_id" "numeric" [note: 'AssetERP 계약사 관리ID(biz51_erp_cont_corp_id)']
  "biz55_erp_fee" "numeric" [note: '시스템사용료']
  "biz55_erp_fee_vat" "numeric" [note: '시스템사용료 부가세(사용X)']
  "biz55_data_fee" "numeric" [note: 'DATA사용료']
  "biz55_data_fee_vat" "numeric" [note: 'DATA사용료 부가세(사용X)']
  "biz55_sms_count" "numeric" [note: '발생문자건수(사용기간)']
  "biz55_server_usage" "numeric" [note: '서버사용량(GB, 사용종료일 기준)']
  "biz55_add_sms_fee" "numeric" [note: '추가 문자사용료']
  "biz55_add_sms_fee_vat" "numeric" [note: '추가 문자사용료 부가세(사용X)']
  "biz55_add_server_fee" "numeric" [note: '추가 서버사용료']
  "biz55_add_server_fee_vat" "numeric" [note: '추가 서버사용료 부가세(사용X)']
  "biz55_appr_id" "numeric" [note: '상신문서ID(apr01_appr_id)']
  "biz55_add_user_fee" "numeric" [note: '추가 사용자사용료']
  "biz55_add_user_fee_vat" "numeric" [note: '추가 사용자사용료 부가세(사용X)']
  "biz55_user_count" "numeric" [note: '사용인원(명)']
  "biz55_etc_amt" "numeric" [note: '기타금액']
  "biz55_etc_desc" "text" [note: '기타금액설명']
  "biz55_total_amt" "numeric" [note: '사용료합계']
  "biz55_total_vat" "numeric" [note: '사용료합계 부가세']
  "biz55_charge_amt" "numeric" [note: '청구금액']
  "biz55_fix_yn" "character varying(5)" [note: '확정여부']
  "biz55_tr_id" "numeric" [note: '거래ID(ast06_tr_id)']

  indexes {
    (biz55_charge_date) [name: 'biz55_erp_fee_charge_idx01']
  }

  Note: 'AssetERP 사용료 청구'
}

Table "public"."biz60_fund_price_modi" {
  "biz60_fund_price_modi_id" "numeric" [pk, note: '기준가정정보고ID(PK)']
  "biz60_company_id" "numeric" [note: '회사ID']
  "biz60_modi_date" "date" [note: '기준가 변경일']
  "biz60_report_type" "character varying(1)" [note: '보고서구분(FundPriceModifyReportType-1:기준가격오류발생보고서/2:기준가격변경발생보고서)']
  "biz60_am_corp_nm" "text" [note: '운용사']
  "biz60_fund_nm" "text" [note: '펀드']
  "biz60_price_std_date" "date" [note: '기준가 산출일']
  "biz60_fund_close_yn" "character varying(5)" [note: '결산유무']
  "biz60_bef_price" "numeric" [note: '변경전 평일 기준가']
  "biz60_bef_full_price" "numeric" [note: '변경전 평일 FULL 기준가']
  "biz60_bef_tax_price" "numeric" [note: '변경전 평일 과표기준가']
  "biz60_bef_full_tax_price" "numeric" [note: '변경전 평일 FULL 과표기준가']
  "biz60_aft_price" "numeric" [note: '변경후 평일 기준가']
  "biz60_aft_full_price" "numeric" [note: '변경후 평일 FULL 기준가']
  "biz60_aft_tax_price" "numeric" [note: '변경후 평일 과표기준가']
  "biz60_aft_full_tax_price" "numeric" [note: '변경후 평일 FULL 과표기준가']
  "biz60_bef_close_price" "numeric" [note: '변경전 결산 기준가']
  "biz60_bef_close_full_price" "numeric" [note: '변경전 결산 FULL 기준가']
  "biz60_bef_close_tax_price" "numeric" [note: '변경전 결산 과표기준가']
  "biz60_bef_close_full_tax_price" "numeric" [note: '변경전 결산 FULL 과표기준가']
  "biz60_aft_close_price" "numeric" [note: '변경후 결산 기준가']
  "biz60_aft_close_full_price" "numeric" [note: '변경후 결산 FULL 기준가']
  "biz60_aft_close_tax_price" "numeric" [note: '변경후 결산 과표기준가']
  "biz60_aft_close_full_tax_price" "numeric" [note: '변경후 결산 FULL 과표기준가']
  "biz60_first_person_nm" "character varying(50)" [note: '최초발견자']
  "biz60_disc_cause" "text" [note: '발견 경위']
  "biz60_modi_reason" "text" [note: '기준가변경사유']
  "biz60_prev_plan" "text" [note: '재발방지대책']
  "biz60_ksd_notice_yn" "character varying(5)" [note: '예탁원 공시유무']
  "biz60_kofia_notice_yn" "character varying(5)" [note: '협회 공시유무']
  "biz60_cmps_amt" "numeric" [note: '배상금액']
  "biz60_appr_id" "numeric" [note: '상신ID']
  "biz60_upd_nm" "character varying(50)" [note: '등록(변경)자']
  "biz60_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  indexes {
    (biz60_company_id, biz60_modi_date) [name: 'biz60_fund_price_modi_idx01']
  }

  Note: '기준가정정보고'
}

Table "public"."biz61_modi_rpt_relate_appr" {
  "biz61_modi_rpt_relate_appr_id" "numeric" [pk, note: '기준가정정보고 월상신ID(PK)']
  "biz61_company_id" "numeric" [note: '회사ID']
  "biz61_modi_ym" "character varying(7)" [note: '기준자 변경년월']
  "biz61_appr_id" "numeric" [note: '월취합 상신ID']

  indexes {
    (biz61_company_id, biz61_modi_ym) [name: 'biz61_modi_rpt_relate_appr_idx01']
  }

  Note: '기준가정정보고 월상신'
}

Table "public"."biz90_limit" {
  "biz90_limit_id" "numeric" [pk, note: '이익제공(수령) 한도관리ID(PK)']
  "biz90_company_id" "numeric" [not null, note: '회사ID']
  "biz90_start_date" "date" [not null, note: '적용기준일']
  "biz90_provide_rcv_type" "character varying(1)" [not null, note: '제공/수령 구분(ProvideRcvType(1:이익제공/2:이익수령))']
  "biz90_sale_rule_limit1" "numeric" [note: '영업규정_일반한도']
  "biz90_sale_rule_limit2" "numeric" [note: '영업규정_경조한도']
  "biz90_company_limit1" "numeric" [note: '인별 1회한도']
  "biz90_company_limit2" "numeric" [note: '인별 연간한도']
  "biz90_company_limit3" "numeric" [note: '회사 연간한도']

  indexes {
    (biz90_company_id, biz90_start_date, biz90_provide_rcv_type) [name: 'biz90_limit_idx01']
  }

  Note: '이익제공(수령) 한도관리'
}

```
