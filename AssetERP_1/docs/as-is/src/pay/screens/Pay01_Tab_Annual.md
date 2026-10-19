# Pay01_Tab_Annual

- 종류: 화면
- 메뉴: 경영관리 > 03. 연봉관리 > 연봉계약관리 (#1037)
- 파일: `client/vi/pay/Pay01_Tab_Annual.java`
- 함께 쓰는 클래스 2개:
  - `Pay06_Lookup_ActList` `client/vi/pay/Pay06_Lookup_ActList.java`
  - `Pay06_Lookup_ActMapping` `client/vi/pay/Pay06_Lookup_ActMapping.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Pay06_Popup_Example`](../../pay/components/Pay06_Popup_Example.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay01_Tab_Annual:420 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay01_Tab_Annual:187, Pay01_Tab_Annual:512 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp00_TransInfo.selectByText` | Pay01_Tab_Annual:259 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay01_Annual.delete` | Pay01_Tab_Annual:660 | [`Pay01_Annual.java:59`](../../pay/services/Pay01_Annual.md) | `UpdateDataModel(pay01_annual)` 동적 DELETE |
| `pay.Pay01_Annual.selectByAll` | Pay01_Tab_Annual:572 | [`Pay01_Annual.java:24`](../../pay/services/Pay01_Annual.md) | [`pay01_annual.selectByAll`](../../pay/sql/pay01_annual.md) |
| `pay.Pay01_Annual.selectByPersonId` | Pay01_Tab_Annual:585 | [`Pay01_Annual.java:39`](../../pay/services/Pay01_Annual.md) | [`pay01_annual.selectByPersonId`](../../pay/sql/pay01_annual.md) |
| `pay.Pay01_Annual.update` | Pay01_Tab_Annual:627 | [`Pay01_Annual.java:54`](../../pay/services/Pay01_Annual.md) | `UpdateDataModel(pay01_annual)` 동적 INSERT/UPDATE → [`pay01_annual.selectById`](../../pay/sql/pay01_annual.md) |
| `pay.Pay01_Annual.updateApprId` | Pay01_Tab_Annual:550 | [`Pay01_Annual.java:45`](../../pay/services/Pay01_Annual.md) | [`pay01_annual.updateApprId`](../../pay/sql/pay01_annual.md) |
| `pay.Pay06_ActMapping.delete` | Pay06_Lookup_ActList:295 | [`Pay06_ActMapping.java:82`](../../pay/services/Pay06_ActMapping.md) | `UpdateDataModel(pay06_act_mapping)` 동적 DELETE |
| `pay.Pay06_ActMapping.selectByLinkCode` | Pay06_Lookup_ActList:245 | [`Pay06_ActMapping.java:51`](../../pay/services/Pay06_ActMapping.md) | [`pay06_act_mapping.selectByLinkCode`](../../pay/sql/pay06_act_mapping.md) |
| `pay.Pay06_ActMapping.update` | Pay06_Lookup_ActList:291 | [`Pay06_ActMapping.java:77`](../../pay/services/Pay06_ActMapping.md) | `UpdateDataModel(pay06_act_mapping)` 동적 INSERT/UPDATE → [`pay06_act_mapping.selectById`](../../pay/sql/pay06_act_mapping.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay06_act_mapping`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay01_Tab_Annual (`client/vi/pay/Pay01_Tab_Annual.java`, 797줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 사원명: {personName} {radioHlc} {retireCheckBox} {retrieveButton} {insertButton} {updateButton} {deleteButton} {tempDownloadButton} {excelUploadButton} {uploadExcelForm} {downloadForm} {mappingButton}
- 입력·하위 화면: `personName` LookupTriggerField 빈칸="전체", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `personId` LongField, `radio01` Radio, `radio02` Radio, `radio03` Radio, `yearText` TextField 빈칸="YYYY", `retireCheckBox` CheckBox, `lookup` Pay06_Lookup_ActList, `lookupEmpInfo` LookupTriggerField, `lookupEmp` Emp00_Lookup_SelectSingle, `editor` Apr01_Edit_ApprDoc, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - posName 80 "직급" TextCenter
  - personNo 50 "사번" TextCenter
  - personName 80 "성명" TextCenter 편집:lookupEmpInfo
  - startDate 100 "적용시작일" Date 편집:DateField
  - closeDate 100 "적용종료일" Date 편집:DateField
  - startTime 80 "시업시간" TextCenter 편집:TextField
  - closeTime 80 "종업시간" TextCenter 편집:TextField
  - monthOtHours 80 "월연장<br>근로시간" LongCenter 편집:LongField
  - annualPay 100 "기본연봉" Long 편집:"456EA6"
  - retirePay 100 "퇴직금" Long 편집:"456EA6"
  - yearPay 100 "총연봉" Long 편집:"456EA6"
  - etcAgreement 100 "기타약정사항" Text 편집:"456EA6"
  - basicPay 100 "기본급여" Long 편집:LongField
  - mealPay 100 "중식대" Long 편집:LongField
  - carMt 100 "차량유지비" Long 편집:LongField
  - childcareAllowance 100 "양육수당" Long 편집:LongField
  - overPay 100 "연장근로" Long 편집:LongField
  - etc01Pay 100 "기타급여1" Long 편집:LongField
  - etc02Pay 100 "기타급여2" Long 편집:LongField
  - monthPay 100 "합계" Long
  - apprStatusName 100 "상신상태" TextCenter
  - actionCell 60 "" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L124-184) → settings(), createMapping(), defaultName()
[E1] toggleGroup.ValueChange (L222) → 인라인 L222-239 (new ValueChangeHandler<HasValue<Boole…)
[E2] personName.TriggerClick (L245) → openLookupPerson()
[E3] personName.ValueChange (L251) → retrieve(), openLookupPerson()
[E4] retrieveButton[조회].Select (L282) → retrieve()
[E5] insertButton[등록].Select (L288) → insert()
[E6] updateButton[저장].Select (L294) → update()
[E7] deleteButton[삭제].Select (L300) → delete()
       └ [E17] messageBox.DialogHide (L645) → deleteSelectedRow()
[E8] mappingButton[계약서 양식작성].Select (L306) → defaultName()
[E9] classTreeFullName[문서분류].TriggerClick (L320) → openLookupDoc()
[E10] apprButton[상신].Select (L326) → insertLinkApproval()
[E11] tempDownloadButton[템플릿].Select (L332) → 인라인 L332-337 (new SelectHandler(){ @Override public…)
[E12] excelUploadButton[엑셀업로드].Select [YES] (L338) → excelUpload()
[E13] msgBox.DialogHide [YES] (L343) → excelUpload()
[E14] grid.CellClick (L362) → createMapping()
[E15] uploadExcelForm.SubmitComplete (L375) → retrieve()
[E16] lookupEmpInfo.TriggerClick [result != null] (L388) → 인라인 L388-407 (new TriggerClickHandler(){ @Override …)
[E18] fileUploadField.Change (L771) → 인라인 L771-776 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L186-205 | 생성자,E8 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public openLookupPerson() | L476-491 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private insertLinkApproval() | L493-547 | E10 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신을 진행할 연봉계약정보를 선택해주세요", 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L549-563 | insertLinkApproval | 서비스 pay.Pay01_Annual.updateApprId(annualId, apprId) | 업무 |
| public retrieve() | L565-592 | E3,E4,E15,updateApprId,update | 서비스 pay.Pay01_Annual.selectByAll, pay.Pay01_Annual.selectByPersonId(companyId, radioOption, yearStr, retireYn, companyId, personId, radioOption, yearStr, retireYn) | 업무 |
| public insert() | L594-599 | E5 | 상태 처리 | 업무 |
| public update() | L601-633 | E6 | 서비스 pay.Pay01_Annual.update | 업무 |
| public delete() | L635-655 | E7 | ConfirmBox → E17 | 업무 |
| private deleteSelectedRow() | L657-668 | E17 | GridDeleteData pay.Pay01_Annual.delete(체크된 행 목록) | 업무 |
| private openLookupDoc() | L671-680 | E9 | 상태 처리 | 업무 |
| private createMapping() | L682-727 | 생성자,E14 | 상태 처리 | 업무 |
| private checkStringNull() | L729-737 | createMapping | 상태 처리 | 업무 |
| private checkLongNull() | L739-749 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L751-761 | createMapping | 상태 처리 | 업무 |
| private excelUpload() | L763-779 | E12,E13 | 상태 처리 | 업무 |
| private settings() | L207-381 | 생성자 | 조회창 Pay06_Lookup_ActList 열기, 확인창 표시, 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode), 이벤트 연결, 초기값: radio01=true("최근등록내역"), radio02=false("년도별"), radio03=false("전체"), retireCheckBox=false("퇴사자 포함"), personName=null, personId=null, personName=empTransInfoModel.getEmpPersonModel(, personId=empTransInfoModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L383-474 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 없습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L781-783 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L785-787 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L789-791 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L793-796 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L440 newHeaderGroupMap02newHeaderGroupConfig18 100 "기본정보" (pay01_new_header_group_map02new_header_group_config18 컬럼 없음)
  // ⚠DB없음 L441 newHeaderGroupMap010newHeaderGroupConfigsetHtmlGridStyle14 100 "연봉 구성" (pay01_new_header_group_map010new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L442 newHeaderGroupMap014newHeaderGroupConfig17 100 "월급여 구성" (pay01_new_header_group_map014new_header_group_config17 컬럼 없음)
  gb.textCenter('posNm', 80, '직급'),  // L449 SQL 계산 컬럼(selectById: f_get_empTrans(emp01_person_id, pay01_s…)
  gb.textCenter('personNo', 50, '사번'),  // L450 SQL 계산 컬럼(selectById: emp01_emp_no)
  gb.textCenter('personNm', 80, '성명'),  // L451 SQL 계산 컬럼(selectById: emp01_kor_nm)
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L453
  gb.date('closeDate', 100, '적용종료일', { editor: 'date' }),  // L454
  gb.textCenter('startTime', 80, '시업시간', { editor: 'text' }),  // L455
  gb.textCenter('closeTime', 80, '종업시간', { editor: 'text' }),  // L456
  gb.longCenter('monthOtHours', 80, '월연장<br>근로시간', { editor: 'number' }),  // L457
  gb.long('annualPay', 100, '기본연봉', { editor: 'number' }),  // L458
  gb.long('retirePay', 100, '퇴직금', { editor: 'number' }),  // L459
  gb.long('yearPay', 100, '총연봉'),  // L460 SQL 계산 컬럼(selectByAll: COALESCE(pay01_annual_pay, 0) + COALESC…)
  gb.text('etcAgreement', 100, '기타약정사항', { editor: 'text' }),  // L461
  gb.long('basicPay', 100, '기본급여', { editor: 'number' }),  // L462
  gb.long('mealPay', 100, '중식대', { editor: 'number' }),  // L463
  gb.long('carMt', 100, '차량유지비', { editor: 'number' }),  // L464
  gb.long('childcareAllowance', 100, '양육수당', { editor: 'number' }),  // L465
  gb.long('overPay', 100, '연장근로', { editor: 'number' }),  // L466
  gb.long('etc01Pay', 100, '기타급여1', { editor: 'number' }),  // L467
  gb.long('etc02Pay', 100, '기타급여2', { editor: 'number' }),  // L468
  gb.long('monthPay', 100, '합계'),  // L469 SQL 계산 컬럼(selectByAll: COALESCE(pay01_basic_pay,0) + COALESCE(…)
  gb.textCenter('apprStatusNm', 100, '상신상태'),  // L470 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L471) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="download" onClick={() => /* 인라인 L332-337 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
6. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
7. <Button type="register" onClick={defaultName}>계약서 양식작성</Button>
8. <Button type="register" onClick={insertLinkApproval}>상신</Button>

### Pay06_Lookup_ActList (`client/vi/pay/Pay06_Lookup_ActList.java`, 315줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {dcrLinkButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookup` Dcr30_Lookup_Link, `editor` Pay06_Lookup_ActMapping, `kindNameComboBox` ComboBoxField("EmpKindCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - linkName 150 "매뉴" TextCenter
  - kindName 120 "사원구분" Text 편집:kindNameComboBox
  - title 400 "제목" Text 편집:TextField
  - actionCell 60 "내용" Cell 편집:actionCell
  - note 440 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L84-169) → show(), retrieve()
[E1] anchor.MouseDown (L95) → retrieve()
[E2] insertButton[행 추가].Select (L101) → insertRow()
[E3] deleteButton[행 삭제].Select (L107) → deleteRow()
[E4] dcrLinkButton[문서분류지정].Select (L113) → 인라인 L113-124 (new SelectHandler() { @Override publi…)
[E5] updateButton[저장].Select (L126) → updateCheck()
[E6] cancleButton[닫기].Select [callback != null] (L132) → hide()
[E7] kindNameComboBox[EmpKindCode].Collapse (L194) → 인라인 L194-200 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-74 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L76-82 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L213-222 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L224-230 | E3 | 상태 처리 | 업무 |
| public retrieve() | L232-246 | 생성자,E1,open | 서비스 pay.Pay06_ActMapping.selectByLinkCode(companyId, kindCode, linkCode, linkCode) | 업무 |
| public update() | L248-304 | updateCheck | GridDeleteData pay.Pay06_ActMapping.update, pay.Pay06_ActMapping.delete | 업무 |
| private updateCheck() | L306-309 | E5 | 상태 처리 | 업무 |
| public buildGrid() | L171-211 | 필드 초기화 | 조회창 Pay06_Lookup_ActMapping 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L311-313 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('linkNm', 150, '매뉴'),  // L203 SQL 계산 컬럼(selectByLinkCode: f_cdnm('LinkCode', pay06_link_cd, pay06…)
  gb.text('kindNm', 120, '사원구분', { editor: 'select' }),  // L204 SQL 계산 컬럼(selectByLinkCode: f_cdnm('EmpKindCode', pay06_kind_cd, pa…)
  gb.text('title', 400, '제목', { editor: 'text' }),  // L205
  // ⚠ 대응 없음 (GridBuilder L206) addCell
  gb.text('note', 440, '비고', { editor: 'text' }),  // L208
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={() => /* 인라인 L113-124 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>
4. <Button type="save" onClick={updateCheck}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay06_Lookup_ActMapping (`client/vi/pay/Pay06_Lookup_ActMapping.java`, 178줄)

- 입력·하위 화면: `content` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L67-108) → getEditor(), show()
[E1] updateButton[저장].Select (L84) → update()
[E2] closeButton[닫기].Select (L90) → hide()
[E3] referenceLabel.Click (L96) → 인라인 L96-101 (new ClickHandler() { @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-65 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L110-144 | 생성자 | 상태 처리 | 업무 |
| public update() | L147-158 | E1 | 상태 처리 | 업무 |
| private setHtmlStyle() | L170-172 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

