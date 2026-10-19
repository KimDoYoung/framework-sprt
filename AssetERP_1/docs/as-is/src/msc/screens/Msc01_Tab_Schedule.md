# Msc01_Tab_Schedule

- 종류: 화면
- 메뉴: 스케줄 > (X) 스케줄 등록 (#1044)
- 파일: `client/vi/msc/Msc01_Tab_Schedule.java`
- 함께 쓰는 클래스 1개:
  - `Msc01_Edit_Schedule` `client/vi/msc/Msc01_Edit_Schedule.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `msc.Msc01_Schedule.delete` | Msc01_Edit_Schedule:271 | [`Msc01_Schedule.java:99`](../../msc/services/Msc01_Schedule.md) | `UpdateDataModel(msc01_schedule)` 동적 DELETE |
| `msc.Msc01_Schedule.selectByOrg` | Msc01_Tab_Schedule:183 | [`Msc01_Schedule.java:56`](../../msc/services/Msc01_Schedule.md) | [`msc01_schedule.selectByOrg`](../../msc/sql/msc01_schedule.md) |
| `msc.Msc01_Schedule.selectMonitorngMsc` | Msc01_Tab_Schedule:230 | [`Msc01_Schedule.java:73`](../../msc/services/Msc01_Schedule.md) | [`msc01_schedule.selectMonitorngMsc`](../../msc/sql/msc01_schedule.md) |
| `msc.Msc01_Schedule.update` | Msc01_Edit_Schedule:239 | [`Msc01_Schedule.java:86`](../../msc/services/Msc01_Schedule.md) | `UpdateDataModel(msc01_schedule)` 동적 INSERT/UPDATE → [`msc01_schedule.selectById`](../../msc/sql/msc01_schedule.md) |

## 테이블

[`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md)

## DB 함수

`f_cdnm`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Msc01_Tab_Schedule (`client/vi/msc/Msc01_Tab_Schedule.java`, 235줄)

- 레이아웃: center=vlc, south=editBoard
- 툴바 `buttonBar`: 본부: {orgName} 일자: {startDate} ~: {endDate} {retrieveButton} {insertButton}
- 입력·하위 화면: `editBoard` Msc01_Edit_Schedule, `startDate` MyDateField, `endDate` MyDateField, `scheduleDt` MyDateField, `orgName` TextField, `place` TextField, `attendance` TextField, `content` TextArea, `note` TextArea, `levelCode` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - scheduleDt 100 "예약일자" Date
  - startDate 80 "시작" Text
  - closeDate 80 "종료" Text
  - orgLevelName 100 "예약구분" Text
  - orgCodeName 200 "부서(본부)" Text
  - place 200 "장소" Text
  - attendance 300 "참석자" Text
  - content 300 "일정내용" Text

#### 이벤트
[E0] 화면 열림 (생성자 L59-62) → init(), retrieve()
[E1] retrieveButton[조회].Select (L96) → retrieve()
[E2] insertButton[등록].Select (L104) → insertRow()
[E3] grid.SelectionChanged [선택>0] (L133) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L63-141 | 생성자 | 상태 처리 | 업무 |
| private retrieveEditPage() | L158-169 | E3 | 상태 처리 | 업무 |
| public retrieve() | L172-192 | 생성자,E1 | 서비스 msc.Msc01_Schedule.selectByOrg(scheduleDt, startDate, endDate, companyId, orgCodeId, orgCodeLevel) | 업무 |
| public insertRow() | L195-212 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L215-216 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L219-220 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L222-224 | 생성자,E1 | 상태 처리 | 업무 |
| public retrieveMonitorng() | L226-231 | retrieve | 서비스 msc.Msc01_Schedule.selectMonitorngMsc(companyId, orgCodeId) | 업무 |
| public buildGrid() | L143-156 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L232-234 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('scheduleDt', 100, '예약일자'),  // L146
  // ⚠DB없음 L147 startDate 80 "시작" (msc01_start_date 컬럼 없음)
  // ⚠DB없음 L148 closeDate 80 "종료" (msc01_close_date 컬럼 없음)
  gb.text('orgLevelNm', 100, '예약구분'),  // L149 SQL 계산 컬럼(selectByCompanyId: f_cdnm('OrgLevelCode', msc01_level_cd, …)
  gb.text('orgCodeNm', 200, '부서(본부)'),  // L150 SQL 계산 컬럼(selectByOrgCodeId: a.org00_kor_nm)
  gb.text('place', 200, '장소'),  // L151
  gb.text('attendance', 300, '참석자'),  // L152
  gb.text('content', 300, '일정내용'),  // L153
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>

### Msc01_Edit_Schedule (`client/vi/msc/Msc01_Edit_Schedule.java`, 304줄)

- 입력·하위 화면: `orgCodeId` LongField, `levelCode` TextField, `place` TextField, `attendance` TextField, `content` MyTextArea 빈칸="스케줄 내용을 입력합니다.", `note` MyTextArea 빈칸="기타 메모사항을 입력합니다.", `scheduleDt` MyDateField, `orgLevelName` ComboBoxField("OrgLevelCode"), `startHour` ComboBoxField("HourCode"), `startMin` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMin` ComboBoxField("MinuteCode"), `orgCodeName` ScheduleComboBox

#### 이벤트
[E0] 화면 열림 (생성자 L80-113) → getEditor(), show()
[E1] updateButton[저장].Select (L84) → updateRow()
[E2] deleteButton[삭제].Select (L92) → deleteRow()
       └ [E3] messageBox.DialogHide [YES] (L254) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L115-180 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L182-191 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L193-249 | E1 | 서비스 msc.Msc01_Schedule.update | 업무 |
| public deleteRow() | L251-263 | E2 | ConfirmBox → E3 | 업무 |
| private delete() | L265-290 | E3 | 서비스 msc.Msc01_Schedule.delete | 업무 |
| public init() | L292-294 | delete | 상태 처리 | 업무 |
| public getServiceResult() | L297-298 | delete | 상태 처리 | 업무 |
| private setHtmlStyle() | L300-302 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>

