# Tdm30_Tab_RoleAllc

- 종류: 화면
- 메뉴: 책무 > 02. 책무구조도 > 임원별 직책배정 (#1417)
- 파일: `client/vi/tdm/Tdm30_Tab_RoleAllc.java`
- 함께 쓰는 클래스 7개:
  - `Tdm34_TabPage_RoleAllcDetail` `client/vi/tdm/Tdm34_TabPage_RoleAllcDetail.java`
  - `Tdm35_Lookup_RoleAllcTask` `client/vi/tdm/Tdm35_Lookup_RoleAllcTask.java`
  - `Tdm30_Edit_RoleAllcModify` `client/vi/tdm/Tdm30_Edit_RoleAllcModify.java`
  - `Tdm30_Edit_RoleAllc` `client/vi/tdm/Tdm30_Edit_RoleAllc.java`
  - `Tdm20_Lookup_SelectSingle` `client/vi/tdm/Tdm20_Lookup_SelectSingle.java`
  - `Tdm02_Lookup_HrRecord` `client/vi/tdm/Tdm02_Lookup_HrRecord.java`
  - `Tdm01_Lookup_SelectSingle` `client/vi/tdm/Tdm01_Lookup_SelectSingle.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Tdm34_TabPage_RoleAllcDetail:409 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys10_File.selectByParentId` | Tdm34_TabPage_RoleAllcDetail:591 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmRoleDesc` | Tdm34_TabPage_RoleAllcDetail:550 | [`Sys99_Print.java:122`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm01_Hr.selectByEndDate` | Tdm01_Lookup_SelectSingle:134 | [`Tdm01_Hr.java:32`](../../tdm/services/Tdm01_Hr.md) | [`tdm01_hr.selectByEndDate`](../../tdm/sql/tdm01_hr.md) |
| `tdm.Tdm02_HrRecord.selectByCompanyId` | Tdm02_Lookup_HrRecord:219, Tdm30_Tab_RoleAllc:582 | [`Tdm02_HrRecord.java:22`](../../tdm/services/Tdm02_HrRecord.md) | [`tdm02_hr_record.selectByCompanyId`](../../tdm/sql/tdm02_hr_record.md) |
| `tdm.Tdm02_HrRecord.updateApplyCode` | Tdm02_Lookup_HrRecord:243 | [`Tdm02_HrRecord.java:32`](../../tdm/services/Tdm02_HrRecord.md) | [`tdm02_hr_record.updateApplyCode`](../../tdm/sql/tdm02_hr_record.md) |
| `tdm.Tdm12_TaskRelateDetail.getHtmlData` | Tdm34_TabPage_RoleAllcDetail:435 | [`Tdm12_TaskRelateDetail.java:37`](../../tdm/services/Tdm12_TaskRelateDetail.md) | [`tdm12_task_relate_detail.getHtmlData`](../../tdm/sql/tdm12_task_relate_detail.md) |
| `tdm.Tdm20_Role.modelUpdate` | Tdm20_Lookup_SelectSingle:205 | [`Tdm20_Role.java:66`](../../tdm/services/Tdm20_Role.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm20_role)` 동적 INSERT/UPDATE → [`tdm20_role.selectById`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectSingle:188 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm30_RoleAllc.delete` | Tdm30_Tab_RoleAllc:546 | [`Tdm30_RoleAllc.java:208`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm34_role_allc_detail.deleteByRoleAllcId`](../../tdm/sql/tdm34_role_allc_detail.md), `UpdateDataModel(tdm30_role_allc)` 동적 DELETE |
| `tdm.Tdm30_RoleAllc.modelUpdate` | Tdm30_Edit_RoleAllc:331, Tdm30_Edit_RoleAllcModify:271 | [`Tdm30_RoleAllc.java:182`](../../tdm/services/Tdm30_RoleAllc.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm30_role_allc)` 동적 INSERT/UPDATE → [`tdm30_role_allc.selectById`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm30_RoleAllc.notInRoleAllcIdList` | Tdm30_Edit_RoleAllc:246, Tdm30_Edit_RoleAllcModify:186, Tdm30_Tab_RoleAllc:413 | [`Tdm30_RoleAllc.java:64`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm30_role_allc.notInRoleAllcIdList`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm30_RoleAllc.selectById` | Tdm34_TabPage_RoleAllcDetail:456 | [`Tdm30_RoleAllc.java:25`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm30_role_allc.selectById`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm30_RoleAllc.selectByText` | Tdm30_Tab_RoleAllc:347 | [`Tdm30_RoleAllc.java:30`](../../tdm/services/Tdm30_RoleAllc.md) | [`tdm30_role_allc.selectByText`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm30_RoleAllc.update` | Tdm30_Tab_RoleAllc:501 | [`Tdm30_RoleAllc.java:196`](../../tdm/services/Tdm30_RoleAllc.md) | `UpdateDataModel(tdm30_role_allc)` 동적 INSERT/UPDATE → [`tdm30_role_allc.selectById`](../../tdm/sql/tdm30_role_allc.md) |
| `tdm.Tdm31_RoleDesc.getRollAllcDetailId` | Tdm34_TabPage_RoleAllcDetail:223 | [`Tdm31_RoleDesc.java:37`](../../tdm/services/Tdm31_RoleDesc.md) | [`tdm31_role_desc.getRollAllcDetailId`](../../tdm/sql/tdm31_role_desc.md) |
| `tdm.Tdm34_RoleAllcDetail.delete` | Tdm34_TabPage_RoleAllcDetail:383 | [`Tdm34_RoleAllcDetail.java:80`](../../tdm/services/Tdm34_RoleAllcDetail.md) | `UpdateDataModel(tdm34_role_allc_detail)` 동적 DELETE |
| `tdm.Tdm34_RoleAllcDetail.modelUpdate` | Tdm30_Edit_RoleAllc:352 | [`Tdm34_RoleAllcDetail.java:62`](../../tdm/services/Tdm34_RoleAllcDetail.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm34_role_allc_detail)` 동적 INSERT/UPDATE → [`tdm34_role_allc_detail.selectById`](../../tdm/sql/tdm34_role_allc_detail.md) |
| `tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId` | Tdm34_TabPage_RoleAllcDetail:290 | [`Tdm34_RoleAllcDetail.java:25`](../../tdm/services/Tdm34_RoleAllcDetail.md) | [`tdm34_role_allc_detail.selectByRoleAllcId`](../../tdm/sql/tdm34_role_allc_detail.md) |
| `tdm.Tdm34_RoleAllcDetail.update` | Tdm34_TabPage_RoleAllcDetail:342 | [`Tdm34_RoleAllcDetail.java:75`](../../tdm/services/Tdm34_RoleAllcDetail.md) | `UpdateDataModel(tdm34_role_allc_detail)` 동적 INSERT/UPDATE → [`tdm34_role_allc_detail.selectById`](../../tdm/sql/tdm34_role_allc_detail.md) |
| `tdm.Tdm34_RoleAllcDetail.updateApprId` | Tdm34_TabPage_RoleAllcDetail:490 | [`Tdm34_RoleAllcDetail.java:45`](../../tdm/services/Tdm34_RoleAllcDetail.md) | [`tdm34_role_allc_detail.updateApprId`](../../tdm/sql/tdm34_role_allc_detail.md), [`tdm35_role_allc_task.deleteByRoleAllcDetailId`](../../tdm/sql/tdm35_role_allc_task.md), [`tdm35_role_allc_task.insertByRoleAllcDetailId`](../../tdm/sql/tdm35_role_allc_task.md) |
| `tdm.Tdm35_RoleAllcTask.deleteInsert` | Tdm34_TabPage_RoleAllcDetail:532 | [`Tdm35_RoleAllcTask.java:40`](../../tdm/services/Tdm35_RoleAllcTask.md) | [`tdm30_role_allc.selectByExctId`](../../tdm/sql/tdm30_role_allc.md), [`tdm35_role_allc_task.deleteByRoleAllcDetailId`](../../tdm/sql/tdm35_role_allc_task.md), [`tdm35_role_allc_task.insertByRoleAllcDetailId`](../../tdm/sql/tdm35_role_allc_task.md) |
| `tdm.Tdm35_RoleAllcTask.selectTask` | Tdm35_Lookup_RoleAllcTask:95 | [`Tdm35_RoleAllcTask.java:25`](../../tdm/services/Tdm35_RoleAllcTask.md) | [`tdm35_role_allc_task.selectTask`](../../tdm/sql/tdm35_role_allc_task.md) |
| `tdm.Tdm35_RoleAllcTask.selectTaskDetail` | Tdm35_Lookup_RoleAllcTask:115 | [`Tdm35_RoleAllcTask.java:30`](../../tdm/services/Tdm35_RoleAllcTask.md) | [`tdm35_role_allc_task.selectTaskDetail`](../../tdm/sql/tdm35_role_allc_task.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm02_hr_record`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `gettdm30roleallc`, `tdm_create_data`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm30_Tab_RoleAllc (`client/vi/tdm/Tdm30_Tab_RoleAllc.java`, 623줄)

- 레이아웃: north=buttonBarNorth, west=vlcCenter, center=tabPage, south=vlcSouth
- 툴바 `buttonBarNorth`: 기준일: {baseDate} {allYn} 검색: {searchText} {retrieveButton} {refreshLink} {msgHlc}
- 툴바 `buttonBarCenter`: {insertButton} {deleteButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책/담당임원", `allYn` CheckBox, `tabPage` Tdm34_TabPage_RoleAllcDetail, `lookup` Tdm30_Edit_RoleAllcModify, `lookup01` LookupTriggerField, `lookup02` LookupTriggerField
- 그리드 `grid` (buildGrid()):
  - actionCell 45 "수정" Cell 편집:modifyCell
  - roleName 200 "직책" Text
  - personName 100 "담당임원" Text
  - addTitleYn 100 "추가수행직책<br>(겸임 직책)" BooleanYn2
  - startDate 90 "직책부여일" Date
  - endDate 90 "직책해제일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L100-165) → settings(), retrieve()
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L173) → retrieve()
[E2] searchText.KeyPress [Enter] (L186) → retrieve()
[E3] retrieveButton[조회].Select (L194) → retrieve()
[E4] insertButton[등록].Select (L200) → insertRow()
[E5] deleteButton[삭제].Select (L212) → deleteChk()
       └ [E11] msgBox.DialogHide [YES] (L513) → deleteRow()
[E6] refreshLink.MouseDown (L224) → refreshLink()
[E7] hiperLink[<b><span style='color:red;font-size:14px;'>확인하기</span></b>].MouseDown (L230) → lookupLink()
[E8] grid.SelectionChanged [선택>0] (L242) → retrieveTabPage()
[E9] lookup01.TriggerClick [selectModel.getApprYn()] (L278) → execute()
[E10] lookup02.TriggerClick [selectModel.getApprYn()] (L302) → execute()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L93-95 | E9,E10,buildGrid,retrieve,insertRow,deleteRow,lookupLink | 상태 처리 | 업무 |
| private retrieveTabPage() | L252-255 | E8,retrieve | 상태 처리 | 업무 |
| private retrieve() | L339-368 | 생성자,E1,E2,E3,execute,insertRow | 서비스 tdm.Tdm30_RoleAllc.selectByText(companyId, baseDate, allYn, searchText) | 업무 |
| private insertRow() | L370-378 | E4 | 팝업 Tdm30_Edit_RoleAllc 열기 | 업무 |
| private updateChk01() | L380-405 | 미사용 후보 | 상태 처리 | 업무 |
| private updateChk02() | L407-497 | updateChk01 | 서비스 tdm.Tdm30_RoleAllc.notInRoleAllcIdList(companyId, baseDate, roleAllcIdLIst) | 업무 |
| private update() | L499-502 | updateChk02 | 서비스 tdm.Tdm30_RoleAllc.update | 업무 |
| private deleteChk() | L504-528 | E5 | ConfirmBox → E11 | 업무 |
| private deleteRow() | L530-556 | E11 | GridDeleteData tdm.Tdm30_RoleAllc.delete(체크된 행 목록) | 업무 |
| private refreshLink() | L577-602 | E6,retrieve,lookupLink | 서비스 tdm.Tdm02_HrRecord.selectByCompanyId(companyId, applyCode, searchText) | 업무 |
| private lookupLink() | L604-612 | E7 | 조회창 Tdm02_Lookup_HrRecord 열기 | 업무 |
| private settings() | L167-250 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, allYn=true("전체보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L257-337 | 필드 초기화 | 팝업 Tdm30_Edit_RoleAllcModify 열기, 조회창 Tdm20_Lookup_SelectSingle 열기, 조회창 Tdm01_Lookup_SelectSingle 열기, 미선택 시 alert "이미 상신중이거나 완료된 문서가 존재합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L614-616 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L617-619 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L620-622 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L326) addCell
  gb.text('roleNm', 200, '직책'),  // L327
  gb.text('personNm', 100, '담당임원'),  // L328
  gb.booleanYn2('addTitleYn', 100, '추가수행직책<br>(겸임 직책)'),  // L330
  gb.date('startDate', 90, '직책부여일'),  // L331
  gb.date('endDate', 90, '직책해제일'),  // L332
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Tdm34_TabPage_RoleAllcDetail (`client/vi/tdm/Tdm34_TabPage_RoleAllcDetail.java`, 612줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookup` Tdm35_Lookup_RoleAllcTask, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - roleAllcDate 90 "책무배분일" Date 편집:MyDateField
  - regReason 200 "등록사유" TextArea 편집:TextField
  - deputyEmpName 120 "유고시<br>대체 임직원" Text 편집:TextField
  - actionCell 70 "책무보기" Cell 편집:actionCell01
  - addTitleYnStr 75 "책무기술서<br>미리보기" DynamicCell 편집:actionCell04
  - apprStatusName 70 "상신상태" TextStatus
  - apprStatusCode 30 " " DynamicCell 편집:actionCell02
  - apprStatusCode 30 " " DynamicCell 편집:actionCell03
  - updName 80 "변경자" TextCenter
  - updDateStr 150 "변경일시" TextCenter
  - getSource  "" BeforeStartEditHandler

#### 이벤트
[E0] 화면 열림 (생성자 L80-103) → settings()
[E1] retrieveButton[조회].Select (L106) → retrieve()
[E2] insertButton[등록].Select (L112) → insertRow()
[E3] updateButton[저장].Select (L118) → updateChk01()
[E4] deleteButton[삭제].Select (L124) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L348) → deleteRow()
[E5] messageBox.DialogHide (L154) → dcrChk()
[E6] gridBuilder.BeforeStartEdit [model != null] (L260) → 메시지 "상신문서 존재시 책무배분일은 수정할 수 없습니다"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L279-283 | E1 | 상태 처리 | 업무 |
| private retrieve() | L285-299 | E1 | 서비스 tdm.Tdm34_RoleAllcDetail.selectByRoleAllcId(roleAllcId) | 업무 |
| private insertRow() | L301-308 | E2 | 상태 처리 | 업무 |
| private updateChk01() | L310-338 | E3 | 상태 처리 | 업무 |
| private update() | L340-343 | updateChk01 | 서비스 tdm.Tdm34_RoleAllcDetail.update | 업무 |
| private deleteChk() | L345-363 | E4 | ConfirmBox → E7 | 업무 |
| private deleteRow() | L365-393 | E7 | GridDeleteData tdm.Tdm34_RoleAllcDetail.delete(체크된 행 목록) | 업무 |
| private dcrChk() | L395-432 | E5,buildGrid | 조회창 Dcr01_Lookup_Class 열기, 미선택 시 alert "저장 후 진행가능합니다", 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private getHtmlData() | L434-453 | dcrChk | 서비스 tdm.Tdm12_TaskRelateDetail.getHtmlData(companyId, roleId, stdDate) | 업무 |
| private getModel() | L455-467 | getHtmlData | 서비스 tdm.Tdm30_RoleAllc.selectById(roleAllcId) | 업무 |
| private insertLinkApprovals() | L469-487 | getModel | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L489-505 | insertLinkApprovals | 서비스 tdm.Tdm34_RoleAllcDetail.updateApprId | 업무 |
| private lookupDesc() | L507-543 | buildGrid | 서비스 tdm.Tdm35_RoleAllcTask.deleteInsert(tdm30Model, tdm34Model) | 업무 |
| private viewRd() | L545-588 | lookupDesc,viewFile | 미선택 시 alert, 서비스 sys.Sys99_Print.CreateTdmRoleDesc(companyId, personId, windowClassName, pJobTp, allcStdDate, pId) | 업무 |
| private viewFile() | L590-610 | buildGrid | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L105-130 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L132-277 | 필드 초기화 | 조회창 Tdm35_Lookup_RoleAllcTask 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 yyyy.MM.dd, tdm.Tdm31_RoleDesc.getRollAllcDetailId(companyId, roleAllcDate, roleAllcDetailId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L247 newHeaderGroupMap06newHeaderGroupConfig13 100 "임원동의서" (tdm34_new_header_group_map06new_header_group_config13 컬럼 없음)
  gb.date('roleAllcDate', 90, '책무배분일', { editor: 'date' }),  // L249
  gb.textArea('regReason', 200, '등록사유', { editor: 'text' }),  // L250
  gb.text('deputyEmpNm', 120, '유고시<br>대체 임직원', { editor: 'text' }),  // L251
  // ⚠ 대응 없음 (GridBuilder L252) addCell
  // ⚠ 대응 없음 (GridBuilder L254) addDynamicCell
  gb.textStatus('apprStatusNm', 70, '상신상태'),  // L255 SQL 계산 컬럼(selectByRoleAllcId: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L256) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L257) addDynamicCell
  gb.textCenter('updNm', 80, '변경자'),  // L258
  gb.textCenter('updDateStr', 150, '변경일시'),  // L259 SQL 계산 컬럼(selectByRoleAllcId: COALESCE(TO_CHAR(tdm34_upd_date, 'yyyy-…)
  // ⚠ 대응 없음 (GridBuilder L260) addBeforeStartEditHandler
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={updateChk01}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Tdm35_Lookup_RoleAllcTask (`client/vi/tdm/Tdm35_Lookup_RoleAllcTask.java`, 126줄)

- 그리드 `taskGrid` (taskBuildGrid()):
  - taskName 450 "책무" TextArea
- 그리드 `detailGrid` (detailBuildGrid()):
  - taskRelateDetailName 700 "책무 세부내용" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L34-39) → 초기화
[E1] closeButton[닫기].Select (L61) → hide()
[E2] taskGrid.SelectionChanged [선택>0] (L68) → retrieveDetail()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L41-58 | 공개 메서드 | 상태 처리 | 업무 |
| public taskBuildGrid() | L78-82 | 필드 초기화 | 상태 처리 | 업무 |
| public detailBuildGrid() | L84-88 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L90-104 | open | 서비스 tdm.Tdm35_RoleAllcTask.selectTask(roleAllcDetailId) | 업무 |
| public retrieveDetail() | L106-121 | E2 | 서비스 tdm.Tdm35_RoleAllcTask.selectTaskDetail(roleAllcDetailId, taskId, apprYn) | 업무 |
| private settings() | L60-76 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L123-125 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const taskBuildGrid = () => [
  gb.textArea('taskNm', 450, '책무'),  // L80
];

const detailBuildGrid = () => [
  gb.textArea('taskRelateDetailNm', 700, '책무 세부내용'),  // L86
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm30_Edit_RoleAllcModify (`client/vi/tdm/Tdm30_Edit_RoleAllcModify.java`, 298줄)

- 입력·하위 화면: `roleName` TextField, `personName` LookupTriggerField, `personId` LongField, `addTitleYn` CheckBox, `startDate` MyDateField, `endDate` MyDateField, `lookup` Tdm01_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L69-75) → 초기화
[E1] personName[담당임원].TriggerClick (L98) → 인라인 L98-111 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[저장].Select (L119) → updateChk()
[E3] closeButton[닫기].Select (L125) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L77-92 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L94-131 | open | 조회창 Tdm01_Lookup_SelectSingle 열기 | 업무 |
| private getEditor() | L133-159 | open | 상태 처리 | 업무 |
| private updateChk() | L161-178 | E2 | 상태 처리 | 업무 |
| private updateChk02() | L180-268 | updateChk | 서비스 tdm.Tdm30_RoleAllc.notInRoleAllcIdList(companyId, baseDate, roleAllcIdLIst) | 업무 |
| private update() | L270-287 | updateChk02 | 서비스 tdm.Tdm30_RoleAllc.modelUpdate | 업무 |
| private setHtmlStyle() | L289-291 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L292-294 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L295-297 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm30_Edit_RoleAllc (`client/vi/tdm/Tdm30_Edit_RoleAllc.java`, 374줄)

- 입력·하위 화면: `roleName` LookupTriggerField, `roleId` LongField, `personName` LookupTriggerField, `personId` LongField, `addTitleYn` CheckBox, `startDate` MyDateField, `roleAllcDate` MyDateField, `regReason` MyTextArea, `deputyEmpName` TextField, `lookup` Tdm20_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L78-83) → 초기화
[E1] roleName[직책].TriggerClick [result != null] (L120) → 인라인 L120-139 (new TriggerClickHandler(){ @Override …)
[E2] personName[담당임원].TriggerClick (L141) → 인라인 L141-154 (new TriggerClickHandler(){ @Override …)
[E3] updateButton[저장].Select (L155) → updateChk()
[E4] closeButton[닫기].Select (L161) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L85-107 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L109-116 | insert | 상태 처리 | 업무 |
| private setting() | L118-167 | open | 조회창 Tdm20_Lookup_SelectSingle 열기, 조회창 Tdm01_Lookup_SelectSingle 열기 | 업무 |
| private getEditor() | L169-205 | insert | 상태 처리 | 업무 |
| private updateChk() | L207-238 | E3 | 상태 처리 | 업무 |
| private updateChk02() | L240-328 | updateChk | 서비스 tdm.Tdm30_RoleAllc.notInRoleAllcIdList(companyId, baseDate, roleAllcIdLIst) | 업무 |
| private update() | L330-341 | updateChk02 | 서비스 tdm.Tdm30_RoleAllc.modelUpdate | 업무 |
| private updateRoleAllcDetail() | L343-363 | update | 서비스 tdm.Tdm34_RoleAllcDetail.modelUpdate | 업무 |
| private setHtmlStyle() | L365-367 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L368-370 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L371-373 | insert | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm20_Lookup_SelectSingle (`client/vi/tdm/Tdm20_Lookup_SelectSingle.java`, 231줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책/직책그룹/개요"
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 200 "직책" Text
  - roleTypeName 120 "직책그룹" Text
  - roleTypeEtcName 170 "기타그룹명" Text
  - overview 600 "개요" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L62-67) → 초기화
[E1] searchText.KeyPress [Enter] (L128) → retrieve()
[E2] grid.CellDoubleClick (L136) → confirm()
[E3] retrieveButton[조회].Select (L142) → retrieve()
[E4] updateButton[확인].Select (L148) → confirm()
[E5] closeButton[닫기].Select (L154) → hide()
[E6] allButton[전체].Select (L160) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAll() | L69-75 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L77-80 | openAll | 상태 처리 | 업무 |
| public open() | L82-86 | openAll | 상태 처리 | 업무 |
| public open() | L88-118 | openAll | 상태 처리 | 업무 |
| public retrieve() | L180-194 | E1,E3,open | 서비스 tdm.Tdm20_Role.selectByDate(companyId, baseDate, searchText, roleType) | 업무 |
| public confirm() | L196-222 | E2,E4 | 미선택 시 alert "선택된 직책이 없습니다", 서비스 tdm.Tdm20_Role.modelUpdate | 업무 |
| private settings() | L120-167 | open | 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L169-178 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L224-226 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L228-230 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '직책'),  // L172
  gb.text('roleTypeNm', 120, '직책그룹'),  // L173
  gb.text('roleTypeEtcNm', 170, '기타그룹명'),  // L174
  gb.textArea('overview', 600, '개요'),  // L175
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>

### Tdm02_Lookup_HrRecord (`client/vi/tdm/Tdm02_Lookup_HrRecord.java`, 272줄)

- 툴바 `buttonBar`: {hlc} {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `radioType1` Radio, `radioType2` Radio, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="구분/임원명/비고"
- 그리드 `grid` (buildGrid()):
  - regDate 100 "변경일" Date
  - regTypeName 70 "구분" TextCenter
  - personName 80 "임원명" TextCenter
  - changeData 550 "변경내용" TextArea
  - applyYn 80 "적용완료" Boolean
  - note 150 "비고" Text 편집:TextField
  - updName 80 "적용자" TextCenter
  - updDateStr 150 "적용일시" TextCenter

#### 이벤트
[E1] searchText.KeyPress (L130) → retrieve()
[E2] toggleGroup.ValueChange (L145) → retrieve()
[E3] retrieveButton[조회].Select (L163) → retrieve()
[E4] updateButton[저장].Select (L169) → update()
[E5] closeButton[닫기].Select (L175) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L74-113 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L209-225 | E1,E2,E3,open,update | 서비스 tdm.Tdm02_HrRecord.selectByCompanyId(companyId, startDate, closeDate, applyCode, searchText, limit) | 업무 |
| private update() | L227-259 | E4 | 서비스 tdm.Tdm02_HrRecord.updateApplyCode | 업무 |
| private settings() | L115-182 | open | 이벤트 연결, 초기값: startDate=toDay, closeDate=endDate, radioType1=true("미적용건만 보기"), radioType2=false("조회기간 :") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L184-207 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L261-263 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L265-267 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L269-271 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '변경일'),  // L196
  gb.textCenter('regTypeNm', 70, '구분'),  // L197 SQL 계산 컬럼(selectByCompanyId: ( CASE WHEN tdm02_reg_type = 'NEW' THEN…)
  gb.textCenter('personNm', 80, '임원명'),  // L198
  gb.textArea('changeData', 550, '변경내용'),  // L199
  // ⚠DB없음 L201 applyYn 80 "적용완료" (tdm02_apply_yn 컬럼 없음)
  gb.text('note', 150, '비고', { editor: 'text' }),  // L202
  gb.textCenter('updNm', 80, '적용자'),  // L203
  gb.textCenter('updDateStr', 150, '적용일시'),  // L204 SQL 계산 컬럼(selectByCompanyId: COALESCE(TO_CHAR(tdm02_upd_date, 'yyyy-…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm01_Lookup_SelectSingle (`client/vi/tdm/Tdm01_Lookup_SelectSingle.java`, 159줄)

- 툴바 `buttonBar`: 검색: {searchText} {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="임원명/직위/조직명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - personName 100 "임원명" TextCenter
  - posName 150 "직위" Text
  - orgName 250 "조직명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-80) → settings(), show()
[E1] searchText.KeyPress [Enter] (L85) → retrieve()
[E2] grid.CellDoubleClick (L93) → confirm()
[E3] retrieveButton[조회].Select (L99) → retrieve()
[E4] updateButton[확인].Select (L105) → confirm()
[E5] closeButton[닫기].Select (L111) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-51 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L128-140 | E1,E3,open | 서비스 tdm.Tdm01_Hr.selectByEndDate(companyId, searchText) | 업무 |
| public confirm() | L142-150 | E2,E4 | 미선택 시 alert "선택된 담당임원이 없습니다" | 업무 |
| private settings() | L82-117 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-126 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L152-154 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L156-158 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 100, '임원명'),  // L122
  gb.text('posNm', 150, '직위'),  // L123
  gb.text('orgNm', 250, '조직명'),  // L124
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

