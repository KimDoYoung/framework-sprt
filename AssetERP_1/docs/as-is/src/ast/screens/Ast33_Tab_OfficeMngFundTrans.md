# Ast33_Tab_OfficeMngFundTrans

- 종류: 화면
- 메뉴: 관리회계 > 30. 사무보수관리 > 이관펀드 등록(사무관리) (#1251)
- 파일: `client/vi/ast/Ast33_Tab_OfficeMngFundTrans.java`
- 함께 쓰는 클래스 3개:
  - `Ast33_Lookup_OfficeMngFundTrans2` `client/vi/ast/Ast33_Lookup_OfficeMngFundTrans2.java`
  - `Ast30_Lookup_HoldFee` `client/vi/ast/Ast30_Lookup_HoldFee.java`
  - `Ast33_Lookup_OfficeMngFundTrans` `client/vi/ast/Ast33_Lookup_OfficeMngFundTrans.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Grid_JournalFix`](../../act/components/Act02_Grid_JournalFix.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast33_Lookup_OfficeMngFundTrans2:330, Ast33_Lookup_OfficeMngFundTrans:328, Ast33_Tab_OfficeMngFundTrans:274 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast30_BookFundFee.selectByPreHoldDate` | Ast30_Lookup_HoldFee:192 | [`Ast30_BookFundFee.java:30`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByPreHoldDate`](../../ast/sql/ast30_book_fund_fee.md) |
