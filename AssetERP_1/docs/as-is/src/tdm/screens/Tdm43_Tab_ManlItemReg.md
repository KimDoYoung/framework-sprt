# Tdm43_Tab_ManlItemReg

- 종류: 화면
- 메뉴: 책무 > 03. 부서책무매뉴얼 > 매뉴얼(점검항목) 작성 (#1422)
- 파일: `client/vi/tdm/Tdm43_Tab_ManlItemReg.java`
- 함께 쓰는 클래스 10개:
  - `Tdm43_TabPage_ManlItemReg` `client/vi/tdm/Tdm43_TabPage_ManlItemReg.java`
  - `Tdm43_Lookup_ManlItemRegList` `client/vi/tdm/Tdm43_Lookup_ManlItemRegList.java`
  - `Tdm43_Edit_Manl` `client/vi/tdm/Tdm43_Edit_Manl.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
  - `Tdm43_Lookup_ExctDuty` `client/vi/tdm/Tdm43_Lookup_ExctDuty.java`
  - `Tdm43_Lookup_ManlItemRegList2` `client/vi/tdm/Tdm43_Lookup_ManlItemRegList2.java`
  - `Tdm40_Lookup_SelectSingle` `client/vi/tdm/Tdm40_Lookup_SelectSingle.java`
  - `Tdm20_Lookup_SelectRole` `client/vi/tdm/Tdm20_Lookup_SelectRole.java`
  - `Tdm10_Lookup_SelectSingle` `client/vi/tdm/Tdm10_Lookup_SelectSingle.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Org00_Lookup_SelectTdm`](../../org/components/Org00_Lookup_SelectTdm.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm43_Edit_Manl:240 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm08_ManagerInfo.checkIsManager` | Tdm43_Tab_ManlItemReg:316 | [`Tdm08_ManagerInfo.java:42`](../../tdm/services/Tdm08_ManagerInfo.md) | [`tdm08_manager_info.checkIsManager`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm10_Task.selectByText` | Tdm10_Lookup_SelectSingle:176 | [`Tdm10_Task.java:25`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.selectByText`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectRole:193 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectCheckTargetRole` | Tdm20_Lookup_SelectRole:188 | [`Tdm20_Role.java:38`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectCheckTargetRole`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm40_ManlJob.selectByText` | Tdm40_Lookup_SelectSingle:156, Tdm43_Tab_ManlItemReg:378 | [`Tdm40_ManlJob.java:24`](../../tdm/services/Tdm40_ManlJob.md) | [`tdm40_manl_job.selectByText`](../../tdm/sql/tdm40_manl_job.md) |
| `tdm.Tdm41_ManlDuty.selectByOrgIdPaging` | Tdm43_Tab_ManlItemReg:115 | [`Tdm41_ManlDuty.java:40`](../../tdm/services/Tdm41_ManlDuty.md) | [`tdm41_manl_duty.selectByOrgIdPaging`](../../tdm/sql/tdm41_manl_duty.md), [`tdm41_manl_duty.selectByOrgIdPagingTotal`](../../tdm/sql/tdm41_manl_duty.md) |
| `tdm.Tdm41_ManlDuty.updateEndYn` | Tdm43_TabPage_ManlItemReg:289 | [`Tdm41_ManlDuty.java:156`](../../tdm/services/Tdm41_ManlDuty.md) | [`tdm42_manl_org.selectById`](../../tdm/sql/tdm42_manl_org.md), [`tdm44_manl_duty_org.updateEndYn`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm43_Manl.copyDutyList` | Tdm43_Tab_ManlItemReg:356 | [`Tdm43_Manl.java:144`](../../tdm/services/Tdm43_Manl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insertByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm43_manl.checkByManlCode`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.getNewManlCode`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.insertByModel`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.selectByDutyId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.updateEndYn`](../../tdm/sql/tdm44_manl_duty_org.md), [`tdm45_manl_relate_ics.insertByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.insertByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.insertByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm43_Manl.copyManlList` | Tdm43_TabPage_ManlItemReg:244 | [`Tdm43_Manl.java:79`](../../tdm/services/Tdm43_Manl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insertByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm43_manl.checkByManlCode`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.insertByManlId`](../../tdm/sql/tdm43_manl.md), [`tdm45_manl_relate_ics.insertByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.insertByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.insertByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm43_Manl.delete` | Tdm43_TabPage_ManlItemReg:219 | [`Tdm43_Manl.java:321`](../../tdm/services/Tdm43_Manl.md) | [`sys11_relate_file.deleteByParentId`](../../sys/sql/sys11_relate_file.md), [`tdm45_manl_relate_ics.deleteByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md), [`tdm46_manl_relate_icr.deleteByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md), [`tdm47_manl_relate_dcr.deleteByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md), `UpdateDataModel(tdm43_manl)` 동적 DELETE |
| `tdm.Tdm43_Manl.modelUpdate` | Tdm43_Edit_Manl:487 | [`Tdm43_Manl.java:230`](../../tdm/services/Tdm43_Manl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm43_manl.getNewManlCode`](../../tdm/sql/tdm43_manl.md), `UpdateDataModel(tdm45_manl_relate_ics)` 동적 INSERT/UPDATE → [`tdm45_manl_relate_ics.selectById`](../../tdm/sql/tdm45_manl_relate_ics.md), `UpdateDataModel(tdm46_manl_relate_icr)` 동적 INSERT/UPDATE → [`tdm46_manl_relate_icr.selectById`](../../tdm/sql/tdm46_manl_relate_icr.md), `UpdateDataModel(sys11_relate_file)` 동적 INSERT/UPDATE → [`sys11_relate_file.selectById`](../../sys/sql/sys11_relate_file.md), `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 INSERT/UPDATE → [`tdm47_manl_relate_dcr.selectById`](../../tdm/sql/tdm47_manl_relate_dcr.md), `UpdateDataModel(tdm43_manl)` 동적 INSERT/UPDATE → [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectByManlDutyId` | Tdm43_TabPage_ManlItemReg:208 | [`Tdm43_Manl.java:25`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByManlDutyId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectByManlJobId` | Tdm43_Lookup_ManlItemRegList2:319 | [`Tdm43_Manl.java:68`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByManlJobId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectByRoleId` | Tdm43_Lookup_ManlItemRegList:303 | [`Tdm43_Manl.java:43`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByRoleId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectByTaskRelateDutyId` | Tdm43_Lookup_ManlItemRegList2:338, Tdm43_Lookup_ManlItemRegList:325 | [`Tdm43_Manl.java:48`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByTaskRelateDutyId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getorg`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm43_Tab_ManlItemReg (`client/vi/tdm/Tdm43_Tab_ManlItemReg.java`, 483줄)

- 레이아웃: north=vlc, center=tabPage
- 툴바 `buttonBar`: 매뉴얼작업: {manlJobLookup} 직책: {roleLookup} 책무: {taskLookup} 부서: {orgLookup} 검색: {searchText} {retrieveButton} {loadButton}
- 입력·하위 화면: `manlJobLookup` LookupTriggerField 빈칸="필수선택입니다", `searchText` TextField 빈칸="직책/책무/책무세부/관리의무", `orgLookup` LookupTriggerField, `roleLookup` LookupTriggerField 빈칸="전체", `taskLookup` LookupTriggerField 빈칸="전체", `tabPage` Tdm43_TabPage_ManlItemReg, `lookup` Tdm20_Lookup_SelectRole
- 그리드 `grid` (buildGrid()):
  - roleName 150 "직책" Text
  - taskName 250 "책무" TextArea
  - taskRelateDetailName 350 "책무세부" TextArea
  - taskRelateDutyName 550 "관리의무" TextArea
  - manlCnt 70 "작성건수" LongCenter
  - endYn 80 "작성완료" BooleanYn2
  - endDate 100 "작성완료일" Date
  - endEmpName 100 "작성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L88-140) → settings(), execute(), autoRetrieve()
[E1] roleLookup.TriggerClick [result != null] (L150) → execute(), retrieve()
[E2] taskLookup.TriggerClick [result != null] (L174) → execute(), retrieve()
[E3] orgLookup.TriggerClick (L197) → execute(), retrieve()
[E4] searchText.KeyPress [Enter] (L217) → retrieve()
[E5] manlJobLookup.TriggerClick [result != null] (L229) → execute(), manlJobLookupEnd()
[E6] retrieveButton[조회].Select [manlJobId == null] (L253) → retrieve()
[E7] loadButton[불러오기].Select [manlJobId == null] (L263) → execute(), copyManlList()
[E8] grid.SelectionChanged (L306) → retrieveTabPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L83-85 | 생성자,E1,E2,E3,E5,E7,settings,autoRetrieve,retrieve | 상태 처리 | 업무 |
| private setIsManager() | L314-336 | settings | 서비스 tdm.Tdm08_ManagerInfo.checkIsManager(companyId, personId, stdDate) | 업무 |
| private manlJobLookupEnd() | L338-353 | E5,autoRetrieve | 상태 처리 | 업무 |
| private copyManlList() | L355-375 | E7 | 서비스 tdm.Tdm43_Manl.copyDutyList(manlJobId, roleId, orgId) | 업무 |
| private autoRetrieve() | L377-407 | 생성자 | 조회창 Tdm40_Lookup_SelectSingle 열기, 서비스 tdm.Tdm40_ManlJob.selectByText(companyId, orgId, searchText, writingYn, checkYn) | 업무 |
| private retrieve() | L423-454 | E1,E2,E3,E4,E6,execute,manlJobLookupEnd,copyManlList | 상태 처리 | 업무 |
| private retrieveEnd() | L456-473 | retrieve | 상태 처리 | 업무 |
| private retrieveTabPage() | L475-478 | E8,retrieveEnd | 상태 처리 | 업무 |
| private settings() | L142-312 | 생성자 | 조회창 Tdm20_Lookup_SelectRole 열기, 조회창 Tdm10_Lookup_SelectSingle 열기, 조회창 Org00_Lookup_SelectTdm 열기, 조회창 Tdm40_Lookup_SelectSingle 열기, 조회창 Tdm43_Lookup_ManlItemRegList2 열기, 이벤트 연결, 초기값: roleLookup=resultModel.getRoleName(, roleLookup=null, taskLookup=resultModel.getTaskName(, taskLookup=null, orgLookup=orgModel.getKorName(, orgLookup=LoginUser.getUserModel( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L409-421 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L480-482 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 150, '직책'),  // L411 SQL 계산 컬럼(selectByOrgIdPagingTotal: tdm20_role_nm)
  gb.textArea('taskNm', 250, '책무'),  // L412 SQL 계산 컬럼(selectByOrgIdPagingTotal: tdm10_task_nm)
  gb.textArea('taskRelateDetailNm', 350, '책무세부'),  // L413 SQL 계산 컬럼(selectByOrgIdPagingTotal: tdm12_content)
  gb.textArea('taskRelateDutyNm', 550, '관리의무'),  // L414 SQL 계산 컬럼(selectByOrgIdPagingTotal: tdm13_content)
  gb.longCenter('manlCnt', 70, '작성건수'),  // L415 SQL 계산 컬럼(selectByOrgIdPaging: ( SELECT COUNT(*) FROM tdm43_manl WHERE…)
  gb.booleanYn2('endYn', 80, '작성완료'),  // L416 SQL 계산 컬럼(selectByOrgIdPagingTotal: tdm44_end_yn)
  gb.date('endDate', 100, '작성완료일'),  // L417 SQL 계산 컬럼(selectByOrgIdPagingTotal: tdm44_end_date)
  gb.textCenter('endEmpNm', 100, '작성자'),  // L418 SQL 계산 컬럼(selectByOrgIdPagingTotal: f_emp_kor_nm(tdm44_end_emp_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={() => /* execute(), copyManlList() */}>불러오기</Button>

### Tdm43_TabPage_ManlItemReg (`client/vi/tdm/Tdm43_TabPage_ManlItemReg.java`, 319줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: ▼ 점검항목: {insertButton} {deleteButton} {loadButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `lookup` Tdm43_Edit_Manl
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 60 "수정" Cell 편집:actionCell01
  - manlCode 80 "코드" TextCenter
  - checkItem 550 "점검항목" TextArea
  - checkCycleInfo 250 "점검주기" Text
  - actionCell 80 "점검방법" Cell 편집:actionCell02
  - checkEvidDocName 300 "증빙자료" TextLimitArea

#### 이벤트
[E0] 화면 열림 (생성자 L56-79) → settings()
[E1] insertButton[등록].Select [manlDutyModel == null] (L82) → retrieve()
[E2] deleteButton[삭제].Select [cnt == 0] (L99) → delete()
[E3] messageBox.DialogHide (L114) → delete()
[E4] loadButton[불러오기].Select [manlDutyModel == null] (L126) → copyManlList()
[E5] confirmButton[작성완료].Select (L147) → updateEndYn()
[E6] cancelButton[작성취소].Select (L153) → updateEndYn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L198-214 | E1,buildGrid,copyManlList | 서비스 tdm.Tdm43_Manl.selectByManlDutyId(manlDutyId, orgId) | 업무 |
| private delete() | L216-229 | E2,E3 | GridDeleteData tdm.Tdm43_Manl.delete(체크된 행 목록) | 업무 |
| private checkButtonEnabled() | L231-241 | retrieve,updateEndYn | 상태 처리 | 업무 |
| private copyManlList() | L243-273 | E4 | 서비스 tdm.Tdm43_Manl.copyManlList(manlOrgId, roleId, roleName, exctId, taskId, taskName, taskRelateDetailId, taskRelateDetailName, taskRelateDutyId, taskRelateDutyName, manlDutyId, firstRegEmpId, updName, orgId) | 업무 |
| private updateEndYn() | L275-310 | E5,E6 | 서비스 tdm.Tdm41_ManlDuty.updateEndYn(manlDutyId, manlOrgId, empId, orgId, endYn, updName) | 업무 |
| public clear() | L312-314 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L81-159 | 생성자 | 팝업 Tdm43_Edit_Manl 열기, 조회창 Tdm43_Lookup_ManlItemRegList 열기, 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L161-196 | 필드 초기화 | 팝업 Tdm43_Edit_Manl 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L316-318 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L187) addCell
  gb.textCenter('manlCd', 80, '코드'),  // L188
  gb.textArea('checkItem', 550, '점검항목'),  // L189
  gb.text('checkCycleInfo', 250, '점검주기'),  // L190
  // ⚠ 대응 없음 (GridBuilder L191) addCell
  // ⚠ 대응 없음 (GridBuilder L192) addTextLimitArea
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={retrieve}>등록</Button>
2. <Button type="delete" onClick={delete}>삭제</Button>
3. <Button type="register" onClick={copyManlList}>불러오기</Button>
4. <Button type="save" onClick={updateEndYn}>작성완료</Button>
5. <Button type="cancel" onClick={updateEndYn}>작성취소</Button>

### Tdm43_Lookup_ManlItemRegList (`client/vi/tdm/Tdm43_Lookup_ManlItemRegList.java`, 354줄)

- 툴바 `buttonBar`: 기준일: {stdDate} {allYn} 직책: {roleLookup} 책무: {taskLookup} 부서: {orgLookup} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `roleLookup` LookupTriggerField 빈칸="전체", `taskLookup` LookupTriggerField 빈칸="전체", `orgLookup` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="부서/책무/관리의무", `stdDate` MyDateField, `allYn` CheckBox, `lookup` Tdm20_Lookup_SelectRole
- 그리드 `grid01` (buildGrid01()):
  - taskName 300 "책무" Text
  - taskRelateDetailName 350 "책무세부" TextArea
  - taskRelateDutyName 450 "주요관리의무" TextArea
  - roleName 150 "직책" Text
  - orgName 200 "부서" Text
  - applyStartDate 100 "사용시작일" Date
  - applyEndDate 100 "사용종료일" Date
  - jobName 200 "매뉴얼작업명" Text
- 그리드 `grid02` (buildGrid02(), 체크박스(다중)):
  - manlCode 100 "코드" TextCenter
  - checkItem 900 "점검항목" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L88-130) → settings(), show()
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L138) → retrieve01()
[E2] roleLookup.TriggerClick [result != null] (L154) → retrieve01()
[E3] taskLookup.TriggerClick [result != null] (L178) → retrieve01()
[E4] orgLookup.TriggerClick [result != null] (L202) → retrieve01()
[E5] searchText.KeyPress [Enter] (L225) → retrieve01()
[E6] retrieveButton[조회].Select (L234) → retrieve01()
[E7] grid01.RowClick (L240) → retrieve02()
[E8] grid02.RowDoubleClick (L246) → confirm()
[E9] updateButton[확인].Select (L253) → confirm()
[E10] closeButton[닫기].Select (L259) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L79-86 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid01() | L267-279 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid02() | L281-288 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve01() | L290-313 | E1,E2,E3,E4,E5,E6,open | 서비스 tdm.Tdm43_Manl.selectByRoleId(companyId, roleId, taskId, orgId, stdDate, allYn, searchText) | 업무 |
| public retrieve02() | L315-331 | E7,retrieve01 | 서비스 tdm.Tdm43_Manl.selectByTaskRelateDutyId(manlOrgId, taskRelateDutyId) | 업무 |
| public confirm() | L333-342 | E8,E9 | 상태 처리 | 업무 |
| private settings() | L132-265 | 생성자 | 조회창 Tdm20_Lookup_SelectRole 열기, 조회창 Tdm10_Lookup_SelectSingle 열기, 조회창 Org00_Lookup_SelectTdm 열기, 이벤트 연결, 초기값: stdDate=LoginUser.getToday(, allYn=false("전체보기"), roleLookup=resultModel.getRoleName(, roleLookup=null, taskLookup=resultModel.getTaskName(, taskLookup=null, orgLookup=orgModel.getKorName(, orgLookup=null | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L344-346 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L347-349 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L351-353 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('taskNm', 300, '책무'),  // L269
  gb.textArea('taskRelateDetailNm', 350, '책무세부'),  // L270
  gb.textArea('taskRelateDutyNm', 450, '주요관리의무'),  // L271
  gb.text('roleNm', 150, '직책'),  // L272
  gb.text('orgNm', 200, '부서'),  // L273
  gb.date('applyStartDate', 100, '사용시작일'),  // L274
  gb.date('applyEndDate', 100, '사용종료일'),  // L275
  gb.text('jobNm', 200, '매뉴얼작업명'),  // L276
];

const buildGrid02 = () => [
  gb.textCenter('manlCd', 100, '코드'),  // L284
  gb.textArea('checkItem', 900, '점검항목'),  // L285
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve01}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Edit_Manl (`client/vi/tdm/Tdm43_Edit_Manl.java`, 637줄)

- 입력·하위 화면: `roleName` TextField, `taskName` TextField, `taskRelateDetailName` MyTextArea, `taskRelateDutyName` MyTextArea, `checkItem` MyTextArea 빈칸="점검항목명을 입력하세요", `checkCycleCode` TextField, `checkMonth` TextField, `ceoDutyCode` TextField, `ceoDutyName` ComboBoxField("TdmCeoDutyCode", "(해당없음)") 빈칸="선택하세요", `exctDutyMap` TextField, `exctDutyName` LookupTriggerField 빈칸="선택하세요", `importLevelCode` TextField, `importLevelName` ComboBoxField("TdmImportLevelCode", "(선택안함)") 빈칸="선택하세요", `checkMonth01Yn` CheckBox, `checkMonth02Yn` CheckBox, `checkMonth03Yn` CheckBox, `checkMonth04Yn` CheckBox, `checkMonth05Yn` CheckBox, `checkMonth06Yn` CheckBox, `checkMonth07Yn` CheckBox, `checkMonth08Yn` CheckBox, `checkMonth09Yn` CheckBox, `checkMonth10Yn` CheckBox, `checkMonth11Yn` CheckBox, `checkMonth12Yn` CheckBox, `checkEvidDocName` MyTextArea 빈칸="증빙자료명을 입력하세요", `checkHow` MyTextArea 빈칸="점검방법을 입력하세요", `refBasis` MyTextArea, `startDate` MyDateField, `relateList` Tdm43_Page_Relate, `checkCycleName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요"

#### 이벤트
[E0] 화면 열림 (생성자 L184-195) → settings(), show()
[E1] exctDutyName[임원의무].TriggerClick (L211) → lookupExctDuty()
[E2] unUseButton[미사용].Select (L218) → 서비스 yyyy.MM.dd
[E3] updateButton[저장].Select (L224) → update()
[E4] closeButton[닫기].Select (L230) → hide()
[E5] checkCycleName[점검주기].Collapse (L243) → setCheckMonthBox()
[E6] checkMonth01Yn.ValueChange (L250) → getCheckMonth()
[E7] checkMonth02Yn.ValueChange (L256) → getCheckMonth()
[E8] checkMonth03Yn.ValueChange (L262) → getCheckMonth()
[E9] checkMonth04Yn.ValueChange (L268) → getCheckMonth()
[E10] checkMonth05Yn.ValueChange (L274) → getCheckMonth()
[E11] checkMonth06Yn.ValueChange (L280) → getCheckMonth()
[E12] checkMonth07Yn.ValueChange (L286) → getCheckMonth()
[E13] checkMonth08Yn.ValueChange (L292) → getCheckMonth()
[E14] checkMonth09Yn.ValueChange (L298) → getCheckMonth()
[E15] checkMonth10Yn.ValueChange (L304) → getCheckMonth()
[E16] checkMonth11Yn.ValueChange (L310) → getCheckMonth()
[E17] checkMonth12Yn.ValueChange (L316) → getCheckMonth()
[E18] anchor.MouseDown (L328) → 인라인 L328-334 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L114-147 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L149-166 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L168-182 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L324-426 | insert,edit,view | 상태 처리 | 업무 |
| private getCheckMonthForm() | L428-464 | getEditor | 상태 처리 | 업무 |
| public update() | L466-511 | E3 | 서비스 tdm.Tdm43_Manl.modelUpdate(relateIcsList, relateIcrList, relateFormList, relateDcrList) | 업무 |
| private setCheckMonthBox() | L513-582 | E5 | 상태 처리 | 업무 |
| private getCheckMonth() | L584-601 | E6,E7,E8,E9,E10,E11,E12,E13,E14,E15,E16,E17,setCheckMonthBox | 상태 처리 | 업무 |
| private lookupExctDuty() | L603-620 | E1 | 조회창 Tdm43_Lookup_ExctDuty 열기 | 업무 |
| private settings() | L197-322 | 생성자 | 서비스 yyyy.MM.dd, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=DateTimeFormat.getFormat("yyyy.MM.dd"("사용시작일"), checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L622-624 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L625-627 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L628-630 | getCheckMonthForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L631-633 | insert,edit,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L634-636 | getCheckMonthForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 서비스 yyyy.MM.dd */}>미사용</Button>

### Tdm43_Page_Relate (`client/vi/tdm/Tdm43_Page_Relate.java`, 774줄)

- 툴바 `buttonBar`: {insertButton}
- 입력·하위 화면: `relateRefBasisArea` TextArea, `lookupIcs` Ics01_Lookup_ClassTreeDetail, `lookupIcr` Icr01_Lookup_ClassTreeDetail, `lookupForm` Sys10_Lookup_FileViewer, `lookup` Ics01_Lookup_SelectMulti
- 그리드 `relateIcsGrid` (buildRelateIcsGrid()):
  - icsClassTreeName 350 "법규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateIcrGrid` (buildRelateIcrGrid()):
  - icrClassTreeName 350 "내규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateFormGrid` (buildRelateFormGrid()):
  - fileName 350 "파일명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateDcrGrid` (buildRelateDcrGrid()):
  - dcrClassTreeFullName 450 "문서분류명" TextArea
  - actionCell 35 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L90-121) → settings()
[E1] plainTabPanel.Selection [arg0 != null] (L163) → buttonSettings()
[E2] insertButton[추가].Select (L181) → insert()
[E3] relateIcsGrid.getStore().StoreAdd (L189) → clearPanel()
[E4] relateIcsGrid.getStore().StoreRemove (L195) → clearPanel()
[E5] relateIcrGrid.getStore().StoreAdd (L203) → clearPanel()
[E6] relateIcrGrid.getStore().StoreRemove (L209) → clearPanel()
[E7] relateFormGrid.getStore().StoreAdd (L217) → clearPanel()
[E8] relateFormGrid.getStore().StoreRemove (L223) → clearPanel()
[E9] relateDcrGrid.getStore().StoreAdd (L231) → clearPanel()
[E10] relateDcrGrid.getStore().StoreRemove (L237) → clearPanel()
[E11] messageBox.DialogHide [YES] (L380) → 서비스 tdm.Tdm45_ManlRelateIcs.delete
[E12] messageBox.DialogHide [YES] (L416) → 서비스 tdm.Tdm46_ManlRelateIcr.delete
[E13] messageBox.DialogHide [YES] (L452) → 서비스 sys.Sys11_RelateFile.delete
[E14] messageBox.DialogHide [YES] (L481) → 서비스 tdm.Tdm47_ManlRelateDcr.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public updateYn() | L123-125 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonSettings() | L127-135 | E1,settings | 상태 처리 | 업무 |
| private setGridColumn() | L137-157 | buttonSettings | 상태 처리 | 업무 |
| private insert() | L245-255 | E2 | 상태 처리 | 업무 |
| public retrieve() | L257-265 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveRelateIcsGrid() | L268-277 | retrieve | 서비스 tdm.Tdm45_ManlRelateIcs.selectByManlId(manlId) | 업무 |
| public retrieveRelateIcrGrid() | L280-289 | retrieve | 서비스 tdm.Tdm46_ManlRelateIcr.selectByManlId(manlId) | 업무 |
| public retrieveRelateFormGrid() | L292-301 | retrieve | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| public retrieveRelateDcrGrid() | L304-313 | retrieve | 서비스 tdm.Tdm47_ManlRelateDcr.selectByManlId(manlId) | 업무 |
| public inputIcsLine() | L315-326 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcrLine() | L328-339 | 공개 메서드 | 상태 처리 | 업무 |
| public inputFormLine() | L341-352 | 공개 메서드 | 상태 처리 | 업무 |
| public inputDcrLine() | L354-365 | 공개 메서드 | 상태 처리 | 업무 |
| private buildRelateIcsGrid() | L367-401 | 필드 초기화 | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크된 행 목록) | 업무 |
| private buildRelateIcrGrid() | L403-437 | 필드 초기화 | 조회창 Icr01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm46_ManlRelateIcr.delete(체크된 행 목록) | 업무 |
| private buildRelateFormGrid() | L439-473 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private buildRelateDcrGrid() | L475-502 | 필드 초기화 | 확인창 표시, GridDeleteData tdm.Tdm47_ManlRelateDcr.delete(체크된 행 목록) | 업무 |
| public getRelateIcsList() | L505-518 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateIcrList() | L520-533 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateFormList() | L535-548 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateDcrList() | L550-563 | 공개 메서드 | 상태 처리 | 업무 |
| public getRefBasis() | L565-567 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRelateIcsList() | L569-602 | insert | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateIcrList() | L604-637 | insert | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateFormList() | L639-672 | insert | 조회창 Tdm43_Lookup_RelateFormFileList 열기 | 업무 |
| public insertRelateDcrList() | L674-708 | insert | 조회창 Dcr01_Lookup_SelectMulti 열기 | 업무 |
| public clearPanel() | L709-767 | E3,E4,E5,E6,E7,E8,E9,E10,retrieveRelateIcsGrid,retrieveRelateIcrGrid,retrieveRelateFormGrid,retrieveRelateDcrGrid | 상태 처리 | 업무 |
| private specialCharacters() | L769-773 | clearPanel | 상태 처리 | 업무 |
| private settings() | L159-243 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildRelateIcsGrid = () => [
  gb.text('icsClassTreeNm', 350, '법규명'),  // L396 SQL 계산 컬럼(selectByManlId: ics01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L397) addCell
  // ⚠ 대응 없음 (GridBuilder L398) addCell
];

const buildRelateIcrGrid = () => [
  gb.text('icrClassTreeNm', 350, '내규명'),  // L432 SQL 계산 컬럼(selectByManlId: icr01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L433) addCell
  // ⚠ 대응 없음 (GridBuilder L434) addCell
];

const buildRelateFormGrid = () => [
  gb.text('fileNm', 350, '파일명'),  // L468 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L469) addCell
  // ⚠ 대응 없음 (GridBuilder L470) addCell
];

const buildRelateDcrGrid = () => [
  gb.textArea('dcrClassTreeFNm', 450, '문서분류명'),  // L498 SQL 계산 컬럼(selectByManlId: f_class_tree_nm_allpath(tdm47_dcr_class…)
  // ⚠ 대응 없음 (GridBuilder L499) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>추가</Button>

### Tdm43_Lookup_RelateFormFileList (`client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`, 203줄)

- 툴바 `buttonBar`: 구분: {typeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `typeComboBox` ComboBoxField("TdmCheckFormType", "%", "전체", "전체"), `searchText` TextField 빈칸="파일명/비고"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - tdmCheckFormTypeName 200 "구분" Text
  - fileName 500 "파일명" Text
  - note 200 "비고" Text
  - regDate 100 "등록일" Date
  - actionCell 70 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-69) → 초기화
[E1] typeComboBox[TdmCheckFormType].Collapse (L101) → retrieve()
[E2] searchText.KeyPress [Enter] (L110) → retrieve()
[E3] retrieveButton[조회].Select (L121) → retrieve()
[E4] confirmButton[확인].Select (L127) → confirm()
[E5] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | buildGrid,retrieve | 상태 처리 | 업무 |
| public open() | L71-97 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L99-139 | open | 상태 처리 | 업무 |
| private retrieve() | L166-180 | E1,E2,E3,execute | 서비스 sys.Sys10_File.selectUnConnTdmFormFile(companyId, tdmCheckFormType, searchText, relateId) | 업무 |
| private confirm() | L182-194 | E4 | 미선택 시 alert "선택한 파일이 없습니다" | 업무 |
| private buildGrid() | L141-164 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L199-201 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('tdmCheckFormTypeNm', 200, '구분'),  // L157 SQL 계산 컬럼(selectUnConnTdmFormFile: f_cdnm('TdmCheckFormType', sys10_tdm_ch…)
  gb.text('fileNm', 500, '파일명'),  // L158
  gb.text('note', 200, '비고'),  // L159
  gb.date('regDate', 100, '등록일'),  // L160
  // ⚠ 대응 없음 (GridBuilder L161) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Lookup_ExctDuty (`client/vi/tdm/Tdm43_Lookup_ExctDuty.java`, 239줄)

- 입력·하위 화면: `checkBox01` CheckBox, `checkBox02` CheckBox, `checkBox03` CheckBox, `checkBox04` CheckBox, `checkBox05` CheckBox, `checkBox06` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L83-148) → show()
[E1] selectButton[선택완료].Select (L120) → select()
[E2] closeButton[닫기].Select (L126) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-43 | 공개 메서드 | 상태 처리 | 업무 |
| private checkBox() | L45-81 | open | 상태 처리 | 업무 |
| public select() | L150-234 | E1 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={select}>선택완료</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Lookup_ManlItemRegList2 (`client/vi/tdm/Tdm43_Lookup_ManlItemRegList2.java`, 369줄)

- 툴바 `buttonBar`: 기준일: {stdDate} {allYn} 직책: {roleLookup} 책무: {taskLookup} 부서: {orgLookup} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `allYn` CheckBox, `searchText` TextField 빈칸="책무/책무세부/관리의무/부서", `roleLookup` LookupTriggerField 빈칸="전체", `taskLookup` LookupTriggerField 빈칸="전체", `orgLookup` LookupTriggerField 빈칸="전체", `lookup` Tdm20_Lookup_SelectRole
- 그리드 `grid01` (buildGrid01(), 체크박스(다중)):
  - taskName 300 "책무" Text
  - taskRelateDetailName 350 "책무세부" TextArea
  - taskRelateDutyName 450 "주요관리의무" TextArea
  - roleName 150 "직책" Text
  - orgName 150 "부서" Text
  - applyStartDate 90 "사용시작일" Date
  - applyEndDate 90 "사용종료일" Date
  - jobName 200 "매뉴얼작업명" Text
- 그리드 `grid02` (buildGrid02()):
  - manlCode 80 "코드" TextCenter
  - checkItem 900 "점검항목" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L77-83) → 초기화
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L153) → retrieve01()
[E2] roleLookup.TriggerClick [result != null] (L168) → retrieve01()
[E3] taskLookup.TriggerClick [result != null] (L192) → retrieve01()
[E4] orgLookup.TriggerClick [result != null] (L216) → retrieve01()
[E5] searchText.KeyPress [Enter] (L239) → retrieve01()
[E6] retrieveButton[조회].Select (L248) → retrieve01()
[E7] grid01.SelectionChanged [selectModel != null] (L254) → retrieve02()
[E8] updateButton[확인].Select (L264) → confirm()
[E9] closeButton[닫기].Select (L270) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L85-145 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid01() | L278-293 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid02() | L295-303 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve01() | L305-328 | E1,E2,E3,E4,E5,E6,open | 서비스 tdm.Tdm43_Manl.selectByManlJobId(companyId, manlJobId, stdRoleId, stdOrgId, roleId, taskId, orgId, stdDate, allYn, searchText) | 업무 |
| public retrieve02() | L330-344 | E7 | 서비스 tdm.Tdm43_Manl.selectByTaskRelateDutyId(manlOrgId, taskRelateDutyId) | 업무 |
| public confirm() | L346-357 | E8 | 상태 처리 | 업무 |
| private settings() | L147-276 | open | 조회창 Tdm20_Lookup_SelectRole 열기, 조회창 Tdm10_Lookup_SelectSingle 열기, 조회창 Org00_Lookup_SelectTdm 열기, 이벤트 연결, 초기값: stdDate=LoginUser.getToday(, allYn=false("전체보기"), roleLookup=resultModel.getRoleName(, roleLookup=null, taskLookup=resultModel.getTaskName(, taskLookup=null, orgLookup=orgModel.getKorName(, orgLookup=null | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L359-361 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L362-364 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L366-368 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('taskNm', 300, '책무'),  // L283
  gb.textArea('taskRelateDetailNm', 350, '책무세부'),  // L284
  gb.textArea('taskRelateDutyNm', 450, '주요관리의무'),  // L285
  gb.text('roleNm', 150, '직책'),  // L286
  gb.text('orgNm', 150, '부서'),  // L287
  gb.date('applyStartDate', 90, '사용시작일'),  // L288
  gb.date('applyEndDate', 90, '사용종료일'),  // L289
  gb.text('jobNm', 200, '매뉴얼작업명'),  // L290
];

const buildGrid02 = () => [
  gb.textCenter('manlCd', 80, '코드'),  // L299
  gb.textArea('checkItem', 900, '점검항목'),  // L300
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve01}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm40_Lookup_SelectSingle (`client/vi/tdm/Tdm40_Lookup_SelectSingle.java`, 185줄)

- 툴바 `buttonBar`: 검색: {searchText} {writingYn} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="매뉴얼작업명/직책", `writingYn` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - jobName 300 "매뉴얼작업명" Text
  - roleName 200 "직책" Text
  - manlApplyStartDate 100 "매뉴얼<br>적용시작일" Date
  - startDate 100 "작성시작일" Date
  - endDate 100 "작성마감일" Date
  - dutyCntStr 100 "작성현황" TextCenter
  - dutyEndYn 90 "완료여부" BooleanYn2
  - dutyEndDate 100 "완료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L64-91) → settings(), show()
[E1] searchText.KeyPress [Enter] (L96) → retrieve()
[E2] grid.CellDoubleClick (L106) → confirm()
[E3] retrieveButton[조회].Select (L112) → retrieve()
[E4] updateButton[확인].Select (L118) → confirm()
[E5] closeButton[닫기].Select (L124) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L52-62 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L147-162 | E1,E3,open | 서비스 tdm.Tdm40_ManlJob.selectByText(companyId, orgId, searchText, writingYn, checkYn) | 업무 |
| public confirm() | L164-172 | E2,E4 | 미선택 시 alert "선택된 매뉴얼이 없습니다" | 업무 |
| private settings() | L93-130 | 생성자 | 이벤트 연결, 초기값: writingYn=true("작성중만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L132-145 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L182-184 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('jobNm', 300, '매뉴얼작업명'),  // L135
  gb.text('roleNm', 200, '직책'),  // L136 SQL 계산 컬럼(selectByText: tdm20_role_nm)
  gb.date('manlApplyStartDate', 100, '매뉴얼<br>적용시작일'),  // L137
  gb.date('startDate', 100, '작성시작일'),  // L138
  gb.date('endDate', 100, '작성마감일'),  // L139
  gb.textCenter('dutyCntStr', 100, '작성현황'),  // L140 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_manl_job_id IS NULL THE…)
  gb.booleanYn2('dutyEndYn', 90, '완료여부'),  // L141 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_end_cnt = tdm41_org_cnt…)
  gb.date('dutyEndDate', 100, '완료일'),  // L142 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_end_cnt = tdm41_org_cnt…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm20_Lookup_SelectRole (`client/vi/tdm/Tdm20_Lookup_SelectRole.java`, 225줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책"
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 420 "직책" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-65) → 초기화
[E1] searchText.KeyPress [Enter] (L130) → retrieve()
[E2] grid.CellDoubleClick (L138) → confirm()
[E3] retrieveButton[조회].Select (L144) → retrieve()
[E4] updateButton[확인].Select (L150) → confirm()
[E5] closeButton[닫기].Select (L156) → hide()
[E6] allButton[전체].Select (L162) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAll() | L67-70 | 공개 메서드 | 상태 처리 | 업무 |
| public openAll() | L72-78 | 공개 메서드 | 상태 처리 | 업무 |
| public openTarget() | L80-88 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L90-120 | openAll,openTarget | 상태 처리 | 업무 |
| public retrieve() | L179-206 | E1,E3,open | 서비스 tdm.Tdm20_Role.selectCheckTargetRole, tdm.Tdm20_Role.selectByDate(companyId, searchText, checkYm, personId, baseDate, orgId) | 업무 |
| public confirm() | L208-216 | E2,E4 | 미선택 시 alert "선택된 직책이 없습니다" | 업무 |
| private settings() | L122-169 | open | 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L171-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L218-220 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L222-224 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 420, '직책'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>

### Tdm10_Lookup_SelectSingle (`client/vi/tdm/Tdm10_Lookup_SelectSingle.java`, 203줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 책무구분: {taskClassComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="책무유형/책무", `taskClassComboBox` ComboBoxField("TdmTaskClassCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - taskClassName 120 "책무구분" Text
  - taskName 550 "책무" Text

#### 이벤트
[E0] 화면 열림 (생성자 L66-98) → settings(), show()
[E1] taskClassComboBox[TdmTaskClassCode].Collapse (L107) → retrieve()
[E2] searchText.KeyPress [Enter] (L116) → retrieve()
[E3] grid.CellDoubleClick (L124) → confirm()
[E4] retrieveButton[조회].Select (L130) → retrieve()
[E5] confirmButton[확인].Select (L136) → confirm()
[E6] allButton[전체].Select [callback != null] (L142) → hide()
[E7] closeButton[닫기].Select (L151) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L48-51 | retrieve | 상태 처리 | 업무 |
| public open() | L61-64 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L168-182 | E1,E2,E4,execute,open | 서비스 tdm.Tdm10_Task.selectByText(companyId, baseDate, taskClassCode, searchText) | 업무 |
| public confirm() | L184-194 | E3,E5 | 미선택 시 alert "선택된 책무가 없습니다" | 업무 |
| private settings() | L100-157 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L159-166 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('taskClassNm', 120, '책무구분'),  // L162
  gb.text('taskNm', 550, '책무'),  // L163
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

