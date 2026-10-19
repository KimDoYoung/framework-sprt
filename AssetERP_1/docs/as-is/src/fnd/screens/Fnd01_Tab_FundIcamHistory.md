# Fnd01_Tab_FundIcamHistory

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드 조회(변경이력) (#1327)
- 파일: `client/vi/fnd/Fnd01_Tab_FundIcamHistory.java`
- 함께 쓰는 클래스 1개:
  - `Fnd01_Grid_FundIcamHistory` `client/vi/fnd/Fnd01_Grid_FundIcamHistory.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.selectByHistoryCompanyId` | Fnd01_Tab_FundIcamHistory:134 | [`Fnd01_FundCode.java:331`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByHistoryCompanyId`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd02_FundInfo.selectByPaging` | Fnd01_Grid_FundIcamHistory:34 | [`Fnd02_FundInfo.java:35`](../../fnd/services/Fnd02_FundInfo.md) | [`fnd02_fund_info.selectByNamePaging`](../../fnd/sql/fnd02_fund_info.md), [`fnd02_fund_info.selectByNameTotal`](../../fnd/sql/fnd02_fund_info.md) |

## 테이블

[`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Tab_FundIcamHistory (`client/vi/fnd/Fnd01_Tab_FundIcamHistory.java`, 164줄)

- 레이아웃: north=buttonBar, west=grid, center=fundInfoGrid
- 툴바 `buttonBar`: 검색: {searchTextField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `searchTextField` TextField 빈칸="펀드코드/펀드명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 110 "펀드코드" TextCenter
  - fundName 350 "펀드명" Text
  - workDate 90 "최신적용일" Date
  - startDate 90 "설정일" Date
  - endDate 90 "해지일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L42-100) → retrieve()
[E1] searchTextField.KeyPress [Enter] (L43) → retrieve()
[E2] retrieveButton[조회].Select (L52) → retrieve()
[E3] grid.SelectionChanged (L60) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrievePage() | L116-123 | E3 | 상태 처리 | 업무 |
| public retrieve() | L126-143 | 생성자,E1,E2 | 서비스 fnd.Fnd01_FundCode.selectByHistoryCompanyId(companyId, stdDate, searchText, closeYn) | 업무 |
| public update() | L146-147 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L150-151 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L154-155 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L102-113 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L157-159 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L160-162 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 110, '펀드코드'),  // L106
  gb.text('fundNm', 350, '펀드명'),  // L107
  gb.date('workDate', 90, '최신적용일'),  // L108
  gb.date('startDate', 90, '설정일'),  // L109
  gb.date('endDate', 90, '해지일'),  // L110
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Fnd01_Grid_FundIcamHistory (`client/vi/fnd/Fnd01_Grid_FundIcamHistory.java`, 116줄)

- 레이아웃: center=vlc01
- 그리드 `grid` (buildGrid()):
  - workDate 100 "기준일자" Date
  - fundName 300 "펀드명" Text
  - fundFullName 350 "펀드명(Full)" Text
  - kofiaFundCode 120 "협회펀드코드" TextCenter
  - ksdFundCode 120 "예탁원펀드코드" TextCenter
  - ksdItemCode 120 "예탁원종목코드" TextCenter
  - kofiaTrustName 100 "신탁구분" Text
  - kofiaFundTypeName 100 "펀드유형" Text
  - kofiaPublicName 100 "공모사모코드" Text
  - kofiaParentName 100 "모자구분" Text
  - kofiaClassTypeName 100 "클래스구분" Text
  - kofiaFundUnitName 100 "단위구분" Text
  - kofiaCharClassName 130 "특성분류" Text
  - orgCodeName 100 "운용부서명" Text
  - operator1 100 "주운운용역" Text
  - operator2 100 "부운운용역" Text
  - cur 50 "기준통화" Text
  - seoljAek 120 "설정액" Long
  - sunjasanAek 120 "순자산" Long
  - stdPrice 100 "기준가" Double
  - nextCloseDate 100 "다음결산일" Date
  - nextFeeDate 100 "다음보수인출일" Date
  - endExpectDate 100 "만기예정일" Date
  - consignmentName 150 "수탁사" Text
  - trustBankName 100 "수탁은행" Text
  - officeWorkName 150 "사무수탁사" Text
  - managementRate 100 "운용보수율(bp)" Double
  - salesRate 100 "판매보수율(bp)" Double
  - consignmentRate 100 "수탁보수율(bp)" Double
  - officeWorkRate 110 "사무수탁보수율(bp)" Double

#### 이벤트
[E0] 화면 열림 (생성자 L28-49) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setClear() | L90-92 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L94-113 | 생성자 | 상태 처리 | 업무 |
| public buildGrid() | L51-88 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('workDate', 100, '기준일자'),  // L56
  gb.text('fundNm', 300, '펀드명'),  // L57
  gb.text('fundFullNm', 350, '펀드명(Full)'),  // L58
  gb.textCenter('kofiaFundCd', 120, '협회펀드코드'),  // L59
  gb.textCenter('ksdFundCd', 120, '예탁원펀드코드'),  // L60
  gb.textCenter('ksdItemCd', 120, '예탁원종목코드'),  // L61
  gb.text('kofiaTrustNm', 100, '신탁구분'),  // L62 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamTrustCode', fnd02_kofia_tru…)
  gb.text('kofiaFundTypeNm', 100, '펀드유형'),  // L63 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamFundType', fnd02_kofia_fund…)
  gb.text('kofiaPublicNm', 100, '공모사모코드'),  // L64 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamPublicCode', fnd02_kofia_pu…)
  gb.text('kofiaParentNm', 100, '모자구분'),  // L65 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamParentCode', fnd02_kofia_pa…)
  gb.text('kofiaClassTypeNm', 100, '클래스구분'),  // L66 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamClassType', fnd02_kofia_cla…)
  gb.text('kofiaFundUnitNm', 100, '단위구분'),  // L67 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamFundUnitCode', fnd02_kofia_…)
  gb.text('kofiaCharClassNm', 130, '특성분류'),  // L68 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamCharClassCode', fnd02_kofia…)
  gb.text('orgCodeNm', 100, '운용부서명'),  // L69
  gb.text('operator1', 100, '주운운용역'),  // L70
  gb.text('operator2', 100, '부운운용역'),  // L71
  gb.text('cur', 50, '기준통화'),  // L72
  gb.long('seoljAek', 120, '설정액'),  // L73
  gb.long('sunjasanAek', 120, '순자산'),  // L74
  gb.double('stdPrice', 100, '기준가'),  // L75 SQL 계산 컬럼(selectByNamePaging: std_price)
  gb.date('nextCloseDate', 100, '다음결산일'),  // L76
  gb.date('nextFeeDate', 100, '다음보수인출일'),  // L77
  gb.date('endExpectDate', 100, '만기예정일'),  // L78
  gb.text('consignmentNm', 150, '수탁사'),  // L79 SQL 계산 컬럼(selectByNamePaging: ( SELECT fnd03_consignment_nm FROM fnd0…)
  gb.text('trustBankNm', 100, '수탁은행'),  // L80 SQL 계산 컬럼(selectByNamePaging: ( SELECT fnd09_trust_bank_nm FROM fnd09…)
  gb.text('officeWorkNm', 150, '사무수탁사'),  // L81 SQL 계산 컬럼(selectByNamePaging: ( SELECT fnd06_office_work_nm FROM fnd0…)
  gb.double('managementRate', 100, '운용보수율(bp)'),  // L82
  gb.double('salesRate', 100, '판매보수율(bp)'),  // L83
  gb.double('consignmentRate', 100, '수탁보수율(bp)'),  // L84
  gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),  // L85
];
```

#### 사용된 버튼들
버튼 사용하지 않음

