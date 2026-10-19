# Car04_Tab_PublicJournalAdmin

- 종류: 화면
- 메뉴: 경영관리 > 10. 차량관리 > 공용차량 운행변경(경영관리팀) (#1192)
- 파일: `client/vi/car/Car04_Tab_PublicJournalAdmin.java`
- 함께 쓰는 클래스 3개:
  - `Car04_Lookup_PublicJournalAdmin` `client/vi/car/Car04_Lookup_PublicJournalAdmin.java`
  - `Car04_Edit_PublicJournalAdmin` `client/vi/car/Car04_Edit_PublicJournalAdmin.java`
  - `Car01_Lookup_Info` `client/vi/car/Car01_Lookup_Info.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `car.Car01_Info.selectByCarType` | Car01_Lookup_Info:188 | [`Car01_Info.java:36`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarType1`](../../car/sql/car01_info.md), [`car01_info.selectByCarType2`](../../car/sql/car01_info.md) |
| `car.Car01_Info.selectByCarTypeAdmin` | Car01_Lookup_Info:191 | [`Car01_Info.java:56`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarTypeAdmin`](../../car/sql/car01_info.md) |
| `car.Car03_Booking.deleteByJournalList` | Car04_Tab_PublicJournalAdmin:232 | [`Car03_Booking.java:357`](../../car/services/Car03_Booking.md) | [`car03_booking.deleteByBookingId`](../../car/sql/car03_booking.md) |
| `car.Car03_Booking.updateAdmin` | Car04_Lookup_PublicJournalAdmin:446 | [`Car03_Booking.java:177`](../../car/services/Car03_Booking.md) | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE → [`car03_booking.selectById`](../../car/sql/car03_booking.md), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car03_Booking.updateJournalModel` | Car04_Edit_PublicJournalAdmin:360 | [`Car03_Booking.java:302`](../../car/services/Car03_Booking.md) | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE → [`car03_booking.selectById`](../../car/sql/car03_booking.md), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car03_Booking.updateListAdmin` | Car04_Lookup_PublicJournalAdmin:446 | [`Car03_Booking.java:227`](../../car/services/Car03_Booking.md) | [`car03_booking.confirmUpdate`](../../car/sql/car03_booking.md), [`car03_booking.deleteParentId`](../../car/sql/car03_booking.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car03_booking)` 동적 INSERT/UPDATE → [`car03_booking.selectById`](../../car/sql/car03_booking.md), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.checkBookingId` | Car04_Tab_PublicJournalAdmin:321 | [`Car04_Journal.java:161`](../../car/services/Car04_Journal.md) | [`car04_journal.checkBookingId`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.delete` | Car04_Tab_PublicJournalAdmin:240 | [`Car04_Journal.java:188`](../../car/services/Car04_Journal.md) | `UpdateDataModel(car04_journal)` 동적 DELETE |
| `car.Car04_Journal.modelUpdate` | Car04_Tab_PublicJournalAdmin:342 | [`Car04_Journal.java:148`](../../car/services/Car04_Journal.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByPublicJournalAdmin` | Car04_Tab_PublicJournalAdmin:468 | [`Car04_Journal.java:65`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByPublicJournalAdmin`](../../car/sql/car04_journal.md) |
| `getSeq` | Car04_Lookup_PublicJournalAdmin:400 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |

## 테이블

[`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md)

## DB 함수

`f_booking_car_check`, `f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car04_Tab_PublicJournalAdmin (`client/vi/car/Car04_Tab_PublicJournalAdmin.java`, 505줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {stdMonth} 차량번호: {infoName} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `stdMonth` TextField 빈칸="YYYY.MM", `searchText` TextField 빈칸="요일/사용자/행선지/목적", `infoId` LongField, `infoName` LookupTriggerField 빈칸="전체", `popup` Car01_Lookup_Info, `lookup` Car04_Lookup_PublicJournalAdmin
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - infoName 270 "차량번호/명" Text
  - datetime 180 "사용일시" TextCenter
  - weekName 80 "요일" TextHtmlCenter
  - personName 100 "사용자" TextCenter
  - mileage 120 "주행거리<br>(km)" LongHtml
  - destination 270 "행선지" Text
  - reason 270 "목적" Text
  - actionCell 80 "변경" Cell 편집:actionCell
  - fixYnText 100 "확정여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L68-100) → settings()
[E1] stdMonth.KeyPress [Enter] (L110) → retrieve()
[E2] infoName.TriggerClick [result == null] (L121) → retrieve()
[E3] searchText.KeyPress [Enter] (L143) → retrieve()
[E4] retrieveButton[조회].Select (L151) → retrieve()
[E5] insertButton[등록].Select (L157) → insertRow()
[E6] deleteButton[삭제].Select (L163) → deleteCheck()
       └ [E9] msgBox.DialogHide [YES] (L212) → delete()
[E7] confirmButton[확정].Select (L171) → closeCheck(), confirmCheck()
       └ [E10] msgBox.DialogHide [YES] (L364) → confirmAll()
[E8] cancelButton[확정취소].Select (L178) → closeCheck(), cancelCheck()
       └ [E11] msgBox.DialogHide [YES] (L420) → cancelAll()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insertRow() | L187-200 | E5 | 조회창 Car04_Lookup_PublicJournalAdmin 열기 | 업무 |
| private deleteCheck() | L202-229 | E6 | ConfirmBox → E9 | 업무 |
| public delete() | L231-250 | E9 | GridDeleteData car.Car03_Booking.deleteByJournalList, car.Car04_Journal.delete | 업무 |
| public retrieve() | L295-315 | E1,E2,E3,E4,insertRow,buildGrid,update,closeCheck | 서비스 car.Car04_Journal.selectByPublicJournalAdmin(companyId, personId, infoId, stdMonth, searchText) | 업무 |
| public updateCheck() | L317-336 | confirmAll,cancelAll | 서비스 car.Car04_Journal.checkBookingId(bookingId) | 업무 |
| public update() | L338-352 | updateCheck | 서비스 car.Car04_Journal.modelUpdate | 업무 |
| private confirmCheck() | L354-379 | E7 | ConfirmBox → E10 | 업무 |
| private confirmAll() | L381-408 | E10 | 상태 처리 | 업무 |
| private cancelCheck() | L410-435 | E8 | ConfirmBox → E11 | 업무 |
| private cancelAll() | L437-464 | E11 | 상태 처리 | 업무 |
| private closeCheck() | L466-494 | E7,E8 | 서비스 car.Car04_Journal.selectByPublicJournalAdmin(companyId, personId, infoId, stdMonth, searchText) | 업무 |
| private getCarDate() | L496-500 | retrieve,closeCheck | 상태 처리 | 업무 |
| private settings() | L102-185 | 생성자 | 조회창 Car01_Lookup_Info 열기, 이벤트 연결, 초기값: stdMonth=DateTimeFormat.getFormat("yyyy.MM", infoId=null, infoId=resultModel.getInfoId( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L252-293 | 필드 초기화 | 팝업 Car04_Edit_PublicJournalAdmin 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L502-504 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('infoNm', 270, '차량번호/명'),  // L282 SQL 계산 컬럼(selectByPublicJournalAdmin: car01_car_no || ' - ' || car01_car_nm)
  gb.textCenter('datetime', 180, '사용일시'),  // L283 SQL 계산 컬럼(selectByPublicJournalAdmin: TO_CHAR(COALESCE(car04_date, car03_star…)
  // ⚠ 대응 없음 (GridBuilder L284) addTextHtmlCenter
  gb.textCenter('personNm', 100, '사용자'),  // L285 SQL 계산 컬럼(selectByPublicJournalAdmin: f_emp_kor_nm(car03_person_id))
  // ⚠ 대응 없음 (GridBuilder L286) addLongHtml
  gb.text('destination', 270, '행선지'),  // L287
  gb.text('reason', 270, '목적'),  // L288
  // ⚠ 대응 없음 (GridBuilder L289) addCell
  // ⚠DB없음 L290 fixYnText 100 "확정여부" (car04_fix_yn_text 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="save" onClick={() => /* closeCheck(), confirmCheck() */}>확정</Button>
5. <Button type="cancel" onClick={() => /* closeCheck(), cancelCheck() */}>확정취소</Button>

### Car04_Lookup_PublicJournalAdmin (`client/vi/car/Car04_Lookup_PublicJournalAdmin.java`, 476줄)

- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `startHour` ComboBoxField("HourCode"), `startMin` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMin` ComboBoxField("MinuteCode"), `personName` LookupTriggerField, `mileage` LongField, `commuteMileage` LongField, `bizMileage` LongField, `unBizMileage` LongField, `destination` TextField, `reason` TextField, `businessMileage` LongField, `attendance` TextField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L90-107) → settings(), show()
[E1] personName[사용자].TriggerClick (L119) → 인라인 L119-133 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[저장].Select (L135) → updateChk()
[E3] closeButton[닫기].Select (L141) → hide()
[E4] commuteMileage.KeyUp (L194) → calculation()
[E5] bizMileage.KeyUp (L200) → calculation()
[E6] unBizMileage[비업무용 사용거리].KeyUp (L206) → calculation()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L76-88 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L214-282 | insert | 상태 처리 | 업무 |
| private calculation() | L284-323 | E4,E5,E6 | 상태 처리 | 업무 |
| private updateChk() | L333-397 | E2 | 상태 처리 | 업무 |
| private update() | L399-466 | updateChk | 상태 처리 | 업무 |
| private settings() | L109-212 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: personName=empTransInfoModel.getEmpPersonModel(("사용자") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L468-470 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L472-474 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Car04_Edit_PublicJournalAdmin (`client/vi/car/Car04_Edit_PublicJournalAdmin.java`, 386줄)

- 입력·하위 화면: `startHour` ComboBoxField("HourCode"), `startMin` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMin` ComboBoxField("MinuteCode"), `date` MyDateField, `personName` LookupTriggerField, `personId` LongField, `mileage` LongField, `commuteMileage` LongField, `bizMileage` LongField, `unBizMileage` LongField, `businessMileage` LongField, `destination` TextField, `reason` TextField, `attendance` TextField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L85-102) → settings(), show()
[E1] updateButton[저장].Select (L110) → update()
[E2] closeButton[닫기].Select (L116) → hide()
[E3] commuteMileage.KeyUp (L169) → calculation()
[E4] bizMileage.KeyUp (L175) → calculation()
[E5] unBizMileage[비업무용 사용거리].KeyUp (L181) → calculation()
[E6] personName[사용자].TriggerClick (L189) → 인라인 L189-202 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L75-83 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L205-271 | edit | 상태 처리 | 업무 |
| private calculation() | L273-312 | E3,E4,E5 | 상태 처리 | 업무 |
| public update() | L322-376 | E1 | 서비스 car.Car03_Booking.updateJournalModel(journalModel) | 업무 |
| private settings() | L104-203 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: personId=empTransInfoModel.getPersonId(, personName=empTransInfoModel.getEmpPersonModel(("사용자") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L378-380 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L382-384 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