| `ast.Ast33_FundTrans.delete` | Ast33_Tab_OfficeMngFundTrans:267 | [`Ast33_FundTrans.java:145`](../../ast/services/Ast33_FundTrans.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md), `UpdateDataModel(ast33_fund_trans)` 동적 DELETE |
| `ast.Ast33_FundTrans.selectByDate` | Ast33_Tab_OfficeMngFundTrans:229 | [`Ast33_FundTrans.java:28`](../../ast/services/Ast33_FundTrans.md) | [`ast33_fund_trans.selectByDate`](../../ast/sql/ast33_fund_trans.md) |
| `ast.Ast33_FundTrans.update` | Ast33_Lookup_OfficeMngFundTrans2:378, Ast33_Lookup_OfficeMngFundTrans:351 | [`Ast33_FundTrans.java:34`](../../ast/services/Ast33_FundTrans.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast05_tr_code.selectByTrCode`](../../ast/sql/ast05_tr_code.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast06_tr.upsert`](../../ast/sql/ast06_tr.md), [`ast30_book_fund_fee.deleteBeforeHoldDate`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md), `UpdateDataModel(ast33_fund_trans)` 동적 INSERT/UPDATE → [`ast33_fund_trans.selectById`](../../ast/sql/ast33_fund_trans.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_fundfeebook2`, `f_create_journal`, `f_emp_kor_nm`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast33_Tab_OfficeMngFundTrans (`client/vi/ast/Ast33_Tab_OfficeMngFundTrans.java`, 294줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 구분: {fundTransComboBox} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="운용사/펀드/비고", `fundTransComboBox` ComboBoxField("FundTransCode", "%", "전체"), `lookupTrans` Ast33_Lookup_OfficeMngFundTrans
- 그리드 `grid` (buildGrid(), 체크박스):
  - date 120 "이관일자" Date
  - fundTransName 120 "구분" TextCenter
  - corpCode 80 "운용사" TextCenter
  - corpName 200 "운용사명" Text
  - fundCode 80 "펀드코드" TextCenter
  - fundName 250 "펀드명" TextArea
  - forFee 100 "미수보수" Double
  - note 200 "비고" TextArea
  - actionCell 50 "수정" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-104) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L122) → retrieve()
[E2] retrieveButton[조회].Select (L134) → retrieve()
[E3] insertButton[등록].Select (L140) → insertRow()
[E4] deleteButton[삭제].Select [YES] (L146) → delete()
[E5] msgBox.DialogHide [YES] (L156) → delete()
[E6] grid.RowClick (L174) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L218-239 | 생성자,E1,E2,insertRow | 서비스 ast.Ast33_FundTrans.selectByDate(companyId, startDate, closeDate, fundTransCode, searchText) | 업무 |
| private retrievePage() | L241-247 | E6,buildGrid,retrieve | 상태 처리 | 업무 |
| private insertRow() | L249-259 | E3 | 조회창 Ast33_Lookup_OfficeMngFundTrans2 열기 | 업무 |
| private delete() | L261-270 | E4,E5 | GridDeleteData ast.Ast33_FundTrans.delete(체크된 행 목록) | 업무 |
| private checkClose() | L272-289 | delete | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private settings() | L106-180 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: startDate=start, closeDate=close | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-216 | 필드 초기화 | 조회창 Ast33_Lookup_OfficeMngFundTrans 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L291-293 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 120, '이관일자'),  // L205
  gb.textCenter('fundTransNm', 120, '구분'),  // L206
  gb.textCenter('corpCd', 80, '운용사'),  // L207
  gb.text('corpNm', 200, '운용사명'),  // L208
  gb.textCenter('fundCd', 80, '펀드코드'),  // L209
  gb.textArea('fundNm', 250, '펀드명'),  // L210
  gb.double('forFee', 100, '미수보수'),  // L211
  gb.textArea('note', 200, '비고'),  // L212
  // ⚠ 대응 없음 (GridBuilder L213) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>

### Ast33_Lookup_OfficeMngFundTrans2 (`client/vi/ast/Ast33_Lookup_OfficeMngFundTrans2.java`, 409줄)

- 툴바 `fundButton`: {insertRowButton} {deleteRowButton}
- 입력·하위 화면: `fundTransName` ComboBoxField("FundTransCode"), `corpCode` LookupTriggerField, `corpName` TextField, `corpId` LongField, `date` MyDateField, `note` TextArea, `lookupCorp` Sys15_Lookup_Corp, `lookupFund` Ast30_Lookup_HoldFee
- 그리드 `fundGrid` (buildGrid(), 체크박스(다중)):
  - fundCode 100 "펀드코드" TextCenter 편집:TextField
  - fundName 300 "펀드명" Text
  - curCode 80 "통화" TextCenter
  - forFee 100 "외화미수보수" Double 편집:DoubleField
  - fee 150 "원화미수보수" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L83-89) → 초기화
[E1] date[이관일자].Change (L106) → 인라인 L106-111 (new ChangeHandler() { @Override publi…)
[E2] date[이관일자].Collapse (L112) → 인라인 L112-121 (new CollapseHandler() { @Override pub…)
[E3] fundTransName[이관구분].Collapse (L124) → 인라인 L124-138 (new CollapseHandler() { @Override pub…)
[E4] corpCode[운용사].TriggerClick [result != null] (L142) → 인라인 L142-160 (new TriggerClickHandler() { @Override…)
[E5] insertRowButton[행 추가].Select (L162) → insertRow()
[E6] deleteRowButton[행 삭제].Select (L168) → deleteRow()
[E7] updateButton[저장].Select (L174) → preUpdate()
[E8] closeButton[닫기].Select (L180) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L91-101 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L103-186 | open | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private getEditor() | L188-233 | open | 상태 처리 | 업무 |
| private insertRow() | L248-304 | E5 | 조회창 Ast30_Lookup_HoldFee 열기 | 업무 |
| private deleteRow() | L306-311 | E6 | 상태 처리 | 업무 |
| private preUpdate() | L313-345 | E7 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L347-400 | preUpdate | 서비스 ast.Ast33_FundTrans.update | 업무 |
| private buildGrid() | L235-246 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L402-404 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L406-408 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 100, '펀드코드', { editor: 'text' }),  // L239
  gb.text('fundNm', 300, '펀드명'),  // L240
  gb.textCenter('curCd', 80, '통화'),  // L241
  gb.double('forFee', 100, '외화미수보수', { editor: 'number' }),  // L242
  gb.long('fee', 150, '원화미수보수', { editor: 'number' }),  // L243
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={preUpdate}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast30_Lookup_HoldFee (`client/vi/ast/Ast30_Lookup_HoldFee.java`, 225줄)

- 툴바 `buttonBar`: 기준일자: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="운용사/펀드", `stdDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스(다중), 체크박스):
  - corpCode 70 "운용사" TextCenter
  - corpName 150 "운용사명" Text
  - fundCode 100 "펀드코드" TextCenter
  - fundName 350 "펀드명" Text
  - curCode 50 "통화" TextCenter
  - forFee 120 "보수(외화)" Double
  - fee 120 "보수(원화)" Long

