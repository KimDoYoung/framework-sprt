# SGTP — SearchGrid+TabPage
견본: `docs/page-style/SGTP/` (`Fnd20_Tab_Plan.tsx` + `Fnd20_TabPage_Plan.tsx`)

- 구조는 SGVF·SGEF와 같은 위아래 분할(위 40%, 아래 60%)이고, 아래가 폼이 아니라 **탭 영역**(`*_TabPage_*` 파일)이다.
- 위: 테두리 없는 SearchBar + `SingleGrid`(툴바와 그리드 사이 `marginTop: 8`). 열 때 조회하고, 조회가 끝나면 첫 행을 고른다.
- 그리드 행을 누르면 아래 탭이 그 행의 id로 다시 읽는다(`target = { fundId, nonce }` — 같은 행을 다시 눌러도 nonce를 올려 다시 읽는다).
- SGVF·SGEF의 공통 규칙 4가지 중 툴바-그리드 간격(1)만 적용한다. 아래는 그리드 탭이라 라벨 정렬(2)·폼 줄 간격(4)은 해당 없고(탭 안은 지금 그대로), 폼 최소 크기(3)도 두지 않는다.
- 초기화(UX-02): 조건 3개(펀드유형·기획펀드·완료건포함)라 `useSearchParams` + `onReset={sp.reset}`로 넣었다. 초기화 뒤 자동 조회는 하지 않는다.
