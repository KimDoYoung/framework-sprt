# 테이블: pay

35개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `pay01_annual` | 연봉관리 | 20 |
| `pay02_month` | 월급여관리(사용X) | 36 |
| `pay03_account` | 회사계좌관리 | 8 |
| `pay04_formula` | 임금계산방법 | 8 |
| `pay05_relate_appr` | 상신 연관급여대장 | 7 |
| `pay06_act_mapping` | 계약서 맵핑 | 8 |
| `pay07_retire` | 퇴직정산서 | 45 |
| `pay08_tax_withholding` | 원천징수영수증관리 | 5 |
| `pay09_relate_note` | 비고 | 7 |
| `pay10_month` | 급여 | 12 |
| `pay11_month_item` | 급여항목상세 | 5 |
| `pay12_retire_insure` | 퇴직정산-4대보험 | 15 |
| `pay13_retire_tax` | 퇴직정산-소득세 | 18 |
| `pay14_retire_tax_item` | 퇴직정산-소득세-항목상세 | 6 |
| `pay15_retire_leave` | 퇴직정산-잔여휴가일수 계산상세 | 7 |
| `pay16_retire_rem_leave` | 퇴직정산-잔여휴가(임시계산용) | 6 |
| `pay20_item` | 급여항목관리 | 8 |
| `pay21_rate` | 율관리 | 5 |
| `pay22_simple_tax_table` | 근로소득 간이세액표 | 15 |
| `pay23_simple_tax_table_other` | 근로소득 간이세액표(천만원초과) | 8 |
| `pay24_deduct_table` | 근로소득 공제표 | 9 |
| `pay25_person_deduct` | 인적공제금액 | 5 |
| `pay26_tax_calc_table` | 과세표준 구간별 세액 계산표 | 7 |
| `pay27_tax_deduct_table` | 근로소득세액공제표 | 7 |
| `pay28_tax_deduct_limit` | 근로소득세액공제한도 | 8 |
| `pay29_other_setup` | 급여공제 기타설정 | 10 |
| `pay30_basic_setup` | 급여공제 회사별 기본설정 | 7 |
| `pay31_insure_apply` | 사원별 4대보험 신고정보 | 18 |
| `pay32_insure_pay` | 4대보험 정산금액 납부정보 | 12 |
| `pay33_insure_adjust` | 4대보험 연말정산금액 계산내역 | 16 |
| `pay34_work_time_config` | 근로시간 기준관리 | 11 |
| `pay40_income_tax_withholding` | 갑근세원천징수확인서 발급 | 10 |
| `pay50_expense` | 지출결의서 | 39 |
| `pay51_expense_form` | 사업비 지출요청 상세양식 | 4 |
| `pay52_favorite_account` | 자주쓰는 계정과목(지출결의서용) | 4 |

## DBML

