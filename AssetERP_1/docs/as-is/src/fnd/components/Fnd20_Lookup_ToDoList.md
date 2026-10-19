# Fnd20_Lookup_ToDoList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/fnd/Fnd20_Lookup_ToDoList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd20_Plan.insertAppr` | Fnd20_Lookup_ToDoList:159 | [`Fnd20_Plan.java:93`](../../fnd/services/Fnd20_Plan.md) | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insert`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`dcr05_doc_type.selectByDefaultClassTreeId`](../../dcr/sql/dcr05_doc_type.md), [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md), [`fnd20_plan.updateApprId`](../../fnd/sql/fnd20_plan.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE → [`apr04_appr_step.selectById`](../../apr/sql/apr04_appr_step.md) |
| `fnd.Fnd20_Plan.selectById` | Fnd20_Lookup_ToDoList:181 | [`Fnd20_Plan.java:25`](../../fnd/services/Fnd20_Plan.md) | [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md) |
| `fnd.Fnd20_Plan.selectByPersonId` | Fnd20_Lookup_ToDoList:175 | [`Fnd20_Plan.java:31`](../../fnd/services/Fnd20_Plan.md) | [`fnd20_plan.selectByPersonId`](../../fnd/sql/fnd20_plan.md) |
| `fnd.Fnd20_Plan.update` | Fnd20_Lookup_ToDoList:188 | [`Fnd20_Plan.java:181`](../../fnd/services/Fnd20_Plan.md) | `UpdateDataModel(fnd20_plan)` 동적 INSERT/UPDATE → [`fnd20_plan.selectById`](../../fnd/sql/fnd20_plan.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd20_Lookup_ToDoList (`client/vi/fnd/Fnd20_Lookup_ToDoList.java`, 226줄)

- 툴바 `buttonBar`: 기준일: {startDate} {selectBox} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `selectBox` CheckBox, `lookupApr` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundName 300 "상품기획명" Text
  - classTreeFullName 300 "문서분류" Text
  - approvalTypeName 100 "최종결재" TextCenter
  - startDate 100 "시작일" Date
  - dueDate 100 "완료예정일" Date
  - closeYn 100 "진행상태" TextCenter
  - actionCell 60 "결재요청" Cell 편집:aprButton
  - note 350 "업무내용" Text
  - getSelectionModel  "" BeforeStartEditHandler

#### 이벤트
[E0] 화면 열림 (생성자 L89-116) → show()
[E1] retrieveButton[조회].Select (L69) → retrieve()
[E2] updateButton[저장].Select (L75) → update()
[E3] closeButton[닫기].Select (L81) → hide()
[E4] gridBuilder.BeforeStartEdit (L140) → 인라인 L140-150 (new BeforeStartEditHandler<Fnd20_Plan…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-66 | 공개 메서드 | 상태 처리 | 업무 |
| private Setting() | L68-87 | open | 상태 처리 | 업무 |
| private aprLookup() | L155-167 | buildGrid | 서비스 fnd.Fnd20_Plan.insertAppr | 업무 |
| public retrieve() | L170-183 | E1,open,getServiceResult | 서비스 fnd.Fnd20_Plan.selectByPersonId, fnd.Fnd20_Plan.selectById(personId, startDate, planId, startDate) | 업무 |
| public update() | L186-189 | E2 | 서비스 fnd.Fnd20_Plan.update | 업무 |
| public insertRow() | L192-193 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L196-197 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L200-213 | 공개 메서드 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| public buildGrid() | L118-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L219-221 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L223-225 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundNm', 300, '상품기획명'),  // L131
  gb.text('classTreeFullNm', 300, '문서분류'),  // L132
  gb.textCenter('approvalTypeNm', 100, '최종결재'),  // L133
  gb.date('startDate', 100, '시작일'),  // L134
  gb.date('dueDate', 100, '완료예정일'),  // L135
  gb.textCenter('closeYn', 100, '진행상태'),  // L136
  // ⚠ 대응 없음 (GridBuilder L137) addCell
  gb.text('note', 350, '업무내용'),  // L138
  // ⚠ 대응 없음 (GridBuilder L140) addBeforeStartEditHandler
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

