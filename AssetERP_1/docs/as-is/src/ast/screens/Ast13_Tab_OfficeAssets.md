# Ast13_Tab_OfficeAssets

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > 비품관리대장 (#1397)
- 파일: `client/vi/ast/Ast13_Tab_OfficeAssets.java`
- 함께 쓰는 클래스 2개:
  - `Ast13_Lookup_ExpenseOfficeAssets` `client/vi/ast/Ast13_Lookup_ExpenseOfficeAssets.java`
  - `Ast06_Lookup_ModifyNote` `client/vi/ast/Ast06_Lookup_ModifyNote.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Pay50_Lookup_ExpenseOfficeAssets`](../../pay/components/Pay50_Lookup_ExpenseOfficeAssets.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast13_Lookup_ExpenseOfficeAssets:444 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `apr.Apr01_Appr.selectById` | Ast13_Tab_OfficeAssets:217 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast06_Tr.checkDepnMulti` | Ast13_Lookup_ExpenseOfficeAssets:426 | [`Ast06_Tr.java:314`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectDepnCount`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.delete` | Ast13_Lookup_ExpenseOfficeAssets:404 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectByExpenseId` | Ast13_Lookup_ExpenseOfficeAssets:273 | [`Ast06_Tr.java:239`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByExpenseId`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDepn2` | Ast13_Lookup_ExpenseOfficeAssets:344 | [`Ast06_Tr.java:609`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateNote` | Ast06_Lookup_ModifyNote:80 | [`Ast06_Tr.java:915`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.updateNote`](../../ast/sql/ast06_tr.md) |
| `ast.Ast13_BookDepn.selectOfficeAssets` | Ast13_Tab_OfficeAssets:328 | [`Ast13_BookDepn.java:31`](../../ast/services/Ast13_BookDepn.md) | [`ast13_book_depn.selectOfficeAssets`](../../ast/sql/ast13_book_depn.md) |
| `ast.Ast13_BookDepn.selectOfficeAssetsGroup` | Ast13_Tab_OfficeAssets:448 | [`Ast13_BookDepn.java:37`](../../ast/services/Ast13_BookDepn.md) | [`ast13_book_depn.selectOfficeAssetsGroup`](../../ast/sql/ast13_book_depn.md) |
| `ast.Ast13_BookDepn.updateRetireDate` | Ast13_Tab_OfficeAssets:392 | [`Ast13_BookDepn.java:72`](../../ast/services/Ast13_BookDepn.md) | [`ast13_book_depn.updateRetireDate`](../../ast/sql/ast13_book_depn.md) |
| `ast.Ast80_RelateAppr.insert` | Ast13_Tab_OfficeAssets:497 | [`Ast80_RelateAppr.java:58`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.deleteByApprId`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.insert`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast80_RelateAppr.selectByCompanyId` | Ast13_Tab_OfficeAssets:545 | [`Ast80_RelateAppr.java:26`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) |
| `ast.Ast80_RelateAppr.updateApprId` | Ast13_Tab_OfficeAssets:529 | [`Ast80_RelateAppr.java:95`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.updateApprId`](../../ast/sql/ast80_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ast13_Tab_OfficeAssets:414, Ast13_Tab_OfficeAssets:471 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys00_Common.selectOfficeAssets` | Ast13_Tab_OfficeAssets:154 | [`Sys00_Common.java:161`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectOfficeAssets`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectWindowUseTrCode` | Ast13_Lookup_ExpenseOfficeAssets:190 | [`Sys00_Common.java:101`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectWindowUseTrCode`](../../sys/sql/sys00_common.md) |
| `sys.Sys99_Print.insertRdOfficeAssets` | Ast13_Tab_OfficeAssets:264 | [`Sys99_Print.java:1569`](../../sys/services/Sys99_Print.md) | [`ast13_book_depn.selectOfficeAssets`](../../ast/sql/ast13_book_depn.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_ast_class_tree_nm_allpath2`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_depnbook`, `f_create_financebook`, `f_get_corp_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast13_Tab_OfficeAssets (`client/vi/ast/Ast13_Tab_OfficeAssets.java`, 605줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 보유일자: {holdDate} 구분: {astTypeCombo} 검색: {searchText} {retireCheckBox} {retrieveButton} {downLoadButton}
- 툴바 `buttonBar2`: {insertButton} {deleteButton}
- 입력·하위 화면: `holdDate` MyDateField, `retireCheckBox` CheckBox, `searchText` TextField 빈칸="구분/품명/적요/구입처", `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `astTypeCombo` CommonComboBoxField("sys.Sys00_Common.selectOfficeAssets", "%", "전체", "전체"), `lookup` Ast06_Lookup_ModifyNote, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - itemType 200 "구분" Text
  - purDate 100 "취득일자" Date
  - itemName 300 "품명" Text
  - note 250 "적요" Text
  - purAmt 120 "취득금액" Long
  - corpName 150 "구입처" Text
  - corpTel 120 "구입처연락처" TextCenter
  - retireDate 100 "폐기일자" Date

#### 이벤트
[E0] 화면 열림 (생성자 L94-147) → settings(), setDcrClassName()
[E1] astTypeCombo[sys.Sys00_Common.selectOfficeAssets].Collapse (L162) → retrieve()
[E2] searchText.KeyPress [Enter] (L171) → retrieve()
[E3] grid.CellDoubleClick [event.getCellIndex() == 4] (L183) → 인라인 L183-198 (new CellDoubleClickHandler() { @Overr…)
[E4] classTreeFullName[문서분류].TriggerClick (L202) → openLookupDoc()
[E5] apprButton[상신].Select (L208) → getDepnDate2()
[E6] apprViewButton[문서보기].Select (L214) → retrieveApprStep()
[E7] retrieveButton[조회].Select (L239) → retrieve()
[E8] insertButton[비품등록].Select (L245) → insert()
[E9] deleteButton[소모품 폐기/취소].Select (L251) → preDelete()
       └ [E11] msgBox.DialogHide [YES] (L371) → updateRetireDate()
[E10] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L258) → 서비스 sys.Sys99_Print.insertRdOfficeAssets(companyId, personId, windowClassName, depnDate, itemLClassCode, retireYn, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L318-338 | E1,E2,E7,settings,insert,updateApprId | 서비스 ast.Ast13_BookDepn.selectOfficeAssets(companyId, depnDate, itemLClassCode, retireYn, searchText) | 업무 |
| private insert() | L340-348 | E8 | 조회창 Ast13_Lookup_ExpenseOfficeAssets 열기 | 업무 |
| private preDelete() | L350-387 | E9 | 미선택 시 alert "유형/무형 자산은 고유자산거래처리 화면에서 거래를 등록하여 처리하세요" → 확인창 E11 | 업무 |
| private updateRetireDate() | L389-411 | E11 | 서비스 ast.Ast13_BookDepn.updateRetireDate(bookDepnId, retireDate) | 업무 |
| private setDcrClassName() | L413-433 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private openLookupDoc() | L436-445 | E4 | 상태 처리 | 업무 |
| private getDepnDate2() | L447-467 | E5 | 서비스 ast.Ast13_BookDepn.selectOfficeAssetsGroup(companyId, depnDate) | 업무 |
| private insertLinkApprovals() | L469-525 | getDepnDate2 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode, ast.Ast80_RelateAppr.insert | 업무 |
| private updateApprId() | L528-540 | insertLinkApprovals | 서비스 ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private retrieveApprStep() | L542-591 | E6,retrieve | 서비스 ast.Ast80_RelateAppr.selectByCompanyId | 업무 |
| private settings() | L149-300 | 생성자 | 조회창 Ast06_Lookup_ModifyNote 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys00_Common.selectOfficeAssets, apr.Apr01_Appr.selectById, sys.Sys99_Print.insertRdOfficeAssets(companyId, personId, windowClassName, depnDate, itemLClassCode, retireYn, searchText), 이벤트 연결, 초기값: holdDate=LoginUser.getToday(, retireCheckBox=false("폐기자산 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L302-316 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L593-595 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L597-599 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L601-603 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemType', 200, '구분'),  // L306
  gb.date('purDate', 100, '취득일자'),  // L307
  gb.text('itemNm', 300, '품명'),  // L308
  gb.text('note', 250, '적요'),  // L309
  gb.long('purAmt', 120, '취득금액'),  // L310
  gb.text('corpNm', 150, '구입처'),  // L311
  gb.textCenter('corpTel', 120, '구입처연락처'),  // L312
  gb.date('retireDate', 100, '폐기일자'),  // L313
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdOfficeAssets(companyId, personId, windowClassName, depnDate, itemLClassCode, retireYn, searchText) */}>출력/다운로드</Button>
3. <Button type="register" onClick={insert}>비품등록</Button>
4. <Button type="delete" onClick={preDelete}>소모품 폐기/취소</Button>
5. <Button type="register" onClick={getDepnDate2}>상신</Button>
6. <Button type="search" onClick={retrieveApprStep}>문서보기</Button>

### Ast13_Lookup_ExpenseOfficeAssets (`client/vi/ast/Ast13_Lookup_ExpenseOfficeAssets.java`, 493줄)

- 툴바 `buttonBar`: 발생일: {occDate} 적요: {expenseDesc} 금액: {totalAmt} {expenseButton}
- 툴바 `buttonBar2`: {retrieveButton} {insertRowButton} {deleteRowButton} {updateButton}
- 입력·하위 화면: `occDate` MyDateField, `expenseDesc` TextField, `totalAmt` LongField, `trNameComboBox` CommonComboBoxField("sys.Sys00_Common.selectWindowUseTrCode") 빈칸="선택하세요", `astFullName` LookupTriggerField, `lookupInfo` Ast01_Lookup_Info, `lookup` Pay50_Lookup_ExpenseOfficeAssets
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - lockYn 40 "" BooleanIcon
  - trName 180 "거래유형" Text 편집:"456EA6"
  - classTreeFullName 300 "종목" Text 편집:"456EA6"
  - note 250 "적요" Text 편집:TextField
  - contAmt 100 "취득금액" Long 편집:"456EA6"
  - trId 150 "취득ID" LongCenter
  - getSource  "" BeforeStartEditHandler

#### 이벤트
[E0] 화면 열림 (생성자 L86-92) → 초기화
[E1] expenseButton[지출결의서 선택].Select (L145) → lookupExpense()
[E2] retrieveButton[조회].Select (L151) → retrieve()
[E3] insertRowButton[등록].Select (L157) → insertRow()
[E4] deleteRowButton[삭제].Select (L163) → preDelete()
       └ [E10] msgBox.DialogHide [YES] (L375) → checkDepn(), checkClose(), delete()
[E5] updateButton[저장].Select (L169) → preUpdate()
[E6] closeButton[닫기].Select (L175) → hide()
[E7] trNameComboBox[sys.Sys00_Common.selectWindowUseTrCode].Collapse (L191) → 인라인 L191-197 (new CollapseHandler() { @Override pub…)
[E8] astFullName.TriggerClick [data.getTrCode() == null] (L203) → 메시지 "거래유형을 선택하세요"
[E9] gridBuilder.BeforeStartEdit [model != null] (L243) → 메시지 "수정할 수 없습니다. 삭제 후 다시 등록하세요"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L94-132 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L134-181 | open | 상태 처리 | 업무 |
| private retrieve() | L261-279 | E2,update,delete,lookupExpense | 서비스 ast.Ast06_Tr.selectByExpenseId(companyId, expenseId) | 업무 |
| private insertRow() | L281-303 | E3 | 상태 처리 | 업무 |
| private preUpdate() | L305-340 | E5 | 상태 처리 | 업무 |
| private update() | L342-360 | preUpdate | 서비스 ast.Ast06_Tr.updateDepn2 | 업무 |
| private preDelete() | L362-401 | E4 | ConfirmBox → E10 | 업무 |
| private delete() | L403-423 | E10 | 서비스 ast.Ast06_Tr.delete | 업무 |
| private checkDepn() | L425-441 | E10 | 서비스 ast.Ast06_Tr.checkDepnMulti | 업무 |
| private checkClose() | L443-460 | E10,preUpdate | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private lookupExpense() | L462-485 | E1 | 조회창 Pay50_Lookup_ExpenseOfficeAssets 열기 | 업무 |
| private buildGrid() | L183-259 | 필드 초기화 | 조회창 Ast01_Lookup_Info 열기, 미선택 시 alert "거래유형을 선택하세요", 서비스 sys.Sys00_Common.selectWindowUseTrCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L487-489 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L490-492 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L236) addBooleanIcon
  gb.text('trNm', 180, '거래유형', { editor: 'select' }),  // L237
  gb.text('classTreeFullNm', 300, '종목'),  // L238
  gb.text('note', 250, '적요', { editor: 'text' }),  // L239
  gb.long('contAmt', 100, '취득금액', { editor: 'number' }),  // L240
  gb.longCenter('trId', 150, '취득ID'),  // L241
  // ⚠ 대응 없음 (GridBuilder L243) addBeforeStartEditHandler
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={lookupExpense}>지출결의서 선택</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={preUpdate}>저장</Button>
5. <Button type="delete" onClick={preDelete}>삭제</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_ModifyNote (`client/vi/ast/Ast06_Lookup_ModifyNote.java`, 110줄)

- 입력·하위 화면: `note` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L34-53) → show()
[E1] cancleButton[닫기].Select (L64) → hide()
[E2] updateButton[저장].Select (L71) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-61 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L63-77 | open | 상태 처리 | 업무 |
| private update() | L79-100 | E2 | 서비스 ast.Ast06_Tr.updateNote(trId, note) | 업무 |
| private setHtmlHeaderStyle() | L102-104 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