#### 이벤트
[E0] 화면 열림 (생성자 L57-64) → 초기화
[E1] searchText.KeyPress [Enter] (L106) → retrieve()
[E2] grid.RowDoubleClick (L117) → select()
[E3] selectButton[확인].Select (L141) → select()
[E4] cancleButton[닫기].Select (L147) → hide()
[E5] retrieveButton[조회].Select (L153) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L66-69 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L71-74 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L76-93 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L95-160 | open | 상태 처리 | 업무 |
| private retrieve() | L183-198 | E1,E5,open | 서비스 ast.Ast30_BookFundFee.selectByPreHoldDate(companyId, holdDate, corpId, searchText) | 업무 |
| private select() | L200-215 | E2,E3 | 상태 처리 | 업무 |
| public buildGrid() | L162-181 | setting | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L221-223 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpCd', 70, '운용사'),  // L172 SQL 계산 컬럼(selectByPreHoldDate: sys15_corp_cd)
  gb.text('corpNm', 150, '운용사명'),  // L173 SQL 계산 컬럼(selectByPreHoldDate: sys15_corp_nm)
  gb.textCenter('fundCd', 100, '펀드코드'),  // L174
  gb.text('fundNm', 350, '펀드명'),  // L175
  gb.textCenter('curCd', 50, '통화'),  // L176
  gb.double('forFee', 120, '보수(외화)'),  // L177
  gb.long('fee', 120, '보수(원화)'),  // L178
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast33_Lookup_OfficeMngFundTrans (`client/vi/ast/Ast33_Lookup_OfficeMngFundTrans.java`, 385줄)

- 입력·하위 화면: `fundTransCode` TextField, `fundTransName` ComboBoxField("FundTransCode"), `curCode` ComboBoxField("CurCode"), `corpCode` LookupTriggerField, `corpName` TextField, `corpId` LongField, `date` MyDateField, `fundCode` TextField, `fundName` TextField, `fee` LongField, `forFee` DoubleField, `note` MyTextArea, `lookupBook` Ast30_Lookup_HoldFee, `lookupCorp` Sys15_Lookup_Corp

#### 이벤트
[E0] 화면 열림 (생성자 L87-89) → 초기화
[E1] fundTransName[이관구분].Collapse (L156) → 인라인 L156-174 (new CollapseHandler() { @Override pub…)
[E2] corpCode[운용사].TriggerClick (L177) → 인라인 L177-219 (new TriggerClickHandler() { @Override…)
[E3] fee[원화미수보수].ValueChange (L224) → 인라인 L224-231 (new ValueChangeHandler<Long>() { @Ove…)
[E4] updateButton[저장].Select (L233) → preUpdate()
[E5] closeButton[닫기].Select ["NEW".equals(actionName)] (L239) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L91-103 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L105-148 | openNew | 상태 처리 | 업무 |
| private setting() | L150-251 | open | 조회창 Ast30_Lookup_HoldFee 열기, 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private getEditor() | L253-308 | open | 상태 처리 | 업무 |
| public preUpdate() | L310-343 | E4 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L345-375 | preUpdate | 서비스 ast.Ast33_FundTrans.update | 업무 |
| private setHtmlStyle() | L377-379 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L381-383 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

