# Pay07_Tab_Retire

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리(Old) > 퇴직정산서(old) (#1139)
- 파일: `client/vi/pay/Pay07_Tab_Retire.java`
- 함께 쓰는 클래스 7개:
  - `Pay07_TabPage_RetireStatement2` `client/vi/pay/Pay07_TabPage_RetireStatement2.java`
  - `Pay07_Rd_RetireStatementInsure` `client/vi/pay/Pay07_Rd_RetireStatementInsure.java`
  - `Pay07_TabPage_RetireStatement1` `client/vi/pay/Pay07_TabPage_RetireStatement1.java`
  - `Pay07_Rd_RetireStatement` `client/vi/pay/Pay07_Rd_RetireStatement.java`
  - `Pay07_Lookup_RetireCreate` `client/vi/pay/Pay07_Lookup_RetireCreate.java`
  - `Pay06_Lookup_RetireList` `client/vi/pay/Pay06_Lookup_RetireList.java`
  - `Pay06_Lookup_RetireMapping` `client/vi/pay/Pay06_Lookup_RetireMapping.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Pay06_Popup_Example`](../../pay/components/Pay06_Popup_Example.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay07_TabPage_RetireStatement1:140 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay07_TabPage_RetireStatement1:163, Pay07_TabPage_RetireStatement1:96 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp00_TransInfo.selectRetireEmpList` | Pay07_Tab_Retire:103 | [`Emp00_TransInfo.java:587`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectRetireEmpList`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay06_ActMapping.delete` | Pay06_Lookup_RetireList:262 | [`Pay06_ActMapping.java:82`](../../pay/services/Pay06_ActMapping.md) | `UpdateDataModel(pay06_act_mapping)` 동적 DELETE |
| `pay.Pay06_ActMapping.selectByLinkCode` | Pay06_Lookup_RetireList:212 | [`Pay06_ActMapping.java:51`](../../pay/services/Pay06_ActMapping.md) | [`pay06_act_mapping.selectByLinkCode`](../../pay/sql/pay06_act_mapping.md) |
| `pay.Pay06_ActMapping.update` | Pay06_Lookup_RetireList:258 | [`Pay06_ActMapping.java:77`](../../pay/services/Pay06_ActMapping.md) | `UpdateDataModel(pay06_act_mapping)` 동적 INSERT/UPDATE → [`pay06_act_mapping.selectById`](../../pay/sql/pay06_act_mapping.md) |
| `pay.Pay07_Retire.countRetire` | Pay07_Tab_Retire:216, Pay07_Tab_Retire:252 | [`Pay07_Retire.java:56`](../../pay/services/Pay07_Retire.md) | [`pay07_retire.countRetire`](../../pay/sql/pay07_retire.md) |
| `pay.Pay07_Retire.createRetire` | Pay07_Lookup_RetireCreate:189 | [`Pay07_Retire.java:61`](../../pay/services/Pay07_Retire.md) | [`pay07_retire.checkAppr`](../../pay/sql/pay07_retire.md) |
| `pay.Pay07_Retire.deleteRetire` | Pay07_Tab_Retire:279 | [`Pay07_Retire.java:95`](../../pay/services/Pay07_Retire.md) | [`pay07_retire.checkAppr`](../../pay/sql/pay07_retire.md) |
| `pay.Pay07_Retire.selectByPersonId` | Pay07_TabPage_RetireStatement1:225, Pay07_TabPage_RetireStatement1:287 | [`Pay07_Retire.java:42`](../../pay/services/Pay07_Retire.md) | [`pay07_retire.selectByPersonId`](../../pay/sql/pay07_retire.md) |
| `pay.Pay07_Retire.updateApprId` | Pay07_TabPage_RetireStatement1:201 | [`Pay07_Retire.java:139`](../../pay/services/Pay07_Retire.md) | [`pay07_retire.updateApprId`](../../pay/sql/pay07_retire.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay06_act_mapping`](../../../db/tables/pay.md), [`pay07_retire`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay07_Tab_Retire (`client/vi/pay/Pay07_Tab_Retire.java`, 301줄)

- 레이아웃: north=buttonBar, center=tabPanel
- 툴바 `buttonBar`: 성명: {selectPersonField} {retrieveButton} {createButton} {deleteButton} {mappingButton} {dcrLinkButton}
- 입력·하위 화면: `selectPersonField` LookupTriggerField 빈칸="선택하여 주세요", `lookup` Pay06_Lookup_RetireList, `tabPage1` Pay07_TabPage_RetireStatement1, `tabPage2` Pay07_TabPage_RetireStatement2, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookupCreate` Pay07_Lookup_RetireCreate

#### 이벤트
[E0] 화면 열림 (생성자 L56-84) → setting()
[E1] selectPersonField.TriggerClick (L89) → lookupPerson()
[E2] selectPersonField.Change (L96) → retrieveTabpage(), lookupPerson()
[E3] retrieveButton[조회].Select (L127) → retrieveTabpage()
[E4] createButton[생성].Select (L133) → preInsert()
       └ [E9] messageBox.DialogHide [YES] (L227) → insert()
[E5] deleteButton[삭제].Select (L139) → preDelete()
       └ [E10] messageBox.DialogHide [YES] (L264) → delete()
[E6] mappingButton[계약서 양식작성].Select (L145) → 인라인 L145-151 (new SelectHandler() { @Override publi…)
[E7] dcrLinkButton[문서분류지정].Select (L152) → 인라인 L152-163 (new SelectHandler() { @Override publi…)
[E8] tabPanel.Selection (L172) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setting() | L86-178 | 생성자 | 조회창 Pay06_Lookup_RetireList 열기, 조회창 Dcr30_Lookup_Link 열기, 서비스 emp.Emp00_TransInfo.selectRetireEmpList(companyId, searchText, transDate, transCode) | 업무 |
| private lookupPerson() | L180-195 | E1,E2 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private retrieveTabpage() | L197-208 | E2,E3,E8,insert,delete | 선택 회사로 탭페이지 retrieve | 업무 |
| private preInsert() | L210-239 | E4 | ConfirmBox → E9 | 업무 |
| private insert() | L241-249 | E9,preInsert | 조회창 Pay07_Lookup_RetireCreate 열기 | 업무 |
| private preDelete() | L251-276 | E5 | ConfirmBox → E10 | 업무 |
| private delete() | L278-296 | E10 | 서비스 pay.Pay07_Retire.deleteRetire | 업무 |
| private setHtmlBarStyle() | L298-300 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveTabpage}>조회</Button>
2. <Button type="generate" onClick={preInsert}>생성</Button>
3. <Button type="delete" onClick={preDelete}>삭제</Button>
4. <Button type="register" onClick={() => /* 인라인 L145-151 (new SelectHandler() { @Override publi…) */}>계약서 양식작성</Button>
5. <Button type="save" onClick={() => /* 인라인 L152-163 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

### Pay07_TabPage_RetireStatement2 (`client/vi/pay/Pay07_TabPage_RetireStatement2.java`, 38줄)

- 레이아웃: center=rdForm

#### 이벤트
[E0] 화면 열림 (생성자 L14-20) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L23-24 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L27-30 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L33-36 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay07_Rd_RetireStatementInsure (`client/vi/pay/Pay07_Rd_RetireStatementInsure.java`, 70줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-52 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L55-56 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L59-60 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L63-64 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L67-68 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay07_TabPage_RetireStatement1 (`client/vi/pay/Pay07_TabPage_RetireStatement1.java`, 355줄)

- 레이아웃: center=rdForm, south=hlc
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L55-75) → settings(), defaultName()
[E1] classTreeFullName[문서분류].TriggerClick (L81) → openLookupDoc()
[E2] apprButton[상신].Select (L87) → insertLinkApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L95-114 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private openLookupDoc() | L116-125 | E1 | 상태 처리 | 업무 |
| private insertLinkApproval() | L127-198 | E2 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L200-213 | insertLinkApproval | 서비스 pay.Pay07_Retire.updateApprId(apprId, personId, companyId) | 업무 |
| public init() | L216-217 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L220-282 | 공개 메서드 | 서비스 pay.Pay07_Retire.selectByPersonId(personId, companyId) | 업무 |
| private retrieveApprStep() | L284-310 | insertLinkApproval,updateApprId,retrieve | 서비스 pay.Pay07_Retire.selectByPersonId | 업무 |
| private checkStringNull() | L312-320 | retrieve | 상태 처리 | 업무 |
| private checkLongNull() | L322-332 | retrieve | 상태 처리 | 업무 |
| private checkDateNull() | L334-344 | retrieve | 상태 처리 | 업무 |
| public getGrid() | L351-354 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L77-93 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L346-348 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={insertLinkApproval}>상신</Button>

### Pay07_Rd_RetireStatement (`client/vi/pay/Pay07_Rd_RetireStatement.java`, 70줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-52 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L55-56 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L59-60 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L63-64 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L67-68 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay07_Lookup_RetireCreate (`client/vi/pay/Pay07_Lookup_RetireCreate.java`, 225줄)

- 입력·하위 화면: `calcMonth` LongField, `fixHi` LongField, `fixLt` LongField, `fixEi` LongField, `nonHiYn` CheckBox, `nonLtYn` CheckBox, `nonEiYn` CheckBox

#### 이벤트
[E1] nonHiYn[없음].ValueChange [nonHiYn.getValue()] (L75) → 인라인 L75-85 (new ValueChangeHandler<Boolean>() { @…)
[E2] nonLtYn[없음].ValueChange [nonLtYn.getValue()] (L86) → 인라인 L86-96 (new ValueChangeHandler<Boolean>() { @…)
[E3] nonEiYn[없음].ValueChange [nonEiYn.getValue()] (L97) → 인라인 L97-107 (new ValueChangeHandler<Boolean>() { @…)
[E4] createButton[생성].Select (L147) → create()
[E5] closeButton[닫기].Select (L154) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-165 | 공개 메서드 | 상태 처리 | 업무 |
| public create() | L167-212 | E4 | 서비스 pay.Pay07_Retire.createRetire | 업무 |
| private setHtmlStyle() | L214-216 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L218-220 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L222-224 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={create}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay06_Lookup_RetireList (`client/vi/pay/Pay06_Lookup_RetireList.java`, 282줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `editor` Pay06_Lookup_RetireMapping, `kindNameComboBox` ComboBoxField("EmpKindCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - linkName 150 "매뉴" TextCenter
  - kindName 120 "사원구분" Text 편집:kindNameComboBox
  - title 400 "제목" Text 편집:TextField
  - actionCell 60 "내용" Cell 편집:actionCell
  - note 440 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L71-137) → show(), retrieve()
[E1] anchor.MouseDown (L81) → retrieve()
[E2] insertButton[행 추가].Select (L87) → insertRow()
[E3] deleteButton[행 삭제].Select (L93) → deleteRow()
[E4] updateButton[저장].Select (L100) → updateCheck()
[E5] cancleButton[닫기].Select (L106) → hide()
[E6] kindNameComboBox[EmpKindCode].Collapse (L162) → 인라인 L162-168 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-69 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L180-189 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L191-197 | E3 | 상태 처리 | 업무 |
| public retrieve() | L199-213 | 생성자,E1,open | 서비스 pay.Pay06_ActMapping.selectByLinkCode(companyId, kindCode, linkCode, linkCode) | 업무 |
| public update() | L215-271 | updateCheck | GridDeleteData pay.Pay06_ActMapping.update, pay.Pay06_ActMapping.delete | 업무 |
| private updateCheck() | L273-276 | E4 | 상태 처리 | 업무 |
| public buildGrid() | L139-178 | 필드 초기화 | 조회창 Pay06_Lookup_RetireMapping 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L278-280 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('linkNm', 150, '매뉴'),  // L171 SQL 계산 컬럼(selectByLinkCode: f_cdnm('LinkCode', pay06_link_cd, pay06…)
  gb.text('kindNm', 120, '사원구분', { editor: 'select' }),  // L172 SQL 계산 컬럼(selectByLinkCode: f_cdnm('EmpKindCode', pay06_kind_cd, pa…)
  gb.text('title', 400, '제목', { editor: 'text' }),  // L173
  // ⚠ 대응 없음 (GridBuilder L174) addCell
  gb.text('note', 440, '비고', { editor: 'text' }),  // L175
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={updateCheck}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay06_Lookup_RetireMapping (`client/vi/pay/Pay06_Lookup_RetireMapping.java`, 177줄)

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
| public update() | L146-157 | E1 | 상태 처리 | 업무 |
| private setHtmlStyle() | L169-171 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L173-175 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

