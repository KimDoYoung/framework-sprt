# 페이지 스타일 (Page Style)

`*_Tab_*` 화면의 배치(화면 구성)에 붙이는 공통 이름표. 대화·변환 명세·코드 주석에서 이 이름(또는 SID)만 쓴다.
`docs/grid-style.md`(그리드), `docs/button-types.md`(버튼)와 같은 방식이다.

- **SID** = 화면스타일-ID(Style ID). 이름 대신 짧게 부르는 약어다. 예: "이 화면은 SGVF".
- 스타일은 **Tab 파일(화면 껍데기)** 에 붙인다. 모달(`*_Edit_*`·`*_Lookup_*`·`*_Popup_*`)은 자기 SID(M으로 시작)를 따로 가진다 — `modal-style.md` "모달 SID" 절.
- Tab 파일 머리 주석에 `스타일: SGVF` 한 줄을 적는다.
> SID 20개 모두 견본이 있다(`docs/page-style/{SID}/`). **각 SID의 상세 규칙은 `docs/page-style/{SID}/README.md`** — 화면 하나에는 그 SID의 README와 견본만 읽는다. 판별은 `yunhee page-style <파일>`(규칙 변경 의뢰는 `yunhee-page-style-판별.md`). 모달(`*_Edit_*`·`*_Lookup_*`·`*_Popup_*`)의 SID(MF·MG·MFG·MH)는 `modal-style.md`.

## 스타일 목록

| SID | 이름 | 구성 | 예 |
|:---|:---|:---|:---|
| SG | SearchGrid | SearchBar + 그리드 하나 | 단순 조회 화면 |
| SGP | SearchGrid+Popup | SearchBar + 그리드 하나(셀 편집이 아니라 [등록]·[수정]이 편집 팝업 `*_Edit_*`을 연다) | `Chk02_Tab_DailyList` (일일점검내역 관리) |
| SGVF | SearchGrid+ViewForm | 위 그리드, 아래 읽기 전용 폼(상하 분할) | `Fnd01_Tab_FundSearch` (펀드 조회) |
| SGEF | SearchGrid+EditForm | 위 그리드, 아래 편집 폼(저장·삭제 버튼) | 마스터 편집 화면 |
| SGTP | SearchGrid+TabPage | 위 SearchBar + 그리드, 아래 탭 영역(상하 분할, 그리드 선택 연동) | `Fnd20_Tab_Plan` (상품기획일정 등록) |
| SGT | SearchGrid+Tree | 위 SearchBar(전체 폭), 아래 좌우 분할: 왼쪽 그리드 / 오른쪽 트리(선택 연동) | `Fnd08_Tab_OrgAuth` (펀드 권한설정). P02도 같은 모양 |
| TG | Tree+Grid | 왼쪽 트리, 오른쪽 그리드 | `*_Tab_ClassTree` 계열 |
| GG | Grid+Grid | 위 SearchBar + 마스터 그리드, 아래 상세 그리드(상하 50:50 분할, 선택 연동) | `Est02_Tab_PfResultReport` (용역결과보고서) |
| GGH | Grid+Grid 좌우 | 위 SearchBar(전체 폭), 아래 좌우 분할: 왼쪽 마스터 그리드(680) / 오른쪽 상세 그리드(선택 연동) | `Pay50_Tab_ExpensePay` (1400) |
| STP | SearchBar+TabPanel | 위 툴바(성명 등 입력 + 버튼들, 그리드 없음), 아래 탭 컨테이너(탭마다 서로 다른 내부 구성, 툴바의 대상이 모든 탭에 전달됨) | `Pay10_Tab_Retire` (퇴직정산, S22) |
| CG | CrudGrid | 편집 가능한 그리드 하나 | 코드 관리류 |
| GCG | Grid+Calendar+Grid | 위 제목 줄(기준일자 + 새로고침 아이콘)과 그리드(현황), 아래 좌측 달력·[예약하기] 버튼 / 우측 라디오(MY·전체) + 그리드(달력 날짜 연동). 조회 툴바 없음 | `Car03_Tab_List` (공용차량 예약관리, T13) |
| TP | TabPanel | 툴바·그리드 없이 탭 컨테이너만(탭마다 자기 툴바·내용을 가짐) | `Rpt10_Tab_FssOrg` (업무보고서, T17) |
| SR | SearchBar+RD | 위 툴바 한 줄(조회기간 등 + [조회], `SearchBar`), 아래 RD 보고서 영역(iframe) 하나. 그리드 없음 | `Emp01_Tab_InoutState` (기간별 입퇴사현황, T18) |
| SGHF | SearchGrid+HorizontalForm | 조회 줄 + 그리드 + 편집 폼을 **좌우**로 배치(SGEF의 좌우 버전) | `Biz01_Tab_Card` (1131) |
| TO | TreeOnly | 트리 중심, 오른쪽이 일반 그리드가 아님/없음, 편집은 팝업 | `Org01_Tab_OrgCode` (1028) |
| GO | GridOnly | 그리드 하나, 조회 툴바 없음(직접 만든 조건 줄) | `Tdm54_Tab_CheckInsuff` (1459) |
| DSBRD | Dashboard | 그리드·트리·툴바 없이 카드/요약 영역 | `Tdm50_Tab_TotalDashboard` (1495) |
| GDP | Grid+DetailPage | 왼쪽 버튼 줄(조회 등, `SearchBar` 아님) + 그리드, 오른쪽 선택 행과 연동하는 상세 페이지(`*_Page_*`/`*_TabPage_*`), 좌우 분할 | `Sms02_Tab_TotalCount` (1305) |
| IN | Info | 조회·저장 없는 안내 문서(안내 문구 + 링크/HTML) | `Flt00_Tab_Info` (1369) |

