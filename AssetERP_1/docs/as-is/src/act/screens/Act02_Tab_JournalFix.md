# Act02_Tab_JournalFix

- 종류: 화면
- 메뉴: 관리회계 > 10. 전표입력 > 전표승인처리 (#1207)
- 파일: `client/vi/act/Act02_Tab_JournalFix.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Grid_JournalFix`](../../act/components/Act02_Grid_JournalFix.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.selectByDateAll` | Act02_Tab_JournalFix:341 | [`Act02_Journal.java:43`](../../act/services/Act02_Journal.md) | [`act02_journal.selectByDateAll`](../../act/sql/act02_journal.md) |
| `act.Act02_Journal.selectById` | Act02_Tab_JournalFix:273 | [`Act02_Journal.java:31`](../../act/services/Act02_Journal.md) | [`act02_journal.selectById`](../../act/sql/act02_journal.md) |
| `act.Act02_Journal.updateFixYn` | Act02_Tab_JournalFix:400, Act02_Tab_JournalFix:437 | [`Act02_Journal.java:597`](../../act/services/Act02_Journal.md) | [`act02_journal.selectById`](../../act/sql/act02_journal.md), [`act02_journal.updateFixYn`](../../act/sql/act02_journal.md), [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md), [`dbConfig.getDateFormat`](../../utils/sql/dbConfig.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_JournalFix (`client/vi/act/Act02_Tab_JournalFix.java`, 477줄)

- 레이아웃: north=vlcHeader, center=grid, south=gridJournal
- 툴바 `buttonBarHeader01`: 조회기간: {startDate} ~: {closeDate} 거래유형: {trName} 거래처: {corpName} {retrieveButton} {confirmButton} {cancelButton}
- 툴바 `buttonBarHeader02`: 검색: {searchText} 발생구분: {trOccType} {unFixYn}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="거래처/거래유형/적요", `corpId` LongField, `corpName` LookupTriggerField 빈칸="전체", `trCode` TextField, `trName` LookupTriggerField 빈칸="전체", `trOccType` ComboBoxField("TrOccType", "%", "전체"), `unFixYn` CheckBox, `lookupCorpCode` Sys15_Lookup_Corp, `lookupTrCode` Ast05_Lookup_TrCode, `lookup` Act80_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - journalNoStr 85 "전표번호" TextCenter
  - corpName 200 "거래처" Text
  - trName 200 "거래유형" Text
  - note 400 "적요" TextArea
  - curCode 50 "통화" TextCenter
  - journalAmt 150 "금액" Long
  - personName 100 "등록자" TextCenter
  - dcrCountStr 50 "연관문서" TextCenter
  - actionCell 40 "" Cell 편집:actionCell
  - fixYnName 70 "전표승인" TextCenter
  - fixPersonName 100 "승인자" TextCenter
  - fixDateStr 150 "승인일시" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L86-113) → settings(), retrieve()
[E1] corpName.TriggerClick [result != null] (L132) → 인라인 L132-150 (new TriggerClickHandler() { @Override…)
[E2] trName.TriggerClick [result != null] (L155) → 인라인 L155-173 (new TriggerClickHandler(){ @Override …)
[E3] searchText.KeyPress [Enter] (L177) → retrieve()
[E4] retrieveButton[조회].Select (L221) → retrieve()
[E5] confirmButton[승인].Select (L227) → updateConfirm()
       └ [E8] msgBox.DialogHide [YES] (L395) → retrievePage()
       └ [E9] msgBox.DialogHide [YES] (L432) → retrievePage()
[E6] cancelButton[승인취소].Select (L233) → updateConfirm()
[E7] grid.RowClick (L240) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L308-351 | 생성자,E3,E4 | 서비스 act.Act02_Journal.selectByDateAll(companyId, startDate, closeDate, searchText, corpIdStr, trCode, unFixYn, trOccType) | 업무 |
| private retrievePage() | L353-360 | E7,E8,E9,retrieve | 상태 처리 | 업무 |
| private updateConfirm() | L362-468 | E5,E6 | ConfirmBox → E8 | 업무 |
| private settings() | L115-246 | 생성자 | 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast05_Lookup_TrCode 열기, 이벤트 연결, 초기값: startDate=start, closeDate=close, corpName=corpModel.getCorpName(, corpId=corpModel.getCorpId(, corpName="전체", corpId=null, trName=trCodeModel.getTrName(, trCode=trCodeModel.getTrCode(, trName="전체", trCode=null, unFixYn=false("미승인 전표만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L248-306 | 필드 초기화 | 조회창 Act80_Lookup_RelateAppr 열기, 서비스 act.Act02_Journal.selectById(journalId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L470-472 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L474-476 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L291
  // ⚠DB없음 L292 journalNoStr 85 "전표번호" (act03_journal_no_str 컬럼 없음)
  gb.text('corpNm', 200, '거래처'),  // L293
  gb.text('trNm', 200, '거래유형'),  // L294
  gb.textArea('note', 400, '적요'),  // L295
  gb.textCenter('curCd', 50, '통화'),  // L296
  gb.long('journalAmt', 150, '금액'),  // L297
  gb.textCenter('personNm', 100, '등록자'),  // L298
  gb.textCenter('dcrCountStr', 50, '연관문서'),  // L299
  // ⚠ 대응 없음 (GridBuilder L300) addCell
  gb.textCenter('fixYnNm', 70, '전표승인'),  // L301
  gb.textCenter('fixPersonNm', 100, '승인자'),  // L302
  gb.textCenter('fixDateStr', 150, '승인일시'),  // L303
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateConfirm}>승인</Button>
3. <Button type="cancel" onClick={updateConfirm}>승인취소</Button>

