# Car03_Tab_List

- 종류: 화면
- 메뉴: 경영관리 > 10. 차량관리 > 공용차량 예약관리 (#1187)
- 파일: `client/vi/car/Car03_Tab_List.java`
- 함께 쓰는 클래스 1개:
  - `Car03_Tab_DayofMonth` `client/vi/car/Car03_Tab_DayofMonth.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Car03_Popup_BookingReg`](../../car/components/Car03_Popup_BookingReg.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `car.Car03_Booking.delete` | Car03_Tab_DayofMonth:254 | [`Car03_Booking.java:367`](../../car/services/Car03_Booking.md) | `UpdateDataModel(car03_booking)` 동적 DELETE |
| `car.Car03_Booking.deleteList` | Car03_Tab_List:172 | [`Car03_Booking.java:372`](../../car/services/Car03_Booking.md) | [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), `UpdateDataModel(car03_booking)` 동적 DELETE |
| `car.Car03_Booking.selectByDate` | Car03_Tab_DayofMonth:225 | [`Car03_Booking.java:39`](../../car/services/Car03_Booking.md) | [`car03_booking.selectByDate`](../../car/sql/car03_booking.md) |
| `car.Car03_Booking.selectByList` | Car03_Tab_List:157 | [`Car03_Booking.java:29`](../../car/services/Car03_Booking.md) | [`car03_booking.selectByList`](../../car/sql/car03_booking.md) |

## 테이블

[`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md)

## DB 함수

`f_emp_kor_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car03_Tab_List (`client/vi/car/Car03_Tab_List.java`, 191줄)

- 레이아웃: north=getNorthLayout(), center=dayofMonthGrid
- 툴바 `bar01`: 공용차량 예약현황 (기준일자 : yyyy년 MM월 dd일):
- 툴바 `bar02`: {anchor}
- 입력·하위 화면: `dayofMonthGrid` Car03_Tab_DayofMonth, `lookup` Car03_Popup_BookingReg
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "예약 시작일" Date
  - closeDate 100 "예약 종료일" Date
  - time 120 "예약 시간" TextCenter
  - infoName 160 "차량정보" Text
  - destination 240 "행선지" Text
  - personName 100 "예약자" TextCenter
  - attendance 240 "참석자" Text
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - actionCell 60 "삭제" Cell 편집:cancleCell

#### 이벤트
[E0] 화면 열림 (생성자 L57-68) → getNorthLayout(), retrieve()
[E1] anchor.MouseDown (L73) → retrieve()
[E2] messageBox.DialogHide (L166) → execute(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L49-51 | E2,buildGrid | 상태 처리 | 업무 |
| private getNorthLayout() | L70-103 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L152-158 | 생성자,E1,E2,execute,buildGrid | 서비스 car.Car03_Booking.selectByList(startDate, companyId) | 업무 |
| private delete() | L160-186 | buildGrid | 확인창 표시, GridDeleteData car.Car03_Booking.deleteList(체크된 행 목록) | 업무 |
| private buildGrid() | L105-150 | 필드 초기화 | 팝업 Car03_Popup_BookingReg 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L188-190 | getNorthLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '예약 시작일'),  // L139
  gb.date('closeDate', 100, '예약 종료일'),  // L140
  gb.textCenter('time', 120, '예약 시간'),  // L141 SQL 계산 컬럼(selectByList: car03_start_hour||':'||car03_start_min|…)
  gb.text('infoNm', 160, '차량정보'),  // L142 SQL 계산 컬럼(selectByList: car01_car_nm)
  gb.text('destination', 240, '행선지'),  // L143
  gb.textCenter('personNm', 100, '예약자'),  // L144 SQL 계산 컬럼(selectByList: f_emp_kor_nm(car03_person_id))
  gb.text('attendance', 240, '참석자'),  // L145
  // ⚠ 대응 없음 (GridBuilder L146) addCell
  // ⚠ 대응 없음 (GridBuilder L147) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Car03_Tab_DayofMonth (`client/vi/car/Car03_Tab_DayofMonth.java`, 265줄)

- 레이아웃: west=getWestLayout(), center=getCenterLayout()
- 툴바 `buttonBar`: [insertButton] {radioMy} {radioAll}
- 입력·하위 화면: `radioMy` Radio, `radioAll` Radio, `lookup` Car03_Popup_BookingReg
- 버튼: insertButton
- 그리드 `grid` (buildGrid(), 체크박스):
  - dateText 240 "예약시간" Text
  - infoName 160 "차량정보" Text
  - destination 240 "행선지" Text
  - personName 100 "예약자" TextCenter
  - attendance 240 "참석자" Text
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - actionCell 60 "삭제" Cell 편집:cancleCell

#### 이벤트
[E0] 화면 열림 (생성자 L63-76) → init(), getWestLayout(), getCenterLayout()
[E1] datePicker.ValueChange (L137) → retrieve()
[E2] insertButton[예약하기].Select (L143) → retrieve()
[E3] toggleAllMy.ValueChange (L162) → retrieve()
[E4] messageBox.DialogHide (L235) → delete(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L78-83 | 생성자 | 상태 처리 | 업무 |
| private getWestLayout() | L85-105 | 생성자 | 상태 처리 | 업무 |
| private getCenterLayout() | L107-134 | 생성자 | 상태 처리 | 업무 |
| private makeEvent() | L136-168 | init | 팝업 Car03_Popup_BookingReg 열기 | 업무 |
| public retrieve() | L213-227 | E1,E2,E3,E4,init,buildGrid,delete | 서비스 car.Car03_Booking.selectByDate(startDate, companyId, personId, type, type) | 업무 |
| private deleteCheck() | L229-249 | buildGrid | 확인창 표시 | 업무 |
| private delete() | L251-256 | E4 | GridDeleteData car.Car03_Booking.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L170-211 | 필드 초기화 | 팝업 Car03_Popup_BookingReg 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L258-260 | getCenterLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlMRBStyle() | L262-264 | getWestLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L202 dateText 240 "예약시간" (car03_date_text 컬럼 없음)
  gb.text('infoNm', 160, '차량정보'),  // L203 SQL 계산 컬럼(selectByDate: car01_car_nm)
  gb.text('destination', 240, '행선지'),  // L204
  gb.textCenter('personNm', 100, '예약자'),  // L205 SQL 계산 컬럼(selectByDate: f_emp_kor_nm(car03_person_id))
  gb.text('attendance', 240, '참석자'),  // L206
  // ⚠ 대응 없음 (GridBuilder L207) addCell
  // ⚠ 대응 없음 (GridBuilder L208) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={retrieve}>예약하기</Button>

