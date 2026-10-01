# OMS 전환 범위와 우선순위

AS-IS Asset-OMS 화면을 **프레임 / 공통(관리) / 업무 / 연습**으로 나누고, 전환 범위·순서와 AssetERP 전환 시사점을 적는다.
근거: 소스 색인(`python3 tools/src-index.py ~/workspace26/Asset-OMS --menus docs/as-is/menus.tsv`)과
SQL 정합성(`tools/sql-check.py`, P2) — 2026-10-01 기준.

## 요약

| 분류 | 화면 | 전환 | 비고 |
|:---|---:|:---|:---|
| 프레임 | 7 | 기반 작업(B)에서 TOBE로 대체 | 로그인·메뉴·탭·MyPage. 남은 기능은 아래 표 |
| 공통(관리) sys·org·emp | 32 | **1차 범위** | 회사·사용자·메뉴·권한·코드·조직·사원 |
| 업무 mst·tgt·pln | 6 | **제외 (테이블 없음)** | asseterpdb에 mst01/02/06/07/08, tgt01/02 없음 |
| 연습 practice | 4 (+연습 클래스) | **포함 — 테스트용** | GXT 그리드·레이아웃 연습 화면. TOBE 공통 컴포넌트 시험대로 쓴다 |

- 화면 수는 MenuOpener 등록 화면 42개 + 프레임 7개 기준(Popup·Lookup은 각 화면 파일의 "함께 쓰는 클래스"로 포함). 작업계획의 "177개"는 클래스 수였다.
- **OMS 고유 업무 화면은 전부 제외된다.** 그래서 "업무 대표 화면"은 asseterpdb 테이블만 쓰는 emp·org(경영관리 메뉴) 화면에서 고른다.

## 진행 순서 (1차 범위)

| 순서 | 화면 | 이유 |
|---:|:---|:---|
| 1 | `Sys04_Tab_Role` 권한그룹 관리 | **레퍼런스.** 단일 테이블(sys04_role) 그리드 CRUD, 원본 208줄. 저장·삭제가 `UpdateDataModel`이라 "테이블별 명시 SQL" 규칙을 처음 적용 → 그리드 CRUD 공통 훅을 여기서 만든다 |
| 2 | `Sys05_Tab_UserRole`, `Sys05_Tab_PersonRole`, `Sys07_Tab_RoleMenu` | 권한 매핑(마스터-디테일). B-5 메뉴 API가 읽는 데이터를 관리 → 바로 결과 확인 가능 |
| 3 | `Sys06_Tab_Menu`, `Sys03_Tab_CompanyMenu` | 메뉴 트리 관리. 트리 그리드 패턴 |
| 4 | `Sys08_Tab_CodeKindClient`, `Sys08_Tab_CodeKindAdmin` | 공통코드(코드종류-코드 마스터-디테일). 다른 화면 콤보의 데이터 |
| 5 | `Sys01_Tab_Company` | 회사. INSERT 시 부가 데이터(org01/org02/sys09) 생성 로직 이전 |
| 6 | `Org01_Tab_OrgCode` | 조직 트리. **업무 대표 1** |
| 7 | `Emp00_Tab_TransInfo` | 사원정보 관리(서비스 16, 클래스 10). **업무 대표 2**, 가장 큼 |
| 8 | 나머지 emp·sys (아래 표 순서) | 조회 위주 화면은 레퍼런스 패턴으로 빠르게 |

## 화면 목록

열: 메뉴(asseterpdb `sys06_menu`, 화면번호) / 서비스 수(그중 AS-IS에도 서버 메서드 없음) / 함께 쓰는 클래스 / 테이블 수 / P2(`sql-check`) / 전환 / AssetERP 시사점

### 프레임

