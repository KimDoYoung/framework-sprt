# Ast06_Tab_FxEvalDeposit

- 종류: 화면
- 메뉴: 관리회계 > 20. 결산 > 외화예금 환평가처리 (#1174)
- 파일: `client/vi/ast/Ast06_Tab_FxEvalDeposit.java`
- 함께 쓰는 클래스 2개:
  - `Ast24_Lookup_FxRate` `client/vi/ast/Ast24_Lookup_FxRate.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast06_Tab_FxEvalDeposit:454 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.selectFxEvalList` | Ast06_Tab_FxEvalDeposit:337 | [`Ast06_Tr.java:152`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectFxEvalList`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateFxEval` | Ast06_Tab_FxEvalDeposit:383, Ast06_Tab_FxEvalDeposit:429 | [`Ast06_Tr.java:1142`](../../ast/services/Ast06_Tr.md) | [`act02_journal.countByOrgTrId`](../../act/sql/act02_journal.md), [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createBackJournal`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteDepositBackJournal`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.deleteDepositBackJournal`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`ast06_tr.checkStdDateAfterFxEval`](../../ast/sql/ast06_tr.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast06_tr.selectDepositBackJournal`](../../ast/sql/ast06_tr.md), [`ast09_book.checkBook`](../../ast/sql/ast09_book.md), [`ast09_book.insert`](../../ast/sql/ast09_book.md), [`ast09_book.selectTargetBook`](../../ast/sql/ast09_book.md), [`ast09_book.updateFxPl`](../../ast/sql/ast09_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), `UpdateDataModel(ast06_tr)` 동적 DELETE |
| `ast.Ast09_Book.createDepositBook` | Ast06_Tab_FxEvalDeposit:483 | [`Ast09_Book.java:163`](../../ast/services/Ast09_Book.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast24_FxRate.delete` | Ast24_Lookup_FxRate:219 | [`Ast24_FxRate.java:33`](../../ast/services/Ast24_FxRate.md) | `UpdateDataModel(ast24_fx_rate)` 동적 DELETE |
| `ast.Ast24_FxRate.selectByStdDate` | Ast24_Lookup_FxRate:177 | [`Ast24_FxRate.java:22`](../../ast/services/Ast24_FxRate.md) | [`ast24_fx_rate.selectByStdDate`](../../ast/sql/ast24_fx_rate.md) |
| `ast.Ast24_FxRate.update` | Ast24_Lookup_FxRate:191 | [`Ast24_FxRate.java:28`](../../ast/services/Ast24_FxRate.md) | `UpdateDataModel(ast24_fx_rate)` 동적 INSERT/UPDATE → [`ast24_fx_rate.selectById`](../../ast/sql/ast24_fx_rate.md) |
| `sys.Sys99_Print.insertRdFxEvalDeposit` | Ast06_Tab_FxEvalDeposit:249 | [`Sys99_Print.java:1908`](../../sys/services/Sys99_Print.md) | [`ast06_tr.selectFxEvalList`](../../ast/sql/ast06_tr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast24_fx_rate`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_back_journal`, `f_create_depositbook`, `f_create_journal`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_FxEvalDeposit (`client/vi/ast/Ast06_Tab_FxEvalDeposit.java`, 544줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 평가년월: {yyyyMM} 보관처: {corpName} 보관계좌: {corpAccountName} {retrieveButton} {updateButton} {deleteButton} {downloadButton} {depositButton} {fxRateButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `corpAccountId` LongField, `corpAccountName` LookupTriggerField 빈칸="전체", `lookupCorpCode` Sys15_Lookup_Corp, `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookupFxRate` Ast24_Lookup_FxRate
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - evalYnName 90 "평가여부" TextCenter
  - date 90 "평가일자" Date
  - corpAccountName 250 "계좌" Text
  - curCode 60 "통화" TextCenter
  - forAmt 120 "외화 잔고" Double
  - depositBookAmt 150 "원화 잔고" Long
  - fxRate 100 "평가환율" Double 편집:"DD5E5E"
  - note 300 "적요" Text 편집:"DD5E5E"
  - personName 80 "처리자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L79-98) → setting()
[E1] yyyyMM.KeyPress [Enter] (L109) → retrieve()
[E2] corpName.TriggerClick [result != null] (L121) → 인라인 L121-139 (new TriggerClickHandler() { @Override…)
[E3] corpAccountName.TriggerClick [result != null] (L144) → getCloseDate()
[E4] retrieveButton[조회].Select (L184) → retrieve()
[E5] updateButton[평가처리].Select [YES] (L190) → update()
[E6] msgBox.DialogHide [YES] (L200) → update()
[E7] deleteButton[평가취소].Select [YES] (L217) → delete()
[E8] msgBox.DialogHide [YES] (L227) → delete()
[E9] downloadButton[출력/다운로드].Select [result.getStatus() == 1] (L244) → getCloseDate(), getRdCloseDate()
[E10] depositButton[예금잔고정리].Select (L285) → depositUpdate()
       └ [E13] msgBox.DialogHide [YES] (L476) → getStartDate(), retrieve()
[E11] fxRateButton[환율입력].Select (L292) → lookupFxRate()
[E12] grid.RowClick (L299) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L100-307 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 → 콜백: unmask, 조회창 Ast01_Lookup_CorpAccount 열기 → 콜백: unmask, 확인창 표시, 서비스 sys.Sys99_Print.insertRdFxEvalDeposit(companyId, personId, windowClassName, assetType, closeDate, corpId, accountId) | 업무 |
| public retrieve() | L327-347 | E1,E4,E13,setting,delete | 서비스 ast.Ast06_Tr.selectFxEvalList(companyId, assetType, closeDate, corpId, accountId), 건수 표시 | 업무 |
| private retrievePage() | L349-352 | E12,retrieve,update | 상태 처리 | 업무 |
| private update() | L354-409 | E5,E6 | 미선택 시 alert "평가일이 미래일입니다.", 서비스 ast.Ast06_Tr.updateFxEval(companyId, personId, procType) | 업무 |
| private delete() | L411-451 | E7,E8 | 서비스 ast.Ast06_Tr.updateFxEval(companyId, personId, procType) | 업무 |
| private checkClose() | L453-468 | update,delete | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private depositUpdate() | L470-511 | E10 | ConfirmBox → E13 | 업무 |
| private lookupFxRate() | L513-516 | E11 | 조회창 Ast24_Lookup_FxRate 열기 | 업무 |
| private getStartDate() | L518-522 | E13,depositUpdate | 서비스 yyyy.MM.dd | 업무 |
| private getCloseDate() | L524-530 | E3,E9,retrieve,lookupFxRate | 서비스 yyyy.MM.dd | 업무 |
| private getRdCloseDate() | L532-539 | E9 | 서비스 yyyy.MM.dd | 업무 |
| public buildGrid() | L309-325 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L541-543 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('evalYnNm', 90, '평가여부'),  // L314
  gb.date('date', 90, '평가일자'),  // L315
  gb.text('corpAccountNm', 250, '계좌'),  // L316
  gb.textCenter('curCd', 60, '통화'),  // L317
  gb.double('forAmt', 120, '외화 잔고'),  // L318
  gb.long('depositBookAmt', 150, '원화 잔고'),  // L319
  gb.double('fxRate', 100, '평가환율', { editor: 'number' }),  // L320
  gb.text('note', 300, '적요', { editor: 'text' }),  // L321
  gb.textCenter('personNm', 80, '처리자'),  // L322
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>평가처리</Button>
3. <Button type="cancel" onClick={delete}>평가취소</Button>
4. <Button type="download" onClick={() => /* getCloseDate(), getRdCloseDate() */}>출력/다운로드</Button>
5. <Button type="view" onClick={depositUpdate}>예금잔고정리</Button>
6. <Button type="register" onClick={lookupFxRate}>환율입력</Button>

### Ast24_Lookup_FxRate (`client/vi/ast/Ast24_Lookup_FxRate.java`, 240줄)

- 툴바 `buttonBar`: 기준일자: {stdDate} 통화코드: {curCodeCombo} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `stdDate` MyDateField, `curCodeCombo` ComboBoxField("CurCode", "%", "전체", "KRW"), `comboCurCode` ComboBoxField("CurCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - stdDate 100 "기준일자" Date 편집:MyDateField
  - curCode 80 "통화" TextCenter 편집:comboCurCode
  - applyFxRate 120 "적용환율" Double 편집:DoubleField
  - note 350 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L74-89) → show()
[E1] curCodeCombo[CurCode].Collapse (L96) → retrieve()
[E2] cancleButton[닫기].Select (L103) → hide()
[E3] retrieveButton[조회].Select (L109) → retrieve()
[E4] insertButton[등록].Select (L115) → insertRow()
[E5] updateButton[저장].Select (L121) → update()
[E6] deleteButton[삭제].Select (L127) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L212) → 서비스 ast.Ast24_FxRate.delete
[E7] comboCurCode[CurCode].Expand (L150) → 인라인 L150-155 (new ExpandHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L54-57 | retrieve | 상태 처리 | 업무 |
| public open() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L91-144 | open | 상태 처리 | 업무 |
| public retrieve() | L168-183 | E1,E3,execute | 서비스 ast.Ast24_FxRate.selectByStdDate(companyId, stdDate, curCode, fxRateType) | 업무 |
| private update() | L185-192 | E5 | 서비스 ast.Ast24_FxRate.update | 업무 |
| private insertRow() | L194-202 | E4 | 상태 처리 | 업무 |
| private deleteRow() | L204-230 | E6 | ConfirmBox → E8 | 업무 |
| public buildGrid() | L146-166 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L232-234 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L236-238 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일자', { editor: 'date' }),  // L160
  gb.textCenter('curCd', 80, '통화'),  // L161
  gb.double('applyFxRate', 120, '적용환율', { editor: 'number' }),  // L162
  gb.text('note', 350, '비고', { editor: 'text' }),  // L163
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

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

