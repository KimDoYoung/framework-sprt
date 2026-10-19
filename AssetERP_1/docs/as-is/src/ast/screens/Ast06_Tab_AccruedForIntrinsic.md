# Ast06_Tab_AccruedForIntrinsic

- 종류: 화면
- 메뉴: 관리회계 > 12. 특수회계처리(외화) > 미수/미지급(외화) (#1173)
- 파일: `client/vi/ast/Ast06_Tab_AccruedForIntrinsic.java`
- 함께 쓰는 클래스 3개:
  - `Ast07_Lookup_ForSettle` `client/vi/ast/Ast07_Lookup_ForSettle.java`
  - `Ast07_Grid_ForHistory` `client/vi/ast/Ast07_Grid_ForHistory.java`
  - `Ast05_Lookup_TrCodeWindow` `client/vi/ast/Ast05_Lookup_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiForJournal`](../../act/components/Act02_Lookup_ModiForJournal.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast07_Grid_ForHistory:245, Ast07_Lookup_ForSettle:292 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast05_TrCode.selectByWindowClassName` | Ast05_Lookup_TrCodeWindow:180 | [`Ast05_TrCode.java:43`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByWindowClassName`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast06_Tr.selectByAccrued` | Ast06_Tab_AccruedForIntrinsic:255 | [`Ast06_Tr.java:174`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByAccrued`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.selectById` | Ast07_Lookup_ForSettle:99 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast07_Grid_ForHistory:294, Ast07_Lookup_ForSettle:336 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.delete` | Ast07_Grid_ForHistory:259 | [`Ast07_Settle.java:350`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 DELETE |
| `ast.Ast07_Settle.selectByHistoryPaging` | Ast07_Grid_ForHistory:96 | [`Ast07_Settle.java:44`](../../ast/services/Ast07_Settle.md) | [`ast07_settle.selectByHistory`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectByHistoryPaing`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectByHistoryPaingTotal`](../../ast/sql/ast07_settle.md) |
| `ast.Ast07_Settle.update` | Ast07_Lookup_ForSettle:310 | [`Ast07_Settle.java:169`](../../ast/services/Ast07_Settle.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast07_settle.selectAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md), [`ast07_settle.sumForAmt`](../../ast/sql/ast07_settle.md), [`ast07_settle.updateAmt`](../../ast/sql/ast07_settle.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), `UpdateDataModel(ast07_settle)` 동적 INSERT/UPDATE → [`ast07_settle.selectById`](../../ast/sql/ast07_settle.md) |
| `sys.Sys00_Common.selectForDeposit` | Ast07_Lookup_ForSettle:180 | [`Sys00_Common.java:91`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectForDeposit`](../../sys/sql/sys00_common.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depositbook`, `f_create_journal`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_AccruedForIntrinsic (`client/vi/ast/Ast06_Tab_AccruedForIntrinsic.java`, 284줄)

- 레이아웃: center=vlc, south=gridSettle
- 툴바 `buttonBar01`: 수령/지급: {payName} 거래유형: {trName} 거래처: {corpName} 검색: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `payName` ComboBoxField("RcvPayCode", "%", "전체"), `trCode` TextField, `trName` LookupTriggerField 빈칸="전체", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/종목/적요/통화", `lookupTrCode` Ast05_Lookup_TrCodeWindow, `lookupCorpCode` Sys15_Lookup_Corp, `lookupSettle` Ast07_Lookup_ForSettle
- 그리드 `grid` (buildGrid(), 체크박스):
  - date 100 "일자" Date
  - trName 200 "거래유형" Text
  - corpName 200 "거래처" Text
  - note 450 "종목/거래적요" Text
  - curCode 80 "통화" TextCenter
  - forAmt 150 "외화 거래금액" Double
  - accruedAmt 150 "외화 미수/미지급" Double 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L60-93) → setting(), retrieve()
[E1] trName.TriggerClick [result != null] (L104) → 인라인 L104-122 (new TriggerClickHandler(){ @Override …)
[E2] corpName.TriggerClick [result != null] (L127) → 인라인 L127-145 (new TriggerClickHandler() { @Override…)
[E3] searchText.KeyPress [Enter] (L172) → retrieve()
[E4] retrieveButton[조회].Select (L181) → retrieve()
[E5] updateButton[결제등록].Select (L187) → insert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L95-209 | 생성자 | 조회창 Ast05_Lookup_TrCodeWindow 열기, 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| public retrieve() | L227-261 | 생성자,E3,E4,insert | 서비스 ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType, abroType, searchText, trCode, payCode, payCode, classTreeId, corpId, corpId) | 업무 |
| private insert() | L263-279 | E5 | 조회창 Ast07_Lookup_ForSettle 열기, 미선택 시 alert "결제건을 선택해주세요." | 업무 |
| public buildGrid() | L211-225 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L281-283 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L216
  gb.text('trNm', 200, '거래유형'),  // L217
  gb.text('corpNm', 200, '거래처'),  // L218
  gb.text('note', 450, '종목/거래적요'),  // L219
  gb.textCenter('curCd', 80, '통화'),  // L220
  gb.double('forAmt', 150, '외화 거래금액'),  // L221
  gb.double('accruedAmt', 150, '외화 미수/미지급'),  // L222
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>결제등록</Button>

### Ast07_Lookup_ForSettle (`client/vi/ast/Ast07_Lookup_ForSettle.java`, 356줄)

- 입력·하위 화면: `settleDate` MyDateField, `trCode` TextField, `depositId` LongField, `fxRate` DoubleField, `forSettleAmt` DoubleField, `settleAmt` LongField, `forAmt` DoubleField, `note` TextField, `depositName` CommonComboBoxField("sys.Sys00_Common.selectForDeposit")

#### 이벤트
[E0] 화면 열림 (생성자 L74-94) → buildGrid(), setting(), getEditor(), show()
[E1] forAmt[외화 미수/미지급금액].ValueChange (L158) → setSettleAmt()
[E2] forSettleAmt[외화 결제금액].ValueChange (L165) → setSettleAmt()
[E3] fxRate[적용환율].ValueChange (L171) → setSettleAmt()
[E4] depositName[예금계좌].Collapse (L181) → 인라인 L181-186 (new CollapseHandler() { @Override pub…)
[E5] updateButton[저장].Select (L188) → preUpdate()
[E6] closeButton[닫기].Select ["NEW".equals(actionName)] (L194) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L96-135 | 공개 메서드 | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| public open() | L137-150 | openNew | 상태 처리 | 업무 |
| private setting() | L152-206 | 생성자 | 서비스 sys.Sys00_Common.selectForDeposit | 업무 |
| private getEditor() | L214-253 | 생성자 | 상태 처리 | 업무 |
| private setSettleAmt() | L255-261 | E1,E2,E3 | 상태 처리 | 업무 |
| public preUpdate() | L263-307 | E5 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L309-332 | preUpdate | 서비스 ast.Ast07_Settle.update | 업무 |
| private updateDepositBook() | L334-346 | update | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L208-212 | 생성자 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L348-350 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L352-354 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast07_Grid_ForHistory (`client/vi/ast/Ast07_Grid_ForHistory.java`, 310줄)

- 툴바 `buttonBar`: 실수령/지급 History :: {selectTypeTrue} {selectTypeFalse} {refreshButton} {deleteButton}
- 입력·하위 화면: `selectTypeTrue` Radio, `selectTypeFalse` Radio, `lookupModiJournal` Act02_Lookup_ModiForJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - settleDate 100 "일자" Date
  - trName 200 "거래유형" Text
  - corpName 200 "거래처" Text
  - note 400 "종목/거래적요" Text
  - curCode 60 "통화" TextCenter
  - forSettleAmt 120 "외화 결제금액" Double
  - settleAmt 150 "원화 결제금액" Long
  - actionCell 80 "전표변경" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L80-105) → setting()
[E1] selectTypeToggleGroup.ValueChange (L116) → retrieve()
[E2] refreshButton[새로고침].Select (L128) → retrieve()
[E3] deleteButton[취소].Select (L134) → deleteCheck()
       └ [E4] messageBox.DialogHide [YES] (L222) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L107-146 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L176-217 | E1,E2 | 상태 처리 | 업무 |
| private deleteCheck() | L219-231 | E3 | ConfirmBox → E4 | 업무 |
| private delete() | L233-290 | E4 | 미선택 시 alert "취소대상을 선택하여 주십시오.", GridDeleteData act.Act04_GenLedger.checkClose, ast.Ast07_Settle.delete(체크된 행 목록) | 업무 |
| private updateDepositBook() | L292-304 | delete | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| public buildGrid() | L148-174 | 필드 초기화 | 조회창 Act02_Lookup_ModiForJournal 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L306-308 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('settleDate', 100, '일자'),  // L164
  gb.text('trNm', 200, '거래유형'),  // L165 SQL 계산 컬럼(selectByHistory: ast05_tr_nm)
  gb.text('corpNm', 200, '거래처'),  // L166 SQL 계산 컬럼(selectByHistory: f_get_corp_nm(corp_id))
  gb.text('note', 400, '종목/거래적요'),  // L167
  gb.textCenter('curCd', 60, '통화'),  // L168 SQL 계산 컬럼(selectByHistory: cur_cd)
  gb.double('forSettleAmt', 120, '외화 결제금액'),  // L169
  gb.long('settleAmt', 150, '원화 결제금액'),  // L170
  // ⚠ 대응 없음 (GridBuilder L171) addCell
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="cancel" onClick={deleteCheck}>취소</Button>

### Ast05_Lookup_TrCodeWindow (`client/vi/ast/Ast05_Lookup_TrCodeWindow.java`, 196줄)

- 툴바 `buttonBar`: {label} {searchText} {rcvPayCodeCombo} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="거래코드/명", `rcvPayCodeCombo` ComboBoxField("RcvPayCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - trCode 80 "거래코드" TextCenter
  - trName 200 "거래명" Text
  - rcvPayName 100 "수령/지급" Text
  - note 150 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-79) → show()
[E1] grid.CellDoubleClick [callbackResult != null] (L82) → hide()
[E2] confirmButton[확인].Select [callbackResult != null] (L92) → hide()
[E3] selectAllButton[전체].Select (L102) → hide()
[E4] cancleButton[닫기].Select (L109) → hide()
[E5] retrieveButton[조회].Select (L115) → retrieve()
[E6] searchText.KeyPress [Enter] (L128) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-59 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L81-141 | open | 상태 처리 | 업무 |
| public retrieve() | L155-186 | E5,E6,open | 서비스 ast.Ast05_TrCode.selectByWindowClassName(companyId, searchText, rcvPayCode, windowClassName) | 업무 |
| public buildGrid() | L143-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L192-194 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('trCd', 80, '거래코드'),  // L147
  gb.text('trNm', 200, '거래명'),  // L148
  gb.text('rcvPayNm', 100, '수령/지급'),  // L149
  gb.text('note', 150, '비고'),  // L150
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

