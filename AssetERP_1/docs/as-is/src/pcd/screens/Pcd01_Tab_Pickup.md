# Pcd01_Tab_Pickup

- 종류: 화면
- 메뉴: 신청 > 02. 회의실 예약관리 > X (#1068, 미사용)
- 파일: `client/vi/pcd/Pcd01_Tab_Pickup.java`
- 함께 쓰는 클래스 2개:
  - `Pcd01_TimelineChart` `client/vi/pcd/Pcd01_TimelineChart.java`
  - `Pcd01_Popup_Pickup` `client/vi/pcd/Pcd01_Popup_Pickup.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Pcd01_Popup_Pickup:165 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `pcd.Pcd01_Pickup.delete` | Pcd01_Tab_Pickup:316 | [`Pcd01_Pickup.java:158`](../../pcd/services/Pcd01_Pickup.md) | `UpdateDataModel(pcd01_pickup)` 동적 DELETE |
| `pcd.Pcd01_Pickup.selectByDate` | Pcd01_Tab_Pickup:294 | [`Pcd01_Pickup.java:44`](../../pcd/services/Pcd01_Pickup.md) | [`pcd01_pickup.selectByDate`](../../pcd/sql/pcd01_pickup.md) |
| `pcd.Pcd01_Pickup.selectByDateUnion` | Pcd01_Popup_Pickup:141, Pcd01_Tab_Pickup:258 | [`Pcd01_Pickup.java:66`](../../pcd/services/Pcd01_Pickup.md) | [`pcd01_pickup.selectByDateUnion`](../../pcd/sql/pcd01_pickup.md) |
| `pcd.Pcd01_Pickup.update` | Pcd01_Popup_Pickup:233 | [`Pcd01_Pickup.java:144`](../../pcd/services/Pcd01_Pickup.md) | `UpdateDataModel(pcd01_pickup)` 동적 INSERT/UPDATE → [`pcd01_pickup.selectById`](../../pcd/sql/pcd01_pickup.md) |

## 테이블

[`pcd01_pickup`](../../../db/tables/pcd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pcd01_Tab_Pickup (`client/vi/pcd/Pcd01_Tab_Pickup.java`, 326줄)

- 레이아웃: west=getWestLayout(), center=getCenterLayout()
- 툴바 `buttonBar`: [예약]
- 툴바 `buttonBar01`: {radioMy} {radioAll}
- 입력·하위 화면: `radioMy` Radio, `radioAll` Radio, `popup_PicupReg` Pcd01_Popup_Pickup
- 버튼: insertButton[예약]
- 그리드 `grid` (buildGrid(), 체크박스):
  - subject 240 "제목" Text
  - empName 70 "예약자명" Text
  - dateText 210 "예약시간" Text
  - attendance 150 "동승자" Text
  - forwarding 270 "메모" Text
  - actionCell 80 "예약수정" Cell 편집:actionCell
  - actionCell 80 "예약취소" Cell 편집:cancleCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-66) → init()
[E1] datePicker.ValueChange (L161) → retrieve()
[E2] insertButton[예약].Select (L167) → retrieve()
[E3] toggleAllMy.ValueChange (L188) → retrieve()
[E4] messageBox.DialogHide [YES] (L301) → delete(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L68-82 | 생성자 | 상태 처리 | 업무 |
| private getWestLayout() | L84-111 | init | 상태 처리 | 업무 |
| private getCenterLayout() | L113-158 | init | 상태 처리 | 업무 |
| private makeEvent() | L160-194 | init | 팝업 Pcd01_Popup_Pickup 열기 | 업무 |
| private retrieve() | L251-254 | E1,E2,E3,E4,getWestLayout,getCenterLayout,buildGrid | 상태 처리 | 업무 |
| private retrieveTimeChart() | L256-279 | retrieve,delete | 서비스 pcd.Pcd01_Pickup.selectByDateUnion(pickupDate, companyId, empId, type, type) | 업무 |
| private retrieveGrid() | L281-296 | retrieve,delete | 서비스 pcd.Pcd01_Pickup.selectByDate(pickupDate, companyId, empId, type, type) | 업무 |
| private deleteConfirm() | L298-311 | buildGrid | 확인창 표시 | 업무 |
| private delete() | L313-320 | E4 | GridDeleteData pcd.Pcd01_Pickup.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L196-249 | 필드 초기화 | 팝업 Pcd01_Popup_Pickup 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlMRBStyle() | L322-324 | getWestLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('subject', 240, '제목'),  // L202
  gb.text('empNm', 70, '예약자명'),  // L203 SQL 계산 컬럼(selectByDateUnion: coalesce(f_emp_kor_nm(pcd01_emp_id), ' …)
  // ⚠DB없음 L205 dateText 210 "예약시간" (pcd01_date_text 컬럼 없음)
  gb.text('attendance', 150, '동승자'),  // L206
  gb.text('forwarding', 270, '메모'),  // L207
  // ⚠ 대응 없음 (GridBuilder L231) addCell
  // ⚠ 대응 없음 (GridBuilder L246) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={retrieve}>예약</Button>

### Pcd01_TimelineChart (`client/vi/pcd/Pcd01_TimelineChart.java`, 72줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private draw() | L27-37 | retrieve | 상태 처리 | 업무 |
| public retrieve() | L39-70 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pcd01_Popup_Pickup (`client/vi/pcd/Pcd01_Popup_Pickup.java`, 260줄)

- 툴바 `buttonBar01`: 일  시: {pickupDate} {startHour} {startMinute} ~: {closeHour} {closeMinute}
- 툴바 `buttonBar02`: 차  량: {carName} 동 승 자: {attendance}
- 툴바 `buttonBar03`: 제  목: {subject}
- 툴바 `buttonBar04`: 메 모: {forwarding}
- 입력·하위 화면: `pickupId` LongField, `companyId` LongField, `empId` LongField, `subject` TextField, `carCode` TextField, `carName` ComboBoxField("PublicCarCode"), `pickupDate` MyDateField, `startHour` ComboBoxField("HourCode"), `startMinute` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMinute` ComboBoxField("MinuteCode"), `attendance` TextField, `forwarding` TextArea, `months` ComboBoxField("MonthsCode"), `dayOfWeek` TextField, `dayOfWeekName` ComboBoxField("DayOfWeekCode"), `weekCnt` TextField, `weekCntName` ComboBoxField("WeekOfMonth"), `empName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L70-136) → 초기화
[E1] updateButton[저장].Select (L119) → save()
[E2] closeButton[닫기].Select (L127) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTimeChart() | L138-158 | open,retrieve | 서비스 pcd.Pcd01_Pickup.selectByDateUnion(pickupDate, companyId, empId, type) | 업무 |
| public open() | L160-183 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L185-190 | 공개 메서드 | 상태 처리 | 업무 |
| private save() | L192-251 | E1 | 서비스 pcd.Pcd01_Pickup.update(pickupModel) | 업무 |
| private setHtmlHeaderStyle() | L253-255 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={save}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

