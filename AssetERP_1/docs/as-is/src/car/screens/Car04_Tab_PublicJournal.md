# Car04_Tab_PublicJournal

- 종류: 화면
- 메뉴: 경영관리 > 10. 차량관리 > 공용차량 운행등록 (#1190)
- 파일: `client/vi/car/Car04_Tab_PublicJournal.java`
- 함께 쓰는 클래스 2개:
  - `Car04_Lookup_PublicJournal` `client/vi/car/Car04_Lookup_PublicJournal.java`
  - `Car01_Lookup_Info` `client/vi/car/Car01_Lookup_Info.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `car.Car01_Info.selectByCarType` | Car01_Lookup_Info:188 | [`Car01_Info.java:36`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarType1`](../../car/sql/car01_info.md), [`car01_info.selectByCarType2`](../../car/sql/car01_info.md) |
| `car.Car01_Info.selectByCarTypeAdmin` | Car01_Lookup_Info:191 | [`Car01_Info.java:56`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarTypeAdmin`](../../car/sql/car01_info.md) |
| `car.Car04_Journal.checkBookingId` | Car04_Tab_PublicJournal:208 | [`Car04_Journal.java:161`](../../car/services/Car04_Journal.md) | [`car04_journal.checkBookingId`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.modelUpdate` | Car04_Tab_PublicJournal:229 | [`Car04_Journal.java:148`](../../car/services/Car04_Journal.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByPublicJournal` | Car04_Tab_PublicJournal:355 | [`Car04_Journal.java:52`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByPublicJournal`](../../car/sql/car04_journal.md) |

## 테이블

[`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car04_Tab_PublicJournal (`client/vi/car/Car04_Tab_PublicJournal.java`, 416줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {stdMonth} 차량번호: {infoName} {retrieveButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `stdMonth` TextField 빈칸="YYYY.MM", `infoId` LongField, `infoName` LookupTriggerField 빈칸="전체", `popup` Car01_Lookup_Info, `lookup` Car04_Lookup_PublicJournal
- 그리드 `grid` (buildGrid()):
  - date 100 "사용일자" Date
  - infoName 240 "차량번호/명" Text
  - mileage 120 "주행거리<br>(km)" LongHtml
  - commuteMileage 120 "출퇴근<br>사용거리(km)" LongHtml
  - bizMileage 120 "일반업무용<br>사용거리(km)" LongHtml
  - unBizMileage 120 "비업무용<br>사용거리(km)" LongHtml
  - destination 240 "행선지" Text
  - reason 240 "목적" Text
  - actionCell 80 "변경" Cell 편집:actionCell
  - fixYnText 100 "확정여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L63-89) → settings()
[E1] stdMonth.KeyPress [Enter] (L99) → retrieve()
[E2] infoName.TriggerClick (L110) → retrieve()
[E3] retrieveButton[조회].Select (L135) → retrieve()
[E4] confirmButton[확정].Select (L141) → closeCheck(), confirmCheck()
       └ [E6] msgBox.DialogHide [YES] (L251) → confirmAll()
[E5] cancelButton[확정취소].Select (L148) → closeCheck(), cancelCheck()
       └ [E7] msgBox.DialogHide [YES] (L307) → cancelAll()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L183-202 | E1,E2,E3,update,closeCheck | 서비스 car.Car04_Journal.selectByPublicJournal(companyId, personId, infoId, stdMonth) | 업무 |
| public updateCheck() | L204-223 | confirmAll,cancelAll,editData | 서비스 car.Car04_Journal.checkBookingId(bookingId) | 업무 |
| public update() | L225-239 | updateCheck | 서비스 car.Car04_Journal.modelUpdate | 업무 |
| private confirmCheck() | L241-266 | E4 | ConfirmBox → E6 | 업무 |
| private confirmAll() | L268-295 | E6 | 상태 처리 | 업무 |
| private cancelCheck() | L297-322 | E5 | ConfirmBox → E7 | 업무 |
| private cancelAll() | L324-351 | E7 | 상태 처리 | 업무 |
| private closeCheck() | L353-380 | E4,E5,buildGrid | 서비스 car.Car04_Journal.selectByPublicJournal(companyId, personId, infoId, stdMonth) | 업무 |
| private editData() | L382-405 | buildGrid | 조회창 Car04_Lookup_PublicJournal 열기, 미선택 시 alert "담당자가 마감처리한 운행일지입니다. 담당부서에 문의하세요" | 업무 |
| private getCarDate() | L407-411 | retrieve,closeCheck | 상태 처리 | 업무 |
| private settings() | L91-155 | 생성자 | 조회창 Car01_Lookup_Info 열기, 이벤트 연결, 초기값: stdMonth=DateTimeFormat.getFormat("yyyy.MM", infoId=null, infoId=resultModel.getInfoId( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L157-181 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L413-415 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '사용일자'),  // L169
  gb.text('infoNm', 240, '차량번호/명'),  // L170 SQL 계산 컬럼(selectByPublicJournal: car01_car_no || ' - ' || car01_car_nm)
  // ⚠ 대응 없음 (GridBuilder L171) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L172) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L173) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L174) addLongHtml
  gb.text('destination', 240, '행선지'),  // L175
  gb.text('reason', 240, '목적'),  // L176
  // ⚠ 대응 없음 (GridBuilder L177) addCell
  // ⚠DB없음 L178 fixYnText 100 "확정여부" (car04_fix_yn_text 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={() => /* closeCheck(), confirmCheck() */}>확정</Button>
3. <Button type="cancel" onClick={() => /* closeCheck(), cancelCheck() */}>확정취소</Button>

### Car04_Lookup_PublicJournal (`client/vi/car/Car04_Lookup_PublicJournal.java`, 312줄)

- 입력·하위 화면: `journalId` LongField, `companyId` LongField, `infoId` LongField, `date` MyDateField, `personId` LongField, `mileage` LongField, `commuteMileage` LongField, `bizMileage` LongField, `unBizMileage` LongField, `destination` TextField, `reason` TextField, `note` TextField, `businessMileage` LongField, `attendance` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L70-87) → settings(), show()
[E1] updateButton[저장].Select (L90) → update()
[E2] closeButton[닫기].Select (L96) → hide()
[E3] commuteMileage.KeyUp (L149) → calculation()
[E4] bizMileage.KeyUp (L155) → calculation()
[E5] unBizMileage[비업무용 사용거리].KeyUp (L161) → calculation()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L59-68 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L169-224 | edit | 상태 처리 | 업무 |
| private calculation() | L226-265 | E3,E4,E5 | 상태 처리 | 업무 |
| public update() | L275-302 | E1 | 상태 처리 | 업무 |
| private settings() | L89-167 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L304-306 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L308-310 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