```dbml
Table "public"."pay01_annual" {
  "pay01_annual_id" "numeric" [pk, note: '연봉관리ID']
  "pay01_company_id" "numeric" [not null, note: '회사ID']
  "pay01_person_id" "numeric" [not null, note: '사원ID']
  "pay01_start_date" "date" [not null, note: '적용시작일']
  "pay01_close_date" "date" [not null, note: '적용종료일']
  "pay01_start_time" "character varying(5)" [note: '시업시간( EX)09:00,18:00)']
  "pay01_close_time" "character varying(5)" [note: '종업시간( EX)09:00,18:00)']
  "pay01_annual_pay" "numeric" [default: `0`, note: '기본연봉']
  "pay01_retire_pay" "numeric" [default: `0`, note: '퇴직금']
  "pay01_etc_agreement" "character varying(200)" [note: '기타약정사항']
  "pay01_basic_pay" "numeric" [default: `0`, note: '기본급여']
  "pay01_meal_pay" "numeric" [default: `0`, note: '식대']
  "pay01_car_mt" "numeric" [default: `0`, note: '차량유지비']
  "pay01_over_pay" "numeric" [default: `0`, note: '연장근로']
  "pay01_etc01_pay" "numeric" [default: `0`, note: '기타급여1']
  "pay01_etc02_pay" "numeric" [default: `0`, note: '기타급여2']
  "pay01_note" "character varying(200)" [note: '비고']
  "pay01_appr_id" "numeric" [note: '상신ID']
  "pay01_childcare_allowance" "numeric" [note: '양육수당']
  "pay01_month_ot_hours" "numeric" [note: '월연장근로시간']

  indexes {
    (pay01_company_id, pay01_person_id) [name: 'pay01_annual_idx01']
    (pay01_company_id, pay01_person_id, pay01_start_date) [name: 'pay01_annual_idx02']
    (pay01_company_id, pay01_start_date) [name: 'pay01_annual_idx03']
  }

  Note: '연봉관리'
}

Table "public"."pay02_month" {
  "pay02_month_id" "numeric" [pk, note: '월급여관리 ID']
  "pay02_company_id" "numeric" [not null, note: '회사ID']
  "pay02_pay_date" "date" [not null, note: '지급일']
  "pay02_pay_cd" "character varying(2)" [not null, note: '지급구분 (PayMonthCode)']
  "pay02_person_id" "numeric" [not null, note: '사원ID']
  "pay02_basic_pay" "numeric" [default: `0`, note: '기본급여']
  "pay02_bonus_pay" "numeric" [default: `0`, note: '성과급여']
  "pay02_meal_pay" "numeric" [default: `0`, note: '식대']
  "pay02_car_mt" "numeric" [default: `0`, note: '차량유지비']
  "pay02_etc01_pay" "numeric" [default: `0`, note: '기타급여1']
  "pay02_etc02_pay" "numeric" [default: `0`, note: '기타급여2']
  "pay02_etc03_pay" "numeric" [default: `0`, note: '기타급여3']
  "pay02_etc04_pay" "numeric" [default: `0`, note: '기타급여4']
  "pay02_extend_pay" "numeric" [default: `0`, note: '연장근로수당']
  "pay02_night_pay" "numeric" [default: `0`, note: '야간근로수당']
  "pay02_holiday_pay" "numeric" [default: `0`, note: '휴일근로수당']
  "pay02_real_pay" "numeric" [note: '차감지급액(실지급액)']
  "pay02_income_tax" "numeric" [default: `0`, note: '소득세']
  "pay02_resident_tax" "numeric" [default: `0`, note: '주민세']
  "pay02_np_ddc" "numeric" [default: `0`, note: '국민연금(NATIONAL PENSION)']
  "pay02_hi_ddc" "numeric" [default: `0`, note: '건강보험(HEALTH INSURANCE)']
  "pay02_lt_ddc" "numeric" [default: `0`, note: '장기요양(LONG-TERM)']
  "pay02_ei_ddc" "numeric" [default: `0`, note: '고용보험(EMPLOYMENT INSURANCE)']
  "pay02_year_end_tax" "numeric" [default: `0`, note: '연말정산']
  "pay02_others01_ddc" "numeric" [default: `0`, note: '기타공제1']
  "pay02_others02_ddc" "numeric" [default: `0`, note: '기타공제2']
  "pay02_work_day" "numeric" [note: '근로일수']
  "pay02_total_work_time" "numeric" [note: '총 근로시간수']
  "pay02_extend_work_time" "numeric" [note: '연장근로시간수']
  "pay02_night_work_time" "numeric" [note: '야간근로시간수']
  "pay02_holiday_work_time" "numeric" [note: '휴일근로시간수']
  "pay02_note" "character varying(200)" [note: '비고']
  "pay02_hi_unsettled" "numeric" [note: '미정산 건강보험료']
  "pay02_lt_unsettled" "numeric" [note: '미정산 장기요양보험료']
  "pay02_ei_unsettled" "numeric" [note: '미정산 고용보험료']
  "pay02_retire_amt" "numeric" [note: '퇴직정산금액']

  indexes {
    (pay02_company_id, pay02_pay_date) [name: 'pay02_month_idx01']
    (pay02_company_id, pay02_pay_date, pay02_pay_cd) [name: 'pay02_month_idx02']
    (pay02_company_id, pay02_pay_date, pay02_person_id) [name: 'pay02_month_idx03']
    (pay02_company_id, pay02_person_id) [name: 'pay02_month_idx04']
  }

  Note: '월급여관리(사용X)'
}

Table "public"."pay03_account" {
  "pay03_account_id" "numeric" [pk, note: '회사계좌관리ID']
  "pay03_company_id" "numeric" [not null, note: '회사ID']
  "pay03_bank_cd" "character varying(3)" [note: '은행코드']
  "pay03_account_no" "character varying(50)" [note: '계좌번호']
  "pay03_account_nm" "character varying(50)" [note: '예금주']
  "pay03_note" "character varying(200)" [note: '비고']
  "pay03_start_date" "date" [note: '시작일자']
  "pay03_ast_class_tree_id" "numeric" [note: '자산ID']

  indexes {
    (pay03_company_id) [name: 'pay03_account_idx01']
  }

  Note: '회사계좌관리'
}

Table "public"."pay04_formula" {
  "pay04_formula_id" "numeric" [pk, note: '임금계산방법ID']
  "pay04_company_id" "numeric" [not null, note: '회사ID']
  "pay04_start_date" "date" [not null, note: '적용기준일']
  "pay04_formula_cd" "character varying(2)" [note: '임금항목(PayFormulaCode) --> 삭제예정']
  "pay04_formula_form" "character varying(200)" [note: '산출식, 산출방법']
  "pay04_note" "character varying(200)" [note: '비고']
  "pay04_rate" "numeric" [note: '이율(%) --> 삭제예정']
  "pay04_item_cd" "character varying(3)" [note: '급여항목코드(pay20_item_cd)']

  indexes {
    (pay04_company_id, pay04_start_date) [name: 'pay04_formula_idx01']
  }

  Note: '임금계산방법'
}

Table "public"."pay05_relate_appr" {
  "pay05_relate_appr_id" "numeric" [pk, note: '상신 연관급여대장 ID']
  "pay05_company_id" "numeric" [not null, note: '회사ID']
  "pay05_start_date" "date" [not null, note: '지급일']
  "pay05_pay_cd" "character varying(2)" [not null, note: '지급구분 (PayMonthCode - 01:급여/02:성과급/..)']
  "pay05_appr_id" "numeric" [note: '상신ID']
  "pay05_account_id" "numeric" [note: '회사출금계좌ID(PAY03)']
  "pay05_retire_id" "numeric" [note: '퇴직정산ID(지급구분(pay05_pay_cd)이 03(퇴직정산)인 경우에만 pay10_month_id 사용)']

  indexes {
    (pay05_company_id, pay05_start_date, pay05_pay_cd) [name: 'pay05_relate_appr_idx01']
  }

  Note: '상신 연관급여대장'
}

Table "public"."pay06_act_mapping" {
  "pay06_act_mapping_id" "numeric" [pk, note: '계약서 맵핑ID']
  "pay06_company_id" "numeric" [not null, note: '회사ID']
  "pay06_title" "character varying(150)" [not null, note: '제목']
  "pay06_content" "text" [note: '내용']
  "pay06_link_cd" "character varying(5)" [not null, note: '코드 (LINKCODE / 01:휴가관리, 02:급여대장, 03:연봉계약)']
  "pay06_default_yn" "character varying(5)" [not null, note: '기본사용설정여부']
  "pay06_note" "character varying(500)" [note: '비고']
  "pay06_kind_cd" "character varying(5)" [note: '사원구분(EmpKindCode / 10:정규직, 20:계약직, 30:임시직, 40:파견직), (emp03_kind_cd)']

  indexes {
    (pay06_company_id, pay06_link_cd) [name: 'pay06_act_mapping_idx01']
    (pay06_company_id, pay06_link_cd, pay06_kind_cd) [name: 'pay06_act_mapping_idx02']
  }

  Note: '계약서 맵핑'
}

Table "public"."pay07_retire" {
  "pay07_retire_id" "numeric" [pk, note: '퇴직정산서 ID']
  "pay07_company_id" "numeric" [not null, note: '회사ID']
  "pay07_pay_date" "date" [not null, note: '지급일']
  "pay07_person_id" "numeric" [not null, note: '사원ID']
  "pay07_basic_pay" "numeric" [default: `0`, note: '기본급여']
  "pay07_meal_pay" "numeric" [default: `0`, note: '식대']
  "pay07_car_mt" "numeric" [default: `0`, note: '차량유지비']
  "pay07_etc_pay" "numeric" [default: `0`, note: '기타급여']
  "pay07_income_tax" "numeric" [default: `0`, note: '소득세']
  "pay07_resident_tax" "numeric" [default: `0`, note: '주민세']
  "pay07_total_pay" "numeric" [default: `0`, note: '보수총액']
  "pay07_month_pay" "numeric" [default: `0`, note: '보수월액']
  "pay07_calc_month" "numeric" [default: `0`, note: '정산월수']
  "pay07_np_sum" "numeric" [default: `0`, note: '납부국민연금']
  "pay07_np_ddc" "numeric" [default: `0`, note: '당월국민연금(NATIONAL PENSION)']
  "pay07_month_hi" "numeric" [default: `0`, note: '월건강보험료']
  "pay07_fix_hi" "numeric" [default: `0`, note: '확정건강보험료']
  "pay07_hi_sum" "numeric" [default: `0`, note: '납부건강보험료']
  "pay07_hi_ddc" "numeric" [default: `0`, note: '당월건강보험료(HEALTH INSURANCE)']
  "pay07_hi_unsettled" "numeric" [default: `0`, note: '미정산 건강보험료']
  "pay07_settle_hi" "numeric" [default: `0`, note: '정산건강보험료']
  "pay07_month_lt" "numeric" [default: `0`, note: '월장기요양보험료']
  "pay07_fix_lt" "numeric" [default: `0`, note: '확정장기요양보험료']
  "pay07_lt_sum" "numeric" [default: `0`, note: '납부장기요양보험료']
  "pay07_lt_ddc" "numeric" [default: `0`, note: '당월장기요양료(LONG-TERM)']
  "pay07_lt_unsettled" "numeric" [default: `0`, note: '미정산 장기요양보험료']
  "pay07_settle_lt" "numeric" [default: `0`, note: '정산장기요양보험료']
  "pay07_fix_ei" "numeric" [default: `0`, note: '확정고용보험료']
  "pay07_ei_sum" "numeric" [default: `0`, note: '납부고용보험료']
  "pay07_ei_ddc" "numeric" [default: `0`, note: '당월고용보험료(EMPLOYMENT INSURANCE)']
  "pay07_ei_unsettled" "numeric" [default: `0`, note: '미정산 고용보험료']
  "pay07_settle_ei" "numeric" [default: `0`, note: '정산고용보험료']
  "pay07_others_ddc" "numeric" [default: `0`, note: '기타공제']
  "pay07_person_nm" "character varying(50)" [not null, note: '사원명']
  "pay07_hire_date" "date" [note: '입사일']
  "pay07_retire_date" "date" [note: '퇴사일']
  "pay07_calc_start_date" "date" [note: '계산시작일']
  "pay07_org_nm" "character varying(50)" [note: '부서명']
  "pay07_pos_nm" "character varying(50)" [note: '직위명']
  "pay07_hi_rate" "numeric" [default: `0`, note: '건강보험료율']
  "pay07_lt_rate" "numeric" [default: `0`, note: '장기요양보험료율']
  "pay07_ei_rate" "numeric" [default: `0`, note: '고용보험율']
  "pay07_appr_id" "numeric" [default: `0`, note: '상신ID']
  "pay07_pay_month_id" "numeric" [note: '급여관리ID(pay02_month_id)']
  "pay07_work_month" "numeric" [note: '근무월수']

  indexes {
    (pay07_company_id, pay07_pay_date, pay07_person_id) [name: 'pay07_retire_idx01']
  }

  Note: '퇴직정산서'
}

Table "public"."pay08_tax_withholding" {
  "pay08_tax_withholding_id" "numeric" [pk, note: '원천징수영수증관리ID']
  "pay08_company_id" "numeric" [not null, note: '회사ID']
  "pay08_person_id" "numeric" [note: '사원ID']
  "pay08_reg_date" "date" [not null, note: '등록일']
  "pay08_note" "character varying(200)" [note: '비고']

  Note: '원천징수영수증관리'
}

Table "public"."pay09_relate_note" {
  "pay09_relate_note_id" "numeric" [pk, note: '비고ID(PK)']
  "pay09_company_id" "numeric" [not null, note: '회사ID']
  "pay09_pay_date" "date" [note: '지급일']
  "pay09_pay_cd" "character varying(2)" [note: '지급구분(PayMonthCode)']
  "pay09_note_type" "character varying(1)" [note: '비고구분(NoteType-1:전체비고/2:개별비고)']
  "pay09_person_id" "numeric" [note: '사원ID']
  "pay09_note" "text" [note: '비고']

  Note: '비고'
}

Table "public"."pay10_month" {
  "pay10_month_id" "numeric" [pk, note: '급여ID(PK)']
  "pay10_company_id" "numeric" [not null, note: '회사ID']
  "pay10_pay_cd" "character varying(2)" [not null, note: '급여구분(PayMonthCode - 01:급여/02:상여금/03:퇴직정산)']
  "pay10_date" "date" [not null, note: '지급일자']
  "pay10_person_id" "numeric" [not null, note: '사원ID']
  "pay10_work_day" "numeric" [note: '근로일수']
  "pay10_total_work_time" "numeric" [note: '총근로시간']
  "pay10_extend_work_time" "numeric" [note: '연장근로시간']
  "pay10_night_work_time" "numeric" [note: '야간근로시간']
  "pay10_holiday_work_time" "numeric" [note: '휴일근로시간']
  "pay10_note" "text" [note: '비고']
  "pay10_std_month" "character varying(7)" [note: '급여지급기준월(yyyy.mm)']

  indexes {
    (pay10_company_id, pay10_pay_cd, pay10_date) [name: 'pay10_month_idx01']
    (pay10_company_id, pay10_pay_cd, pay10_date, pay10_person_id) [name: 'pay10_month_idx02']
  }

  Note: '급여'
}

Table "public"."pay11_month_item" {
  "pay11_month_item_id" "numeric" [pk, note: '급여항목상세ID(PK)']
  "pay11_month_id" "numeric" [not null, note: '급여ID(pay10_month_id)']
  "pay11_item_type" "character varying(1)" [not null, note: '급여(퇴직정산)항목구분(PayItemType - 1:급여지급항목/2:급여공제항목)']
  "pay11_item_cd" "character varying(3)" [not null, note: '항목코드']
  "pay11_item_amt" "numeric" [note: '금액']

  indexes {
    (pay11_month_id) [name: 'pay11_month_item_idx01']
  }

  Note: '급여항목상세'
}

Table "public"."pay12_retire_insure" {
  "pay12_retire_insure_id" "numeric" [pk, note: '퇴직정산-4대보험ID(PK)']
  "pay12_month_id" "numeric" [not null, note: '급여ID(pay10_month_id)']
  "pay12_insure_cd" "character varying(1)" [not null, note: '4대보험 구분(InsureCode - 1:국민연금/2:건강보험/3:장기요양/4:고용보험)']
  "pay12_year" "character varying(4)" [not null, note: '기준년도']
  "pay12_apply_term" "character varying(100)" [note: '적용기간']
  "pay12_work_month_cnt" "numeric" [note: '근무월수']
  "pay12_pay_month_cnt" "numeric" [note: '정산월수']
  "pay12_total_pay" "numeric" [note: '보수총액']
  "pay12_month_pay" "numeric" [note: '보수월액(장기요양보험은 월건강보험료금액이 들어감)']
  "pay12_insure_rate" "numeric" [note: '보험료율(%)']
  "pay12_month_amt" "numeric" [note: '월보험료(건강보험=평균보수월액*보험료율/장기요양=월건강보험료*보험료율/고용보험=해당없음)']
  "pay12_fix_amt" "numeric" [note: '확정보험료(건강보험,장기요양=월보험료 * 정산월수,고용보험=보수총액 * 보험료율)']
  "pay12_pay_amt" "numeric" [note: '납부보험료']
  "pay12_unpay_amt" "numeric" [note: '전년도 미정산보험료']
  "pay12_settle_amt" "numeric" [note: '정산보험료(확정보험료 - 납부보험료 + 전년도 미정산보험료)']

  indexes {
    (pay12_month_id) [name: 'pay12_retire_insure_idx01']
  }

  Note: '퇴직정산-4대보험'
}

Table "public"."pay13_retire_tax" {
  "pay13_retire_tax_id" "numeric" [pk, note: '퇴직정산-소득세ID(PK)']
  "pay13_month_id" "numeric" [not null, note: '급여ID(pay10_month_id)']
  "pay13_income_deduct" "numeric" [note: '근로소득공제(당해년도)']
  "pay13_income_amt" "numeric" [note: '근로소득금액(당해년도)']
  "pay13_tax_base" "numeric" [note: '차감소득금액(당해년도) => 과세표준']
  "pay13_calc_tax" "numeric" [note: '산출세액(당해년도)']
  "pay13_decide_tax" "numeric" [note: '결정세액(당해년도)']
  "pay13_pre_office_pay_tax" "numeric" [note: '전근무지 기납부세액(당해년도)']
  "pay13_cur_office_pay_tax" "numeric" [note: '현근무지 기납부세액(당해년도)']
  "pay13_settle_tax" "numeric" [note: '차감징수세액(당해년도)']
  "pay13_py_income_deduct" "numeric" [note: '근로소득공제(전년도)']
  "pay13_py_income_amt" "numeric" [note: '근로소득금액(전년도)']
  "pay13_py_tax_base" "numeric" [note: '차감소득금액(전년도)']
  "pay13_py_calc_tax" "numeric" [note: '산출세액(전년도)']
  "pay13_py_decide_tax" "numeric" [note: '결정세액(전년도)']
  "pay13_py_pre_office_pay_tax" "numeric" [note: '전근무지 기납부세액(전년도)']
  "pay13_py_cur_office_pay_tax" "numeric" [note: '현근무지 기납부세액(전년도)']
  "pay13_py_settle_tax" "numeric" [note: '차감징수세액(전년도)']

  indexes {
    (pay13_month_id) [name: 'pay13_retire_tax_idx01']
  }

  Note: '퇴직정산-소득세'
}

Table "public"."pay14_retire_tax_item" {
  "pay14_retire_tax_item_id" "numeric" [pk, note: '퇴직정산-소득세-항목상세ID(PK)']
  "pay14_month_id" "numeric" [not null, note: '급여ID(pay10_month_id)']
  "pay14_item_type" "character varying(1)" [not null, note: '급여(퇴직정산)항목구분(PayItemType - 1:급여지급항목/3:종합소득공제항목/4:세액공제항목)']
  "pay14_item_nm" "character varying(50)" [not null, note: '항목명']
  "pay14_item_amt" "numeric" [note: '당해년도 금액']
  "pay14_py_item_amt" "numeric" [note: '전년도 금액']

  indexes {
    (pay14_month_id) [name: 'pay14_retire_tax_item_idx01']
  }

  Note: '퇴직정산-소득세-항목상세'
}

Table "public"."pay15_retire_leave" {
  "pay15_retire_leave_id" "numeric" [pk, note: '퇴직정산-잔여휴가일수 계산상세ID(PK)']
  "pay15_month_id" "numeric" [not null, note: '급여ID(pay10_month_id, 임시생성인 경우 person_id가 들어감)']
  "pay15_calc_std_type" "character varying(1)" [not null, note: '계산기준구분(LeaveCalcStdType - 1:입사일기준/2:회계일기준)']
  "pay15_year_cnt" "numeric" [note: '근속년수']
  "pay15_start_date" "date" [note: '계산시작일']
  "pay15_close_date" "date" [note: '계산종료일']
  "pay15_leave_days" "numeric" [note: '연차일수']

  indexes {
    (pay15_month_id) [name: 'pay15_retire_leave_idx01']
  }

  Note: '퇴직정산-잔여휴가일수 계산상세'
}

Table "public"."pay16_retire_rem_leave" {
  "pay16_retire_rem_leave_id" "numeric" [pk, note: '잔여휴가(임시계산용)ID(PK)']
  "pay16_person_id" "numeric" [note: '사원ID']
  "pay16_retire_date" "date" [note: '퇴사(예정)일자']
  "pay16_rem_days" "numeric" [note: '퇴사년도 잔여휴가일수']
  "pay16_add_days" "numeric" [note: '추가정산일수']
  "pay16_final_days" "numeric" [note: '최종 잔여휴가일수']

  indexes {
    (pay16_person_id) [name: 'pay16_retire_rem_leave_idx01']
  }

  Note: '퇴직정산-잔여휴가(임시계산용)'
}

Table "public"."pay20_item" {
  "pay20_item_id" "numeric" [pk, note: '급여항목관리ID(PK)']
  "pay20_item_type" "character varying(1)" [not null, note: '급여(퇴직정산)항목구분(PayItemType - 1:급여지급항목/2:급여공제항목/3:종합소득공제항목/4:세액공제항목)']
  "pay20_item_cd" "character varying(3)" [not null, note: '항목코드']
  "pay20_item_nm" "character varying(50)" [not null, note: '항목명']
  "pay20_non_tax_type" "character varying(1)" [note: '비과세구분(NonTaxType - 1:과세/2:비과세/9:해당없음)']
  "pay20_seq" "numeric" [note: '조회순서']
  "pay20_use_yn" "character varying(5)" [note: '사용여부']
  "pay20_note" "character varying(100)" [note: '비고']

  indexes {
    (pay20_item_type) [name: 'pay20_item_idx01']
  }

  Note: '급여항목관리'
}

Table "public"."pay21_rate" {
  "pay21_rate_id" "numeric" [pk, note: '율관리ID(PK)']
  "pay21_rate_cd" "character varying(2)" [not null, note: '율구분(RateCode - 10:주민세/20:국민연금/21:건강보험/22:장기요양보험/23:고용보험)']
  "pay21_start_date" "date" [not null, note: '적용기준시작일']
  "pay21_apply_rate" "numeric" [not null, note: '적용율(%)']
  "pay21_note" "character varying(100)" [note: '비고']

  indexes {
    (pay21_rate_cd) [name: 'pay21_rate_idx01']
  }

  Note: '율관리'
}

Table "public"."pay22_simple_tax_table" {
  "pay22_simple_tax_table_id" "numeric" [pk, note: '근로소득 간이세액표ID(PK)']
  "pay22_start_date" "date" [not null, note: '적용기준시작일']
  "pay22_from_amt" "numeric" [not null, note: '월급여액(이상, 단위:천원)']
  "pay22_to_amt" "numeric" [not null, note: '월급여액(미만, 단위:천원)']
  "pay22_deduct_cnt1" "numeric" [note: '공제대상가족수 1']
  "pay22_deduct_cnt2" "numeric" [note: '공제대상가족수 2']
  "pay22_deduct_cnt3" "numeric" [note: '공제대상가족수 3']
  "pay22_deduct_cnt4" "numeric" [note: '공제대상가족수 4']
  "pay22_deduct_cnt5" "numeric" [note: '공제대상가족수 5']
  "pay22_deduct_cnt6" "numeric" [note: '공제대상가족수 6']
  "pay22_deduct_cnt7" "numeric" [note: '공제대상가족수 7']
  "pay22_deduct_cnt8" "numeric" [note: '공제대상가족수 8']
  "pay22_deduct_cnt9" "numeric" [note: '공제대상가족수 9']
  "pay22_deduct_cnt10" "numeric" [note: '공제대상가족수 10']
  "pay22_deduct_cnt11" "numeric" [note: '공제대상가족수 11']

  indexes {
    (pay22_start_date, pay22_from_amt) [name: 'pay22_simple_tax_table_idx01']
  }

  Note: '근로소득 간이세액표'
}

Table "public"."pay23_simple_tax_table_other" {
  "pay23_simple_tax_table_other_id" "numeric" [pk, note: '근로소득 간이세액표(천만원초과)ID(PK)']
  "pay23_start_date" "date" [not null, note: '적용기준시작일']
  "pay23_from_amt" "numeric" [not null, note: '월급여액(초과, 단위:천원)']
  "pay23_to_amt" "numeric" [not null, note: '월급여액(이하, 단위:천원)']
  "pay23_rate1" "numeric" [note: '적용기준율1(%)']
  "pay23_rate2" "numeric" [note: '적용기준율2(%)']
  "pay23_add_tax" "numeric" [note: '추가세액(누진세액)']
  "pay23_note" "character varying(500)" [note: '비고']

  indexes {
    (pay23_start_date, pay23_from_amt) [name: 'pay23_simple_tax_table_other_idx01']
  }

  Note: '근로소득 간이세액표(천만원초과)'
}

Table "public"."pay24_deduct_table" {
  "pay24_deduct_table_id" "numeric" [pk, note: '근로소득 공제표ID(PK)']
  "pay24_start_date" "date" [not null, note: '적용기준시작일']
  "pay24_data_cd" "character varying(1)" [not null, note: '데이터구분(DeductDataCode - 1:공제한도/2:공제표)']
  "pay24_limit_amt" "numeric" [note: '공제한도금액']
  "pay24_from_amt" "numeric" [note: '총급여액(초과, 단위:원)']
  "pay24_to_amt" "numeric" [note: '총급여액(이하, 단위:원)']
  "pay24_deduct_amt" "numeric" [note: '기본공제금액']
  "pay24_deduct_rate" "numeric" [note: '총급여액의 공제율(%)']
  "pay24_note" "character varying(500)" [note: '비고']

  indexes {
    (pay24_start_date, pay24_data_cd) [name: 'pay24_deduct_table_idx01']
  }

  Note: '근로소득 공제표'
}

Table "public"."pay25_person_deduct" {
  "pay25_person_deduct_id" "numeric" [pk, note: '인적공제금액ID(PK)']
  "pay25_start_date" "date" [not null, note: '적용기준시작일']
  "pay25_person_deduct_cd" "character varying(1)" [not null, note: '인적공제구분(PersonDeductCode - 0:기본공제/1:경로우대/2:장애인/3:부녀자/4:한부모)']
  "pay25_deduct_amt" "numeric" [note: '공제금액']
  "pay25_note" "character varying(500)" [note: '비고']

  indexes {
    (pay25_start_date, pay25_person_deduct_cd) [name: 'pay25_person_deduct_idx01']
  }

  Note: '인적공제금액'
}

Table "public"."pay26_tax_calc_table" {
  "pay26_tax_calc_table_id" "numeric" [pk, note: '과세표준 구간별 세액 계산표ID(PK)']
  "pay26_start_date" "date" [not null, note: '적용기준시작일']
  "pay26_from_amt" "numeric" [not null, note: '과세표준금액(초과, 단위:원)']
  "pay26_to_amt" "numeric" [not null, note: '과세표준금액(이하, 단위:원)']
  "pay26_basic_tax" "numeric" [note: '기본세액']
  "pay26_rate" "numeric" [note: '적용세율(%)']
  "pay26_note" "character varying(500)" [note: '비고']

  indexes {
    (pay26_start_date, pay26_from_amt) [name: 'pay26_tax_calc_table_idx01']
  }

  Note: '과세표준 구간별 세액 계산표'
}

Table "public"."pay27_tax_deduct_table" {
  "pay27_tax_deduct_table_id" "numeric" [pk, note: '근로소득세액공제표ID(PK)']
  "pay27_start_date" "date" [not null, note: '적용기준시작일']
  "pay27_from_amt" "numeric" [not null, note: '산출세액(초과, 단위:원)']
  "pay27_to_amt" "numeric" [not null, note: '산출세액(이하, 단위:원)']
  "pay27_deduct_amt" "numeric" [note: '기본공제']
  "pay27_rate" "numeric" [note: '적용율(%)']
  "pay27_note" "character varying(500)" [note: '비고']

  indexes {
    (pay27_start_date, pay27_from_amt) [name: 'pay27_tax_deduct_table_idx01']
  }

  Note: '근로소득세액공제표'
}

Table "public"."pay28_tax_deduct_limit" {
  "pay28_tax_deduct_limit_id" "numeric" [pk, note: '근로소득세액공제한도ID(PK)']
  "pay28_start_date" "date" [not null, note: '적용기준시작일']
  "pay28_from_amt" "numeric" [not null, note: '총급여액(초과, 단위:원)']
  "pay28_to_amt" "numeric" [not null, note: '총급여액(이하, 단위:원)']
  "pay28_min_limit" "numeric" [note: '최소한도']
  "pay28_max_limit" "numeric" [note: '최대한도']
  "pay28_rate" "numeric" [note: '적용율(%)']
  "pay28_note" "character varying(500)" [note: '비고']

  indexes {
    (pay28_start_date, pay28_from_amt) [name: 'pay28_tax_deduct_limit_idx01']
  }

  Note: '근로소득세액공제한도'
}

Table "public"."pay29_other_setup" {
  "pay29_other_setup_id" "numeric" [pk, note: '급여공제 기타설정ID(PK)']
  "pay29_start_date" "date" [not null, note: '적용기준시작일']
  "pay29_hi_max_div" "numeric" [note: '건강보험 최대분할회차']
  "pay29_ei_max_div" "numeric" [note: '고용보험 최대분할회차']
  "pay29_hi_min_amt" "numeric" [note: '건강보험 하한액']
  "pay29_hi_max_amt" "numeric" [note: '건강보험 상한액']
  "pay29_np_min_amt" "numeric" [note: '국민연금 하한액(월소득액기준, 미만)']
  "pay29_np_max_amt" "numeric" [note: '국민연금 상한액(월소득액기준, 초과)']
  "pay29_note" "character varying(500)" [note: '비고']
  "pay29_std_tax_deduct" "numeric" [note: '표준세액공제']

  Note: '급여공제 기타설정'
}

Table "public"."pay30_basic_setup" {
  "pay30_basic_setup_id" "numeric" [pk, note: '급여공제 회사별 기본설정ID(PK)']
  "pay30_company_id" "numeric" [not null, note: '회사ID']
  "pay30_with_hold_rate" "numeric" [note: '원천징수비율(80%, 100%, 120%)']
  "pay30_hi_div_pay_cd" "character varying(1)" [note: '건강보험 납부구분(DivPayCode - 1:일시납/2:분할납부)']
  "pay30_hi_max_div" "numeric" [note: '건강보험 최대분할회차']
  "pay30_ei_div_pay_cd" "character varying(1)" [note: '고용보험 납부구분(DivPayCode - 1:일시납/2:분할납부)']
  "pay30_ei_max_div" "numeric" [note: '고용보험 최대분할회차']

  indexes {
    (pay30_company_id) [name: 'pay30_basic_setup_idx01']
  }

  Note: '급여공제 회사별 기본설정'
}

Table "public"."pay31_insure_apply" {
  "pay31_insure_apply_id" "numeric" [pk, note: '사원별 4대보험 신고정보ID(PK)']
  "pay31_company_id" "numeric" [not null, note: '회사ID']
  "pay31_person_id" "numeric" [not null, note: '사원ID']
  "pay31_insure_cd" "character varying(1)" [not null, note: '4대보험 구분(InsureCode001 - 1:국민연금/2:건강보험/4:고용보험)']
  "pay31_insure_apply_cd" "character varying(1)" [not null, note: '4대보험 신고구분(InsureApplyCode - 1:신규등록/2:보수변동/3:착오정정/4:보수총액신고(전년도분)/5:납부방법 변경)']
  "pay31_apply_date" "date" [not null, note: '신고일']
  "pay31_init_date" "date" [note: '취득일']
  "pay31_apply_month" "character varying(7)" [note: '변경적용월(YYYY.MM)']
  "pay31_apply_month_pay" "numeric" [note: '신고보수월액(국민연금/건강보험은 보수월액, 고용보험은 월평균보수)']
  "pay31_pre_year_work_month_cnt" "numeric" [note: '전년도 근무개월수']
  "pay31_pre_year_pay1" "numeric" [note: '전년도 보수총액(구간1)']
  "pay31_pre_year_pay2" "numeric" [note: '전년도 보수총액(구간2)']
  "pay31_pre_year_pay3" "numeric" [note: '전년도 보수총액(구간3)']
  "pay31_term_info" "character varying(200)" [note: '구간정보']
  "pay31_pay_cd" "character varying(1)" [note: '납부방법(DivPayCode - 1:일시납/2:분할납부)']
  "pay31_pay_div" "numeric" [note: '분할납부지정회차']
  "pay31_note" "character varying(500)" [note: '비고']
  "pay31_nps_init_pay_yn" "character varying(5)" [note: '국민연금 입사월 납부여부']

  indexes {
    (pay31_person_id) [name: 'pay31_insure_apply_idx01']
    (pay31_company_id) [name: 'pay31_insure_apply_idx02']
  }

  Note: '사원별 4대보험 신고정보'
}

Table "public"."pay32_insure_pay" {
  "pay32_insure_pay_id" "numeric" [pk, note: '4대보험 정산금액 납부정보ID(PK)']
  "pay32_company_id" "numeric" [not null, note: '회사ID']
  "pay32_person_id" "numeric" [not null, note: '사원ID']
  "pay32_year" "character varying(4)" [not null, note: '정산기준년도']
  "pay32_insure_cd" "character varying(1)" [not null, note: '4대보험 구분(InsureCode001 - 2:건강보험/3:장기요양/4:고용보험)']
  "pay32_tgt_amt" "numeric" [note: '정산대상금액']
  "pay32_pay_cd" "character varying(1)" [note: '납부방법(DivPayCode - 1:일시납/2:분할납부)']
  "pay32_pay_div" "numeric" [note: '분할납부지정회차']
  "pay32_date" "date" [note: '일자(등록일, 납부일)']
  "pay32_cnt" "numeric" [note: '납부회차']
  "pay32_amt" "numeric" [note: '납부금액']
  "pay32_rem_amt" "numeric" [note: '잔여정산금액']

  indexes {
    (pay32_person_id) [name: 'pay32_insure_pay_idx01']
  }

  Note: '4대보험 정산금액 납부정보'
}

Table "public"."pay33_insure_adjust" {
  "pay33_insure_adjust_id" "numeric" [pk, note: '4대보험 정산금액 계산내역ID(PK)']
  "pay33_company_id" "numeric" [not null, note: '회사ID']
  "pay33_person_id" "numeric" [not null, note: '사원ID']
  "pay33_insure_cd" "character varying(1)" [not null, note: '4대보험 구분(InsureCode - 2:건강보험/3:장기요양/4:고용보험)']
  "pay33_year" "character varying(4)" [not null, note: '기준년도']
  "pay33_start_date" "date" [note: '계산구간시작일자']
  "pay33_close_date" "date" [note: '계산구간종료일자']
  "pay33_work_month_cnt" "numeric" [note: '근무월수']
  "pay33_pay_month_cnt" "numeric" [note: '정산월수']
  "pay33_total_pay" "numeric" [note: '보수총액']
  "pay33_month_pay" "numeric" [note: '보수월액(장기요양보험은 월건강보험료금액이 들어감)']
  "pay33_insure_rate" "numeric" [note: '보험료율(%)']
  "pay33_month_amt" "numeric" [note: '월보험료(건강보험=평균보수월액*보험료율/장기요양=월건강보험료*보험료율/고용보험=해당없음)']
  "pay33_fix_amt" "numeric" [note: '확정보험료(건강보험,장기요양=월보험료 * 정산월수,고용보험=보수총액 * 보험료율)']
  "pay33_pay_amt" "numeric" [note: '납부보험료']
  "pay33_adjust_amt" "numeric" [note: '정산보험료(확정보험료 - 납부보험료)']

  indexes {
    (pay33_person_id, pay33_insure_cd, pay33_year) [name: 'pay33_insure_adjust_idx01']
  }

  Note: '4대보험 연말정산금액 계산내역'
}

Table "public"."pay34_work_time_config" {
  "pay34_work_time_config_id" "numeric" [pk, note: '근로시간 기준관리ID(PK)']
  "pay34_company_id" "numeric" [note: '회사ID']
  "pay34_start_date" "date" [note: '적용시작일']
  "pay34_day_work_hours" "numeric" [note: '일 법정 근로시간(8시간)']
  "pay34_week_max_add_hours" "numeric" [note: '주 최대 추가(연장/야간/휴일)근로시간(2시간*6일=12시간)']
  "pay34_ot_mult_rate" "numeric" [note: '연장근로 가산배수(1.5배)']
  "pay34_nt_mult_rate" "numeric" [note: '야간근로 가산배수(2배)']
  "pay34_holi_std_mult_rate" "numeric" [note: '휴일근로 법정근로시간(8시간이전) 가산배수']
  "pay34_holi_over_mult_rate" "numeric" [note: '휴일근로 법정근로 초과시간(8시간초과) 가산배수']
  "pay34_nt_start_time" "character varying(5)" [note: '야간근로 시작시간(22:00)']
  "pay34_nt_end_time" "character varying(5)" [note: '야간근로 종료시간(06:00)']

  indexes {
    (pay34_company_id, pay34_start_date) [name: 'pay34_work_time_config_idx01']
  }

  Note: '근로시간 기준관리'
}

Table "public"."pay40_income_tax_withholding" {
  "pay40_income_tax_withholding_id" "numeric" [pk, note: '갑근세원천징수확인서 발급ID(PK)']
  "pay40_company_id" "numeric" [note: '회사ID']
  "pay40_person_id" "numeric" [note: '신청사원ID']
  "pay40_reg_date" "date" [note: '발급신청일']
  "pay40_std_year" "character varying(4)" [note: '기준년도']
  "pay40_pur_use_cd" "character varying(1)" [note: '사용목적코드(CertUseCode-1:금융기관 제출용/2:공공기관 제출용/3:회사 제출용/9:직접입력)']
  "pay40_submit_to" "character varying(50)" [note: '제출처']
  "pay40_cnt" "numeric" [note: '소요수량(통)']
  "pay40_issue_no" "numeric" [note: '발급번호']
  "pay40_appr_id" "numeric" [note: '상신ID']

  Note: '갑근세원천징수확인서 발급'
}

Table "public"."pay50_expense" {
  "pay50_expense_id" "numeric" [pk, note: '지출결의서ID(PK)']
  "pay50_company_id" "numeric" [note: '회사ID']
  "pay50_expense_cd" "character varying(2)" [note: '지출요청구분(ExpenseType-10:지출요청서/20:화환신청/30:복리후생비/..)']
  "pay50_reg_emp_id" "numeric" [note: '요청자ID']
  "pay50_reg_date" "date" [note: '요청등록일자']
  "pay50_occ_date" "date" [note: '발생일자']
  "pay50_desc" "text" [note: '지출내역(적요)']
  "pay50_content" "text" [note: '지출상세내역']
  "pay50_corp_id" "numeric" [note: '지출처ID(sys15_corp_id)']
  "pay50_tax_type" "character varying(1)" [note: '면세구분(TaxType-1:면세/2:과세/3:공통/4:불공)']
  "pay50_amt" "numeric" [note: '공급가액']
  "pay50_tax" "numeric" [note: '세액']
  "pay50_settle_amt" "numeric" [note: '지급액(결제금액)']
  "pay50_due_date" "date" [note: '지급요청일자']
  "pay50_pay_method_cd" "character varying(2)" [note: '지급방법(PayMethodCode-10:계좌이체/20:현금/90:기타계좌)']
  "pay50_pay_account_info" "character varying(500)" [note: '지급요청계좌정보(은행명 + 계좌번호 + 예금주명)']
  "pay50_confirmer_id" "numeric" [note: '승인자ID']
  "pay50_confirm_status_cd" "character varying(2)" [note: '승인상태(StatusCode0002-10:신청/20:승인/30:반려)']
  "pay50_confirm_date" "timestamp without time zone" [note: '승인일시']
  "pay50_confirm_reason" "text" [note: '승인자 승인/반려 사유']
  "pay50_appr_emp_id" "numeric" [note: '결의자ID']
  "pay50_reject_reason" "text" [note: '결의자 반려사유']
  "pay50_reject_sms_yn" "character varying(5)" [note: '결의자 반려문자/메일 발송여부']
  "pay50_account_cd" "character varying(20)" [note: '계정과목(act01_account_cd)']
  "pay50_note" "text" [note: '비고(지출결의서 전용)']
  "pay50_expense_appr_id" "numeric" [note: '지출결의서 상신ID(apr01_appr_id)']
  "pay50_deposit_id" "numeric" [note: '지급계좌ID(ast01_class_tree_id)']
  "pay50_settle_emp_id" "numeric" [note: '자금집행자ID']
  "pay50_settle_date" "date" [note: '자금집행일']
  "pay50_settle_appr_id" "numeric" [note: '자금집행결의서 상신ID']
  "pay50_floral_id" "numeric" [note: '화환신청ID(bbs20_floral_request_id)']
  "pay50_benefit_id" "numeric" [note: '복리후생비ID(emp17_benefit_id)']
  "pay50_transport_std_ym" "character varying(7)" [note: '여비교통비 기준년월(emp52_yyyymm)(YYYY.MM)']
  "pay50_biz_card_std_ym" "character varying(7)" [note: '법인카드 기준년월(biz01_std_ym)(YYYY.MM)']
  "pay50_biz_card_corp_cd" "character varying(10)" [note: '법인카드 카드사 코드(CreditCardCompany)']
  "pay50_journal_id" "numeric" [note: '분개장ID(act02_journal_id)']
  "pay50_confirm_sms_yn" "character varying(5)" [note: '승인자 알림발송 여부(반려만 해당)']
  "pay50_settle_note" "text" [note: '비고(자금집행결의서 전용)']
  "pay50_ast_id" "numeric" [note: '자산ID(ast01_class_tree_id)']

  indexes {
    (pay50_company_id, pay50_reg_emp_id) [name: 'pay50_expense_idx01']
    (pay50_company_id, pay50_reg_date) [name: 'pay50_expense_idx02']
    (pay50_company_id, pay50_occ_date) [name: 'pay50_expense_idx03']
  }

  Note: '지출결의서'
}

Table "public"."pay51_expense_form" {
  "pay51_expense_form_id" "numeric" [pk, note: '사업비 지출요청 상세양식ID(PK)']
  "pay51_company_id" "numeric" [note: '회사ID']
  "pay51_form_cd" "character varying(2)" [note: '사업비 지출요청 상세구분(ExpenseDetailType)']
  "pay51_content" "text" [note: '내용']

  indexes {
    (pay51_company_id, pay51_form_cd) [name: 'pay51_expense_form_idx01']
  }

  Note: '사업비 지출요청 상세양식'
}

Table "public"."pay52_favorite_account" {
  "pay52_favorite_account_id" "numeric" [pk, note: '자주쓰는 계정과목ID(PK)']
  "pay52_company_id" "numeric" [note: '회사ID']
  "pay52_account_code_id" "numeric" [note: '계정코드ID(act01_account_code_id)']
  "pay52_seq" "numeric" [note: '조회순서']

  indexes {
    (pay52_company_id, pay52_account_code_id) [name: 'pay52_favorite_account_idx01']
  }

  Note: '자주쓰는 계정과목(지출결의서용)'
}

```
