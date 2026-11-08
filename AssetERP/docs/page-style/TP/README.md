# TP — TabPanel
견본: `docs/page-style/TP/` (`Rpt10_Tab_FssOrg.tsx` 업무보고서 1289 + RD 탭 페이지 `Org02_Rd_OrgState.tsx`·공통 처리 `useRdStatePage.tsx`)

- 바깥 여백 20 + 배경 `#fff`, 탭은 공통 부품 `PageTabs`(STP와 같은 모양), **탭 아래 내용 영역에 외곽 테두리를 두지 않는다**(안쪽 `padding 10`만).
- 화면 전체가 탭 컨테이너 하나(여백 20). 툴바가 탭 위에 없고 탭 페이지마다 자기 툴바(기준년월 + [조회] 등)를 가진다 — 툴바가 위에 있는 STP와 다르다.
- 탭을 고르면 그 탭 페이지가 `retrieve`를 한다(AS-IS `InterfaceTabPage.retrieve`). 처음 연 탭은 선택 이벤트가 없어 조회하지 않는다. 한 번 연 탭은 숨기기만 한다(STP와 같음). 예: `Rpt10_Tab_FssOrg`(탭 6개 = RD 보고서 페이지)
