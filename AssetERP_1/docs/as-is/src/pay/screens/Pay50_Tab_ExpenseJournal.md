# Pay50_Tab_ExpenseJournal

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 사업비 회계처리 (#1387)
- 파일: `client/vi/pay/Pay50_Tab_ExpenseJournal.java`
- 함께 쓰는 클래스 3개:
  - `Pay50_Lookup_ExpenseUnJournal` `client/vi/pay/Pay50_Lookup_ExpenseUnJournal.java`
  - `Pay52_Lookup_AccountCode` `client/vi/pay/Pay52_Lookup_AccountCode.java`
  - `Pay50_Lookup_UpdateAccount` `client/vi/pay/Pay50_Lookup_UpdateAccount.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Act02_Grid_CreateJournal`](../../act/components/Act02_Grid_CreateJournal.md), [`Act02_Lookup_CreateJournal`](../../act/components/Act02_Lookup_CreateJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.selectById` | Pay50_Tab_ExpenseJournal:317 | [`Act02_Journal.java:31`](../../act/services/Act02_Journal.md) | [`act02_journal.selectById`](../../act/sql/act02_journal.md) |
| `pay.Pay50_Expense.createJournal` | Pay50_Lookup_ExpenseUnJournal:351 | [`Pay50_Expense.java:544`](../../pay/services/Pay50_Expense.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.createJournal`](../../pay/sql/pay50_expense.md), [`pay50_expense.insertExpense`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.deleteJournal` | Pay50_Tab_ExpenseJournal:376 | [`Pay50_Expense.java:654`](../../pay/services/Pay50_Expense.md) | [`act02_journal.deleteByJournalId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByJournalId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByJournalId`](../../act/sql/act06_journal_tmp.md), [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`pay50_expense.deleteById`](../../pay/sql/pay50_expense.md), [`pay50_expense.initExpenseJournal`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectByJournalId`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectExpenseJournal` | Pay50_Tab_ExpenseJournal:345 | [`Pay50_Expense.java:127`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectExpenseJournal`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectNewExpenseAppr` | Pay50_Lookup_ExpenseUnJournal:258, Pay50_Tab_ExpenseJournal:267 | [`Pay50_Expense.java:85`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectNewExpenseAppr`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateAccountCode` | Pay50_Lookup_ExpenseUnJournal:268, Pay50_Lookup_UpdateAccount:127 | [`Pay50_Expense.java:394`](../../pay/services/Pay50_Expense.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.insertExpense`](../../pay/sql/pay50_expense.md), [`pay50_expense.selectById`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateAccountCode`](../../pay/sql/pay50_expense.md) |
| `pay.Pay52_FavoriteAccount.delete` | Pay52_Lookup_AccountCode:293 | [`Pay52_FavoriteAccount.java:57`](../../pay/services/Pay52_FavoriteAccount.md) | `UpdateDataModel(pay52_favorite_account)` 동적 DELETE |
| `pay.Pay52_FavoriteAccount.insert` | Pay52_Lookup_AccountCode:258 | [`Pay52_FavoriteAccount.java:30`](../../pay/services/Pay52_FavoriteAccount.md) | [`pay52_favorite_account.countByAccountCodeId`](../../pay/sql/pay52_favorite_account.md), [`pay52_favorite_account.insert`](../../pay/sql/pay52_favorite_account.md) |
| `pay.Pay52_FavoriteAccount.selectByCompanyId` | Pay52_Lookup_AccountCode:213 | [`Pay52_FavoriteAccount.java:24`](../../pay/services/Pay52_FavoriteAccount.md) | [`pay52_favorite_account.selectByCompanyId`](../../pay/sql/pay52_favorite_account.md) |
| `pay.Pay52_FavoriteAccount.update` | Pay52_Lookup_AccountCode:276 | [`Pay52_FavoriteAccount.java:52`](../../pay/services/Pay52_FavoriteAccount.md) | `UpdateDataModel(pay52_favorite_account)` 동적 INSERT/UPDATE → [`pay52_favorite_account.selectById`](../../pay/sql/pay52_favorite_account.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay50_Lookup_ExpenseUnJournal:122, Pay50_Tab_ExpenseJournal:169 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`crd01_card`](../../../db/tables/crd.md), [`emp14_account`](../../../db/tables/emp.md), [`emp17_benefit`](../../../db/tables/emp.md), [`emp50_transport_expense`](../../../db/tables/emp.md), [`emp51_relate_appr`](../../../db/tables/emp.md), [`emp52_relate_appr`](../../../db/tables/emp.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay50_expense`](../../../db/tables/pay.md), [`pay52_favorite_account`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_journalexpense`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_ExpenseJournal (`client/vi/pay/Pay50_Tab_ExpenseJournal.java`, 403줄)

- 레이아웃: center=vlc, south=journalGrid
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 구분: {expenseComboBox} 검색: {searchText} {retrieveButton} {deleteButton}
- 툴바 `buttonBar02`: {refresh} {msgHlc}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="구분/지출내역/지출처", `expenseComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `lookup` Pay50_Lookup_ExpenseUnJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - occDate 90 "발생일자" Date
  - expenseName 120 "구분" Text
  - desc 350 "지출내역" Text
  - corpName 150 "지출처" Text
  - amt 120 "공급가액" Long
  - tax 100 "세액" Long
  - settleAmt 120 "합계" Long
  - payMethodName 100 "지급구분" TextCenter
  - fileCountStr 60 "연관문서" TextCenter
  - actionCell 40 "" Cell 편집:viewCell
  - journalNo 100 "전표번호" TextCenter
  - actionCell 60 "전표수정" Cell 편집:editCell
  - journalFixYn 70 "전표승인" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L85-134) → settings()
