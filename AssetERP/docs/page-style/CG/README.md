# CG — CrudGrid
견본: `docs/page-style/CG/Apr10_Tab_Stamp.tsx` (사용인감등록, 1026)

- SG와 같은 틀: 바깥 여백 20 + 배경 `#fff`, 안쪽 `padding 10`, 테두리 없음, 세로 flex `gap: 8`.
- 위: 버튼 줄(`[조회][등록][저장][삭제]`, 간격 `gap: 8`). 조건 입력이 없어 `SearchBar`를 쓰지 않는다. 아래: 셀 편집 그리드(`CellEditGrid` + `useGridCrud`).
- 조건 입력이 있는 편집 그리드는 SG처럼 `SearchBar`를 쓰고 [등록]·[저장]·[삭제]는 `extra`에 둔다(견본에는 없는 경우 — 그런 화면이 나오면 이 절에 보탠다).
