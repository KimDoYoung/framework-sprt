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
| SGVF | SearchGrid+ViewForm | 위 그리드, 아래 읽기 전용 폼(상하 분할) | `Fnd01_Tab_FundSearch` (펀드 조회) |
| SGEF | SearchGrid+EditForm | 위 그리드, 아래 편집 폼(저장·삭제 버튼) | 마스터 편집 화면 |
| TG | Tree+Grid | 왼쪽 트리, 오른쪽 그리드 | `*_Tab_ClassTree` 계열 |
| GG | Grid+Grid | 마스터 그리드와 상세 그리드 | |
| CG | CrudGrid | 편집 가능한 그리드 하나 | 코드 관리류 |

## 스타일별 상세

### SGVF — SearchGrid+ViewForm

`Fnd01_Tab_FundSearch` 기준.

- 세로 `Splitter`: 위(테두리 박스) = `SearchBar` + `SingleGrid`, 아래(약 320) = 읽기 전용 폼(`*_Edit_*`).
- 열 때 조회하지 않고, 조회가 끝나면 첫 행을 고른다. 그리드 선택이 바뀌면 아래 폼을 갱신하고, 선택이 없으면 빈 폼.
- 아래 폼에는 버튼이 없다. 칸은 모두 `readOnly`.

견본: `docs/page-style/SGVF/` (`Fnd01_Tab_FundSearch.tsx` + `Fnd01_Edit_FundSearch.tsx`)

공통 규칙 4가지(SGVF·SGEF 모두):
1. SearchBar와 그리드 사이 세로 간격 5px (그리드를 감싼 div에 `marginTop: 5`)
2. 폼 라벨은 오른쪽 정렬 (`textAlign: 'right'` + `paddingRight: 10`)
3. 폼 영역은 최소 크기를 가져 가려지지 않는다 (아래 `Splitter.Panel`의 `min={360}`)
4. 폼의 줄(row) 사이 간격은 크지 않게 (Row margin `10px 20px 10px 20px`)

### SGEF — SearchGrid+EditForm

견본: `docs/page-style/SGEF/` (`Fnd01_Tab_FundCode.tsx` + `Fnd01_Edit_FundCode.tsx`)

- 구조는 SGVF와 같고 아래 폼이 편집형이다. 아래 가운데 [저장] 버튼 줄(60), 선택 행이 없으면 폼 비활성.
- 위 공통 규칙 4가지를 그대로 적용한다. 라벨 폭(120/145)과 칸 폭은 원본(AS-IS) 값을 따른다.
- 위쪽 박스(SearchBar + 그리드)에는 테두리를 두지 않는다(SGVF와 같음).

(나머지 스타일은 전체 조사 후 같은 형식으로 채운다.)

## 견본 사용법

- `docs/page-style/{SID}/`의 파일은 **읽기 전용 참조용 복사본**이다. 빌드·타입 검사 대상이 아니고(`docs/`는 `tsconfig` 밖) import하지 않는다. 보고 따라 쓴다.
- 새 화면은 견본을 복사해 시작하지 않고, 같은 SID의 최신 구조를 보고 AS-IS 원본 레이아웃에 맞춰 작성한다(03 원칙 12).
- 견본 갱신: 스타일 규칙이 바뀌면 `src/pages/`의 화면과 `docs/page-style/{SID}/` 복사본, 이 문서를 같은 작업에서 함께 고친다. 복사본과 원본 화면이 달라졌는지는 `diff`로 확인한다.
- 같은 SID 화면을 찾으려면 `grep -rn '스타일: SGVF' AssetERP/frontend/src/pages`.

## 추가 규칙

- 새 스타일이 필요하면 이 표에 먼저 SID를 등록한 뒤 쓴다(SID는 2~4자 대문자, 중복 금지).
- 한 화면이 두 스타일에 걸치면 주된 것을 SID로 적고 주석에 차이를 적는다.
