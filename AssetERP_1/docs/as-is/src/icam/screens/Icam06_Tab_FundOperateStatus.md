# Icam06_Tab_FundOperateStatus

- 종류: 화면
- 메뉴: 펀드관리 > 20. 운용현황 > 펀드운용현황(펀드합계) (#1323)
- 파일: `client/vi/icam/Icam06_Tab_FundOperateStatus.java`
- 함께 쓰는 클래스 1개:
  - `Icam06_Grid_FundOperateStatus` `client/vi/icam/Icam06_Grid_FundOperateStatus.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam06_FundBook.selectByStdDate` | Icam06_Grid_FundOperateStatus:57 | [`Icam06_FundBook.java:21`](../../icam/services/Icam06_FundBook.md) | [`icam06_fund_book.selectByStdDate`](../../icam/sql/icam06_fund_book.md) |
| `icam.Icam06_FundBook.selectFundBookAvg` | Icam06_Tab_FundOperateStatus:197 | [`Icam06_FundBook.java:34`](../../icam/services/Icam06_FundBook.md) | [`icam06_fund_book.calcStartRow`](../../icam/sql/icam06_fund_book.md), [`icam06_fund_book.selectFundBookAvg`](../../icam/sql/icam06_fund_book.md) |
| `sys.Sys99_Print.insertRdFundOperateStatus` | Icam06_Tab_FundOperateStatus:219 | [`Sys99_Print.java:2894`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam06_fund_book.calcStartRow`](../../icam/sql/icam06_fund_book.md), [`icam06_fund_book.selectFundBookAvg`](../../icam/sql/icam06_fund_book.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_calc_fundbookavg`, `f_get_datedif`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam06_Tab_FundOperateStatus (`client/vi/icam/Icam06_Tab_FundOperateStatus.java`, 274줄)

- 레이아웃: north=vlc, center=fundGrid
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 펀드구분: {fundTypeComboBox} 검색: {searchText} {retrieveButton} {rdButton} {notice}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `fundTypeComboBox` ComboBoxField("FundType"), `searchText` TextField 빈칸="펀드코드/펀드명"
- 그리드 `grid` (buildGrid()):
  - stdDate 110 "일자" Date
  - principal 200 "원본액" Long
  - nav 200 "순자산" Long
  - totalAsset 200 "총자산" Long
  - navAvg 200 "순자산평잔 (3개월 이동평균)" Long
  - totalAssetAvg 200 "총자산평잔 (3개월 이동평균)" Long

#### 이벤트
[E0] 화면 열림 (생성자 L61-102) → settings()
[E1] fundTypeComboBox[FundType].Collapse [preValue == null] (L120) → retrieve()
[E2] searchText.KeyPress [Enter] (L141) → retrieve()
[E3] retrieveButton[조회].Select (L150) → retrieve()
[E4] rdButton[출력/다운로드].Select (L156) → createPrint()
[E5] grid.RowClick (L163) → fundRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L186-207 | E1,E2,E3 | 서비스 icam.Icam06_FundBook.selectFundBookAvg(companyId, startDate, closeDate, fundType, searchText) | 업무 |
| private fundRetrieve() | L209-212 | E5,retrieve | 상태 처리 | 업무 |
| private getSearchText() | L214-216 | retrieve,fundRetrieve,createPrint | 상태 처리 | 업무 |
| private createPrint() | L218-264 | E4 | 서비스 sys.Sys99_Print.insertRdFundOperateStatus(companyId, personId, windowClassName, startDate, closeDate, fundType, searchText) | 업무 |
| private settings() | L104-169 | 생성자 | 이벤트 연결, 초기값: closeDate=closeDate, startDate=startDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L171-184 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L266-268 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L270-272 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 110, '일자'),  // L176
  gb.long('principal', 200, '원본액'),  // L177
  gb.long('nav', 200, '순자산'),  // L178
  gb.long('totalAsset', 200, '총자산'),  // L179
  gb.long('navAvg', 200, '순자산평잔 (3개월 이동평균)'),  // L180 SQL 계산 컬럼(selectFundBookAvg: f_calc_FundBookAvg(icam06_company_id, i…)
  gb.long('totalAssetAvg', 200, '총자산평잔 (3개월 이동평균)'),  // L181 SQL 계산 컬럼(selectFundBookAvg: f_calc_FundBookAvg(icam06_company_id, i…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createPrint}>출력/다운로드</Button>

### Icam06_Grid_FundOperateStatus (`client/vi/icam/Icam06_Grid_FundOperateStatus.java`, 64줄)

- 레이아웃: center=grid
- 그리드 `grid` (buildGrid()):
  - stdDate 110 "계산일자" Date
  - fundCode 100 "펀드코드" TextCenter
  - fundName 350 "펀드명" Text
  - principal 150 "원본액" Long
  - nav 150 "순자산액" Long
  - totalAsset 150 "총자산액" Long
  - setQty 150 "설정좌수" Long
  - stdPrice 150 "기준가" Double
  - cur 100 "펀드통화" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L21-27) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L47-63 | 공개 메서드 | 서비스 icam.Icam06_FundBook.selectByStdDate(companyId, stdDate, fundType, searchText) | 업무 |
| public buildGrid() | L29-45 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 110, '계산일자'),  // L34
  gb.textCenter('fundCd', 100, '펀드코드'),  // L35
  gb.text('fundNm', 350, '펀드명'),  // L36
  gb.long('principal', 150, '원본액'),  // L37
  gb.long('nav', 150, '순자산액'),  // L38
  gb.long('totalAsset', 150, '총자산액'),  // L39
  gb.long('setQty', 150, '설정좌수'),  // L40
  gb.double('stdPrice', 150, '기준가'),  // L41
  gb.textCenter('cur', 100, '펀드통화'),  // L42
];
```

#### 사용된 버튼들
버튼 사용하지 않음

