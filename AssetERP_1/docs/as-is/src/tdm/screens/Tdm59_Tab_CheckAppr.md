# Tdm59_Tab_CheckAppr

- 종류: 화면
- 메뉴: 책무 > 04. 책무이행점검 > 책무이행점검 승인 (#1458)
- 파일: `client/vi/tdm/Tdm59_Tab_CheckAppr.java`
- 함께 쓰는 클래스 14개:
  - `Tdm59_TabPage_CheckAppr` `client/vi/tdm/Tdm59_TabPage_CheckAppr.java`
  - `Tdm55_Lookup_ChckRecord` `client/vi/tdm/Tdm55_Lookup_ChckRecord.java`
  - `Tdm54_Lookup_ChckInsuffCmnt` `client/vi/tdm/Tdm54_Lookup_ChckInsuffCmnt.java`
  - `Tdm52_Edit_ChckManl` `client/vi/tdm/Tdm52_Edit_ChckManl.java`
  - `Tdm54_Edit_ChckInsuff` `client/vi/tdm/Tdm54_Edit_ChckInsuff.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
  - `Tdm00_Lookup_RelateAppr` `client/vi/tdm/Tdm00_Lookup_RelateAppr.java`
  - `Tdm52_Edit_ChckManlCmnt` `client/vi/tdm/Tdm52_Edit_ChckManlCmnt.java`
  - `Tdm59_Edit_ReportCmnt` `client/vi/tdm/Tdm59_Edit_ReportCmnt.java`
  - `Tdm59_Edit_Cmnt` `client/vi/tdm/Tdm59_Edit_Cmnt.java`
  - `Tdm55_Lookup_ChckRecord2` `client/vi/tdm/Tdm55_Lookup_ChckRecord2.java`
  - `Tdm23_Lookup_SelectOrg` `client/vi/tdm/Tdm23_Lookup_SelectOrg.java`
  - `Tdm20_Lookup_SelectRole` `client/vi/tdm/Tdm20_Lookup_SelectRole.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md), [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingleTdm`](../../emp/components/Emp00_Lookup_SelectSingleTdm.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm52_Edit_ChckManl:174 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectRole:193 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectCheckTargetRole` | Tdm20_Lookup_SelectRole:188, Tdm59_Tab_CheckAppr:254 | [`Tdm20_Role.java:38`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectCheckTargetRole`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm23_RoleRelateOrg.selectByRoleId` | Tdm23_Lookup_SelectOrg:179 | [`Tdm23_RoleRelateOrg.java:21`](../../tdm/services/Tdm23_RoleRelateOrg.md) | [`tdm23_role_relate_org.selectByRoleId`](../../tdm/sql/tdm23_role_relate_org.md) |
| `tdm.Tdm43_Manl.selectById` | Tdm52_Edit_ChckManl:142, Tdm52_Edit_ChckManlCmnt:132 | [`Tdm43_Manl.java:20`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm50_ChckJob.selectEndInfoByApprEmpId` | Tdm59_Tab_CheckAppr:506 | [`Tdm50_ChckJob.java:43`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.selectEndInfoByApprEmpId`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm52_ChckManl.countByChckApprCmntId` | Tdm59_Edit_Cmnt:103 | [`Tdm52_ChckManl.java:65`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.countByChckApprCmntId`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.getBotCheckCmnt` | Tdm52_Edit_ChckManl:467 | [`Tdm52_ChckManl.java:550`](../../tdm/services/Tdm52_ChckManl.md) | - |
| `tdm.Tdm52_ChckManl.modelUpdate` | Tdm52_Edit_ChckManl:325 | [`Tdm52_ChckManl.java:588`](../../tdm/services/Tdm52_ChckManl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm52_chck_manl)` 동적 INSERT/UPDATE → [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectByChckApprCmntId` | Tdm59_TabPage_CheckAppr:587 | [`Tdm52_ChckManl.java:46`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectByChckApprCmntId`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectById` | Tdm52_Edit_ChckManl:410, Tdm54_Lookup_ChckInsuffCmnt:192 | [`Tdm52_ChckManl.java:30`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.updateApprStart` | Tdm59_TabPage_CheckAppr:422 | [`Tdm52_ChckManl.java:480`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.updateStatusCode`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm60_chck_manl_appr.updateApprStatusByChckManlId`](../../tdm/sql/tdm60_chck_manl_appr.md), [`tdm61_chck_insuff_appr.updateApprStatusByChckInsuffId`](../../tdm/sql/tdm61_chck_insuff_appr.md) |
| `tdm.Tdm52_ChckManl.updateComplete` | Tdm52_Edit_ChckManl:366 | [`Tdm52_ChckManl.java:203`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.countEvidFile`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.deleteById`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm59_chck_appr_cmnt.selectByChckManlId`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm61_chck_insuff_appr.deleteByChckManlId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm91_company_setup.selectByDate`](../../tdm/sql/tdm91_company_setup.md) |
| `tdm.Tdm54_ChckInsuff.modelUpdate` | Tdm54_Edit_ChckInsuff:227 | [`Tdm54_ChckInsuff.java:54`](../../tdm/services/Tdm54_ChckInsuff.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE → [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectByChckApprCmntId` | Tdm59_TabPage_CheckAppr:655 | [`Tdm54_ChckInsuff.java:38`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectByChckApprCmntId`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectByChckManlId` | Tdm54_Edit_ChckInsuff:91 | [`Tdm54_ChckInsuff.java:28`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectById` | Tdm54_Lookup_ChckInsuffCmnt:139 | [`Tdm54_ChckInsuff.java:23`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm55_ChckRecord.selectByChckApprCmntId` | Tdm55_Lookup_ChckRecord2:176 | [`Tdm55_ChckRecord.java:39`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByChckApprCmntId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByChckOrgId` | Tdm55_Lookup_ChckRecord:114 | [`Tdm55_ChckRecord.java:27`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByChckOrgId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByInsuffId` | Tdm55_Lookup_ChckRecord:118 | [`Tdm55_ChckRecord.java:33`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByInsuffId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByRelateId` | Tdm55_Lookup_ChckRecord:122 | [`Tdm55_ChckRecord.java:21`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByRelateId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm59_ChckApprCmnt.selectByApprEmpId` | Tdm59_Tab_CheckAppr:364 | [`Tdm59_ChckApprCmnt.java:26`](../../tdm/services/Tdm59_ChckApprCmnt.md) | [`tdm59_chck_appr_cmnt.selectByApprEmpId`](../../tdm/sql/tdm59_chck_appr_cmnt.md) |
| `tdm.Tdm59_ChckApprCmnt.selectPreNextOrg` | Tdm59_Tab_CheckAppr:561 | [`Tdm59_ChckApprCmnt.java:31`](../../tdm/services/Tdm59_ChckApprCmnt.md) | [`tdm59_chck_appr_cmnt.selectChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectParent`](../../tdm/sql/tdm59_chck_appr_cmnt.md) |
| `tdm.Tdm59_ChckApprCmnt.updateApprCmnt` | Tdm59_Edit_Cmnt:267, Tdm59_Edit_ReportCmnt:176 | [`Tdm59_ChckApprCmnt.java:53`](../../tdm/services/Tdm59_ChckApprCmnt.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm51_chck_org.selectUnCheckOrg`](../../tdm/sql/tdm51_chck_org.md), [`tdm52_chck_manl.countByChckApprCmntId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.countByChckApprCmntId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm59_chck_appr_cmnt.selectChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectChildApprYn`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateByApprInfo`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateSubmit`](../../tdm/sql/tdm59_chck_appr_cmnt.md) |
| `tdm.Tdm59_ChckApprCmnt.updateSubmit` | Tdm59_Tab_CheckAppr:397 | [`Tdm59_ChckApprCmnt.java:301`](../../tdm/services/Tdm59_ChckApprCmnt.md) | [`tdm53_chck_exct.updateExctApprYn`](../../tdm/sql/tdm53_chck_exct.md), [`tdm59_chck_appr_cmnt.checkTdmSubmitPossibleYn`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.countChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectChild`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.selectParent`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateApprStatus`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm59_chck_appr_cmnt.updateSubmit`](../../tdm/sql/tdm59_chck_appr_cmnt.md) |
| `tdm.Tdm60_ChckManlAppr.updateApprCmnt` | Tdm52_Edit_ChckManlCmnt:341 | [`Tdm60_ChckManlAppr.java:26`](../../tdm/services/Tdm60_ChckManlAppr.md) | [`tdm60_chck_manl_appr.updateById`](../../tdm/sql/tdm60_chck_manl_appr.md) |
| `tdm.Tdm60_ChckManlAppr.updateApprStatus` | Tdm52_Edit_ChckManlCmnt:355 | [`Tdm60_ChckManlAppr.java:39`](../../tdm/services/Tdm60_ChckManlAppr.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm60_chck_manl_appr.updateById`](../../tdm/sql/tdm60_chck_manl_appr.md) |
| `tdm.Tdm60_ChckManlAppr.updateApprStatus2` | Tdm59_TabPage_CheckAppr:557 | [`Tdm60_ChckManlAppr.java:141`](../../tdm/services/Tdm60_ChckManlAppr.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm60_chck_manl_appr.updateById`](../../tdm/sql/tdm60_chck_manl_appr.md) |
| `tdm.Tdm61_ChckInsuffAppr.updateApprCmnt` | Tdm54_Lookup_ChckInsuffCmnt:432 | [`Tdm61_ChckInsuffAppr.java:25`](../../tdm/services/Tdm61_ChckInsuffAppr.md) | [`tdm61_chck_insuff_appr.updateById`](../../tdm/sql/tdm61_chck_insuff_appr.md) |
| `tdm.Tdm61_ChckInsuffAppr.updateApprStatus` | Tdm54_Lookup_ChckInsuffCmnt:447 | [`Tdm61_ChckInsuffAppr.java:38`](../../tdm/services/Tdm61_ChckInsuffAppr.md) | [`tdm54_chck_insuff.updateStatusCode`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm61_chck_insuff_appr.updateById`](../../tdm/sql/tdm61_chck_insuff_appr.md) |
| `tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId` | Tdm54_Lookup_ChckInsuffCmnt:421 | [`Tdm63_ChckInsuffRecord.java:22`](../../tdm/services/Tdm63_ChckInsuffRecord.md) | [`tdm63_chck_insuff_record.selectBychckInsuffId`](../../tdm/sql/tdm63_chck_insuff_record.md) |
| `tdm.Tdm64_ChckEvidExtr.delete` | Tdm00_Lookup_RelateAppr:226 | [`Tdm64_ChckEvidExtr.java:31`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 DELETE |
| `tdm.Tdm64_ChckEvidExtr.selectByTargetId` | Tdm00_Lookup_RelateAppr:160 | [`Tdm64_ChckEvidExtr.java:21`](../../tdm/services/Tdm64_ChckEvidExtr.md) | [`tdm64_chck_evid_extr.selectByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm64_ChckEvidExtr.update` | Tdm00_Lookup_RelateAppr:202 | [`Tdm64_ChckEvidExtr.java:26`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 INSERT/UPDATE → [`tdm64_chck_evid_extr.selectById`](../../tdm/sql/tdm64_chck_evid_extr.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md), [`tdm63_chck_insuff_record`](../../../db/tables/tdm.md), [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_get_tdmsubmitpossibleyn`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getorg`, `getperson`, `getsubtdmorg`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm59_Tab_CheckAppr (`client/vi/tdm/Tdm59_Tab_CheckAppr.java`, 593줄)

- 레이아웃: north=vlc, center=tabPage
- 툴바 `buttonBar`: 점검년월: {quickMoveField} 직책: {roleLookup} {retrieveButton} {submitButton} {submitCanleButton}
- 툴바 `buttonBar2`: {noticeCmnt} {noticeEndDate}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `roleLookup` LookupTriggerField 빈칸="연결된 직책이 없습니다", `tabPage` Tdm59_TabPage_CheckAppr
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - roleName 200 "직책" Text
  - checkOrgName2 200 "검토부서" Text
  - monthCheckCnt 80 "점검<br>항목" LongCnt 편집:"456EA6"
  - monthCheck1Cnt 80 "적정" LongCnt 편집:"456EA6"
  - monthCheck2Cnt 80 "미흡" LongCnt 편집:"456EA6"
  - monthCheck9Cnt 80 "해당없음" LongCnt 편집:"456EA6"
  - insuffUndoneCnt 80 "진행중" LongCnt 편집:"404040"
  - insuffDoneCnt 80 "종료" LongCnt 편집:"404040"
  - checkStatusName 100 "점검상태" TextStatus
  - preApprStatusName 80 "하위부서" TextStatus
  - apprStatusName 80 "My부서" TextStatus
  - nextApprStatusName 80 "상위부서" TextStatus
  - apprButtonEnable 70 "승인의견" DynamicCell 편집:apprCmntCell
  - reportButtonEnable 70 "보고의견" DynamicCell 편집:reportCmntCell
  - actionCell 70 "승인이력" Cell 편집:historyCell

#### 이벤트
[E0] 화면 열림 (생성자 L95-133) → settings()
[E1] roleLookup.TriggerClick (L141) → lookupRole()
[E2] retrieveButton[조회].Select [roleId == null] (L148) → retrieve()
[E3] submitButton[제출].Select (L160) → updateSubmit()
[E4] messageBox.DialogHide (L164) → updateSubmit()
[E5] submitCanleButton[제출취소].Select (L178) → updateSubmit()
[E6] messageBox.DialogHide (L182) → updateSubmit()
[E7] grid.SelectionChanged [선택>0] (L195) → retrieveTabPage()
[E8] grid.CellDoubleClick [cellIndex == 10] (L203) → getCmnt(), execute(), getCmnt(), execute()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L61-64 | E8,lookupRole,buildGrid,retrieve,lookupApprCmnt,lookupReportCmnt | 상태 처리 | 업무 |
| public execute() | L68-71 | E8,lookupRole,buildGrid,retrieve,lookupApprCmnt,lookupReportCmnt | 상태 처리 | 업무 |
| public execute() | L90-92 | E8,lookupRole,buildGrid,retrieve,lookupApprCmnt,lookupReportCmnt | 상태 처리 | 업무 |
| private setInitRoleId() | L253-280 | execute | 서비스 tdm.Tdm20_Role.selectCheckTargetRole(companyId, checkYm, personId) | 업무 |
| private lookupRole() | L282-295 | E1,setInitRoleId | 조회창 Tdm20_Lookup_SelectRole 열기 | 업무 |
| public retrieve() | L344-385 | E2,execute,setInitRoleId,lookupRole,updateSubmit,lookupApprCmnt,lookupReportCmnt | 미선택 시 alert "직책을 선택하세요", 서비스 tdm.Tdm59_ChckApprCmnt.selectByApprEmpId(companyId, checkYm, roleId, personId, stdDate) | 업무 |
| private retrieveTabPage() | L387-394 | E7,retrieve | 상태 처리 | 업무 |
| private updateSubmit() | L396-424 | E3,E4,E5,E6 | 서비스 tdm.Tdm59_ChckApprCmnt.updateSubmit(actionType, updName) | 업무 |
| private lookupApprCmnt() | L426-458 | buildGrid | 팝업 Tdm59_Edit_Cmnt 열기 | 업무 |
| private lookupReportCmnt() | L460-492 | buildGrid | 팝업 Tdm59_Edit_ReportCmnt 열기 | 업무 |
| private setCheckEndInfo() | L494-558 | retrieve | 서비스 tdm.Tdm50_ChckJob.selectEndInfoByApprEmpId(companyId, checkYm, roleId, personId) | 업무 |
| private getCmnt() | L560-573 | E8 | 서비스 tdm.Tdm59_ChckApprCmnt.selectPreNextOrg(targetType, stdDate) | 업무 |
| private setDefaultCheckEndInfo() | L575-577 | settings | 상태 처리 | 업무 |
| private setNoticeStyle() | L589-592 | settings,setCheckEndInfo,setDefaultCheckEndInfo | 상태 처리 | 업무 |
| private settings() | L135-251 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L297-342 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord2 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L579-582 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L583-585 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L586-588 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L321 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle13 100 "이행점검결과" (tdm59_new_header_group_map04new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L322 newHeaderGroupMap07newHeaderGroupConfigsetHtmlGridStyle12 100 "미흡/개선 내역<br>(당월발생건 제외)" (tdm59_new_header_group_map07new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L323 newHeaderGroupMap010newHeaderGroupConfigsetHtmlGridStyle13 100 "의견등록상태" (tdm59_new_header_group_map010new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.text('roleNm', 200, '직책'),  // L325 SQL 계산 컬럼(selectByApprEmpId: tdm20_role_nm)
  gb.text('checkOrgNm2', 200, '검토부서'),  // L326 SQL 계산 컬럼(selectByApprEmpId: CASE WHEN tdm59_cmnt_type = 'SUB' THEN …)
  // ⚠ 대응 없음 (GridBuilder L327) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L328) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L329) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L330) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L331) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L332) addLongCnt
  gb.textStatus('checkStatusNm', 100, '점검상태'),  // L333 SQL 계산 컬럼(selectByApprEmpId: CASE WHEN tdm59_cmnt_type = 'SELF' AND …)
  gb.textStatus('preApprStatusNm', 80, '하위부서'),  // L334 SQL 계산 컬럼(selectByApprEmpId: CASE WHEN tdm59_first_appr_emp_yn THEN …)
  gb.textStatus('apprStatusNm', 80, 'My부서'),  // L335 SQL 계산 컬럼(selectByApprEmpId: CASE WHEN tdm59_appr_status_cd IN ('20'…)
  gb.textStatus('nextApprStatusNm', 80, '상위부서'),  // L336 SQL 계산 컬럼(selectByApprEmpId: CASE WHEN tdm59_final_appr_emp_yn THEN …)
  // ⚠ 대응 없음 (GridBuilder L337) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L338) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L339) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateSubmit}>제출</Button>
3. <Button type="cancel" onClick={updateSubmit}>제출취소</Button>

### Tdm59_TabPage_CheckAppr (`client/vi/tdm/Tdm59_TabPage_CheckAppr.java`, 772줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01L`: ■ 점검상세: {searchText} {checkBoxVlc01} {startButton} {startCancelButton}
- 툴바 `buttonBar01R`: {selectApprButton} {selectCancelButton}
- 툴바 `buttonBar02`: ■ 미흡/개선 내역: {checkBoxVlc02}
- 입력·하위 화면: `noAgreeBox01` CheckBox, `noAgreeBox02` CheckBox, `searchText` TextField 빈칸="검색어(점검부서/점검항목) 입력후 엔터", `lookup` Tdm55_Lookup_ChckRecord
- 그리드 `grid01` (buildGrid01(), 체크박스(다중)):
  - orgName 200 "점검부서" Text
  - commonTypeName 60 "구분" TextCenter
  - checkItem 650 "점검항목" Text
  - checkerName 80 "점검자" TextCenter
  - checkResultName 100 "점검결과" TextStatus
  - checkStatusName 100 "진행상태" TextStatus
  - apprStatusName 80 "승인상태" TextTdmApprStatus
  - actionCell 75 "승인처리" Cell 편집:actionCell01
  - actionCell 70 "승인이력" Cell 편집:actionCell02
- 그리드 `grid02` (buildGrid02()):
  - checkYm 80 "발생년월" TextCenter
  - dueDate 100 "조치예정일" Date
  - actionDate 100 "조치완료일" Date
  - actionEmpInfo 150 "조치(예정)자" Text
  - actionName 550 "조치명" Text
  - statusName 80 "진행상태" TextStatus
  - apprStatusName 80 "승인상태" TextTdmApprStatus
  - actionCell 75 "승인처리" Cell 편집:actionCell01
  - actionCell 75 "승인이력" Cell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L80-128) → settings()
[E1] searchText.KeyPress [Enter] (L134) → retrieve01()
[E2] noAgreeBox01[미승인건만 조회].ValueChange (L145) → retrieve01()
[E3] noAgreeBox02[미승인건만 조회].ValueChange (L154) → retrieve02()
[E4] startButton[승인시작].Select (L162) → apprStart()
[E5] messageBox.DialogHide (L166) → apprStart()
[E6] startCancelButton[승인시작취소].Select (L180) → apprStart()
[E7] messageBox.DialogHide (L184) → apprStart()
[E8] selectApprButton[일괄승인].Select (L198) → preUpdateApprStatus()
       └ [E10] messageBox.DialogHide (L543) → updateApprStatus()
[E9] selectCancelButton[일괄승인취소].Select (L206) → preUpdateApprStatus()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid01() | L214-244 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord 열기 | 업무 |
| public buildGrid02() | L246-284 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord 열기 | 업무 |
| public retrieve() | L286-297 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve01() | L299-316 | E1,E2,retrieve | 서비스 tdm.Tdm52_ChckManl.selectByChckApprCmntId(companyId, personId, stdDate, chckApprCmntId, undoneYn, searchText) | 업무 |
| private retrieve02() | L318-334 | E3,retrieve,lookupCheckApprCmnt | 서비스 tdm.Tdm54_ChckInsuff.selectByChckApprCmntId(companyId, checkYm, chckApprCmntId, undoneYn, stdDate) | 업무 |
| private apprStart() | L336-443 | E4,E5,E6,E7 | 서비스 tdm.Tdm52_ChckManl.updateApprStart(actionType, manlList, insuffList) | 업무 |
| private preUpdateApprStatus() | L445-553 | E8,E9 | ConfirmBox → E10 | 업무 |
| private updateApprStatus() | L555-584 | E10 | 서비스 tdm.Tdm60_ChckManlAppr.updateApprStatus2(actionType, personId, stdDate, updName) | 업무 |
| private getCheckManl() | L586-607 | buildGrid02 | 서비스 tdm.Tdm52_ChckManl.selectByChckApprCmntId(companyId, personId, stdDate, chckApprCmntId, chckManlId) | 업무 |
| private lookupCheckApprCmnt() | L609-670 | buildGrid01,buildGrid02 | 팝업 Tdm52_Edit_ChckManlCmnt 열기, 서비스 tdm.Tdm54_ChckInsuff.selectByChckApprCmntId(chckApprCmntId, chckInsuffId) | 업무 |
| private lookupInsuffApprCmnt() | L672-710 | buildGrid02 | 조회창 Tdm54_Lookup_ChckInsuffCmnt 열기, 미선택 시 alert | 업무 |
| private setButton() | L712-762 | retrieve | 상태 처리 | 업무 |
| public clear() | L764-767 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L130-212 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: noAgreeBox01=false("미승인건만 조회"), noAgreeBox02=false("미승인건만 조회") | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L769-771 | 생성자,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('orgNm', 200, '점검부서'),  // L233 SQL 계산 컬럼(selectByChckApprCmntId: org00_kor_nm)
  gb.textCenter('commonTypeNm', 60, '구분'),  // L234 SQL 계산 컬럼(selectByChckApprCmntId: CASE WHEN tdm10_common_yn = 'true' THEN…)
  gb.text('checkItem', 650, '점검항목'),  // L235 SQL 계산 컬럼(selectByChckApprCmntId: CONCAT('('||tdm43_manl_cd||') ', tdm43_…)
  gb.textCenter('checkerNm', 80, '점검자'),  // L236 SQL 계산 컬럼(selectByChckApprCmntId: f_emp_kor_nm(tdm52_checker_id))
  gb.textStatus('checkResultNm', 100, '점검결과'),  // L237 SQL 계산 컬럼(selectByChckApprCmntId: f_cdnm('TdmCheckResult' , tdm52_check_r…)
  gb.textStatus('checkStatusNm', 100, '진행상태'),  // L238 SQL 계산 컬럼(selectByChckApprCmntId: f_cdnm('TdmCheckStatus' , tdm52_check_s…)
  // ⚠ 대응 없음 (GridBuilder L239) addTextTdmApprStatus
  // ⚠ 대응 없음 (GridBuilder L240) addCell
  // ⚠ 대응 없음 (GridBuilder L241) addCell
];

const buildGrid02 = () => [
  gb.textCenter('checkYm', 80, '발생년월'),  // L272 SQL 계산 컬럼(selectByChckApprCmntId: tdm54_occ_ym)
  gb.date('dueDate', 100, '조치예정일'),  // L273
  gb.date('actionDate', 100, '조치완료일'),  // L274
  gb.text('actionEmpInfo', 150, '조치(예정)자'),  // L275 SQL 계산 컬럼(selectByChckApprCmntId: emp00_kor_nm ||'('||emp00_org_code_nm||…)
  gb.text('actionNm', 550, '조치명'),  // L277
  gb.textStatus('statusNm', 80, '진행상태'),  // L278 SQL 계산 컬럼(selectByChckApprCmntId: f_cdnm('TdmInsuffStatus', curr_status_c…)
  // ⚠ 대응 없음 (GridBuilder L279) addTextTdmApprStatus
  // ⚠ 대응 없음 (GridBuilder L280) addCell
  // ⚠ 대응 없음 (GridBuilder L281) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={apprStart}>승인시작</Button>
2. <Button type="cancel" onClick={apprStart}>승인시작취소</Button>
3. <Button type="save" onClick={preUpdateApprStatus}>일괄승인</Button>
4. <Button type="cancel" onClick={preUpdateApprStatus}>일괄승인취소</Button>

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

### Tdm54_Lookup_ChckInsuffCmnt (`client/vi/tdm/Tdm54_Lookup_ChckInsuffCmnt.java`, 523줄)

- 입력·하위 화면: `regDate` MyDateField, `dueDate` MyDateField, `planRegEmpName` TextField, `planActionEmpName` TextField, `actionName` TextField, `actionPlan` MyTextArea, `statusName` TextField, `actionDate` MyDateField, `actionEmpName` TextField, `orgName` TextField, `actionCmnt` MyTextArea, `apprStatusCode` TextField, `apprStatusName` TextField, `apprCmnt` MyTextArea, `lookup` Tdm52_Edit_ChckManl
- 그리드 `recordGrid` (recordGirdBuilder()):
  - regDate 100 "등록일" Date
  - regEmpName 100 "등록자" TextCenter
  - content 470 "조치내용" TextArea
  - note 420 "비고" TextArea
  - fileCountStr 80 "증빙자료" TextCenter
  - actionCell 30 " " Cell 편집:fileCell

#### 이벤트
[E0] 화면 열림 (생성자 L92-119) → setting(), getEditor(), show()
[E1] manlButton[발생 점검항목 보기].Select (L189) → 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId)
[E2] agreeButton[승인].Select (L208) → updateApprStatus()
[E3] messageBox.DialogHide (L217) → updateApprStatus()
[E4] rejectButton[반려].Select (L229) → updateApprStatus()
[E5] messageBox.DialogHide (L238) → updateApprStatus()
[E6] cancelButton[취소].Select (L250) → updateApprStatus()
[E7] messageBox.DialogHide (L254) → updateApprStatus()
[E8] updateButton[임시저장].Select (L266) → update()
[E9] closeButton[닫기].Select (L272) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L131-149 | 공개 메서드 | 서비스 tdm.Tdm54_ChckInsuff.selectById(chckInsuffId) | 업무 |
| public edit() | L151-161 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L163-171 | view,edit | 상태 처리 | 업무 |
| private setting() | L173-278 | 생성자 | 팝업 Tdm52_Edit_ChckManl 열기, 확인창 표시, 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId) | 업무 |
| private getEditor() | L280-391 | 생성자 | 상태 처리 | 업무 |
| package recordGirdBuilder() | L393-414 | 필드 초기화 | 조회창 Tdm00_Lookup_RelateAppr 열기 | 업무 |
| private retrieveRecord() | L416-427 | open | 서비스 tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId(chckInsuffId) | 업무 |
| private update() | L429-442 | E8 | 서비스 tdm.Tdm61_ChckInsuffAppr.updateApprCmnt | 업무 |
| private updateApprStatus() | L444-476 | E2,E3,E4,E5,E6,E7 | 서비스 tdm.Tdm61_ChckInsuffAppr.updateApprStatus(actionType, personId, stdDate, updName) | 업무 |
| private setButton() | L478-494 | open,updateApprStatus | 상태 처리 | 업무 |
| private titleSetting() | L508-521 | getEditor | 상태 처리 | 업무 |
| private setHtmlStyle() | L496-498 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L500-502 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L504-506 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const recordGirdBuilder = () => [
  gb.date('regDate', 100, '등록일'),  // L406
  gb.textCenter('regEmpNm', 100, '등록자'),  // L407 SQL 계산 컬럼(selectById: f_emp_kor_nm(tdm63_reg_emp_id))
  gb.textArea('content', 470, '조치내용'),  // L408
  gb.textArea('note', 420, '비고'),  // L409
  gb.textCenter('fileCountStr', 80, '증빙자료'),  // L410 SQL 계산 컬럼(selectById: f_get_tdmEvidCount(tdm63_chck_insuff_re…)
  // ⚠ 대응 없음 (GridBuilder L411) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={updateApprStatus}>승인</Button>
2. <Button type="cancel" onClick={updateApprStatus}>반려</Button>
3. <Button type="cancel" onClick={updateApprStatus}>취소</Button>
4. <Button type="unknown" onClick={update}>임시저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="search" onClick={() => /* 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId) */}>발생 점검항목 보기</Button>

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

### Tdm52_Edit_ChckManlCmnt (`client/vi/tdm/Tdm52_Edit_ChckManlCmnt.java`, 420줄)

- 입력·하위 화면: `checkItem` MyTextArea, `checkCycleInfo` TextField, `checkEvidDocName` MyTextArea, `checkHow` MyTextArea, `refBasis` MyTextArea, `checkStatusCode` TextField, `checkStatusName` TextField, `orgName` TextField, `checkerName` TextField, `checkDate` MyDateField, `checkResultName` TextField, `checkCmnt` MyTextArea, `apprStatusCode` TextField, `apprStatusName` TextField, `apprCmnt` MyTextArea, `relateList` Tdm43_Page_Relate, `lookup` Tdm54_Edit_ChckInsuff

#### 이벤트
[E0] 화면 열림 (생성자 L84-102) → settings(), show()
[E1] planButton[미흡조치계획].Select (L166) → 인라인 L166-172 (new SelectHandler(){ @Override public…)
[E2] fileButton[증빙자료(0건)].Select (L175) → 인라인 L175-181 (new SelectHandler() { @Override publi…)
[E3] agreeButton[승인].Select (L182) → updateApprStatus()
[E4] messageBox.DialogHide (L193) → updateApprStatus()
[E5] rejectButton[반려].Select (L205) → updateApprStatus()
[E6] messageBox.DialogHide (L214) → updateApprStatus()
[E7] cancelButton[취소].Select (L226) → updateApprStatus()
[E8] messageBox.DialogHide (L230) → updateApprStatus()
[E9] updateButton[임시저장].Select (L242) → update()
[E10] closeButton[닫기].Select (L248) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L104-114 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L116-125 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L127-145 | view,edit | 서비스 tdm.Tdm43_Manl.selectById(manlId) | 업무 |
| private getEditor() | L256-336 | open | 상태 처리 | 업무 |
| private update() | L338-350 | E9 | 서비스 tdm.Tdm60_ChckManlAppr.updateApprCmnt | 업무 |
| private updateApprStatus() | L352-384 | E3,E4,E5,E6,E7,E8 | 서비스 tdm.Tdm60_ChckManlAppr.updateApprStatus(actionType, personId, stdDate, updName) | 업무 |
| private setButton() | L386-409 | open,updateApprStatus | 상태 처리 | 업무 |
| private settings() | L147-254 | 생성자 | 팝업 Tdm54_Edit_ChckInsuff 열기, 조회창 Tdm00_Lookup_RelateAppr 열기, 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L411-413 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L414-416 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L417-419 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateApprStatus}>승인</Button>
2. <Button type="cancel" onClick={updateApprStatus}>반려</Button>
3. <Button type="cancel" onClick={updateApprStatus}>취소</Button>
4. <Button type="unknown" onClick={update}>임시저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="unknown" onClick={() => /* 인라인 L166-172 (new SelectHandler(){ @Override public…) */}>미흡조치계획</Button>
7. <Button type="unknown" onClick={() => /* 인라인 L175-181 (new SelectHandler() { @Override publi…) */}>증빙자료(0건)</Button>

### Tdm59_Edit_ReportCmnt (`client/vi/tdm/Tdm59_Edit_ReportCmnt.java`, 227줄)

- 입력·하위 화면: `reportCmnt` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L55-70) → settings()
[E1] agreeButton[등록].Select (L106) → updateApprStatus()
[E2] messageBox.DialogHide (L115) → updateApprStatus()
[E3] cancelButton[등록취소].Select (L127) → updateApprStatus()
[E4] messageBox.DialogHide (L131) → updateApprStatus()
[E5] closeButton[닫기].Select (L149) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L72-80 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L82-91 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L93-101 | view,edit | 상태 처리 | 업무 |
| private getEditor() | L157-171 | open | 상태 처리 | 업무 |
| private updateApprStatus() | L173-206 | E1,E2,E3,E4 | 서비스 tdm.Tdm59_ChckApprCmnt.updateApprCmnt(actionType, personId, stdDate, checkYm) | 업무 |
| private setButton() | L208-218 | open,updateApprStatus | 상태 처리 | 업무 |
| private settings() | L103-155 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L220-222 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L224-226 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={updateApprStatus}>등록</Button>
2. <Button type="unknown" onClick={updateApprStatus}>등록취소</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm59_Edit_Cmnt (`client/vi/tdm/Tdm59_Edit_Cmnt.java`, 337줄)

- 입력·하위 화면: `checkOrgName` TextField, `apprCmnt` MyTextArea, `reportCmnt` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L62-78) → settings()
[E1] agreeButton[등록].Select [apprCmnt.isEnabled()] (L151) → updateApprStatus()
[E2] messageBox.DialogHide (L170) → updateApprStatus()
[E3] rejectButton[반려].Select (L182) → updateApprStatus()
[E4] messageBox.DialogHide (L191) → updateApprStatus()
[E5] cancelButton[등록취소].Select (L203) → updateApprStatus()
[E6] messageBox.DialogHide (L207) → updateApprStatus()
[E7] closeButton[닫기].Select (L225) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L80-90 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L92-120 | 공개 메서드 | 서비스 tdm.Tdm52_ChckManl.countByChckApprCmntId(chckApprCmntId, personId, statusType) | 업무 |
| public open() | L122-144 | view,edit | 상태 처리 | 업무 |
| private getEditor() | L233-259 | open | 상태 처리 | 업무 |
| private updateApprStatus() | L261-297 | E1,E2,E3,E4,E5,E6 | 서비스 tdm.Tdm59_ChckApprCmnt.updateApprCmnt(actionType, personId, stdDate, checkYm) | 업무 |
| private setButton() | L299-328 | open,updateApprStatus | 상태 처리 | 업무 |
| private settings() | L146-231 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L330-332 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L334-336 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={updateApprStatus}>등록</Button>
2. <Button type="cancel" onClick={updateApprStatus}>반려</Button>
3. <Button type="unknown" onClick={updateApprStatus}>등록취소</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm55_Lookup_ChckRecord2 (`client/vi/tdm/Tdm55_Lookup_ChckRecord2.java`, 193줄)

- 툴바 `buttonBar0`: 점검부서: {orgLookup} {retrieveButton}
- 툴바 `buttonBar`: * 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요:
- 입력·하위 화면: `orgLookup` LookupTriggerField, `lookup` Tdm23_Lookup_SelectOrg
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - rowNum 50 " " LongCenter
  - updDateStr 135 "처리일시" TextCenter
  - procType 100 "구분" Text
  - checkOrgName 150 "검토대상부서" Text
  - personInfo 150 "처리자" Text
  - procResult 60 "처리결과" TextCenter
  - resultCmnt 300 "승인(반려) 의견" Text
  - reportCmnt 300 "보고 의견" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-95) → settings(), show()
[E1] orgLookup.TriggerClick [result != null] (L100) → retrieve()
[E2] grid.CellDoubleClick [cellIndex == 7] (L121) → 인라인 L121-136 (new CellDoubleClickHandler() { @Overr…)
[E3] retrieveButton[조회].Select (L138) → retrieve()
[E4] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-63 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L168-182 | E1,E3,open | 서비스 tdm.Tdm55_ChckRecord.selectByChckApprCmntId(companyId, stdDate, chckApprCmntId, orgId) | 업무 |
| private settings() | L97-150 | 생성자 | 조회창 Tdm23_Lookup_SelectOrg 열기, 이벤트 연결, 초기값: orgLookup=resultModel.getOrgName(, orgLookup=initOrgName | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L152-166 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L184-186 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L187-189 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('rowNum', 50, ' '),  // L156 SQL 계산 컬럼(selectByChckApprCmntId: ROW_NUMBER() OVER(ORDER BY tdm55_upd_da…)
  gb.textCenter('updDateStr', 135, '처리일시'),  // L157 SQL 계산 컬럼(selectByChckApprCmntId: COALESCE(TO_CHAR(tdm55_upd_date, 'yyyy-…)
  gb.text('procType', 100, '구분'),  // L158
  gb.text('checkOrgNm', 150, '검토대상부서'),  // L159 SQL 계산 컬럼(selectByChckApprCmntId: org00_kor_nm)
  gb.text('personInfo', 150, '처리자'),  // L160
  gb.textCenter('procResult', 60, '처리결과'),  // L161
  gb.text('resultCmnt', 300, '승인(반려) 의견'),  // L162
  gb.text('reportCmnt', 300, '보고 의견'),  // L163
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm23_Lookup_SelectOrg (`client/vi/tdm/Tdm23_Lookup_SelectOrg.java`, 213줄)

- 툴바 `searchBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="담당부서"
- 그리드 `grid` (buildGrid(), 체크박스(다중), 체크박스):
  - orgCode 100 "부서코드" TextCenter
  - orgName 270 "부서명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-58) → 초기화
[E1] searchText.KeyPress [Enter] (L104) → retrieve()
[E2] grid.CellDoubleClick (L114) → confirm()
[E3] retrieveButton[조회].Select (L121) → retrieve()
[E4] oKButton[확인].Select (L127) → confirm()
[E5] nullButton[선택안함].Select [callback != null] (L133) → hide()
[E6] cancelButton[닫기].Select (L142) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openTdm09() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-68 | openTdm09 | 상태 처리 | 업무 |
| public open() | L70-97 | openTdm09 | 상태 처리 | 업무 |
| private setting() | L99-148 | open | 상태 처리 | 업무 |
| public retrieve() | L166-185 | E1,E3,open | 서비스 tdm.Tdm23_RoleRelateOrg.selectByRoleId(companyId, roleId, stdDate, searchText, tdm09Yn) | 업무 |
| public confirm() | L187-203 | E2,E4 | 미선택 시 alert "담당부서를 선택하세요" | 업무 |
| private buildGrid() | L150-164 | setting | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L205-207 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L209-211 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgCd', 100, '부서코드'),  // L160 SQL 계산 컬럼(selectByRoleId: org00_org_cd)
  gb.text('orgNm', 270, '부서명'),  // L161 SQL 계산 컬럼(selectByRoleId: org00_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>선택안함</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

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

