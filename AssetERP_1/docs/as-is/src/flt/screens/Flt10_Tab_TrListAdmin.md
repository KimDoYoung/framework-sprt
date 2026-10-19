# Flt10_Tab_TrListAdmin

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 매매내역조회 (#1153)
- 파일: `client/vi/flt/Flt10_Tab_TrListAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt10_Tr.selectByTrList` | Flt10_Tab_TrListAdmin:319 | [`Flt10_Tr.java:65`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByTrList`](../../flt/sql/flt10_tr.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Flt10_Tab_TrListAdmin:147 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdTrListAdmin` | Flt10_Tab_TrListAdmin:352 | [`Sys99_Print.java:4067`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt10_tr.selectByTrList`](../../flt/sql/flt10_tr.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_nvl`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_TrListAdmin (`client/vi/flt/Flt10_Tab_TrListAdmin.java`, 418줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 사원명: {empKorName} 입/출: {ioTypeComboBox} 매매구분: {trTypeComboBox} {preTrCheckBox} {retrieveButton} {downloadButton} {reportDownloadButton} {rdFileDownloadForm}
- 툴바 `buttonBar2`: 검색: {searchTextField}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField 빈칸="사전신고종목명/종목명", `preTrCheckBox` CheckBox, `empKorName` LookupTriggerField 빈칸="전체", `trTypeComboBox` ComboBoxField("FloorTrCode", "%", "전체"), `ioTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `empSearch` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - personOrgName 150 "사원명" Text
  - inOutName 60 "입/출" TextCenter
  - trTypeName 100 "매매구분" TextCenter
  - regDate 100 "사전신고일" Date
  - itemName 180 "사전신고종목명" Text
  - expectTrQty 80 "사전신고수량" Double
  - expectTrAmt 120 "사전신고금액" Long
  - statusName 100 "사전승인" TextCenter
  - trDate 100 "매매일자" Date
  - trItemTypeName 150 "종목유형" Text
  - trItemName 180 "종목명" Text
  - trQty 80 "매매수량" Double
  - trAmt 120 "매매총액" Long
  - trPlRate 100 "손익율(%)" Double
  - trNote 150 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L84-134) → settings()
[E1] ioTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L155) → retrieve()
[E2] trTypeComboBox[FloorTrCode].Collapse (L164) → retrieve()
[E3] empKorName.TriggerClick [result == null] (L174) → 인라인 L174-192 (new TriggerClickHandler(){ @Override …)
[E4] empKorName.Change (L193) → 인라인 L193-200 (new ChangeHandler() { @Override publi…)
[E5] preTrCheckBox[사전신고 포함].ValueChange (L204) → setPreTrColumn(), retrieve()
[E6] searchTextField.KeyPress [Enter] (L215) → retrieve()
[E7] grid.CellClick [event.getCellIndex() == 8] (L224) → 인라인 L224-241 (new CellClickHandler() { @Override pu…)
[E8] retrieveButton[조회].Select (L243) → retrieve()
[E9] downloadButton[엑셀다운로드].Select (L250) → createRdExcel()
[E10] reportDownloadButton[엑셀다운로드(금감원양식)].Select (L257) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setPreTrColumn() | L292-304 | E5,settings | 상태 처리 | 업무 |
| public retrieve() | L306-325 | E1,E2,E5,E6,E8 | 서비스 flt.Flt10_Tr.selectByTrList(companyId, personId, startDate, closeDate, preTrYn, unApprYn, trType, ioType, searchText) | 업무 |
| private setInitData() | L327-338 | settings | 상태 처리 | 업무 |
| private createRdExcel() | L340-407 | E9,E10 | 서비스 sys.Sys99_Print.insertRdTrListAdmin(windowClassName, companyId, personId, selectPersonId, startDate, closeDate, preTrYn, unApprYn, trType, ioType, searchText) | 업무 |
| private settings() | L136-263 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: empKorName="전체", empKorName=codeModel.getEmpPersonModel(, preTrCheckBox=true("사전신고 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L265-290 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L409-411 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L412-414 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L415-417 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personOrgNm', 150, '사원명'),  // L267
  gb.textCenter('inOutNm', 60, '입/출'),  // L268
  gb.textCenter('trTypeNm', 100, '매매구분'),  // L269
  gb.date('regDate', 100, '사전신고일'),  // L270
  gb.text('itemNm', 180, '사전신고종목명'),  // L271
  gb.double('expectTrQty', 80, '사전신고수량'),  // L272
  gb.long('expectTrAmt', 120, '사전신고금액'),  // L273
  gb.textCenter('statusNm', 100, '사전승인'),  // L274
  gb.date('trDate', 100, '매매일자'),  // L275
  gb.text('trItemTypeNm', 150, '종목유형'),  // L276
  gb.text('trItemNm', 180, '종목명'),  // L277
  gb.double('trQty', 80, '매매수량'),  // L278
  gb.long('trAmt', 120, '매매총액'),  // L279
  gb.double('trPlRate', 100, '손익율(%)'),  // L280
  gb.textArea('trNote', 150, '비고'),  // L281
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
3. <Button type="download" onClick={createRdExcel}>엑셀다운로드(금감원양식)</Button>

