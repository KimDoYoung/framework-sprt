# ScheduleCalendar

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `msc`
- 파일: `client/vi/frm/ScheduleCalendar.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Monitoring_Page_Schedule`](../../frm/components/Monitoring_Page_Schedule.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### ScheduleCalendar (`client/vi/frm/ScheduleCalendar.java`, 109줄)


#### 이벤트
[E0] 화면 열림 (생성자 L37-39) → init()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L46-69 | 생성자 | 상태 처리 | 업무 |
| private toDoListRetrieve() | L83-86 | init | 상태 처리 | 업무 |
| private allRetrieve() | L88-91 | init | 상태 처리 | 업무 |
| public retrieve() | L93-95 | init,allRetrieve | 상태 처리 | 업무 |
| private makeLayout() | L71-81 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

