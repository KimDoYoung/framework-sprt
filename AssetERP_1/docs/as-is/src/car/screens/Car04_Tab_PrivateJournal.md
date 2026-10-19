# Car04_Tab_PrivateJournal

- 종류: 화면
- 메뉴: 경영관리 > 10. 차량관리 > 전용차량 운행등록 (#1189)
- 파일: `client/vi/car/Car04_Tab_PrivateJournal.java`
- 함께 쓰는 클래스 2개:
  - `Car04_Lookup_PrivateJournal` `client/vi/car/Car04_Lookup_PrivateJournal.java`
  - `Car01_Lookup_Info` `client/vi/car/Car01_Lookup_Info.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `car.Car01_Info.selectByCarType` | Car01_Lookup_Info:188, Car04_Tab_PrivateJournal:166 | [`Car01_Info.java:36`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarType1`](../../car/sql/car01_info.md), [`car01_info.selectByCarType2`](../../car/sql/car01_info.md) |
| `car.Car01_Info.selectByCarTypeAdmin` | Car01_Lookup_Info:191 | [`Car01_Info.java:56`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarTypeAdmin`](../../car/sql/car01_info.md) |
| `car.Car04_Journal.checkDate` | Car04_Lookup_PrivateJournal:282 | [`Car04_Journal.java:171`](../../car/services/Car04_Journal.md) | [`car04_journal.checkDate`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.delete` | Car04_Tab_PrivateJournal:336 | [`Car04_Journal.java:188`](../../car/services/Car04_Journal.md) | `UpdateDataModel(car04_journal)` 동적 DELETE |
| `car.Car04_Journal.getAfterCloseYn` | Car04_Lookup_PrivateJournal:213 | [`Car04_Journal.java:110`](../../car/services/Car04_Journal.md) | [`car04_journal.getAfterCloseYn`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.getAfterFixYn` | Car04_Lookup_PrivateJournal:234 | [`Car04_Journal.java:90`](../../car/services/Car04_Journal.md) | [`car04_journal.getAfterFixYn`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.modelUpdate` | Car04_Tab_PrivateJournal:350 | [`Car04_Journal.java:148`](../../car/services/Car04_Journal.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByDate` | Car04_Lookup_PrivateJournal:306 | [`Car04_Journal.java:27`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByDate`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByPrivateJournal` | Car04_Lookup_PrivateJournal:255, Car04_Tab_PrivateJournal:493 | [`Car04_Journal.java:40`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByPrivateJournal`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.update` | Car04_Tab_PrivateJournal:411, Car04_Tab_PrivateJournal:476 | [`Car04_Journal.java:183`](../../car/services/Car04_Journal.md) | `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |

## 테이블

[`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car04_Tab_PrivateJournal (`client/vi/car/Car04_Tab_PrivateJournal.java`, 529줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {stdMonth} 차량번호: {infoName} {retrieveButton} {insertButton} {deleteButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `stdMonth` TextField 빈칸="YYYY.MM", `infoId` LongField, `infoName` LookupTriggerField 빈칸="차량정보를 선택해주세요", `popup` Car01_Lookup_Info, `lookup` Car04_Lookup_PrivateJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "사용일자" Date
  - beforeMileage 120 "주행전<br>계기판(km)" LongHtml
  - afterMileage 120 "주행후<br>계기판(km)" LongHtml
  - mileage 120 "주행거리<br>(km)" LongHtml
  - commuteMileage 120 "출퇴근<br>사용거리(km)" LongHtml
  - bizMileage 120 "일반업무용<br>사용거리(km)" LongHtml
  - unBizMileage 120 "비업무용<br>사용거리(km)" LongHtml
  - destination 240 "행선지" Text
  - reason 240 "목적" Text
  - actionCell 80 "변경" Cell 편집:actionCell
  - fixYnText 100 "확정여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L67-95) → settings()
[E1] stdMonth.KeyPress [Enter] (L105) → retrieve()
[E2] infoName.TriggerClick (L116) → lookupInfo()
[E3] retrieveButton[조회].Select (L127) → retrieve()
[E4] insertButton[등록].Select (L133) → insertRow()
[E5] deleteButton[삭제].Select (L139) → deleteCheck()
       └ [E8] msgBox.DialogHide [YES] (L312) → delete()
[E6] confirmButton[확정].Select (L147) → closeCheck(), confirmCheck()
       └ [E9] msgBox.DialogHide [YES] (L372) → confirmAll()
[E7] cancelButton[확정취소].Select (L154) → closeCheck(), cancelCheck()
       └ [E10] msgBox.DialogHide [YES] (L436) → cancelAll()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultInfoCheck() | L165-187 | settings | 서비스 car.Car01_Info.selectByCarType(companyId, personId, searchText, stdMonth, carType) | 업무 |
| private lookupInfo() | L189-205 | E2,defaultInfoCheck | 조회창 Car01_Lookup_Info 열기 | 업무 |
| public retrieve() | L256-282 | E1,E3,defaultInfoCheck,lookupInfo,update,confirmAll,cancelAll,closeCheck | 서비스 car.Car04_Journal.selectByPrivateJournal(companyId, infoId, stdMonth) | 업무 |
| public insertRow() | L284-300 | E4 | 조회창 Car04_Lookup_PrivateJournal 열기 | 업무 |
| private deleteCheck() | L302-329 | E5 | ConfirmBox → E8 | 업무 |
| public delete() | L331-344 | E8 | GridDeleteData car.Car04_Journal.delete | 업무 |
| public update() | L346-360 | buildGrid,insertRow | 서비스 car.Car04_Journal.modelUpdate | 업무 |
| private confirmCheck() | L362-387 | E6 | ConfirmBox → E9 | 업무 |
| private confirmAll() | L389-424 | E9 | 미선택 시 alert "기준년월을 입력해주세요", 서비스 car.Car04_Journal.update | 업무 |
| private cancelCheck() | L426-451 | E7 | ConfirmBox → E10 | 업무 |
| private cancelAll() | L453-489 | E10 | 미선택 시 alert "기준년월을 입력해주세요", 서비스 car.Car04_Journal.update | 업무 |
| private closeCheck() | L491-517 | E6,E7 | 서비스 car.Car04_Journal.selectByPrivateJournal(companyId, infoId, stdMonth) | 업무 |
| private getCarDate() | L519-524 | defaultInfoCheck,retrieve,closeCheck | 상태 처리 | 업무 |
| private settings() | L97-163 | 생성자 | 미선택 시 alert "해당년월을 먼저 입력해주세요", 이벤트 연결, 초기값: stdMonth=DateTimeFormat.getFormat("yyyy.MM" | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L207-254 | 필드 초기화 | 조회창 Car04_Lookup_PrivateJournal 열기, 미선택 시 alert "담당자가 마감처리한 운행일지입니다. 담당부서에 문의하세요", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L526-528 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '사용일자'),  // L241
  // ⚠ 대응 없음 (GridBuilder L242) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L243) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L244) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L245) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L246) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L247) addLongHtml
  gb.text('destination', 240, '행선지'),  // L248
  gb.text('reason', 240, '목적'),  // L249
  // ⚠ 대응 없음 (GridBuilder L250) addCell
  // ⚠DB없음 L251 fixYnText 100 "확정여부" (car04_fix_yn_text 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="save" onClick={() => /* closeCheck(), confirmCheck() */}>확정</Button>
5. <Button type="cancel" onClick={() => /* closeCheck(), cancelCheck() */}>확정취소</Button>

### Car04_Lookup_PrivateJournal (`client/vi/car/Car04_Lookup_PrivateJournal.java`, 489줄)

- 입력·하위 화면: `journalId` LongField, `companyId` LongField, `infoId` LongField, `date` MyDateField, `personId` LongField, `mileage` LongField, `beforeMileage` LongField, `afterMileage` LongField, `commuteMileage` LongField, `bizMileage` LongField, `unBizMileage` LongField, `destination` TextField, `reason` TextField, `note` TextField, `businessMileage` LongField

#### 이벤트
[E0] 화면 열림 (생성자 L95-112) → settings(), show()
[E1] updateButton[저장].Select (L115) → update()
[E2] closeButton[닫기].Select (L121) → hide()
[E3] date[사용일자⁽¹⁾].ValueChange (L141) → checkCloseYn()
[E4] commuteMileage.KeyUp (L192) → calculation()
[E5] bizMileage.KeyUp (L198) → calculation()
[E6] unBizMileage[비업무용 사용거리⁽⁴⁾].KeyUp (L204) → calculation()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L70-83 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L85-93 | 공개 메서드 | 상태 처리 | 업무 |
| private checkCloseYn() | L212-231 | E3 | 서비스 car.Car04_Journal.getAfterCloseYn(companyId, infoId, stdMonth) | 업무 |
| private checkFixYn() | L233-252 | checkCloseYn | 서비스 car.Car04_Journal.getAfterFixYn(companyId, infoId, stdMonth) | 업무 |
| private checkJournal() | L254-279 | checkFixYn | 서비스 car.Car04_Journal.selectByPrivateJournal(companyId, infoId, stdMonth) | 업무 |
| private checkDate() | L281-301 | checkJournal | 서비스 car.Car04_Journal.checkDate(companyId, infoId, date) | 업무 |
| private getBeforeMileage() | L303-325 | checkDate | 서비스 car.Car04_Journal.selectByDate(companyId, infoId, journalId, date) | 업무 |
| private calculation() | L327-374 | E4,E5,E6,getBeforeMileage | 상태 처리 | 업무 |
| private getEditor() | L376-442 | insert,edit | 상태 처리 | 업무 |
| public update() | L444-471 | E1 | 상태 처리 | 업무 |
| private checkLongNull() | L473-479 | getBeforeMileage | 상태 처리 | 업무 |
| private settings() | L114-210 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L481-483 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L485-487 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

