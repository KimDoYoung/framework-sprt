# Icam06_Tab_FundPrice

- 종류: 화면
- 메뉴: 펀드관리 > 20. 운용현황 > 펀드별 기준가 현황 (#1475)
- 파일: `client/vi/icam/Icam06_Tab_FundPrice.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam06_FundBook.selectIcamFundPrice` | Icam06_Tab_FundPrice:113 | [`Icam06_FundBook.java:26`](../../icam/services/Icam06_FundBook.md) | [`icam06_fund_book.selectFundPrice`](../../icam/sql/icam06_fund_book.md) |
| `sys.Sys99_Print.insertRdFundPrice` | Icam06_Tab_FundPrice:124 | [`Sys99_Print.java:5056`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam06_fund_book.selectFundPrice`](../../icam/sql/icam06_fund_book.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam06_Tab_FundPrice (`client/vi/icam/Icam06_Tab_FundPrice.java`, 183줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일자: {startDate} {retrieveButton} {downLoadButton}
- 입력·하위 화면: `startDate` MyDateField
- 그리드 `grid` (buildGrid()):
  - fundCode 100 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - cur 60 "통화" TextCenter
  - forPrincipal 150 "원본액" Double
  - principalDiff 120 "원본액<br>전일대비" DoubleColor
  - forNav 150 "순자산액" Double
  - navDiff 120 "순자산액<br>전일대비" DoubleColor
  - forStdPrice 100 "기준가" Double
  - stdPriceDiff 100 "기준가<br>전일대비" DoubleColor
  - forTaxPrice 100 "과표기준가" Double
  - taxPriceDiff 100 "과표기준가<br>전일대비" DoubleColor

#### 이벤트
[E0] 화면 열림 (생성자 L45-66) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L74) → retrieve()
[E2] downLoadButton[엑셀다운로드].Select (L80) → downLoad()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L106-119 | 생성자,E1 | 서비스 icam.Icam06_FundBook.selectIcamFundPrice(companyId, stdDate) | 업무 |
| private downLoad() | L121-170 | E2 | 서비스 sys.Sys99_Print.insertRdFundPrice(companyId, personId, windowClassName, stdDate) | 업무 |
| private stdDateStr() | L172-178 | downLoad | 상태 처리 | 업무 |
| private settings() | L68-86 | 생성자 | 이벤트 연결, 초기값: startDate=preDay | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L88-104 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L180-182 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 100, '펀드코드'),  // L91
  gb.text('fundNm', 400, '펀드명'),  // L92
  gb.textCenter('cur', 60, '통화'),  // L93
  gb.double('forPrincipal', 150, '원본액'),  // L94
  gb.doubleColor('principalDiff', 120, '원본액<br>전일대비'),  // L95 SQL 계산 컬럼(selectFundPrice: COALESCE(principal_diff,0))
  gb.double('forNav', 150, '순자산액'),  // L96
  gb.doubleColor('navDiff', 120, '순자산액<br>전일대비'),  // L97 SQL 계산 컬럼(selectFundPrice: COALESCE(nav_diff ,0))
  gb.double('forStdPrice', 100, '기준가'),  // L98
  gb.doubleColor('stdPriceDiff', 100, '기준가<br>전일대비'),  // L99 SQL 계산 컬럼(selectFundPrice: COALESCE(std_price_diff,0))
  gb.double('forTaxPrice', 100, '과표기준가'),  // L100
  gb.doubleColor('taxPriceDiff', 100, '과표기준가<br>전일대비'),  // L101 SQL 계산 컬럼(selectFundPrice: COALESCE(tax_price_diff,0))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={downLoad}>엑셀다운로드</Button>

