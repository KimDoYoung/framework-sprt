# Car04_Tab_Journal

- 종류: 화면
- 메뉴: 경영관리 > 10. 차량관리 > 차량 운행일지 (#1193)
- 파일: `client/vi/car/Car04_Tab_Journal.java`
- 함께 쓰는 클래스 3개:
  - `Car04_Lookup_PublicJournal` `client/vi/car/Car04_Lookup_PublicJournal.java`
  - `Car04_Lookup_PrivateJournal` `client/vi/car/Car04_Lookup_PrivateJournal.java`
  - `Car01_Lookup_Info` `client/vi/car/Car01_Lookup_Info.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Car04_Tab_Journal:237 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `car.Car01_Info.selectByCarType` | Car01_Lookup_Info:188 | [`Car01_Info.java:36`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarType1`](../../car/sql/car01_info.md), [`car01_info.selectByCarType2`](../../car/sql/car01_info.md) |
| `car.Car01_Info.selectByCarTypeAdmin` | Car01_Lookup_Info:191 | [`Car01_Info.java:56`](../../car/services/Car01_Info.md) | [`car01_info.selectByCarTypeAdmin`](../../car/sql/car01_info.md) |
| `car.Car04_Journal.checkDate` | Car04_Lookup_PrivateJournal:282 | [`Car04_Journal.java:171`](../../car/services/Car04_Journal.md) | [`car04_journal.checkDate`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.getAfterCloseYn` | Car04_Lookup_PrivateJournal:213, Car04_Tab_Journal:505 | [`Car04_Journal.java:110`](../../car/services/Car04_Journal.md) | [`car04_journal.getAfterCloseYn`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.getAfterFixYn` | Car04_Lookup_PrivateJournal:234 | [`Car04_Journal.java:90`](../../car/services/Car04_Journal.md) | [`car04_journal.getAfterFixYn`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.getBeforeCloseYn` | Car04_Tab_Journal:505 | [`Car04_Journal.java:100`](../../car/services/Car04_Journal.md) | [`car04_journal.getBeforeCloseYn`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.modelUpdate` | Car04_Tab_Journal:444 | [`Car04_Journal.java:148`](../../car/services/Car04_Journal.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByDate` | Car04_Lookup_PrivateJournal:306 | [`Car04_Journal.java:27`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByDate`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByJournal` | Car04_Tab_Journal:691 | [`Car04_Journal.java:78`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByJournal`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.selectByPrivateJournal` | Car04_Lookup_PrivateJournal:255 | [`Car04_Journal.java:40`](../../car/services/Car04_Journal.md) | [`car04_journal.selectByPrivateJournal`](../../car/sql/car04_journal.md) |
| `car.Car04_Journal.update` | Car04_Tab_Journal:548 | [`Car04_Journal.java:183`](../../car/services/Car04_Journal.md) | `UpdateDataModel(car04_journal)` 동적 INSERT/UPDATE → [`car04_journal.selectById`](../../car/sql/car04_journal.md) |
| `car.Car05_RelateAppr.insert` | Car04_Tab_Journal:623 | [`Car05_RelateAppr.java:46`](../../car/services/Car05_RelateAppr.md) | [`car05_relate_appr.checkRelateApprId`](../../car/sql/car05_relate_appr.md), [`car05_relate_appr.insert`](../../car/sql/car05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `car.Car05_RelateAppr.selectByStdMonth` | Car04_Tab_Journal:375 | [`Car05_RelateAppr.java:25`](../../car/services/Car05_RelateAppr.md) | [`car05_relate_appr.selectByStdMonth`](../../car/sql/car05_relate_appr.md) |
| `car.Car05_RelateAppr.updateApprId` | Car04_Tab_Journal:675 | [`Car05_RelateAppr.java:37`](../../car/services/Car05_RelateAppr.md) | [`car05_relate_appr.updateApprId`](../../car/sql/car05_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Car04_Tab_Journal:569 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `utils.pdf.PDFCreate.createCarJournal` | Car04_Tab_Journal:634 | [`PDFCreate.java:79`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md), [`car05_relate_appr`](../../../db/tables/car.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car04_Tab_Journal (`client/vi/car/Car04_Tab_Journal.java`, 764줄)

- 레이아웃: center=vlc, south=cp
- 툴바 `buttonBar`: 기준년월: {stdMonth} 차량구분: {carTypeName} 차량번호: {infoName} {retrieveButton} {confirmButton} {cancleButton} {rdButton}
- 입력·하위 화면: `stdMonth` TextField 빈칸="YYYY.MM", `carTypeName` ComboBoxField("CarTypeCode"), `infoId` LongField, `infoName` LookupTriggerField 빈칸="차량정보를 선택해주세요", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStatusName` TextField 빈칸="결재상태 정보없음", `apprStatusCode` TextField, `popup` Car01_Lookup_Info, `editor` Apr01_Edit_ApprDoc, `lookup` Car04_Lookup_PrivateJournal
- 그리드 `grid` (buildGrid()):
  - closeYnText 80 "마감여부" TextCenter
  - actionCell 60 "변경" Cell 편집:actionCell
  - date 100 "사용일자" Date
  - infoPersonName 100 "사용자" TextCenter
  - fixYnText 80 "사용자<br>확정여부" TextCenterHtml
  - beforeMileage 120 "주행전<br>계기판(km)" LongHtml
  - afterMileage 120 "주행후<br>계기판(km)" LongHtml
  - mileage 120 "주행거리<br>(km)" LongHtml
  - commuteMileage 120 "출퇴근<br>사용거리(km)" LongHtml
  - bizMileage 120 "일반업무용<br>사용거리(km)" LongHtml
  - unBizMileage 120 "비업무용<br>사용거리(km)" LongHtml
  - destination 240 "행선지" Text
  - reason 240 "목적" Text

#### 이벤트
[E0] 화면 열림 (생성자 L92-144) → settings(), defaultName()
[E1] stdMonth.KeyPress [Enter] (L154) → retrieve()
[E2] carTypeName[CarTypeCode].Collapse (L164) → 인라인 L164-170 (new CollapseHandler() { @Override pub…)
[E3] infoName.TriggerClick (L174) → retrieve()
[E4] retrieveButton[조회].Select (L201) → retrieve()
[E5] confirmButton[마감].Select (L207) → fixCheck(), updateCheck()
[E6] cancleButton[마감취소].Select (L214) → fixCheck(), updateCheck()
[E7] classTreeFullName[문서분류].TriggerClick (L222) → openLookupDoc()
[E8] apprButton[상신].Select (L228) → insertApprCheck()
[E9] apprViewButton[문서보기].Select (L234) → retrieveApprStatus()
[E10] rdButton[출력/다운로드].Select (L259) → getCarDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L332-372 | E1,E3,E4,modelUpdate,update,fixCheck | 서비스 car.Car04_Journal.selectByJournal(companyId, infoId, stdMonth) | 업무 |
| private retrieveApprStatus() | L374-420 | E9,retrieve,updateApprId | 서비스 car.Car05_RelateAppr.selectByStdMonth(companyId, infoId, stdMonth) | 업무 |
| public insertRow() | L422-438 | 공개 메서드 | 조회창 Car04_Lookup_PrivateJournal 열기 | 업무 |
| private modelUpdate() | L440-454 | insertRow,editData | 서비스 car.Car04_Journal.modelUpdate | 업무 |
| private updateCheck() | L456-527 | E5,E6 | 미선택 시 alert "이미 마감되었습니다." | 업무 |
| private update() | L529-566 | updateCheck | 미선택 시 alert, 서비스 car.Car04_Journal.update | 업무 |
| private defaultName() | L568-588 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private openLookupDoc() | L591-600 | E7 | 상태 처리 | 업무 |
| private insertApprCheck() | L602-650 | E8 | 서비스 car.Car05_RelateAppr.insert(companyId, infoId, stdMonth, relateApprId, companyId, infoId, stdMonth) | 업무 |
| private insertAppr() | L652-672 | insertApprCheck | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L674-687 | insertAppr | 서비스 car.Car05_RelateAppr.updateApprId(apprId, relateApprId) | 업무 |
| private fixCheck() | L689-716 | E5,E6 | 서비스 car.Car04_Journal.selectByJournal(companyId, infoId, stdMonth) | 업무 |
| private editData() | L718-749 | buildGrid | 조회창 Car04_Lookup_PrivateJournal 열기, 조회창 Car04_Lookup_PublicJournal 열기, 미선택 시 alert "해당월의 운행일지는 마감이 되어 변경하실 수 없습니다" | 업무 |
| private getCarDate() | L751-755 | E10,retrieve,retrieveApprStatus,updateCheck,insertApprCheck,fixCheck | 상태 처리 | 업무 |
| private settings() | L146-301 | 생성자 | 조회창 Car01_Lookup_Info 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결, 초기값: stdMonth=DateTimeFormat.getFormat("yyyy.MM", carTypeName="선택"("CarTypeCode"), infoId=null, infoId=null, infoId=resultModel.getInfoId( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L303-330 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L757-759 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L761-763 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L315 closeYnText 80 "마감여부" (car04_close_yn_text 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L316) addCell
  gb.date('date', 100, '사용일자'),  // L317
  gb.textCenter('infoPersonNm', 100, '사용자'),  // L318 SQL 계산 컬럼(selectByJournal: ( CASE WHEN journal.car01_car_type = '1…)
  // ⚠ 대응 없음 (GridBuilder L319) addTextCenterHtml
  // ⚠ 대응 없음 (GridBuilder L320) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L321) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L322) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L323) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L324) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L325) addLongHtml
  gb.text('destination', 240, '행선지'),  // L326
  gb.text('reason', 240, '목적'),  // L327
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={() => /* fixCheck(), updateCheck() */}>마감</Button>
3. <Button type="cancel" onClick={() => /* fixCheck(), updateCheck() */}>마감취소</Button>
4. <Button type="download" onClick={getCarDate}>출력/다운로드</Button>
5. <Button type="register" onClick={insertApprCheck}>상신</Button>
6. <Button type="search" onClick={retrieveApprStatus}>문서보기</Button>

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