[E1] refresh.MouseDown (L151) → setAnchorText()
[E2] hiperLink[<b>회계처리대상 확인 및 전표생성하기</b>].MouseDown (L158) → lookupUnJournal()
[E3] expenseComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L178) → retrieve()
[E4] searchText.KeyPress [Enter] (L187) → retrieve()
[E5] retrieveButton[조회].Select (L196) → retrieve()
[E6] deleteButton[삭제].Select (L202) → delete()
       └ [E8] msgBox.DialogHide [YES] (L369) → retrieve()
[E7] grid.SelectionChanged [선택>0] (L209) → retrieveJournal()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setAnchorText() | L259-287 | E1,settings,retrieve | 서비스 pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType, expenseCode, searchText) | 업무 |
| private lookupUnJournal() | L289-297 | E2 | 조회창 Pay50_Lookup_ExpenseUnJournal 열기 | 업무 |
| private viewAppr() | L299-312 | buildGrid | 조회창 Act80_Lookup_RelateAppr 열기 | 업무 |
| private modiJournal() | L314-333 | buildGrid | 조회창 Act02_Lookup_CreateJournal 열기, 서비스 act.Act02_Journal.selectById(journalId) | 업무 |
| private retrieve() | L335-357 | E3,E4,E5,E8,settings,lookupUnJournal,modiJournal | 서비스 pay.Pay50_Expense.selectExpenseJournal(companyId, startDate, closeDate, expenseCode, searchText) | 업무 |
| private retrieveJournal() | L359-364 | E7 | 상태 처리 | 업무 |
| private delete() | L366-398 | E6 | ConfirmBox → E8 | 업무 |
| private settings() | L136-217 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=start, closeDate=close | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L219-257 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L400-402 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 90, '발생일자'),  // L237
  gb.text('expenseNm', 120, '구분'),  // L238
  gb.text('desc', 350, '지출내역'),  // L239
  gb.text('corpNm', 150, '지출처'),  // L240
  gb.long('amt', 120, '공급가액'),  // L241
  gb.long('tax', 100, '세액'),  // L242
  gb.long('settleAmt', 120, '합계'),  // L243
  gb.textCenter('payMethodNm', 100, '지급구분'),  // L244
  gb.textCenter('fileCountStr', 60, '연관문서'),  // L245
  // ⚠ 대응 없음 (GridBuilder L246) addCell
  gb.textCenter('journalNo', 100, '전표번호'),  // L247
  // ⚠ 대응 없음 (GridBuilder L248) addCell
  gb.booleanYn2('journalFixYn', 70, '전표승인'),  // L249
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={delete}>삭제</Button>

