# Icam02_Tab_CashFlow

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM 현금흐름 (#1433)
- 파일: `client/vi/icam/Icam02_Tab_CashFlow.java`
- 함께 쓰는 클래스 2개:
  - `Icam02_TabPage_CashFlowItem` `client/vi/icam/Icam02_TabPage_CashFlowItem.java`
  - `Icam02_TabPage_CashFlowDate` `client/vi/icam/Icam02_TabPage_CashFlowDate.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam02_Data.selectByTgtDate1` | Icam02_TabPage_CashFlowDate:63 | [`Icam02_Data.java:23`](../../icam/services/Icam02_Data.md) | [`icam02_data.selectByTgtDate1`](../../icam/sql/icam02_data.md) |
| `icam.Icam02_Data.selectByTgtDate2` | Icam02_TabPage_CashFlowItem:63 | [`Icam02_Data.java:28`](../../icam/services/Icam02_Data.md) | [`icam02_data.selectByTgtDate2`](../../icam/sql/icam02_data.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam02_Tab_CashFlow (`client/vi/icam/Icam02_Tab_CashFlow.java`, 130줄)

- 레이아웃: north=buttonBar, center=tabPanel
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchTextField} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField, `tabPageDate` Icam02_TabPage_CashFlowDate, `tabPageItem` Icam02_TabPage_CashFlowItem

#### 이벤트
[E0] 화면 열림 (생성자 L39-67) → setting(), retrieveTabpage()
[E1] searchTextField.KeyPress [Enter] (L84) → retrieveTabpage()
[E2] retrieveButton[조회].Select (L93) → retrieveTabpage()
[E3] tabPanel.Selection (L106) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L69-112 | 생성자 | 상태 처리 | 업무 |
| private retrieveTabpage() | L114-125 | 생성자,E1,E2,E3 | 선택 회사로 탭페이지 retrieve | 업무 |
| private setHtmlBarStyle() | L127-129 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveTabpage}>조회</Button>

### Icam02_TabPage_CashFlowItem (`client/vi/icam/Icam02_TabPage_CashFlowItem.java`, 76줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L41-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L46-49 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L51-69 | 공개 메서드 | 서비스 icam.Icam02_Data.selectByTgtDate2(companyId, orgId, userId, startDate, closeDate, searchText) | 업무 |
| public getGrid() | L72-75 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L27-38 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemCd', 150, '종목코드'),  // L31
  gb.text('itemNm', 400, '종목명'),  // L32
  gb.date('tgtDate', 100, '예정일자'),  // L33
  gb.text('trNm', 300, '거래명'),  // L34 SQL 계산 컬럼(selectById: icam01_tr_nm)
  gb.double('tgtAmt', 120, '예정금액'),  // L35
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Icam02_TabPage_CashFlowDate (`client/vi/icam/Icam02_TabPage_CashFlowDate.java`, 76줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L41-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L46-49 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L51-69 | 공개 메서드 | 서비스 icam.Icam02_Data.selectByTgtDate1(companyId, orgId, userId, startDate, closeDate, searchText) | 업무 |
| public getGrid() | L72-75 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L27-38 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L31 tgtDateString 100 "예정일자" (icam02_tgt_date_string 컬럼 없음)
  gb.text('trNm', 300, '거래명'),  // L32 SQL 계산 컬럼(selectById: icam01_tr_nm)
  gb.textCenter('itemCd', 150, '종목코드'),  // L33
  gb.text('itemNm', 400, '종목명'),  // L34
  gb.double('tgtAmt', 120, '예정금액'),  // L35
];
```

#### 사용된 버튼들
버튼 사용하지 않음

