# Fnd01_Tab_FundPlan

- 종류: 화면
- 메뉴: 펀드관리 > 01. 상품기획 > 신규기획펀드 등록 (#1046)
- 파일: `client/vi/fnd/Fnd01_Tab_FundPlan.java`
- 함께 쓰는 클래스 2개:
  - `Fnd01_Edit_FundPlan` `client/vi/fnd/Fnd01_Edit_FundPlan.java`
  - `Fnd00_Lookup_FundCode` `client/vi/fnd/Fnd00_Lookup_FundCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd00_Fund.selectByLookupFundCode` | Fnd00_Lookup_FundCode:185 | [`Fnd00_Fund.java:100`](../../fnd/services/Fnd00_Fund.md) | [`fnd00_fund.selectByLookupFundCode`](../../fnd/sql/fnd00_fund.md) |
| `fnd.Fnd01_FundCode.delete` | Fnd01_Edit_FundPlan:348, Fnd01_Tab_FundPlan:241 | [`Fnd01_FundCode.java:222`](../../fnd/services/Fnd01_FundCode.md) | `UpdateDataModel(fnd02_fund_info)` 동적 DELETE, `UpdateDataModel(fnd01_fund_code)` 동적 DELETE |
| `fnd.Fnd01_FundCode.selectByFundPlan` | Fnd01_Tab_FundPlan:188 | [`Fnd01_FundCode.java:83`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundPlan`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.selectByOverlap` | Fnd01_Edit_FundPlan:164 | [`Fnd01_FundCode.java:277`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByOverlap`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.update` | Fnd01_Edit_FundPlan:333 | [`Fnd01_FundCode.java:139`](../../fnd/services/Fnd01_FundCode.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd01_fund_code.selectOneFundCodeCheck`](../../fnd/sql/fnd01_fund_code.md), `UpdateDataModel(fnd02_fund_info)` 동적 INSERT/UPDATE → [`fnd02_fund_info.selectById`](../../fnd/sql/fnd02_fund_info.md), `UpdateDataModel(fnd01_fund_code)` 동적 INSERT/UPDATE → [`fnd01_fund_code.selectById`](../../fnd/sql/fnd01_fund_code.md) |

## 테이블

[`fnd00_fund`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_fund_nm2`, `f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Tab_FundPlan (`client/vi/fnd/Fnd01_Tab_FundPlan.java`, 258줄)

- 레이아웃: center=vlc, south=editFundCodeForm
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 임시펀드: {fundSearchTextField} {closeYnCheckBox} {retrieveButton} {insertButton} {deleteButton} {insertButton}
- 입력·하위 화면: `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `fundSearchTextField` TextField 빈칸="전체", `closeYnCheckBox` CheckBox, `editFundCodeForm` Fnd01_Edit_FundPlan
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 70 "임시코드" Text
  - fundName 250 "임시펀드명" Text
  - kofiaFundTypeName 120 "펀드유형" Text
  - startDate 90 "등록일" Date
  - endDate 90 "예정일" Date
  - closeName 70 "펀드상태" Text
  - kofiaTrustName 120 "신탁구분" Text
  - kofiaPublicName 130 "공모구분" Text
  - orgCodeName 120 "운용부서" Text
  - operator1 100 "운용역1" Text
  - operator2 100 "운용역2" Text
  - realFundCode 90 "확정펀드" Text
  - realFundName 250 "확정펀드명" Text
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L54-141) → retrieve()
[E1] fundSearchTextField.KeyPress [Enter] (L58) → retrieve()
[E2] retrieveButton[조회].Select (L82) → retrieve()
[E3] insertButton[등록].Select (L88) → insertRow()
[E4] deleteButton[삭제].Select (L95) → deleteRow()
       └ [E6] messageBox.DialogHide (L226) → deleteSelectedRow()
[E5] grid.SelectionChanged [선택>0] (L121) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L165-174 | E5 | 상태 처리 | 업무 |
| public retrieve() | L177-200 | 생성자,E1,E2 | 서비스 fnd.Fnd01_FundCode.selectByFundPlan(companyId, closeYn, fundName, fundTypeCode) | 업무 |
| public update() | L203-205 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L208-220 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L223-236 | E4 | ConfirmBox → E6 | 업무 |
| private deleteSelectedRow() | L238-249 | E6 | GridDeleteData fnd.Fnd01_FundCode.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L143-163 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L251-253 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L255-257 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 70, '임시코드'),  // L147
  gb.text('fundNm', 250, '임시펀드명'),  // L148
  gb.text('kofiaFundTypeNm', 120, '펀드유형'),  // L149
  gb.date('startDate', 90, '등록일'),  // L150
  gb.date('endDate', 90, '예정일'),  // L151
  gb.text('closeNm', 70, '펀드상태'),  // L152
  gb.text('kofiaTrustNm', 120, '신탁구분'),  // L153
  gb.text('kofiaPublicNm', 130, '공모구분'),  // L154
  gb.text('orgCodeNm', 120, '운용부서'),  // L155
  gb.text('operator1', 100, '운용역1'),  // L156
  gb.text('operator2', 100, '운용역2'),  // L157
  gb.text('realFundCd', 90, '확정펀드'),  // L158
  gb.text('realFundNm', 250, '확정펀드명'),  // L159
  gb.text('note', 300, '비고'),  // L160
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Fnd01_Edit_FundPlan (`client/vi/fnd/Fnd01_Edit_FundPlan.java`, 369줄)

- 입력·하위 화면: `fundCode` TextField, `fundName` TextField, `kofiaFundTypeCode` TextField, `kofiaFundTypeName` ComboBoxField("IcamFundType"), `startDate` MyDateField, `endDate` MyDateField, `closeYn` TextField, `planYn` TextField, `realFundId` LongField, `companyId` LongField, `note` MyTextArea, `closeName` ComboBoxField("PlnClosedFundCode"), `realFundName` LookupTriggerField 빈칸="펀드로 확정된 상품만 등록합니다.", `workDate` MyDateField, `fundInfoId` LongField, `kofiaTrustCode` TextField, `kofiaTrustName` ComboBoxField("IcamTrustCode"), `kofiaPublicCode` TextField, `kofiaPublicName` ComboBoxField("IcamPublicCode"), `orgCodeId` LongField, `orgCodeName` TextField, `emp1Id` LongField, `emp1Name` LookupTriggerField, `emp2Id` LongField, `emp2Name` LookupTriggerField, `operator1` TextField, `operator2` TextField, `managementRate` DoubleField, `salesRate` DoubleField, `consignmentRate` DoubleField, `officeWorkRate` DoubleField, `planDate` MyDateField, `planSalesDscr` TextField, `planInvestorDscr` TextField, `planNote` MyTextArea, `lookupFundCode` Fnd00_Lookup_FundCode

#### 이벤트
[E0] 화면 열림 (생성자 L135-186) → getEditor()
[E1] updateButton[저장].Select (L146) → updateRow()
[E2] checkOverlap[중복확인].Select (L160) → 서비스 fnd.Fnd01_FundCode.selectByOverlap(fundCode), 메시지 "먼저 코드를 입력해주세요 / 사용 가능한 임시코드…"
[E3] realFundName[확정펀드].TriggerClick (L195) → openLookupFundCode()
[E4] realFundName[확정펀드].Change (L219) → 인라인 L219-229 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L188-289 | 생성자 | 상태 처리 | 업무 |
| private openLookupFundCode() | L291-303 | E3 | 조회창 Fnd00_Lookup_FundCode 열기 | 업무 |
| public retrieve() | L305-311 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L313-343 | E1 | 서비스 fnd.Fnd01_FundCode.update | 업무 |
| public deleteRow() | L345-354 | 공개 메서드 | GridDeleteData fnd.Fnd01_FundCode.delete(체크된 행 목록) | 업무 |
| public hideButton() | L356-359 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L361-363 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L365-367 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="unknown" onClick={() => /* 서비스 fnd.Fnd01_FundCode.selectByOverlap(fundCode), 메시지 "먼저 코드를 입력해주세요 / 사용 가능한 임시코드…" */}>중복확인</Button>

### Fnd00_Lookup_FundCode (`client/vi/fnd/Fnd00_Lookup_FundCode.java`, 222줄)

- 툴바 `searchBar`: {searchField} {fundTypeField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `fundNameText` TextField 빈칸="전체", `closeYnCheckBox` CheckBox, `fundTypeComboBox` ComboBoxField("FundTypeCode", "%", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 80 "펀드코드" Text
  - fundName 300 "펀드명" Text
  - fundTypeName 100 "펀드유형" Text
  - orgCodeName 200 "운용부서" Text
  - startDate 100 "설정일" Date
  - closeName 80 "해지구분" Text
  - note 200 "비고" Text

#### 이벤트
[E1] fundNameText[검색].KeyPress [Enter] (L77) → retrieve()
[E2] retrieveButton[조회].Select (L101) → retrieve()
[E3] okButton[확인].Select (L115) → confirm()
[E4] cancelButton[취소].Select (L123) → hide()
[E5] grid.CellDoubleClick (L132) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L55-57 | retrieve | 상태 처리 | 업무 |
| public open() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-142 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L162-191 | E1,E2,execute,open | 서비스 fnd.Fnd00_Fund.selectByLookupFundCode(companyId, closeYn, fundName, fundTypeCode, workDate) | 업무 |
| private confirm() | L193-205 | E3,E5 | 미선택 시 alert "조회할 펀드를 선택해주세요" | 업무 |
| public getServiceResult() | L208-216 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L144-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L218-220 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 80, '펀드코드'),  // L148
  gb.text('fundNm', 300, '펀드명'),  // L149
  gb.text('fundTypeNm', 100, '펀드유형'),  // L150
  gb.text('orgCodeNm', 200, '운용부서'),  // L151
  gb.date('startDate', 100, '설정일'),  // L152
  gb.text('closeNm', 80, '해지구분'),  // L153
  gb.text('note', 200, '비고'),  // L154
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

