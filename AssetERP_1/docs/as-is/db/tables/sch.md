# 테이블: sch

21개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `sch01_info` | 스케줄 정보 | 12 |
| `sch02_share` | 스케줄 공유 | 8 |
| `sch03_deadline` | 스케줄 기한 | 23 |
| `sch03_deadline_100_old` |  | 14 |
| `sch03_deadline_20211230` |  | 14 |
| `sch03_deadline_new` | 스케줄 기한 | 21 |
| `sch04_list` | 스케줄 확인 | 19 |
| `sch05_relate_ics` | 연관내부통제 | 4 |
| `sch06_alarm` | 알람설정 | 13 |
| `sch07_alarm_record` | 알람이력 | 11 |
| `sch08_class` | 스케줄분류(사용자별) | 6 |
| `sch09_deadline_day` | 스케줄 일자 | 3 |
| `sch10_ipo` | 공모주 일정 | 17 |
| `sch11_ipo_company` | 고객사별 공모주일정 | 11 |
| `sch12_ipo_corp` | 공모주청약 주간사 정보 | 5 |
| `sch13_ipo_crawling` | 공모주 일정 크롤링데이터 | 37 |
| `sch14_ipo_mismatch` | 공모주일정 미일치내역 | 9 |
| `sch15_ipo_item_matching` | IPO 종목코드 매칭 | 4 |
| `sch20_checklist` | 체크리스트 | 7 |
| `sch21_checklist_content` | 체크리스트 내용 | 7 |
| `sch22_write_group` | 체크리스트 작성자그룹 | 3 |

## DBML

