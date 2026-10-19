# Pay50_Tab_AccountSumList

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 사업비발생현황 (#1399)
- 파일: `client/vi/pay/Pay50_Tab_AccountSumList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay50_Expense.selectExpenseAccountSum` | Pay50_Tab_AccountSumList:148 | [`Pay50_Expense.java:109`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectExpenseAccountSum`](../../pay/sql/pay50_expense.md) |
| `sys.Sys99_Print.insertRdAccountSumList` | Pay50_Tab_AccountSumList:160 | [`Sys99_Print.java:4339`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay50_expense.selectExpenseAccountSum`](../../pay/sql/pay50_expense.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast21_tr_4insure`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_account_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_AccountSumList (`client/vi/pay/Pay50_Tab_AccountSumList.java`, 214줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년도: {yearText} 검색: {searchText} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `searchText` TextField 빈칸="계정과목"
- 그리드 `grid` (buildGrid()):
  - accountName 200 "계정과목" Text
  - month01Amt 100 "1월" Long
  - month02Amt 100 "2월" Long
  - month03Amt 100 "3월" Long
  - month04Amt 100 "4월" Long
  - month05Amt 100 "5월" Long
  - month06Amt 100 "6월" Long
  - month07Amt 100 "7월" Long
  - month08Amt 100 "8월" Long
  - month09Amt 100 "9월" Long
  - month10Amt 100 "10월" Long
  - month11Amt 100 "11월" Long
  - month12Amt 100 "12월" Long
  - yearAmt 100 "계" Long

#### 이벤트
[E0] 화면 열림 (생성자 L48-77) → settings(), retrieve()
[E1] yearText.KeyPress [Enter] (L84) → retrieve()
[E2] searchText.KeyPress [Enter] (L95) → retrieve()
[E3] retrieveButton[조회].Select (L104) → retrieve()
[E4] downloadButton[엑셀다운로드].Select (L111) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L141-155 | 생성자,E1,E2,E3 | 서비스 pay.Pay50_Expense.selectExpenseAccountSum(companyId, year, searchText), 건수 표시 | 업무 |
| private createRdExcel() | L157-209 | E4 | 서비스 sys.Sys99_Print.insertRdAccountSumList(companyId, personId, windowClassName, year, searchText) | 업무 |
| private settings() | L79-117 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L211-213 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('accountNm', 200, '계정과목'),  // L123
  gb.long('month01Amt', 100, '1월'),  // L124
  gb.long('month02Amt', 100, '2월'),  // L125
  gb.long('month03Amt', 100, '3월'),  // L126
  gb.long('month04Amt', 100, '4월'),  // L127
  gb.long('month05Amt', 100, '5월'),  // L128
  gb.long('month06Amt', 100, '6월'),  // L129
  gb.long('month07Amt', 100, '7월'),  // L130
  gb.long('month08Amt', 100, '8월'),  // L131
  gb.long('month09Amt', 100, '9월'),  // L132
  gb.long('month10Amt', 100, '10월'),  // L133
  gb.long('month11Amt', 100, '11월'),  // L134
  gb.long('month12Amt', 100, '12월'),  // L135
  gb.long('yearAmt', 100, '계'),  // L136
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

