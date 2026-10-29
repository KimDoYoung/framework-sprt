# 페이지 스타일 (Page Style)

`*_Tab_*` 화면의 배치(화면 구성)에 붙이는 공통 이름표. 대화·변환 명세·코드 주석에서 이 이름(또는 SID)만 쓴다.
`docs/grid-types.md`(그리드), `docs/button-types.md`(버튼)와 같은 방식이다.

- **SID** = 화면스타일-ID(Style ID). 이름 대신 짧게 부르는 약어다. 예: "이 화면은 SGVF".
- 스타일은 **Tab 파일(화면 껍데기)** 에 붙인다. `*_Edit_*` 파일은 Tab 안에 붙는 폼 부품이며, 위치는 스타일이 정하고 폼 종류(읽기 전용/편집)는 SGVF·SGEF가 구분한다.
- Tab 파일 머리 주석에 `스타일: SGVF` 한 줄을 적는다.

> 상태: **견본 확정(2026-10-29)**. 아래 SID 18개 모두 `docs/page-style/{SID}/`에 견본이 있다. 견본은 사용자가 화면을 열어 확인·수정한 것이다. 판별기(`yunhee page-style`) 수정 의뢰는 `docs/yunhee-page-style-판별.md`. 나중에 들어온 SID(SGHF·TO·GO·DSBRD·IN)는 대표 화면 하나만 보고 정했으므로, 같은 SID로 묶은 다른 화면을 맞추다가 규칙이 바뀔 수 있다(그때 이 문서와 견본을 같이 고친다).

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
| STP | SearchBar+TabPanel | 위 툴바(성명 등 입력 + 버튼들, 그리드 없음), 아래 탭 컨테이너(탭마다 서로 다른 내부 구성, 툴바의 대상이 모든 탭에 전달됨) | `Pay10_Tab_Retire` (퇴직정산, S22) |
| CG | CrudGrid | 편집 가능한 그리드 하나 | 코드 관리류 |
| GCG | Grid+Calendar+Grid | 위 제목 줄(기준일자 + 새로고침 아이콘)과 그리드(현황), 아래 좌측 달력·[예약하기] 버튼 / 우측 라디오(MY·전체) + 그리드(달력 날짜 연동). 조회 툴바 없음 | `Car03_Tab_List` (공용차량 예약관리, T13) |
| TP | TabPanel | 툴바·그리드 없이 탭 컨테이너만(탭마다 자기 툴바·내용을 가짐) | `Rpt10_Tab_FssOrg` (업무보고서, T17) |
| SR | SearchBar+RD | 위 툴바 한 줄(조회기간 등 + [조회], `SearchBar`), 아래 RD 보고서 영역(iframe) 하나. 그리드 없음 | `Emp01_Tab_InoutState` (기간별 입퇴사현황, T18) |
| SGHF | SearchGrid+HorizontalForm | 조회 줄 + 그리드 + 편집 폼을 **좌우**로 배치(SGEF의 좌우 버전). 제안 2026-10-29, 견본 확정 2026-10-29 | `Biz01_Tab_Card` (1131) |
| TO | TreeOnly | 트리 중심, 오른쪽이 일반 그리드가 아님/없음, 편집은 팝업. 제안, 견본 확정 2026-10-29 | `Org01_Tab_OrgCode` (1028) |
| GO | GridOnly | 그리드 하나, 조회 툴바 없음(직접 만든 조건 줄). 제안, 견본 확정 2026-10-29 | `Tdm54_Tab_CheckInsuff` (1459) |
| DSBRD | Dashboard | 그리드·트리·툴바 없이 카드/요약 영역. 제안, 견본 확정 2026-10-29 | `Tdm50_Tab_TotalDashboard` (1495) |
| IN | Info | 조회·저장 없는 안내 문서(안내 문구 + 링크/HTML). 제안 2026-10-29, 견본 확정 2026-10-29 | `Flt00_Tab_Info` (1369) |

> 위 5개(SGHF·TO·GO·DSBRD·IN)는 2026-10-29 제안이다(모두 견본 확정). 사용자가 대표 화면을 열어 확인·수정한 뒤 `docs/page-style/{SID}/`에 견본을 넣고 상세 절을 만든다. 판별기 규칙은 `docs/yunhee-page-style-판별.md`.

