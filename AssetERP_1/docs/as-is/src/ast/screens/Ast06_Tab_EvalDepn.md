# Ast06_Tab_EvalDepn

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 감가상각처리 (#1175)
- 파일: `client/vi/ast/Ast06_Tab_EvalDepn.java`
- 함께 쓰는 클래스 3개:
  - `Ast16_Lookup_NonDeductTax` `client/vi/ast/Ast16_Lookup_NonDeductTax.java`
  - `Ast06_Lookup_ModifyDepnCost` `client/vi/ast/Ast06_Lookup_ModifyDepnCost.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Tab_EvalDepn:305 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.delete` | Ast06_Tab_EvalDepn:282 | [`Ast06_Tr.java:1313`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`ast08_tr_finance.deleteByTrId`](../../ast/sql/ast08_tr_finance.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast09_book.createFinanceBook`](../../ast/sql/ast09_book.md), [`ast20_tr_tax.deleteByTrId`](../../ast/sql/ast20_tr_tax.md), [`ast21_tr_4insure.deleteByTrId`](../../ast/sql/ast21_tr_4insure.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast06_Tr.selectDepn` | Ast06_Tab_EvalDepn:188 | [`Ast06_Tr.java:168`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectDepn`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDepnCost` | Ast06_Lookup_ModifyDepnCost:86 | [`Ast06_Tr.java:863`](../../ast/services/Ast06_Tr.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast06_tr.updateAmt`](../../ast/sql/ast06_tr.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast06_Tr.updateDepnEval` | Ast06_Tab_EvalDepn:234 | [`Ast06_Tr.java:659`](../../ast/services/Ast06_Tr.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), [`ast13_book_depn.selectByPurTrId`](../../ast/sql/ast13_book_depn.md), [`dbConfig.getCompanyCloseDate`](../../utils/sql/dbConfig.md), [`dbConfig.getDateDif`](../../utils/sql/dbConfig.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast16_NonDeductTax.delete` | Ast16_Lookup_NonDeductTax:174 | [`Ast16_NonDeductTax.java:30`](../../ast/services/Ast16_NonDeductTax.md) | `UpdateDataModel(ast16_non_deduct_tax)` 동적 DELETE |
| `ast.Ast16_NonDeductTax.selectByPurTrId` | Ast16_Lookup_NonDeductTax:135 | [`Ast16_NonDeductTax.java:20`](../../ast/services/Ast16_NonDeductTax.md) | [`ast16_non_deduct_tax.selectByPurTrId`](../../ast/sql/ast16_non_deduct_tax.md) |
| `ast.Ast16_NonDeductTax.update` | Ast16_Lookup_NonDeductTax:145 | [`Ast16_NonDeductTax.java:25`](../../ast/services/Ast16_NonDeductTax.md) | `UpdateDataModel(ast16_non_deduct_tax)` 동적 INSERT/UPDATE → [`ast16_non_deduct_tax.selectById`](../../ast/sql/ast16_non_deduct_tax.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depnbook`, `f_create_financebook`, `f_create_journal`, `f_create_seq`, `f_get_account_close_date`, `f_get_account_nm`, `f_get_close_date`, `f_get_corp_nm`, `f_get_datedif`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_EvalDepn (`client/vi/ast/Ast06_Tab_EvalDepn.java`, 381줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 상각년월: {closeDate} {retrieveButton} {updateButton} {cancelButton} {notice}
- 입력·하위 화면: `closeDate` TextField 빈칸="YYYY.MM", `lookupNonDeductTax` Ast16_Lookup_NonDeductTax, `lookupDepnCost` Ast06_Lookup_ModifyDepnCost
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "상각일자" Date
  - itemClassTypeName 200 "구분" Text
  - classTreeName 300 "자산명" Text
  - purDate 100 "취득일자" Date
  - bookAmt 150 "취득금액" Long
  - nonDeductTax 130 "불공제세액<br>(추가분)" Long
  - depnTypeName 100 "상각방식" TextCenter
  - amt 150 "감가상각비" Long
  - statusName 100 "처리여부" TextCenter
  - actionCell 50 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L61-80) → setting()
[E1] closeDate.KeyPress [Enter] (L91) → retrieve()
[E2] retrieveButton[조회].Select (L112) → retrieve()
[E3] updateButton[처리].Select (L118) → update()
[E4] cancelButton[취소].Select (L124) → delete()
[E5] grid.RowClick (L131) → retrievePage()
[E6] grid.RowDoubleClick (L138) → lookupNonDeductTax()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L82-146 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L181-198 | E1,E2,setting,update,delete,lookupNonDeductTax | 서비스 ast.Ast06_Tr.selectDepn(companyId, depnDate) | 업무 |
| private retrievePage() | L200-203 | E5,retrieve | 상태 처리 | 업무 |
| private update() | L205-256 | E3 | 서비스 ast.Ast06_Tr.updateDepnEval(companyId, personId, evalYear) | 업무 |
| private delete() | L258-301 | E4 | 서비스 ast.Ast06_Tr.delete | 업무 |
| private checkClose() | L303-321 | update,delete,lookupModify | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private getDepnDate() | L323-329 | retrieve,update,checkClose | 서비스 yyyy.MM.dd | 업무 |
| private lookupNonDeductTax() | L331-348 | E6 | 조회창 Ast16_Lookup_NonDeductTax 열기 | 업무 |
| private lookupModify() | L350-372 | buildGrid | 조회창 Ast06_Lookup_ModifyDepnCost 열기 | 업무 |
| public buildGrid() | L148-179 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L374-376 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L378-380 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '상각일자'),  // L162
  gb.text('itemClassTypeNm', 200, '구분'),  // L163
  gb.text('classTreeNm', 300, '자산명'),  // L164
  gb.date('purDate', 100, '취득일자'),  // L165
  gb.long('bookAmt', 150, '취득금액'),  // L166
  gb.long('nonDeductTax', 130, '불공제세액<br>(추가분)'),  // L167
  gb.textCenter('depnTypeNm', 100, '상각방식'),  // L168
  gb.long('amt', 150, '감가상각비'),  // L169
  gb.textCenter('statusNm', 100, '처리여부'),  // L170
  // ⚠ 대응 없음 (GridBuilder L171) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>처리</Button>
3. <Button type="cancel" onClick={delete}>취소</Button>

### Ast16_Lookup_NonDeductTax (`client/vi/ast/Ast16_Lookup_NonDeductTax.java`, 192줄)

- 툴바 `buttonBar`: {retrieveButton} {insertRowButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - applyDate 120 "적용일자" Date 편집:MyDateField
  - applyNonDeductTax 120 "불공제세액<br>(추가분)" Long 편집:LongField
  - note 350 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L61-76) → show()
[E1] cancleButton[닫기].Select (L79) → hide()
[E2] retrieveButton[조회].Select (L85) → retrieve()
[E3] updateButton[저장].Select (L91) → update()
[E4] insertRowButton[등록].Select (L97) → insertRow()
[E5] deleteButton[삭제].Select (L103) → delete()
       └ [E6] msgBox.DialogHide [YES] (L167) → 서비스 ast.Ast16_NonDeductTax.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-59 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L78-115 | open | 상태 처리 | 업무 |
| public retrieve() | L129-141 | E2,setting | 서비스 ast.Ast16_NonDeductTax.selectByPurTrId(purTrId) | 업무 |
| private update() | L143-154 | E3 | 서비스 ast.Ast16_NonDeductTax.update | 업무 |
| private insertRow() | L156-162 | E4 | 상태 처리 | 업무 |
| private delete() | L164-184 | E5 | ConfirmBox → E6 | 업무 |
| public buildGrid() | L117-127 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L187-189 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('applyDate', 120, '적용일자', { editor: 'date' }),  // L122
  gb.long('applyNonDeductTax', 120, '불공제세액<br>(추가분)', { editor: 'number' }),  // L123
  gb.text('note', 350, '비고', { editor: 'text' }),  // L124
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast06_Lookup_ModifyDepnCost (`client/vi/ast/Ast06_Lookup_ModifyDepnCost.java`, 117줄)

- 입력·하위 화면: `depn_cost` LongField

#### 이벤트
[E0] 화면 열림 (생성자 L38-56) → show()
[E1] cancleButton[닫기].Select (L67) → hide()
[E2] updateButton[저장].Select (L74) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L58-64 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L66-83 | open | 상태 처리 | 업무 |
| private update() | L85-107 | E2 | 서비스 ast.Ast06_Tr.updateDepnCost(depnCost, personId) | 업무 |
| private setHtmlHeaderStyle() | L109-111 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L112-114 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

