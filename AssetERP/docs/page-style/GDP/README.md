# GDP — Grid+DetailPage
견본: `docs/page-style/GDP/` (`Sms02_Tab_TotalCount.tsx` 고객별 문자사용량 1305 + 오른쪽 상세 `Sms02_TabPage_Detail.tsx`). 같은 모양: `Sys10_Tab_TotalSize`, `Ics02_Tab_Manager`, `Sms03_Tab_SendAdmin`(왼쪽 아래에 편집 폼이 더 있는 변형).

- 바깥 배경 `#fff`, **외곽 테두리 없음**. 가로 `Splitter`: 왼쪽 = 버튼 줄 + 그리드(최소 300, 최대 1000, 안쪽 `padding 20`), 오른쪽 = 상세 페이지(기본 540, 최소 300, 안쪽 `padding 20 20 20 0`).
- 왼쪽 위는 조회 조건이 없는 버튼 줄(`SearchBar`를 쓰지 않는다): [조회] 등 + 체크박스 정도. 높이 50, 버튼 `gap 12`.
- 열 때 조회하고, 조회가 끝나면 첫 행을 고른다. 행을 누르면 오른쪽이 그 행의 값(예: 서브도메인)으로 다시 읽는다(선택이 없으면 `null`). 오른쪽 페이지는 `forwardRef` 핸들로 `retrieve(param)`을 노출한다.
- GO(그리드 하나, 오른쪽 없음)·GG(위아래 분할)·SGHF(`SearchBar` + 오른쪽 편집 폼)와 다르다.
- `Sms03_Tab_SendAdmin` 변형: 왼쪽에 버튼 줄 + 그리드 + 편집 폼(높이 450)이 쌓이고 오른쪽이 사용자 목록 그리드다. 왼쪽은 `Splitter` 최소 540(폼이 가려지지 않게).
