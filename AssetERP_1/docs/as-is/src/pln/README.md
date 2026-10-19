# 도메인: pln

화면 3개, 컴포넌트 0개, 서버 클래스 2개, 매퍼 2개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Pln02_Tab_Plan`](screens/Pln02_Tab_Plan.md) | - | 5 | 6 |
| [`Pln02_Tab_PlanEmp`](screens/Pln02_Tab_PlanEmp.md) | - | 2 | 5 |
| [`Pln03_Tab_Resrch`](screens/Pln03_Tab_Resrch.md) | - | 2 | 7 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`pln.Pln02_Plan`](../pln/services/Pln02_Plan.md) | 11 |
| [`pln.Pln03_Resrch`](../pln/services/Pln03_Resrch.md) | 8 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`pln02_plan`](sql/pln02_plan.md) | 8 |
| [`pln03_Resrch`](sql/pln03_Resrch.md) | 6 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Pln00_Popup_PlanDoc` | `client/vi/pln/Pln00_Popup_PlanDoc.java` | `apr.Apr01_Appr.selectById`, `apr.Apr01_Appr.update` |
