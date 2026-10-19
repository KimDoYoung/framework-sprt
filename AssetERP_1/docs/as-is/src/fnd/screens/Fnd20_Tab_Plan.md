# Fnd20_Tab_Plan

- 종류: 화면
- 메뉴: 펀드관리 > 01. 상품기획 > 상품기획일정 등록 (#1105)
- 파일: `client/vi/fnd/Fnd20_Tab_Plan.java`
- 함께 쓰는 클래스 1개:
  - `Fnd20_TabPage_Plan` `client/vi/fnd/Fnd20_TabPage_Plan.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr00_Lookup_FundPlan`](../../dcr/components/Dcr00_Lookup_FundPlan.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.selectByPlan` | Fnd20_Tab_Plan:147 | [`Fnd01_FundCode.java:307`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByPlan`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd20_Plan.delete` | Fnd20_TabPage_Plan:203 | [`Fnd20_Plan.java:186`](../../fnd/services/Fnd20_Plan.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(fnd20_plan)` 동적 DELETE |
| `fnd.Fnd20_Plan.selectByFundId` | Fnd20_TabPage_Plan:130 | [`Fnd20_Plan.java:50`](../../fnd/services/Fnd20_Plan.md) | [`fnd20_plan.selectByFundId`](../../fnd/sql/fnd20_plan.md) |
| `fnd.Fnd20_Plan.update` | Fnd20_TabPage_Plan:173 | [`Fnd20_Plan.java:181`](../../fnd/services/Fnd20_Plan.md) | `UpdateDataModel(fnd20_plan)` 동적 INSERT/UPDATE → [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_fund_nm2`, `f_max_workdate`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd20_Tab_Plan (`client/vi/fnd/Fnd20_Tab_Plan.java`, 166줄)

- 레이아웃: center=vlc, south=tabPagePlan
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 기획펀드: {fundSearchTextField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `closeYnCheckBox` CheckBox, `fundSearchTextField` TextField 빈칸="전체", `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체") 빈칸="전체", `tabPagePlan` Fnd20_TabPage_Plan
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 100 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - kofiaFundTypeName 150 "펀드유형" Text
  - startDate 100 "설정일" Date
  - endDate 100 "해지일" Date
  - closeName 100 "해지여부" Text
  - kofiaTrustName 120 "신탁구분" Text
  - kofiaPublicName 160 "공모구분" Text
  - orgCodeName 150 "운용부서" Text
  - operator1 90 "주운용역" Text
  - operator2 90 "부운용역" Text
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L44-47) → init(), retrieve()
[E1] fundSearchTextField.KeyPress [Enter] (L53) → retrieve()
[E2] retrieveButton[조회].Select (L61) → retrieve()
[E3] grid.RowClick [data != null] (L67) → 인라인 L67-75 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L49-114 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L136-157 | 생성자,E1,E2 | 서비스 fnd.Fnd01_FundCode.selectByPlan(companyId, orgId, admin, closeYn, fundName, fundTypeCode) | 업무 |
| public buildGrid() | L116-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L159-161 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L163-165 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 100, '펀드코드'),  // L120
  gb.text('fundNm', 400, '펀드명'),  // L121
  gb.text('kofiaFundTypeNm', 150, '펀드유형'),  // L122
  gb.date('startDate', 100, '설정일'),  // L123
  gb.date('endDate', 100, '해지일'),  // L124
  gb.text('closeNm', 100, '해지여부'),  // L125
  gb.text('kofiaTrustNm', 120, '신탁구분'),  // L126
  gb.text('kofiaPublicNm', 160, '공모구분'),  // L127
  gb.text('orgCodeNm', 150, '운용부서'),  // L128
  gb.text('operator1', 90, '주운용역'),  // L129
  gb.text('operator2', 90, '부운용역'),  // L130
  gb.text('note', 300, '비고'),  // L131
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Fnd20_TabPage_Plan (`client/vi/fnd/Fnd20_TabPage_Plan.java`, 221줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), center=grid
- 입력·하위 화면: `lookupClassTree` LookupTriggerField, `lookupEmpInfo` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeFullName 350 "문서분류" Text 편집:lookupClassTree
  - approvalTypeName 100 "최종결재" Text
  - personName 100 "담당자" Text 편집:lookupEmpInfo
  - orgName 150 "부서" Text
  - startDate 100 "시작일" Date 편집:MyDateField
  - dueDate 100 "완료예정일" Date 편집:MyDateField
  - closeYn 100 "진행상태" Text
  - note 400 "업무내용" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L46-60) → 초기화
[E1] searchBarBuilder[조회].Retrieve (L48) → retrieve()
[E2] searchBarBuilder[저장].Update (L49) → update()
[E3] searchBarBuilder[등록].Insert (L50) → insertRow()
[E4] searchBarBuilder[삭제].Delete (L51) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L196) → 서비스 fnd.Fnd20_Plan.delete
[E5] lookupClassTree.TriggerClick (L65) → openLookupClassTree()
[E6] lookupEmpInfo.TriggerClick (L73) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupClassTree() | L94-109 | E5 | 조회창 Dcr00_Lookup_FundPlan 열기 | 업무 |
| private openLookupEmpInfo() | L111-124 | E6 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L126-131 | E1 | 서비스 fnd.Fnd20_Plan.selectByFundId(fundId) | 업무 |
| public insertRow() | L134-155 | E3 | 조회창 Dcr00_Lookup_FundPlan 열기 | 업무 |
| public update() | L158-174 | E2 | 서비스 fnd.Fnd20_Plan.update | 업무 |
| public deleteRow() | L177-213 | E4 | ConfirmBox → E7 | 업무 |
| public retrieve() | L216-220 | E1 | 서비스 fnd.Fnd20_Plan.selectByFundId(fundId) | 업무 |
| public buildGrid() | L62-92 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeFullNm', 350, '문서분류'),  // L82
  gb.text('approvalTypeNm', 100, '최종결재'),  // L83
  gb.text('personNm', 100, '담당자'),  // L84
  gb.text('orgNm', 150, '부서'),  // L85
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L86
  gb.date('dueDate', 100, '완료예정일', { editor: 'date' }),  // L87
  gb.text('closeYn', 100, '진행상태'),  // L88
  gb.text('note', 400, '업무내용', { editor: 'text' }),  // L89
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

