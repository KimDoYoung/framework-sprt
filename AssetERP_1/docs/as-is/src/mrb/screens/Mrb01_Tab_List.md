# Mrb01_Tab_List

- 종류: 화면
- 메뉴: 신청 > 02. 회의실 예약관리 > 회의실 예약관리 (#1067)
- 파일: `client/vi/mrb/Mrb01_Tab_List.java`
- 함께 쓰는 클래스 1개:
  - `Mrb01_Tab_DayofMonth` `client/vi/mrb/Mrb01_Tab_DayofMonth.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Mrb01_Popup_MeetingRoomReg`](../../mrb/components/Mrb01_Popup_MeetingRoomReg.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `mrb.Mrb01_Booking.delete` | Mrb01_Tab_DayofMonth:254 | [`Mrb01_Booking.java:198`](../../mrb/services/Mrb01_Booking.md) | `UpdateDataModel(mrb01_booking)` 동적 DELETE |
| `mrb.Mrb01_Booking.deleteList` | Mrb01_Tab_List:173 | [`Mrb01_Booking.java:203`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.deleteParentId`](../../mrb/sql/mrb01_booking.md), `UpdateDataModel(mrb01_booking)` 동적 DELETE |
| `mrb.Mrb01_Booking.selectByDate` | Mrb01_Tab_DayofMonth:225 | [`Mrb01_Booking.java:48`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.selectByDate`](../../mrb/sql/mrb01_booking.md) |
| `mrb.Mrb01_Booking.selectByList` | Mrb01_Tab_List:158 | [`Mrb01_Booking.java:38`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.selectByList`](../../mrb/sql/mrb01_booking.md) |

## 테이블

[`mrb01_booking`](../../../db/tables/mrb.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Mrb01_Tab_List (`client/vi/mrb/Mrb01_Tab_List.java`, 192줄)

- 레이아웃: north=getNorthLayout(), center=dayofMonthGrid
- 툴바 `bar01`: 회의실 예약현황 (기준일자 : yyyy년 MM월 dd일):
- 툴바 `bar02`: {anchor}
- 입력·하위 화면: `dayofMonthGrid` Mrb01_Tab_DayofMonth, `lookup` Mrb01_Popup_MeetingRoomReg
- 그리드 `grid` (buildGrid(), 체크박스):
  - bookingDate 100 "예약 시작일" Date
  - bookingCloseDate 100 "예약 종료일" Date
  - time 120 "예약 시간" TextCenter
  - subject 320 "회의제목" Text
  - empName 100 "예약자" TextCenter
  - roomName 160 "회의실명" Text
  - attendance 320 "참석자" Text
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - actionCell 60 "삭제" Cell 편집:cancleCell

#### 이벤트
[E0] 화면 열림 (생성자 L57-68) → getNorthLayout(), retrieve()
[E1] anchor.MouseDown (L73) → retrieve()
[E2] messageBox.DialogHide (L167) → execute(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L49-51 | E2,buildGrid | 상태 처리 | 업무 |
| private getNorthLayout() | L70-103 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L153-159 | 생성자,E1,E2,execute,buildGrid | 서비스 mrb.Mrb01_Booking.selectByList(bookingDate, companyId) | 업무 |
| private delete() | L161-187 | buildGrid | 확인창 표시, GridDeleteData mrb.Mrb01_Booking.deleteList(체크된 행 목록) | 업무 |
| private buildGrid() | L105-151 | 필드 초기화 | 팝업 Mrb01_Popup_MeetingRoomReg 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L189-191 | getNorthLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('bookingDt', 100, '예약 시작일'),  // L140
  gb.date('bookingCloseDt', 100, '예약 종료일'),  // L141
  gb.textCenter('time', 120, '예약 시간'),  // L142 SQL 계산 컬럼(selectByList: mrb01_start_hour||':'||mrb01_start_min|…)
  gb.text('subject', 320, '회의제목'),  // L143
  gb.textCenter('empNm', 100, '예약자'),  // L144 SQL 계산 컬럼(selectByList: f_emp_kor_nm(mrb01_emp_id))
  gb.text('roomNm', 160, '회의실명'),  // L145 SQL 계산 컬럼(selectByList: f_cdnm('MeetingRoomCode', mrb01_room_cd…)
  gb.text('attendance', 320, '참석자'),  // L146
  // ⚠ 대응 없음 (GridBuilder L147) addCell
  // ⚠ 대응 없음 (GridBuilder L148) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Mrb01_Tab_DayofMonth (`client/vi/mrb/Mrb01_Tab_DayofMonth.java`, 265줄)

- 레이아웃: west=getWestLayout(), center=getCenterLayout()
- 툴바 `buttonBar`: [insertButton] {radioMy} {radioAll}
- 입력·하위 화면: `radioMy` Radio, `radioAll` Radio, `lookup` Mrb01_Popup_MeetingRoomReg
- 버튼: insertButton
- 그리드 `grid` (buildGrid(), 체크박스):
  - dateText 240 "예약시간" Text
  - subject 300 "회의제목" Text
  - empName 100 "예약자" TextCenter
  - roomName 160 "회의실명" Text
  - attendance 260 "참석자" Text
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - actionCell 60 "삭제" Cell 편집:cancleCell

#### 이벤트
[E0] 화면 열림 (생성자 L63-81) → getWestLayout(), getCenterLayout(), init()
[E1] datePicker.ValueChange (L137) → retrieve()
[E2] insertButton[예약하기].Select (L143) → retrieve()
[E3] toggleAllMy.ValueChange (L162) → retrieve()
[E4] messageBox.DialogHide (L235) → delete(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L83-88 | 생성자 | 상태 처리 | 업무 |
| private getWestLayout() | L90-110 | 생성자 | 상태 처리 | 업무 |
| private getCenterLayout() | L112-134 | 생성자 | 상태 처리 | 업무 |
| private makeEvent() | L136-168 | init | 팝업 Mrb01_Popup_MeetingRoomReg 열기 | 업무 |
| public retrieve() | L213-227 | E1,E2,E3,E4,init,buildGrid,delete | 서비스 mrb.Mrb01_Booking.selectByDate(bookingDate, companyId, empId, type, type) | 업무 |
| private deleteCheck() | L229-249 | buildGrid | 확인창 표시 | 업무 |
| private delete() | L251-256 | E4 | GridDeleteData mrb.Mrb01_Booking.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L170-211 | 필드 초기화 | 팝업 Mrb01_Popup_MeetingRoomReg 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L258-260 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlMRBStyle() | L262-264 | getWestLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L202 dateText 240 "예약시간" (mrb01_date_text 컬럼 없음)
  gb.text('subject', 300, '회의제목'),  // L203
  gb.textCenter('empNm', 100, '예약자'),  // L204 SQL 계산 컬럼(selectByDate: f_emp_kor_nm(mrb01_emp_id))
  gb.text('roomNm', 160, '회의실명'),  // L205 SQL 계산 컬럼(selectByDate: f_cdnm('MeetingRoomCode', mrb01_room_cd…)
  gb.text('attendance', 260, '참석자'),  // L206
  // ⚠ 대응 없음 (GridBuilder L207) addCell
  // ⚠ 대응 없음 (GridBuilder L208) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={retrieve}>예약하기</Button>

