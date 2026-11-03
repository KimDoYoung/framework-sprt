# AssetERP 도메인 약자 및 의미

ASIS 소스(`client/vi/*`, `server/*`, `MenuOpener.java`)와 DB 스키마(`sys06_menu` 메뉴 테이블 및 테이블 주석)를 전수 분석하여 정리한 **AssetERP 도메인 약자 및 한글 의미** 목록입니다.

---

## 1. ASIS 소스 코드 도메인 (총 44개 패키지)

| 순번 | 도메인 약자 | 영문 유래 (추정) | 한글 의미 (업무 도메인명) | 주요 기능 및 관련 테이블 예시 |
|:---:|:---|:---|:---|:---|
| 1 | **`act`** | **Ac**coun**t**ing | **회계 / 계정관리** | 계정과목, 분개장, 전표입력, 원장, 재무제표, 결산마감 (`act01_account_code`, `act02_journal`) |
| 2 | **`adv`** | **Adv**isory | **일임 / 투자자문 관리** | 일임·자문 고객계좌, 부서별 계좌권한, 운용자산 등록 (`adv02_account`, `adv10_book`) |
| 3 | **`apr`** | **Ap**p**r**oval | **전자결재 / 상신문서 관리** | 전자결재 상신·결재·참조, 대결자 지정, 인감날인대장, 법인서류 신청 (`apr01_appr`, `apr04_appr_step`) |
| 4 | **`ast`** | **As**se**t** | **자산관리 (고유자산·펀드자산)** | 고유자산/금융상품 거래처리, 시세/평가, 예금잔고, 펀드운용보수, 감가상각 (`ast01_class_tree`, `ast06_tr`) |
| 5 | **`att`** | **Att**endance | **근태관리** | 출퇴근 기록, 근태 기준 정책, 연장근무 신청 (`att01_work_policy`, `att02_commute`) |
| 6 | **`bbs`** | **B**ulletin **B**oard **S**ystem | **게시판 / 공지사항 / 사규** | 사내·경영·법규 공지사항, 게시판, 회사규정, 경조/화환 신청 (`bbs01_board`, `bbs02_notice`) |
| 7 | **`biz`** | **Biz** (Business / Expense) | **이익제공(수령) / 사업비·계약사** | 이익제공(수령) 내역·한도 관리, 법인카드 내역 배분, 계약사·사용료 청구 (`biz01_promo`, `biz10_cont_corp`) |
| 8 | **`bmt`** | **B**usiness Equip**m**en**t** | **비품 / 전산장비 / 판촉물 관리** | 물품·판촉물 구매내역, 전산장비(PC) 관리 및 이력, 임직원 정보통신수단 (`bmt01_buy`, `bmt10_info`) |
| 9 | **`car`** | **Car** | **차량일지 / 법인차량 관리** | 차량정보, 전용/공용차량 예약 및 운행일지 (`car01_info`, `car03_booking`, `car04_journal`) |
| 10 | **`chk`** | **Ch**ec**k**list | **일일점검내역 관리** | 펀드회계 일일점검항목 분류, 일일점검표 작성·확인 (`chk01_class_tree`, `chk02_daily_list`) |
| 11 | **`cmp`** | **C**o**mp**any / **C**o**mp**liance | **회사별 공용 관리 / 광고심사** | 회사별 공용메일 주소록·권한 관리, 광고심사 및 내부점검 (`cmp01_advertise`, `cmp10_mail_book`) |
| 12 | **`com`** | **Com**mon | **공통 팝업 / 양식·첨부 연결** | 공통 연관상신문서, 첨부파일 그리드, 데이터맵핑 문서양식, 공통 종목조회 (`com01_relate_appr`, `com50_item`) |
| 13 | **`crd`** | **C**a**rd** | **법인카드 관리** | 법인카드 및 사용자 등록, 카드 사용내역 엑셀 업로드 (`crd01_card`, `crd02_data`) |
| 14 | **`crm`** | **C**ustomer **R**elationship **M**gt. | **영업활동(CRM) / 영업 Item 관리** | 영업 아이템, 실사(Inspection), 고객 상담 및 업무활동 내역 (`crm01_item`, `crm05_counsel`) |
| 15 | **`dbm`** | **DB** **M**anagement | **DB 테이블 명세 / RD·PDF 도구** | 테이블·컬럼 코멘트 조회, 모델 소스 생성기, RD 리포트/공문서 PDF 생성 (`Dbm01_Tab_TabComments`) |
| 16 | **`dcr`** | **D**o**c**ument **R**epository | **문서분류 / 문서권한·양식 관리** | 문서분류 트리, 조직별·사원별 문서권한, 문서양식 등록, 통합 문서/첨부 검색 (`dcr01_class_tree`, `dcr05_doc_type`) |
| 17 | **`eml`** | **Em**ai**l** | **이메일 발송이력** | 메일 발송이력(수신/참조) 조회 팝업 (`Eml01_SendHistory`) |
| 18 | **`emp`** | **Emp**loyee | **인사 / 사원정보 관리** | 사원 인적사항, 인사발령, 겸직, 휴가/출장/외출, 복리후생비, 인사평가 (`emp01_person`, `emp03_trans`) |
| 19 | **`est`** | Real **Est**ate | **부동산 (PF 용역/임대 관리)** | 부동산PF 수수료 항목, 용역계약 체결·수행내역, 임대계약·보증금 관리 (`est01_pf_fee_type`, `est02_pf_contract`) |
| 20 | **`fbx`** | **F**ile **B**o**x** | **파일보관함** | 부서/전사 파일보관함, 파일 등록·이력·검색 (`fbx01_box`, `fbx03_file`) |
| 21 | **`flt`** | **F**ront-running / **L**imited **T**rading | **임직원 자기매매 통제** | 임직원 매매 계좌신고, 매수/매도 사전승인, 보유/매매내역, 정기보고 (`flt01_company_std`, `flt03_account`) |
| 22 | **`fnd`** | **F**u**nd** | **펀드 / 기준정보 관리** | 펀드·상품코드, 펀드규약, 수탁사·판매사·사무수탁사·발행기관, 공모주청약 (`fnd01_fund_code`, `fnd02_fund_info`) |
| 23 | **`frm`** | **Fr**a**m**e / Main Portal | **메인 프레임 / 포털 위젯** | 메인 화면 달력, 미결재·체크리스트·공지사항 조회 팝업, 모니터링 페이지 (`Frm01_List`, `Calendar`) |
| 24 | **`icam`** | **ICAM** (외부 회계/운용 시스템) | **ICAM 연계 관리** | ICAM 펀드·종목·원장·현금흐름·운용보수 데이터 연동 및 ICAM 사용자 ID 신청 (`icam01_data_info`, `icam03_fund`) |
| 25 | **`icr`** | **I**nternal **C**ontrol **R**egulation | **내규통제 (내부규정 관리)** | 사내 내부규정 분류 트리 및 관리그룹 연결 (`icr01_class_tree`, `icr05_relate_manager`) |
| 26 | **`ics`** | **I**nternal **C**ontrol **S**ystem | **내부통제 / 법규준수 관리** | 법규관리, 임직원 내부통제 준수확인 및 체크리스트, 준법감시인 점검, 대외활동 (`ics01_class_tree`, `ics10_checklist`) |
| 27 | **`ifi`** | **I**nter**f**ace **I**nfo | **대외 인터페이스 / OpenAPI 관리** | 외부 연동(DART, KRX, 법규 API 등) 작업스케줄, API·파일 송수신 레이아웃 설정 (`ifi01_company_api`, `ifi90_config`) |
| 28 | **`kfs`** | **K**orea **F**und **S**ervice | **한국펀드서비스(KFS) 전용 메뉴** | 리모트뷰(원격지원) 사용기록 관리, 메일 테스트 (`kfs01_remote_view`) |
| 29 | **`mkt`** | **M**ar**k**e**t**ing | **마케팅 (업무활동 관리)** | 업무활동처(기관) 및 담당자 등록, 마케팅 업무활동 내역·공유 (`mkt01_target_company`, `mkt03_history`) |
| 30 | **`mrb`** | **M**eeting **R**oom **B**ooking | **회의실 예약** | 회의실 예약 관리 (`mrb01_booking`) |
| 31 | **`msc`** | **M**anager/Member **Sc**hedule | **주간/부서 스케줄 예약** | 부서별/주간 스케줄 등록 및 달력 조회 (`msc01_schedule`) |
| 32 | **`mvb`** | **M**o**v**able / Vehicle **B**ooking | **예약 처리 (서버 전용 구 모듈)** | 예약 정보 서버 처리 클래스 (`Mvb01_Booking`) |
| 33 | **`opr`** | **Op**e**r**ation Report | **운용지시서 / 운용보고서 관리** | 운용보고서·운용지시서 등록, 대상 펀드 및 담당자 관리 (`opr01_create`, `opr02_fund`) |
| 34 | **`org`** | **Org**anization | **조직 관리** | 조직코드 트리, 조직 개편/이동, 부서 정보, 직책별 인감권한 (`org01_code`, `org02_info`, `org10_role_stamp`) |
| 35 | **`pay`** | **Pay**roll | **급여 / 연봉 / 사업비 지출결의** | 연봉계약, 월급여·급여명세서, 퇴직정산, 4대보험, 원천징수, 지출결의서 (`pay01_annual`, `pay02_month`) |
| 36 | **`pcd`** | **P**ool **C**ar **D**ispatch | **공용차량 배차 예약** | 공용차량 픽업/배차 타임라인 예약 (`pcd01_pickup`) |
| 37 | **`pln`** | **Pl**a**n**ning | **상품기획 / 리서치** | 신규 기획펀드 일정관리 및 리서치 등록 (`pln01_fund`, `pln02_plan`, `pln03_resrch`) |
| 38 | **`rpt`** | **R**e**p**or**t** | **업무보고 관리** | 일일업무보고, 주간업무보고, 월간회의자료, 금감원 업무보고서 (`rpt01_daily`, `rpt03_week`, `rpt10_fss_submit`) |
| 39 | **`sch`** | **Sch**edule | **업무일정 / 법규점검·공모주 일정** | 전사·부서 업무일정(To-Do), 데일리 체크리스트, 법규보고 점검일정, 공모주 일정 (`sch01_info`, `sch03_deadline`) |
| 40 | **`scm`** | **S**oftware **C**onfiguration **M**gt. | **형상관리 / 시스템 개발의뢰(SR)** | 시스템 개발의뢰(SR), 개발단계·프로그램 관리, QA/UAT 및 배포 처리 (`scm01_sr`, `scm10_dev`) |
| 41 | **`sms`** | **S**hort **M**essage **S**ervice | **SMS / 알림 발송관리** | 단문/단체 문자발송, 고객사별 문자 사용량 집계, 알림 이력 (`sms02_history`, `sms03_group_send`) |
| 42 | **`sys`** | **Sys**tem | **시스템 관리** | 회사(테넌트), 사용자, 메뉴, 권한그룹(Role), 공통코드, 영업일 달력, 접속로그 (`sys01_company` ~ `sys09_code`) |
| 43 | **`tdm`** | **T**ask & **D**uty **M**anagement | **책무구조도 관리** | 금융사 책무구조도(임원·직책·회의체·책무기술서·부서책무매뉴얼·이행점검) (`tdm01_hr`, `tdm05_cncl`) |
| 44 | **`tgt`** | **T**ar**g**e**t** Company | **매매처 관리** | 매매처(거래기관) 기본정보, 매매처별 계좌 및 거래코드 관리 (`tgt01_co`, `tgt02_co_acct`) |

