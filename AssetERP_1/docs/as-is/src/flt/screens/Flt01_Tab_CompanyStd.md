# Flt01_Tab_CompanyStd

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 기준관리 (#1145)
- 파일: `client/vi/flt/Flt01_Tab_CompanyStd.java`
- 함께 쓰는 클래스 3개:
  - `Flt08_Lookup_LockupItem` `client/vi/flt/Flt08_Lookup_LockupItem.java`
  - `Flt05_Lookup_ItemType` `client/vi/flt/Flt05_Lookup_ItemType.java`
  - `Flt01_Lookup_LockUpCheckType` `client/vi/flt/Flt01_Lookup_LockUpCheckType.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt01_CompanyStd.delete` | Flt01_Tab_CompanyStd:266 | [`Flt01_CompanyStd.java:73`](../../flt/services/Flt01_CompanyStd.md) | `UpdateDataModel(flt01_company_std)` 동적 DELETE |
| `flt.Flt01_CompanyStd.selectByCompanyId` | Flt01_Tab_CompanyStd:192 | [`Flt01_CompanyStd.java:30`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.selectByCompanyId`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt01_CompanyStd.update` | Flt01_Tab_CompanyStd:203 | [`Flt01_CompanyStd.java:68`](../../flt/services/Flt01_CompanyStd.md) | `UpdateDataModel(flt01_company_std)` 동적 INSERT/UPDATE → [`flt01_company_std.selectById`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt01_CompanyStd.updateOne` | Flt01_Lookup_LockUpCheckType:197 | [`Flt01_CompanyStd.java:60`](../../flt/services/Flt01_CompanyStd.md) | `UpdateDataModel(flt01_company_std)` 동적 INSERT/UPDATE → [`flt01_company_std.selectById`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt05_ItemType.delete` | Flt05_Lookup_ItemType:265 | [`Flt05_ItemType.java:76`](../../flt/services/Flt05_ItemType.md) | `UpdateDataModel(flt05_item_type)` 동적 DELETE |
| `flt.Flt05_ItemType.selectBySearchText` | Flt05_Lookup_ItemType:183 | [`Flt05_ItemType.java:24`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.selectBySearchText`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt05_ItemType.selectUseCount` | Flt05_Lookup_ItemType:249 | [`Flt05_ItemType.java:30`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.selectUseCount`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt05_ItemType.update` | Flt05_Lookup_ItemType:233 | [`Flt05_ItemType.java:71`](../../flt/services/Flt05_ItemType.md) | `UpdateDataModel(flt05_item_type)` 동적 INSERT/UPDATE → [`flt05_item_type.selectById`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt08_BuyLockup.delete` | Flt08_Lookup_LockupItem:283 | [`Flt08_BuyLockup.java:81`](../../flt/services/Flt08_BuyLockup.md) | `UpdateDataModel(flt08_buy_lockup)` 동적 DELETE |
| `flt.Flt08_BuyLockup.selectByText` | Flt08_Lookup_LockupItem:233 | [`Flt08_BuyLockup.java:25`](../../flt/services/Flt08_BuyLockup.md) | [`flt08_buy_lockup.selectByText`](../../flt/sql/flt08_buy_lockup.md) |
| `flt.Flt08_BuyLockup.update` | Flt08_Lookup_LockupItem:272 | [`Flt08_BuyLockup.java:76`](../../flt/services/Flt08_BuyLockup.md) | `UpdateDataModel(flt08_buy_lockup)` 동적 INSERT/UPDATE → [`flt08_buy_lockup.selectById`](../../flt/sql/flt08_buy_lockup.md) |

## 테이블

[`com50_item`](../../../db/tables/com.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt08_buy_lockup`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt12_book_month`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt01_Tab_CompanyStd (`client/vi/flt/Flt01_Tab_CompanyStd.java`, 269줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {copyButton} {updateButton} {deleteButton} {itemTypeButton} {lockupItemButton}
- 입력·하위 화면: `lookupItemType` Flt05_Lookup_ItemType, `lookupLockupItem` Flt08_Lookup_LockupItem, `investAmtCalcTargetComboBox` ComboBoxField("FloorTrInvestCalcTargetCode"), `stdDateTypeComboBox` ComboBoxField("FloorTrStdDateType"), `lookupLockup` Flt01_Lookup_LockUpCheckType
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - startDate 90 "적용<br>시작일자" Date 편집:MyDateField
  - totalInvestAmt 110 "총누적<br>투자금액(원)" Long 편집:LongField
  - investAmtCalcTargetName 100 "투자금액<br>계산기준" TextCenter 편집:investAmtCalcTarget…
  - investAmtOverCheckYn 80 "투자금액<br>매수제한" Boolean
  - investLimitUnvisibleYn 80 "투자한도<br>표시제한" Boolean
  - turnoverRate 110 "월간<br>매매회전율(%)" Long 편집:LongField
  - apprOverRate 110 "사전승인금액<br>초과비율(%)" Long 편집:LongField
  - apprQtyOverRate 110 "사전승인수량<br>초과비율(%)" Long 편집:LongField
  - apprValidDays 100 "사전승인<br>유효기간<br>(영업일기준)" Long 편집:LongField
  - stdDateTypeName 100 "매매유효일<br>계산기준" TextCenter 편집:stdDateTypeComboBox
  - fundHoldStkYn 100 "펀드(일임)<br>보유주식<br>매수제한" Boolean
  - lockUpDetailName 280 "의무보유기간 위반 체크 방식" Text
  - actionCell 40 "" Cell 편집:lockUpCell
  - rptStartDate 100 "매매등록<br>시작일자" Date 편집:MyDateField
  - trFileEvidYn 100 "정기보고시<br>거래없어도<br>거래증빙필수" Boolean
  - noAccountSkipYn 100 "계좌미존재시<br>정기보고<br>안함" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L55-124) → retrieve()
[E1] retrieveButton[조회].Select (L58) → retrieve()
[E2] insertButton[등록].Select (L64) → insertRow()
[E3] copyButton[등록(복사)].Select (L70) → copyInsertRow()
[E4] updateButton[저장].Select (L76) → update()
[E5] deleteButton[삭제].Select (L82) → deleteRow()
       └ [E10] msgBox.DialogHide [YES] (L246) → delete()
[E6] itemTypeButton[종목유형설정].Select (L88) → 인라인 L88-94 (new SelectHandler() { @Override publi…)
[E7] lockupItemButton[매수제한종목].Select (L95) → 인라인 L95-101 (new SelectHandler() { @Override publi…)
[E8] investAmtCalcTargetComboBox[FloorTrInvestCalcTargetCode].Collapse (L131) → 인라인 L131-137 (new CollapseHandler() { @Override pub…)
[E9] stdDateTypeComboBox[FloorTrStdDateType].Collapse (L140) → 인라인 L140-146 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L188-198 | 생성자,E1 | 서비스 flt.Flt01_CompanyStd.selectByCompanyId(companyId) | 업무 |
| public update() | L201-204 | E4 | 서비스 flt.Flt01_CompanyStd.update | 업무 |
| public insertRow() | L207-221 | E2 | 상태 처리 | 업무 |
| private copyInsertRow() | L223-240 | E3 | 미선택 시 alert "복사할 대상을 선택하세요" | 업무 |
| public deleteRow() | L243-261 | E5 | ConfirmBox → E10 | 업무 |
| private delete() | L263-267 | E10 | GridDeleteData flt.Flt01_CompanyStd.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L126-185 | 필드 초기화 | 조회창 Flt01_Lookup_LockUpCheckType 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 90, '적용<br>시작일자', { editor: 'date' }),  // L167
  gb.long('totalInvestAmt', 110, '총누적<br>투자금액(원)', { editor: 'number' }),  // L168
  gb.textCenter('investAmtCalcTargetNm', 100, '투자금액<br>계산기준', { editor: 'select' }),  // L169 SQL 계산 컬럼(selectByCompanyId: f_cdnm('FloorTrInvestCalcTargetCode', f…)
  gb.boolean('investAmtOverCheckYn', 80, '투자금액<br>매수제한'),  // L170
  gb.boolean('investLimitUnvisibleYn', 80, '투자한도<br>표시제한'),  // L171
  gb.long('turnoverRate', 110, '월간<br>매매회전율(%)', { editor: 'number' }),  // L172
  gb.long('apprOverRate', 110, '사전승인금액<br>초과비율(%)', { editor: 'number' }),  // L173
  gb.long('apprQtyOverRate', 110, '사전승인수량<br>초과비율(%)', { editor: 'number' }),  // L174
  gb.long('apprValidDays', 100, '사전승인<br>유효기간<br>(영업일기준)', { editor: 'number' }),  // L175
  gb.textCenter('stdDateTypeNm', 100, '매매유효일<br>계산기준', { editor: 'select' }),  // L176 SQL 계산 컬럼(selectByCompanyId: f_cdnm('FloorTrStdDateType' , flt01_std…)
  gb.boolean('fundHoldStkYn', 100, '펀드(일임)<br>보유주식<br>매수제한'),  // L177
  gb.text('lockUpDetailNm', 280, '의무보유기간 위반 체크 방식'),  // L178 SQL 계산 컬럼(selectByCompanyId: CASE WHEN COALESCE(flt01_lock_up_cd,'1'…)
  // ⚠ 대응 없음 (GridBuilder L179) addCell
  gb.date('rptStartDate', 100, '매매등록<br>시작일자', { editor: 'date' }),  // L180
  gb.boolean('trFileEvidYn', 100, '정기보고시<br>거래없어도<br>거래증빙필수'),  // L181
  gb.boolean('noAccountSkipYn', 100, '계좌미존재시<br>정기보고<br>안함'),  // L182
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteRow}>삭제</Button>
6. <Button type="group" onClick={() => /* 인라인 L88-94 (new SelectHandler() { @Override publi…) */}>종목유형설정</Button>
7. <Button type="assign" onClick={() => /* 인라인 L95-101 (new SelectHandler() { @Override publi…) */}>매수제한종목</Button>

### Flt08_Lookup_LockupItem (`client/vi/flt/Flt08_Lookup_LockupItem.java`, 294줄)

- 툴바 `buttonBar`: 제한구분: {lockupTypeCombo} 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lockupTypeCombo` ComboBoxField("BuyLockupType", "%", "전체", "전체"), `searchText` TextField 빈칸="종목코드/종목명", `lookupItemInfo` LookupTriggerField, `comboLockupType` ComboBoxField("BuyLockupType"), `lookup` Com50_Lookup_StkItem
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemCode 120 "종목코드" TextCenter 편집:lookupItemInfo
  - itemName 350 "종목명" Text
  - startDate 120 "제한시작일" Date 편집:MyDateField
  - closeDate 120 "제한종료일" Date 편집:MyDateField
  - lockupTypeName 120 "제한구분" TextCenter 편집:comboLockupType

#### 이벤트
[E1] lockupTypeCombo[BuyLockupType].Collapse (L110) → retrieve()
[E2] searchText.KeyPress [Enter] (L119) → retrieve()
[E3] retrieveButton[조회].Select (L127) → retrieve()
[E4] insertButton[등록].Select (L133) → insertRow()
[E5] updateButton[저장].Select (L139) → update()
[E6] deleteButton[삭제].Select [YES] (L145) → delete()
[E7] msgBox.DialogHide [YES] (L154) → delete()
[E8] cancelButton[닫기].Select (L171) → hide()
[E9] lookupItemInfo.TriggerClick (L183) → lookupItem()
[E10] comboLockupType[BuyLockupType].Collapse (L191) → 인라인 L191-197 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L66-69 | lookupItem,retrieve,insertRow,update | 상태 처리 | 업무 |
| public open() | L74-106 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupItem() | L211-223 | E9,insertRow | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| private retrieve() | L225-239 | E1,E2,E3,execute | 서비스 flt.Flt08_BuyLockup.selectByText(companyId, lockupType, searchText) | 업무 |
| private insertRow() | L241-254 | E4 | 상태 처리 | 업무 |
| private update() | L256-278 | E5 | 서비스 flt.Flt08_BuyLockup.update | 업무 |
| private delete() | L280-284 | E6,E7 | GridDeleteData flt.Flt08_BuyLockup.delete(체크된 행 목록) | 업무 |
| private settings() | L108-177 | open | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L179-209 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L286-288 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L290-292 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemCd', 120, '종목코드'),  // L202
  gb.text('itemNm', 350, '종목명'),  // L203 SQL 계산 컬럼(selectByText: com50_item_nm)
  gb.date('startDate', 120, '제한시작일', { editor: 'date' }),  // L204
  gb.date('closeDate', 120, '제한종료일', { editor: 'date' }),  // L205
  gb.textCenter('lockupTypeNm', 120, '제한구분'),  // L206 SQL 계산 컬럼(selectByText: f_cdnm('BuyLockupType', flt08_lockup_ty…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt05_Lookup_ItemType (`client/vi/flt/Flt05_Lookup_ItemType.java`, 279줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - itemTypeCode 80 "유형코드" TextCenter 편집:TextField
  - itemTypeName 250 "유형명" Text 편집:TextField
  - seq 80 "조회순서" LongCenter 편집:LongField
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - targetYn 100 "신고대상여부" Boolean
  - sellPreApprYn 100 "매도사전승인" Boolean
  - lockUpCheckYn 100 "의무보유기간<br>체크여부" Boolean
  - stkPriceYn 100 "주식시세적용" Boolean
  - listStkYn 100 "상장지분증권" Boolean

#### 이벤트
[E1] searchText.KeyPress [Enter] (L98) → retrieve()
[E2] retrieveButton[조회].Select (L106) → retrieve()
[E3] insertButton[등록].Select (L112) → insertRow()
[E4] updateButton[저장].Select (L118) → update()
[E5] deleteButton[삭제].Select [YES] (L124) → delete()
[E6] msgBox.DialogHide [YES] (L133) → delete()
[E7] cancelButton[닫기].Select (L150) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-94 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L177-189 | E1,E2,open | 서비스 flt.Flt05_ItemType.selectBySearchText(companyId, searchText) | 업무 |
| private insertRow() | L191-199 | E3 | 상태 처리 | 업무 |
| private update() | L201-239 | E4 | 서비스 flt.Flt05_ItemType.update | 업무 |
| private delete() | L241-269 | E5,E6 | GridDeleteData flt.Flt05_ItemType.selectUseCount, flt.Flt05_ItemType.delete(체크된 행 목록) | 업무 |
| private settings() | L96-156 | open | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L158-175 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L271-273 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L275-277 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeCd', 80, '유형코드', { editor: 'text' }),  // L165
  gb.text('itemTypeNm', 250, '유형명', { editor: 'text' }),  // L166
  gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L167
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L168
  gb.boolean('targetYn', 100, '신고대상여부'),  // L169
  gb.boolean('sellPreApprYn', 100, '매도사전승인'),  // L170
  gb.boolean('lockUpCheckYn', 100, '의무보유기간<br>체크여부'),  // L171
  gb.boolean('stkPriceYn', 100, '주식시세적용'),  // L172
  gb.boolean('listStkYn', 100, '상장지분증권'),  // L173
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt01_Lookup_LockUpCheckType (`client/vi/flt/Flt01_Lookup_LockUpCheckType.java`, 224줄)

- 입력·하위 화면: `lockUpCode` TextField, `lockUpName` ComboBoxField("FloorTrLockUpCheckCode"), `checkBox1` CheckBox, `lockUpDays` LongField, `lockUpCalcStdCode` TextField, `lockUpCalcStdName` ComboBoxField("FloorTrLockUpCalcStdCode"), `buyOprDayYn` CheckBox, `buyOprMonthYn` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L62-74) → getEditor(), show()
[E1] lockUpName[체크방식].Collapse (L89) → setCheckBox()
[E2] updateButton[저장].Select (L107) → update()
[E3] closeButton[닫기].Select (L113) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L76-85 | 공개 메서드 | 상태 처리 | 업무 |
| private setCheckBox() | L121-146 | E1,open,settings | 상태 처리 | 업무 |
| private getEditor() | L148-178 | 생성자 | 상태 처리 | 업무 |
| private update() | L180-211 | E2 | 서비스 flt.Flt01_CompanyStd.updateOne(stdModel) | 업무 |
| private settings() | L87-119 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L213-215 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L217-219 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L221-223 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

