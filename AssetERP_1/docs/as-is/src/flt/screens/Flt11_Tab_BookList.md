# Flt11_Tab_BookList

- 종류: 화면
- 메뉴: 준법감시 > 10. 임직원매매 > 보유내역조회 (#1143)
- 파일: `client/vi/flt/Flt11_Tab_BookList.java`
- 함께 쓰는 클래스 4개:
  - `Flt13_Lookup_BookInit` `client/vi/flt/Flt13_Lookup_BookInit.java`
  - `Flt10_Lookup_Item` `client/vi/flt/Flt10_Lookup_Item.java`
  - `Flt05_Lookup_ItemTypeConfirm` `client/vi/flt/Flt05_Lookup_ItemTypeConfirm.java`
  - `Flt03_Lookup_Account` `client/vi/flt/Flt03_Lookup_Account.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt03_Account.selectByDate` | Flt03_Lookup_Account:158 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt05_ItemType.selectBySearchText` | Flt05_Lookup_ItemTypeConfirm:225 | [`Flt05_ItemType.java:24`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.selectBySearchText`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt10_Tr.countByTrDate` | Flt13_Lookup_BookInit:627 | [`Flt10_Tr.java:442`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.countByTrDate`](../../flt/sql/flt10_tr.md), [`flt14_relate_appr.checkAppr`](../../flt/sql/flt14_relate_appr.md) |