| 화면 | 서비스 | TOBE 상태 | AssetERP 시사점 |
|:---|:---|:---|:---|
| `LoginPage` | 18 | B에서 대체(security-test 로그인: 회사 선택, 잠금, 비밀번호 만료). **남음**: 비밀번호 변경 팝업(sys25), 겸직 선택(emp04 getAddTitleList), 실시간 접속(sys28), 로그인 IP 보안(sys29), 쿠키 로그인 | AssetERP 로그인도 같은 테이블·흐름 → 남은 기능을 공통 모듈로 만들면 그대로 재사용 |
| `MainFrame` | 19 (8) | B-5에서 메뉴 대체. **남음**: 메뉴 검색(selectByText), 즐겨찾기(sys40), 메뉴 사용 로그(sys96) | 프레임 기능은 AssetERP와 공통 — 한 번 만들면 끝 |
| `MenuGrid` | 3 | LeftMenuBar로 대체 (`sys06_menu_down` 재귀는 SQL로 이식) | 공통 |
| `MenuOpener` | 0 | 화면 등록표(classNm → 컴포넌트)로 대체 | 공통. AssetERP 화면 480여 개도 같은 등록표 |
| `MyPage` | 1 (1) | antdesign MyPage(mock) | MyPage 데이터(일정·결재·컴플라이언스)는 AssetERP 도메인(apr, cpl …) — OMS 범위 밖 |
| `MyTabItemConfig`, `MyThemePopup` | 1, 1 | TopBar 레이아웃·글꼴 설정으로 대체 | 공통(개인설정 저장 위치만 결정 필요: localStorage vs DB) |

### 공통(관리) — 1차 범위