## 스타일별 상세

### SG — SearchGrid

견본: `docs/page-style/SG/Tdm01_Tab_Hr.tsx` (임원 등록)

- 가장 단순한 형태: 바깥 여백 20, 안쪽 `padding 10`, 테두리 없음. 세로 flex로 `SearchBar` + `SingleGrid`를 쌓고 툴바-그리드 간격은 `gap: 8`(SGVF 등의 `marginTop: 8`과 같은 간격).
- 조회 외 원본 버튼(예: [인사정보 가져오기])은 `SearchBar`의 `extra`. 조회창(`*_Lookup_*`)은 화면 끝에 `open`/`onClose`로 붙인다(편집 팝업이 아니라 조회창이면 SGP가 아니라 SG).
- 이 견본은 열 때 조회한다(원본이 그렇다). 조건이 2개라 초기화(UX-02)는 넣지 않는다.

### SGVF — SearchGrid+ViewForm

`Fnd01_Tab_FundSearch` 기준.

- 세로 `Splitter`: 위(테두리 박스) = `SearchBar` + `SingleGrid`, 아래(약 320) = 읽기 전용 폼(`*_Edit_*`).
- 열 때 조회하지 않고, 조회가 끝나면 첫 행을 고른다. 그리드 선택이 바뀌면 아래 폼을 갱신하고, 선택이 없으면 빈 폼.
- 아래 폼에는 버튼이 없다. 칸은 모두 `readOnly`.

견본: `docs/page-style/SGVF/` (`Fnd01_Tab_FundSearch.tsx` + `Fnd01_Edit_FundSearch.tsx`)

공통 규칙 4가지(SGVF·SGEF 모두). 2~4번은 **폼이 있는 스타일에서만** 의미가 있다(특히 3번 최소 크기는 폼이 가려지지 않게 하려는 것이라 view/edit 폼일 때만 둔다):
1. SearchBar와 그리드 사이 세로 간격 8px (그리드를 감싼 div에 `marginTop: 8`)
2. 폼 라벨은 오른쪽 정렬 (`textAlign: 'right'` + `paddingRight: 10`)
3. 폼 영역은 최소 크기를 가져 가려지지 않는다 (아래 `Splitter.Panel`의 `min={360}`)
4. 폼의 줄(row) 사이 간격은 크지 않게 (Row margin `10px 20px 10px 20px`)

### SGEF — SearchGrid+EditForm

견본: `docs/page-style/SGEF/` (`Fnd01_Tab_FundCode.tsx` + `Fnd01_Edit_FundCode.tsx`)

- 구조는 SGVF와 같고 아래 폼이 편집형이다. 아래 가운데 [저장] 버튼 줄(60), 선택 행이 없으면 폼 비활성.
- 위 공통 규칙 4가지를 그대로 적용한다. 라벨 폭(120/145)과 칸 폭은 원본(AS-IS) 값을 따른다.
- 위쪽 박스(SearchBar + 그리드)에는 테두리를 두지 않는다(SGVF와 같음).

**변형 — 아래 폼 안에 보조 그리드(첨부 등)가 있는 경우** (2026-10-29 MG를 SGEF에 합쳤다)

견본: `docs/page-style/SGEF/` (`Sys90_Tab_AfterService.tsx` 개선사항 및 오류 통보 1066 + 편집 폼 `Sys90_Edit_Board.tsx` + 첨부 그리드 `Sys90_Grid_ApprFile.tsx`). 같은 모양: `Sys90_Tab_AfterServiceAdmin`, `Ics20_Tab_RevisionHistory`·`Admin`.

