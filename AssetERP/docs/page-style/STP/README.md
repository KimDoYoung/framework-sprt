# STP — SearchBar+TabPanel
견본: `docs/page-style/STP/` (`Pay10_Tab_Retire.tsx` 퇴직정산 1274 + 탭 페이지 `Pay10_TabPage_Retire.tsx`)

- 바깥 여백 20 + 배경 `#fff`, **외곽 테두리 박스를 두지 않는다**(툴바·탭 영역 모두 `padding 10`). 탭 아래 내용 영역의 얇은 테두리만 남겨 탭과 내용을 잇는다.
- 탭은 눌러 쓰는 탭임이 분명해야 한다: 공통 부품 `PageTabs`(`components/tabs`, `Tabs` 대신 쓴다) — 안 고른 탭은 회색 바탕+테두리+손가락 커서(마우스를 올리면 연한 파랑), 고른 탭은 흰 바탕+위 파란 줄 3px+굵은 파란 글자. TP도 같다.
- 위: 툴바 한 줄(입력 + [조회] 등 버튼 — `SearchBar`), 아래: 탭 컨테이너.
- 탭 페이지는 `forwardRef` 핸들(`retrieve(param)`·`clear`)을 노출하고 부모가 탭 선택·[조회]·입력 변경 때 부른다. 처음 연 탭은 마운트한 뒤 조회하고 한 번 연 탭은 숨기기만 한다. 예: `Pay10_Tab_Retire`(`payRetireTab.ts`), `Pay20_Tab_DeductAdmin`(탭만 있고 툴바 없음)
