# Pln02_Tab_PlanEmp

- 종류: 화면
- 파일: `client/vi/pln/Pln02_Tab_PlanEmp.java`
- 함께 쓰는 클래스 1개:
  - `Pln02_TabPage_PlanEmp` `client/vi/pln/Pln02_TabPage_PlanEmp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.selectByFundPlanEmp` | Pln02_Tab_PlanEmp:144 | [`Fnd01_FundCode.java:106`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundPlanEmp`](../../fnd/sql/fnd01_fund_code.md) |
| `pln.Pln02_Plan.delete` | Pln02_TabPage_PlanEmp:185 | [`Pln02_Plan.java:221`](../../pln/services/Pln02_Plan.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(pln02_plan)` 동적 DELETE |
| `pln.Pln02_Plan.insertAppr` | Pln02_TabPage_PlanEmp:125 | [`Pln02_Plan.java:121`](../../pln/services/Pln02_Plan.md) | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insert`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`pln02_plan.selectById`](../../pln/sql/pln02_plan.md), [`pln02_plan.updateApprId`](../../pln/sql/pln02_plan.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE → [`apr04_appr_step.selectById`](../../apr/sql/apr04_appr_step.md) |
| `pln.Pln02_Plan.selectByFundIdEmp` | Pln02_TabPage_PlanEmp:140 | [`Pln02_Plan.java:59`](../../pln/services/Pln02_Plan.md) | [`pln02_plan.selectByFundIdEmp`](../../pln/sql/pln02_plan.md) |
| `pln.Pln02_Plan.update` | Pln02_TabPage_PlanEmp:150 | [`Pln02_Plan.java:208`](../../pln/services/Pln02_Plan.md) | `UpdateDataModel(pln02_plan)` 동적 INSERT/UPDATE → [`pln02_plan.selectById`](../../pln/sql/pln02_plan.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd00_fund_sysdate`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pln02_plan`](../../../db/tables/pln.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_max_workdate`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pln02_Tab_PlanEmp (`client/vi/pln/Pln02_Tab_PlanEmp.java`, 175줄)

- 레이아웃: center=vlc, south=pln02_TabPage_EmpPlan
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 기획펀드: {fundSearchTextField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `fundSearchTextField` TextField 빈칸="전체", `closeYnCheckBox` CheckBox, `pln02_TabPage_EmpPlan` Pln02_TabPage_PlanEmp
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 70 "펀드코드" Text
  - fundName 250 "펀드명" Text
  - fundTypeName 150 "펀드유형" Text
  - sintakGbName 80 "신탁구분" Text
  - publicName 50 "공모" Text
  - startDate 90 "설정일" Date
  - endDate 90 "해지일" Date
  - closeName 80 "종료구분" Text

#### 이벤트
[E0] 화면 열림 (생성자 L44-47) → init(), retrieve()
[E1] fundSearchTextField.KeyPress [Enter] (L52) → retrieve()
[E2] retrieveButton[조회].Select (L60) → retrieve()
[E3] grid.RowClick [data != null] (L66) → 인라인 L66-74 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L49-113 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L134-154 | 생성자,E1,E2 | 서비스 fnd.Fnd01_FundCode.selectByFundPlanEmp(companyId, empId, orgId, fundTypeCode, fundName, closeYn) | 업무 |
| public update() | L157-158 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L161-162 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L165-166 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L115-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L168-170 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L172-174 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 70, '펀드코드'),  // L121
  gb.text('fundNm', 250, '펀드명'),  // L122
  gb.text('fundTypeNm', 150, '펀드유형'),  // L123
  gb.text('sintakGbNm', 80, '신탁구분'),  // L124
  gb.text('publicNm', 50, '공모'),  // L125
  gb.date('startDate', 90, '설정일'),  // L126
  gb.date('endDate', 90, '해지일'),  // L127
  gb.text('closeNm', 80, '종료구분'),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pln02_TabPage_PlanEmp (`client/vi/pln/Pln02_TabPage_PlanEmp.java`, 220줄)

- 입력·하위 화면: `lookupApr` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeName 200 "문서분류" Text
  - approvalTypeName 100 "최종결재" Text
  - orgName 100 "부서" Text
  - korName 80 "담당자" Text
  - startDate 90 "시작일" Date
  - dueDate 90 "완료예정일" Date
  - closeYn 100 "진행상태" Text
  - actionCell 60 "결재요청" Cell 편집:aprButton
  - note 400 "기타사항" Text 편집:TextField
  - getSelectionModel  "" BeforeStartEditHandler

#### 이벤트
[E0] 화면 열림 (생성자 L51-64) → 초기화
[E1] searchBarBuilder[저장].Update (L59) → update()
[E2] searchBarBuilder[삭제].Delete (L60) → deleteRow()
       └ [E4] msgBox.DialogHide [YES] (L178) → 서비스 pln.Pln02_Plan.delete
[E3] gridBuilder.BeforeStartEdit (L106) → 인라인 L106-116 (new BeforeStartEditHandler<Pln02_Plan…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private aprLookup() | L121-133 | buildGrid | 서비스 pln.Pln02_Plan.insertAppr | 업무 |
| public retrieve() | L135-141 | getServiceResult | 서비스 pln.Pln02_Plan.selectByFundIdEmp(fundId, orgId) | 업무 |
| public insertRow() | L144-145 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L148-151 | E1 | 서비스 pln.Pln02_Plan.update | 업무 |
| public deleteRow() | L154-195 | E2 | 미선택 시 alert "문서를 선택해주세요" → 확인창 E4 | 업무 |
| public retrieve() | L198-199 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L202-215 | 공개 메서드 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| public buildGrid() | L66-119 | 필드 초기화 | 미선택 시 alert "담당자 미지정 문서입니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeNm', 200, '문서분류'),  // L71
  gb.text('approvalTypeNm', 100, '최종결재'),  // L72
  // ⚠DB없음 L73 orgName 100 "부서" (pln02_org_name 컬럼 없음)
  gb.text('korNm', 80, '담당자'),  // L75
  gb.date('startDate', 90, '시작일'),  // L76
  gb.date('dueDate', 90, '완료예정일'),  // L77
  gb.text('closeYn', 100, '진행상태'),  // L78 SQL 계산 컬럼(selectById: CASE WHEN COALESCE(pln02_appr_id, 0) = …)
  // ⚠ 대응 없음 (GridBuilder L103) addCell
  gb.text('note', 400, '기타사항', { editor: 'text' }),  // L104
  // ⚠ 대응 없음 (GridBuilder L106) addBeforeStartEditHandler
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>

