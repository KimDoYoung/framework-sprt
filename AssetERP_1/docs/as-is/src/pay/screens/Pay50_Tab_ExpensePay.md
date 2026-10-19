# Pay50_Tab_ExpensePay

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 자금집행결의서 조회 (#1400)
- 파일: `client/vi/pay/Pay50_Tab_ExpensePay.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Sys15_Lookup_TelInfo`](../../sys/components/Sys15_Lookup_TelInfo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay50_Tab_ExpensePay:236 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `pay.Pay50_Expense.selectBySettleApprId` | Pay50_Tab_ExpensePay:225 | [`Pay50_Expense.java:103`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectBySettleApprId`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.selectBySettleDate` | Pay50_Tab_ExpensePay:204 | [`Pay50_Expense.java:97`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectBySettleDate`](../../pay/sql/pay50_expense.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_ExpensePay (`client/vi/pay/Pay50_Tab_ExpensePay.java`, 270줄)

- 레이아웃: north=buttonBar, west=grid, center=detailGrid
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {statusCheckBox} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="상신제목/지출내역/지출처", `statusCheckBox` CheckBox, `lookup` Sys15_Lookup_TelInfo, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - settleDate 90 "지급일자" Date
  - settleApprTitle 200 "상신제목" Text
  - count 70 "지급건수" TextCenter
  - settleAmt 100 "지급총액" Long
  - settleApprStatusName 80 "결재상태" TextCenter
  - actionCell 80 "집행결의서" Cell 편집:viewCell
- 그리드 `detailGrid` (buildDetailGrid()):
  - occDate 90 "발생일자" Date
  - expenseName 100 "구분" Text
  - desc 300 "지출내역" Text
  - corpName 130 "지출처" Text
  - settleAmt 100 "지급금액" Long
  - payMethodName 80 "지급방법" TextCenter
  - actionCell 80 "지출결의서" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L59-99) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L116) → retrieve()
[E2] retrieveButton[조회].Select (L128) → retrieve()
[E3] grid.RowClick (L134) → retrieveDetail()
[E4] detailGrid.CellDoubleClick [event.getCellIndex() == 4] (L140) → 인라인 L140-149 (new CellDoubleClickHandler() { @Overr…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildDetailGrid() | L173-193 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L195-217 | 생성자,E1,E2 | 서비스 pay.Pay50_Expense.selectBySettleDate(companyId, startDate, closeDate, statusCheckYn, searchText) | 업무 |
| private retrieveDetail() | L219-231 | E3,retrieve | 서비스 pay.Pay50_Expense.selectBySettleApprId(settleApprId) | 업무 |
| private lookupAppr() | L233-262 | buildGrid,buildDetailGrid | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private settings() | L101-150 | 생성자 | 조회창 Sys15_Lookup_TelInfo 열기, 이벤트 연결, 초기값: startDate=start, closeDate=close, statusCheckBox=true("완료/반려건 제외") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L152-171 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L264-266 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L267-269 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('settleDate', 90, '지급일자'),  // L163
  gb.text('settleApprTitle', 200, '상신제목'),  // L164
  gb.textCenter('count', 70, '지급건수'),  // L165
  gb.long('settleAmt', 100, '지급총액'),  // L166
  gb.textCenter('settleApprStatusNm', 80, '결재상태'),  // L167
  // ⚠ 대응 없음 (GridBuilder L168) addCell
];

const buildDetailGrid = () => [
  gb.date('occDate', 90, '발생일자'),  // L184
  gb.text('expenseNm', 100, '구분'),  // L185
  gb.text('desc', 300, '지출내역'),  // L186
  gb.text('corpNm', 130, '지출처'),  // L187
  gb.long('settleAmt', 100, '지급금액'),  // L188
  gb.textCenter('payMethodNm', 80, '지급방법'),  // L189
  // ⚠ 대응 없음 (GridBuilder L190) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