| 화면 | 메뉴 | 서비스 | 클래스 | 테이블 | P2 | 전환 | AssetERP 시사점 |
|:---|:---|---:|---:|---:|:---|:---|:---|
| `Sys04_Tab_Role` | 권한그룹 관리 #1069 | 3 | 1 | 1 | | 1 레퍼런스 **완료** | 단일 테이블 그리드 CRUD — AssetERP 관리 화면 다수가 같은 패턴, 공통 훅 효과가 가장 큼 |
| `Sys05_Tab_UserRole` | 권한그룹별 사용자 맵핑 #1071 | 4 | 2 | 4 | | 2 **완료** | 마스터-디테일 매핑 패턴 |
| `Sys05_Tab_PersonRole` | 사용자별 권한그룹 맵핑 #1072 | 3 | 1 | 4 | | 2 **완료** | 같은 데이터의 반대 방향 화면 — 컴포넌트 재사용 |
| `Sys07_Tab_RoleMenu` | 권한그룹별 메뉴 맵핑 #1070 | 3 | 2 | 4 | | 2 **완료** | 트리 체크 매핑 |
| `Sys06_Tab_Menu` | 메뉴 관리 #1077 | 8 | 5 | 3 | | 3 **완료** | 트리 그리드 CRUD |
| `Sys03_Tab_CompanyMenu` | 회사별 메뉴맵핑 #1076 | 3 | 2 | 3 | | 3 **완료** | 트리 체크 매핑 |
| `Sys08_Tab_CodeKindClient` | 고객사 공통코드 #1079, #1248 | 8 | 4 | 3 | | 4 **완료** | 코드 마스터-디테일. 콤보 데이터 공급원 |
| `Sys08_Tab_CodeKindAdmin` | 시스템 공통코드 관리 #1078 | 14 | 6 | 4 | | 4 **완료** | 같은 데이터의 관리자판 |
| `Sys01_Tab_Company` | 고객별 시스템정보 관리 #1075 | 8 (1) | 6 | 2 | | 5 **완료** (고객별 관리자 탭은 Sys02 후순위) | 팝업 편집(`Sys01_Edit_Company`). `getSeq` → `f_create_seq` |
| `Org01_Tab_OrgCode` | 조직정보 등록 #1028, #1451 | 8 | 5 | 6 | | 6 업무 대표 **완료** | 이력(발령일 기준) 트리 — AssetERP 업무 화면의 기준일 조회 패턴 |
| `Emp00_Tab_TransInfo` | 사원정보 관리 #1029, #1452 | 16 (2) | 10 | 7 | 수정(selectById) | 7 업무 대표 **완료** (기타정보 탭·사진·엑셀 업로드 제외) | 큰 마스터-디테일 + 다수 Lookup. 공통 Lookup(코드·조직·사원) 컴포넌트를 여기서 확정 |
| `Emp00_Tab_OrgPerson` | 조직별 사원조회 #1030 | 1 | 1 | 2 | 수정(grade_nm) | 8 **완료** | 조회 전용 — 레퍼런스로 빠르게 |
| `Emp00_Tab_OrgEmpManager` | 조직별 사원조회(관리자) #1031 | 1 | 1 | 2 | 수정(grade_nm) | 8 **완료** | 위와 SQL 공유 |
| `Emp00_Tab_ChangeHistory` | 사원정보 변경조회 #1474 | 3 (2) | 1 | 2 | | 8 **완료** (일반발령 탭만) | AS-IS도 서비스 2개 서버 없음 → 동작하는 부분만 |
| `Emp00_Tab_RoleMenu` | 사원별 메뉴권한(View) #1283 | 1 | 1 | 2 | | 8 **완료** | 조회 전용 |
| `Emp01_Tab_UserInfo` | 사용자정보 조회 #1325 | 1 | 1 | 3 | 수정(collation) | 8 **완료** | 페이징 조회(ROW_NUMBER) — 서버 페이징 패턴 |
| `Sys06_Tab_MenuView` | 메뉴별 그룹권한(View) #1284 | 3 | 3 | 7 | | 8 **완료** (권한그룹 중복행 제거 — 매퍼 주석) | 조회 전용 |
| `Sys06_Tab_MenuGuide` | 화면안내등록 #1360 | 3 | 1 | 2 | | 8 **완료** (SYSADMIN) | 에디터(안내문) 입력 |
| `Sys04_Tab_RoleAdmin` | 권한그룹 관리(기초자료) #1112 | 4 | 1 | 2 | | 8 **완료** (SYSADMIN) | Sys04 레퍼런스 변형 |
| `Sys05_Tab_CompanyUserRole` | 고객사별 사용자권한그룹 관리 #1307 | 5 | 3 | 5 | | 8 **완료** (SYSADMIN, 사원·조직 Lookup에 고객사 지정) | Sys05 변형 |
| `Sys07_Tab_Company` | 권한그룹별 메뉴권한 복사 #1247 | 5 | 5 | 5 | | 8 | 일괄 복사 처리(서비스 트랜잭션) |
| `Sys07_Tab_CompanyRoleMenu` | 고객사별 메뉴권한 관리 #1286 | 4 | 3 | 5 | | 8 | Sys07 변형 |
| `Sys10_Tab_TotalSize` | 고객별 서버사용량 #1306 | 3 | 2 | 2 | | 8 | 파일 저장소(sys10) 집계 — 파일 업로드 정책과 연결 |
| `Sys10_Tab_TrashFileList` | 미사용 파일조회 #1353 | 3 | 2 | 2 | | 8 | 위와 같음 |
| `Sys12_Tab_Calendar` | 일자관리 #1080, #1113 | 9 (4) | 3 | 3 | | 8 | 휴일 Lookup(sys14) 서버 없음 → 일자 부분만 |
| `Sys25_Tab_ResetPassword` | 비밀번호 초기화 #1182 | 4 (1) | 1 | 4 | | 8 | 로그인 모듈(sys25 암호화 `to_encrypts`)과 함께 |
| `Sys26_Tab_LoginHistory` | 로그인내역 조회 #1140 | 3 | 1 | 5 | | 8 | 감사 로그(TOBE audit)와 관계 정리 필요 |
| `Sys86_Tab_Websocket` | 로그아웃 알림 관리 #1404 | 2 | 1 | 3 | 수정(collation) | 8 | TOBE STOMP(security-test push)로 대체 검토 |
| `Sys02_Tab_User` | (asseterpdb 메뉴 없음) | 5 (1) | 2 | 4 | | 후순위 | 회사관리자 계정(sys02). 메뉴가 없어 열 경로부터 정해야 함 |
| `Sys08_Tab_SuperUser` | (asseterpdb 메뉴 없음) | 7 | 3 | 2 | | 후순위 | 같음 |
| `Emp00_RD_OrgPerson`, `Emp00_RDR_OrgPerson` | (메뉴 없음) | 0, 1 | 1, 1 | 0, 2 | RDR 수정(grade_nm) | 보류 | **RD(Report Designer) 리포트** — TOBE 리포트 방식 결정 필요(AssetERP 공통 이슈) |

