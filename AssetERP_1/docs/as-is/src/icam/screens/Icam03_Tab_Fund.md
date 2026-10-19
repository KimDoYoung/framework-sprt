# Icam03_Tab_Fund

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM 펀드정보 (#1096)
- 파일: `client/vi/icam/Icam03_Tab_Fund.java`
- 함께 쓰는 클래스 1개:
  - `Icam03_Grid_Fund` `client/vi/icam/Icam03_Grid_Fund.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam03_Fund.selectByPaging` | Icam03_Grid_Fund:49 | [`Icam03_Fund.java:39`](../../icam/services/Icam03_Fund.md) | [`icam03_fund.selectByNamePaging`](../../icam/sql/icam03_fund.md), [`icam03_fund.selectByNameTotal`](../../icam/sql/icam03_fund.md) |
| `icam.Icam03_Fund.selectRecentFund` | Icam03_Tab_Fund:245 | [`Icam03_Fund.java:29`](../../icam/services/Icam03_Fund.md) | [`icam03_fund.selectRecentFund`](../../icam/sql/icam03_fund.md) |

## 테이블

[`icam03_fund`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam03_Tab_Fund (`client/vi/icam/Icam03_Tab_Fund.java`, 268줄)

- 레이아웃: west=vlc01, center=fundGrid
- 툴바 `buttonBar`: 운용사: {companyField} {retrieveButton}
- 툴바 `buttonBar2`: {icamButton} {extrButton} {batchForm}
- 입력·하위 화면: `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid()):
  - fundCode 70 "펀드코드" TextCenter
  - fundName 350 "펀드명" Text
  - stdDate 90 "최신적용일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L56-138) → 초기화
[E1] companyField.TriggerClick [result != null] (L60) → 인라인 L60-82 (new TriggerClickHandler() { @Override…)
[E2] retrieveButton[조회].Select (L84) → retrieve()
[E3] icamButton[ICAM Get].Select (L91) → icamFundGet()
       └ [E6] msgBox.DialogHide [YES] (L155) → batchCall()
[E4] extrButton[타사무 Get].Select (L97) → extrFundGet()
       └ [E7] msgBox.DialogHide [YES] (L179) → batchCallExtr()
[E5] grid.SelectionChanged (L104) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private icamFundGet() | L151-173 | E3 | ConfirmBox → E6 | 업무 |
| private extrFundGet() | L175-197 | E4 | ConfirmBox → E7 | 업무 |
| private batchCall() | L199-211 | E6,icamFundGet | 상태 처리 | 업무 |
| private batchCallExtr() | L213-226 | E7,extrFundGet | 상태 처리 | 업무 |
| private retrievePage() | L228-234 | E5 | 상태 처리 | 업무 |
| public retrieve() | L237-254 | E2 | 서비스 icam.Icam03_Fund.selectRecentFund(companyId) | 업무 |
| public update() | L257-258 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L261-262 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L265-266 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L140-149 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 70, '펀드코드'),  // L144
  gb.text('fundNm', 350, '펀드명'),  // L145
  gb.date('stdDate', 90, '최신적용일'),  // L146
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={icamFundGet}>ICAM Get</Button>
3. <Button type="unknown" onClick={extrFundGet}>타사무 Get</Button>

### Icam03_Grid_Fund (`client/vi/icam/Icam03_Grid_Fund.java`, 188줄)

- 레이아웃: center=vlc01
- 그리드 `grid` (buildGrid(), 체크박스):
  - stdDate 100 "일자" Date
  - fundCode 70 "펀드코드" TextCenter
  - fundName 350 "펀드명" Text
  - kofiaFundCode 120 "협회펀드코드" TextCenter
  - ksdFundCode 120 "예탁원펀드코드" TextCenter
  - ksdItemCode 120 "예탁원종목코드" TextCenter
  - trustName 100 "신탁구분" Text
  - fundTypeName 100 "펀드유형" Text
  - publicName 100 "공모/사모" Text
  - parentName 100 "모자구분" Text
  - classTypeName 100 "클래스구분" Text
  - fundUnitName 100 "단위구분" Text
  - charClassName 120 "특성분류" Text
  - diffDivYn 100 "손익차등형" BooleanYn2
  - setDate 100 "설정일자" Date
  - endDate 100 "해지일자" Date
  - endExpectDate 100 "만기예정일자" Date
  - operator1 100 "주운용역" TextCenter
  - operator2 100 "부운용역" TextCenter
  - consignmentName 120 "수탁사" Text
  - trustBankName 100 "수탁은행" Text
  - officeWorkName 120 "사무수탁사" Text
  - cur 50 "기준통화" Text
  - closeDate 100 "다음결산일" Date
  - feeDate 100 "다음보수인출일" Date
  - managementRate 100 "운용보수율(bp)" Double
  - salesRate 100 "판매보수율(bp)" Double
  - consignmentRate 100 "수탁보수율(bp)" Double
  - officeWorkRate 110 "사무수탁보수율(bp)" Double
  - setAmt 100 "설정액" Long
  - nav 100 "순자산액" Long
  - workDateString 150 "작업일시" Text
  - worker 100 "작업자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L33-63) → retrieve()
[E1] retrieveButton[조회].Select (L34) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setClear() | L106-108 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L110-141 | 생성자,E1 | 상태 처리 | 업무 |
| public retrieve() | L144-174 | 생성자,E1 | 상태 처리 | 업무 |
| public update() | L177-178 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L181-182 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L185-186 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L65-104 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '일자'),  // L69
  gb.textCenter('fundCd', 70, '펀드코드'),  // L70
  gb.text('fundNm', 350, '펀드명'),  // L71
  gb.textCenter('kofiaFundCd', 120, '협회펀드코드'),  // L72
  gb.textCenter('ksdFundCd', 120, '예탁원펀드코드'),  // L73
  gb.textCenter('ksdItemCd', 120, '예탁원종목코드'),  // L74
  gb.text('trustNm', 100, '신탁구분'),  // L75 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamTrustCode' , icam03_trust_c…)
  gb.text('fundTypeNm', 100, '펀드유형'),  // L76 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamFundType' , icam03_fund_typ…)
  gb.text('publicNm', 100, '공모/사모'),  // L77 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamPublicCode' , icam03_public…)
  gb.text('parentNm', 100, '모자구분'),  // L78 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamParentCode' , icam03_parent…)
  gb.text('classTypeNm', 100, '클래스구분'),  // L79 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamClassType' , icam03_class_t…)
  gb.text('fundUnitNm', 100, '단위구분'),  // L80 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamFundUnitCode' , icam03_fund…)
  gb.text('charClassNm', 120, '특성분류'),  // L81 SQL 계산 컬럼(selectByNamePaging: f_cdnm('IcamCharClassCode', icam03_char…)
  gb.booleanYn2('diffDivYn', 100, '손익차등형'),  // L82
  gb.date('setDate', 100, '설정일자'),  // L83
  gb.date('endDate', 100, '해지일자'),  // L84
  gb.date('endExpectDate', 100, '만기예정일자'),  // L85
  gb.textCenter('operator1', 100, '주운용역'),  // L86
  gb.textCenter('operator2', 100, '부운용역'),  // L87
  gb.text('consignmentNm', 120, '수탁사'),  // L88
  gb.text('trustBankNm', 100, '수탁은행'),  // L89
  gb.text('officeWorkNm', 120, '사무수탁사'),  // L90
  gb.text('cur', 50, '기준통화'),  // L91
  gb.date('closeDate', 100, '다음결산일'),  // L92
  gb.date('feeDate', 100, '다음보수인출일'),  // L93
  gb.double('managementRate', 100, '운용보수율(bp)'),  // L94
  gb.double('salesRate', 100, '판매보수율(bp)'),  // L95
  gb.double('consignmentRate', 100, '수탁보수율(bp)'),  // L96
  gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),  // L97
  gb.long('setAmt', 100, '설정액'),  // L98
  gb.long('nav', 100, '순자산액'),  // L99
  gb.text('workDateString', 150, '작업일시'),  // L100 SQL 계산 컬럼(selectByNamePaging: to_char(icam03_work_date,'yyyy-mm-dd HH…)
  gb.text('worker', 100, '작업자'),  // L101
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

