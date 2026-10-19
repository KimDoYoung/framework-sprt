# 도메인: msc

화면 3개, 컴포넌트 0개, 서버 클래스 1개, 매퍼 1개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Msc01_HTML_Week`](screens/Msc01_HTML_Week.md) | 스케줄 > (X) 주간 스케줄 | 3 | 1 |
| [`Msc01_Tab_Calendar`](screens/Msc01_Tab_Calendar.md) | - | 1 | 0 |
| [`Msc01_Tab_Schedule`](screens/Msc01_Tab_Schedule.md) | 스케줄 > (X) 스케줄 등록 | 2 | 4 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`msc.Msc01_Schedule`](../msc/services/Msc01_Schedule.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`msc01_schedule`](sql/msc01_schedule.md) | 15 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Msc01_Tab_Popup` | `client/vi/msc/Msc01_Tab_Popup.java` | `msc.Msc01_Schedule.selectByOrg`, `msc.Msc01_Schedule.selectMonitorngMsc` |
