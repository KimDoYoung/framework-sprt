# Rpt10_Tab_FssOrg

- 종류: 화면
- 메뉴: 경영관리 > 20. 대외보고서 > 업무보고서 (#1289)
- 파일: `client/vi/rpt/Rpt10_Tab_FssOrg.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Rd_FinanceProState`](../../emp/components/Emp01_Rd_FinanceProState.md), [`Emp01_Rd_OfficerState`](../../emp/components/Emp01_Rd_OfficerState.md), [`Emp01_Rd_PersonState`](../../emp/components/Emp01_Rd_PersonState.md), [`Emp01_Rd_ProPersonState`](../../emp/components/Emp01_Rd_ProPersonState.md), [`Org02_Rd_OrgState`](../../org/components/Org02_Rd_OrgState.md), [`Sys01_Rd_CompanyState`](../../sys/components/Sys01_Rd_CompanyState.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt10_Tab_FssOrg (`client/vi/rpt/Rpt10_Tab_FssOrg.java`, 75줄)

- 레이아웃: center=tabPanel

#### 이벤트
[E0] 화면 열림 (생성자 L26-69) → 초기화
[E1] tabPanel.Selection [arg0 != null] (L28) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L71-74 | E1 | 선택 회사로 탭페이지 retrieve | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

