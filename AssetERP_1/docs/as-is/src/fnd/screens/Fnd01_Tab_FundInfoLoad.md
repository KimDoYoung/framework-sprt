# Fnd01_Tab_FundInfoLoad

- 종류: 화면
- 파일: `client/vi/fnd/Fnd01_Tab_FundInfoLoad.java`
- 함께 쓰는 클래스 4개:
  - `Fnd01_Edit_FundCode` `client/vi/fnd/Fnd01_Edit_FundCode.java`
  - `Fnd09_Lookup_TrustBank` `client/vi/fnd/Fnd09_Lookup_TrustBank.java`
  - `Fnd06_Lookup_OfficeWork` `client/vi/fnd/Fnd06_Lookup_OfficeWork.java`
  - `Fnd03_Lookup_Consignment` `client/vi/fnd/Fnd03_Lookup_Consignment.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.delete` | Fnd01_Edit_FundCode:442, Fnd01_Tab_FundInfoLoad:250 | [`Fnd01_FundCode.java:222`](../../fnd/services/Fnd01_FundCode.md) | `UpdateDataModel(fnd02_fund_info)` 동적 DELETE, `UpdateDataModel(fnd01_fund_code)` 동적 DELETE |
| `fnd.Fnd01_FundCode.getLastUploadDate` | Fnd01_Tab_FundInfoLoad:159 | [`Fnd01_FundCode.java:268`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectLastUploadDate`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.noteUpdate` | Fnd01_Edit_FundCode:399 | [`Fnd01_FundCode.java:125`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.noteUpdate`](../../fnd/sql/fnd01_fund_code.md), [`fnd01_fund_code.selectById`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.selectByWorkDate` | Fnd01_Tab_FundInfoLoad:210 | [`Fnd01_FundCode.java:71`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByWorkDate`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd01_FundCode.update` | Fnd01_Edit_FundCode:419 | [`Fnd01_FundCode.java:139`](../../fnd/services/Fnd01_FundCode.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd01_fund_code.selectOneFundCodeCheck`](../../fnd/sql/fnd01_fund_code.md), `UpdateDataModel(fnd02_fund_info)` 동적 INSERT/UPDATE → [`fnd02_fund_info.selectById`](../../fnd/sql/fnd02_fund_info.md), `UpdateDataModel(fnd01_fund_code)` 동적 INSERT/UPDATE → [`fnd01_fund_code.selectById`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd03_Consignment.selectByText` | Fnd03_Lookup_Consignment:134 | [`Fnd03_Consignment.java:44`](../../fnd/services/Fnd03_Consignment.md) | [`fnd03_consignment.selectByText`](../../fnd/sql/fnd03_consignment.md) |
| `fnd.Fnd06_OfficeWork.selectByText` | Fnd06_Lookup_OfficeWork:134 | [`Fnd06_OfficeWork.java:55`](../../fnd/services/Fnd06_OfficeWork.md) | [`fnd06_office_work.selectByText`](../../fnd/sql/fnd06_office_work.md) |
| `fnd.Fnd09_TrustBank.selectByText` | Fnd09_Lookup_TrustBank:134 | [`Fnd09_TrustBank.java:44`](../../fnd/services/Fnd09_TrustBank.md) | [`fnd09_trust_bank.selectByText`](../../fnd/sql/fnd09_trust_bank.md) |

## 테이블

[`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_max_workdate`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Tab_FundInfoLoad (`client/vi/fnd/Fnd01_Tab_FundInfoLoad.java`, 266줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), center=vlc, south=editFundCodeForm
- 입력·하위 화면: `workDateField` MyDateField, `closeYnCheckBox` CheckBox, `fundSearchTextField` TextField 빈칸="전체", `fundTypeComboBox` ComboBoxField("FundTypeCode", "%", "전체"), `editFundCodeForm` Fnd01_Edit_FundCode
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 70 "코드" Text
  - fundName 350 "펀드명" Text
  - fundTypeName 150 "펀드유형" Text
  - startDate 90 "생성일" Date
  - endDate 90 "예정일" Date
  - closeName 60 "해지여부" Text
  - sintakGbName 80 "신탁구분" Text
  - publicName 40 "공모" Text
  - orgCodeName 150 "운용부서" Text
  - emp1Name 90 "운용역1" Text
  - emp2Name 90 "운용역2" Text

#### 이벤트
[E0] 화면 열림 (생성자 L64-155) → setLastWorkDate()
[E1] fundSearchTextField[펀드].KeyPress [Enter] (L86) → retrieve()
[E2] searchBarBuilder[조회].Retrieve (L104) → retrieve()
[E3] searchBarBuilder[삭제].Delete (L105) → deleteRow()
       └ [E7] messageBox.DialogHide (L235) → deleteSelectedRow()
[E4] searchBarBuilder[파일업로드].Insert (L106) → insertRow()
[E5] fileUpdownForm.Change (L116) → setLastWorkDate(), retrieve()
[E6] grid.SelectionChanged [선택>0] (L147) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setLastWorkDate() | L157-163 | 생성자,E5 | 서비스 fnd.Fnd01_FundCode.getLastUploadDate | 업무 |
| private retrieveEditPage() | L185-197 | E6 | 상태 처리 | 업무 |
| public retrieve() | L200-219 | E1,E2,E5 | 서비스 fnd.Fnd01_FundCode.selectByWorkDate(companyId, closeYn, workDate, fundName, fundTypeCode) | 업무 |
| public update() | L222-224 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L227-229 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L232-245 | E3 | ConfirmBox → E7 | 업무 |
| private deleteSelectedRow() | L247-258 | E7 | GridDeleteData fnd.Fnd01_FundCode.delete(체크된 행 목록) | 업무 |
| public getServiceResult() | L261-265 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L165-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 70, '코드'),  // L170
  gb.text('fundNm', 350, '펀드명'),  // L171
  gb.text('fundTypeNm', 150, '펀드유형'),  // L172
  gb.date('startDate', 90, '생성일'),  // L173
  gb.date('endDate', 90, '예정일'),  // L174
  gb.text('closeNm', 60, '해지여부'),  // L175
  gb.text('sintakGbNm', 80, '신탁구분'),  // L176
  gb.text('publicNm', 40, '공모'),  // L177
  gb.text('orgCodeNm', 150, '운용부서'),  // L178
  gb.text('emp1Nm', 90, '운용역1'),  // L179
  gb.text('emp2Nm', 90, '운용역2'),  // L180
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="upload" onClick={insertRow}>파일업로드</Button>

### Fnd01_Edit_FundCode (`client/vi/fnd/Fnd01_Edit_FundCode.java`, 462줄)

- 입력·하위 화면: `fundCode` TextField, `startDate` MyDateField, `endDate` MyDateField, `icamYn` CheckBox, `note` MyTextArea, `closeYn` TextField, `closeName` ComboBoxField("ClosedFundCode"), `fundName` TextField, `fundFullName` TextField, `fundTypeCode` TextField, `fundTypeName` ComboBoxField("FundTypeCode"), `ksdFundCode` TextField, `ksdItemCode` TextField, `workDate` MyDateField, `sintakGb` TextField, `sintakGbName` ComboBoxField("SintakCode"), `publicYn` TextField, `publicName` ComboBoxField("PublicCode"), `consignmentCode` TextField, `consignmentName` LookupTriggerField, `officeWorkCode` TextField, `officeWorkName` LookupTriggerField, `planInvestorDscr` TextField, `planNote` TextArea, `orgCodeName` TextField, `kofiaTrustCode` TextField, `kofiaTrustName` ComboBoxField("IcamTrustCode"), `kofiaFundTypeCode` TextField, `kofiaFundTypeName` ComboBoxField("IcamFundType"), `kofiaPublicCode` TextField, `kofiaPublicName` ComboBoxField("IcamPublicCode"), `kofiaParentCode` TextField, `kofiaParentName` ComboBoxField("IcamParentCode"), `kofiaClassTypeCode` TextField, `kofiaClassTypeName` ComboBoxField("IcamClassType"), `kofiaFundUnitCode` TextField, `kofiaFundUnitName` ComboBoxField("IcamFundUnitCode"), `kofiaCharClassCode` TextField, `kofiaCharClassName` ComboBoxField("IcamCharClassCode"), `trustBankCode` TextField, `trustBankName` LookupTriggerField, `kofiaFundCode` TextField, `endExpectDate` MyDateField, `operator1` TextField, `operator2` TextField, `cur` TextField, `nextCloseDate` MyDateField, `nextFeeDate` MyDateField, `seoljAek` LongField, `sunjasanAek` LongField, `managementRate` DoubleField, `salesRate` DoubleField, `consignmentRate` DoubleField, `officeWorkRate` DoubleField, `consignmentPopup` Fnd03_Lookup_Consignment, `officeWorkPopup` Fnd06_Lookup_OfficeWork, `trustBankPopup` Fnd09_Lookup_TrustBank

#### 이벤트
[E0] 화면 열림 (생성자 L198-223) → getEditor()
[E1] updateButton[저장].Select (L204) → updateRow()
[E2] consignmentName[수탁사].TriggerClick (L237) → openLookupConsignment()
[E3] officeWorkName[사무수탁사].TriggerClick (L243) → openLookupOfficeWork()
[E4] trustBankName[수탁은행].TriggerClick (L249) → openLookupTrustBank()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L225-330 | 생성자 | 상태 처리 | 업무 |
| private openLookupConsignment() | L332-342 | E2 | 조회창 Fnd03_Lookup_Consignment 열기 | 업무 |
| private openLookupOfficeWork() | L344-354 | E3 | 조회창 Fnd06_Lookup_OfficeWork 열기 | 업무 |
| private openLookupTrustBank() | L356-366 | E4 | 조회창 Fnd09_Lookup_TrustBank 열기 | 업무 |
| public retrieve() | L368-376 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L378-437 | E1 | 미선택 시 alert "펀드유형은 필수입력항목입니다", 서비스 fnd.Fnd01_FundCode.noteUpdate, fnd.Fnd01_FundCode.update(note, fundCodeId) | 업무 |
| public deleteRow() | L439-448 | 공개 메서드 | GridDeleteData fnd.Fnd01_FundCode.delete(체크된 행 목록) | 업무 |
| public init() | L450-452 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L458-460 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>

### Fnd09_Lookup_TrustBank (`client/vi/fnd/Fnd09_Lookup_TrustBank.java`, 141줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - trustBankCode 120 "수탁은행 코드" Text
  - trustBankName 300 "수탁은행 명" Text

#### 이벤트
[E1] searchText[검색].KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L69) → retrieve()
[E3] grid.CellDoubleClick (L80) → hide()
[E4] okButton[확인].Select (L91) → hide()
[E5] cancelButton[취소].Select (L101) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-112 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L122-135 | E1,E2,open | 서비스 fnd.Fnd09_TrustBank.selectByText(searchText, companyId) | 업무 |
| private buildGrid() | L114-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L137-139 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('trustBankCd', 120, '수탁은행 코드'),  // L117
  gb.text('trustBankNm', 300, '수탁은행 명'),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Fnd06_Lookup_OfficeWork (`client/vi/fnd/Fnd06_Lookup_OfficeWork.java`, 141줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - officeWorkCode 120 "사무수탁사 코드" Text
  - officeWorkName 300 "사무수탁사 명" Text

#### 이벤트
[E1] searchText[검색].KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L69) → retrieve()
[E3] grid.CellDoubleClick (L80) → hide()
[E4] okButton[확인].Select (L91) → hide()
[E5] cancelButton[취소].Select (L101) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-112 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L122-135 | E1,E2,open | 서비스 fnd.Fnd06_OfficeWork.selectByText(searchText, companyId) | 업무 |
| private buildGrid() | L114-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L137-139 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('officeWorkCd', 120, '사무수탁사 코드'),  // L117
  gb.text('officeWorkNm', 300, '사무수탁사 명'),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Fnd03_Lookup_Consignment (`client/vi/fnd/Fnd03_Lookup_Consignment.java`, 141줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - consignmentCode 120 "수탁사 코드" Text
  - consignmentName 300 "수탁사 명" Text

#### 이벤트
[E1] searchText[검색].KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L69) → retrieve()
[E3] grid.CellDoubleClick (L80) → hide()
[E4] okButton[확인].Select (L91) → hide()
[E5] cancelButton[취소].Select (L101) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-112 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L122-135 | E1,E2,open | 서비스 fnd.Fnd03_Consignment.selectByText(searchText, companyId) | 업무 |
| private buildGrid() | L114-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L137-139 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('consignmentCd', 120, '수탁사 코드'),  // L117
  gb.text('consignmentNm', 300, '수탁사 명'),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

