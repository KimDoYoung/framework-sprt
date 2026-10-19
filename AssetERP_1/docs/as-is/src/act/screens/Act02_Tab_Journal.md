# Act02_Tab_Journal

- 종류: 화면
- 메뉴: 관리회계 > 21. 회계장부 > 분개장 (#1149)
- 파일: `client/vi/act/Act02_Tab_Journal.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md), [`Act80_Lookup_RelateAppr`](../../act/components/Act80_Lookup_RelateAppr.md), [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByCompanyId` | Act02_Tab_Journal:319 | [`Act03_JournalDtl.java:26`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByCompanyId`](../../act/sql/act03_journal_dtl.md) |
| `ast.Ast05_TrCode.selectBySearchText` | Act02_Tab_Journal:139 | [`Ast05_TrCode.java:37`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectBySearchText`](../../ast/sql/ast05_tr_code.md) |
| `sys.Sys15_Corp.selectByUseYn` | Act02_Tab_Journal:177 | [`Sys15_Corp.java:30`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.selectByUseYn`](../../sys/sql/sys15_corp.md) |
| `sys.Sys99_Print.insertRdJournal` | Act02_Tab_Journal:389 | [`Sys99_Print.java:856`](../../sys/services/Sys99_Print.md) | [`act03_journal_dtl.selectByCompanyId`](../../act/sql/act03_journal_dtl.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp14_account`](../../../db/tables/emp.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Tab_Journal (`client/vi/act/Act02_Tab_Journal.java`, 458줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 거래처: {corpLookupField} 거래유형: {trLookupField} 검색: {searchText} {retrieveButton} {downLoadButton} {checkDownLoadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `trLookupField` LookupTriggerField 빈칸="전체", `corpLookupField` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="거래유형/거래처/적요/계정", `lookupModi` Act02_Lookup_ModiJournal, `lookup` Act80_Lookup_RelateAppr, `trAccount` Ast05_Lookup_TrCode, `lookupCorp` Sys15_Lookup_Corp

#### 이벤트
[E0] 화면 열림 (생성자 L77-115) → settings(), retrieve()
[E1] trLookupField.TriggerClick (L127) → lookupTrCode()
[E2] trLookupField.ValueChange (L133) → lookupTrCode()
[E3] corpLookupField.TriggerClick (L165) → lookupCorp()
[E4] corpLookupField.ValueChange (L171) → lookupCorp(), retrieve()
[E5] searchText.KeyPress [Enter] (L201) → retrieve()
[E6] retrieveButton[조회].Select (L210) → retrieve()
[E7] downLoadButton[전체출력/다운로드].Select (L216) → lookupRd()
[E8] checkDownLoadButton[출력/다운로드].Select (L222) → lookupRd()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L289-334 | 생성자,E4,E5,E6,buildGrid | 서비스 act.Act03_JournalDtl.selectByCompanyId(companyId, startDate, closeDate, corpIdStr, searchText, trCode, abroType) | 업무 |
| private lookupTrCode() | L336-350 | E1,E2 | 조회창 Ast05_Lookup_TrCode 열기 | 업무 |
| private lookupCorp() | L352-366 | E3,E4 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private lookupRd() | L368-447 | E7,E8 | 서비스 sys.Sys99_Print.insertRdJournal(companyId, personId, windowClassName, startDate, closeDate, corpIdStr, searchText, trCode, abroType) | 업무 |
| private settings() | L117-228 | 생성자 | 서비스 ast.Ast05_TrCode.selectBySearchText, sys.Sys15_Corp.selectByUseYn(companyId, useYn, searchText, rcvPayCode, assetType, financeYn, companyId, corpType, searchText), 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L230-287 | 필드 초기화 | 조회창 Act02_Lookup_ModiJournal 열기, 조회창 Act80_Lookup_RelateAppr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L449-452 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L454-456 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('journalDateNo', 0, ' '),  // L274
  // ⚠DB없음 L275 empty 30 " " (act03_empty 컬럼 없음)
  gb.textCenter('drAccountCd', 120, '차변 계정코드'),  // L276
  gb.textArea('drAccountNm', 300, '차변 계정과목'),  // L277 SQL 계산 컬럼(selectByCompanyId: f_get_account_nm(act02_company_id, act0…)
  gb.long('drAmt', 150, '차변 금액'),  // L278
  gb.textCenter('crAccountCd', 120, '대변 계정코드'),  // L279
  gb.textArea('crAccountNm', 300, '대변 계정과목'),  // L280 SQL 계산 컬럼(selectByCompanyId: f_get_account_nm(act02_company_id, act0…)
  gb.long('crAmt', 150, '대변 금액'),  // L281
  // ⚠ 대응 없음 (GridBuilder L282) addCell
  // ⚠ 대응 없음 (GridBuilder L283) addCell
  // ⚠DB없음 L284 printYn 50 "출력" (act03_print_yn 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={lookupRd}>전체출력/다운로드</Button>
3. <Button type="download" onClick={lookupRd}>출력/다운로드</Button>