### 업무 — 제외 (테이블 없음)

| 화면 | 없는 테이블 |
|:---|:---|
| `Mst02_Tab_Sec` | mst02_sec |
| `Mst06_Tab_Broker` | mst06_broker |
| `Mst07_Tab_Account` | mst07_account |
| `Mst08_Tab_Market` | mst08_market |
| `Tgt01_Tab_Model` | tgt01_model, tgt02_model_detail, mst02_sec |
| `Pln01_Tab_Order` | mst01_fund |

### 연습 — 포함 (테스트용, 2026-10-01 사용자 결정)

TOBE 공통 컴포넌트(그리드 CRUD 훅, 검색바, Lookup, 레이아웃)를 업무 화면에 쓰기 전에 시험하는 용도로 변환한다.

| 화면 | 원본 줄 수 | 내용 |
|:---|---:|:---|
| `OMS_Tab_Grid1` | 286 | 그리드 연습 (서비스 호출 없음, 로컬 데이터) |
| `OMS_Tab_Grid2` | 131 | 그리드 연습 |
| `Oms_Tab_Grid3` | 107 | 그리드 연습 |
| `Oms_Tab_Test` | 380 | 테스트 화면 |
| `P01_Layout` ~ `P07_TabHost`, `CW01` ~ `CW10` (MainFrame에서 열림) | | 레이아웃·그리드·검색·팝업·탭 연습. `P03_GridServer`·`P05_MasterDetail` 등이 쓰는 `tb_ord_mst`(practice `ordMst`)는 asseterpdb에 없음 → 테이블을 만들지 않고 mock 데이터로 |

- asseterpdb `sys06_menu`에 메뉴가 없으므로, 여는 경로(예: 개발용 '연습' 1차 메뉴를 프론트에서만 추가)를 연습 화면을 처음 변환할 때 정한다.
- 순서: 레퍼런스(`Sys04_Tab_Role`)에서 만든 공통 훅을 연습 화면에 먼저 적용해 보고, 2번 이후 화면으로 넘어가도 된다.

## AssetERP 전환 가늠 (지금까지의 결론)

- **공통으로 한 번만 만들면 되는 것**: 로그인·세션·테넌트(B 완료), 메뉴·권한(B-5 완료), 탭 프레임·화면 등록표, 그리드 CRUD 훅, 공통 Lookup(코드·조직·사원), 파일(sys10).
- **화면마다 반복되는 것**: SQL 이식(대부분 그대로 — P2에서 OMS SQL 83%가 asseterpdb에서 그대로 통과), `UpdateDataModel` 범용 저장 → 테이블별 insert/update SQL 작성, GXT 화면 → React 화면.
- **결정이 필요한 공통 이슈**: RD 리포트 대체, 개인설정 저장 위치, 조직(발령) 정보의 세션 포함, 감사 로그(sys26 vs TOBE audit) 일원화.
- 레퍼런스(`Sys04_Tab_Role`) 이후 화면당 소요(시간·토큰)를 이 표에 기록해 AssetERP 화면 480여 개 규모를 추정한다.