- 바깥 배경 `#fff`. 세로 `Splitter`: 위 = 조회 줄(`SearchBar`) + 그리드(바깥 여백 `20 20 8`, `gap 8`, 최소 200), 아래 = 편집 폼(기본·최소 = 폼 높이 합계). 폼 높이 합계(위 줄 190 + 아래 줄 160 + 저장·삭제 줄 60 = 410)보다 작으면 저장·삭제가 가려지므로 **최소 높이를 합계로 둔다**(줄 높이를 바꾸면 같이 바꾼다). 아래 폼을 고정 높이로 두지 않는다.
- 편집 폼 규칙: 라벨은 모두 **오른쪽 정렬**(폭 100), 라벨과 입력란 가로 간격 8. 줄과 줄 사이 세로 간격 8. 파일 올리기 버튼은 `첨부파일` 라벨 바로 아래. 저장·삭제 버튼 줄 위에 얇은 구분선(`#d9d9d9`).
- 첫 줄은 배경 `#F7F8FC`(원본 색)로 아래 줄과 구분한다.
- `Sms03_Tab_SendAdmin`은 이 변형이 아니다(조건 줄 없는 좌우 분할). SID 미정.

### SGTP — SearchGrid+TabPage (초안)

견본: `docs/page-style/SGTP/` (`Fnd20_Tab_Plan.tsx` + `Fnd20_TabPage_Plan.tsx`)

- 구조는 SGVF·SGEF와 같은 위아래 분할(위 40%, 아래 60%)이고, 아래가 폼이 아니라 **탭 영역**(`*_TabPage_*` 파일)이다.
- 위: 테두리 없는 SearchBar + `SingleGrid`(툴바와 그리드 사이 `marginTop: 8`). 열 때 조회하고, 조회가 끝나면 첫 행을 고른다.
- 그리드 행을 누르면 아래 탭이 그 행의 id로 다시 읽는다(`target = { fundId, nonce }` — 같은 행을 다시 눌러도 nonce를 올려 다시 읽는다).
- SGVF·SGEF의 공통 규칙 4가지 중 툴바-그리드 간격(1)만 적용한다. 아래는 그리드 탭이라 라벨 정렬(2)·폼 줄 간격(4)은 해당 없고(탭 안은 지금 그대로), 폼 최소 크기(3)도 두지 않는다.
- 초기화(UX-02): 조건 3개(펀드유형·기획펀드·완료건포함)라 `useSearchParams` + `onReset={sp.reset}`로 넣었다. 초기화 뒤 자동 조회는 하지 않는다.

### CG — CrudGrid (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/CG/Apr10_Tab_Stamp.tsx` (사용인감등록, 1026)

- SG와 같은 틀: 바깥 여백 20 + 배경 `#fff`, 안쪽 `padding 10`, 테두리 없음, 세로 flex `gap: 8`.
- 위: 버튼 줄(`[조회][등록][저장][삭제]`, 간격 `gap: 8`). 조건 입력이 없어 `SearchBar`를 쓰지 않는다. 아래: 셀 편집 그리드(`CellEditGrid` + `useGridCrud`).
- 조건 입력이 있는 편집 그리드는 SG처럼 `SearchBar`를 쓰고 [등록]·[저장]·[삭제]는 `extra`에 둔다(견본에는 없는 경우 — 그런 화면이 나오면 이 절에 보탠다).

### TG — Tree+Grid (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/TG/Sys06_Tab_Menu.tsx` (메뉴 관리, 1077)

- 바깥 여백 20 + 배경 `#fff`. 가로 `Splitter`: 왼쪽 = 트리 그리드(`useTreeGrid`, min 300), 오른쪽 = 그리드(기본 600, min 200 / max 1000). 패널마다 `1px solid #d9d9d9` 테두리, `boxSizing: 'border-box'`(테두리가 높이 100%에 더해져 스크롤바가 2개 생기는 것을 막는다).
- 툴바는 전체 폭이 아니라 **왼쪽(트리) 패널 안 위**에 둔다(SGT와 다르다). 제목 + 검색어 묶음과 버튼 묶음을 `flexWrap: 'wrap'`으로 두어, 패널이 좁아지면 **버튼 묶음 전체가** 제목 줄 아래로 내려간다(버튼이 하나씩 떨어지지 않게 묶음 단위로 `flex: 'none'`). 헤더는 `minHeight: 50`.
- 트리의 이름 열(`treeCol`)은 `pinned: 'left'`로 고정해 가로 스크롤해도 보인다.
- 트리 행을 고르면 오른쪽 그리드가 그 행의 id로 다시 조회한다.

