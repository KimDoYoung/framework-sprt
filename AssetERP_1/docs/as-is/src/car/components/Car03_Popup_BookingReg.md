# Car03_Popup_BookingReg

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/car/Car03_Popup_BookingReg.java`
- 함께 쓰는 클래스 2개:
  - `Car03_TimelineChart` `client/vi/car/Car03_TimelineChart.java`
  - `Car01_Lookup_Info` `client/vi/car/Car01_Lookup_Info.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `car.Car01_Info.selectByCarType` | Car01_Lookup_Info:188 | [`Car01_Info.java:36`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarType1`](../../car/sql/car01_info.md), [`car01_info.selectByCarType2`](../../car/sql/car01_info.md) |
| `car.Car01_Info.selectByCarTypeAdmin` | Car01_Lookup_Info:191 | [`Car01_Info.java:56`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarTypeAdmin`](../../car/sql/car01_info.md) |
| `car.Car03_Booking.selectByDateUnion` | Car03_Popup_BookingReg:216 | [`Car03_Booking.java:62`](../../car/services/Car03_Booking.md) | [`car03_booking.selectByDateUnion`](../../car/sql/car03_booking.md) |
| `car.Car03_Booking.selectById` | Car03_Popup_BookingReg:265 | [`Car03_Booking.java:24`](../../car/services/Car03_Booking.md) | [`car03_booking.selectById`](../../car/sql/car03_booking.md) |
| `car.Car03_Booking.update` | Car03_Popup_BookingReg:358 | [`Car03_Booking.java:76`](../../car/services/Car03_Booking.md) | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE → [`car03_booking.selectById`](../../car/sql/car03_booking.md) |
| `car.Car03_Booking.updateList` | Car03_Popup_BookingReg:358 | [`Car03_Booking.java:114`](../../car/services/Car03_Booking.md) | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE → [`car03_booking.selectById`](../../car/sql/car03_booking.md) |
| `getSeq` | Car03_Popup_BookingReg:238 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |

## 테이블

[`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md)

## DB 함수

`f_booking_car_check`, `f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car03_Popup_BookingReg (`client/vi/car/Car03_Popup_BookingReg.java`, 406줄)

- 툴바 `buttonBar00`: 차 량: {infoName} 사용자: {personName}
- 툴바 `buttonBar01`: 일  시: {startDate} ~: {closeDate} {startHour} {startMin} ~: {closeHour} {closeMin}
- 툴바 `buttonBar02`: 행선지: {destination}
- 툴바 `buttonBar03`: 목 적: {reason}
- 툴바 `buttonBar04`: 참석자: {attendance}
- 툴바 `buttonBar05`: 메 모: {note}
- 입력·하위 화면: `bookingId` LongField, `infoId` LongField, `personId` LongField, `parentId` LongField, `destination` TextField, `attendance` TextField, `reason` TextField, `note` TextArea, `startDate` MyDateField, `closeDate` MyDateField, `startHour` ComboBoxField("HourCode"), `startMin` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMin` ComboBoxField("MinuteCode"), `infoName` LookupTriggerField, `personName` LookupTriggerField, `popup` Car01_Lookup_Info, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L85-146) → settings()
[E1] updateButton[저장].Select (L163) → update()
[E2] closeButton[닫기].Select (L170) → hide()
[E3] changeButton[변경].Select (L176) → changeCheck()
       └ [E6] msgBox.DialogHide [YES] (L380) → update()
[E4] infoName[차 량].TriggerClick (L184) → 인라인 L184-197 (new TriggerClickHandler(){ @Override …)
[E5] personName[사용자].TriggerClick (L199) → 인라인 L199-212 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTimeChart() | L215-231 | open,retrieve,getList | 서비스 car.Car03_Booking.selectByDateUnion(startDate, companyId, personId, type) | 업무 |
| public open() | L233-262 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L264-275 | 공개 메서드 | 서비스 car.Car03_Booking.selectById(bookingId) | 업무 |
| public retrieve() | L277-285 | 공개 메서드 | 상태 처리 | 업무 |
| public getList() | L287-295 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L297-375 | E1,E6 | 상태 처리 | 업무 |
| private changeCheck() | L377-396 | E3 | ConfirmBox → E6 | 업무 |
| private settings() | L148-213 | 생성자 | 조회창 Car01_Lookup_Info 열기, 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: infoId=resultModel.getInfoId(, infoName=resultModel.getCarName(("차 량"), personId=empTransInfoModel.getPersonId(, personName=empTransInfoModel.getEmpPersonModel(("사용자") | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L398-400 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L402-404 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="change" onClick={changeCheck}>변경</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Car03_TimelineChart (`client/vi/car/Car03_TimelineChart.java`, 72줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private draw() | L27-38 | retrieve | 상태 처리 | 업무 |
| public retrieve() | L40-70 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Car01_Lookup_Info (`client/vi/car/Car01_Lookup_Info.java`, 242줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - carNo 100 "차량번호" Text
  - carName 200 "차량명" Text
  - note 350 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L98-128) → settings(), show()
[E1] grid.CellDoubleClick (L121) → confirm()
[E2] searchText.KeyPress [Enter] (L132) → retrieve()
[E3] retrieveButton[조회].Select (L140) → retrieve()
[E4] allButton[전체].Select (L147) → confirmAll()
[E5] oKButton[확인].Select (L153) → confirm()
[E6] cancelButton[닫기].Select (L159) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-67 | 공개 메서드 | 상태 처리 | 업무 |
| public openAdmin() | L69-82 | 공개 메서드 | 상태 처리 | 업무 |
| public openAll() | L84-96 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L179-206 | E2,E3,open,openAdmin,openAll | 서비스 car.Car01_Info.selectByCarType, car.Car01_Info.selectByCarTypeAdmin(companyId, personId, searchText, stdMonth, carType) | 업무 |
| public confirmAll() | L208-211 | E4 | 상태 처리 | 업무 |
| public confirm() | L213-221 | E1,E5 | 상태 처리 | 업무 |
| public getServiceResult() | L224-232 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L130-165 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L167-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L234-236 | open,openAdmin,openAll | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('carNo', 100, '차량번호'),  // L172
  gb.text('carNm', 200, '차량명'),  // L173
  gb.text('note', 350, '비고'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={confirmAll}>전체</Button>
3. <Button type="save" onClick={confirm}>확인</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

