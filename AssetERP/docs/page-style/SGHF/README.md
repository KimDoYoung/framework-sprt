# SGHF — SearchGrid+HorizontalForm
견본: `docs/page-style/SGHF/` (`Biz01_Tab_Card.tsx` 이익제공 입력(법인카드) 1131 + 오른쪽 위 편집 폼 `Biz01_Edit_Card.tsx` + 오른쪽 아래 `Biz02_Grid_PersonList.tsx`)

- 바깥 여백 20 + 배경 `#fff`. 가로 `Splitter`: 왼쪽 = 조회 줄 + 그리드(최소 600), 오른쪽 = 편집 폼 + 보조 그리드(기본 420, 최소 300). **패널에 외곽 테두리를 두지 않는다.**
- 왼쪽 조회 줄 영역은 위 padding 0(`0 10px 10px 10px`)이라 첫 라벨이 바깥 여백 20만큼만 떨어진다. 조회 줄(`SearchBar`)과 버튼 줄 사이 `gap: 8`.
- 왼쪽 그리드 아래의 입력 줄(문서분류·상신 등)은 얇은 위쪽 구분선만 둔다(안쪽 구분선은 유지).
- 오른쪽은 위 편집 폼(높이 고정 300) + 아래 보조 그리드(남는 높이).
