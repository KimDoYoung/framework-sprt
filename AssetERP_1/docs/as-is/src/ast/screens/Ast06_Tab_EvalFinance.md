# Ast06_Tab_EvalFinance

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 금융상품 평가처리 (#1167)
- 파일: `client/vi/ast/Ast06_Tab_EvalFinance.java`
- 함께 쓰는 클래스 4개:
  - `Ast25_Lookup_Price` `client/vi/ast/Ast25_Lookup_Price.java`
  - `Ast06_TabPage_MarketEval` `client/vi/ast/Ast06_TabPage_MarketEval.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
  - `Ast06_TabPage_InterestEval` `client/vi/ast/Ast06_TabPage_InterestEval.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Tab_EvalFinance:493 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.selectEvalList` | Ast06_TabPage_InterestEval:102, Ast06_TabPage_MarketEval:105 | [`Ast06_Tr.java:121`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectEvalList`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateEval` | Ast06_Tab_EvalFinance:422, Ast06_Tab_EvalFinance:468 | [`Ast06_Tr.java:920`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByOrgTrId`](../../act/sql/act02_journal.md), [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createBackJournal`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`act02_journal.deleteBackJournal`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteBackJournal`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast06_tr.selectBackJournal`](../../ast/sql/ast06_tr.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast09_book.deleteBookCloseByAstId`](../../ast/sql/ast09_book.md), [`ast09_book.insertBookClose`](../../ast/sql/ast09_book.md), [`dbConfig.getLastDay`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast08_tr_finance)` 동적 INSERT/UPDATE → [`ast08_tr_finance.selectById`](../../ast/sql/ast08_tr_finance.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast25_Price.insert` | Ast25_Lookup_Price:190 | [`Ast25_Price.java:75`](../../ast/services/Ast25_Price.md) | [`ast25_price.selectByItemCode`](../../ast/sql/ast25_price.md), [`ast25_price.upsert`](../../ast/sql/ast25_price.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast25_Price.selectHoldItem` | Ast25_Lookup_Price:174 | [`Ast25_Price.java:32`](../../ast/services/Ast25_Price.md) | [`ast25_price.selectHoldItem`](../../ast/sql/ast25_price.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Ast25_Lookup_Price:93 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys12_Calendar.selectBizDate2` | Ast06_Tab_EvalFinance:510, Ast06_Tab_EvalFinance:544 | [`Sys12_Calendar.java:66`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.bizDate2`](../../sys/sql/sys12_calendar.md) |
| `sys.Sys99_Print.insertRdEvalFinance` | Ast06_Tab_EvalFinance:333 | [`Sys99_Print.java:1804`](../../sys/services/Sys99_Print.md) | [`ast06_tr.selectEvalList`](../../ast/sql/ast06_tr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast25_price`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_back_journal`, `f_create_financebook`, `f_create_journal`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_close_date`, `f_get_account_nm`, `f_get_biz_date2`, `f_get_datediff`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_last_day`, `f_get_price`, `f_get_relate_dcr_count`, `f_nvl`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_EvalFinance (`client/vi/ast/Ast06_Tab_EvalFinance.java`, 585줄)

- 레이아웃: north=vlcHeader, center=tabPanel
- 툴바 `buttonBarHeader01`: 평가일자: {evalDate} 평가년월: {yyyyMM} 보관처: {corpName} 보관계좌: {corpAccountName} {retrieveButton} {updateButton} {deleteButton} {priceButton}
- 툴바 `buttonBarHeader02`: 종목: {classTreeName} 검색: {searchText} {downLoadButton} {notice}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `searchText` TextField 빈칸="계좌/종목유형/종목/적요", `evalDate` MyDateField, `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `lookupCorpCode` Sys15_Lookup_Corp, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupInfo` Ast01_Lookup_Info, `marketEvalTabPage` Ast06_TabPage_MarketEval, `intEvalTabPage` Ast06_TabPage_InterestEval, `lookupPrice` Ast25_Lookup_Price

#### 이벤트
[E0] 화면 열림 (생성자 L84-106) → setting()
[E1] yyyyMM.KeyPress [Enter] (L116) → retrieve()
[E2] corpName.TriggerClick [result != null] (L131) → 인라인 L131-149 (new TriggerClickHandler() { @Override…)
[E3] corpAccountName.TriggerClick [result != null] (L154) → getCloseDate()
[E4] classTreeName.TriggerClick [result != null] (L177) → 인라인 L177-195 (new TriggerClickHandler(){ @Override …)
[E5] searchText.KeyPress [Enter] (L199) → retrieve()
[E6] tabPanel.Selection (L247) → retrieve()
[E7] retrieveButton[조회].Select (L254) → retrieve()
[E8] updateButton[평가처리].Select [YES] (L260) → getGrid(), update()
[E9] msgBox.DialogHide [YES] (L272) → update()
[E10] deleteButton[평가취소].Select [YES] (L289) → getGrid(), delete()
[E11] msgBox.DialogHide [YES] (L301) → delete()
[E12] priceButton[시세입력].Select (L318) → lookupEvalPrice()
[E13] downLoadButton[출력/다운로드].Select (L324) → getGrid(), getCloseDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L108-370 | 생성자 | 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast01_Lookup_CorpAccount 열기, 조회창 Ast01_Lookup_Info 열기, 확인창 표시, 서비스 sys.Sys99_Print.insertRdEvalFinance(companyId, personId, windowClassName, assetType, closeDate, corpId, accountId, classTreeId, searchText, evalType) | 업무 |
| public retrieve() | L372-383 | E1,E5,E6,E7,delete | 선택 회사로 탭페이지 retrieve | 업무 |
| private update() | L385-448 | E8,E9 | 미선택 시 alert "평가일이 미래일입니다.", 서비스 ast.Ast06_Tr.updateEval(companyId, personId, procType) | 업무 |
| private delete() | L450-490 | E10,E11 | 서비스 ast.Ast06_Tr.updateEval(companyId, personId, procType) | 업무 |
| private checkClose() | L492-507 | update,delete | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private lookupEvalPrice() | L509-529 | E12 | 조회창 Ast25_Lookup_Price 열기, 서비스 sys.Sys12_Calendar.selectBizDate2(companyId, stdDate, type, chkYn) | 업무 |
| private getCloseDate() | L531-541 | E3,E13,retrieve,lookupEvalPrice | 서비스 yyyy.MM.dd | 업무 |
| private setEvalDate() | L543-562 | setting | 서비스 sys.Sys12_Calendar.selectBizDate2(companyId, stdDate, type, chkYn) | 업무 |
| private getGrid() | L564-572 | E8,E10,E13 | 선택 회사로 탭페이지 retrieve | 업무 |
| private setHtmlBarStyle() | L574-576 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L578-580 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L582-584 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={() => /* getGrid(), update() */}>평가처리</Button>
3. <Button type="cancel" onClick={() => /* getGrid(), delete() */}>평가취소</Button>
4. <Button type="download" onClick={() => /* getGrid(), getCloseDate() */}>출력/다운로드</Button>
5. <Button type="register" onClick={lookupEvalPrice}>시세입력</Button>

### Ast25_Lookup_Price (`client/vi/ast/Ast25_Lookup_Price.java`, 210줄)

- 툴바 `buttonBar`: 기준일자: {stdDate} 종목유형: {itemTypeComboBox} 검색: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="종목코드/종목명", `itemTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid()):
  - itemTypeName 150 "종목유형" TextCenter
  - itemCode 120 "종목코드" TextCenter
  - itemName 350 "종목명" Text
  - evalPrice 150 "평가단가" Double 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L65-82) → show()
