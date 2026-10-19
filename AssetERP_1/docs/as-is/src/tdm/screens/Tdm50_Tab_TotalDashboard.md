# Tdm50_Tab_TotalDashboard

- 종류: 화면
- 메뉴: 책무 > 00. 대시보드 > 책무점검 현황 (#1495)
- 파일: `client/vi/tdm/Tdm50_Tab_TotalDashboard.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Tdm50_Tab_Dashboard`](../../tdm/screens/Tdm50_Tab_Dashboard.md), [`Tdm50_Tab_DashboardExct`](../../tdm/screens/Tdm50_Tab_DashboardExct.md), [`Tdm50_Tab_DashboardOrg`](../../tdm/screens/Tdm50_Tab_DashboardOrg.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_TotalDashboard (`client/vi/tdm/Tdm50_Tab_TotalDashboard.java`, 30줄)

- 레이아웃: center=tabPanel
- 입력·하위 화면: `tapPage01` Tdm50_Tab_Dashboard, `tapPage02` Tdm50_Tab_DashboardExct, `tapPage03` Tdm50_Tab_DashboardOrg

#### 이벤트
[E0] 화면 열림 (생성자 L15-22) → settings()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private settings() | L24-29 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

