# Crd02_Tab_DataUpload

- 종류: 화면
- 메뉴: 경영관리 > 92. 법인카드 등록 > 법인카드 내역 업로드 (#1479)
- 메뉴: 자금관리 > 30. 법인카드관리 > 법인카드 내역 업로드 (#1039)
- 파일: `client/vi/crd/Crd02_Tab_DataUpload.java`
- 함께 쓰는 클래스 2개:
  - `Crd11_Lookup_ExcelCode` `client/vi/crd/Crd11_Lookup_ExcelCode.java`
  - `Crd02_Edit_DataUpload` `client/vi/crd/Crd02_Edit_DataUpload.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz01_Promo.insertList` | Crd02_Tab_DataUpload:902 | [`Biz01_Promo.java:452`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.checkData`](../../biz/sql/biz01_promo.md), [`biz01_promo.deleteApprovalNo`](../../biz/sql/biz01_promo.md), [`biz01_promo.insert`](../../biz/sql/biz01_promo.md), [`biz01_promo.partCancelUpdate`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectByApprovalNo`](../../biz/sql/biz01_promo.md), [`biz01_promo.update`](../../biz/sql/biz01_promo.md), [`crd01_card.selectCardManager`](../../crd/sql/crd01_card.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.getTaxType`](../../sys/sql/sys01_company.md) |
| `biz.Biz01_Promo.targetCheck` | Crd02_Tab_DataUpload:487, Crd02_Tab_DataUpload:509, Crd02_Tab_DataUpload:653 | [`Biz01_Promo.java:197`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByCardDataId`](../../biz/sql/biz01_promo.md), [`crd02_data.selectByCompanyId`](../../crd/sql/crd02_data.md) |
| `biz.Biz01_Promo.targetListCheck` | Crd02_Edit_DataUpload:211, Crd02_Tab_DataUpload:553, Crd02_Tab_DataUpload:776, Crd02_Tab_DataUpload:853 | [`Biz01_Promo.java:256`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByCardDataId`](../../biz/sql/biz01_promo.md), [`crd02_data.selectByCompanyId`](../../crd/sql/crd02_data.md) |
| `crd.Crd02_Data.copyUpdate` | Crd02_Tab_DataUpload:969 | [`Crd02_Data.java:170`](../../crd/services/Crd02_Data.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crd02_data)` 동적 INSERT/UPDATE → [`crd02_data.selectById`](../../crd/sql/crd02_data.md) |
| `crd.Crd02_Data.delete` | Crd02_Tab_DataUpload:585 | [`Crd02_Data.java:188`](../../crd/services/Crd02_Data.md) | `UpdateDataModel(crd02_data)` 동적 DELETE |
| `crd.Crd02_Data.deleteBiz` | Crd02_Tab_DataUpload:593 | [`Crd02_Data.java:152`](../../crd/services/Crd02_Data.md) | [`biz01_promo.deleteBiz`](../../biz/sql/biz01_promo.md) |
| `crd.Crd02_Data.selectByAmt` | Crd02_Tab_DataUpload:438 | [`Crd02_Data.java:50`](../../crd/services/Crd02_Data.md) | [`crd02_data.selectByAmt`](../../crd/sql/crd02_data.md) |
| `crd.Crd02_Data.selectByPaging` | Crd02_Tab_DataUpload:289 | [`Crd02_Data.java:111`](../../crd/services/Crd02_Data.md) | [`crd02_data.selectByTextPaging`](../../crd/sql/crd02_data.md), [`crd02_data.selectByTextTotal`](../../crd/sql/crd02_data.md) |
| `crd.Crd02_Data.selectByText` | Crd02_Tab_DataUpload:837 | [`Crd02_Data.java:80`](../../crd/services/Crd02_Data.md) | [`crd02_data.selectByText`](../../crd/sql/crd02_data.md) |
| `crd.Crd02_Data.targetDelete` | Crd02_Tab_DataUpload:723 | [`Crd02_Data.java:136`](../../crd/services/Crd02_Data.md) | [`biz01_promo.deleteByCrd02`](../../biz/sql/biz01_promo.md), [`crd02_data.targetDelete`](../../crd/sql/crd02_data.md) |
| `crd.Crd02_Data.update` | Crd02_Edit_DataUpload:292 | [`Crd02_Data.java:183`](../../crd/services/Crd02_Data.md) | `UpdateDataModel(crd02_data)` 동적 INSERT/UPDATE → [`crd02_data.selectById`](../../crd/sql/crd02_data.md) |
| `crd.Crd11_ExcelCode.copyData` | Crd11_Lookup_ExcelCode:254 | [`Crd11_ExcelCode.java:35`](../../crd/services/Crd11_ExcelCode.md) | [`crd11_excel_code.copyData`](../../crd/sql/crd11_excel_code.md) |
| `crd.Crd11_ExcelCode.delete` | Crd11_Lookup_ExcelCode:292 | [`Crd11_ExcelCode.java:60`](../../crd/services/Crd11_ExcelCode.md) | `UpdateDataModel(crd11_excel_code)` 동적 DELETE |
| `crd.Crd11_ExcelCode.selectByCompanyId` | Crd11_Lookup_ExcelCode:193, Crd11_Lookup_ExcelCode:230 | [`Crd11_ExcelCode.java:26`](../../crd/services/Crd11_ExcelCode.md) | [`crd11_excel_code.selectByCompanyId`](../../crd/sql/crd11_excel_code.md) |
| `crd.Crd11_ExcelCode.update` | Crd11_Lookup_ExcelCode:332 | [`Crd11_ExcelCode.java:55`](../../crd/services/Crd11_ExcelCode.md) | `UpdateDataModel(crd11_excel_code)` 동적 INSERT/UPDATE → [`crd11_excel_code.selectById`](../../crd/sql/crd11_excel_code.md) |

## 테이블

[`biz01_promo`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`crd11_excel_code`](../../../db/tables/crd.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crd02_Tab_DataUpload (`client/vi/crd/Crd02_Tab_DataUpload.java`, 990줄)

- 레이아웃: center=vlc, south=editForm
- 툴바 `buttonBar1`: {downloadForm} {uploadExcelForm} 기준년월: {dataYMText} 카드회사: {CCompanyComboBox} 확정여부: {confirmComboBox} 검색: {searchText} {retrieveButton} {insertRootButton} {uploadSetButton}
- 툴바 `buttonBar3`: 개별내역: {copyButton} {insertButton} {deleteButton} {allInsertBizButton} {selectInsertBizButton}
- 입력·하위 화면: `CCompanyComboBox` ComboBoxField("CreditCardCompany", "%", "전체"), `confirmComboBox` StringComboBox, `searchText` TextField 빈칸="문자열을 입력하세요", `dataYMText` TextField 빈칸="YYYY.MM", `editForm` Crd02_Edit_DataUpload, `openLookup` Crd11_Lookup_ExcelCode
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - approvalDt 100 "승인일" Date
  - approvalTime 100 "승인시간" TextCenter
  - cardNo 150 "카드번호" TextCenter
  - franchiseName 250 "가맹점명" Text
  - sectorName 150 "업종명" Text
  - approvalAmount 150 "승인금액" Long
  - surtax 150 "부가세" Long
  - stateName 100 "승인상태" TextCenter
  - bizLicenseNo 150 "가맹점 사업자번호" TextCenter
  - representativeName 200 "가맹점 대표자명" TextCenter
  - merchantPhone 150 "가맹점 전화" Text
  - confirmYn 80 "내역확정" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L104-107) → init()
[E1] uploadExcelForm.SubmitComplete (L162) → retrieve()
[E2] uploadSetButton[엑셀업로드 설정].Select (L174) → 메시지 "확인 / 카드사를 선택해주세요."
[E3] dataYMText.KeyPress [Enter] (L194) → retrieve()
[E4] CCompanyComboBox[CreditCardCompany].Collapse (L204) → retrieve()
[E5] searchText.KeyPress [Enter] (L220) → retrieve()
[E6] copyButton[등록(복사)].Select (L228) → copyDeadLineCheck()
[E7] retrieveButton[조회].Select (L234) → retrieve()
[E8] insertRootButton[엑셀업로드].Select (L240) → uploadExcelCheck()
       └ [E15] msgBox.DialogHide [YES] (L630) → updateExcel()
[E9] selectInsertBizButton[선택내역확정].Select (L246) → insertCheck()
       └ [E19] msgBox.DialogHide [YES] (L795) → insertBiz()
[E10] allInsertBizButton[전체내역확정].Select (L253) → totalInsertCheck()
       └ [E20] msgBox.DialogHide [YES] (L871) → insertBiz()
[E11] insertButton[등록].Select (L260) → insertDeadLineCheck()
[E12] deleteButton[삭제].Select (L267) → deleteCheck()
[E13] grid.SelectionChanged [선택>0] (L318) → retrieveEditPage()
[E14] messageBox.DialogHide (L579) → retrieve()
[E18] fileUploadField.Change (L748) → 인라인 L748-753 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L109-329 | 생성자 | 조회창 Crd11_Lookup_ExcelCode 열기, 서비스 crd.Crd02_Data.selectByPaging | 업무 |
| private retrieveEditPage() | L351-360 | E13 | 상태 처리 | 업무 |
| public retrieve() | L362-419 | E1,E3,E4,E5,E7,E14,init,insertBiz | 상태 처리 | 업무 |
| private totalAmtCheck() | L421-474 | retrieve | 서비스 crd.Crd02_Data.selectByAmt(searchText, dataBankCode, dataYm, companyId, confirmCode, stateCode) | 업무 |
| public update() | L476-478 | 공개 메서드 | 상태 처리 | 업무 |
| private insertDeadLineCheck() | L480-505 | E11 | 서비스 biz.Biz01_Promo.targetCheck(companyId, dataBankCode, dataYm, checkType) | 업무 |
| private copyDeadLineCheck() | L507-527 | E6 | 서비스 biz.Biz01_Promo.targetCheck(companyId, dataBankCode, dataYm, checkType) | 업무 |
| public insertRow() | L529-538 | insertDeadLineCheck | 상태 처리 | 업무 |
| private deleteCheck() | L540-573 | E12 | 서비스 biz.Biz01_Promo.targetListCheck(companyId, checkType) | 업무 |
| public deleteRow() | L575-613 | deleteCheck | 확인창 표시, GridDeleteData crd.Crd02_Data.delete, crd.Crd02_Data.deleteBiz(체크된 행 목록) | 업무 |
| private uploadExcelCheck() | L615-650 | E8 | ConfirmBox → E15 | 업무 |
| private updateExcel() | L652-711 | E15 | ConfirmBox → E16 | 업무 |
| private isNumeric() | L713-720 | uploadExcelCheck | 상태 처리 | 업무 |
| private targetDelete() | L722-735 | E17 | 서비스 crd.Crd02_Data.targetDelete | 업무 |
| private excelUpload() | L737-756 | E16,updateExcel,targetDelete | 상태 처리 | 업무 |
| private insertCheck() | L758-816 | E9 | 미선택 시 alert "선택된 정보가 없습니다" → 확인창 E19 | 업무 |
| private totalInsertCheck() | L818-897 | E10 | ConfirmBox → E20 | 업무 |
| private insertBiz() | L899-923 | E19,E20,insertCheck,totalInsertCheck | 서비스 biz.Biz01_Promo.insertList(companyId, personId, checkType) | 업무 |
| public copyInsertRow() | L925-966 | copyDeadLineCheck | 상태 처리 | 업무 |
| public copyUpdateRow() | L968-979 | copyInsertRow | 서비스 crd.Crd02_Data.copyUpdate | 업무 |
| private getApprDate() | L981-985 | retrieve,totalAmtCheck,insertDeadLineCheck,copyDeadLineCheck,insertRow,uploadExcelCheck,updateExcel,targetDelete,excelUpload,insertCheck,totalInsertCheck | 상태 처리 | 업무 |
| public buildGrid() | L331-349 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L987-989 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('approvalDt', 100, '승인일'),  // L335
  gb.textCenter('approvalTime', 100, '승인시간'),  // L336
  gb.textCenter('cardNo', 150, '카드번호'),  // L337
  gb.text('franchiseNm', 250, '가맹점명'),  // L338
  gb.text('sectorNm', 150, '업종명'),  // L339
  gb.long('approvalAmount', 150, '승인금액'),  // L340
  gb.long('surtax', 150, '부가세'),  // L341
  gb.textCenter('stateNm', 100, '승인상태'),  // L342
  gb.textCenter('bizLicenseNo', 150, '가맹점 사업자번호'),  // L343
  gb.textCenter('representativeNm', 200, '가맹점 대표자명'),  // L344
  gb.text('merchantPhone', 150, '가맹점 전화'),  // L345
  gb.textCenter('confirmYn', 80, '내역확정'),  // L346
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="assign" onClick={() => /* 메시지 "확인 / 카드사를 선택해주세요." */}>엑셀업로드 설정</Button>
3. <Button type="upload" onClick={uploadExcelCheck}>엑셀업로드</Button>
4. <Button type="save" onClick={insertCheck}>선택내역확정</Button>
5. <Button type="save" onClick={totalInsertCheck}>전체내역확정</Button>
6. <Button type="register" onClick={copyDeadLineCheck}>등록(복사)</Button>
7. <Button type="register" onClick={insertDeadLineCheck}>등록</Button>
8. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Crd11_Lookup_ExcelCode (`client/vi/crd/Crd11_Lookup_ExcelCode.java`, 338줄)

- 툴바 `buttonBar1`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBar2`: {customSetButton}
- 입력·하위 화면: `cardExcelCodeComboBox` ComboBoxField("CreditCardExcelCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bankExcelName 200 "업로드 구분코드" Text 편집:cardExcelCodeComboB…
  - seq 100 "위치(세로줄)" LongCenter 편집:LongField
  - text 280 "비고" TextArea 편집:MyTextArea

#### 이벤트
[E1] retrieveButton[조회].Select (L111) → excelCodeChk()
[E2] insertButton[등록].Select (L117) → insertRow()
[E3] updateButton[저장].Select (L123) → update()
[E4] deleteButton[삭제].Select (L130) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L272) → deleteRow()
[E5] customSetButton[커스텀 설정].Select (L136) → customChk()
[E6] closeButton[닫기].Select (L143) → hide()
[E7] cardExcelCodeComboBox[CreditCardExcelCode].Collapse (L157) → 인라인 L157-165 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L66-108 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L110-149 | open | 상태 처리 | 업무 |
| public retrieve() | L176-187 | excelCodeChk | 서비스 crd.Crd11_ExcelCode.selectByCompanyId(companyId, bankCode) | 업무 |
| public excelCodeChk() | L189-218 | E1,open,copyData,deleteRow | 서비스 crd.Crd11_ExcelCode.selectByCompanyId | 업무 |
| private insertRow() | L220-227 | E2 | 상태 처리 | 업무 |
| private customChk() | L229-246 | E5 | 서비스 crd.Crd11_ExcelCode.selectByCompanyId | 업무 |
| private copyData() | L248-267 | customChk | 서비스 crd.Crd11_ExcelCode.copyData | 업무 |
| private deleteChk() | L269-287 | E4 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L289-301 | E8 | GridDeleteData crd.Crd11_ExcelCode.delete(체크된 행 목록) | 업무 |
| private update() | L303-333 | E3 | 서비스 crd.Crd11_ExcelCode.update | 업무 |
| private buildGrid() | L151-173 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L335-337 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('bankExcelNm', 200, '업로드 구분코드', { editor: 'select' }),  // L168 SQL 계산 컬럼(selectByCompanyId: f_cdnm('CreditCardExcelCode', crd11_ban…)
  gb.longCenter('seq', 100, '위치(세로줄)', { editor: 'number' }),  // L169
  gb.textArea('note', 280, '비고', { editor: 'largeText' }),  // L170
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={excelCodeChk}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="assign" onClick={customChk}>커스텀 설정</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Crd02_Edit_DataUpload (`client/vi/crd/Crd02_Edit_DataUpload.java`, 314줄)

- 입력·하위 화면: `approvalDt` MyDateField, `monthlyPayments` LongField, `approvalAmount` LongField, `surtax` LongField, `dataYm` TextField 빈칸="YYYY.MM", `approvalTime` TextField, `partCode` TextField, `partName` TextField, `cardNo` TextField, `cardName` TextField, `franchiseName` TextField, `sectorName` TextField, `paymentMethod` TextField, `approvalClassification` TextField, `approvalMethod` TextField, `approvalNo` TextField, `stateName` TextField, `taxTy` TextField, `merchantStatus` TextField, `merchantNo` TextField, `bizLicenseNo` TextField, `representativeName` TextField, `merchantAddr` TextField, `merchantPhone` TextField, `dataBankCode` TextField, `dataBankName` ComboBoxField("CreditCardCompany")

#### 이벤트
[E0] 화면 열림 (생성자 L93-113) → getEditor()
[E1] updateButton[저장].Select (L100) → updateCheck()
       └ [E3] msgBox.DialogHide [YES] (L223) → updateRow()
[E2] dataBankName[카드회사].Collapse (L121) → 인라인 L121-126 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L115-194 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L196-202 | 공개 메서드 | 상태 처리 | 업무 |
| public updateCheck() | L204-252 | E1 | ConfirmBox → E3 | 업무 |
| public updateRow() | L254-304 | E3,updateCheck | 서비스 crd.Crd02_Data.update | 업무 |
| private setHtmlStyle() | L306-308 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlStyle() | L310-313 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateCheck}>저장</Button>