---

## 2. DB 테이블/메뉴에만 존재하는 보조 도메인 약자

| 도메인 약자 | 한글 의미 | 설명 및 관련 테이블 |
|:---|:---|:---|
| **`bnd`** | **채권 정보** (Bond) | 채권 기본정보 테이블 (`bnd01_bond_info`) |
| **`imt`** | **IT 자산/인프라 관리** (IT Management) | 서버 관리, PC 관리대장, 소프트웨어 라이선스 이력 (`imt01_server_management`, `imt02_pc_management`) |
| **`ppt`** | **부동산 물건관리** (Property) | 구 부동산 메뉴의 물건정보관리 (`sys06_menu` 내 `Ppt01_*`) |
| **`conv`** | **데이터 이행(컨버전)** (Conversion) | 타 시스템 전표 이행 및 책무 컨설팅 기초 데이터 이행용 테이블 (`conv01_journal`, `conv10_tdm_base`) |
| **`raw`** | **원시 연동 데이터** (Raw Data) | 고객사(미래에셋 등) 조직·임직원 인사 원시 데이터 수신 테이블 (`raw10_miraeasset_org`, `raw11_miraeasset_emp`) |
| **`*bak`** | **백업 테이블** (Backup) | 도메인별 백업 테이블 접두사 (`bbsbak`, `empbak`, `paybak`, `sysbak`, `tdmbak`) |
