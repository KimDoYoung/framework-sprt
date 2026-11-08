# GGH — Grid+Grid 좌우
견본: `docs/page-style/GGH/Pay50_Tab_ExpensePay.tsx` (자금집행결의서 조회, 1400)

- GG와 같은 마스터-상세 구조이지만 원본이 **좌우**로 나눈다(BorderLayout: North 툴바 50 / West 680(분할·최대 1000) / Center).
- 위: 바깥 여백 `20 20 0 20`의 테두리 없는 `SearchBar`(전체 폭). 아래: 가로 `Splitter` — 왼쪽 `defaultSize 680`·`max 1000`(안쪽 여백 `8 10 20 20`) / 오른쪽 나머지(안쪽 여백 `8 20 20 10`). **외곽 테두리 박스를 두지 않는다.**
- 열 때 조회하고, 조회가 끝나면 왼쪽 첫 행을 골라 오른쪽을 읽는다(`onRowDataUpdated` → 첫 행 선택, `onSelect` → 상세 조회). 행이 없으면 오른쪽을 비운다.
- 점검 규칙(`tools/page-style-check.py GGH`, U08에서 추가): 가로 `Splitter` · 왼쪽 `defaultSize={680}` · `max={1000}` · `SearchBar` · 외곽 테두리 없음.
