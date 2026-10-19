# Msc01_HTML_Week

- 종류: 화면
- 메뉴: 스케줄 > (X) 주간 스케줄 (#1045)
- 파일: `client/vi/msc/Msc01_HTML_Week.java`
- 함께 쓰는 클래스 2개:
  - `Msc01_JSCaller` `client/vi/msc/Msc01_JSCaller.java`
  - `Msc01_Edit_Week` `client/vi/msc/Msc01_Edit_Week.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `msc.Msc01_Schedule.selectById` | Msc01_Edit_Week:156 | [`Msc01_Schedule.java:26`](../../msc/services/Msc01_Schedule.md) | [`msc01_schedule.selectById`](../../msc/sql/msc01_schedule.md) |

## 테이블

[`msc01_schedule`](../../../db/tables/msc.md)

## DB 함수

`f_cdnm`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Msc01_HTML_Week (`client/vi/msc/Msc01_HTML_Week.java`, 134줄)

- 레이아웃: north=buttonBar, center=cp
- 툴바 `buttonBar`: 조회구간: {selectDate} {retrieveButton}
- 입력·하위 화면: `selectDate` MyDateField, `popup_ScheduleWeek` Msc01_Edit_Week

#### 이벤트
[E0] 화면 열림 (생성자 L45-93) → open()
[E1] retrieveButton[조회].Select (L54) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L95-97 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L99-112 | E1,open | 상태 처리 | 업무 |
| private retrieve() | L114-129 | E1,open | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L130-132 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Msc01_JSCaller (`client/vi/msc/Msc01_JSCaller.java`, 28줄)


#### 이벤트

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setEditWeekCallback() | L11-13 | 공개 메서드 | 상태 처리 | 업무 |
| public editWeekCall() | L19-27 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Msc01_Edit_Week (`client/vi/msc/Msc01_Edit_Week.java`, 181줄)

- 입력·하위 화면: `orgCodeId` LongField, `levelCode` TextField, `place` TextField, `attendance` TextField, `content` MyTextArea 빈칸="스케줄 내용이 없습니다.", `note` MyTextArea 빈칸="기타 메모입력 사항이 없습니다.", `scheduleDt` MyDateField, `orgCodeName` LookupTriggerField, `parentOrgCodeName` LookupTriggerField, `orgLevelName` ComboBoxField("OrgLevelCode"), `startHour` ComboBoxField("HourCode"), `startMin` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMin` ComboBoxField("MinuteCode")

#### 이벤트
[E0] 화면 열림 (생성자 L68-151) → 초기화
[E1] closeButton[닫기].Select (L142) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L153-176 | 공개 메서드 | 서비스 msc.Msc01_Schedule.selectById | 업무 |
| private setHtmlHeaderStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

