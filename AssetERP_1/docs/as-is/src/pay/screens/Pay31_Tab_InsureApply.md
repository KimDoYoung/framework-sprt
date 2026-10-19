# Pay31_Tab_InsureApply

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 4대보험신고(EDI) (#1275)
- 파일: `client/vi/pay/Pay31_Tab_InsureApply.java`
- 함께 쓰는 클래스 7개:
  - `Pay31_TabPage_InsureApply4` `client/vi/pay/Pay31_TabPage_InsureApply4.java`
  - `Pay31_TabPage_InsureApply3` `client/vi/pay/Pay31_TabPage_InsureApply3.java`
  - `Pay31_Lookup_Insert3` `client/vi/pay/Pay31_Lookup_Insert3.java`
  - `Pay31_TabPage_InsureApply2` `client/vi/pay/Pay31_TabPage_InsureApply2.java`
  - `Pay31_Lookup_Insert2` `client/vi/pay/Pay31_Lookup_Insert2.java`
  - `Pay31_TabPage_InsureApply1` `client/vi/pay/Pay31_TabPage_InsureApply1.java`
  - `Pay31_Lookup_Insert1` `client/vi/pay/Pay31_Lookup_Insert1.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Pay31_TabPage_InsureApply1:132, Pay31_TabPage_InsureApply2:155, Pay31_TabPage_InsureApply3:163, Pay31_TabPage_InsureApply4:172 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay31_InsureApply.delete` | Pay31_TabPage_InsureApply1:346, Pay31_TabPage_InsureApply2:377, Pay31_TabPage_InsureApply4:413 | [`Pay31_InsureApply.java:373`](../../pay/services/Pay31_InsureApply.md) | `UpdateDataModel(pay31_insure_apply)` 동적 DELETE |
| `pay.Pay31_InsureApply.deleteList` | Pay31_TabPage_InsureApply3:376 | [`Pay31_InsureApply.java:349`](../../pay/services/Pay31_InsureApply.md) | [`pay32_insure_pay.deleteByPersonId`](../../pay/sql/pay32_insure_pay.md), `UpdateDataModel(pay31_insure_apply)` 동적 DELETE |
| `pay.Pay31_InsureApply.insert1` | Pay31_Lookup_Insert1:291, Pay31_Lookup_Insert2:280 | [`Pay31_InsureApply.java:81`](../../pay/services/Pay31_InsureApply.md) | [`pay31_insure_apply.insert1`](../../pay/sql/pay31_insure_apply.md) |
| `pay.Pay31_InsureApply.insert3` | Pay31_Lookup_Insert3:183 | [`Pay31_InsureApply.java:122`](../../pay/services/Pay31_InsureApply.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp35_deduct.selectByCompanyId`](../../emp/sql/emp35_deduct.md), [`pay21_rate.selectByDate`](../../pay/sql/pay21_rate.md), [`pay31_insure_apply.delete3`](../../pay/sql/pay31_insure_apply.md), [`pay31_insure_apply.insert3-2`](../../pay/sql/pay31_insure_apply.md), [`pay31_insure_apply.insert3-4`](../../pay/sql/pay31_insure_apply.md), [`pay32_insure_pay.createInsureAdjust`](../../pay/sql/pay32_insure_pay.md) |
| `pay.Pay31_InsureApply.selectByCompanyId` | Pay31_TabPage_InsureApply1:280, Pay31_TabPage_InsureApply2:308, Pay31_TabPage_InsureApply3:301, Pay31_TabPage_InsureApply4:356 | [`Pay31_InsureApply.java:49`](../../pay/services/Pay31_InsureApply.md) | [`pay31_insure_apply.selectByCompanyId`](../../pay/sql/pay31_insure_apply.md) |
| `pay.Pay31_InsureApply.update` | Pay31_TabPage_InsureApply1:312, Pay31_TabPage_InsureApply2:343, Pay31_TabPage_InsureApply4:380 | [`Pay31_InsureApply.java:368`](../../pay/services/Pay31_InsureApply.md) | `UpdateDataModel(pay31_insure_apply)` 동적 INSERT/UPDATE → [`pay31_insure_apply.selectById`](../../pay/sql/pay31_insure_apply.md) |
| `pay.Pay31_InsureApply.updateList` | Pay31_TabPage_InsureApply3:319 | [`Pay31_InsureApply.java:326`](../../pay/services/Pay31_InsureApply.md) | [`pay31_insure_apply.updateModel`](../../pay/sql/pay31_insure_apply.md), [`pay32_insure_pay.createInsureAdjust`](../../pay/sql/pay32_insure_pay.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay31_Lookup_Insert1:106, Pay31_Lookup_Insert2:104, Pay31_TabPage_InsureApply3:124, Pay31_TabPage_InsureApply4:140 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp35_deduct`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay21_rate`](../../../db/tables/pay.md), [`pay31_insure_apply`](../../../db/tables/pay.md), [`pay32_insure_pay`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_calc_4insure_adjust`, `f_cdnm`, `f_create_seq`, `f_get_datedif`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay31_Tab_InsureApply (`client/vi/pay/Pay31_Tab_InsureApply.java`, 63줄)

- 레이아웃: center=tabPanel
- 입력·하위 화면: `tabPage1` Pay31_TabPage_InsureApply1, `tabPage2` Pay31_TabPage_InsureApply2, `tabPage3` Pay31_TabPage_InsureApply3, `tabPage4` Pay31_TabPage_InsureApply4

#### 이벤트
[E0] 화면 열림 (생성자 L20-57) → 초기화
[E1] tabPanel.Selection [arg0 != null] (L22) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L59-62 | E1 | 선택 회사로 탭페이지 retrieve | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay31_TabPage_InsureApply4 (`client/vi/pay/Pay31_TabPage_InsureApply4.java`, 453줄)

- 툴바 `buttonBar`: 기준년도: {yearText} 신고구분: {insureComboBox} 사원명: {personName} {retrieveButton} {insertButton} {updateButton} {deleteButton} {tempDownloadButton} {downloadForm} {excelUploadButton} {uploadExcelForm}
- 툴바 `buttonBarBottom`: {link}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `personName` LookupTriggerField, `personId` LongField, `insureComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체"), `lookupEmpTransInfo` LookupTriggerField, `lookup` Emp00_Lookup_SelectSingle, `payComboBox` ComboBoxField("DivPayCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 80 "사번" TextCenter
  - personName 100 "성명" TextCenter 편집:lookupEmpTransInfo
  - insureName 150 "구분" Text 편집:insureComboBox
  - payName 150 "납부방법" Text 편집:payComboBox
  - payDiv 150 "분할납부지정회차" Long 편집:LongField
  - applyDate 100 "신고일자" Date 편집:MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L96-133) → settings()
[E1] yearText.KeyPress [Enter] (L148) → retrieve()
[E2] personName.TriggerClick (L158) → openLookupPerson()
[E3] personName.ValueChange (L164) → retrieve(), openLookupPerson()
[E4] retrieveButton[조회].Select (L196) → retrieve()
[E5] insertButton[등록].Select (L202) → insertRow()
[E6] updateButton[저장].Select (L208) → update()
[E7] deleteButton[삭제].Select (L214) → deleteRow()
       └ [E14] messageBox.DialogHide [YES] (L407) → 서비스 pay.Pay31_InsureApply.delete
[E8] tempDownloadButton[템플릿].Select (L220) → 인라인 L220-225 (new SelectHandler(){ @Override public…)
[E9] excelUploadButton[엑셀업로드].Select (L226) → excelUpload()
[E10] uploadExcelForm.SubmitComplete (L238) → retrieve()
[E11] lookupEmpTransInfo.TriggerClick (L252) → 인라인 L252-268 (new TriggerClickHandler() { @Override…)
[E12] insureComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L277) → 인라인 L277-285 (new CollapseHandler() { @Override pub…)
[E13] payComboBox[DivPayCode].Collapse (L288) → 인라인 L288-296 (new CollapseHandler() { @Override pub…)
[E15] fileUploadField.Change (L430) → 인라인 L430-435 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openLookupPerson() | L311-326 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public init() | L329-331 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L334-336 | E1,E3,E4,E10 | 상태 처리 | 업무 |
| public retrieve() | L339-357 | E1,E3,E4,E10 | 서비스 pay.Pay31_InsureApply.selectByCompanyId(startDate, closeDate, companyId, personId, insureCode, insureApplyGubun, year) | 업무 |
| public update() | L360-391 | E6 | 서비스 pay.Pay31_InsureApply.update | 업무 |
| public insertRow() | L394-401 | E5 | 상태 처리 | 업무 |
| public deleteRow() | L404-419 | E7 | ConfirmBox → E14 | 업무 |
| private excelUpload() | L421-438 | E9 | 상태 처리 | 업무 |
| public getGrid() | L449-452 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L135-244 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle), 이벤트 연결, 초기값: personName=null, personId=null, personName=resultModel.getEmpPersonModel(, personId=resultModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L246-309 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L440-442 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L444-446 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 80, '사번'),  // L298 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L299 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.text('insureNm', 150, '구분', { editor: 'select' }),  // L300 SQL 계산 컬럼(selectByCompanyId: f_cdnm('InsureCode', pay31_insure_cd, p…)
  gb.text('payNm', 150, '납부방법', { editor: 'select' }),  // L302 SQL 계산 컬럼(selectByCompanyId: f_cdnm('DivPayCode', pay31_pay_cd, pay3…)
  gb.long('payDiv', 150, '분할납부지정회차', { editor: 'number' }),  // L303
  gb.date('applyDate', 100, '신고일자', { editor: 'date' }),  // L304
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="download" onClick={() => /* 인라인 L220-225 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
6. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

### Pay31_TabPage_InsureApply3 (`client/vi/pay/Pay31_TabPage_InsureApply3.java`, 415줄)

- 툴바 `buttonBar`: 기준년도: {yearText} 신고구분: {insureComboBox} 사원명: {personName} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBarBottom`: {anchor}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `personName` LookupTriggerField, `personId` LongField, `insureComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookup` Pay31_Lookup_Insert3
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 80 "사번" TextCenter
  - personName 100 "성명" TextCenter
  - insureYearPay 200 "기준년도 보험료 납부총액" Long
  - preYearPay1 200 "기준년도 보수총액" Long 편집:LongField
  - preYearPay1 200 "기준년도 보수총액<br>(구간1)" Long 편집:LongField
  - preYearPay2 200 "기준년도 보수총액<br>(구간2)" Long 편집:LongField
  - preYearPay3 200 "기준년도 보수총액<br>(구간3)" Long 편집:LongField
  - preYearWorkMonthCnt 150 "근무개월수" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L83-113) → settings()
[E1] insureComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L128) → retrieve()
[E2] yearText.KeyPress [Enter] (L139) → retrieve()
[E3] personName.TriggerClick (L149) → openLookupPerson()
[E4] personName.ValueChange (L155) → retrieve(), openLookupPerson()
[E5] retrieveButton[조회].Select (L187) → retrieve()
[E6] insertButton[생성].Select (L193) → insertRow()
[E7] updateButton[저장].Select (L199) → update()
[E8] deleteButton[삭제].Select (L205) → deleteRow()
       └ [E9] messageBox.DialogHide [YES] (L365) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openLookupPerson() | L230-245 | E3,E4 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public init() | L248-250 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L253-255 | E1,E2,E4,E5,E9,update,insertRow | 상태 처리 | 업무 |
