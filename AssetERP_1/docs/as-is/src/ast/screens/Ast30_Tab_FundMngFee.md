# Ast30_Tab_FundMngFee

- 종류: 화면
- 메뉴: 관리회계 > 30. 펀드운용보수관리 > 펀드보수현황 (#1401)
- 파일: `client/vi/ast/Ast30_Tab_FundMngFee.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast30_BookFundFee.selectByStdDate` | Ast30_Tab_FundMngFee:116 | [`Ast30_BookFundFee.java:66`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByStdDate`](../../ast/sql/ast30_book_fund_fee.md) |

## 테이블

[`ast30_book_fund_fee`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast30_Tab_FundMngFee (`client/vi/ast/Ast30_Tab_FundMngFee.java`, 131줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="펀드코드/펀드명"
- 그리드 `grid` (buildGrid()):
  - fundCode 100 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - preFee 120 "전월 잔액" Long
  - occFee 120 "당월 발생액" Long
  - drawFee 120 "당월 인출액" Long
  - fee 120 "당월 잔액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L39-68) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L80) → retrieve()
[E2] retrieveButton[조회].Select (L89) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L70-95 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L109-125 | 생성자,E1,E2 | 서비스 ast.Ast30_BookFundFee.selectByStdDate(companyId, stdDate, searchText) | 업무 |
| private buildGrid() | L97-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L127-129 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 100, '펀드코드'),  // L99
  gb.text('fundNm', 400, '펀드명'),  // L100
  gb.long('preFee', 120, '전월 잔액'),  // L101 SQL 계산 컬럼(selectByStdDate: pre.ast30_fee)
  gb.long('occFee', 120, '당월 발생액'),  // L102 SQL 계산 컬럼(selectByStdDate: occ.occ_fee)
  gb.long('drawFee', 120, '당월 인출액'),  // L103 SQL 계산 컬럼(selectByStdDate: occ.draw_fee)
  gb.long('fee', 120, '당월 잔액'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