### SGHF — SearchGrid+HorizontalForm (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/SGHF/` (`Biz01_Tab_Card.tsx` 이익제공 입력(법인카드) 1131 + 오른쪽 위 편집 폼 `Biz01_Edit_Card.tsx` + 오른쪽 아래 `Biz02_Grid_PersonList.tsx`)

- 바깥 여백 20 + 배경 `#fff`. 가로 `Splitter`: 왼쪽 = 조회 줄 + 그리드(최소 600), 오른쪽 = 편집 폼 + 보조 그리드(기본 420, 최소 300). **패널에 외곽 테두리를 두지 않는다.**
- 왼쪽 조회 줄 영역은 위 padding 0(`0 10px 10px 10px`)이라 첫 라벨이 바깥 여백 20만큼만 떨어진다. 조회 줄(`SearchBar`)과 버튼 줄 사이 `gap: 8`.
- 왼쪽 그리드 아래의 입력 줄(문서분류·상신 등)은 얇은 위쪽 구분선만 둔다(안쪽 구분선은 유지).
- 오른쪽은 위 편집 폼(높이 고정 300) + 아래 보조 그리드(남는 높이).


### TO — TreeOnly (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/TO/` (`Org01_Tab_OrgCode.tsx` 조직정보 등록 1028 + 편집 팝업 `Org01_Edit_OrgCode.tsx`). 화면을 열어 확인했고 고칠 곳 없이 현재 모양 그대로 확정.

- 바깥 여백 20 + 배경 `#fff`, 세로 flex `gap: 8`. 위: 툴바 한 줄(기준일 + [조회]·[하위조직등록]·[조직도보기], `Space wrap`). 아래: 전체 폭 트리 그리드 하나(`useTreeGrid` + `SingleGrid`, 남는 높이).
- 오른쪽에 내용 그리드·Splitter가 없다(TG와 다르다). 행의 수정은 편집 팝업(`*_Edit_*`)으로 한다.

### GO — GridOnly (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/GO/` (`Tdm54_Tab_CheckInsuff.tsx` 미흡내역 조치 1459)

- 바깥 여백 20 + 배경 `#fff`, **외곽 테두리 박스 없음**. 세로 flex: 위 = 직접 만든 조건 줄(`SearchBar`를 쓰지 않는다), 아래 = 그리드 하나(남는 높이).
- 조건 줄은 고정 높이를 두지 않는다(글자가 가운데 놓여 위 간격이 벌어진다). `padding: 0 10px 8px`로 두어 첫 라벨이 바깥 여백 20만큼만 떨어지게 한다.
- 버튼은 [조회] 뒤에 [초기화]. 초기화는 조건을 처음 열 때 값으로 되돌리고 자동 조회는 하지 않는다(처음 값이 서버에서 오는 부서 같은 것은 `ref`에 보관).
- 이름은 GridOnly이지만 이 견본은 조건 줄이 있다. 조건 줄 없이 그리드만 있는 화면(`Sms02_Tab_TotalCount`·`Sys10_Tab_TotalSize`)이 같은 SID에 들어갈지는 그 화면을 열어 확인한다.

### DSBRD — Dashboard (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/DSBRD/` (`Tdm50_Tab_TotalDashboard.tsx` 책무점검 현황 1495 + 탭 페이지 `Tdm50_Tab_Dashboard.tsx` + 공통 `Tdm50_Dashboard_Common.tsx`)

- 바깥 여백 20 + 배경 `#fff`, **외곽 테두리 없음**. 위: 공용 탭 `PageTabs`(총괄·임원별·부서별) — 탭 막대가 바깥 여백 20만큼만 떨어지게 하고 탭 막대 위에 따로 공간을 주지 않는다. 아래: 탭 페이지(세 탭을 모두 만들어 두고 숨기기만 한다).
- 탭 페이지 안: 툴바 줄(점검년월·라디오·[새로고침]) + 요약 칸(모니터 3칸, 각 칸의 값은 **가로·세로 가운데**) + 아래 그리드들.
- 라디오처럼 AS-IS 폭이 좁은 것은 글자가 잘리지 않게 필요한 만큼 넓힌다(최종승인·점검완료 75→105).
- 이름은 `DB`가 DataBase로 읽혀서 `DSBRD`로 바꿨다(2026-10-29, 5자라 SID 길이 규칙을 2~5자로 넓혔다).
- **탭이 없는 변형**(2026-10-29): `Tdm35_Tab_TaskList`(책무조회 1467)는 탭 없이 위 기준일 툴바(고정 높이 없음, `padding 0 10px 8px`) + 아래 [엑셀다운로드] 4줄이다. 조회 툴바·그리드가 없고 값·다운로드만 보여 주므로 DSBRD에 넣는다. 바깥 여백 20 + 배경 `#fff`, 외곽 테두리 없음은 같다. 탭 `PageTabs`는 **탭이 있는 화면에서만** 쓴다.