| public retrieve() | L258-302 | E1,E2,E4,E5,E9,update,insertRow | 미선택 시 alert "기준년도를 입력해주세요", 서비스 pay.Pay31_InsureApply.selectByCompanyId(startDate, closeDate, year, companyId, personId, insureCode, insureApplyGubun) | 업무 |
| public update() | L305-348 | E7 | 서비스 pay.Pay31_InsureApply.updateList(year) | 업무 |
| public insertRow() | L351-359 | E6 | 조회창 Pay31_Lookup_Insert3 열기 | 업무 |
| public deleteRow() | L362-400 | E8 | ConfirmBox → E9 | 업무 |
| public getGrid() | L411-414 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L115-211 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle), 이벤트 연결, 초기값: personName=null, personId=null, personName=resultModel.getEmpPersonModel(, personId=resultModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L213-228 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L402-404 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L406-408 | retrieve | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 80, '사번'),  // L217 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L218 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.long('insureYearPay', 200, '기준년도 보험료 납부총액'),  // L220 SQL 계산 컬럼(selectByCompanyId: ( SELECT COALESCE(SUM(pay11_item_amt), …)
  gb.long('preYearPay1', 200, '기준년도 보수총액', { editor: 'number' }),  // L221
  gb.long('preYearPay1', 200, '기준년도 보수총액<br>(구간1)', { editor: 'number' }),  // L222
  gb.long('preYearPay2', 200, '기준년도 보수총액<br>(구간2)', { editor: 'number' }),  // L223
  gb.long('preYearPay3', 200, '기준년도 보수총액<br>(구간3)', { editor: 'number' }),  // L224
  gb.long('preYearWorkMonthCnt', 150, '근무개월수', { editor: 'number' }),  // L225
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={insertRow}>생성</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay31_Lookup_Insert3 (`client/vi/pay/Pay31_Lookup_Insert3.java`, 212줄)