```dbml
Table "public"."sch01_info" {
  "sch01_info_id" "numeric" [pk, note: '스케줄 정보ID(PK)']
  "sch01_company_id" "numeric" [not null, note: '회사ID']
  "sch01_title" "character varying(200)" [note: '스케줄명(제목)']
  "sch01_content" "character varying(500)" [note: '상세내용(내용)']
  "sch01_report" "character varying(100)" [note: '보고처']
  "sch01_manager_id" "numeric" [note: '담당자(사원ID)']
  "sch01_note" "character varying(500)" [note: '비고']
  "sch01_use_yn" "character varying(5)" [note: '사용여부']
  "sch01_dcr_class_tree_id" "numeric" [note: '문서분류ID']
  "sch01_private_yn" "character varying(5)" [note: '개인스케쥴여부']
  "sch01_daily_yn" "character varying(5)" [note: '데일리 체크리스트 여부']
  "sch01_class_id" "numeric" [note: '스케줄분류ID(sch08_class_id)']

  indexes {
    (sch01_company_id, sch01_manager_id) [name: 'sch01_info_idx01']
  }

  Note: '스케줄 정보'
}

Table "public"."sch02_share" {
  "sch02_share_id" "numeric" [pk, note: '스케줄 공유ID(PK)']
  "sch02_info_id" "numeric" [not null, note: '스케줄 정보ID']
  "sch02_share_cd" "character varying(1)" [not null, note: '공유자 구분(1:직원/2:부서)']
  "sch02_person_id" "numeric" [note: '공유자ID']
  "sch02_org_id" "numeric" [note: '공유 부서ID']
  "sch02_company_id" "numeric" [note: '회사ID']
  "sch02_start_date" "date" [note: '공유시작일']
  "sch02_close_date" "date" [note: '공유종료일']

  indexes {
    (sch02_info_id) [name: 'sch02_share_idx01']
    (sch02_company_id, sch02_share_cd) [name: 'sch02_share_idx02']
  }

  Note: '스케줄 공유'
}

Table "public"."sch03_deadline" {
  "sch03_deadline_id" "numeric" [pk, note: '스케줄 기한ID(PK)']
  "sch03_info_id" "numeric" [not null, note: '스케쥴관리 KeyID((스케줄(sch01)/ 내부통제(ics01) / 상신문서링크ID(apr20)) ID)']
  "sch03_company_id" "numeric" [not null, note: '회사ID']
  "sch03_schedule_cd" "character varying(1)" [not null, note: '스케줄 구분(1:스케쥴관리 / 2:내부통제(주기) / 3:내부통제(수시))']
  "sch03_cycle_cd" "character varying(2)" [not null, note: '주기코드(01:일별 / 02:주별 / 03:월별 / 04:분기별 / 05:반기별 / 06:연별/ 99:일회성(수시))']
  "sch03_cycle_calc_type" "character varying(2)" [not null, note: '주기계산구분(01:일자지정 / 02:수시기간설정 / 03:매일 / 04:주별주기설정 / 05:월별주기설정1 / 06:월별주기설정2 / 07:분기의 말일 / 08:반기의 말일 / 10:즉시 / 11:주기설정1 / 12:주기설정2)']
  "sch03_period_cd" "character varying(1)" [note: '기간 구분(1:일 이내 / 2:영업일 이내 / 3:주 / 4:개월 / 5:년)']
  "sch03_year_cd" "character varying(1)" [note: '년 코드(1:매년 / 2:직접입력)']
  "sch03_year_type_cd" "character varying(1)" [note: '년 구분 코드(1:년 / 2:년 이내)']
  "sch03_month_cd" "character varying(1)" [note: '월 코드(2:익월 / 4:직접입력)']
  "sch03_month_type_cd" "character varying(1)" [note: '월 구분 코드(1:월 / 2:개월 이내)']
  "sch03_day_cd" "character varying(2)" [note: '일 코드(1~30 / 31:말 / AA:직접입력 (DCode))']
  "sch03_day_type_cd" "character varying(1)" [note: '일 구분 코드(일 / 영업일 / 일 이내 (DsCode))']
  "sch03_week_cd" "character varying(2)" [note: '주 코드(01:첫째주~04:넷째주 / 05:마지막주 (WeekOfMonth))']
  "sch03_day_week_cd" "character varying(2)" [note: '요일 구분(02:월~06:금요일 (DayOfWeekCode))']
  "sch03_holiday_cd" "character varying(1)" [note: '영업일 구분(0:해당없음 / 1:직전영업일 / 2:직후영업일 (HolidaySettleCode))']
  "sch03_num1" "numeric" [note: '직접입력1(기간(일, 주, 월, 년))']
  "sch03_num2" "numeric" [note: '직접입력2(월 입력)']
  "sch03_num3" "numeric" [note: '직접입력3']
  "sch03_fix_date" "date" [note: '지정일']
  "sch03_note" "character varying(200)" [note: '비고']
  "sch03_start_date" "date" [note: '반복시작일']
  "sch03_close_date" "date" [note: '반복종료일']

  indexes {
    (sch03_info_id) [name: 'sch03_deadline_idx01']
  }

  Note: '스케줄 기한'
}

Table "public"."sch03_deadline_100_old" {
  "sch03_deadline_id" "numeric"
  "sch03_info_id" "numeric"
  "sch03_company_id" "numeric"
  "sch03_schedule_cd" "character varying(5)"
  "sch03_cycle_cd" "character varying(5)"
  "sch03_y_cd" "character varying(5)"
  "sch03_ys_cd" "character varying(5)"
  "sch03_m_cd" "character varying(5)"
  "sch03_ms_cd" "character varying(5)"
  "sch03_d_cd" "character varying(5)"
  "sch03_ds_cd" "character varying(5)"
  "sch03_week_cd" "character varying(5)"
  "sch03_day_cd" "character varying(5)"
  "sch03_note" "character varying(200)"
}

Table "public"."sch03_deadline_20211230" {
  "sch03_deadline_id" "numeric"
  "sch03_info_id" "numeric"
  "sch03_company_id" "numeric"
  "sch03_schedule_cd" "character varying(5)"
  "sch03_cycle_cd" "character varying(5)"
  "sch03_y_cd" "character varying(5)"
  "sch03_ys_cd" "character varying(5)"
  "sch03_m_cd" "character varying(5)"
  "sch03_ms_cd" "character varying(5)"
  "sch03_d_cd" "character varying(5)"
  "sch03_ds_cd" "character varying(5)"
  "sch03_week_cd" "character varying(5)"
  "sch03_day_cd" "character varying(5)"
  "sch03_note" "character varying(200)"
}

Table "public"."sch03_deadline_new" {
  "sch03_deadline_id" "numeric" [pk, note: '스케줄 기한ID(PK)']
  "sch03_info_id" "numeric" [not null, note: '스케쥴관리 KeyID((스케줄(sch01)/ 내부통제(ics01) / 상신문서링크ID(apr20)) ID)']
  "sch03_company_id" "numeric" [not null, note: '회사ID']
  "sch03_schedule_cd" "character varying(1)" [not null, note: '스케줄 구분(1:스케쥴관리 / 2:내부통제(주기) / 3:내부통제(수시))']
  "sch03_cycle_cd" "character varying(2)" [not null, note: '주기코드(01:일별 / 02:주별 / 03:월별 / 04:분기별 / 05:반기별 / 06:연별/ 99:일회성(수시))']
  "sch03_cycle_calc_type" "character varying(2)" [not null, note: '주기계산구분(01:일자지정 / 02:수시기간설정 / 03:매일 / 04:주별주기설정 / 05:월별주기설정1 / 06:월별주기설정2 / 07:분기의 말일 / 08:반기의 말일 / 10:즉시 / 11:주기설정1 / 12:주기설정2)']
  "sch03_period_cd" "character varying(1)" [note: '기간 구분(1:일 이내 / 2:영업일 이내 / 3:주 / 4:개월 / 5:년)']
  "sch03_year_cd" "character varying(1)" [note: '년 코드(1:매년 / 2:직접입력)']
  "sch03_year_type_cd" "character varying(1)" [note: '년 구분 코드(1:년 / 2:년 이내)']
  "sch03_month_cd" "character varying(1)" [note: '월 코드(1:매월 / 2:익월 / 3:익익월 / 4:직접입력)']
  "sch03_month_type_cd" "character varying(1)" [note: '월 구분 코드(1:월 / 2:개월 이내)']
  "sch03_day_cd" "character varying(2)" [note: '일 코드(1~30 / 31:말 / AA:직접입력 (DCode))']
  "sch03_day_type_cd" "character varying(1)" [note: '일 구분 코드(일 / 영업일 / 일 이내 (DsCode))']
  "sch03_week_cd" "character varying(2)" [note: '주 코드(01:첫째주~04:넷째주 / 05:마지막주 (WeekOfMonth))']
  "sch03_day_week_cd" "character varying(2)" [note: '요일 구분(02:월~06:금요일 (DayOfWeekCode))']
  "sch03_holiday_cd" "character varying(1)" [note: '영업일 구분(0:해당없음 / 1:직전영업일 / 2:직후영업일 (HolidaySettleCode))']
  "sch03_num1" "numeric" [note: '직접입력1(기간(일, 주, 월, 년))']
  "sch03_num2" "numeric" [note: '직접입력2(월 입력)']
  "sch03_num3" "numeric" [note: '직접입력3']
  "sch03_fix_date" "date" [note: '지정일']
  "sch03_note" "character varying(200)" [note: '비고']

  Note: '스케줄 기한'
}

Table "public"."sch04_list" {
  "sch04_list_id" "numeric" [pk, note: '스케줄 확인ID(PK)']
  "sch04_company_id" "numeric" [not null, note: '회사ID']
  "sch04_info_id" "numeric" [not null, note: '정보연결ID (스케줄구분에 따라 1:sch01_info_id/2:ics01_class_tree_id/3:apr20_relate_ics/5:sch10_ipo_id)']
  "sch04_manager_id" "numeric" [note: '원담당자(사원ID)']
  "sch04_person_id" "numeric" [note: '최종담당자,처리자(사원ID)']
  "sch04_close_date" "date" [not null, note: '마감일']
  "sch04_manage_date" "date" [note: '처리일']
  "sch04_schedule_cd" "character varying(1)" [note: '스케줄 구분(1:스케줄/2:내부통제(주기)/3:내부통제(수시)/5:공모주)']
  "sch04_cycle_cd" "character varying(2)" [note: '주기코드(일별/주별/월별/분기별/반기별/연별)']
  "sch04_status_cd" "character varying(1)" [note: '상태코드(ScheduleStatusCode-0:미처리/1:완료/2:시스템(자동)/9:취소/8:연기(연장)/5:해당없음)']
  "sch04_title" "text" [note: '제목']
  "sch04_note" "character varying(200)" [note: '비고']
  "sch04_deadline_id" "numeric" [note: '스케줄 기한ID']
  "sch04_confirm_yn" "character varying(5)" [note: '내부통제책임자 확인여부']
  "sch04_confirm_date" "date" [note: '내부통제책임자 확인일']
  "sch04_confirm_note" "character varying(200)" [note: '내부통제책임자 비고']
  "sch04_appr_id" "numeric" [note: '상신ID']
  "sch04_mng_org_id" "numeric" [note: '관리부서ID']
  "sch04_confirmer_id" "numeric" [note: '확인자ID']

  indexes {
    (sch04_company_id, sch04_person_id) [name: 'sch04_list_idx01']
    (sch04_info_id) [name: 'sch04_list_idx02']
    (sch04_company_id, sch04_manage_date) [name: 'sch04_list_idx03']
    (sch04_company_id, sch04_close_date) [name: 'sch04_list_idx04']
  }

  Note: '스케줄 확인'
}

Table "public"."sch05_relate_ics" {
  "sch05_relate_ics_id" "numeric" [pk, note: '연관내부통제ID(PK)']
  "sch05_info_id" "numeric" [not null, note: '스케줄정보ID(sch01_info_id)']
  "sch05_ics_class_tree_id" "numeric" [not null, note: '내부통제ID(ics01_class_tree_id)']
  "sch05_deadline_id" "numeric" [not null, note: '기일관리ID(sch03_deadline_id)']

  indexes {
    (sch05_info_id) [name: 'sch05_relate_ics_idx01']
  }

  Note: '연관내부통제'
}

Table "public"."sch06_alarm" {
  "sch06_alarm_id" "numeric" [pk, note: '알람설정ID(PK)']
  "sch06_company_id" "numeric" [note: '회사ID']
  "sch06_target_cd" "character varying(3)" [note: '대상코드(AlarmTargetCode-SCH:스케줄,IPO:공모주,BBS:공지사항)']
  "sch06_target_id" "numeric" [note: '대상ID(sch01_info_id, sch10_ipo_id, bbs02_notice_id)']
  "sch06_alarm_type" "character varying(1)" [note: '알람방식구분(AlarmType-1:메일/2:문자)']
  "sch06_day_week_cd" "character varying(1)" [note: '일/주 코드(DayWeekCode-D:일/W:주)']
  "sch06_num" "numeric" [note: '일/주']
  "sch06_bef_aft_cd" "character varying(1)" [note: '전/후 코드(BeforeAfterCode-1:전/2:후)']
  "sch06_am_pm_cd" "character varying(2)" [note: '오전/오후 코드(AmPmCode-AM:오전/PM오후)']
  "sch06_hour_cd" "character varying(2)" [note: '시간코드(HourCode12)']
  "sch06_minute_cd" "character varying(2)" [note: '분코드(MinuteCode2)']
  "sch06_holiday_cd" "character varying(1)" [note: '영업일코드(HolidaySettleCode-0:해당없음/1:직전영업일/2:직후영업일)']
  "sch06_use_yn" "character varying(5)" [note: '사용여부']

  indexes {
    (sch06_company_id) [name: 'sch06_alarm_idx01']
  }

  Note: '알람설정'
}

Table "public"."sch07_alarm_record" {
  "sch07_alarm_record_id" "numeric" [pk, note: '알람이력ID(PK)']
  "sch07_company_id" "numeric" [note: '회사ID']
  "sch07_person_id" "numeric" [note: '사원ID']
  "sch07_target_cd" "character varying(3)" [note: '대상코드(AlarmTargetCode-SCH:스케줄,IPO:공모주,BBS:공지사항)']
  "sch07_target_id" "numeric" [note: '대상ID(sch01_info_id, sch10_ipo_id, bbs02_notice_id)']
  "sch07_alarm_id" "numeric" [note: '알람설정ID(sch06_alarm_id)']
  "sch07_alarm_type" "character varying(1)" [note: '알람방식구분(AlarmType-1:메일/2:문자)']
  "sch07_alarm_message" "text" [note: '알람메세지']
  "sch07_alarm_date_time" "timestamp without time zone" [note: '알람일시']
  "sch07_send_date_time" "timestamp without time zone" [note: '전송일시']
  "sch07_send_info" "character varying(200)" [note: '전송정보(메일,핸드폰번호 등)']

  indexes {
    (sch07_company_id) [name: 'sch07_alarm_record_idx01']
  }

  Note: '알람이력'
}

Table "public"."sch08_class" {
  "sch08_class_id" "numeric" [pk, note: '스케줄분류ID(PK)']
  "sch08_person_id" "numeric" [not null, note: '사원ID']
  "sch08_class_nm" "character varying(100)" [note: '스케줄분류명']
  "sch08_seq" "numeric" [note: '조회순번']
  "sch08_use_yn" "character varying(5)" [note: '사용여부']
  "sch08_note" "text" [note: '비고']

  indexes {
    (sch08_person_id) [name: 'sch08_class_idx01']
  }

  Note: '스케줄분류(사용자별)'
}

Table "public"."sch09_deadline_day" {
  "sch09_deadline_day_id" "numeric" [pk, note: '스케줄일자ID(PK)']
  "sch09_deadline_id" "numeric" [note: '스케줄기한정보ID(sch03_deadline_id)']
  "sch09_day" "date" [note: '일자']

  indexes {
    (sch09_deadline_id, sch09_day) [name: 'sch09_deadline_day_idx01']
  }

  Note: '스케줄 일자'
}

Table "public"."sch10_ipo" {
  "sch10_ipo_id" "numeric" [pk, note: '공모주 일정ID(PK)']
  "sch10_item_nm" "character varying(200)" [not null, note: '종목명']
  "sch10_demand_start_date" "date" [note: '수요예측시작일']
  "sch10_demand_close_date" "date" [note: '수요예측종료일']
  "sch10_subscription_start_date" "date" [note: '청약시작일']
  "sch10_subscription_close_date" "date" [note: '청약종료일']
  "sch10_div_date" "date" [note: '배정일']
  "sch10_pay_date" "date" [note: '납입일']
  "sch10_refund_date" "date" [note: '환불일']
  "sch10_list_date" "date" [note: '상장일']
  "sch10_note" "text" [note: '비고']
  "sch10_company_id" "numeric" [note: '회사ID']
  "sch10_market_cd" "character varying(1)" [note: '시장구분(MarketCode - 1:코스피/2:코스닥/3:코넥스)']
  "sch10_cancel_yn" "character varying(5)" [note: '철회여부 => 컬럼의미 변경 : 미사용여부 (true:화면조회대상에서 제외)']
  "sch10_price_bracket" "character varying(50)" [note: '희망공모가(범위)']
  "sch10_price" "numeric" [note: '(확정)공모가']
  "sch10_iss_corp_cd" "character varying(5)" [note: '발행기관코드']

  Note: '공모주 일정'
}

Table "public"."sch11_ipo_company" {
  "sch11_ipo_company_id" "numeric" [pk, note: '고객사별 공모주 일정ID(PK)']
  "sch11_ipo_id" "numeric" [not null, note: '공모주 일정ID(sch10_ipo_id)']
  "sch11_company_id" "numeric" [not null, note: '회사ID']
  "sch11_interest_yn" "character varying(5)" [note: '관심종목여부']
  "sch11_note" "text" [note: '비고']
  "sch11_demand_sdate_alarm_yn" "character varying(5)" [note: '알람설정-수요예측시작일']
  "sch11_demand_cdate_alarm_yn" "character varying(5)" [note: '알람설정-수요예측종료일']
  "sch11_subscription_sdate_alarm_yn" "character varying(5)" [note: '알람설정-청약시작일']
  "sch11_subscription_cdate_alarm_yn" "character varying(5)" [note: '알람설정-청약종료일']
  "sch11_pay_date_alarm_yn" "character varying(5)" [note: '알람설정-납입일']
  "sch11_list_date_alarm_yn" "character varying(5)" [note: '알람설정-상장일']

  indexes {
    (sch11_ipo_id, sch11_company_id) [name: 'sch11_ipo_company_idx01']
  }

  Note: '고객사별 공모주일정'
}

Table "public"."sch12_ipo_corp" {
  "sch12_ipo_corp_id" "numeric" [pk, note: '공모주청약 주간사 정보ID(PK)']
  "sch12_corp_nm" "character varying(200)" [note: '주간사명']
  "sch12_tag" "character varying(300)" [note: '검색용태그']
  "sch12_homepage" "character varying(200)" [note: '홈페이지주소']
  "sch12_note" "text" [note: '비고']

  Note: '공모주청약 주간사 정보'
}

Table "public"."sch13_ipo_crawling" {
  "sch13_ipo_crawling_id" "numeric" [pk, note: '공모주 일정 크롤링데이터ID(PK)']
  "sch13_track_id" "character varying(250)" [note: 'TRACK-ID']
  "sch13_stk_name" "character varying(250)" [note: '종목명']
  "sch13_status" "character varying(250)" [note: '진행상황']
  "sch13_market_type" "character varying(250)" [note: '시장구분']
  "sch13_stk_code" "character varying(250)" [note: '종목코드']
  "sch13_industry" "character varying(250)" [note: '업종']
  "sch13_ceo" "character varying(250)" [note: '대표자']
  "sch13_biz_type" "character varying(250)" [note: '기업구분']
  "sch13_addr" "character varying(250)" [note: '본점소재지']
  "sch13_website" "character varying(250)" [note: '홈페이지']
  "sch13_phone" "character varying(250)" [note: '대표전화']
  "sch13_major_shareholder" "character varying(250)" [note: '최대주주']
  "sch13_revenue" "character varying(250)" [note: '매출액']
  "sch13_biz_profit" "character varying(250)" [note: '법인세비용차감전 계속사업이익']
  "sch13_net_profit" "character varying(250)" [note: '순이익']
  "sch13_capital" "character varying(250)" [note: '자본금']
  "sch13_total_ipo_qty" "character varying(250)" [note: '총공모주식수']
  "sch13_par" "character varying(250)" [note: '액면가']
  "sch13_list_ipo_qty" "character varying(250)" [note: '상장공모']
  "sch13_price_bracket" "character varying(250)" [note: '희망공모가액']
  "sch13_subscription_rate" "character varying(250)" [note: '청약경쟁률']
  "sch13_final_price" "character varying(250)" [note: '확정공모가']
  "sch13_ipo_offer_amt" "character varying(250)" [note: '공모금액']
  "sch13_lead_manager" "character varying(250)" [note: '주간사']
  "sch13_demand_date" "character varying(250)" [note: '수요예측일']
  "sch13_subscription_date" "character varying(250)" [note: '공모청약일']
  "sch13_div_date" "character varying(250)" [note: '배정공고일(신문)']
  "sch13_pay_date" "character varying(250)" [note: '납입일']
  "sch13_refund_date" "character varying(250)" [note: '환불일']
  "sch13_list_date" "character varying(250)" [note: '상장일']
  "sch13_ir_date" "character varying(250)" [note: 'IR일자']
  "sch13_ir_location_time" "character varying(250)" [note: 'IR장소/시간']
  "sch13_corp_rate" "character varying(250)" [note: '수요예측결과-기관경쟁률']
  "sch13_lock_up_rate" "character varying(250)" [note: '수요예측결과-의무보유확약율']
  "sch13_demand_corp_cnt" "character varying(250)" [note: '수요예측결과-참여건수']
  "sch13_target_type" "character varying(1)" [note: '구분(1:공모주38, 2:IPO-Stock)']

  indexes {
    (sch13_track_id) [name: 'sch13_ipo_crawling_idx01']
  }

  Note: '공모주 일정 크롤링데이터'
}

Table "public"."sch14_ipo_mismatch" {
  "sch14_ipo_mismatch_id" "numeric" [pk, note: '미일치내역ID(PK)']
  "sch14_insert_date_time" "timestamp without time zone" [note: '등록일시']
  "sch14_ipo_id" "numeric" [note: '공모주일정ID(sch10_ipo_id)']
  "sch14_stk_cd" "character varying(12)" [note: '종목코드']
  "sch14_stk_nm" "character varying(200)" [note: '종목명']
  "sch14_target1" "text" [note: '공모주38']
  "sch14_target2" "text" [note: 'IPOStock']
  "sch14_note" "text" [note: '비고']
  "sch14_check_yn" "character varying(5)" [note: '체크완료여부']

  Note: '공모주일정 미일치내역'
}

Table "public"."sch15_ipo_item_matching" {
  "sch15_ipo_item_matching_id" "numeric" [pk, note: 'IPO 종목코드 매칭ID(PK)']
  "sch15_item_cd" "character varying(12)" [note: '종목코드(sch13_stk_code)']
  "sch15_valid_item_cd" "character varying(12)" [note: '유효한 종목코드']
  "sch15_item_nm" "character varying(100)" [note: '종목명']

  Note: 'IPO 종목코드 매칭'
}

Table "public"."sch20_checklist" {
  "sch20_checklist_id" "numeric" [pk, note: '체크리스트ID(PK)']
  "sch20_checklist_nm" "character varying(200)" [note: '체크리스트명']
  "sch20_priority_cd" "character varying(1)" [note: '우선순위코드(1:중요/2:보통)-PriorityCode']
  "sch20_use_yn" "character varying(5)" [note: '사용여부(true/false)']
  "sch20_person_id" "numeric" [note: '담당자ID']
  "sch20_company_id" "numeric" [note: '회사ID']
  "sch20_note" "character varying(200)" [note: '비고']

  Note: '체크리스트'
}

Table "public"."sch21_checklist_content" {
  "sch21_checklist_content_id" "numeric" [pk, note: '체크리스트 내용ID(PK)']
  "sch21_checklist_id" "numeric" [note: '체크리스트ID(sch20_checklist_id)']
  "sch21_content" "character varying(200)" [note: '체크내용']
  "sch21_criterion" "character varying(100)" [note: '근거(관련법령)']
  "sch21_seq" "numeric" [note: '조회순서']
  "sch21_use_yn" "character varying(5)" [note: '사용여부']
  "sch21_write_group_id" "numeric" [note: '작성그룹ID(sch22_write_group_id)']

  Note: '체크리스트 내용'
}

Table "public"."sch22_write_group" {
  "sch22_write_group_id" "numeric" [pk, note: '체크리스트 작성자그룹ID(PK)']
  "sch22_write_group_nm" "character varying(100)" [note: '작성자그룹명']
  "sch22_company_id" "numeric" [not null]

  Note: '체크리스트 작성자그룹'
}

```
