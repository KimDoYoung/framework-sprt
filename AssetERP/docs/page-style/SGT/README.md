# SGT — SearchGrid+Tree
견본: `docs/page-style/SGT/` (`Fnd08_Tab_OrgAuth.tsx` 펀드 권한설정 1050 + `Fnd08_Page_OrgAuth.tsx` 오른쪽 트리).

- 위: SearchBar를 전체 폭으로(테두리 박스). 아래: 가로 `Splitter`, 왼쪽 = 그리드(기본 50%), 오른쪽 = 트리(`*_Page_*` 파일).
- 그리드 행을 고르면 오른쪽 트리가 그 행의 id로 다시 조회한다. 조회가 끝나면 첫 행을 고른다.
- SGVF·SGEF의 공통 규칙 4가지는 이 스타일에 그대로 적용되지 않는다(아래 폼이 없고, 툴바는 그리드 위가 아니라 전체 폭 위에 있다). 이 스타일의 규칙은 견본의 모양 그대로다(2026-10-29 사용자 확인).
- 역할 구분: Tab(`Fnd08_Tab_OrgAuth`) = 툴바 + 그리드 + `Splitter`, Page(`Fnd08_Page_OrgAuth`) = 오른쪽 트리.