- 입력·하위 화면: `personName` LookupTriggerField, `personId` LongField, `radio01` Radio, `radio02` Radio, `allYn` TextField, `lookup` Emp00_Lookup_SelectSingle

#### 이벤트
[E1] toggle.ValueChange (L109) → 인라인 L109-124 (new ValueChangeHandler<HasValue<Boole…)
[E2] personName.TriggerClick (L127) → 인라인 L127-140 (new TriggerClickHandler() { @Override…)
[E3] insertButton[생성].Select (L141) → insertCheck()
       └ [E5] msgBox.DialogHide [YES] (L164) → insert()
[E4] closeButton[닫기].Select (L147) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-95 | 공개 메서드 | 상태 처리 | 업무 |
| public insertCheck() | L156-180 | E3 | ConfirmBox → E5 | 업무 |
| private insert() | L182-203 | E5 | 서비스 pay.Pay31_InsureApply.insert3(companyId, personId, applyDate, year, allYn) | 업무 |
| private settings() | L97-154 | open | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: allYn="true", radio01=true("전체생성"), radio02=false("개별생성"), allYn="true", personName=null, personId=null, allYn="false", personId=resultModel.getPersonId(, personName=resultModel.getEmpPersonModel( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L205-207 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L209-211 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={insertCheck}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay31_TabPage_InsureApply2 (`client/vi/pay/Pay31_TabPage_InsureApply2.java`, 418줄)

- 툴바 `buttonBar`: 신고일: {startDate} ~: {closeDate} 사원명: {personName} {retrieveButton} {insertButton} {updateButton} {deleteButton} {excelUploadButton} {uploadExcelForm}
- 툴바 `buttonBarBottom`: {link}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `personName` LookupTriggerField, `personId` LongField, `lookupEmpTransInfo` LookupTriggerField, `lookup` Emp00_Lookup_SelectSingle, `insureComboBox` ComboBoxField("InsureCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 80 "사번" TextCenter
  - personName 100 "성명" TextCenter 편집:lookupEmpTransInfo
  - applyDate 100 "신고일자" Date 편집:MyDateField
  - insureApplyName 150 "신고구분" Text
  - insureName 150 "신청대상" Text 편집:insureComboBox
  - initDate 100 "취득일자" Date 편집:MyDateField
  - applyMonth 100 "변경적용월" TextCenter 편집:TextField
  - applyMonthPay 200 "보수월액" Long 편집:LongField
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L88-121) → settings()
[E1] uploadExcelForm.SubmitComplete (L127) → retrieve()
[E2] personName.TriggerClick (L141) → openLookupPerson()
[E3] personName.ValueChange (L147) → retrieve(), openLookupPerson()
[E4] retrieveButton[조회].Select (L179) → retrieve()
[E5] insertButton[등록].Select (L185) → insertRow()
[E6] updateButton[저장].Select (L191) → update()
[E7] deleteButton[삭제].Select (L197) → deleteRow()
       └ [E11] messageBox.DialogHide [YES] (L371) → 서비스 pay.Pay31_InsureApply.delete
[E8] excelUploadButton[엑셀업로드].Select (L203) → excelUpload()
[E9] lookupEmpTransInfo.TriggerClick (L217) → 인라인 L217-233 (new TriggerClickHandler() { @Override…)
[E10] insureComboBox[InsureCode].Collapse (L235) → 인라인 L235-243 (new CollapseHandler() { @Override pub…)
[E12] fileUploadField.Change (L395) → 인라인 L395-400 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openLookupPerson() | L272-287 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public init() | L290-292 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L295-297 | E1,E3,E4,insertRow | 상태 처리 | 업무 |
| public retrieve() | L300-309 | E1,E3,E4,insertRow | 서비스 pay.Pay31_InsureApply.selectByCompanyId(startDate, closeDate, companyId, personId, insureCode, insureApplyGubun) | 업무 |
| public update() | L312-354 | E6 | 서비스 pay.Pay31_InsureApply.update | 업무 |
| public insertRow() | L357-365 | E5 | 조회창 Pay31_Lookup_Insert2 열기 | 업무 |
| public deleteRow() | L368-383 | E7 | ConfirmBox → E11 | 업무 |
| private excelUpload() | L385-403 | E8 | 상태 처리 | 업무 |
| public getGrid() | L414-417 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L123-209 | 생성자 | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle), 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, personName=null, personId=null, personName=resultModel.getEmpPersonModel(, personId=resultModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L211-270 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L405-407 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L409-411 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 80, '사번'),  // L259 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L260 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.date('applyDate', 100, '신고일자', { editor: 'date' }),  // L261
  gb.text('insureApplyNm', 150, '신고구분'),  // L262 SQL 계산 컬럼(selectByCompanyId: f_cdnm('InsureApplyCode', pay31_insure_…)
  gb.text('insureNm', 150, '신청대상', { editor: 'select' }),  // L263 SQL 계산 컬럼(selectByCompanyId: f_cdnm('InsureCode', pay31_insure_cd, p…)
  gb.date('initDate', 100, '취득일자', { editor: 'date' }),  // L264
  gb.textCenter('applyMonth', 100, '변경적용월', { editor: 'text' }),  // L265
  gb.long('applyMonthPay', 200, '보수월액', { editor: 'number' }),  // L266
  gb.text('note', 300, '비고', { editor: 'text' }),  // L267
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

### Pay31_Lookup_Insert2 (`client/vi/pay/Pay31_Lookup_Insert2.java`, 310줄)

- 입력·하위 화면: `personName` LookupTriggerField 빈칸="선택", `personId` LongField, `applyMonthPay` LongField, `applyMonth` TextField 빈칸="YYYY.MM", `applyDate` MyDateField, `initDate` MyDateField, `ch00` CheckBox, `ch01` CheckBox, `ch02` CheckBox, `ch03` CheckBox, `insureApplyName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `lookup` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L74-97) → settings(), getEditor(), show()
[E1] ch00[신청대상].ValueChange (L117) → 인라인 L117-124 (new ValueChangeHandler<Boolean>() { @…)
[E2] ch01.ValueChange [!event.getValue()] (L129) → 인라인 L129-138 (new ValueChangeHandler<Boolean>() { @…)
[E3] ch02.ValueChange [!event.getValue()] (L143) → 인라인 L143-152 (new ValueChangeHandler<Boolean>() { @…)
[E4] ch03.ValueChange [!event.getValue()] (L157) → 인라인 L157-166 (new ValueChangeHandler<Boolean>() { @…)
[E5] personName[사원].TriggerClick (L170) → 인라인 L170-184 (new TriggerClickHandler(){ @Override …)
[E6] insureApplyName[신고구분].ValueChange (L186) → 인라인 L186-199 (new ValueChangeHandler<String>() { @O…)
[E7] insertButton[생성].Select (L201) → insert()
[E8] closeButton[닫기].Select (L207) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L70-72 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L215-247 | 생성자 | 상태 처리 | 업무 |
| private insert() | L249-301 | E7 | 서비스 pay.Pay31_InsureApply.insert1(companyId, personId, ch01, ch02, ch03, npsInitPayYn, insureApplyCode, applyDate, initDate, applyMonthPay, applyMonth) | 업무 |
| private settings() | L99-213 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: ch01=event.getValue(, ch02=event.getValue(, ch03=event.getValue(, ch00=false("신청대상"), ch00=true("신청대상"), ch00=false("신청대상"), ch00=true("신청대상"), ch00=false("신청대상"), ch00=true("신청대상"), personId=resultModel.getPersonId(, personName=resultModel.getEmpPersonModel(("사원"), applyMonth=null("변경적용월"), initDate=null | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L303-305 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L307-309 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={insert}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay31_TabPage_InsureApply1 (`client/vi/pay/Pay31_TabPage_InsureApply1.java`, 367줄)

- 툴바 `buttonBar`: 신고일: {startDate} ~: {closeDate} 사원명: {personName} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBarBottom`: {link}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `personName` LookupTriggerField, `personId` LongField, `lookupEmpTransInfo` LookupTriggerField, `lookup` Emp00_Lookup_SelectSingle, `insureComboBox` ComboBoxField("InsureCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 80 "사번" TextCenter
  - personName 100 "성명" TextCenter 편집:lookupEmpTransInfo
  - applyDate 100 "신고일자" Date 편집:MyDateField
  - insureApplyName 150 "신고구분" Text
  - insureName 150 "신청대상" Text 편집:insureComboBox
  - initDate 100 "취득일자" Date 편집:MyDateField
  - applyMonth 100 "변경적용월" TextCenter 편집:TextField
  - applyMonthPay 200 "보수월액" Long 편집:LongField
  - npsInitPayYn 100 "국민연금<br>입사월 납부" Boolean
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L77-108) → settings()
[E1] personName.TriggerClick (L118) → openLookupPerson()
[E2] personName.ValueChange (L124) → retrieve(), openLookupPerson()
[E3] retrieveButton[조회].Select (L156) → retrieve()
[E4] insertButton[등록].Select (L162) → insertRow()
[E5] updateButton[저장].Select (L168) → update()
[E6] deleteButton[삭제].Select (L174) → deleteRow()
       └ [E9] messageBox.DialogHide [YES] (L340) → 서비스 pay.Pay31_InsureApply.delete
[E7] lookupEmpTransInfo.TriggerClick (L188) → 인라인 L188-204 (new TriggerClickHandler() { @Override…)
[E8] insureComboBox[InsureCode].Collapse (L206) → 인라인 L206-214 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openLookupPerson() | L244-259 | E1,E2 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public init() | L262-264 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L267-269 | E2,E3,insertRow | 상태 처리 | 업무 |
| public retrieve() | L272-281 | E2,E3,insertRow | 서비스 pay.Pay31_InsureApply.selectByCompanyId(startDate, closeDate, companyId, personId, insureCode, insureApplyGubun) | 업무 |
| public update() | L284-323 | E5 | 서비스 pay.Pay31_InsureApply.update | 업무 |
| public insertRow() | L326-334 | E4 | 조회창 Pay31_Lookup_Insert1 열기 | 업무 |
| public deleteRow() | L337-352 | E6 | ConfirmBox → E9 | 업무 |
| public getGrid() | L363-366 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L110-180 | 생성자 | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle), 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, personName=null, personId=null, personName=resultModel.getEmpPersonModel(, personId=resultModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-242 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L354-356 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L358-360 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 80, '사번'),  // L230 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L231 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.date('applyDate', 100, '신고일자', { editor: 'date' }),  // L232
  gb.text('insureApplyNm', 150, '신고구분'),  // L233 SQL 계산 컬럼(selectByCompanyId: f_cdnm('InsureApplyCode', pay31_insure_…)
  gb.text('insureNm', 150, '신청대상', { editor: 'select' }),  // L234 SQL 계산 컬럼(selectByCompanyId: f_cdnm('InsureCode', pay31_insure_cd, p…)
  gb.date('initDate', 100, '취득일자', { editor: 'date' }),  // L235
  gb.textCenter('applyMonth', 100, '변경적용월', { editor: 'text' }),  // L236
  gb.long('applyMonthPay', 200, '보수월액', { editor: 'number' }),  // L237
  gb.boolean('npsInitPayYn', 100, '국민연금<br>입사월 납부'),  // L238
  gb.text('note', 300, '비고', { editor: 'text' }),  // L239
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay31_Lookup_Insert1 (`client/vi/pay/Pay31_Lookup_Insert1.java`, 321줄)

- 입력·하위 화면: `personName` LookupTriggerField 빈칸="선택", `personId` LongField, `applyMonthPay` LongField, `applyMonth` TextField 빈칸="YYYY.MM", `applyDate` MyDateField, `initDate` MyDateField, `ch00` CheckBox, `ch01` CheckBox, `ch02` CheckBox, `ch03` CheckBox, `ch04` CheckBox, `insureApplyName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `lookup` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L76-99) → settings(), getEditor(), show()
[E1] ch00[신청대상].ValueChange [!event.getValue()] (L119) → 인라인 L119-129 (new ValueChangeHandler<Boolean>() { @…)
[E2] ch01.ValueChange [!event.getValue()] (L134) → 인라인 L134-144 (new ValueChangeHandler<Boolean>() { @…)
[E3] ch02.ValueChange [!event.getValue()] (L149) → 인라인 L149-158 (new ValueChangeHandler<Boolean>() { @…)
[E4] ch03.ValueChange [!event.getValue()] (L163) → 인라인 L163-172 (new ValueChangeHandler<Boolean>() { @…)
[E5] personName[사원].TriggerClick (L179) → 인라인 L179-193 (new TriggerClickHandler(){ @Override …)
[E6] insureApplyName[신고구분].ValueChange (L195) → 인라인 L195-208 (new ValueChangeHandler<String>() { @O…)
[E7] insertButton[생성].Select (L210) → insert()
[E8] closeButton[닫기].Select (L216) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-74 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L224-258 | 생성자 | 상태 처리 | 업무 |
| private insert() | L260-312 | E7 | 서비스 pay.Pay31_InsureApply.insert1(companyId, personId, ch01, ch02, ch03, npsInitPayYn, insureApplyCode, applyDate, initDate, applyMonthPay, applyMonth) | 업무 |
| private settings() | L101-222 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: ch01=event.getValue(, ch02=event.getValue(, ch03=event.getValue(, ch04=false, ch00=false("신청대상"), ch04=false, ch00=true("신청대상"), ch00=false("신청대상"), ch00=true("신청대상"), ch00=false("신청대상"), ch00=true("신청대상"), personId=resultModel.getPersonId(, personName=resultModel.getEmpPersonModel(("사원"), applyMonth=null, initDate=null("취득일") | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L314-316 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L318-320 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={insert}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