[E1] itemTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L102) → retrieve()
[E2] cancleButton[닫기].Select (L109) → hide()
[E3] retrieveButton[조회].Select (L115) → retrieve()
[E4] updateButton[저장].Select (L121) → update()
[E5] searchText.KeyPress [Enter] (L130) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L84-150 | open | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| public retrieve() | L164-180 | E1,E3,E5,setting,update | 서비스 ast.Ast25_Price.selectHoldItem(companyId, holdDate, abroType, itemType, searchText) | 업무 |
| private update() | L182-200 | E4 | 서비스 ast.Ast25_Price.insert | 업무 |
| public buildGrid() | L152-162 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L206-208 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeNm', 150, '종목유형'),  // L156 SQL 계산 컬럼(selectHoldItem: f_cdnm('ItemMClassCode', ast01_item_m_c…)
  gb.textCenter('itemCd', 120, '종목코드'),  // L157
  gb.text('itemNm', 350, '종목명'),  // L158
  gb.double('evalPrice', 150, '평가단가', { editor: 'number' }),  // L159
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_TabPage_MarketEval (`client/vi/ast/Ast06_TabPage_MarketEval.java`, 121줄)

- 레이아웃: center=grid, south=gridJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - evalYnName 80 "평가여부" TextCenter
  - evalTypeName 80 "평가구분" TextCenter
  - date 90 "평가일자" Date
  - corpAccountName 200 "계좌" Text
  - astClassName 150 "종목유형" Text
  - classTreeName 250 "종목" Text
  - qty 100 "보유수량" Double
  - financeBookAmt 120 "보유금액" Long
  - price 100 "평가단가" Double
  - amt 120 "평가금액" Long 편집:"456EA6"
  - pl 100 "평가손익" Long
  - holdPeriod 120 "보유기간" TextRight
  - note 150 "적요" Text 편집:"456EA6"
  - personName 80 "처리자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L29-41) → setting()
