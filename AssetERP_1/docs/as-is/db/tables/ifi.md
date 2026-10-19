# 테이블: ifi

17개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `ifi01_company_api` | AssetAPI고객사정보 | 8 |
| `ifi05_job_schedule` | 작업스케줄 관리 | 7 |
| `ifi10_law` | 인터페이스_법규정보 | 23 |
| `ifi11_law_record` | 인터페이스_법규정보 이력 | 13 |
| `ifi20_dart_corp` | 발행기관정보(DART,KRX) | 20 |
| `ifi21_api_data` | API수집데이터 | 11 |
| `ifi29_am_corp_mapping` | 수신파일-사무수탁사별 운용사 맵핑 | 8 |
| `ifi30_fund` | 수신파일-펀드정보 | 38 |
| `ifi31_fund_fee` | 수신파일-일별펀드보수 | 12 |
| `ifi32_fund_price` | 수신파일-일별펀드기준가 | 18 |
| `ifi33_adv` | 수신파일-일임(자문)계좌정보 | 13 |
| `ifi34_stk` | 수신파일-보유상장주식 | 11 |
| `ifi90_config` | I/F설정정보 | 18 |
| `ifi91_config_api` | API관리 | 13 |
| `ifi92_api_layout` | API레이아웃 | 15 |
| `ifi95_config_file` | 파일송수신관리 | 10 |
| `ifi96_file_layout` | 파일레이아웃 | 10 |

## DBML

