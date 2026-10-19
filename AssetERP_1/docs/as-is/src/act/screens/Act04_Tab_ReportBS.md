# Act04_Tab_ReportBS

- 종류: 화면
- 메뉴: 관리회계 > 22. 재무제표 > 재무상태표 (#1179)
- 파일: `client/vi/act/Act04_Tab_ReportBS.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.selectBSPL` | Act04_Tab_ReportBS:204 | [`Act04_GenLedger.java:75`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.deleteGenLedgerCloseTmp`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertGenLedgerCloseTmp`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.insertGenLedgerCloseTmpEicp`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectBSPL`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `sys.Sys00_Common.selectAccountCloseDate` | Act04_Tab_ReportBS:255 | [`Sys00_Common.java:131`](../../sys/services/Sys00_Common.md) | [`dbConfig.getAccountCloseDate`](../../utils/sql/dbConfig.md) |
| `sys.Sys00_Common.selectPreQuarterCloseDate` | Act04_Tab_ReportBS:255 | [`Sys00_Common.java:136`](../../sys/services/Sys00_Common.md) | [`dbConfig.getPreQuarterCloseDate`](../../utils/sql/dbConfig.md) |
| `sys.Sys99_Print.insertRdReportBS` | Act04_Tab_ReportBS:139 | [`Sys99_Print.java:1717`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act04_gen_ledger`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act07_gen_ledger_closetmp`](../../../db/tables/act.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_create_genledgerclosetmp_eicp`, `f_create_seq`, `f_get_account_close_date`, `f_get_quarter_date`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act04_Tab_ReportBS (`client/vi/act/Act04_Tab_ReportBS.java`, 305줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일자: {stdDate} 비교기준: {compareComboBox} {compareDate} {exceptZeroCheckBox} {retrieveButton} {downLoadButton}
- 입력·하위 화면: `stdDate` MyDateField, `compareComboBox` ComboBoxField("BsplCompareCode"), `compareDate` MyDateField, `exceptZeroCheckBox` CheckBox
- 그리드 `grid` (buildGrid()):
  - accountName2 450 "과목" TextArea
  - curBalAmt 250 "당기금액" Long
  - preBalAmt 250 "전기금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L58-88) → settings()
[E1] stdDate.ValueChange (L93) → setCompareDate()
[E2] compareComboBox[BsplCompareCode].Collapse (L111) → setCompareDate()
[E3] retrieveButton[조회].Select (L127) → retrieve()
[E4] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L134) → 서비스 sys.Sys99_Print.insertRdReportBS(companyId, personId, windowClassName, stdDate, compareDate, exceptZeroYn, reportType)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L194-213 | E3 | 서비스 act.Act04_GenLedger.selectBSPL(companyId, stdDate, compareDate, exceptZeroYn, reportType) | 업무 |
| private setCompareDate() | L215-264 | E1,E2,settings | 상태 처리 | 업무 |
| private settings() | L90-181 | 생성자 | 서비스 sys.Sys99_Print.insertRdReportBS(companyId, personId, windowClassName, stdDate, compareDate, exceptZeroYn, reportType), 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L183-192 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L295-297 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L298-300 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L301-304 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('accountNm2', 450, '과목'),  // L187 SQL 계산 컬럼(selectBSPL: account_nm)
  gb.long('curBalAmt', 250, '당기금액'),  // L188 SQL 계산 컬럼(selectBSPL: SUM(cur_bal_amt))
  gb.long('preBalAmt', 250, '전기금액'),  // L189 SQL 계산 컬럼(selectBSPL: SUM(pre_bal_amt))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdReportBS(companyId, personId, windowClassName, stdDate, compareDate, exceptZeroYn, reportType) */}>출력/다운로드</Button>

