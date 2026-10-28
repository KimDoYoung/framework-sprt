# 페이지 스타일 (Page Style)

`*_Tab_*` 화면의 배치(화면 구성)에 붙이는 공통 이름표. 대화·변환 명세·코드 주석에서 이 이름(또는 SID)만 쓴다.
`docs/grid-types.md`(그리드), `docs/button-types.md`(버튼)와 같은 방식이다.

- **SID** = 화면스타일-ID(Style ID). 이름 대신 짧게 부르는 약어다. 예: "이 화면은 SGVF".
- 스타일은 **Tab 파일(화면 껍데기)** 에 붙인다. `*_Edit_*` 파일은 Tab 안에 붙는 폼 부품이며, 위치는 스타일이 정하고 폼 종류(읽기 전용/편집)는 SGVF·SGEF가 구분한다.
- Tab 파일 머리 주석에 `스타일: SGVF` 한 줄을 적는다.

> 상태: **초안**. 두 파일(`Fnd01_Tab_FundSearch` + `Fnd01_Edit_FundSearch`)만 보고 정했다. `_Tab_` 전체를 조사해 실제 배치를 묶은 뒤 확정한다.

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
| CG | CrudGrid | 편집 가능한 그리드 하나 | 코드 관리류 |

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

### SGTP — SearchGrid+TabPage (초안)

견본: `docs/page-style/SGTP/` (`Fnd20_Tab_Plan.tsx` + `Fnd20_TabPage_Plan.tsx`)

- 구조는 SGVF·SGEF와 같은 위아래 분할(위 40%, 아래 60%)이고, 아래가 폼이 아니라 **탭 영역**(`*_TabPage_*` 파일)이다.
- 위: 테두리 없는 SearchBar + `SingleGrid`(툴바와 그리드 사이 `marginTop: 8`). 열 때 조회하고, 조회가 끝나면 첫 행을 고른다.
- 그리드 행을 누르면 아래 탭이 그 행의 id로 다시 읽는다(`target = { fundId, nonce }` — 같은 행을 다시 눌러도 nonce를 올려 다시 읽는다).
- SGVF·SGEF의 공통 규칙 4가지 중 툴바-그리드 간격(1)만 적용한다. 아래는 그리드 탭이라 라벨 정렬(2)·폼 줄 간격(4)은 해당 없고(탭 안은 지금 그대로), 폼 최소 크기(3)도 두지 않는다.
- 초기화(UX-02): 조건 3개(펀드유형·기획펀드·완료건포함)라 `useSearchParams` + `onReset={sp.reset}`로 넣었다. 초기화 뒤 자동 조회는 하지 않는다.

### SGT — SearchGrid+Tree (초안, 견본 없음)

`Fnd08_Tab_OrgAuth` 기준.

- 위: SearchBar를 전체 폭으로(테두리 박스). 아래: 가로 `Splitter`, 왼쪽 = 그리드(기본 50%), 오른쪽 = 트리(`*_Page_*` 파일).
- 그리드 행을 고르면 오른쪽 트리가 그 행의 id로 다시 조회한다. 조회가 끝나면 첫 행을 고른다.
- SGVF·SGEF의 공통 규칙 4가지는 이 스타일에 그대로 적용되지 않는다(아래 폼이 없고, 툴바는 그리드 위가 아니라 전체 폭 위에 있다). 이 스타일에 맞는 규칙은 화면 몇 개를 더 본 뒤 정한다.
- 오른쪽 트리는 `Fnd08_Page_OrgAuth`처럼 `*_Page_*` 파일이다. Tab과 Page의 역할 구분도 정해야 한다.

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

## 견본 사용법

- `docs/page-style/{SID}/`의 파일은 **읽기 전용 참조용 복사본**이다. 빌드·타입 검사 대상이 아니고(`docs/`는 `tsconfig` 밖) import하지 않는다. 보고 따라 쓴다.
- 새 화면은 견본을 복사해 시작하지 않고, 같은 SID의 최신 구조를 보고 AS-IS 원본 레이아웃에 맞춰 작성한다(03 원칙 12).
- 견본 갱신: 스타일 규칙이 바뀌면 `src/pages/`의 화면과 `docs/page-style/{SID}/` 복사본, 이 문서를 같은 작업에서 함께 고친다. 복사본과 원본 화면이 달라졌는지는 `diff`로 확인한다.
- 같은 SID 화면을 찾으려면 `grep -rn '스타일: SGVF' AssetERP/frontend/src/pages`.

## 추가 규칙

- 초기화 버튼(UX-02, `AssetERP/docs/10-UX보강.md`): 검색 조건이 **3개 이상**이고 버튼을 넣을 **공간이 있을 때만** 넣는다. 조건이 2개 이하이거나 줄바꿈되면 넣지 않는다.

- 새 스타일이 필요하면 이 표에 먼저 SID를 등록한 뒤 쓴다(SID는 2~4자 대문자, 중복 금지).
- 한 화면이 두 스타일에 걸치면 주된 것을 SID로 적고 주석에 차이를 적는다.
