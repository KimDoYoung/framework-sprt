# Fnd01_Tab_FundSearchIcam

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드 조회 (ICAM) (#1099, 미사용)
- 파일: `client/vi/fnd/Fnd01_Tab_FundSearchIcam.java`
- 함께 쓰는 클래스 1개:
  - `Fnd01_Edit_FundSearchIcam` `client/vi/fnd/Fnd01_Edit_FundSearchIcam.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.selectByFundName` | Fnd01_Tab_FundSearchIcam:185 | [`Fnd01_FundCode.java:38`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundName`](../../fnd/sql/fnd01_fund_code.md) |

## 테이블

[`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Tab_FundSearchIcam (`client/vi/fnd/Fnd01_Tab_FundSearchIcam.java`, 215줄)

- 레이아웃: center=vlc, south=editFundCodeForm
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 클래스구분: {classTypeComboBox} 검색: {fundSearchTextField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `fundSearchTextField` TextField 빈칸="펀드코드/펀드명/협회코드/예탁원코드/수탁사/사무수탁사", `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `classTypeComboBox` ComboBoxField("IcamClassType", "%", "전체"), `editFundCodeForm` Fnd01_Edit_FundSearchIcam
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 90 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - kofiaFundCode 120 "협회등록코드" TextCenter
  - ksdFundCode 120 "예탁원펀드코드" TextCenter
  - ksdItemCode 120 "예탁원종목코드" TextCenter
  - kofiaFundTypeName 150 "펀드유형" Text
  - kofiaClassTypeName 100 "클래스구분" Text
  - startDate 90 "설정일" Date
  - endDate 90 "해지일" Date
  - closeName 70 "해지여부" Text
  - kofiaTrustName 120 "신탁구분" Text
  - kofiaPublicName 130 "공모구분" Text
  - consignmentName 150 "수탁사" Text
  - trustBankName 150 "수탁은행" Text
  - officeWorkName 150 "사무수탁사" Text
  - operator1 90 "주운용역" TextCenter
  - operator2 90 "부운용역" TextCenter
  - managementRate 100 "운용보수율(bp)" Double
  - salesRate 100 "판매보수율(bp)" Double
  - consignmentRate 100 "수탁보수율(bp)" Double
  - officeWorkRate 110 "사무수탁보수율(bp)" Double
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L49-85) → settings()
[E1] retrieveButton[조회].Select (L99) → retrieve()
[E2] fundSearchTextField.KeyPress [Enter] (L107) → retrieve()
[E3] grid.SelectionChanged [선택>0] (L116) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L157-169 | E3 | 상태 처리 | 업무 |
| public retrieve() | L172-194 | E1,E2 | 서비스 fnd.Fnd01_FundCode.selectByFundName(companyId, closeYn, startDate, fundName, fundTypeCode, classTypeCode, planYn, icamYn) | 업무 |
| public update() | L197-198 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L201-202 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L205-206 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L87-124 | 생성자 | 이벤트 연결, 초기값: fundTypeComboBox="전체"("IcamFundType"), classTypeComboBox="전체"("IcamClassType"), closeYnCheckBox=false("해지펀드포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L126-155 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L208-210 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L212-214 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 90, '펀드코드'),  // L131
  gb.text('fundNm', 400, '펀드명'),  // L132
  gb.textCenter('kofiaFundCd', 120, '협회등록코드'),  // L133
  gb.textCenter('ksdFundCd', 120, '예탁원펀드코드'),  // L134
  gb.textCenter('ksdItemCd', 120, '예탁원종목코드'),  // L135
  gb.text('kofiaFundTypeNm', 150, '펀드유형'),  // L136
  gb.text('kofiaClassTypeNm', 100, '클래스구분'),  // L137
  gb.date('startDate', 90, '설정일'),  // L138
  gb.date('endDate', 90, '해지일'),  // L139
  gb.text('closeNm', 70, '해지여부'),  // L140
  gb.text('kofiaTrustNm', 120, '신탁구분'),  // L141
  gb.text('kofiaPublicNm', 130, '공모구분'),  // L142
  gb.text('consignmentNm', 150, '수탁사'),  // L143
  gb.text('trustBankNm', 150, '수탁은행'),  // L144
  gb.text('officeWorkNm', 150, '사무수탁사'),  // L145
  gb.textCenter('operator1', 90, '주운용역'),  // L146
  gb.textCenter('operator2', 90, '부운용역'),  // L147
  gb.double('managementRate', 100, '운용보수율(bp)'),  // L148
  gb.double('salesRate', 100, '판매보수율(bp)'),  // L149
  gb.double('consignmentRate', 100, '수탁보수율(bp)'),  // L150
  gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),  // L151
  gb.text('note', 300, '비고'),  // L152
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Fnd01_Edit_FundSearchIcam (`client/vi/fnd/Fnd01_Edit_FundSearchIcam.java`, 286줄)

- 입력·하위 화면: `fundCode` TextField, `startDate` MyDateField, `endDate` MyDateField, `icamYn` CheckBox, `note` MyTextArea, `closeYn` TextField, `closeName` ComboBoxField("ClosedFundCode"), `fundName` TextField, `fundTypeCode` TextField, `fundTypeName` ComboBoxField("FundTypeCode"), `ksdFundCode` TextField, `ksdItemCode` TextField, `workDate` MyDateField, `sintakGb` TextField, `sintakGbName` ComboBoxField("SintakCode"), `publicYn` TextField, `publicName` ComboBoxField("PublicCode"), `consignmentCode` TextField, `consignmentName` LookupTriggerField, `officeWorkCode` TextField, `officeWorkName` LookupTriggerField, `planInvestorDscr` TextField, `planNote` TextArea, `orgCodeName` TextField, `kofiaTrustCode` TextField, `kofiaTrustName` ComboBoxField("IcamTrustCode"), `kofiaFundTypeCode` TextField, `kofiaFundTypeName` ComboBoxField("IcamFundType"), `kofiaPublicCode` TextField, `kofiaPublicName` ComboBoxField("IcamPublicCode"), `kofiaParentCode` TextField, `kofiaParentName` ComboBoxField("IcamParentCode"), `kofiaClassTypeCode` TextField, `kofiaClassTypeName` ComboBoxField("IcamClassType"), `kofiaFundUnitCode` TextField, `kofiaFundUnitName` ComboBoxField("IcamFundUnitCode"), `kofiaCharClassCode` TextField, `kofiaCharClassName` ComboBoxField("IcamCharClassCode"), `trustBankCode` TextField, `trustBankName` LookupTriggerField, `kofiaFundCode` TextField, `endExpectDate` MyDateField, `operator1` TextField, `operator2` TextField, `cur` TextField, `nextCloseDate` MyDateField, `nextFeeDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L160-178) → getEditor()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L180-266 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L268-276 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L278-280 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L282-284 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

