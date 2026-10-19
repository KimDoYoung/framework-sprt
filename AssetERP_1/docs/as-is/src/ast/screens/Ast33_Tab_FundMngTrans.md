# Ast33_Tab_FundMngTrans

- 종류: 화면
- 메뉴: 관리회계 > 30. 펀드운용보수관리 > 이관펀드 등록 (#1252)
- 파일: `client/vi/ast/Ast33_Tab_FundMngTrans.java`
- 함께 쓰는 클래스 2개:
  - `Ast33_Lookup_FundMngTrans` `client/vi/ast/Ast33_Lookup_FundMngTrans.java`
  - `Ast30_Lookup_HoldFee` `client/vi/ast/Ast30_Lookup_HoldFee.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Grid_JournalFix`](../../act/components/Act02_Grid_JournalFix.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast33_Lookup_FundMngTrans:295, Ast33_Tab_FundMngTrans:273 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast30_BookFundFee.selectByPreHoldDate` | Ast30_Lookup_HoldFee:192 | [`Ast30_BookFundFee.java:30`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByPreHoldDate`](../../ast/sql/ast30_book_fund_fee.md) |
| `ast.Ast33_FundTrans.delete` | Ast33_Tab_FundMngTrans:266 | [`Ast33_FundTrans.java:145`](../../ast/services/Ast33_FundTrans.md) | [`act02_journal.countByTrId`](../../act/sql/act02_journal.md), [`act02_journal.deleteByTrId`](../../act/sql/act02_journal.md), [`act03_journal_dtl.deleteByTrId`](../../act/sql/act03_journal_dtl.md), [`act06_journal_tmp.deleteByTrId`](../../act/sql/act06_journal_tmp.md), [`act80_relate_appr.deleteByTrId`](../../act/sql/act80_relate_appr.md), [`ast06_tr.deleteById`](../../ast/sql/ast06_tr.md), [`ast07_settle.deleteByTrId`](../../ast/sql/ast07_settle.md), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md), `UpdateDataModel(ast33_fund_trans)` 동적 DELETE |
| `ast.Ast33_FundTrans.selectByDate` | Ast33_Tab_FundMngTrans:227 | [`Ast33_FundTrans.java:28`](../../ast/services/Ast33_FundTrans.md) | [`ast33_fund_trans.selectByDate`](../../ast/sql/ast33_fund_trans.md) |
| `ast.Ast33_FundTrans.update` | Ast33_Lookup_FundMngTrans:318 | [`Ast33_FundTrans.java:34`](../../ast/services/Ast33_FundTrans.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast05_tr_code.selectByTrCode`](../../ast/sql/ast05_tr_code.md), [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md), [`ast06_tr.upsert`](../../ast/sql/ast06_tr.md), [`ast30_book_fund_fee.deleteBeforeHoldDate`](../../ast/sql/ast30_book_fund_fee.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md), `UpdateDataModel(ast33_fund_trans)` 동적 INSERT/UPDATE → [`ast33_fund_trans.selectById`](../../ast/sql/ast33_fund_trans.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act06_journal_tmp`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast08_tr_finance`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast20_tr_tax`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`sys01_company`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_fundfeebook2`, `f_create_journal`, `f_emp_kor_nm`, `f_get_relate_dcr_count`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast33_Tab_FundMngTrans (`client/vi/ast/Ast33_Tab_FundMngTrans.java`, 293줄)

- 레이아웃: north=buttonBar, center=grid, south=gridJournal
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 구분: {fundTransComboBox} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="펀드/비고", `fundTransComboBox` ComboBoxField("FundTransCode", "%", "전체"), `lookupTrans` Ast33_Lookup_FundMngTrans
- 그리드 `grid` (buildGrid(), 체크박스):
  - date 120 "이관일자" Date
  - fundTransName 120 "구분" TextCenter
  - fundCode 80 "펀드코드" TextCenter
  - fundName 350 "펀드명" TextArea
  - forFee 120 "미수보수" Double
  - note 250 "비고" TextArea
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
| public retrieve() | L216-237 | 생성자,E1,E2 | 서비스 ast.Ast33_FundTrans.selectByDate(companyId, startDate, closeDate, fundTransCode, searchText) | 업무 |
| private retrievePage() | L239-245 | E6,buildGrid,retrieve,insertRow | 상태 처리 | 업무 |
| private insertRow() | L247-258 | E3 | 조회창 Ast33_Lookup_FundMngTrans 열기 | 업무 |
| private delete() | L260-269 | E4,E5 | GridDeleteData ast.Ast33_FundTrans.delete(체크된 행 목록) | 업무 |
| private checkClose() | L271-288 | delete | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private settings() | L106-180 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: startDate=start, closeDate=close | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-214 | 필드 초기화 | 조회창 Ast33_Lookup_FundMngTrans 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L290-292 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 120, '이관일자'),  // L205
  gb.textCenter('fundTransNm', 120, '구분'),  // L206
  gb.textCenter('fundCd', 80, '펀드코드'),  // L207
  gb.textArea('fundNm', 350, '펀드명'),  // L208
  gb.double('forFee', 120, '미수보수'),  // L209
  gb.textArea('note', 250, '비고'),  // L210
  // ⚠ 대응 없음 (GridBuilder L211) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>

### Ast33_Lookup_FundMngTrans (`client/vi/ast/Ast33_Lookup_FundMngTrans.java`, 352줄)

- 입력·하위 화면: `fundTransCode` TextField, `fundTransName` ComboBoxField("FundTransCode"), `curCode` ComboBoxField("CurCode"), `date` MyDateField, `fundCode` LookupTriggerField, `fundName` TextField, `fee` LongField, `forFee` DoubleField, `note` MyTextArea, `lookupBook` Ast30_Lookup_HoldFee

#### 이벤트
[E0] 화면 열림 (생성자 L82-84) → 초기화
[E1] fundTransName[이관구분].Collapse (L151) → 인라인 L151-169 (new CollapseHandler() { @Override pub…)
[E2] fundCode[펀드].TriggerClick (L171) → 메시지 "펀드코드를 입력해주세요"
[E3] fee[원화미수보수].ValueChange (L200) → 인라인 L200-207 (new ValueChangeHandler<Long>() { @Ove…)
[E4] updateButton[저장].Select (L209) → preUpdate()
[E5] closeButton[닫기].Select ["NEW".equals(actionName)] (L215) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L86-99 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L101-144 | openNew | 상태 처리 | 업무 |
| private setting() | L146-227 | open | 조회창 Ast30_Lookup_HoldFee 열기 | 업무 |
| private getEditor() | L229-279 | open | 상태 처리 | 업무 |
| public preUpdate() | L281-310 | E4 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L312-342 | preUpdate | 서비스 ast.Ast33_FundTrans.update | 업무 |
| private setHtmlStyle() | L344-346 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L348-350 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

