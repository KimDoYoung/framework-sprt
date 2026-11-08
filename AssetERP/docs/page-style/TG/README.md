# TG — Tree+Grid
견본: `docs/page-style/TG/Sys06_Tab_Menu.tsx` (메뉴 관리, 1077)

- 바깥 여백 20 + 배경 `#fff`. 가로 `Splitter`: 왼쪽 = 트리 그리드(`useTreeGrid`, min 300), 오른쪽 = 그리드(기본 600, min 200 / max 1000). 패널마다 `1px solid #d9d9d9` 테두리, `boxSizing: 'border-box'`(테두리가 높이 100%에 더해져 스크롤바가 2개 생기는 것을 막는다).
- 툴바는 전체 폭이 아니라 **왼쪽(트리) 패널 안 위**에 둔다(SGT와 다르다). 제목 + 검색어 묶음과 버튼 묶음을 `flexWrap: 'wrap'`으로 두어, 패널이 좁아지면 **버튼 묶음 전체가** 제목 줄 아래로 내려간다(버튼이 하나씩 떨어지지 않게 묶음 단위로 `flex: 'none'`). 헤더는 `minHeight: 50`.
- 트리의 이름 열(`treeCol`)은 `pinned: 'left'`로 고정해 가로 스크롤해도 보인다.
- 트리 행을 고르면 오른쪽 그리드가 그 행의 id로 다시 조회한다.