| `flt.Flt10_Tr.getBizDate` | Flt11_Tab_BookList:241 | [`Flt10_Tr.java:459`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.getBizDate`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.insertFloorTrBook` | Flt11_Tab_BookList:207 | [`Flt10_Tr.java:468`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectItemName` | Flt10_Lookup_Item:147 | [`Flt10_Tr.java:54`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectItemName`](../../flt/sql/flt10_tr.md) |
| `flt.Flt11_Book.selectByBookList` | Flt11_Tab_BookList:170 | [`Flt11_Book.java:35`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByBookList`](../../flt/sql/flt11_book.md) |
| `flt.Flt11_Book.update` | Flt11_Tab_BookList:233 | [`Flt11_Book.java:51`](../../flt/services/Flt11_Book.md) | `UpdateDataModel(flt11_book)` 동적 INSERT/UPDATE → [`flt11_book.selectById`](../../flt/sql/flt11_book.md) |
| `flt.Flt13_BookInit.delete` | Flt13_Lookup_BookInit:570 | [`Flt13_BookInit.java:131`](../../flt/services/Flt13_BookInit.md) | [`flt05_item_type.selectByItemType`](../../flt/sql/flt05_item_type.md), [`flt11_book.deleteByItemName`](../../flt/sql/flt11_book.md), `UpdateDataModel(flt13_book_init)` 동적 DELETE |
| `flt.Flt13_BookInit.getInitDate` | Flt13_Lookup_BookInit:268 | [`Flt13_BookInit.java:56`](../../flt/services/Flt13_BookInit.md) | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md) |
| `flt.Flt13_BookInit.selectByPersonId` | Flt13_Lookup_BookInit:433 | [`Flt13_BookInit.java:31`](../../flt/services/Flt13_BookInit.md) | [`flt13_book_init.selectByPersonId`](../../flt/sql/flt13_book_init.md) |
| `flt.Flt13_BookInit.update` | Flt13_Lookup_BookInit:515 | [`Flt13_BookInit.java:67`](../../flt/services/Flt13_BookInit.md) | [`flt05_item_type.selectByItemType`](../../flt/sql/flt05_item_type.md), [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md), [`flt11_book.deleteByItemName`](../../flt/sql/flt11_book.md), [`flt11_book.insertByFlt13`](../../flt/sql/flt11_book.md), `UpdateDataModel(flt13_book_init)` 동적 INSERT/UPDATE → [`flt13_book_init.selectById`](../../flt/sql/flt13_book_init.md) |
| `sys.Sys00_Common.selectByFltItemType` | Flt13_Lookup_BookInit:335 | [`Sys00_Common.java:121`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByFltItemType`](../../sys/sql/sys00_common.md) |
| `sys.Sys09_Code.selectByKindGroupCode` | Flt05_Lookup_ItemTypeConfirm:243 | [`Sys09_Code.java:110`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys12_Calendar.selectByDay` | Flt13_Lookup_BookInit:286 | [`Sys12_Calendar.java:31`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.selectByDay`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys99_Print.insertRdBookList` | Flt11_Tab_BookList:267 | [`Sys99_Print.java:4142`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt11_book.selectByBookList`](../../flt/sql/flt11_book.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`flt14_relate_appr`](../../../db/tables/flt.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_biz_days`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_floortrrcntbuydate`, `f_get_itemtype_nm`, `f_insert_floortrbook`, `f_sysdate`, `f_today`, `f_trunc`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt11_Tab_BookList (`client/vi/flt/Flt11_Tab_BookList.java`, 325줄)

- 레이아웃: center=vlc
- 툴바 `buttonBarL`: 조회기준일: {baseDate} 검색: {searchText} {retrieveButton} {downloadButton} {rdFileDownloadForm} {arrangeButton} ※ 기준일부터 현재일까지 정리됩니다:
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="계좌/종목유형/종목명", `lookup` Flt13_Lookup_BookInit
- 그리드 `grid` (buildGrid()):
  - accountNo 200 "계좌" Text
  - itemTypeName 150 "종목유형" Text
  - itemName 250 "종목명" Text
  - bookQty 120 "보유수량" Double
  - bookAmt 120 "보유금액" Long
  - bookDays 120 "보유기간" TextCenter
  - buyDate 100 "최근매매일" Date
  - yearInvestLimit 120 "연간투자금액" Long
  - totalInvestAmt 120 "총누적투자금액" Long
  - turnoverRate 120 "월간매매회전율(%)" Double

#### 이벤트
[E0] 화면 열림 (생성자 L63-101) → settings()
[E1] searchText.KeyPress [Enter] (L110) → retrieve()
[E2] retrieveButton[조회].Select (L119) → retrieve()
[E3] arrangeButton[보유원장 정리].Select (L125) → preArrange()
       └ [E6] msgBox.DialogHide [YES] (L187) → arrange()
[E4] createButton[최초원장 등록].Select (L131) → lookupCreate()
[E5] downloadButton[엑셀다운로드].Select (L138) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L162-176 | E1,E2,lookupCreate | 서비스 flt.Flt11_Book.selectByBookList(companyId, personId, baseDate, searchText) | 업무 |
| private preArrange() | L178-203 | E3 | ConfirmBox → E6 | 업무 |
| private arrange() | L205-229 | E6 | 서비스 flt.Flt10_Tr.insertFloorTrBook(companyId, personId, accountId, itemType, itemName, itemCode, startDate) | 업무 |
| public update() | L231-234 | 공개 메서드 | 서비스 flt.Flt11_Book.update | 업무 |
| private setInitData() | L236-252 | settings | 서비스 flt.Flt10_Tr.getBizDate(companyId, baseDate) | 업무 |
| private lookupCreate() | L254-262 | E4 | 조회창 Flt13_Lookup_BookInit 열기 | 업무 |
| private createRdExcel() | L264-316 | E5 | 서비스 sys.Sys99_Print.insertRdBookList(windowClassName, companyId, personId, baseDate, searchText) | 업무 |
| private settings() | L103-144 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L146-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L318-320 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L322-324 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('accountNo', 200, '계좌'),  // L148 SQL 계산 컬럼(selectByBookList: TO_DECRYPTS(flt03_account_no) || ' (' |…)
  gb.text('itemTypeNm', 150, '종목유형'),  // L149 SQL 계산 컬럼(selectByBookList: flt05_item_type_nm)
  gb.text('itemNm', 250, '종목명'),  // L150
  gb.double('bookQty', 120, '보유수량'),  // L151
  gb.long('bookAmt', 120, '보유금액'),  // L152
  gb.textCenter('bookDays', 120, '보유기간'),  // L153 SQL 계산 컬럼(selectByBookList: CASE WHEN flt11_buy_date IS NULL THEN '…)
  gb.date('buyDate', 100, '최근매매일'),  // L154 SQL 계산 컬럼(selectByBookList: f_get_floorTrRcntBuyDate( flt11_company…)
  gb.long('yearInvestLimit', 120, '연간투자금액'),  // L155 SQL 계산 컬럼(selectByBookList: f_get_floorTrCheck('1', emp00_company_i…)
  gb.long('totalInvestAmt', 120, '총누적투자금액'),  // L156 SQL 계산 컬럼(selectByBookList: f_get_floorTrCheck('2', emp00_company_i…)
  gb.double('turnoverRate', 120, '월간매매회전율(%)'),  // L157 SQL 계산 컬럼(selectByBookList: f_get_floorTrCheck('3', emp00_company_i…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
3. <Button type="view" onClick={preArrange}>보유원장 정리</Button>
4. <Button type="register" onClick={lookupCreate}>최초원장 등록</Button>

### Flt13_Lookup_BookInit (`client/vi/flt/Flt13_Lookup_BookInit.java`, 665줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} ※ 최초원장 잔고기준일(영업일): {stdDate} {insertButton} {updateButton} {deleteButton} {tempDownloadButton} {excelUploadButton} {itemTypeButton} {uploadExcelForm} {downloadForm}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="계좌/종목/종목유형", `lookupItemType` Flt05_Lookup_ItemTypeConfirm, `lookupAccount` LookupTriggerField, `lookup` Flt03_Lookup_Account, `ItemTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByFltItemType"), `lookupItemInfo` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bookDate 100 "잔고기준일" Date
  - accountInfo 250 "계좌" Text 편집:lookupAccount
  - itemTypeName 150 "종목유형" Text 편집:ItemTypeComboBox
  - itemName 250 "종목명" Text 편집:lookupItemInfo
  - itemCode 120 "종목코드" TextCenter
  - bookQty 100 "보유수량<br>(입출금액)" Double 편집:DoubleField
  - bookAmt 120 "보유금액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L99-107) → 초기화
[E1] searchText.KeyPress [Enter] (L149) → retrieve()
[E2] stdDate.ValueChange [YES] (L159) → holdDateChange()
[E3] msgBox.DialogHide [YES] (L171) → holdDateChange()
[E4] retrieveButton[조회].Select (L192) → retrieve()
[E5] insertButton[등록].Select (L198) → insertRow()
[E6] updateButton[저장].Select (L204) → update()
[E7] deleteButton[삭제].Select (L210) → preDelete()
       └ [E16] msgBox.DialogHide [YES] (L546) → delete()
[E8] closeButton[닫기].Select [callback != null] (L216) → hide()
[E9] tempDownloadButton[템플릿].Select (L225) → 인라인 L225-230 (new SelectHandler(){ @Override public…)
[E10] excelUploadButton[엑셀업로드].Select (L231) → checkPreTr(), excelUpload()
[E11] itemTypeButton[종목유형코드].Select (L242) → 인라인 L242-249 (new SelectHandler() { @Override publi…)
[E12] uploadExcelForm.SubmitComplete (L256) → retrieve()
[E13] lookupAccount.TriggerClick [result != null] (L313) → 인라인 L313-329 (new TriggerClickHandler() { @Override…)
[E14] ItemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L336) → 인라인 L336-347 (new CollapseHandler() { @Override pub…)
[E15] lookupItemInfo.TriggerClick (L351) → lookupStkItem(), lookupItem()
[E17] fileUploadField.Change (L608) → 인라인 L608-613 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L109-144 | 공개 메서드 | 상태 처리 | 업무 |
| private setStdDate() | L267-283 | settings | 서비스 flt.Flt13_BookInit.getInitDate(companyId, personId) | 업무 |
| private checkWorkingYn() | L285-304 | checkPreTr | 서비스 sys.Sys12_Calendar.selectByDay(companyId, stdDate) | 업무 |
| private lookupItem() | L388-398 | E15 | 조회창 Flt10_Lookup_Item 열기 | 업무 |
| private lookupStkItem() | L400-423 | E15 | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| public retrieve() | L425-439 | E1,E4,E12,setStdDate | 서비스 flt.Flt13_BookInit.selectByPersonId(companyId, personId, searchText) | 업무 |
| private insertRow() | L441-460 | E5 | 상태 처리 | 업무 |
| private update() | L462-531 | E6 | 서비스 flt.Flt13_BookInit.update | 업무 |
| private preDelete() | L533-563 | E7 | ConfirmBox → E16 | 업무 |
| private delete() | L565-584 | E16 | GridDeleteData flt.Flt13_BookInit.delete(체크된 행 목록) | 업무 |
| private holdDateChange() | L586-595 | E2,E3 | 상태 처리 | 업무 |
| private excelUpload() | L597-616 | E10 | 상태 처리 | 업무 |
| private checkPreTr() | L621-651 | E10,insertRow,update,preDelete,holdDateChange | 서비스 flt.Flt10_Tr.countByTrDate(companyId, personId, stdDate) | 업무 |
| private settings() | L146-265 | open | 조회창 Flt05_Lookup_ItemTypeConfirm 열기, 확인창 표시, 이벤트 연결, 초기값: stdDate=orgDate | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L306-386 | 필드 초기화 | 조회창 Flt03_Lookup_Account 열기, 미선택 시 alert "종목유형 선택 후 종목 선택이 가능합니다", 서비스 sys.Sys00_Common.selectByFltItemType, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L653-655 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L657-659 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L661-663 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('bookDate', 100, '잔고기준일'),  // L377
  gb.text('accountInfo', 250, '계좌'),  // L378 SQL 계산 컬럼(selectByPersonId: TO_DECRYPTS(flt03_account_no) || ' ' ||…)
  gb.text('itemTypeNm', 150, '종목유형', { editor: 'select' }),  // L379 SQL 계산 컬럼(selectByPersonId: flt05_item_type_nm)
  gb.text('itemNm', 250, '종목명'),  // L380
  gb.textCenter('itemCd', 120, '종목코드'),  // L381
  gb.double('bookQty', 100, '보유수량<br>(입출금액)', { editor: 'number' }),  // L382
  gb.long('bookAmt', 120, '보유금액', { editor: 'number' }),  // L383
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={preDelete}>삭제</Button>
5. <Button type="download" onClick={() => /* 인라인 L225-230 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
6. <Button type="upload" onClick={() => /* checkPreTr(), excelUpload() */}>엑셀업로드</Button>
7. <Button type="unknown" onClick={() => /* 인라인 L242-249 (new SelectHandler() { @Override publi…) */}>종목유형코드</Button>
8. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt10_Lookup_Item (`client/vi/flt/Flt10_Lookup_Item.java`, 176줄)

- 툴바 `buttonBar`: 종목명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid()):
  - itemTypeName 150 "종목유형" Text
  - itemName 270 "종목명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L102) → retrieve()
[E3] oKButton[선택].Select (L108) → confirm()
[E4] cancelButton[닫기].Select (L114) → hide()
[E5] grid.CellDoubleClick (L121) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-54 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L56-60 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L62-90 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L139-153 | E1,E2,open | 서비스 flt.Flt10_Tr.selectItemName(companyId, personId, stdDate, searchText) | 업무 |
| public confirm() | L155-166 | E3,E5 | 미선택 시 alert "선택된 종목이 없습니다" | 업무 |
| private settings() | L92-127 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L129-137 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L168-170 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L172-174 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemTypeNm', 150, '종목유형'),  // L133
  gb.text('itemNm', 270, '종목명'),  // L134
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt05_Lookup_ItemTypeConfirm (`client/vi/flt/Flt05_Lookup_ItemTypeConfirm.java`, 315줄)

- 툴바 `buttonBar01`: 검색: {searchText} {retrieveButton} 검색: {searchText} {retrieveButton}
- 툴바 `buttonBar02`: {notice} {notice}
- 입력·하위 화면: `searchText` TextField 빈칸="종목유형명"
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - itemTypeCode 90 "종목유형코드" TextCenter
  - itemTypeName 250 "종목유형명" Text
- 그리드 `trTypeGrid` (trTypebuildGrid(), 행번호숨김):
  - code 80 "구분코드" TextCenter
  - name 250 "구분명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L145) → retrieve()
[E2] retrieveButton[조회].Select (L153) → retrieve()
[E3] cancelButton[닫기].Select (L159) → hide()
[E4] grid.CellDoubleClick (L165) → getCellValue(), showCopyNotice()
[E5] trTypeGrid.CellDoubleClick (L180) → getCellValue(), showCopyNotice()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-93 | 공개 메서드 | 상태 처리 | 업무 |
| public openGroup() | L95-142 | 공개 메서드 | 상태 처리 | 업무 |
| private trTypebuildGrid() | L208-217 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L219-234 | E1,E2,open,openGroup | 서비스 flt.Flt05_ItemType.selectBySearchText(companyId, searchText) | 업무 |
| private retrieveTrType() | L236-249 | retrieve | 서비스 sys.Sys09_Code.selectByKindGroupCode(companyId, applyDate, kindGroupCode) | 업무 |
| private getCellValue() | L252-259 | E4,E5 | 상태 처리 | 업무 |
| private getCellValue() | L262-269 | E4,E5 | 상태 처리 | 업무 |
| private showCopyNotice() | L281-301 | E4,E5 | 상태 처리 | 업무 |
| private settings() | L144-195 | open,openGroup | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L197-206 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L303-305 | open,openGroup | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L307-309 | open,openGroup | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L311-313 | showCopyNotice,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeCd', 90, '종목유형코드'),  // L203
  gb.text('itemTypeNm', 250, '종목유형명'),  // L204
];

const trTypebuildGrid = () => [
  gb.textCenter('code', 80, '구분코드'),  // L214
  gb.text('name', 250, '구분명'),  // L215
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt03_Lookup_Account (`client/vi/flt/Flt03_Lookup_Account.java`, 187줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} {retrieveButton}
- 입력·하위 화면: `baseDateField` MyDateField
- 그리드 `grid` (buildGrid()):
  - mainAccountYnStr 60 "주계좌" TextCenter
  - corpName 100 "개설기관" Text
  - accountNoDec 200 "계좌번호" Text
  - accountName 100 "계좌명" Text
  - itemTypeName 130 "종목유형" Text

#### 이벤트
[E0] 화면 열림 (생성자 L80-136) → show()
[E1] retrieveButton[조회].Select (L87) → retrieve()
[E2] oKButton[확인].Select (L93) → confirm()
[E3] nullButton[전체].Select (L99) → hide()
[E4] cancelButton[닫기].Select (L106) → hide()
[E5] grid.CellDoubleClick (L124) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNull() | L46-58 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L60-68 | 공개 메서드 | 상태 처리 | 업무 |
| public openDateLock() | L70-78 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L150-164 | E1,openNull,open,openDateLock | 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate), 건수 표시 | 업무 |
| public confirm() | L166-177 | E2,E5 | 미선택 시 alert "선택된 계좌정보가 없습니다" | 업무 |
| private buildGrid() | L138-148 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L179-181 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L183-185 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('mainAccountYnStr', 60, '주계좌'),  // L141
  gb.text('corpNm', 100, '개설기관'),  // L142
  gb.text('accountNoDec', 200, '계좌번호'),  // L143
  gb.text('accountNm', 100, '계좌명'),  // L144
  gb.text('itemTypeNm', 130, '종목유형'),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

