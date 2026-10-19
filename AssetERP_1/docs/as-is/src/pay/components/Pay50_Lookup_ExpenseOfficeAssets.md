# Pay50_Lookup_ExpenseOfficeAssets

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`
- 파일: `client/vi/pay/Pay50_Lookup_ExpenseOfficeAssets.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay50_Expense.selectOfficeAssets` | Pay50_Lookup_ExpenseOfficeAssets:160 | [`Pay50_Expense.java:115`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectOfficeAssets`](../../pay/sql/pay50_expense.md) |

## 테이블

[`act13_real_account_map`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`pay50_expense`](../../../db/tables/pay.md)

## DB 함수

`f_get_corp_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Lookup_ExpenseOfficeAssets (`client/vi/pay/Pay50_Lookup_ExpenseOfficeAssets.java`, 181줄)

- 툴바 `buttonBar`: 발생일자: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="지출내역/지출처"
- 그리드 `grid` (buildGrid(), 체크박스):
  - occDate 100 "발생일자" Date
  - desc 300 "지출내역" TextArea
  - corpName 150 "지출처" Text
  - settleAmt 120 "지출금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L52-58) → 초기화
[E1] searchText.KeyPress [Enter] (L104) → retrieve()
[E2] grid.RowDoubleClick (L113) → selectExpense()
[E3] retrieveButton[조회].Select (L120) → retrieve()
[E4] selectButton[선택].Select (L126) → selectExpense()
[E5] closeButton[닫기].Select (L132) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-89 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L91-138 | open | 상태 처리 | 업무 |
| private retrieve() | L154-161 | E1,E3,open | 서비스 pay.Pay50_Expense.selectOfficeAssets(companyId, startDate, closeDate, searchText) | 업무 |
| private selectExpense() | L163-173 | E2,E4 | 미선택 시 alert "내역을 선택하세요" | 업무 |
| private buildGrid() | L140-152 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L175-177 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L178-180 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 100, '발생일자'),  // L146
  gb.textArea('desc', 300, '지출내역'),  // L147
  gb.text('corpNm', 150, '지출처'),  // L148
  gb.long('settleAmt', 120, '지출금액'),  // L149
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={selectExpense}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