```dbml
Table "public"."ifi01_company_api" {
  "ifi01_company_api_id" "numeric" [pk, note: 'AssetAPI고객사정보ID(PK)']
  "ifi01_company_id" "numeric" [not null, note: '회사ID(sys01_company_id)']
  "ifi01_service_cd" "character varying(3)" [not null, note: 'API서비스코드(ApiServiceCode-001:법규정보)']
  "ifi01_start_date" "date" [note: '서비스 시작일자']
  "ifi01_close_date" "date" [note: '서비스 종료일자']
  "ifi01_app_key" "character varying(64)" [note: '랜덤으로 생성된 appKey (회사에 제공한 고유 키)']
  "ifi01_created_date" "timestamp without time zone" [default: `CURRENT_TIMESTAMP`, note: '레코드 생성 일자']
  "ifi01_update_date" "timestamp without time zone" [note: '레코드 갱신 일자']

  indexes {
    (ifi01_company_id, ifi01_service_cd) [name: 'ifi01_company_api_idx01']
  }

  Note: 'AssetAPI고객사정보'
}

Table "public"."ifi05_job_schedule" {
  "ifi05_job_schedule_id" "numeric" [pk, note: '작업스케줄 관리ID(PK)']
  "ifi05_job_schedule_nm" "character varying(100)" [note: '스케줄명']
  "ifi05_run_type" "character varying(10)" [note: '구분(cron)']
  "ifi05_args" "character varying(50)" [note: '아규먼트']
  "ifi05_cron_str" "character varying(100)" [note: 'cron 표현식']
  "ifi05_description" "text" [note: '설명']
  "ifi05_note" "text" [note: '비고']

  Note: '작업스케줄 관리'
}

Table "public"."ifi10_law" {
  "ifi10_law_id" "numeric" [pk, note: '법규정보ID(PK)']
  "ifi10_law_cd" "character varying(10)" [note: '법규코드(ics01_class_tree_cd)']
  "ifi10_law_nm" "character varying(200)" [note: '법규명']
  "ifi10_relevant_law" "character varying(500)" [note: '근거법규']
  "ifi10_submission" "character varying(500)" [note: '제출처(공시방법)']
  "ifi10_cycle_type" "character varying(2)" [note: '정기/수시구분(10:정기, 20:수시)']
  "ifi10_term_type" "character varying(2)" [note: '기간/날짜구분(10:기간, 20:날짜)']
  "ifi10_interval_unit" "character varying(1)" [note: '주기구분(D:일, W:주, M:월, Q:분기, H:반기, Y:년, O:수시)']
  "ifi10_std_date_type" "character varying(2)" [note: '기준일타입(10:말일, 20:트리거(이벤트))']
  "ifi10_relative_position" "character varying(1)" [note: '이전/이후구분(A:이전(이내), B:이후)']
  "ifi10_next_yn" "character varying(1)" [note: '익월/익일여부(Y/N)']
  "ifi10_last_day_yn" "character varying(1)" [note: '말일여부(Y/N)']
  "ifi10_value_month" "numeric" [note: '값_월']
  "ifi10_value_week" "numeric" [note: '값_주']
  "ifi10_value_weekday" "numeric" [note: '값_요일']
  "ifi10_value_day" "numeric" [note: '값_일']
  "ifi10_biz_calc_yn" "character varying(1)" [note: '영업일계산여부(Y/N)']
  "ifi10_due_date_type" "character varying(2)" [note: '기한일처리(10:해당없음, 20:직후영업일, 30:직전영업일)']
  "ifi10_start_date" "character varying(8)" [note: '적용시작일(YYYYMMDD)']
  "ifi10_end_date" "character varying(8)" [note: '적용종료일(YYYYMMDD)']
  "ifi10_deadline_nm" "character varying(200)" [note: '기한정보']
  "ifi10_ics_class_tree_id" "numeric" [note: '법규ID(ics01_class_tree_id)']
  "ifi10_deadline_id" "numeric" [note: '기한ID(sch03_deadline_id)']

  Note: '인터페이스_법규정보'
}

Table "public"."ifi11_law_record" {
  "ifi11_law_record_id" "numeric" [pk, note: '법규정보ID(PK)']
  "ifi11_dml_type" "character varying(6)" [note: 'DML구분(INSERT/UPDATE/DELETE)']
  "ifi11_dml_date" "date" [note: '변경일자']
  "ifi11_dml_date_time" "timestamp without time zone" [note: '변경일시']
  "ifi11_ics_class_tree_id" "numeric" [note: '법규ID(ics01_class_tree_id)']
  "ifi11_deadline_id" "numeric" [note: '기한ID(sch03_deadline_id)']
  "ifi11_class_tree_cd" "character varying(10)" [note: '법규코드']
  "ifi11_class_tree_nm" "text" [note: '법규명']
  "ifi11_related_law" "character varying(400)" [note: '관련법령']
  "ifi11_submit_to" "character varying(200)" [note: '제출처']
  "ifi11_content" "text" [note: '상세내용']
  "ifi11_use_yn" "character varying(1)" [note: '사용여부']
  "ifi11_deadline_nm" "character varying(200)" [note: '기한정보']

  Note: '인터페이스_법규정보 이력'
}

Table "public"."ifi20_dart_corp" {
  "ifi20_dart_corp_id" "numeric" [pk, note: '발행기관정보ID(PK)']
  "ifi20_dart_corp_cd" "character varying(8)" [note: 'DART기관코드']
  "ifi20_dart_corp_nm" "character varying(100)" [note: 'DART기관명']
  "ifi20_stk_cd" "character varying(12)" [note: '종목코드']
  "ifi20_iss_corp_cd" "character varying(5)" [note: '발행기관코드']
  "ifi20_iss_corp_nm" "character varying(100)" [note: '발행기관명']
  "ifi20_iss_corp_snm" "character varying(100)" [note: '발행기관약명']
  "ifi20_iss_corp_enm" "character varying(100)" [note: '발행기관영문명']
  "ifi20_corp_reg_no" "character varying(13)" [note: '법인등록번호(-제거)']
  "ifi20_biz_reg_no" "character varying(10)" [note: '사업자등록번호(-제거)']
  "ifi20_addr" "character varying(100)" [note: '주소']
  "ifi20_eaddr" "character varying(100)" [note: '영문주소']
  "ifi20_ceo" "character varying(50)" [note: '대표이사']
  "ifi20_tel" "character varying(50)" [note: '대표전화']
  "ifi20_homepage" "character varying(50)" [note: '홈페이지']
  "ifi20_market_type" "character varying(50)" [note: '시장구분']
  "ifi20_list_yn" "character varying(10)" [note: '상장여부']
  "ifi20_industry_class" "character varying(100)" [note: '업태']
  "ifi20_industry_item" "character varying(100)" [note: '업종']
  "ifi20_work_date" "timestamp with time zone" [default: `CURRENT_TIMESTAMP`, note: '작업일시']

  indexes {
    (ifi20_dart_corp_cd) [name: 'ifi20_dart_corp_idx01']
  }

  Note: '발행기관정보(DART,KRX)'
}

Table "public"."ifi21_api_data" {
  "ifi21_api_data_id" "numeric" [pk, note: 'API수집데이터ID(PK)']
  "ifi21_config_api_id" "numeric" [note: 'API관리ID(ifi91_config_api_id)']
  "ifi21_date" "date" [note: '수집일자']
  "ifi21_date_time" "timestamp with time zone" [default: `CURRENT_TIMESTAMP`, note: '수집일시']
  "ifi21_request" "text" [note: '요청값']
  "ifi21_success_yn" "character varying(5)" [note: '성공여부(true/false)']
  "ifi21_status_cd" "character varying(10)" [note: '결과코드']
  "ifi21_status_msg" "character varying(200)" [note: '결과메세지']
  "ifi21_response" "text" [note: '결과값']
  "ifi21_search1" "character varying(50)" [note: '검색어1']
  "ifi21_search2" "character varying(50)" [note: '검색어2']

  indexes {
    (ifi21_config_api_id, ifi21_date) [name: 'ifi21_api_data_idx01']
  }

  Note: 'API수집데이터'
}

Table "public"."ifi29_am_corp_mapping" {
  "ifi29_am_corp_mapping_id" "numeric" [pk, note: '수신파일-사무수탁사별 운용사 맵핑ID(PK)']
  "ifi29_if_cd" "character varying(12)" [note: '인터페이스코드(ifi90_if_cd)']
  "ifi29_am_corp_cd" "character varying(12)" [note: '운용사코드']
  "ifi29_am_corp_nm" "character varying(100)" [note: '운용사명']
  "ifi29_company_id" "numeric" [note: '회사ID']
  "ifi29_start_date" "date" [note: '사용시작일']
  "ifi29_end_date" "date" [note: '사용종료일']
  "ifi29_note" "text" [note: '비고']

  Note: '수신파일-사무수탁사별 운용사 맵핑'
}

Table "public"."ifi30_fund" {
  "ifi30_fund_id" "numeric" [pk, note: '수신파일-펀드정보ID(PK)']
  "ifi30_if_cd" "character varying(12)" [note: '인터페이스코드(ifi90_if_cd)']
  "ifi30_send_date" "character varying(8)" [note: '송신일자(YYYYMMDD)']
  "ifi30_am_corp_cd" "character varying(12)" [note: '운용사코드']
  "ifi30_am_corp_nm" "character varying(100)" [note: '운용사명']
  "ifi30_fund_cd" "character varying(12)" [note: '펀드코드']
  "ifi30_fund_nm" "character varying(100)" [note: '펀드명']
  "ifi30_first_set_date" "character varying(8)" [note: '최초설정일(YYYYMMDD)']
  "ifi30_end_date" "character varying(8)" [note: '해지일(YYYYMMDD)']
  "ifi30_end_yn" "character varying(1)" [note: '해지여부(Y:해지펀드/N:운용펀드)']
  "ifi30_kofia_fund_cd" "character varying(12)" [note: '협회등록펀드코드']
  "ifi30_ksd_fund_cd" "character varying(12)" [note: '예탁원등록펀드코드']
  "ifi30_ksd_item_cd" "character varying(12)" [note: '예탁원등록종목코드']
  "ifi30_kofia_trust_cd" "character varying(1)" [note: '신탁구분(협회 1차 분류코드)']
  "ifi30_kofia_fund_type_cd" "character varying(2)" [note: '펀드유형(협회 2차 분류코드)']
  "ifi30_kofia_public_cd" "character varying(1)" [note: '공모사모코드(협회 3차 분류코드)']
  "ifi30_kofia_parent_cd" "character varying(1)" [note: '모자구분(협회 4차 분류코드)']
  "ifi30_kofia_class_type_cd" "character varying(1)" [note: '클래스구분(협회 5차 분류코드)']
  "ifi30_kofia_fund_unit_cd" "character varying(1)" [note: '단위구분(협회 6차 분류코드)']
  "ifi30_kofia_char_class_cd" "character varying(2)" [note: '특성분류(협회 9차 분류코드)']
  "ifi30_set_amt" "numeric" [note: '설정액']
  "ifi30_nav" "numeric" [note: '순자산']
  "ifi30_opr_dept" "character varying(50)" [note: '운용부서명']
  "ifi30_operator1" "character varying(50)" [note: '운용역명1']
  "ifi30_operator2" "character varying(50)" [note: '운용역명2']
  "ifi30_cust_cd" "character varying(12)" [note: '수탁사코드']
  "ifi30_cust_nm" "character varying(100)" [note: '수탁사명']
  "ifi30_office_work_cd" "character varying(12)" [note: '사무수탁사코드']
  "ifi30_office_work_nm" "character varying(100)" [note: '사무수탁사명']
  "ifi30_am_rate" "numeric" [note: '운용보수율(bp)']
  "ifi30_sales_rate" "numeric" [note: '판매보수율(bp)']
  "ifi30_cust_rate" "numeric" [note: '수탁보수율(bp)']
  "ifi30_office_work_rate" "numeric" [note: '사무수탁보수율(bp)']
  "ifi30_cur_cd" "character varying(3)" [note: '기준통화(KRW/USD/EUR/JPY/…)']
  "ifi30_mat_due_date" "character varying(8)" [note: '만기예정일(YYYYMMDD)']
  "ifi30_next_close_date" "character varying(8)" [note: '다음결산일(YYYYMMDD)']
  "ifi30_next_fee_date" "character varying(8)" [note: '다음보수인출일(YYYYMMDD)']
  "ifi30_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (ifi30_if_cd, ifi30_send_date, ifi30_am_corp_cd, ifi30_fund_cd) [name: 'ifi30_fund_idx01']
  }

  Note: '수신파일-펀드정보'
}

Table "public"."ifi31_fund_fee" {
  "ifi31_fund_fee_id" "numeric" [pk, note: '수신파일-일별펀드보수ID(PK)']
  "ifi31_if_cd" "character varying(12)" [note: '인터페이스코드(ifi90_if_cd)']
  "ifi31_send_date" "character varying(8)" [note: '송신일자(YYYYMMDD)']
  "ifi31_am_corp_cd" "character varying(12)" [note: '운용사코드']
  "ifi31_am_corp_nm" "character varying(100)" [note: '운용사명']
  "ifi31_std_date" "character varying(8)" [note: '기준일자(YYYYMMDD)']
  "ifi31_fund_cd" "character varying(12)" [note: '펀드코드']
  "ifi31_fund_nm" "character varying(100)" [note: '펀드명']
  "ifi31_occ_fee" "numeric" [note: '발생보수']
  "ifi31_cur_cd" "character varying(3)" [note: '기준통화(KRW/USD/EUR/JPY/…)']
  "ifi31_fx_rate" "numeric" [note: '적용환율']
  "ifi31_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (ifi31_if_cd, ifi31_send_date, ifi31_am_corp_cd) [name: 'ifi31_fund_fee_idx01']
    (ifi31_if_cd, ifi31_am_corp_cd, ifi31_std_date, ifi31_fund_cd) [name: 'ifi31_fund_fee_idx02']
  }

  Note: '수신파일-일별펀드보수'
}

Table "public"."ifi32_fund_price" {
  "ifi32_fund_price_id" "numeric" [pk, note: '수신파일-일별펀드기준가ID(PK)']
  "ifi32_if_cd" "character varying(12)" [note: '인터페이스코드(ifi90_if_cd)']
  "ifi32_send_date" "character varying(8)" [note: '송신일자(YYYYMMDD)']
  "ifi32_am_corp_cd" "character varying(12)" [note: '운용사코드']
  "ifi32_am_corp_nm" "character varying(100)" [note: '운용사명']
  "ifi32_std_date" "character varying(8)" [note: '기준일자(YYYYMMDD)']
  "ifi32_fund_cd" "character varying(12)" [note: '펀드코드']
  "ifi32_fund_nm" "character varying(100)" [note: '펀드명']
  "ifi32_multi_class_func_cd" "character varying(12)" [note: 'Multi Class 운용 펀드코드']
  "ifi32_cur_cd" "character varying(3)" [note: '기준통화']
  "ifi32_set_qty" "numeric" [note: '설정좌수']
  "ifi32_set_amt" "numeric" [note: '설정금액']
  "ifi32_principal" "numeric" [note: '원본액(투자원금)']
  "ifi32_nav" "numeric" [note: '순자산액']
  "ifi32_total_asset" "numeric" [note: '자산총계']
  "ifi32_price" "numeric" [note: '기준가']
  "ifi32_work_date" "timestamp without time zone" [note: '작업일시']
  "ifi32_tax_price" "numeric" [note: '과표기준가']

  indexes {
    (ifi32_if_cd, ifi32_send_date, ifi32_am_corp_cd) [name: 'ifi32_fund_price_idx01']
    (ifi32_if_cd, ifi32_am_corp_cd, ifi32_std_date, ifi32_fund_cd, ifi32_cur_cd) [name: 'ifi32_fund_price_idx02']
  }

  Note: '수신파일-일별펀드기준가'
}

Table "public"."ifi33_adv" {
  "ifi33_adv_id" "numeric" [pk, note: '수신파일-일임(자문)계좌정보ID(PK)']
  "ifi33_if_cd" "character varying(12)" [note: '인터페이스코드(ifi90_if_cd)']
  "ifi33_send_date" "character varying(8)" [note: '송신일자(YYYYMMDD)']
  "ifi33_am_corp_cd" "character varying(12)" [note: '운용사코드']
  "ifi33_am_corp_nm" "character varying(100)" [note: '운용사명']
  "ifi33_manage_cd" "character varying(12)" [note: '일임계좌관리코드']
  "ifi33_manage_nm" "character varying(100)" [note: '일임계좌명']
  "ifi33_tr_corp_cd" "character varying(12)" [note: '증권사코드']
  "ifi33_tr_corp_nm" "character varying(100)" [note: '증권사명']
  "ifi33_account_no" "character varying(128)" [note: '계좌번호']
  "ifi33_first_set_date" "character varying(8)" [note: '최초설정일(YYYYMMDD)']
  "ifi33_end_date" "character varying(8)" [note: '해지일(YYYYMMDD)']
  "ifi33_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (ifi33_if_cd, ifi33_send_date, ifi33_am_corp_cd) [name: 'ifi33_adv_idx01']
  }

  Note: '수신파일-일임(자문)계좌정보'
}

Table "public"."ifi34_stk" {
  "ifi34_stk_id" "numeric" [pk, note: '수신파일-보유상장주식ID(PK)']
  "ifi34_if_cd" "character varying(12)" [note: '인터페이스코드(ifi90_if_cd)']
  "ifi34_send_date" "character varying(8)" [note: '송신일자(YYYYMMDD)']
  "ifi34_am_corp_cd" "character varying(12)" [note: '운용사코드']
  "ifi34_am_corp_nm" "character varying(100)" [note: '운용사명']
  "ifi34_std_date" "character varying(8)" [note: '기준일자(YYYYMMDD)']
  "ifi34_item_cd" "character varying(12)" [note: '종목코드']
  "ifi34_item_nm" "character varying(100)" [note: '종목명']
  "ifi34_hold_qty" "numeric" [note: '보유수량']
  "ifi34_eval_amt" "numeric" [note: '평가금액']
  "ifi34_work_date" "timestamp without time zone" [note: '작업일시']

  indexes {
    (ifi34_if_cd, ifi34_send_date, ifi34_am_corp_cd) [name: 'ifi34_stk_idx01']
    (ifi34_if_cd, ifi34_am_corp_cd, ifi34_std_date, ifi34_item_cd) [name: 'ifi34_stk_idx02']
  }

  Note: '수신파일-보유상장주식'
}

Table "public"."ifi90_config" {
  "ifi90_config_id" "numeric" [pk, note: 'I/F설정정보ID(PK)']
  "ifi90_if_cd" "character varying(50)" [note: 'I/F코드']
  "ifi90_if_nm" "character varying(100)" [note: 'I/F명']
  "ifi90_if_type" "character varying(2)" [note: 'I/F방식(InterfaceType-10:FTP, 11:SFTP, 20:REST, 30:WebSocket)']
  "ifi90_local_host" "character varying(50)" [note: 'LOCAL HOST']
  "ifi90_local_port" "character varying(5)" [note: 'LOCAL 포트']
  "ifi90_local_account" "character varying(50)" [note: 'LOCAL 계정ID']
  "ifi90_local_pw" "character varying(128)" [note: 'LOCAL 계정비밀번호']
  "ifi90_local_path" "character varying(100)" [note: 'LOCAL PATH']
  "ifi90_local_key" "character varying(128)" [note: 'LOCAL KEY']
  "ifi90_target_host" "character varying(50)" [note: 'TARGET HOST']
  "ifi90_target_port" "character varying(5)" [note: 'TARGET 포트']
  "ifi90_target_account" "character varying(50)" [note: 'TARGET 계정ID']
  "ifi90_target_pw" "character varying(128)" [note: 'TARGET 계정비밀번호']
  "ifi90_target_path" "character varying(100)" [note: 'TARGET PATH']
  "ifi90_target_key1" "character varying(128)" [note: 'TARGET KEY1']
  "ifi90_target_key2" "character varying(128)" [note: 'TARGET KEY2']
  "ifi90_note" "character varying(500)" [note: '비고']

  Note: 'I/F설정정보'
}

Table "public"."ifi91_config_api" {
  "ifi91_config_api_id" "numeric" [pk, note: 'API관리ID(PK)']
  "ifi91_config_id" "numeric" [not null, note: 'I/F설정정보ID(ifi90_config_id)']
  "ifi91_service_type" "character varying(3)" [note: '서비스구분(InterfaceServiceType-REQ:요청, RES:제공)']
  "ifi91_api_nm" "character varying(100)" [note: 'API명']
  "ifi91_path" "character varying(100)" [note: 'Path']
  "ifi91_http_method" "character varying(3)" [note: 'HTTP Method(HttpMethod-GET:GET(조회), PST:POST(등록), PUT:PUT(수정), DEL:DELETE(삭제))']
  "ifi91_format" "character varying(2)" [note: 'Format(ApiResFormat-10:JSON, 20:XML)']
  "ifi91_content_type" "character varying(50)" [note: 'Content-Type']
  "ifi91_layout_cd" "character varying(10)" [note: '레이아웃코드(ifi92_layout_cd)']
  "ifi91_api_tr_cd" "character varying(10)" [note: '거래코드']
  "ifi91_note" "text" [note: '비고']
  "ifi91_link_table" "character varying(100)" [note: '맵핑테이블']
  "ifi91_use_yn" "character varying(5)" [note: '사용여부']

  Note: 'API관리'
}

Table "public"."ifi92_api_layout" {
  "ifi92_api_layout_id" "numeric" [pk, note: 'API레이아웃ID(PK)']
  "ifi92_layout_cd" "character varying(10)" [not null, note: '레이아웃코드']
  "ifi92_message_cd" "character varying(3)" [note: '메세지구분(ApiMessageCode-REQ:Request, RES:Response)']
  "ifi92_seq" "numeric" [note: '순번']
  "ifi92_component_cd" "character varying(2)" [note: '구성요소(ApiComponentCode-H:Header, B:Body, P:Parameter)']
  "ifi92_element_nm" "character varying(100)" [note: 'Element']
  "ifi92_element_knm" "character varying(100)" [note: 'Element 한글명']
  "ifi92_data_type" "character varying(10)" [note: '데이터타입']
  "ifi92_required_yn" "character varying(5)" [note: '필수여부']
  "ifi92_data_length" "numeric" [note: '데이터길이']
  "ifi92_description" "text" [note: 'Description']
  "ifi92_note" "text" [note: '비고']
  "ifi92_link_column" "character varying(200)" [note: '맵핑컬럼']
  "ifi92_link_column_type" "character varying(10)" [note: '맵핑컬럼 데이터타입']
  "ifi92_link_column_conv_cd" "character varying(50)" [note: '맵핑컬럼 변환코드']

  indexes {
    (ifi92_layout_cd) [name: 'ifi92_api_layout_idx01']
  }

  Note: 'API레이아웃'
}

Table "public"."ifi95_config_file" {
  "ifi95_config_file_id" "numeric" [pk, note: '파일송수신관리ID(PK)']
  "ifi95_config_id" "numeric" [not null, note: 'I/F설정정보ID(ifi90_config_id)']
  "ifi95_send_recv_type" "character varying(4)" [note: '송수신구분(SendRecvType-SEND,RECV)']
  "ifi95_file_nm" "character varying(100)" [note: '파일명']
  "ifi95_link_table" "character varying(100)" [note: '맵핑테이블']
  "ifi95_separator_cd" "character varying(2)" [note: '데이터분리코드(SeparatorCode-10:;, 20:#, 30:|, 40:쉼표, 50:탭, 60:공백, 99:없음)']
  "ifi95_file_layout_cd" "character varying(100)" [note: '레이아웃코드(ifi96_layout_cd)']
  "ifi95_shell" "character varying(500)" [note: 'Shell Script']
  "ifi95_note" "text" [note: '비고']
  "ifi95_use_yn" "character varying(5)" [note: '사용여부']

  Note: '파일송수신관리'
}

Table "public"."ifi96_file_layout" {
  "ifi96_file_layout_id" "numeric" [pk, note: '파일레이아웃ID(PK)']
  "ifi96_layout_cd" "character varying(10)" [not null, note: '레이아웃코드']
  "ifi96_seq" "numeric" [note: '순번']
  "ifi96_element_nm" "character varying(100)" [note: 'Element']
  "ifi96_data_length" "numeric" [note: '데이터길이']
  "ifi96_link_column" "character varying(200)" [note: '맵핑컬럼']
  "ifi96_link_column_type" "character varying(10)" [note: '맵핑컬럼 데이터타입']
  "ifi96_link_column_conv_cd" "character varying(50)" [note: '맵핑컬럼 변환코드']
  "ifi96_required_yn" "character varying(5)" [note: '필수여부']
  "ifi96_note" "text" [note: '비고']

  indexes {
    (ifi96_layout_cd) [name: 'ifi96_file_layout_idx01']
  }

  Note: '파일레이아웃'
}

```