[E1] grid.RowClick (L44) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L43-50 | 생성자 | 상태 처리 | 업무 |
| private retrievePage() | L80-83 | E1,retrieve | 상태 처리 | 업무 |
| public getGrid() | L85-89 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L92-115 | 공개 메서드 | 서비스 ast.Ast06_Tr.selectEvalList(companyId, assetType, closeDate, corpId, accountId, classTreeId, searchText, evalType), 건수 표시 | 업무 |
| public init() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L52-78 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('evalYnNm', 80, '평가여부'),  // L57
  gb.textCenter('evalTypeNm', 80, '평가구분'),  // L58
  gb.date('date', 90, '평가일자'),  // L59
  gb.text('corpAccountNm', 200, '계좌'),  // L60
  gb.text('astClassNm', 150, '종목유형'),  // L61
  gb.text('classTreeNm', 250, '종목'),  // L62
  gb.double('qty', 100, '보유수량'),  // L63
  gb.long('bookAmt', 120, '보유금액'),  // L64
  gb.double('price', 100, '평가단가'),  // L65
  gb.long('amt', 120, '평가금액', { editor: 'number' }),  // L66
  gb.long('pl', 100, '평가손익'),  // L67
  gb.textRight('holdPeriod', 120, '보유기간'),  // L68
  gb.text('note', 150, '적요', { editor: 'text' }),  // L69
  gb.textCenter('personNm', 80, '처리자'),  // L70
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Ast06_Grid_Journal (`client/vi/ast/Ast06_Grid_Journal.java`, 143줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {modiButton}
- 입력·하위 화면: `lookupModiJournal` Act02_Lookup_ModiJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - trName 120 "거래유형" TextArea
  - drAccountCode 100 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 300 "계정과목" TextArea2 편집:"456EA6"
  - drAmt 100 "금액" Long 편집:"456EA6"
  - drNote 200 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 100 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 300 "계정과목" TextArea2 편집:"DD5E5E"
  - crAmt 100 "금액" Long 편집:"DD5E5E"
  - crNote 200 "적요" TextArea2 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L41-58) → settings()
[E1] modiButton[변경].Select (L61) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L101-105 | E1 | 상태 처리 | 업무 |
| public gridClear() | L107-109 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L112-125 | E1 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public update() | L128-129 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L132-133 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L136-137 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L60-73 | 생성자 | 조회창 Act02_Lookup_ModiJournal 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L75-99 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L139-142 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L80 newHeaderGroupMap03newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map03new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L81 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map06new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textArea('trNm', 120, '거래유형'),  // L84
  gb.textCenter('drAccountCd', 100, '계정코드'),  // L85
  // ⚠ 대응 없음 (GridBuilder L86) addTextArea2
  gb.long('drAmt', 100, '금액'),  // L87
  // ⚠ 대응 없음 (GridBuilder L88) addTextArea2
  gb.textCenter('crAccountCd', 100, '계정코드'),  // L89
  // ⚠ 대응 없음 (GridBuilder L90) addTextArea2
  gb.long('crAmt', 100, '금액'),  // L91
  // ⚠ 대응 없음 (GridBuilder L92) addTextArea2
];
```

#### 사용된 버튼들
1. <Button type="change" onClick={retrieve}>변경</Button>

### Ast06_TabPage_InterestEval (`client/vi/ast/Ast06_TabPage_InterestEval.java`, 118줄)

- 레이아웃: center=grid, south=gridJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - evalYnName 80 "평가여부" TextCenter
  - date 90 "평가일자" Date
  - corpAccountName 200 "계좌" Text
  - astClassName 150 "종목유형" Text
  - classTreeName 250 "종목" Text
  - qty 100 "보유수량" Double
  - financeBookAmt 120 "보유금액" Long
  - amt 120 "이자금액" Long 편집:"456EA6"
  - holdPeriod 120 "보유기간" TextRight
  - note 150 "적요" Text 편집:"456EA6"
  - personName 80 "처리자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L29-41) → setting()
[E1] grid.RowClick (L44) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L43-50 | 생성자 | 상태 처리 | 업무 |
| private retrievePage() | L77-80 | E1,retrieve | 상태 처리 | 업무 |
| public getGrid() | L82-86 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L89-112 | 공개 메서드 | 서비스 ast.Ast06_Tr.selectEvalList(companyId, assetType, closeDate, corpId, accountId, classTreeId, searchText, evalType), 건수 표시 | 업무 |
| public init() | L115-117 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L52-75 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('evalYnNm', 80, '평가여부'),  // L57
  gb.date('date', 90, '평가일자'),  // L58
  gb.text('corpAccountNm', 200, '계좌'),  // L59
  gb.text('astClassNm', 150, '종목유형'),  // L60
  gb.text('classTreeNm', 250, '종목'),  // L61
  gb.double('qty', 100, '보유수량'),  // L62
  gb.long('bookAmt', 120, '보유금액'),  // L63
  gb.long('amt', 120, '이자금액', { editor: 'number' }),  // L64
  gb.textRight('holdPeriod', 120, '보유기간'),  // L65
  gb.text('note', 150, '적요', { editor: 'text' }),  // L66
  gb.textCenter('personNm', 80, '처리자'),  // L67
];
```

#### 사용된 버튼들
버튼 사용하지 않음

