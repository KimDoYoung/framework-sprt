# Pln02_Tab_Plan

- 종류: 화면
- 파일: `client/vi/pln/Pln02_Tab_Plan.java`
- 함께 쓰는 클래스 4개:
  - `Pln02_TabPage_Plan` `client/vi/pln/Pln02_TabPage_Plan.java`
  - `Pln00_Popup_ClassTree` `client/vi/pln/Pln00_Popup_ClassTree.java`
  - `Pln00_Lookup_ClassTree` `client/vi/pln/Pln00_Lookup_ClassTree.java`
  - `Pln00_Grid_ClassTree` `client/vi/pln/Pln00_Grid_ClassTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByClassTreeId` | Pln00_Grid_ClassTree:76 | [`Dcr01_ClassTree.java:202`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Pln00_Lookup_ClassTree:153 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `fnd.Fnd01_FundCode.selectByPlan` | Pln02_Tab_Plan:148 | [`Fnd01_FundCode.java:307`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByPlan`](../../fnd/sql/fnd01_fund_code.md) |
| `pln.Pln02_Plan.delete` | Pln02_TabPage_Plan:209 | [`Pln02_Plan.java:221`](../../pln/services/Pln02_Plan.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(pln02_plan)` 동적 DELETE |
| `pln.Pln02_Plan.selectByFundId` | Pln02_TabPage_Plan:141 | [`Pln02_Plan.java:48`](../../pln/services/Pln02_Plan.md) | [`pln02_plan.selectByFundId`](../../pln/sql/pln02_plan.md) |
| `pln.Pln02_Plan.update` | Pln02_TabPage_Plan:179 | [`Pln02_Plan.java:208`](../../pln/services/Pln02_Plan.md) | `UpdateDataModel(pln02_plan)` 동적 INSERT/UPDATE → [`pln02_plan.selectById`](../../pln/sql/pln02_plan.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`pln02_plan`](../../../db/tables/pln.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_fund_nm2`, `f_max_workdate`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pln02_Tab_Plan (`client/vi/pln/Pln02_Tab_Plan.java`, 179줄)

- 레이아웃: center=vlc, south=pln02_TabPage_Plan
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 기획펀드: {fundSearchTextField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `fundSearchTextField` TextField 빈칸="전체", `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `pln02_TabPage_Plan` Pln02_TabPage_Plan
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 70 "코드" Text
  - fundName 250 "펀드명" Text
  - fundTypeName 150 "펀드유형" Text
  - startDate 90 "설정일" Date
  - endDate 90 "해지일" Date
  - closeName 80 "종료구분" Text
  - sintakGbName 80 "신탁구분" Text
  - publicName 50 "공모" Text
  - orgCodeName 150 "운용부서" Text
  - emp1Name 90 "운용역1" Text
  - emp2Name 90 "운용역2" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-48) → init(), retrieve()
[E1] fundSearchTextField.KeyPress [Enter] (L53) → retrieve()
[E2] retrieveButton[조회].Select (L61) → retrieve()
[E3] grid.RowClick [data != null] (L67) → 인라인 L67-75 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L50-114 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L136-158 | 생성자,E1,E2 | 서비스 fnd.Fnd01_FundCode.selectByPlan(companyId, orgId, admin, closeYn, fundName, fundTypeCode) | 업무 |
| public update() | L161-162 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L165-166 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L169-170 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L116-133 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L172-174 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L176-178 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 70, '코드'),  // L120
  gb.text('fundNm', 250, '펀드명'),  // L121
  gb.text('fundTypeNm', 150, '펀드유형'),  // L122
  gb.date('startDate', 90, '설정일'),  // L123
  gb.date('endDate', 90, '해지일'),  // L124
  gb.text('closeNm', 80, '종료구분'),  // L125
  gb.text('sintakGbNm', 80, '신탁구분'),  // L126
  gb.text('publicNm', 50, '공모'),  // L127
  gb.text('orgCodeNm', 150, '운용부서'),  // L128
  gb.text('emp1Nm', 90, '운용역1'),  // L129
  gb.text('emp2Nm', 90, '운용역2'),  // L130
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pln02_TabPage_Plan (`client/vi/pln/Pln02_TabPage_Plan.java`, 227줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), center=grid
- 입력·하위 화면: `lookupClassTree` LookupTriggerField, `lookupEmpInfo` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeName 250 "문서분류" Text 편집:lookupClassTree
  - approvalTypeName 100 "최종결재" Text
  - korName 90 "담당자" Text 편집:lookupEmpInfo
  - orgName 100 "부서" Text
  - startDate 100 "시작일" Date 편집:MyDateField
  - dueDate 100 "완료예정일" Date 편집:MyDateField
  - closeYn 100 "진행상태" Text
  - note 400 "기타사항" Text 편집:TextField
  - getSelectionModel  "" BeforeStartEditHandler

#### 이벤트
[E0] 화면 열림 (생성자 L46-60) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L49) → retrieve()
[E2] searchBarBuilder[저장].Update (L50) → update()
[E3] searchBarBuilder[등록].Insert (L51) → insertRow()
[E4] searchBarBuilder[삭제].Delete (L52) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L202) → 서비스 pln.Pln02_Plan.delete
[E5] lookupClassTree.TriggerClick (L65) → openlookUpClassTree()
[E6] lookupEmpInfo.TriggerClick (L73) → openLookupEmpInfo()
[E7] gridBuilder.BeforeStartEdit (L91) → 인라인 L91-101 (new BeforeStartEditHandler<Pln02_Plan…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openlookUpClassTree() | L105-120 | E5 | 팝업 Pln00_Popup_ClassTree 열기 | 업무 |
| private openLookupEmpInfo() | L122-135 | E6 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L137-142 | E1 | 서비스 pln.Pln02_Plan.selectByFundId(fundId) | 업무 |
| public insertRow() | L145-174 | E3 | 팝업 Pln00_Popup_ClassTree 열기 | 업무 |
| public update() | L177-180 | E2 | 서비스 pln.Pln02_Plan.update | 업무 |
| public deleteRow() | L183-219 | E4 | ConfirmBox → E8 | 업무 |
| public retrieve() | L222-226 | E1 | 서비스 pln.Pln02_Plan.selectByFundId(fundId) | 업무 |
| public buildGrid() | L62-103 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeNm', 250, '문서분류'),  // L82
  gb.text('approvalTypeNm', 100, '최종결재'),  // L83
  gb.text('korNm', 90, '담당자'),  // L84
  // ⚠DB없음 L85 orgName 100 "부서" (pln02_org_name 컬럼 없음)
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L86
  gb.date('dueDate', 100, '완료예정일', { editor: 'date' }),  // L87
  gb.text('closeYn', 100, '진행상태'),  // L88 SQL 계산 컬럼(selectByFundId: CASE WHEN COALESCE(pln02_appr_id,0) = 0…)
  gb.text('note', 400, '기타사항', { editor: 'text' }),  // L89
  // ⚠ 대응 없음 (GridBuilder L91) addBeforeStartEditHandler
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pln00_Popup_ClassTree (`client/vi/pln/Pln00_Popup_ClassTree.java`, 66줄)

- 입력·하위 화면: `gridDocType` Pln00_Lookup_ClassTree

#### 이벤트
[E1] oKButton[확인].Select (L34) → confirm()
[E2] cancelButton[닫기].Select (L42) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L25-53 | 공개 메서드 | 상태 처리 | 업무 |
| public confirm() | L55-59 | E1 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L61-63 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pln00_Lookup_ClassTree (`client/vi/pln/Pln00_Lookup_ClassTree.java`, 171줄)

- 레이아웃: west=vlc, center=grid
- 툴바 `buttonBar`: 문서분류: {retrieveButton}

#### 이벤트
[E0] 화면 열림 (생성자 L43-85) → retrieve()
[E1] retrieveButton[조회].Select (L48) → retrieve()
[E2] tree.Selection (L71) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getSelectList() | L86-89 | 공개 메서드 | 상태 처리 | 업무 |
| package getMenuTree() | L91-125 | 필드 초기화 | 상태 처리 | 업무 |
| public getServiceResult() | L128-140 | 공개 메서드 | 상태 처리 | 업무 |
| private addChild() | L142-150 | getServiceResult | 상태 처리 | 업무 |
| private retrieve() | L152-161 | 생성자,E1 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private retrievePage() | L163-166 | E2 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L168-170 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pln00_Grid_ClassTree (`client/vi/pln/Pln00_Grid_ClassTree.java`, 81줄)

- 레이아웃: center=cp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 80 "구분코드" Text
  - classTreeName 220 "문서구분명" Text
  - itemTypeName 100 "상품분류" Text

#### 이벤트
[E0] 화면 열림 (생성자 L25-39) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getSelectList() | L57-61 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L63-78 | 공개 메서드 | 서비스 dcr.Dcr01_ClassTree.selectByClassTreeId(companyId, parentId) | 업무 |
| public buildGrid() | L41-56 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeCd', 80, '구분코드'),  // L47
  gb.text('classTreeNm', 220, '문서구분명'),  // L48
  gb.text('itemTypeNm', 100, '상품분류'),  // L49
];
```

#### 사용된 버튼들
버튼 사용하지 않음

