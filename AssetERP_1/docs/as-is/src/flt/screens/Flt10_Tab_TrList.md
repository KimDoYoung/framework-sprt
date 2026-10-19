# Flt10_Tab_TrList

- 종류: 화면
- 메뉴: 준법감시 > 10. 임직원매매 > 매매내역조회 (#1144)
- 파일: `client/vi/flt/Flt10_Tab_TrList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt10_Tr.selectByTrList` | Flt10_Tab_TrList:265 | [`Flt10_Tr.java:65`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByTrList`](../../flt/sql/flt10_tr.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Flt10_Tab_TrList:62 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdTrList` | Flt10_Tab_TrList:289 | [`Sys99_Print.java:4000`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt10_tr.selectByTrList`](../../flt/sql/flt10_tr.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_nvl`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_TrList (`client/vi/flt/Flt10_Tab_TrList.java`, 352줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 입/출: {ioType} 매매구분: {trType} 검색: {searchTextField} {preTrCheckBox} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField 빈칸="계좌/사전신고종목명/종목명", `ioType` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체"), `trType` ComboBoxField("FloorTrCode", "%", "전체"), `preTrCheckBox` CheckBox
- 그리드 `grid` (buildGrid()):
  - accountNo 200 "계좌" Text
  - inOutName 60 "입/출" TextCenter
  - trTypeName 100 "매매구분" TextCenter
  - regDate 100 "사전신고일" Date
  - itemName 200 "사전신고종목명" Text
  - expectTrQty 80 "사전신고수량" Double
  - expectTrAmt 120 "사전신고금액" Long
  - statusName 100 "사전승인" TextCenter
  - trDate 100 "매매일자" Date
  - trItemTypeName 150 "종목유형" Text
  - trItemName 200 "종목명" Text
  - trQty 80 "매매수량" Double
  - trAmt 120 "매매총액" Long
  - trPlRate 100 "손익율(%)" Double
  - trNote 150 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L73-118) → settings()
[E1] ioType[sys.Sys00_Common.selectByKindGroupCode].Collapse (L138) → retrieve()
[E2] trType[FloorTrCode].Collapse (L147) → retrieve()
[E3] preTrCheckBox[사전신고 포함].ValueChange (L156) → setPreTrColumn(), retrieve()
[E4] searchTextField.KeyPress [Enter] (L167) → retrieve()
[E5] grid.CellClick [event.getCellIndex() == 8] (L176) → 인라인 L176-193 (new CellClickHandler() { @Override pu…)
[E6] retrieveButton[조회].Select (L195) → retrieve()
[E7] downloadButton[엑셀다운로드].Select (L202) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setPreTrColumn() | L237-249 | E3,settings | 상태 처리 | 업무 |
| public retrieve() | L251-271 | E1,E2,E3,E4,E6 | 서비스 flt.Flt10_Tr.selectByTrList(companyId, personId, startDate, closeDate, preTrYn, unApprYn, trType, ioType, searchText) | 업무 |
| private setInitData() | L273-284 | settings | 상태 처리 | 업무 |
| private createRdExcel() | L286-343 | E7 | 서비스 sys.Sys99_Print.insertRdTrList(windowClassName, companyId, personId, startDate, closeDate, preTrYn, unApprYn, trType, ioType, searchText) | 업무 |
| private settings() | L120-208 | 생성자 | 이벤트 연결, 초기값: preTrCheckBox=true("사전신고 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L210-235 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L345-347 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L349-351 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('accountNo', 200, '계좌'),  // L212
  gb.textCenter('inOutNm', 60, '입/출'),  // L213
  gb.textCenter('trTypeNm', 100, '매매구분'),  // L214
  gb.date('regDate', 100, '사전신고일'),  // L215
  gb.text('itemNm', 200, '사전신고종목명'),  // L216
  gb.double('expectTrQty', 80, '사전신고수량'),  // L217
  gb.long('expectTrAmt', 120, '사전신고금액'),  // L218
  gb.textCenter('statusNm', 100, '사전승인'),  // L219
  gb.date('trDate', 100, '매매일자'),  // L220
  gb.text('trItemTypeNm', 150, '종목유형'),  // L221
  gb.text('trItemNm', 200, '종목명'),  // L222
  gb.double('trQty', 80, '매매수량'),  // L223
  gb.long('trAmt', 120, '매매총액'),  // L224
  gb.double('trPlRate', 100, '손익율(%)'),  // L225
  gb.textArea('trNote', 150, '비고'),  // L226
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

