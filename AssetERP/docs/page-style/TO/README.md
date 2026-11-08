# TO — TreeOnly
견본: `docs/page-style/TO/` (`Org01_Tab_OrgCode.tsx` 조직정보 등록 1028 + 편집 팝업 `Org01_Edit_OrgCode.tsx`). 화면을 열어 확인했고 고칠 곳 없이 현재 모양 그대로 확정.

- 바깥 여백 20 + 배경 `#fff`, 세로 flex `gap: 8`. 위: 툴바 한 줄(기준일 + [조회]·[하위조직등록]·[조직도보기], `Space wrap`). 아래: 전체 폭 트리 그리드 하나(`useTreeGrid` + `SingleGrid`, 남는 높이).
- 오른쪽에 내용 그리드·Splitter가 없다(TG와 다르다). 행의 수정은 편집 팝업(`*_Edit_*`)으로 한다.
- 같은 모양: `Chk01_Tab_ClassTree`(툴바에 기준일은 없고 [조회]·[상위분류 등록]·[하위분류 등록]). `Fbx01_Tab_Document`는 TO가 아니다(위 문서함 그리드 + 아래 좌 트리·우 파일 목록의 3영역, SID 미정).