### Pay50_Lookup_ExpenseUnJournal (`client/vi/pay/Pay50_Lookup_ExpenseUnJournal.java`, 384줄)

- 툴바 `buttonBar`: 구분: {expenseComboBox} 검색: {searchText} {retrieveButton} {updateButton} {selectUpdateButton} {oneJournalCheckBox} {createButton}
- 입력·하위 화면: `searchText` TextField 빈칸="구분/지출내역/지출처", `oneJournalCheckBox` CheckBox, `expenseComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `lookupAccount` LookupTriggerField, `lookup` Pay52_Lookup_AccountCode
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - occDate 100 "발생일자" Date
  - expenseName 100 "구분" Text
  - desc 400 "지출내역" TextArea
  - corpName 150 "지출처" Text
  - amt 100 "공급가액" Long
  - tax 100 "세액" Long
  - settleAmt 100 "합계" Long
  - accountName 150 "계정과목" Text 편집:"0069B4"

#### 이벤트
[E0] 화면 열림 (생성자 L73-81) → 초기화
[E1] expenseComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L131) → retrieve()
[E2] searchText.KeyPress [Enter] (L140) → retrieve()
[E3] retrieveButton[조회].Select (L152) → retrieve()
[E4] updateButton[저장].Select (L158) → updateAccount()
[E5] selectUpdateButton[일괄저장].Select (L164) → lookupAccountUpdate()
[E6] createButton[전표생성].Select (L170) → preCreateJournal()
[E7] cancelButton[닫기].Select (L176) → hide()
[E8] lookupAccount.TriggerClick (L188) → lookupAccount()
[E9] msgBox.DialogHide [YES] (L327) → createJournal()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L83-114 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupAccount() | L215-232 | E8 | 조회창 Pay52_Lookup_AccountCode 열기 | 업무 |
| private lookupAccountUpdate() | L234-247 | E5 | 조회창 Pay50_Lookup_UpdateAccount 열기 | 업무 |
| private retrieve() | L249-264 | E1,E2,E3,open,settings,lookupAccountUpdate,updateAccount,createJournal | 서비스 pay.Pay50_Expense.selectNewExpenseAppr(companyId, targetType, expenseCode, searchText) | 업무 |
| private updateAccount() | L266-275 | E4 | 서비스 pay.Pay50_Expense.updateAccountCode | 업무 |
| private preCreateJournal() | L277-343 | E6 | 확인창 표시 | 업무 |
| private createJournal() | L345-372 | E9 | 미선택 시 alert "전표가 생성되었습니다", 서비스 pay.Pay50_Expense.createJournal(oneJournalYn, personId) | 업무 |
| private settings() | L116-182 | open | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: oneJournalCheckBox=false("하나의 전표로 생성하기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L184-213 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L374-376 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L377-379 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L380-382 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 100, '발생일자'),  // L198
  gb.text('expenseNm', 100, '구분'),  // L199
  gb.textArea('desc', 400, '지출내역'),  // L200
  gb.text('corpNm', 150, '지출처'),  // L201
  gb.long('amt', 100, '공급가액'),  // L202
  gb.long('tax', 100, '세액'),  // L203
  gb.long('settleAmt', 100, '합계'),  // L204
  gb.text('accountNm', 150, '계정과목'),  // L205
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateAccount}>저장</Button>
3. <Button type="save" onClick={lookupAccountUpdate}>일괄저장</Button>
4. <Button type="register" onClick={preCreateJournal}>전표생성</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay52_Lookup_AccountCode (`client/vi/pay/Pay52_Lookup_AccountCode.java`, 311줄)

- 툴바 `buttonBar`: 계정속성: {attributeComboBox} 검색: {searchText} {allAccountCheckBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계정코드/계정과목", `allAccountCheckBox` CheckBox, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체", "전체"), `lookup` Act01_Lookup_AccountCode
- 그리드 `grid` (buildGrid(), 체크박스):
  - attributeName 80 "속성" TextCenter
  - accountCode 100 "계정코드" TextCenter
  - accountName 450 "계정과목" TextArea
  - seq 100 "조회순서" LongCenter 편집:LongField

#### 이벤트
[E1] grid.CellDoubleClick (L113) → confirm()
[E2] attributeComboBox[AccountAttributeCode].Collapse (L133) → retrieve()
[E3] searchText.KeyPress [Enter] (L145) → retrieve()
[E4] retrieveButton[조회].Select (L154) → retrieve()
[E5] insertButton[추가].Select (L160) → insertAccountCode()
[E6] deleteButton[제거].Select (L166) → deleteAccountCode()
       └ [E10] messageBox.DialogHide [YES] (L288) → 서비스 pay.Pay52_FavoriteAccount.delete
[E7] updateButton[저장].Select (L172) → update()
[E8] oKButton[확인].Select (L178) → confirm()
[E9] cancelButton[취소].Select (L184) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L74-121 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L205-229 | E2,E3,E4,settings,insertAccountCode,update | 서비스 pay.Pay52_FavoriteAccount.selectByCompanyId(companyId, attributeCode, searchText, allAccountYn), 건수 표시 | 업무 |
| public confirm() | L231-242 | E1,E8 | 미선택 시 alert "선택된 계정과목이 없습니다." | 업무 |
| private insertAccountCode() | L244-272 | E5 | 조회창 Act01_Lookup_AccountCode 열기, 서비스 pay.Pay52_FavoriteAccount.insert(companyId) | 업무 |
| private update() | L274-283 | E7 | 서비스 pay.Pay52_FavoriteAccount.update | 업무 |
| private deleteAccountCode() | L285-299 | E6 | ConfirmBox → E10 | 업무 |
| private settings() | L123-190 | open | 이벤트 연결, 초기값: allAccountCheckBox=false("모든 계정과목") | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L192-203 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L301-303 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L304-306 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L307-309 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('attributeNm', 80, '속성'),  // L197 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AccountAttributeCode', pay52_at…)
  gb.textCenter('accountCd', 100, '계정코드'),  // L198 SQL 계산 컬럼(selectByCompanyId: act01_account_cd)
  gb.textArea('accountNm', 450, '계정과목'),  // L199 SQL 계산 컬럼(selectByCompanyId: act01_account_nm)
  gb.longCenter('seq', 100, '조회순서', { editor: 'number' }),  // L200
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertAccountCode}>추가</Button>
3. <Button type="delete" onClick={deleteAccountCode}>제거</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="save" onClick={confirm}>확인</Button>
6. <Button type="cancel" onClick={hide}>취소</Button>

### Pay50_Lookup_UpdateAccount (`client/vi/pay/Pay50_Lookup_UpdateAccount.java`, 152줄)

- 입력·하위 화면: `accountCode` LookupTriggerField, `accountName` TextField, `lookup` Act01_Lookup_AccountCode

#### 이벤트
[E0] 화면 열림 (생성자 L49-71) → show()
[E1] accountCode[계정과목].TriggerClick (L82) → lookupAccount()
[E2] updateButton[저장].Select (L89) → update()
[E3] closeButton[닫기].Select (L96) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L73-76 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupAccount() | L104-114 | E1 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private update() | L116-142 | E2 | 미선택 시 alert "계정과목을 선택하세요", 서비스 pay.Pay50_Expense.updateAccountCode(accountCode) | 업무 |
| private settings() | L78-102 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L144-146 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L148-150 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