### IN — Info (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/IN/` (`Flt00_Tab_Info.tsx` 임직원매매 화면사용순서 1369). 화면을 열어 확인했고 고칠 곳 없이 현재 모양 그대로 확정.

- 바깥 여백 20 + 세로 flex. 위: 안내 한 줄(작은 굵은 글씨, 위 간격 10). 아래: 테두리 박스 안에 안내 문서(`padding 15`, 스크롤). 조회·저장이 없고 안내 문구와 링크(메뉴 열기)만 있다.
- 박스 안 글줄은 `lineHeight 2.0`, 링크는 AS-IS 색(`#0070C0`)이다. 이 SID는 조건 줄·그리드·탭이 없는 문서 화면이다(DB와 달리 값을 조회하지 않는다).

### SGT — SearchGrid+Tree (초안, 2026-10-29 견본 확정)

견본: `docs/page-style/SGT/` (`Fnd08_Tab_OrgAuth.tsx` 펀드 권한설정 1050 + `Fnd08_Page_OrgAuth.tsx` 오른쪽 트리).

- 위: SearchBar를 전체 폭으로(테두리 박스). 아래: 가로 `Splitter`, 왼쪽 = 그리드(기본 50%), 오른쪽 = 트리(`*_Page_*` 파일).
- 그리드 행을 고르면 오른쪽 트리가 그 행의 id로 다시 조회한다. 조회가 끝나면 첫 행을 고른다.
- SGVF·SGEF의 공통 규칙 4가지는 이 스타일에 그대로 적용되지 않는다(아래 폼이 없고, 툴바는 그리드 위가 아니라 전체 폭 위에 있다). 이 스타일의 규칙은 견본의 모양 그대로다(2026-10-29 사용자 확인).
- 역할 구분: Tab(`Fnd08_Tab_OrgAuth`) = 툴바 + 그리드 + `Splitter`, Page(`Fnd08_Page_OrgAuth`) = 오른쪽 트리.

### GG — Grid+Grid (초안)

견본: `docs/page-style/GG/` (`Est02_Tab_PfResultReport.tsx` + `Est03_TabPage_PfHistoryList.tsx`)

- 세로 `Splitter` 위 50% / 아래 50%(최소 120 / 200). 위: 테두리 없는 SearchBar + `SingleGrid`(툴바-그리드 `marginTop: 8`, 바깥 여백 `20 20 0 20`). 아래: 상세 그리드(`*_TabPage_*` 파일), 바깥 여백 20.
- 위·아래 모두 **외곽 테두리 박스를 두지 않는다**(SGTP는 아래 탭에 테두리가 있다).
- 열 때 조회하고, 조회가 끝나면 첫 행을 고른다. 행을 누르면 아래가 그 행의 id로 다시 읽는다(`pfContractId` + `nonce` — 같은 행을 다시 눌러도 다시 읽는다).
- SGTP와 구조가 같고 아래가 탭 영역이 아니라 그리드 하나인 경우가 GG다.

### SGP — SearchGrid+Popup (초안)

견본: `docs/page-style/SGP/` (`Chk02_Tab_DailyList.tsx` + 편집 팝업 `Chk02_Edit_DailyList.tsx` + 조회창 `Chk02_Lookup_UseYn.tsx`). yunhee `page-style`의 판별 근거: "조회 툴바 + 그리드 하나 + 편집 팝업".

