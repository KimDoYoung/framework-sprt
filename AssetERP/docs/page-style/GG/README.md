# GG — Grid+Grid
견본: `docs/page-style/GG/` (`Est02_Tab_PfResultReport.tsx` + `Est03_TabPage_PfHistoryList.tsx`)

- 세로 `Splitter` 위 50% / 아래 50%(최소 120 / 200). 위: 테두리 없는 SearchBar + `SingleGrid`(툴바-그리드 `marginTop: 8`, 바깥 여백 `20 20 0 20`). 아래: 상세 그리드(`*_TabPage_*` 파일), 바깥 여백 20.
- 위·아래 모두 **외곽 테두리 박스를 두지 않는다**(SGTP는 아래 탭에 테두리가 있다).
- 열 때 조회하고, 조회가 끝나면 첫 행을 고른다. 행을 누르면 아래가 그 행의 id로 다시 읽는다(`pfContractId` + `nonce` — 같은 행을 다시 눌러도 다시 읽는다).
- SGTP와 구조가 같고 아래가 탭 영역이 아니라 그리드 하나인 경우가 GG다.
- 점검 규칙(`tools/page-style-check.py GG`, U04에서 추가): 세로 `Splitter` · 위 최소 120 · 아래 최소 200 · `SearchBar` · 외곽 테두리 없음. 아래 크기는 원본이 정하면(U04 `Ast06_Tab_TrTax`는 300 고정) 그대로 `defaultSize`에 둔다. 적용 화면: `Est02_Tab_PfResultReport`(견본), `Ast06_Tab_TrTax`, `Emp17_Tab_BenefitManager`(U05 — 아래에 폼 줄이 붙고 위 크기는 원본 0.45에 맞춰 `45%`).
