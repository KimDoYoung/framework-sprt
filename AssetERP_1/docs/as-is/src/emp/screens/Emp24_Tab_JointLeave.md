# Emp24_Tab_JointLeave

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 공동연차관리 (#1233)
- 파일: `client/vi/emp/Emp24_Tab_JointLeave.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp24_Tab_JointLeave:220 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp24_Tab_JointLeave:354 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp24_JointLeave.delete` | Emp24_Tab_JointLeave:535 | [`Emp24_JointLeave.java:81`](../../emp/services/Emp24_JointLeave.md) | `UpdateDataModel(emp24_joint_leave)` 동적 DELETE |
| `emp.Emp24_JointLeave.deleteApprId` | Emp24_Tab_JointLeave:525 | [`Emp24_JointLeave.java:64`](../../emp/services/Emp24_JointLeave.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) |
| `emp.Emp24_JointLeave.selectByYear` | Emp24_Tab_JointLeave:336 | [`Emp24_JointLeave.java:38`](../../emp/services/Emp24_JointLeave.md) | [`emp24_joint_leave.selectByYear`](../../emp/sql/emp24_joint_leave.md) |
| `emp.Emp24_JointLeave.update` | Emp24_Tab_JointLeave:492 | [`Emp24_JointLeave.java:76`](../../emp/services/Emp24_JointLeave.md) | `UpdateDataModel(emp24_joint_leave)` 동적 INSERT/UPDATE → [`emp24_joint_leave.selectById`](../../emp/sql/emp24_joint_leave.md) |
| `emp.Emp24_JointLeave.updateApprId` | Emp24_Tab_JointLeave:315 | [`Emp24_JointLeave.java:49`](../../emp/services/Emp24_JointLeave.md) | [`emp24_joint_leave.updateApprId`](../../emp/sql/emp24_joint_leave.md) |
| `emp.Emp28_JointLeaveExcept.delete` | Emp24_Tab_JointLeave:548 | [`Emp28_JointLeaveExcept.java:33`](../../emp/services/Emp28_JointLeaveExcept.md) | `UpdateDataModel(emp28_joint_leave_except)` 동적 DELETE |
| `emp.Emp28_JointLeaveExcept.selectByJointLeaveId` | Emp24_Tab_JointLeave:383 | [`Emp28_JointLeaveExcept.java:21`](../../emp/services/Emp28_JointLeaveExcept.md) | [`emp28_joint_leave_except.selectByJointLeaveId`](../../emp/sql/emp28_joint_leave_except.md) |
| `emp.Emp28_JointLeaveExcept.update` | Emp24_Tab_JointLeave:506 | [`Emp28_JointLeaveExcept.java:28`](../../emp/services/Emp28_JointLeaveExcept.md) | `UpdateDataModel(emp28_joint_leave_except)` 동적 INSERT/UPDATE → [`emp28_joint_leave_except.selectById`](../../emp/sql/emp28_joint_leave_except.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp24_joint_leave`](../../../db/tables/emp.md), [`emp28_joint_leave_except`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp24_Tab_JointLeave (`client/vi/emp/Emp24_Tab_JointLeave.java`, 554줄)

- 레이아웃: north=vlc01, center=vlc02
- 툴바 `buttonBar01`: 기준연도: {leaveYText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {apprButton} {dcrLinkButton}
- 툴바 `buttonBar02`: {label} {exceptInsertButton} {exceptUpdateButton} {exceptDeleteButton}
- 입력·하위 화면: `leaveYText` TextField 빈칸="YYYY", `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc, `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "시작일" Date 편집:MyDateField
  - closeDate 100 "종료일" Date 편집:MyDateField
  - reason 500 "사유" Text 편집:TextField
  - apprStatusName 120 "상신상태" TextCenter
  - actionCell 80 "상세보기" Cell 편집:actionCell
  - note 500 "비고" Text
- 그리드 `exceptGrid` (exceptGrid(), 체크박스(다중)):
  - orgName 170 "조직" Text
  - personName 100 "사원명" TextCenter
  - reason 800 "제외사유" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L87-130) → settings(), retrieve()
[E1] leaveYText.KeyPress [Enter] (L137) → retrieve()
[E2] retrieveButton[조회].Select (L145) → retrieve()
[E3] insertButton[등록].Select (L151) → insertRow()
[E4] updateButton[저장].Select (L157) → update()
[E5] deleteButton[삭제].Select (L163) → deleteCheck()
       └ [E12] msgBox.DialogHide [YES] (L413) → delete()
[E6] apprButton[승인신청].Select (L170) → insertLinkApprovals()
[E7] dcrLinkButton[문서분류지정].Select (L176) → retrieveDoc()
[E8] exceptInsertButton[등록].Select (L189) → exceptInsertRow()
[E9] exceptUpdateButton[저장].Select (L195) → exceptUpdate()
[E10] exceptDeleteButton[삭제].Select (L201) → exceptDelete()
[E11] grid.RowClick (L208) → exceptRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public exceptGrid() | L260-268 | 필드 초기화 | 상태 처리 | 업무 |
| private insertLinkApprovals() | L270-306 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "[문서분류지정]에서 먼저 문서분류를 선택해주세요" | 업무 |
| private updateApprId() | L308-328 | insertLinkApprovals | 서비스 emp.Emp24_JointLeave.updateApprId(apprId) | 업무 |
| public retrieve() | L330-351 | 생성자,E1,E2,updateApprId | 서비스 emp.Emp24_JointLeave.selectByYear(companyId, stdYear) | 업무 |
| private retrieveDoc() | L353-371 | E7,retrieve | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private exceptRetrieve() | L373-390 | E11,retrieve,delete | 서비스 emp.Emp28_JointLeaveExcept.selectByJointLeaveId(jointLeaveId) | 업무 |
| private deleteCheck() | L392-428 | E5 | ConfirmBox → E12 | 업무 |
| private insertRow() | L430-437 | E3 | 상태 처리 | 업무 |
| private exceptInsertRow() | L439-465 | E8 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| private update() | L467-502 | E4 | 서비스 emp.Emp24_JointLeave.update | 업무 |
| private exceptUpdate() | L504-516 | E9 | 서비스 emp.Emp28_JointLeaveExcept.update | 업무 |
| private delete() | L518-543 | E12 | 미선택 시 alert, GridDeleteData emp.Emp24_JointLeave.deleteApprId, emp.Emp24_JointLeave.delete(체크된 행 목록) | 업무 |
| private exceptDelete() | L545-549 | E10 | GridDeleteData emp.Emp28_JointLeaveExcept.delete(체크된 행 목록) | 업무 |
| private settings() | L132-214 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L216-258 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L551-553 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L250
  gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L251
  gb.text('reason', 500, '사유', { editor: 'text' }),  // L252
  gb.textCenter('apprStatusNm', 120, '상신상태'),  // L253 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L254) addCell
  gb.text('note', 500, '비고'),  // L255
];

const exceptGrid = () => [
  gb.text('orgNm', 170, '조직'),  // L263 SQL 계산 컬럼(selectById: f_get_empTrans(emp28_person_id, f_sysda…)
  gb.textCenter('personNm', 100, '사원명'),  // L264 SQL 계산 컬럼(selectById: f_emp_kor_nm(emp28_person_id))
  gb.text('reason', 800, '제외사유', { editor: 'text' }),  // L265
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteCheck}>삭제</Button>
5. <Button type="register" onClick={insertLinkApprovals}>승인신청</Button>
6. <Button type="save" onClick={retrieveDoc}>문서분류지정</Button>
7. <Button type="register" onClick={exceptInsertRow}>등록</Button>
8. <Button type="save" onClick={exceptUpdate}>저장</Button>
9. <Button type="delete" onClick={exceptDelete}>삭제</Button>

