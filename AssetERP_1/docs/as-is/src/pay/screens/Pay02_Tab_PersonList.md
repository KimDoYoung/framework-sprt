# Pay02_Tab_PersonList

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리(Old) > 급여명세서(old) (#1085)
- 파일: `client/vi/pay/Pay02_Tab_PersonList.java`
- 함께 쓰는 클래스 1개:
  - `Pay02_Rd_PersonList` `client/vi/pay/Pay02_Rd_PersonList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay02_Month.selectByYearPersonId` | Pay02_Tab_PersonList:143 | [`Pay02_Month.java:51`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByYearPersonId`](../../pay/sql/pay02_month.md) |

## 테이블

[`pay02_month`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay02_Tab_PersonList (`client/vi/pay/Pay02_Tab_PersonList.java`, 158줄)

- 레이아웃: north=buttonBar, west=grid, center=rdPayForm
- 툴바 `buttonBar`: 해당 연도: {yearText} {retrieveButton}
- 입력·하위 화면: `yearText` TextField
- 그리드 `grid` (buildGrid()):
  - payDate 120 "일자" Date
  - payName 80 "구분" TextCenter
  - realPay 160 "실수령액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L38-94) → retrieve()
[E1] retrieveButton[조회].Select (L48) → retrieve()
[E2] grid.CellClick (L77) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L126-134 | E2,retrieve | 상태 처리 | 업무 |
| public retrieve() | L136-153 | 생성자,E1 | 서비스 pay.Pay02_Month.selectByYearPersonId(companyId, personId, year) | 업무 |
| public buildGrid() | L96-112 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L155-157 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('payDate', 120, '일자'),  // L105
  gb.textCenter('payNm', 80, '구분'),  // L106 SQL 계산 컬럼(selectByYearPersonId: f_cdnm('PayMonthCode', pay02_pay_cd, pa…)
  gb.long('realPay', 160, '실수령액'),  // L107
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pay02_Rd_PersonList (`client/vi/pay/Pay02_Rd_PersonList.java`, 73줄)


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