- 구조는 SG와 같다(바깥 여백 20, 세로 flex로 `SearchBar` + `SingleGrid`/`MultiGrid`, 툴바-그리드 `gap: 8`). 다른 점은 행 편집을 그리드 셀이 아니라 **편집 팝업(`*_Edit_*`)** 으로 한다는 것이다.
- [등록]·그리드의 [수정] 아이콘이 편집 팝업을 열고, 저장하면 팝업을 닫고 다시 조회한다. 삭제는 체크한 행을 확인창(YES) 뒤에 지운다.
- 조회창(`*_Lookup_*`)은 SG와 같이 화면 끝에 `open`/`onClose`로 붙인다. 편집 팝업이 없고 조회창만 있으면 SG다.
- 폼이 화면에 붙는 SGEF와 달리 폼은 팝업 안에만 있다.
- 편집 팝업(`*_Edit_*`)은 EditModal 규격으로 만든다 — 헤더 아래 선·푸터 위 선·라벨 오른쪽 정렬·본문 위아래 간격 12 (`AssetERP/docs/11-프론트부품.md` §4a, 03 원칙 16).

(나머지 스타일은 전체 조사 후 같은 형식으로 채운다.)

### GCG — Grid+Calendar+Grid (초안, 2026-10-29 T13에서 등록, 2026-10-29 견본 확정)

견본: `docs/page-style/GCG/` (`Car03_Tab_List.tsx` 공용차량 예약관리 1187 + 아래 영역 `Car03_Tab_DayofMonth.tsx`)

- 위·아래를 세로 `Splitter`로 나눈다(위 기본 300·최소 150, 아래 최소 200). 위 영역은 **외곽 테두리 없이** 바깥 여백 `20 20 0 20`, 제목 줄은 고정 높이 없이 글자 크기대로 두고 아래 8을 띄운다(제목 오른쪽 끝에 새로고침 아이콘, 줄 `space-between`). 아래 영역의 박스는 테두리를 두되 구분선과의 위쪽 여백은 8이다.
- `yunhee page-style`이 AS-IS `Car03_Tab_List`를 `미분류(그리드 하나, 조회 툴바 없음)`로 판별한다 — 판별기에 GCG 규칙이 없다(yunhee 수정사항 제안).
- 위(높이 300, 여백 20/20/0/20): 제목 줄(`공용차량 예약현황 (기준일자 : yyyy년 MM월 dd일)` + 오른쪽 새로고침 아이콘) 아래 `SingleGrid`. 아래: 왼쪽(폭 300) 달력 + [예약하기], 오른쪽 라디오(MY 예약 / 전체 예약) + `SingleGrid`. 달력 날짜·라디오가 바뀌면 오른쪽 그리드를 다시 조회하고 위 그리드도 같이 조회한다.
- 행 [상세보기] 아이콘이 예약 팝업(`*_Popup_*`)을 열고, [삭제] 아이콘은 확인창(YES) 뒤에 지운다.

### STP — SearchBar+TabPanel (초안, 2026-10-28 S22에서 등록, 2026-10-29 견본 확정)

견본: `docs/page-style/STP/` (`Pay10_Tab_Retire.tsx` 퇴직정산 1274 + 탭 페이지 `Pay10_TabPage_Retire.tsx`)

- 바깥 여백 20 + 배경 `#fff`, **외곽 테두리 박스를 두지 않는다**(툴바·탭 영역 모두 `padding 10`). 탭 아래 내용 영역의 얇은 테두리만 남겨 탭과 내용을 잇는다.
- 탭은 눌러 쓰는 탭임이 분명해야 한다: 공통 부품 `PageTabs`(`components/tabs`, `Tabs` 대신 쓴다) — 안 고른 탭은 회색 바탕+테두리+손가락 커서(마우스를 올리면 연한 파랑), 고른 탭은 흰 바탕+위 파란 줄 3px+굵은 파란 글자. TP도 같다.
- 위: 툴바 한 줄(입력 + [조회] 등 버튼 — `SearchBar`), 아래: 탭 컨테이너. 그리드가 없어 `yunhee page-style`은 AS-IS·TOBE 모두 `미분류(그리드 없음)`로 판별한다 — 판별기에 STP 규칙이 없다(yunhee 수정사항 제안).
- 탭 페이지는 `forwardRef` 핸들(`retrieve(param)`·`clear`)을 노출하고 부모가 탭 선택·[조회]·입력 변경 때 부른다. 처음 연 탭은 마운트한 뒤 조회하고 한 번 연 탭은 숨기기만 한다. 예: `Pay10_Tab_Retire`(`payRetireTab.ts`), `Pay20_Tab_DeductAdmin`(탭만 있고 툴바 없음)

