# Flt10_Tab_RightsExercise

- 종류: 화면
- 메뉴: 준법감시 > 10. 임직원매매 > 권리행사/기타입출고 (#1372)
- 파일: `client/vi/flt/Flt10_Tab_RightsExercise.java`
- 함께 쓰는 클래스 4개:
  - `Flt10_Lookup_RightsExercise` `client/vi/flt/Flt10_Lookup_RightsExercise.java`
  - `Flt11_Lookup_BookList` `client/vi/flt/Flt11_Lookup_BookList.java`
  - `Flt10_Lookup_Item` `client/vi/flt/Flt10_Lookup_Item.java`
  - `Flt03_Lookup_Account` `client/vi/flt/Flt03_Lookup_Account.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt01_CompanyStd.selectByDate` | Flt11_Lookup_BookList:255 | [`Flt01_CompanyStd.java:36`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt03_Account.selectByDate` | Flt03_Lookup_Account:158 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt10_Tr.delete2` | Flt10_Tab_RightsExercise:275 | [`Flt10_Tr.java:716`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md), `UpdateDataModel(flt10_tr)` 동적 DELETE |
| `flt.Flt10_Tr.insertFloorTrBook` | Flt10_Lookup_RightsExercise:421 | [`Flt10_Tr.java:468`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectByTrType` | Flt10_Tab_RightsExercise:229 | [`Flt10_Tr.java:70`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByTrType`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectItemName` | Flt10_Lookup_Item:147 | [`Flt10_Tr.java:54`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectItemName`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.update` | Flt10_Lookup_RightsExercise:405 | [`Flt10_Tr.java:670`](../../flt/services/Flt10_Tr.md) | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md), `UpdateDataModel(flt10_tr)` 동적 INSERT/UPDATE → [`flt10_tr.selectById`](../../flt/sql/flt10_tr.md) |
| `flt.Flt11_Book.selectByText` | Flt11_Lookup_BookList:201 | [`Flt11_Book.java:25`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByText`](../../flt/sql/flt11_book.md) |
| `flt.Flt11_Book.selectByText2` | Flt11_Lookup_BookList:199 | [`Flt11_Book.java:30`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByText2`](../../flt/sql/flt11_book.md) |
| `sys.Sys00_Common.selectByFltItemType` | Flt10_Lookup_RightsExercise:71 | [`Sys00_Common.java:121`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByFltItemType`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Flt10_Lookup_RightsExercise:68, Flt10_Tab_RightsExercise:117 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_biz_date`, `f_get_biz_days`, `f_get_floortrfundholdcheck`, `f_get_floortrrcntbuydate`, `f_get_itemtype_nm`, `f_get_quarter_date`, `f_insert_floortrbook`, `f_sysdate`, `f_trunc`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_RightsExercise (`client/vi/flt/Flt10_Tab_RightsExercise.java`, 302줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 거래기간: {startDate} ~: {closeDate} 거래구분: {trTypeComboBox} 계좌: {accountName} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="계좌/종목유형/종목명", `accountName` LookupTriggerField 빈칸="전체", `trTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `lookup` Flt03_Lookup_Account
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 50 "변경" Cell 편집:modiCell
  - regDate 100 "거래일" Date
  - trTypeName 150 "거래구분" Text
  - accountInfo 280 "계좌" Text
  - trItemTypeName 180 "종목유형" Text
  - trItemName 250 "종목명" Text
  - trItemCode 100 "종목코드" Text
  - trQty 100 "수량" Double
  - trAmt 120 "금액" Long
  - trNote 150 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L68-104) → settings(), retrieve()
[E1] trTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L125) → retrieve()
[E2] accountName.TriggerClick [result == null] (L135) → 인라인 L135-153 (new TriggerClickHandler() { @Override…)
[E3] searchText.KeyPress [Enter] (L157) → retrieve()
[E4] retrieveButton[조회].Select (L166) → retrieve()
[E5] insertButton[등록].Select (L172) → insertRow()
[E6] deleteButton[삭제].Select (L178) → preDelete()
       └ [E7] msgBox.DialogHide [YES] (L255) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L216-235 | 생성자,E1,E3,E4 | 서비스 flt.Flt10_Tr.selectByTrType(companyId, personId, startDate, closeDate, accountId, trType, searchText, groupTrType), 건수 표시 | 업무 |
| private insertRow() | L237-244 | E5 | 조회창 Flt10_Lookup_RightsExercise 열기 | 업무 |
| private preDelete() | L246-270 | E6 | ConfirmBox → E7 | 업무 |
| private delete() | L272-288 | E7 | GridDeleteData flt.Flt10_Tr.delete2(체크된 행 목록) | 업무 |
| private setInitData() | L290-297 | settings | 상태 처리 | 업무 |
| private settings() | L106-184 | 생성자 | 조회창 Flt03_Lookup_Account 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: accountName=null, accountName=resultModel.getAccountName( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L186-214 | 필드 초기화 | 조회창 Flt10_Lookup_RightsExercise 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L299-301 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L202) addCell
  gb.date('regDate', 100, '거래일'),  // L203
  gb.text('trTypeNm', 150, '거래구분'),  // L204
  gb.text('accountInfo', 280, '계좌'),  // L205
  gb.text('trItemTypeNm', 180, '종목유형'),  // L206
  gb.text('trItemNm', 250, '종목명'),  // L207
  gb.text('trItemCd', 100, '종목코드'),  // L208
  gb.double('trQty', 100, '수량'),  // L209
  gb.long('trAmt', 120, '금액'),  // L210
  gb.textArea('trNote', 150, '비고'),  // L211
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={preDelete}>삭제</Button>

### Flt10_Lookup_RightsExercise (`client/vi/flt/Flt10_Lookup_RightsExercise.java`, 454줄)

- 입력·하위 화면: `trType` TextField, `trTypeName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요", `trItemType` TextField, `trItemTypeName` CommonComboBoxField("sys.Sys00_Common.selectByFltItemType"), `regDate` MyDateField, `accountId` LongField, `accountInfo` LookupTriggerField, `trItemCode` TextField, `trItemName` LookupTriggerField, `trQty` DoubleField, `trAmt` LongField, `trNote` TextField, `lookup` Flt03_Lookup_Account

#### 이벤트
[E0] 화면 열림 (생성자 L90-92) → 초기화
[E1] trTypeName[거래구분].Collapse ["I".equals(InOutType)] (L157) → setEnabled()
[E2] accountInfo[계좌].TriggerClick ["O".equals(InOutType)] (L178) → lookupBook(), lookupAccount()
[E3] trItemTypeName[종목유형].Collapse (L194) → 인라인 L194-204 (new CollapseHandler() { @Override pub…)
[E4] trItemName.TriggerClick (L207) → lookupItem()
[E5] updateButton[저장].Select (L214) → preUpdate()
[E6] closeButton[닫기].Select ["NEW".equals(actionName)] (L220) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L94-108 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L110-142 | openNew | 상태 처리 | 업무 |
| private setting() | L144-232 | open | 상태 처리 | 업무 |
| private setEnabled() | L234-245 | E1 | 상태 처리 | 업무 |
| private lookupAccount() | L247-262 | E2 | 조회창 Flt03_Lookup_Account 열기 | 업무 |
| private lookupBook() | L264-283 | E2 | 조회창 Flt11_Lookup_BookList 열기 | 업무 |
| private lookupItem() | L285-292 | E4 | 상태 처리 | 업무 |
| private lookupStkItem() | L294-306 | lookupItem | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| private lookupEtcItem() | L308-319 | lookupItem | 조회창 Flt10_Lookup_Item 열기 | 업무 |
| private getEditor() | L321-368 | open | 상태 처리 | 업무 |
| public preUpdate() | L370-401 | E5 | 상태 처리 | 업무 |
| private update() | L403-418 | preUpdate | 서비스 flt.Flt10_Tr.update | 업무 |
| private createBook() | L420-444 | update | 서비스 flt.Flt10_Tr.insertFloorTrBook(companyId, personId, accountId, itemType, itemName, itemCode, startDate) | 업무 |
| private setHtmlStyle() | L446-448 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L450-452 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt11_Lookup_BookList (`client/vi/flt/Flt11_Lookup_BookList.java`, 347줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="종목코드/명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bookDate 100 "보유기준일" Date
  - accountNo 200 "계좌" Text
  - itemTypeName 150 "종목유형" Text
  - itemName 200 "종목명" Text
  - itemCode 110 "종목코드" TextCenter
  - bookAmt 120 "보유금액" Long
  - bookQty 80 "보유수량" Double
  - bookDays 100 "보유기간" TextCenter
  - buyDate 100 "최근매수일" Date
  - checkFundHoldYn 60 "펀드종목" BooleanYn2

#### 이벤트
[E1] searchText.KeyPress [Enter] (L132) → retrieve()
[E2] retrieveButton[조회].Select (L140) → retrieve()
[E3] oKButton[선택].Select (L146) → confirm()
       └ [E6] msgBox.DialogHide [YES] (L230) → confirmNext()
[E4] cancelButton[닫기].Select (L152) → hide()
[E5] grid.CellDoubleClick (L159) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-68 | view | 상태 처리 | 업무 |
| public open() | L70-78 | view | 상태 처리 | 업무 |
| public open() | L80-87 | view | 상태 처리 | 업무 |
| public view() | L89-97 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L99-127 | view | 상태 처리 | 업무 |
| public retrieve() | L187-210 | E1,E2,open | 서비스 flt.Flt11_Book.selectByText2, flt.Flt11_Book.selectByText(companyId, personId, accountId, stdDate, searchText), 건수 표시 | 업무 |
| public confirm() | L212-249 | E3,E5 | ConfirmBox → E6 | 업무 |
| private confirmNext() | L251-329 | E6,confirm | 미선택 시 alert "의무보유기간 기준일수가 등록되어 있지 않습니다. 내부통제 관리자에게 문의하세요" → 확인창 E7 | 업무 |
| private confirmEnd() | L331-337 | E7,confirmNext | 상태 처리 | 업무 |
| private settings() | L129-165 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L167-185 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L339-341 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L343-345 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('bookDate', 100, '보유기준일'),  // L173
  gb.text('accountNo', 200, '계좌'),  // L174 SQL 계산 컬럼(selectByText2: TO_DECRYPTS(flt03_account_no) || ' (' |…)
  gb.text('itemTypeNm', 150, '종목유형'),  // L175 SQL 계산 컬럼(selectByText2: flt05_item_type_nm)
  gb.text('itemNm', 200, '종목명'),  // L176
  gb.textCenter('itemCd', 110, '종목코드'),  // L177
  gb.long('bookAmt', 120, '보유금액'),  // L178
  gb.double('bookQty', 80, '보유수량'),  // L179
  gb.textCenter('bookDays', 100, '보유기간'),  // L180 SQL 계산 컬럼(selectByText2: CASE WHEN flt11_buy_date IS NULL THEN '…)
  gb.date('buyDate', 100, '최근매수일'),  // L181 SQL 계산 컬럼(selectByText2: f_get_floorTrRcntBuyDate( flt11_company…)
  gb.booleanYn2('checkFundHoldYn', 60, '펀드종목'),  // L182 SQL 계산 컬럼(selectByText2: f_get_floorTrFundHoldCheck( flt11_compa…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

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

