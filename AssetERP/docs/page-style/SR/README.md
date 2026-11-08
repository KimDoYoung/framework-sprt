# SR — SearchBar+RD
견본: `docs/page-style/SR/` (`Emp01_Tab_InoutState.tsx` 기간별 입퇴사현황 1287 + RD 영역 `Emp01_Rd_InoutState.tsx`). 화면을 열어 확인했고 고칠 곳 없이 현재 모양 그대로 확정.
- 위: `SearchBar`(조회기간 시작 ~ 끝 + [조회]), 아래: RD 보고서 `iframe`(남은 높이 전부). 점검 스크립트 `tools/page-style-check.py`에는 X22에서 SR 규칙을 추가했다(대상: `Act04_Tab_ReportFSS`).
- RD 영역은 AS-IS `Emp01_Rd_*` 클래스(RD 주소 발급 + iframe)로 따로 두고 탭이 `retrieve(param)`을 부른다. 열 때 한 번 조회하는 화면(`Emp01_Tab_InoutState`)과 열 때 조회하지 않는 화면(탭 안 RD 페이지, TP)이 있다.
