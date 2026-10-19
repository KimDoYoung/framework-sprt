# Fnd01_Tab_FundSearch

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드 조회 (#1049)
- 파일: `client/vi/fnd/Fnd01_Tab_FundSearch.java`
- 함께 쓰는 클래스 1개:
  - `Fnd01_Edit_FundSearch` `client/vi/fnd/Fnd01_Edit_FundSearch.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.selectByFundName` | Fnd01_Tab_FundSearch:211 | [`Fnd01_FundCode.java:38`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundName`](../../fnd/sql/fnd01_fund_code.md) |
| `sys.Sys99_Print.insertRdFundSearch` | Fnd01_Tab_FundSearch:225 | [`Sys99_Print.java:4485`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd01_fund_code.selectByFundName`](../../fnd/sql/fnd01_fund_code.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Tab_FundSearch (`client/vi/fnd/Fnd01_Tab_FundSearch.java`, 292줄)

- 레이아웃: center=vlc, south=editFundCodeForm
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 클래스구분: {classTypeComboBox} 검색: {fundSearchTextField} {closeYnCheckBox} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `fundSearchTextField` TextField 빈칸="펀드코드/펀드명/협회코드/예탁원코드/수탁사/사무수탁사", `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `classTypeComboBox` ComboBoxField("IcamClassType", "%", "전체"), `editFundCodeForm` Fnd01_Edit_FundSearch
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - fundCode 90 "펀드코드" TextFrozen 편집:"center"
  - fundName 350 "펀드명" TextFrozen 편집:"left"
  - kofiaFundCode 110 "협회펀드코드" TextCenter
  - ksdFundCode 110 "예탁원펀드코드" TextCenter
  - ksdItemCode 110 "예탁원종목코드" TextCenter
  - kofiaFundTypeName 100 "펀드유형" Text
  - kofiaClassTypeName 100 "클래스구분" Text
  - startDate 90 "설정일" Date
  - endExpectDate 90 "만기예정일" Date
  - endDate 90 "해지일" Date
  - closeName 70 "해지여부" TextCenter
  - kofiaTrustName 100 "신탁구분" Text
  - kofiaPublicName 130 "공모구분" Text
  - consignmentName 150 "수탁사" Text
  - trustBankName 120 "수탁은행" Text
  - officeWorkName 150 "사무수탁사" Text
  - operator1 90 "주운용역" TextCenter
  - operator2 90 "부운용역" TextCenter
  - seoljAek 110 "설정액" Long
  - sunjasanAek 110 "순자산" Long
  - managementRate 100 "운용보수율(bp)" Double
  - salesRate 100 "판매보수율(bp)" Double
  - consignmentRate 100 "수탁보수율(bp)" Double
  - officeWorkRate 110 "사무수탁보수율(bp)" Double
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-99) → settings()
[E1] retrieveButton[조회].Select (L113) → retrieve()
[E2] downloadButton[엑셀다운로드].Select (L119) → createRdExcel()
[E3] fundSearchTextField.KeyPress [Enter] (L127) → retrieve()
[E4] grid.SelectionChanged [선택>0] (L136) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L184-196 | E4 | 상태 처리 | 업무 |
| public retrieve() | L198-220 | E1,E3 | 서비스 fnd.Fnd01_FundCode.selectByFundName(companyId, closeYn, startDate, fundName, fundTypeCode, classTypeCode, planYn) | 업무 |
| private createRdExcel() | L222-278 | E2 | 서비스 sys.Sys99_Print.insertRdFundSearch(companyId, personId, windowClassName, closeYn, startDate, fundName, fundTypeCode, classTypeCode, planYn) | 업무 |
| private getToDate() | L280-283 | createRdExcel | 상태 처리 | 업무 |
| private settings() | L101-144 | 생성자 | 이벤트 연결, 초기값: fundTypeComboBox="전체"("IcamFundType"), classTypeComboBox="전체"("IcamClassType"), closeYnCheckBox=false("해지펀드포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L146-182 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L285-287 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L289-291 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L152) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L153) addTextFrozen
  gb.textCenter('kofiaFundCd', 110, '협회펀드코드'),  // L157
  gb.textCenter('ksdFundCd', 110, '예탁원펀드코드'),  // L158
  gb.textCenter('ksdItemCd', 110, '예탁원종목코드'),  // L159
  gb.text('kofiaFundTypeNm', 100, '펀드유형'),  // L160
  gb.text('kofiaClassTypeNm', 100, '클래스구분'),  // L161
  gb.date('startDate', 90, '설정일'),  // L162
  gb.date('endExpectDate', 90, '만기예정일'),  // L163
  gb.date('endDate', 90, '해지일'),  // L164
  gb.textCenter('closeNm', 70, '해지여부'),  // L165
  gb.text('kofiaTrustNm', 100, '신탁구분'),  // L166
  gb.text('kofiaPublicNm', 130, '공모구분'),  // L167
  gb.text('consignmentNm', 150, '수탁사'),  // L168
  gb.text('trustBankNm', 120, '수탁은행'),  // L169
  gb.text('officeWorkNm', 150, '사무수탁사'),  // L170
  gb.textCenter('operator1', 90, '주운용역'),  // L171
  gb.textCenter('operator2', 90, '부운용역'),  // L172
  gb.long('seoljAek', 110, '설정액'),  // L173
  gb.long('sunjasanAek', 110, '순자산'),  // L174
  gb.double('managementRate', 100, '운용보수율(bp)'),  // L175
  gb.double('salesRate', 100, '판매보수율(bp)'),  // L176
  gb.double('consignmentRate', 100, '수탁보수율(bp)'),  // L177
  gb.double('officeWorkRate', 110, '사무수탁보수율(bp)'),  // L178
  gb.text('note', 300, '비고'),  // L179
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

### Fnd01_Edit_FundSearch (`client/vi/fnd/Fnd01_Edit_FundSearch.java`, 345줄)

- 입력·하위 화면: `fundCode` TextField, `startDate` MyDateField, `endDate` MyDateField, `icamYn` CheckBox, `note` MyTextArea, `closeYn` TextField, `closeName` TextField, `fundName` TextField, `fundFullName` TextField, `fundTypeCode` TextField, `fundTypeName` TextField, `ksdFundCode` TextField, `ksdItemCode` TextField, `workDate` MyDateField, `sintakGb` TextField, `sintakGbName` TextField, `publicYn` TextField, `publicName` TextField, `consignmentCode` TextField, `consignmentName` TextField, `officeWorkCode` TextField, `officeWorkName` TextField, `planInvestorDscr` TextField, `planNote` TextArea, `orgCodeName` TextField, `kofiaTrustCode` TextField, `kofiaTrustName` TextField, `kofiaFundTypeCode` TextField, `kofiaFundTypeName` TextField, `kofiaPublicCode` TextField, `kofiaPublicName` TextField, `kofiaParentCode` TextField, `kofiaParentName` TextField, `kofiaClassTypeCode` TextField, `kofiaClassTypeName` TextField, `kofiaFundUnitCode` TextField, `kofiaFundUnitName` TextField, `kofiaCharClassCode` TextField, `kofiaCharClassName` TextField, `trustBankCode` TextField, `trustBankName` TextField, `kofiaFundCode` TextField, `endExpectDate` MyDateField, `operator1` TextField, `operator2` TextField, `cur` TextField, `nextCloseDate` MyDateField, `nextFeeDate` MyDateField, `seoljAek` LongField, `sunjasanAek` LongField, `managementRate` DoubleField, `salesRate` DoubleField, `consignmentRate` DoubleField, `officeWorkRate` DoubleField

#### 이벤트
[E0] 화면 열림 (생성자 L192-210) → getEditor()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L212-325 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L327-335 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L337-339 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L341-343 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

