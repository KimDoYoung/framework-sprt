# Pay10_Tab_PersonList

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 급여명세서 (#1272)
- 파일: `client/vi/pay/Pay10_Tab_PersonList.java`
- 함께 쓰는 클래스 1개:
  - `Pay10_Rd_PersonList` `client/vi/pay/Pay10_Rd_PersonList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay10_Month.selectByMonthIdCount` | Pay10_Tab_PersonList:116, Pay10_Tab_PersonList:120 | [`Pay10_Month.java:137`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByMonthIdCount`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectByYearPersonId` | Pay10_Tab_PersonList:162 | [`Pay10_Month.java:105`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByYearPersonId`](../../pay/sql/pay10_month.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay10_Tab_PersonList (`client/vi/pay/Pay10_Tab_PersonList.java`, 177줄)

- 레이아웃: north=buttonBar, west=grid, center=rdPayForm
- 툴바 `buttonBar`: 해당 연도: {yearText} {retrieveButton}
- 입력·하위 화면: `yearText` TextField
- 그리드 `grid` (buildGrid()):
  - date 100 "일자" Date
  - payName 80 "구분" TextCenter
  - deductionSum 100 "실수령액" Long
  - paySum 100 "급여액" Long
  - incomeTaxSum 100 "소득세액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L47-97) → retrieve()
[E1] yearText.KeyPress (L51) → retrieve()
[E2] retrieveButton[조회].Select (L63) → retrieve()
[E3] grid.CellClick (L90) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L110-153 | E3,retrieve | 서비스 pay.Pay10_Month.selectByMonthIdCount, pay.Pay10_Month.selectByMonthIdCount | 업무 |
| public retrieve() | L155-172 | 생성자,E1,E2 | 서비스 pay.Pay10_Month.selectByYearPersonId(companyId, personId, year) | 업무 |
| public buildGrid() | L99-108 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L101
  gb.textCenter('payNm', 80, '구분'),  // L102
  gb.long('deductionSum', 100, '실수령액'),  // L103
  gb.long('paySum', 100, '급여액'),  // L104
  gb.long('incomeTaxSum', 100, '소득세액'),  // L105
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pay10_Rd_PersonList (`client/vi/pay/Pay10_Rd_PersonList.java`, 73줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-51 | 공개 메서드 | 상태 처리 | 업무 |
| public rdClear() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L58-59 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L62-63 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L66-67 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L70-71 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