## 견본 사용법

- `docs/page-style/{SID}/`의 파일은 **읽기 전용 참조용 복사본**이다. 빌드·타입 검사 대상이 아니고(`docs/`는 `tsconfig` 밖) import하지 않는다. 보고 따라 쓴다.
- 새 화면은 견본을 복사해 시작하지 않고, 같은 SID의 최신 구조를 보고 AS-IS 원본 레이아웃에 맞춰 작성한다(03 원칙 12).
- 견본 갱신: 스타일 규칙이 바뀌면 `src/pages/`의 화면과 `docs/page-style/{SID}/` 복사본, 이 문서를 같은 작업에서 함께 고친다. 복사본과 원본 화면이 달라졌는지는 `diff`로 확인한다.
- 같은 SID 화면을 찾으려면 `grep -rn '스타일: SGVF' AssetERP/frontend/src/pages`.

## 추가 규칙

- 초기화 버튼(UX-02, `AssetERP/docs/1-변환/10-UX보강.md`): 검색 조건이 **3개 이상**이고 버튼을 넣을 **공간이 있을 때만** 넣는다. 조건이 2개 이하이거나 줄바꿈되면 넣지 않는다.
- 화면 여백 정리(UX-12, 같은 파일, 모든 SID 공통): ① 외곽 상자 선(`border: '1px solid #d9d9d9'`) 없음 ② 위 여백은 화면 바깥 여백 20 하나(안쪽 `padding`·조회 줄 고정 높이 없음) ③ 조회 줄과 그리드 사이 `gap: 8` ④ 바탕 `#fff`. 기준 화면 #1456 `Tdm51_Tab_CheckOrg`. 견본(`docs/page-style/{SID}/`)은 아직 이 규칙으로 고치지 않았다 — 일괄 적용 때 함께 고친다.

- 새 스타일이 필요하면 이 표에 먼저 SID를 등록한 뒤 쓴다(SID는 2~5자 대문자, 중복 금지).
- 한 화면이 두 스타일에 걸치면 주된 것을 SID로 적고 주석에 차이를 적는다.