### TP — TabPanel (초안, 2026-10-29 T17에서 등록, 2026-10-29 견본 확정)

견본: `docs/page-style/TP/` (`Rpt10_Tab_FssOrg.tsx` 업무보고서 1289 + RD 탭 페이지 `Org02_Rd_OrgState.tsx`·공통 처리 `useRdStatePage.tsx`)

- 바깥 여백 20 + 배경 `#fff`, 탭은 공통 부품 `PageTabs`(STP와 같은 모양), **탭 아래 내용 영역에 외곽 테두리를 두지 않는다**(안쪽 `padding 10`만).
- 화면 전체가 탭 컨테이너 하나(여백 20). 툴바가 탭 위에 없고 탭 페이지마다 자기 툴바(기준년월 + [조회] 등)를 가진다 — 툴바가 위에 있는 STP와 다르다. 그리드가 없어 `yunhee page-style`은 `미분류(그리드 없음)`으로 판별한다(판별기에 TP 규칙이 없다 — yunhee 수정사항 제안).
- 탭을 고르면 그 탭 페이지가 `retrieve`를 한다(AS-IS `InterfaceTabPage.retrieve`). 처음 연 탭은 선택 이벤트가 없어 조회하지 않는다. 한 번 연 탭은 숨기기만 한다(STP와 같음). 예: `Rpt10_Tab_FssOrg`(탭 6개 = RD 보고서 페이지)

### SR — SearchBar+RD (초안, 2026-10-29 T18에서 등록, 2026-10-29 견본 확정)

견본: `docs/page-style/SR/` (`Emp01_Tab_InoutState.tsx` 기간별 입퇴사현황 1287 + RD 영역 `Emp01_Rd_InoutState.tsx`). 화면을 열어 확인했고 고칠 곳 없이 현재 모양 그대로 확정.
- 위: `SearchBar`(조회기간 시작 ~ 끝 + [조회]), 아래: RD 보고서 `iframe`(남은 높이 전부). 그리드가 없어 `yunhee page-style`은 `미분류(그리드 없음)`로 판별한다(판별기에 SR 규칙이 없다 — yunhee 수정사항 제안).
- RD 영역은 AS-IS `Emp01_Rd_*` 클래스(RD 주소 발급 + iframe)로 따로 두고 탭이 `retrieve(param)`을 부른다. 열 때 한 번 조회하는 화면(`Emp01_Tab_InoutState`)과 열 때 조회하지 않는 화면(탭 안 RD 페이지, TP)이 있다.

## 견본 사용법

- `docs/page-style/{SID}/`의 파일은 **읽기 전용 참조용 복사본**이다. 빌드·타입 검사 대상이 아니고(`docs/`는 `tsconfig` 밖) import하지 않는다. 보고 따라 쓴다.
- 새 화면은 견본을 복사해 시작하지 않고, 같은 SID의 최신 구조를 보고 AS-IS 원본 레이아웃에 맞춰 작성한다(03 원칙 12).
- 견본 갱신: 스타일 규칙이 바뀌면 `src/pages/`의 화면과 `docs/page-style/{SID}/` 복사본, 이 문서를 같은 작업에서 함께 고친다. 복사본과 원본 화면이 달라졌는지는 `diff`로 확인한다.
- 같은 SID 화면을 찾으려면 `grep -rn '스타일: SGVF' AssetERP/frontend/src/pages`.

## 추가 규칙

- 초기화 버튼(UX-02, `AssetERP/docs/10-UX보강.md`): 검색 조건이 **3개 이상**이고 버튼을 넣을 **공간이 있을 때만** 넣는다. 조건이 2개 이하이거나 줄바꿈되면 넣지 않는다.

- 새 스타일이 필요하면 이 표에 먼저 SID를 등록한 뒤 쓴다(SID는 2~5자 대문자, 중복 금지).
- 한 화면이 두 스타일에 걸치면 주된 것을 SID로 적고 주석에 차이를 적는다.
