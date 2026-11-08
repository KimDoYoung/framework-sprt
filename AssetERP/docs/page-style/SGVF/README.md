# SGVF — SearchGrid+ViewForm

`Fnd01_Tab_FundSearch` 기준.

- 세로 `Splitter`: 위(테두리 박스) = `SearchBar` + `SingleGrid`, 아래(약 320) = 읽기 전용 폼(`*_Edit_*`).
- 열 때 조회하지 않고, 조회가 끝나면 첫 행을 고른다. 그리드 선택이 바뀌면 아래 폼을 갱신하고, 선택이 없으면 빈 폼.
- 아래 폼에는 버튼이 없다. 칸은 모두 `readOnly`.

견본: `docs/page-style/SGVF/` (`Fnd01_Tab_FundSearch.tsx` + `Fnd01_Edit_FundSearch.tsx`)

적용 화면: `Fnd01_Tab_FundSearch`(견본), `Scm01_Tab_Sr`(EE15 — 아래 폼이 둘이라 분할이 셋: 위 그리드 / 가운데 입력·결재 폼 / 아래 읽기 전용 폼. 가운데 폼은 버튼이 있다). 점검 규칙은 `tools/page-style-check.py`의 `SGVF`(EE15에서 추가).

공통 규칙 4가지(SGVF·SGEF 모두). 2~4번은 **폼이 있는 스타일에서만** 의미가 있다(특히 3번 최소 크기는 폼이 가려지지 않게 하려는 것이라 view/edit 폼일 때만 둔다):
1. SearchBar와 그리드 사이 세로 간격 8px (그리드를 감싼 div에 `marginTop: 8`)
2. 폼 라벨은 오른쪽 정렬 (`textAlign: 'right'` + `paddingRight: 10`)
3. 폼 영역은 최소 크기를 가져 가려지지 않는다 (아래 `Splitter.Panel`의 `min={360}`)
4. 폼의 줄(row) 사이 간격은 크지 않게 (Row margin `10px 20px 10px 20px`)
