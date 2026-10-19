# Tdm51_Tab_CheckOrg

- 종류: 화면
- 메뉴: 책무 > 04. 책무이행점검 > 업무점검자 지정 및 승인요청 (#1456)
- 파일: `client/vi/tdm/Tdm51_Tab_CheckOrg.java`
- 함께 쓰는 클래스 9개:
  - `Tdm55_Lookup_ChckRecord` `client/vi/tdm/Tdm55_Lookup_ChckRecord.java`
  - `Tdm51_TabPage_CheckOrg` `client/vi/tdm/Tdm51_TabPage_CheckOrg.java`
  - `Tdm58_Lookup_ChckApprStep` `client/vi/tdm/Tdm58_Lookup_ChckApprStep.java`
  - `Tdm52_Edit_ChckManl` `client/vi/tdm/Tdm52_Edit_ChckManl.java`
  - `Tdm54_Edit_ChckInsuff` `client/vi/tdm/Tdm54_Edit_ChckInsuff.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
  - `Tdm00_Lookup_RelateAppr` `client/vi/tdm/Tdm00_Lookup_RelateAppr.java`
  - `Tdm08_Lookup_ManagerInfo` `client/vi/tdm/Tdm08_Lookup_ManagerInfo.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md), [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Emp00_Lookup_SelectSingleTdm`](../../emp/components/Emp00_Lookup_SelectSingleTdm.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Org00_Lookup_SelectTdm`](../../org/components/Org00_Lookup_SelectTdm.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm52_Edit_ChckManl:174 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm08_ManagerInfo.checkIsManager` | Tdm51_Tab_CheckOrg:197 | [`Tdm08_ManagerInfo.java:42`](../../tdm/services/Tdm08_ManagerInfo.md) | [`tdm08_manager_info.checkIsManager`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm08_ManagerInfo.delete` | Tdm08_Lookup_ManagerInfo:231 | [`Tdm08_ManagerInfo.java:56`](../../tdm/services/Tdm08_ManagerInfo.md) | `UpdateDataModel(tdm08_manager_info)` 동적 DELETE |
| `tdm.Tdm08_ManagerInfo.selectByManagerType` | Tdm08_Lookup_ManagerInfo:166 | [`Tdm08_ManagerInfo.java:32`](../../tdm/services/Tdm08_ManagerInfo.md) | [`tdm08_manager_info.selectByManagerType`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm08_ManagerInfo.update` | Tdm08_Lookup_ManagerInfo:245 | [`Tdm08_ManagerInfo.java:51`](../../tdm/services/Tdm08_ManagerInfo.md) | `UpdateDataModel(tdm08_manager_info)` 동적 INSERT/UPDATE → [`tdm08_manager_info.selectById`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm43_Manl.selectById` | Tdm52_Edit_ChckManl:142 | [`Tdm43_Manl.java:20`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm50_ChckJob.selectByCheckYm` | Tdm51_Tab_CheckOrg:397 | [`Tdm50_ChckJob.java:30`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.selectByCheckYm`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm51_ChckOrg.selectByOrgId` | Tdm51_Tab_CheckOrg:324 | [`Tdm51_ChckOrg.java:29`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectByOrgId`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm51_ChckOrg.updateApprStatus` | Tdm51_Tab_CheckOrg:357 | [`Tdm51_ChckOrg.java:173`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.selectByCheckStatusCode`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.selectApprTarget`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.updateStatusCode2`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm58_chck_appr_step.selectApprStep`](../../tdm/sql/tdm58_chck_appr_step.md), [`tdm59_chck_appr_cmnt.selectByApprOrgId`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateApprStatus`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateApprStatusBySubCheckOrg`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm60_chck_manl_appr.updateApprStatusByChckOrgId`](../../tdm/sql/tdm60_chck_manl_appr.md), [`tdm61_chck_insuff_appr.deleteByChckInsuffId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm61_chck_insuff_appr.deleteByChckOrgId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm61_chck_insuff_appr.insertByTdm58`](../../tdm/sql/tdm61_chck_insuff_appr.md) |
| `tdm.Tdm51_ChckOrg.updateFix` | Tdm51_TabPage_CheckOrg:411 | [`Tdm51_ChckOrg.java:103`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm52_chck_manl.countCheckerIdIsNull`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateCheckStatusByChckOrgId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm58_chck_appr_step.checkLastApprEmp`](../../tdm/sql/tdm58_chck_appr_step.md), [`tdm59_chck_appr_cmnt.createTdm59`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm60_chck_manl_appr.deleteByChckOrgId`](../../tdm/sql/tdm60_chck_manl_appr.md), [`tdm60_chck_manl_appr.insertByTdm58`](../../tdm/sql/tdm60_chck_manl_appr.md) |
| `tdm.Tdm52_ChckManl.getBotCheckCmnt` | Tdm52_Edit_ChckManl:467 | [`Tdm52_ChckManl.java:550`](../../tdm/services/Tdm52_ChckManl.md) | - |
| `tdm.Tdm52_ChckManl.modelUpdate` | Tdm52_Edit_ChckManl:325 | [`Tdm52_ChckManl.java:588`](../../tdm/services/Tdm52_ChckManl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm52_chck_manl)` 동적 INSERT/UPDATE → [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectByChckOrgId` | Tdm51_TabPage_CheckOrg:320 | [`Tdm52_ChckManl.java:41`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectByChckOrgId`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectById` | Tdm52_Edit_ChckManl:410 | [`Tdm52_ChckManl.java:30`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.updateCheckerId` | Tdm51_TabPage_CheckOrg:394 | [`Tdm52_ChckManl.java:76`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.updateCheckerId`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.updateComplete` | Tdm52_Edit_ChckManl:366 | [`Tdm52_ChckManl.java:203`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.countEvidFile`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.deleteById`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm59_chck_appr_cmnt.selectByChckManlId`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm61_chck_insuff_appr.deleteByChckManlId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm91_company_setup.selectByDate`](../../tdm/sql/tdm91_company_setup.md) |
| `tdm.Tdm54_ChckInsuff.modelUpdate` | Tdm54_Edit_ChckInsuff:227 | [`Tdm54_ChckInsuff.java:54`](../../tdm/services/Tdm54_ChckInsuff.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE → [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectByChckManlId` | Tdm54_Edit_ChckInsuff:91 | [`Tdm54_ChckInsuff.java:28`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm55_ChckRecord.selectByChckOrgId` | Tdm55_Lookup_ChckRecord:114 | [`Tdm55_ChckRecord.java:27`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByChckOrgId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByInsuffId` | Tdm55_Lookup_ChckRecord:118 | [`Tdm55_ChckRecord.java:33`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByInsuffId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByRelateId` | Tdm55_Lookup_ChckRecord:122 | [`Tdm55_ChckRecord.java:21`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByRelateId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm58_ChckApprStep.delete` | Tdm58_Lookup_ChckApprStep:349 | [`Tdm58_ChckApprStep.java:37`](../../tdm/services/Tdm58_ChckApprStep.md) | `UpdateDataModel(tdm58_chck_appr_step)` 동적 DELETE |
| `tdm.Tdm58_ChckApprStep.selectByChckOrgId` | Tdm58_Lookup_ChckApprStep:203 | [`Tdm58_ChckApprStep.java:22`](../../tdm/services/Tdm58_ChckApprStep.md) | [`tdm58_chck_appr_step.selectByChckOrgId`](../../tdm/sql/tdm58_chck_appr_step.md) |
| `tdm.Tdm58_ChckApprStep.update` | Tdm58_Lookup_ChckApprStep:269 | [`Tdm58_ChckApprStep.java:27`](../../tdm/services/Tdm58_ChckApprStep.md) | `UpdateDataModel(tdm58_chck_appr_step)` 동적 INSERT/UPDATE → [`tdm58_chck_appr_step.selectById`](../../tdm/sql/tdm58_chck_appr_step.md) |
| `tdm.Tdm64_ChckEvidExtr.delete` | Tdm00_Lookup_RelateAppr:226 | [`Tdm64_ChckEvidExtr.java:31`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 DELETE |
| `tdm.Tdm64_ChckEvidExtr.selectByTargetId` | Tdm00_Lookup_RelateAppr:160 | [`Tdm64_ChckEvidExtr.java:21`](../../tdm/services/Tdm64_ChckEvidExtr.md) | [`tdm64_chck_evid_extr.selectByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm64_ChckEvidExtr.update` | Tdm00_Lookup_RelateAppr:202 | [`Tdm64_ChckEvidExtr.java:26`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 INSERT/UPDATE → [`tdm64_chck_evid_extr.selectById`](../../tdm/sql/tdm64_chck_evid_extr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md), [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_create_tdm59`, `f_emp_kor_nm`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm51_Tab_CheckOrg (`client/vi/tdm/Tdm51_Tab_CheckOrg.java`, 460줄)

- 레이아웃: north=vlc, center=tabPage
- 툴바 `buttonBar01`: 점검년월: {quickMoveField} 부서: {orgLookup} {retrieveButton} {noticeEndDate}
- 툴바 `buttonBar02`: {managerButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `orgLookup` LookupTriggerField, `tabPage` Tdm51_TabPage_CheckOrg, `lookup` Org00_Lookup_SelectTdm
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - roleName 200 "직책" Text
  - exctName 80 "임원" TextCenter
  - taskCnt 80 "책무" LongCnt 편집:"404040"
  - detailCnt 80 "책무세부" LongCnt 편집:"404040"
  - dutyCnt 80 "괸리의무" LongCnt 편집:"404040"
  - manlCnt 80 "점검항목" LongCnt 편집:"404040"
  - monthManlCnt 80 "당월대상" LongCnt 편집:"404040"
  - monthCheckCnt 80 "점검건수" LongCnt 편집:"456EA6"
  - monthCheck1Cnt 80 "적정" LongCnt 편집:"456EA6"
  - monthCheck2Cnt 80 "미흡" LongCnt 편집:"456EA6"
  - monthCheck9Cnt 80 "해당없음" LongCnt 편집:"456EA6"
  - insuffCnt 80 "진행중 또는<br>완료된<br>미흡/개선" LongCnt 편집:"404040"
  - checkEndYn 80 "점검<br>완료" BooleanYn2
  - actionCell 80 "승인요청" Cell 편집:actionCell01
  - actionCell 80 "요청취소" Cell 편집:actionCell02
  - orgStatusName 100 "승인상태" TextStatus
  - actionCell 80 "승인이력" Cell 편집:actionCell03

#### 이벤트
[E0] 화면 열림 (생성자 L91-132) → settings()
[E1] orgLookup.TriggerClick (L148) → execute(), retrieve()
[E2] retrieveButton[조회].Select (L167) → retrieve()
[E3] managerButton[부서책무담당자 관리].Select (L173) → execute()
[E4] grid.SelectionChanged [선택>0] (L185) → retrieveTabPage()
[E5] messageBox.DialogHide (L353) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L58-61 | E1,E3,buildGrid,retrieve | 상태 처리 | 업무 |
| public execute() | L65-68 | E1,E3,buildGrid,retrieve | 상태 처리 | 업무 |
| public execute() | L86-88 | E1,E3,buildGrid,retrieve | 상태 처리 | 업무 |
| private setIsManager() | L195-214 | settings | 서비스 tdm.Tdm08_ManagerInfo.checkIsManager(companyId, personId, stdDate) | 업무 |
| public retrieve() | L312-335 | E1,E2,E5,execute | 서비스 tdm.Tdm51_ChckOrg.selectByOrgId(companyId, stdDate, checkYm, orgId) | 업무 |
| private retrieveTabPage() | L337-343 | E4 | 상태 처리 | 업무 |
| private requestAppr() | L345-387 | buildGrid | 확인창 표시, 서비스 tdm.Tdm51_ChckOrg.updateApprStatus(stdDate, personId, actionType) | 업무 |
| private setCheckEndInfo() | L389-427 | retrieve | 서비스 tdm.Tdm50_ChckJob.selectByCheckYm(companyId, checkYm, stdDate) | 업무 |
| private setNoticeStyle() | L456-459 | settings,setCheckEndInfo | 상태 처리 | 업무 |
| private settings() | L134-193 | 생성자 | 조회창 Org00_Lookup_SelectTdm 열기, 조회창 Tdm08_Lookup_ManagerInfo 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L216-310 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord 열기, 미선택 시 alert "점검이 완료되지 않았습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L446-449 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L450-452 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L453-455 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L284 newHeaderGroupMap03newHeaderGroupConfigsetHtmlGridStyle15 100 "항목수" (tdm51_new_header_group_map03new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L285 newHeaderGroupMap08newHeaderGroupConfigsetHtmlGridStyle14 100 "당월  이행점검결과" (tdm51_new_header_group_map08new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L286 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle14 100 "승인정보" (tdm51_new_header_group_map014new_header_group_configset_html_grid_style14 컬럼 없음)
  gb.text('roleNm', 200, '직책'),  // L287 SQL 계산 컬럼(selectByOrgId: tdm20_role_nm)
  gb.textCenter('exctNm', 80, '임원'),  // L288 SQL 계산 컬럼(selectByOrgId: f_emp_kor_nm(tdm51_exct_id))
  // ⚠ 대응 없음 (GridBuilder L290) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L291) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L292) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L293) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L294) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L296) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L297) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L298) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L299) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L301) addLongCnt
  gb.booleanYn2('checkEndYn', 80, '점검<br>완료'),  // L302 SQL 계산 컬럼(selectByOrgId: CASE WHEN month_manl_cnt = 0 THEN false…)
  // ⚠ 대응 없음 (GridBuilder L304) addCell
  // ⚠ 대응 없음 (GridBuilder L305) addCell
  gb.textStatus('orgStatusNm', 100, '승인상태'),  // L306 SQL 계산 컬럼(selectByOrgId: f_cdnm('TdmCheckStatus', tdm51_org_stat…)
  // ⚠ 대응 없음 (GridBuilder L307) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={execute}>부서책무담당자 관리</Button>

### Tdm55_Lookup_ChckRecord (`client/vi/tdm/Tdm55_Lookup_ChckRecord.java`, 141줄)

- 툴바 `buttonBar`: * 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요:
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - rowNum 50 " " LongCenter
  - updDateStr 150 "처리일시" TextCenter
  - procType 100 "구분" Text
  - personInfo 200 "처리자" Text
  - procResult 80 "결과" TextCenter
  - resultCmnt 500 "의견" Text

#### 이벤트
[E0] 화면 열림 (생성자 L48-69) → settings(), show()
[E1] grid.CellDoubleClick [cellIndex == 6] (L72) → 인라인 L72-83 (new CellDoubleClickHandler() { @Overr…)
[E2] closeButton[닫기].Select (L85) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L42-46 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L107-132 | open | 서비스 tdm.Tdm55_ChckRecord.selectByChckOrgId, tdm.Tdm55_ChckRecord.selectByInsuffId, tdm.Tdm55_ChckRecord.selectByRelateId(chckOrgId, chckInsuffId, relateId) | 업무 |
| private settings() | L71-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L134-136 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L138-140 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('rowNum', 50, ' '),  // L97 SQL 계산 컬럼(selectByChckOrgId: ROW_NUMBER() OVER(ORDER BY tdm55_upd_da…)
  gb.textCenter('updDateStr', 150, '처리일시'),  // L98 SQL 계산 컬럼(selectByChckOrgId: COALESCE(TO_CHAR(tdm55_upd_date, 'yyyy-…)
  gb.text('procType', 100, '구분'),  // L99
  gb.text('personInfo', 200, '처리자'),  // L100
  gb.textCenter('procResult', 80, '결과'),  // L101
  gb.text('resultCmnt', 500, '의견'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm51_TabPage_CheckOrg (`client/vi/tdm/Tdm51_TabPage_CheckOrg.java`, 465줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {searchText} {unspecCheckBox} {selectAllButton} {selectNoneButton} {selectPersonButton} {lineEditButton} {fixButton} {fixCancelButton}
- 입력·하위 화면: `unspecCheckBox` CheckBox, `searchText` TextField 빈칸="검색어(관리의무/점검항목/점검자) 입력후 엔터", `lookup` Tdm58_Lookup_ChckApprStep, `lookupPerson` LookupTriggerField, `lookupEmp` Emp00_Lookup_SelectSingleTdm

#### 이벤트
[E0] 화면 열림 (생성자 L82-107) → settings()
[E1] searchText.KeyPress [Enter] (L112) → retrieve()
[E2] unspecCheckBox[점검자 미지정만 조회].ValueChange (L123) → retrieve()
[E3] selectAllButton[전체선택].Select (L130) → setGridCheck()
[E4] selectNoneButton[전체해제].Select (L136) → setGridCheck()
[E5] selectPersonButton[점검자일괄지정].Select (L142) → updateCheckerId()
[E6] lineEditButton[승인선].Select (L148) → 메시지 "상단의 직책을 선택하세요"
[E7] fixButton[확정].Select [YES] (L164) → updateFix()
[E8] msgBox.DialogHide [YES] (L174) → updateFix()
[E9] fixCancelButton[확정취소].Select [YES] (L191) → updateFix()
[E10] msgBox.DialogHide [YES] (L206) → updateFix()
[E11] grid.RowClick [selectModel.getSelectYn()] (L223) → 인라인 L223-239 (new RowClickHandler() { @Override pub…)
[E12] lookupPerson.TriggerClick (L259) → lookupPerson()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGridCheck() | L242-254 | E3,E4 | 상태 처리 | 업무 |
| public retrieve() | L305-311 | E1,E2,updateCheckerId | 상태 처리 | 업무 |
| private retrieve() | L313-326 | E1,E2,updateCheckerId | 서비스 tdm.Tdm52_ChckManl.selectByChckOrgId(chckOrgId, unspecYn, searchText) | 업무 |
| public clear() | L328-330 | 공개 메서드 | 상태 처리 | 업무 |
| private updateCheckerId() | L332-368 | E5,lookupPerson | 조회창 Emp00_Lookup_SelectSingleTdm 열기 → 콜백: unmask | 업무 |
| private lookupPerson() | L370-391 | E12 | 조회창 Emp00_Lookup_SelectSingleTdm 열기 | 업무 |
| private updateCheckerId() | L393-408 | E5,lookupPerson | 서비스 tdm.Tdm52_ChckManl.updateCheckerId(personId, personName) | 업무 |
| private updateFix() | L410-436 | E7,E8,E9,E10 | 서비스 tdm.Tdm51_ChckOrg.updateFix(companyId, stdDate, actionType) | 업무 |
| private setButtonEnable() | L438-460 | retrieve | 상태 처리 | 업무 |
| private settings() | L109-240 | 생성자 | 조회창 Tdm58_Lookup_ChckApprStep 열기, 확인창 표시, 이벤트 연결, 초기값: unspecCheckBox=false("점검자 미지정만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L256-303 | 필드 초기화 | 팝업 Tdm52_Edit_ChckManl 열기, 조회창 Tdm55_Lookup_ChckRecord 열기, 미선택 시 alert "점검자 지정이 확정되어 수정할 수 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L462-464 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="addRow" onClick={setGridCheck}>전체선택</Button>
2. <Button type="removeRow" onClick={setGridCheck}>전체해제</Button>
3. <Button type="save" onClick={updateCheckerId}>점검자일괄지정</Button>
4. <Button type="register" onClick={() => /* 메시지 "상단의 직책을 선택하세요" */}>승인선</Button>
5. <Button type="save" onClick={updateFix}>확정</Button>
6. <Button type="cancel" onClick={updateFix}>확정취소</Button>

### Tdm58_Lookup_ChckApprStep (`client/vi/tdm/Tdm58_Lookup_ChckApprStep.java`, 355줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 행번호숨김, 체크박스(다중)):
  - apprStepInfo 120 "구분" TextCenter
  - apprEmpName 80 "성명" TextFixCenter
  - apprOrgName 200 "부서명" TextFix
  - actionCell 70 "위로" Cell 편집:upButton
  - actionCell 70 "아래로" Cell 편집:downButton

#### 이벤트
[E0] 화면 열림 (생성자 L95-121) → settings()
[E1] retrieveButton[조회].Select (L124) → retrieve()
[E2] insertButton[등록].Select (L130) → insertRow()
[E3] updateButton[저장].Select (L136) → update()
[E4] deleteButton[삭제].Select (L142) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L329) → deleteRow()
[E5] closeButton[닫기].Select (L148) → hide()
[E6] messageBox.DialogHide (L153) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L68-81 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L83-86 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L88-93 | view,edit | 상태 처리 | 업무 |
| public retrieve() | L196-209 | E1,open,update | 서비스 tdm.Tdm58_ChckApprStep.selectByChckOrgId(companyId, stdDate, chckOrgId) | 업무 |
| private insertRow() | L211-236 | E2 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private update() | L238-282 | E3 | 서비스 tdm.Tdm58_ChckApprStep.update(updName) | 업무 |
| public changeRow() | L284-314 | buildGrid | 상태 처리 | 업무 |
| public getSeq() | L316-324 | changeRow | 상태 처리 | 업무 |
| private deleteChk() | L326-344 | E4 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L346-350 | E7 | GridDeleteData tdm.Tdm58_ChckApprStep.delete(체크된 행 목록) | 업무 |
| private settings() | L123-168 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L170-194 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L352-354 | view,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('apprStepInfo', 120, '구분'),  // L187 SQL 계산 컬럼(selectByChckOrgId: ROW_NUMBER() OVER(ORDER BY tdm58_appr_s…)
  // ⚠ 대응 없음 (GridBuilder L188) addTextFixCenter
  // ⚠ 대응 없음 (GridBuilder L189) addTextFix
  // ⚠ 대응 없음 (GridBuilder L190) addCell
  // ⚠ 대응 없음 (GridBuilder L191) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm52_Edit_ChckManl (`client/vi/tdm/Tdm52_Edit_ChckManl.java`, 498줄)

- 입력·하위 화면: `checkItem` MyTextArea, `checkCycleInfo` TextField, `checkEvidDocName` MyTextArea, `checkHow` MyTextArea, `checkStatusName` TextField, `checkerName` TextField, `checkDate` MyDateField, `checkResultCode` TextField, `checkCmnt` MyTextArea, `relateList` Tdm43_Page_Relate, `checkResultName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요", `lookup` Tdm54_Edit_ChckInsuff

#### 이벤트
[E0] 화면 열림 (생성자 L83-99) → settings(), show()
[E1] checkResultName[점검결과].Collapse (L177) → 인라인 L177-187 (new CollapseHandler() { @Override pub…)
[E2] planButton[조치계획등록].Select [isReadOnly()] (L190) → isReadOnly()
[E3] botButton[AI].Select (L204) → callBot()
[E4] fileButton[증빙자료(0건)].Select (L212) → lookupFile()
[E5] completeButton[점검완료].Select (L219) → complete()
[E6] cancelButton[완료취소].Select (L225) → complete()
[E7] messageBox.DialogHide (L229) → complete()
[E8] updateButton[저장].Select (L241) → update()
[E9] closeButton[닫기].Select (L247) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L101-114 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L116-130 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L132-155 | view,edit | 서비스 yyyy.MM.dd, tdm.Tdm43_Manl.selectById(manlId) | 업무 |
| private getEditor() | L255-320 | open | 상태 처리 | 업무 |
| private update() | L322-343 | E8 | 서비스 tdm.Tdm52_ChckManl.modelUpdate | 업무 |
| private complete() | L345-398 | E5,E6,E7 | 서비스 tdm.Tdm52_ChckManl.updateComplete(companyId, personId, stdDate, actionType) | 업무 |
| private lookupFile() | L400-424 | E4 | 조회창 Tdm00_Lookup_RelateAppr 열기, 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId) | 업무 |
| private isReadOnly() | L426-433 | E2,lookupFile | 상태 처리 | 업무 |
| private setButton() | L435-456 | open,complete | 상태 처리 | 업무 |
| private callBot() | L458-484 | E3 | 서비스 tdm.Tdm52_ChckManl.getBotCheckCmnt | 업무 |
| private settings() | L157-253 | 생성자 | 팝업 Tdm54_Edit_ChckInsuff 열기, 확인창 표시, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L486-488 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L489-491 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L492-494 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlButtonBarStyle() | L495-497 | view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={lookupFile}>증빙자료(0건)</Button>
2. <Button type="save" onClick={complete}>점검완료</Button>
3. <Button type="cancel" onClick={complete}>완료취소</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="register" onClick={isReadOnly}>조치계획등록</Button>
7. <Button type="register" onClick={callBot}>AI</Button>

### Tdm54_Edit_ChckInsuff (`client/vi/tdm/Tdm54_Edit_ChckInsuff.java`, 263줄)

- 입력·하위 화면: `regDate` MyDateField, `dueDate` MyDateField, `planActionEmpName` LookupTriggerField, `planActionEmpId` LongField, `actionName` TextField, `actionPlan` MyTextArea, `lookup` Emp00_Lookup_SelectSingleTdm

#### 이벤트
[E0] 화면 열림 (생성자 L60-73) → settings(), show()
[E1] planActionEmpName[조치 예정자].TriggerClick [result != null] (L129) → 인라인 L129-147 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[저장].Select (L148) → update()
[E3] closeButton[닫기].Select (L154) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L75-78 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L80-84 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L86-125 | view,edit | 서비스 tdm.Tdm54_ChckInsuff.selectByChckManlId(chckManlId) | 업무 |
| private getEditor() | L162-196 | open | 상태 처리 | 업무 |
| private update() | L198-245 | E2 | 서비스 tdm.Tdm54_ChckInsuff.modelUpdate(personId, stdDate) | 업무 |
| private setReadOnly() | L247-254 | view,edit | 상태 처리 | 업무 |
| private settings() | L127-160 | 생성자 | 조회창 Emp00_Lookup_SelectSingleTdm 열기, 이벤트 연결, 초기값: planActionEmpName=empModel.getKorName(("조치 예정자"), planActionEmpId=empModel.getPersonId(, planActionEmpName=null("조치 예정자"), planActionEmpId=null | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L256-258 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L260-262 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Tdm00_Lookup_RelateAppr (`client/vi/tdm/Tdm00_Lookup_RelateAppr.java`, 245줄)

- 툴바 `extrEvidButtonBar`: ※ 외부보관 증빙자료: {retrieveExtrEvidButton} {insertExtrEvidButton} {updateExtrEvidButton} {deleteExtrEvidButton}
- 그리드 `extrEvidGrid` (extrEvidBuildGrid(), 체크박스(다중)):
  - docNo 100 "문서번호" Text 편집:TextField
  - docName 300 "문서명" Text 편집:TextField
  - docDate 100 "작성일" Date 편집:MyDateField
  - systemName 150 "시스템명" Text 편집:TextField
  - note 200 "비고" Text 편집:TextField
  - actionCell 50 " " Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-73) → setButtonEvent()
[E1] retrieveExtrEvidButton[조회].Select (L76) → retrieveExtrEvid()
[E2] insertExtrEvidButton[등록].Select (L82) → insertExtrEvid()
[E3] updateExtrEvidButton[저장].Select (L88) → updateExtrEvid()
[E4] deleteExtrEvidButton[삭제].Select (L94) → deleteExtrEvid()
       └ [E5] messageBox.DialogHide (L221) → 서비스 tdm.Tdm64_ChckEvidExtr.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setButtonEvent() | L75-100 | 생성자 | 상태 처리 | 업무 |
| private extrEvidBuildGrid() | L102-137 | 필드 초기화 | 미선택 시 alert "변경사항을 먼저 저장후에 이용 가능합니다" | 업무 |
| protected setDisable() | L140-146 | 미사용 후보 | 상태 처리 | 업무 |
| public retrieve() | L149-152 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveExtrEvid() | L154-166 | E1,retrieve | 서비스 tdm.Tdm64_ChckEvidExtr.selectByTargetId(targetId) | 업무 |
| private insertExtrEvid() | L168-174 | E2 | 상태 처리 | 업무 |
| private updateExtrEvid() | L176-211 | E3 | 서비스 tdm.Tdm64_ChckEvidExtr.update | 업무 |
| private deleteExtrEvid() | L213-239 | E4 | 미선택 시 alert "선택한 문서가 없습니다" → 확인창 E5 | 업무 |
| private setHtmlBarNoticeStyleNoSpace() | L241-243 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const extrEvidBuildGrid = () => [
  gb.text('docNo', 100, '문서번호', { editor: 'text' }),  // L126
  gb.text('docNm', 300, '문서명', { editor: 'text' }),  // L127
  gb.date('docDate', 100, '작성일', { editor: 'date' }),  // L128
  gb.text('systemNm', 150, '시스템명', { editor: 'text' }),  // L129
  gb.text('note', 200, '비고', { editor: 'text' }),  // L130
  // ⚠ 대응 없음 (GridBuilder L133) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveExtrEvid}>조회</Button>
2. <Button type="register" onClick={insertExtrEvid}>등록</Button>
3. <Button type="save" onClick={updateExtrEvid}>저장</Button>
4. <Button type="delete" onClick={deleteExtrEvid}>삭제</Button>

### Tdm08_Lookup_ManagerInfo (`client/vi/tdm/Tdm08_Lookup_ManagerInfo.java`, 273줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `lookupPerson` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - endDate 100 "적용종료일" Date 편집:MyDateField
  - personName 100 "성명" TextCenter 편집:lookupPerson
  - posName 100 "직위" TextCenter
  - orgName 250 "본부(부서)" Text

#### 이벤트
[E0] 화면 열림 (생성자 L70-96) → settings()
[E1] insertButton[행 추가].Select (L99) → insertRow()
[E2] deleteButton[행 삭제].Select (L105) → deleteRow()
[E3] updateButton[저장].Select (L111) → update()
[E4] closeButton[닫기].Select (L118) → hide()
[E5] lookupPerson.TriggerClick [result != null] (L129) → 인라인 L129-147 (new TriggerClickHandler() { @Override…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-68 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L159-173 | open | 서비스 tdm.Tdm08_ManagerInfo.selectByManagerType(companyId, orgId, managerType) | 업무 |
| private insertRow() | L175-183 | E1 | 상태 처리 | 업무 |
| private deleteRow() | L185-191 | E2 | 상태 처리 | 업무 |
| private update() | L193-241 | E3 | GridDeleteData tdm.Tdm08_ManagerInfo.delete | 업무 |
| private update2() | L243-246 | update | 서비스 tdm.Tdm08_ManagerInfo.update | 업무 |
| private isDateOverlap() | L248-268 | update | 상태 처리 | 업무 |
| private settings() | L98-124 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L126-157 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L270-272 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L150
  gb.date('endDate', 100, '적용종료일', { editor: 'date' }),  // L151
  gb.textCenter('personNm', 100, '성명'),  // L152 SQL 계산 컬럼(selectByManagerType: emp00_kor_nm)
  gb.textCenter('posNm', 100, '직위'),  // L153 SQL 계산 컬럼(selectByManagerType: f_cdnm('EmpPosCode', emp00_pos_cd, tdm0…)
  gb.text('orgNm', 250, '본부(부서)'),  // L154 SQL 계산 컬럼(selectByManagerType: emp00_org_code_nm)
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

