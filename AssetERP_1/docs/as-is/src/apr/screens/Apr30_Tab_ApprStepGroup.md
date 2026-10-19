# Apr30_Tab_ApprStepGroup

- 종류: 화면
- 메뉴: 관리자 > 03. 문서관리 > 문서결재선 그룹관리 (#1282)
- 파일: `client/vi/apr/Apr30_Tab_ApprStepGroup.java`
- 함께 쓰는 클래스 1개:
  - `Apr31_Page_ApprStepGroupMember` `client/vi/apr/Apr31_Page_ApprStepGroupMember.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr30_ApprStepGroup.delete` | Apr30_Tab_ApprStepGroup:200 | [`Apr30_ApprStepGroup.java:31`](../../apr/services/Apr30_ApprStepGroup.md) | `UpdateDataModel(apr30_appr_step_group)` 동적 DELETE |
| `apr.Apr30_ApprStepGroup.selectByCompanyId` | Apr30_Tab_ApprStepGroup:155 | [`Apr30_ApprStepGroup.java:21`](../../apr/services/Apr30_ApprStepGroup.md) | [`apr30_appr_step_group.selectByCompanyId`](../../apr/sql/apr30_appr_step_group.md) |
| `apr.Apr30_ApprStepGroup.update` | Apr30_Tab_ApprStepGroup:165 | [`Apr30_ApprStepGroup.java:26`](../../apr/services/Apr30_ApprStepGroup.md) | `UpdateDataModel(apr30_appr_step_group)` 동적 INSERT/UPDATE → [`apr30_appr_step_group.selectById`](../../apr/sql/apr30_appr_step_group.md) |
| `apr.Apr31_ApprStepGroupMember.delete` | Apr31_Page_ApprStepGroupMember:399 | [`Apr31_ApprStepGroupMember.java:31`](../../apr/services/Apr31_ApprStepGroupMember.md) | `UpdateDataModel(apr31_appr_step_group_member)` 동적 DELETE |
| `apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId` | Apr31_Page_ApprStepGroupMember:409 | [`Apr31_ApprStepGroupMember.java:21`](../../apr/services/Apr31_ApprStepGroupMember.md) | [`apr31_appr_step_group_member.selectByApprStepGroupId`](../../apr/sql/apr31_appr_step_group_member.md) |
| `apr.Apr31_ApprStepGroupMember.update` | Apr31_Page_ApprStepGroupMember:359 | [`Apr31_ApprStepGroupMember.java:26`](../../apr/services/Apr31_ApprStepGroupMember.md) | `UpdateDataModel(apr31_appr_step_group_member)` 동적 INSERT/UPDATE → [`apr31_appr_step_group_member.selectById`](../../apr/sql/apr31_appr_step_group_member.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Apr31_Page_ApprStepGroupMember:169 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr30_appr_step_group`](../../../db/tables/apr.md), [`apr31_appr_step_group_member`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`, `f_trunc`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr30_Tab_ApprStepGroup (`client/vi/apr/Apr30_Tab_ApprStepGroup.java`, 206줄)

- 레이아웃: north=mainVlc, west=cp, center=memberPage
- 툴바 `maniButtonBar`: <font style='font-size:14px;'><b>&nbsp;&nbsp;※ 해당 그룹을 [문서분류] 탭에서 지정 시, 기존 결재선 정보에 추가로 반영됩니다</b></font>:
- 툴바 `buttonBar`: 지정그룹: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `memberPage` Apr31_Page_ApprStepGroupMember
- 그리드 `grid` (buildGrid()):
  - apprStepGroupName 250 "문서결재선 그룹명" Text 편집:TextField
  - note 350 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L49-97) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L100) → retrieve()
[E2] insertButton[등록].Select (L106) → insertRow()
[E3] updateButton[저장].Select (L112) → update()
[E4] deleteButton[삭제].Select (L118) → deleteChedk()
       └ [E6] msgBox.DialogHide [YES] (L179) → deleteRow()
[E5] grid.RowClick (L124) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrievePage() | L140-150 | E5 | 상태 처리 | 업무 |
| private retrieve() | L152-161 | 생성자,E1 | 서비스 apr.Apr30_ApprStepGroup.selectByCompanyId(companyId) | 업무 |
| public update() | L163-166 | E3 | 서비스 apr.Apr30_ApprStepGroup.update | 업무 |
| public insertRow() | L168-174 | E2 | 상태 처리 | 업무 |
| public deleteChedk() | L176-195 | E4 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L197-201 | E6 | GridDeleteData apr.Apr30_ApprStepGroup.delete(체크된 행 목록) | 업무 |
| private settings() | L99-130 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L132-138 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L203-205 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('apprStepGroupNm', 250, '문서결재선 그룹명', { editor: 'text' }),  // L135
  gb.text('note', 350, '비고', { editor: 'text' }),  // L136
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChedk}>삭제</Button>

### Apr31_Page_ApprStepGroupMember (`client/vi/apr/Apr31_Page_ApprStepGroupMember.java`, 420줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 결재선 설정: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti, `stepTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode")
- 그리드 `grid` (buildApprStepGrid(), 체크박스(다중)):
  - stepTypeName 100 "구분" TextFixCenter 편집:stepTypeComboBox
  - orgName 200 "부서명" TextFix
  - titleName 80 "직책" TextFixCenter
  - empKorName 80 "성명" TextFixCenter
  - actionCell 70 "위로" Cell 편집:upButton
  - actionCell 70 "아래로" Cell 편집:downButton
  - note 300 "비고" TextFix 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L74-90) → settings()
[E1] retrieveButton[조회].Select (L93) → retrieve()
[E2] insertButton[등록].Select [apprStepGroupId != null] (L99) → insertRow()
[E3] updateButton[저장].Select (L113) → update()
[E4] deleteButton[삭제].Select (L119) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L379) → deleteRow()
[E5] stepTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L170) → 인라인 L170-178 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRow() | L127-158 | E2 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| public buildApprStepGrid() | L160-202 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| public insertApprovalEmp() | L204-214 | 공개 메서드 | 상태 처리 | 업무 |
| public insertApprovalEmp() | L216-272 | 공개 메서드 | 상태 처리 | 업무 |
| public changeRow() | L274-305 | buildApprStepGrid | 상태 처리 | 업무 |
| public getSeq() | L307-314 | insertApprovalEmp,changeRow | 상태 처리 | 업무 |
| private update() | L316-374 | E3 | 서비스 apr.Apr31_ApprStepGroupMember.update | 업무 |
| private deleteChk() | L376-394 | E4 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L396-400 | E6 | GridDeleteData apr.Apr31_ApprStepGroupMember.delete(체크된 행 목록) | 업무 |
| public retrieve() | L402-415 | E1,update | 서비스 apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId(apprStepGroupId, companyId) | 업무 |
| private settings() | L92-125 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L417-419 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L193) addTextFixCenter
  // ⚠ 대응 없음 (GridBuilder L194) addTextFix
  // ⚠ 대응 없음 (GridBuilder L195) addTextFixCenter
  // ⚠ 대응 없음 (GridBuilder L196) addTextFixCenter
  // ⚠ 대응 없음 (GridBuilder L197) addCell
  // ⚠ 대응 없음 (GridBuilder L198) addCell
  // ⚠ 대응 없음 (GridBuilder L199) addTextFix
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

