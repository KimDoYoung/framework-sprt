# Msc01_Tab_Calendar

- 종류: 화면
- 파일: `client/vi/msc/Msc01_Tab_Calendar.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Monitoring_Page_Schedule`](../../frm/components/Monitoring_Page_Schedule.md), [`ScheduleCalendar`](../../frm/components/ScheduleCalendar.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Msc01_Tab_Calendar (`client/vi/msc/Msc01_Tab_Calendar.java`, 61줄)

- 레이아웃: west=scheduleCalendar, center=cp
- 입력·하위 화면: `scheduleGrid` Monitoring_Page_Schedule

#### 이벤트
[E0] 화면 열림 (생성자 L18-39) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L42-45 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L48-50 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L58-60 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

