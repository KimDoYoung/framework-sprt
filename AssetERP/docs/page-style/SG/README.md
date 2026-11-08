# SG — SearchGrid

견본: `docs/page-style/SG/Tdm01_Tab_Hr.tsx` (임원 등록)

- 가장 단순한 형태: 바깥 여백 20, 안쪽 `padding 10`, 테두리 없음. 세로 flex로 `SearchBar` + `SingleGrid`를 쌓고 툴바-그리드 간격은 `gap: 8`(SGVF 등의 `marginTop: 8`과 같은 간격).
- 원본 툴바가 **두 줄**이면 `SearchBar` 대신 `SearchPanel`(11 §2)을 쓴다(`page-style-check.py SG`도 둘 다 인정, X17 `Act02_Tab_JournalSub`). yunhee 판별은 직접 만든 조건 줄이라 `GO`로 나온다.
- 조회 외 원본 버튼(예: [인사정보 가져오기])은 `SearchBar`의 `extra`. 조회창(`*_Lookup_*`)은 화면 끝에 `open`/`onClose`로 붙인다(편집 팝업이 아니라 조회창이면 SGP가 아니라 SG).
- 이 견본은 열 때 조회한다(원본이 그렇다). 조건이 2개라 초기화(UX-02)는 넣지 않는다.
- 점검 규칙(`tools/page-style-check.py SG`, U06에서 추가): Splitter 없음 · 바깥 `padding: 20` · 안쪽 `padding: 10` · `gap: 8` · `SearchBar` · 외곽 테두리 없음. 적용 화면: `Tdm01_Tab_Hr`(견본), `Emp50_Tab_TransportExpenseMng`(기존 SG 91개는 다시 건드릴 때 맞춘다). 그리드 아래에 폼 줄(문서분류·상신상태·[상신][문서보기])이 붙는 화면도 테두리 없이 같은 안쪽 `div`에 `flex: none` 높이 70으로 쌓는다.
