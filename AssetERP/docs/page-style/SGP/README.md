# SGP — SearchGrid+Popup
견본: `docs/page-style/SGP/` (`Chk02_Tab_DailyList.tsx` + 편집 팝업 `Chk02_Edit_DailyList.tsx` + 조회창 `Chk02_Lookup_UseYn.tsx`).

- 구조는 SG와 같다(바깥 여백 20, 세로 flex로 `SearchBar` + `SingleGrid`/`MultiGrid`, 툴바-그리드 `gap: 8`). 다른 점은 행 편집을 그리드 셀이 아니라 **편집 팝업(`*_Edit_*`)** 으로 한다는 것이다.
- [등록]·그리드의 [수정] 아이콘이 편집 팝업을 열고, 저장하면 팝업을 닫고 다시 조회한다. 삭제는 체크한 행을 확인창(YES) 뒤에 지운다.
- 조회창(`*_Lookup_*`)은 SG와 같이 화면 끝에 `open`/`onClose`로 붙인다. 편집 팝업이 없고 조회창만 있으면 SG다.
- 폼이 화면에 붙는 SGEF와 달리 폼은 팝업 안에만 있다.
- 편집 팝업(`*_Edit_*`)은 EditModal 규격으로 만든다 — 헤더 아래 선·푸터 위 선·라벨 오른쪽 정렬·본문 위아래 간격 12 (`AssetERP/docs/1-변환/11-프론트부품.md` §4a, 03 원칙 16).
