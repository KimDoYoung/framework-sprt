# Act02_Tab_JournalSub

- 종류: 화면
- 메뉴: 관리회계 > 21. 회계장부 > 계정별원장 (#1150)
- 파일: `client/vi/act/Act02_Tab_JournalSub.java`
- 함께 쓰는 클래스 1개:
  - `Act01_Lookup_AccountTree` `client/vi/act/Act01_Lookup_AccountTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md), [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Act02_Tab_JournalSub:174 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |
| `act.Act01_AccountCode.selectTreeByCompanyId` | Act01_Lookup_AccountTree:146 | [`Act01_AccountCode.java:46`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectTreeByCompanyId`](../../act/sql/act01_account_code.md) |
| `act.Act02_Journal.getAccountCode` | Act02_Tab_JournalSub:324 | [`Act02_Journal.java:67`](../../act/services/Act02_Journal.md) | [`act02_journal.getAccountCode`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByAccountCode` | Act02_Tab_JournalSub:555 | [`Act03_JournalDtl.java:38`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByAccountCode`](../../act/sql/act03_journal_dtl.md) |
| `act.Act13_RealAccountMap.selectByAstClassTreeId` | Act02_Tab_JournalSub:588 | [`Act13_RealAccountMap.java:31`](../../act/services/Act13_RealAccountMap.md) | [`act13_real_account_map.selectByAstClassTreeId`](../../act/sql/act13_real_account_map.md) |
| `ast.Ast05_TrCode.selectBySearchText` | Act02_Tab_JournalSub:210 | [`Ast05_TrCode.java:37`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectBySearchText`](../../ast/sql/ast05_tr_code.md) |
| `sys.Sys15_Corp.selectByUseYn` | Act02_Tab_JournalSub:249 | [`Sys15_Corp.java:30`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.selectByUseYn`](../../sys/sql/sys15_corp.md) |
| `sys.Sys99_Print.insertRdJournalSub` | Act02_Tab_JournalSub:369 | [`Sys99_Print.java:1215`](../../sys/services/Sys99_Print.md) | [`act03_journal_dtl.selectByAccountCode`](../../act/sql/act03_journal_dtl.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp14_account`](../../../db/tables/emp.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_account_nm`, `f_get_fss_account_cd`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_JournalSub (`client/vi/act/Act02_Tab_JournalSub.java`, 686줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar1`: 조회기간: {startDate} ~: {closeDate} 거래처: {corpLookupField} 거래유형: {trLookupField} 관리계좌: {depositName} {retrieveButton} {downloadButton} {downloadForm}
- 툴바 `buttonBar2`: 계정코드: {accountCodeField} 검색: {searchText} {rdDownLoadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `trLookupField` LookupTriggerField 빈칸="전체", `corpLookupField` LookupTriggerField 빈칸="전체", `accountCodeField` LookupTriggerField 빈칸="선택해주세요", `searchText` TextField 빈칸="계정과목/거래유형/적요/거래처", `depositId` LongField, `depositName` LookupTriggerField 빈칸="전체", `lookupCorpAccount` Ast01_Lookup_CorpAccount, `lookup` Act80_Lookup_RelateAppr, `trAccount` Ast05_Lookup_TrCode, `lookupAccount` Act01_Lookup_AccountTree, `lookupCorp` Sys15_Lookup_Corp
- 그리드 `grid` (buildGrid()):
  - date 100 "분개일자" Date
  - journalNoStr 85 "분개번호" TextCenter
  - accountName 200 "계정과목" TextArea
  - trName 200 "거래유형" TextArea
  - note 300 "적요" TextArea
  - corpName 200 "거래처" TextArea
  - drAmt 150 "차변금액" Long
  - crAmt 150 "대변금액" Long
  - balAmt 150 "잔액" Long
  - drAstName 150 "관리계좌" Text
  - drNote 200 "전표적요" Text
  - actionCell 60 "연관문서" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L95-149) → settings()
[E1] accountCodeField.TriggerClick (L162) → lookupAccountCode()
[E2] accountCodeField.ValueChange (L168) → lookupAccountCode()
[E3] trLookupField.TriggerClick (L198) → lookupTrCode()
[E4] trLookupField.ValueChange (L204) → lookupTrCode()
[E5] corpLookupField.TriggerClick (L237) → lookupCorp()
[E6] corpLookupField.ValueChange (L243) → lookupCorp()
[E7] depositName.TriggerClick [result != null] (L284) → 인라인 L284-302 (new TriggerClickHandler() { @Override…)
[E8] searchText.KeyPress [Enter] (L306) → retrieve()
[E9] retrieveButton[조회].Select (L315) → retrieve()
[E10] downloadButton[엑셀다운로드].Select [선택>0] (L321) → downloadCheck()
       └ [E12] msgBox.DialogHide [YES] (L425) → downloadOneExcel(), downloadExcel()
[E11] rdDownLoadButton[전체출력/다운로드].Select (L344) → 서비스 sys.Sys99_Print.insertRdJournalSub(companyId, personId, windowClassName, startDate, closeDate, accountCode, trCode, corpIdStr, depositIdStr, searchText), 메시지 "계정코드를 선택해주세요"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private downloadCheck() | L413-445 | E10 | ConfirmBox → E12, LabelHtml 래퍼 | 업무 |
| private downloadOneExcel() | L447-457 | E12 | 상태 처리 | 업무 |
| private downloadExcel() | L459-469 | E12,downloadCheck | 상태 처리 | 업무 |
| public retrieve() | L521-564 | E8,E9 | 서비스 act.Act03_JournalDtl.selectByAccountCode(companyId, startDate, closeDate, accountCode, trCode, corpIdStr, depositIdStr, searchText), 건수 표시 | 업무 |
| public retrieveCall() | L566-625 | 공개 메서드 | 서비스 act.Act13_RealAccountMap.selectByAstClassTreeId, act.Act03_JournalDtl.selectByAccountCode(companyId, classTreeId, companyId, startDate, closeDate, accountCode, trCode, corpIdStr, depositIdStr, searchText), 건수 표시 | 업무 |
| private lookupTrCode() | L627-641 | E3,E4 | 조회창 Ast05_Lookup_TrCode 열기 | 업무 |
| private lookupAccountCode() | L643-659 | E1,E2 | 조회창 Act01_Lookup_AccountTree 열기 | 업무 |
| private lookupCorp() | L661-675 | E5,E6 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private settings() | L151-411 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기 → 콜백: unmask, 서비스 act.Act01_AccountCode.selectBySlipYn, ast.Ast05_TrCode.selectBySearchText, sys.Sys15_Corp.selectByUseYn, act.Act02_Journal.getAccountCode, sys.Sys99_Print.insertRdJournalSub(companyId, attributeCode, searchText, companyId, useYn, searchText, rcvPayCode, assetType, financeYn, companyId, corpType, searchText, startDate, closeDate, companyId, companyId, personId, windowClassName, startDate, closeDate, accountCode, trCode, corpIdStr, depositIdStr, searchText), 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=LoginUser.getToday(, depositId=accountModel.getClassTreeId(, depositName=accountModel.getCorpAccountName(, depositId=null, depositName="전체" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L471-519 | 필드 초기화 | 조회창 Act80_Lookup_RelateAppr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L677-680 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L682-684 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '분개일자'),  // L501
  // ⚠DB없음 L502 journalNoStr 85 "분개번호" (act03_journal_no_str 컬럼 없음)
  gb.textArea('accountNm', 200, '계정과목'),  // L503 SQL 계산 컬럼(selectByAccountCode: CASE WHEN COALESCE(act01_use_yn,'false'…)
  gb.textArea('trNm', 200, '거래유형'),  // L504
  gb.textArea('note', 300, '적요'),  // L505
  gb.textArea('corpNm', 200, '거래처'),  // L506
  gb.long('drAmt', 150, '차변금액'),  // L507
  gb.long('crAmt', 150, '대변금액'),  // L508
  gb.long('balAmt', 150, '잔액'),  // L509 SQL 계산 컬럼(selectByAccountCode: SUM(act03_bal_amt) OVER (ORDER BY act02…)
  gb.text('drAstNm', 150, '관리계좌'),  // L510 SQL 계산 컬럼(selectByAccountCode: '')
  gb.text('drNote', 200, '전표적요'),  // L511
  // ⚠ 대응 없음 (GridBuilder L512) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={downloadCheck}>엑셀다운로드</Button>
3. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdJournalSub(companyId, personId, windowClassName, startDate, closeDate, accountCode, trCode, corpIdStr, depositIdStr, searchText), 메시지 "계정코드를 선택해주세요" */}>전체출력/다운로드</Button>

### Act01_Lookup_AccountTree (`client/vi/act/Act01_Lookup_AccountTree.java`, 241줄)

- 툴바 `buttonBar`: 계정과목: {searchText} {searchButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - accountCode 100 "계정코드" TextCenter
  - accountName2 500 "계정과목" Text
  - level 100 "LEVEL" Long

#### 이벤트
[E0] 화면 열림 (생성자 L54-61) → 초기화
[E1] treeGrid.RowDoubleClick (L96) → confirm()
[E2] searchText.KeyPress [Enter] (L104) → search()
[E3] searchButton[찾기].Select (L113) → search()
[E4] confirmButton[확인].Select (L119) → confirm()
[E5] closeButton[닫기].Select (L125) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-91 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L93-131 | open | 상태 처리 | 업무 |
| package buildTreeGrid() | L133-141 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L143-174 | open | 서비스 act.Act01_AccountCode.selectTreeByCompanyId(companyId) | 업무 |
| private addChild() | L176-184 | retrieve | 상태 처리 | 업무 |
| private search() | L186-223 | E2,E3 | 상태 처리 | 업무 |
| private confirm() | L225-231 | E1,E4 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L233-235 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L237-239 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.textCenter('accountCd', 100, '계정코드'),  // L136
  gb.text('accountNm2', 500, '계정과목'),  // L137
  // ⚠DB없음 L138 level 100 "LEVEL" (act01_level 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

