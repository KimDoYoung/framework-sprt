# Ast30_Tab_OfficeMngFeeClose

- 종류: 화면
- 메뉴: 관리회계 > 20. 결산 > 펀드보수 결산처리 (#1202)
- 파일: `client/vi/ast/Ast30_Tab_OfficeMngFeeClose.java`
- 함께 쓰는 클래스 2개:
  - `Ast30_Lookup_FeeClose` `client/vi/ast/Ast30_Lookup_FeeClose.java`
  - `Ast06_Grid_Journal` `client/vi/ast/Ast06_Grid_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByJournalId` | Ast06_Grid_Journal:116 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |
| `act.Act04_GenLedger.checkClose` | Ast30_Tab_OfficeMngFeeClose:346 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.selectById` | Ast30_Tab_OfficeMngFeeClose:317 | [`Ast06_Tr.java:32`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `ast.Ast30_BookFundFee.reprocFundFee` | Ast30_Tab_OfficeMngFeeClose:441 | [`Ast30_BookFundFee.java:301`](../../ast/services/Ast30_BookFundFee.md) | [`dbConfig.getCompanyCloseDate`](../../utils/sql/dbConfig.md), [`icam10_fee.createFundFeeBook`](../../icam/sql/icam10_fee.md) |
| `ast.Ast30_BookFundFee.selectByCorpId` | Ast30_Lookup_FeeClose:213 | [`Ast30_BookFundFee.java:48`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByCorpId`](../../ast/sql/ast30_book_fund_fee.md) |
| `ast.Ast30_BookFundFee.selectEvalFundFee` | Ast30_Tab_OfficeMngFeeClose:303 | [`Ast30_BookFundFee.java:72`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectEvalFundFee`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getAccountCloseDate`](../../utils/sql/dbConfig.md) |
| `ast.Ast30_BookFundFee.update` | Ast30_Lookup_FeeClose:281 | [`Ast30_BookFundFee.java:387`](../../ast/services/Ast30_BookFundFee.md) | `UpdateDataModel(ast30_book_fund_fee)` 동적 INSERT/UPDATE → [`ast30_book_fund_fee.selectById`](../../ast/sql/ast30_book_fund_fee.md) |
| `ast.Ast30_BookFundFee.updateEvalFundFee` | Ast30_Tab_OfficeMngFeeClose:414 | [`Ast30_BookFundFee.java:88`](../../ast/services/Ast30_BookFundFee.md) | [`act02_journal.countByOrgTrId`](../../act/sql/act02_journal.md), [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.createBackJournal`](../../act/sql/act02_journal.md), [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`act02_journal.deleteBackJournalByOrgTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteBackJournalByOrgTrId`](../../act/sql/act03_journal_dtl.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteBackJournalByOrgTrId`](../../act/sql/act06_journal_tmp.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast06_tr.deleteByOrgTrId`](../../ast/sql/ast06_tr.md), [`ast06_tr.insert`](../../ast/sql/ast06_tr.md), [`ast30_book_fund_fee.deleteBookFundFeeByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.deleteBookFundFeeCloseByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.deleteBookFundFeeRecoveryByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.insertBookFundFeeByTrId`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.insertBookFundFeeClose`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.insertBookFundFeeRecovery`](../../ast/sql/ast30_book_fund_fee.md), [`ast30_book_fund_fee.updateFixFee`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getAccountCloseDate`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md) |
| `sys.Sys99_Print.insertRdOfficeMngFeeClose` | Ast30_Tab_OfficeMngFeeClose:206 | [`Sys99_Print.java:1862`](../../sys/services/Sys99_Print.md) | [`ast30_book_fund_fee.selectEvalFundFee`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast31_book_fund_fee_close`](../../../db/tables/ast.md), [`ast32_book_fund_fee_recovery`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`icam10_fee`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_calc_dual_fund_fee`, `f_cdnm`, `f_create_back_journal`, `f_create_fundfeebook`, `f_create_fundfeebook2`, `f_create_journal`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_close_date`, `f_get_account_nm`, `f_get_close_date`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast30_Tab_OfficeMngFeeClose (`client/vi/ast/Ast30_Tab_OfficeMngFeeClose.java`, 488줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 결산일자: {yyyyMM} 운용사: {corpName} 검색: {searchText} {retrieveButton} {updateButton} {deleteButton} {downloadButton} {reprocFundFeeButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="운용사/통화", `lookupCorpCode` Sys15_Lookup_Corp, `lookupFee` Ast30_Lookup_FeeClose
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - closeYnName 80 "결산여부" TextCenter
  - holdDate 100 "결산일자" Date
  - trName 220 "거래유형" Text
  - corpCode 100 "운용사코드" TextCenter
  - corpName 300 "운용사" Text
  - curCode 50 "통화" TextCenter
  - forFee 150 "누적보수(통화기준)" Double
  - fee 150 "누적보수(KRW)" Long
  - fxRate 100 "적용환율" Double
  - actionCell 50 "변경" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L78-97) → setting()
[E1] yyyyMM.KeyPress [Enter] (L108) → retrieve()
[E2] corpName.TriggerClick [result != null] (L120) → 인라인 L120-138 (new TriggerClickHandler() { @Override…)
[E3] searchText.KeyPress [Enter] (L142) → retrieve()
[E4] retrieveButton[조회].Select (L171) → retrieve()
[E5] updateButton[결산처리].Select (L177) → preCheck()
       └ [E10] msgBox.DialogHide [YES] (L354) → update()
       └ [E11] msgBox.DialogHide [YES] (L382) → update()
[E6] deleteButton[결산취소].Select (L183) → preCheck()
[E7] reprocFundFeeButton[보수원장정리].Select (L189) → reprocFundFee()
[E8] downloadButton[출력/다운로드].Select [corpId.getValue() != null] (L195) → getCloseDate(), getRdCloseDate()
[E9] grid.RowClick (L244) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L99-252 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdOfficeMngFeeClose(companyId, personId, windowClassName, holdDate, corpIdStr, searchText) | 업무 |
| public retrieve() | L287-313 | E1,E3,E4,setting,update | 서비스 ast.Ast30_BookFundFee.selectEvalFundFee(companyId, holdDate, corpIdStr, searchText) | 업무 |
| private retrievePage() | L315-330 | E9,retrieve | 서비스 ast.Ast06_Tr.selectById(trId) | 업무 |
| private preCheck() | L332-408 | E5,E6 | ConfirmBox → E10 | 업무 |
| private update() | L410-436 | E10,E11 | 서비스 ast.Ast30_BookFundFee.updateEvalFundFee(companyId, personId, stdDate, procType) | 업무 |
| private reprocFundFee() | L438-458 | E7 | 서비스 ast.Ast30_BookFundFee.reprocFundFee(companyId, closeDate) | 업무 |
| private getList() | L460-466 | update | 상태 처리 | 업무 |
| private getCloseDate() | L468-474 | E8,retrieve,update,reprocFundFee | 서비스 yyyy.MM.dd | 업무 |
| private getRdCloseDate() | L476-483 | E8 | 서비스 yyyy.MM.dd | 업무 |
| public buildGrid() | L254-285 | 필드 초기화 | 조회창 Ast30_Lookup_FeeClose 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L485-487 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('closeYnNm', 80, '결산여부'),  // L273 SQL 계산 컬럼(selectEvalFundFee: CASE WHEN ast30_tr_id IS NULL THEN '' E…)
  gb.date('holdDate', 100, '결산일자'),  // L274
  gb.text('trNm', 220, '거래유형'),  // L275 SQL 계산 컬럼(selectEvalFundFee: f_cdnm('trCode', ast30_tr_cd, ast30_com…)
  gb.textCenter('corpCd', 100, '운용사코드'),  // L276 SQL 계산 컬럼(selectEvalFundFee: sys15_corp_cd)
  gb.text('corpNm', 300, '운용사'),  // L277 SQL 계산 컬럼(selectEvalFundFee: sys15_corp_nm)
  gb.textCenter('curCd', 50, '통화'),  // L278
  gb.double('forFee', 150, '누적보수(통화기준)'),  // L279
  gb.long('fee', 150, '누적보수(KRW)'),  // L280
  gb.double('fxRate', 100, '적용환율'),  // L281
  // ⚠ 대응 없음 (GridBuilder L282) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={preCheck}>결산처리</Button>
3. <Button type="cancel" onClick={preCheck}>결산취소</Button>
4. <Button type="download" onClick={() => /* getCloseDate(), getRdCloseDate() */}>출력/다운로드</Button>
5. <Button type="unknown" onClick={reprocFundFee}>보수원장정리</Button>

### Ast30_Lookup_FeeClose (`client/vi/ast/Ast30_Lookup_FeeClose.java`, 323줄)

- 툴바 `buttonBar`: 통화/적용환율: {curCode} {fxRate} {fxRateButton} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="펀드코드/펀드명", `curCode` TextField, `fxRate` DoubleField
- 그리드 `fundGrid` (buildGrid()):
  - fundCode 80 "펀드코드" TextCenter
  - fundName 300 "펀드명" Text
  - forFee 110 "누적보수(" Double 편집:"456EA6"
  - fee 110 "누적보수" Long 편집:"456EA6"
  - forTyFee 100 "당기보수(" Double
  - tyFee 100 "당기보수" Long
  - forFixFee 100 "전기보수(" Double
  - fixFee 100 "전기보수" Long

#### 이벤트
[E0] 화면 열림 (생성자 L65-73) → 초기화
[E1] searchText.KeyPress [Enter] (L149) → retrieve()
[E2] fxRateButton[환율적용].Select (L158) → calcFee()
[E3] retrieveButton[조회].Select (L164) → retrieve()
[E4] updateButton[저장].Select (L170) → update()
[E5] closeButton[닫기].Select (L176) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L75-109 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L111-182 | open | 상태 처리 | 업무 |
| private retrieve() | L199-201 | E1,E3,open,update | 상태 처리 | 업무 |
| private retrieve() | L203-222 | E1,E3,open,update | 서비스 ast.Ast30_BookFundFee.selectByCorpId(companyId, holdDate, corpId, curCode, searchText) | 업무 |
| private calcFee() | L224-267 | E2 | 상태 처리 | 업무 |
| private update() | L269-288 | E4 | 서비스 ast.Ast30_BookFundFee.update | 업무 |
| private updateAfter() | L290-313 | retrieve | 상태 처리 | 업무 |
| public buildGrid() | L184-197 | setting | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L315-317 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L319-321 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 80, '펀드코드'),  // L187
  gb.text('fundNm', 300, '펀드명'),  // L188
  gb.double('forFee', 110, '누적보수(', { editor: 'number' }),  // L189
  gb.long('fee', 110, '누적보수', { editor: 'number' }),  // L190
  gb.double('forTyFee', 100, '당기보수('),  // L191 SQL 계산 컬럼(selectByCorpId: ast30_for_fee - COALESCE(ast30_for_fix_…)
  gb.long('tyFee', 100, '당기보수'),  // L192 SQL 계산 컬럼(selectByCorpId: ast30_fee - COALESCE(ast30_fix_fee ,0))
  gb.double('forFixFee', 100, '전기보수('),  // L193
  gb.long('fixFee', 100, '전기보수'),  // L194
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={calcFee}>환율적용</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

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

