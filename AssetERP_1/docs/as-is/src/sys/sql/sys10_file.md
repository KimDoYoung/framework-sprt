# sys10_file

`server/sys/mapper/sys10_file.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 45 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByFileId` |
| `selectByYear` | select | 63 | [`sys10_file`](../../../db/tables/sys.md) |  | - |
| `selectByFileId` | select | 69 | [`sys10_file`](../../../db/tables/sys.md) |  | `utils.mail.SendMailSMTP.sendMailSession`, `utils.mail.SendMailSMTP.sendMailSessionTest` |
| `selectByParentId` | select | 85 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `bbs.Bbs15_CompanyRule.pushData`, `pay.Pay50_Expense.initExpense`, `pay.Pay50_Expense.updateApprEmpId`, `sys.File.selectById`, `sys.File.selectByParentId`, `sys.Sys10_File.copyFile`, `sys.Sys10_File.copySetFileName`, `sys.Sys10_File.selectByCheck`, `sys.Sys10_File.selectById`, `sys.Sys10_File.selectByParentId`, `sys.Sys54_SpecificMenuHistory.deleteFile`, `tdm.Tdm31_RoleDesc.deleteRd`, `tdm.Tdm31_RoleDesc.fileCheck`, `tdm.Tdm32_RoleDigm.fileCheck`, `tdm.Tdm33_RoleDigmFile.deleteByRoleDigmId`, `tdm.Tdm33_RoleDigmFile.fileCheck`, `tdm.Tdm33_RoleDigmFile.selectByFileType`, `tdm.Tdm33_RoleDigmFile.upsertByRoleDigmId`, `tdm.Tdm42_ManlOrg.fileCheck`, `tdm.Tdm53_ChckExct.fileCheck`, `tdm.Tdm53_ChckExct.fileStatusCheck` |
| `selectByAdminYn` | select | 105 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.copyFileAdminYn` |
| `deleteCheck` | select | 123 | [`sys10_file`](../../../db/tables/sys.md) |  | `apr.Apr01_Appr.deleteByApprId`, `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.deleteTmpFile`, `tdm.Tdm52_ChckManl.updateCheckStatus` |
| `selectByParentId2` | select | 130 | [`act02_journal`](../../../db/tables/act.md), [`ast07_settle`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByParentId2` |
| `selectByPrintYn` | select | 166 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) |  | - |
| `selectByDevId` | select | 187 | [`scm11_dev_step`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByDevId` |
| `selectByDevStepId` | select | 202 | [`scm11_dev_step`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByDevStepId` |
| `selectByFeeChargeId` | select | 217 | [`biz20_fee_charge`](../../../db/tables/biz.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByFeeChargeId` |
| `selectByApprParentId` | select | 225 | [`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) |  | - |
| `getIcsFile` | select | 233 | [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys10_File.getIcsFile` |
| `getTdmCheckFormFile` | select | 258 | [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys10_File.getTdmCheckFormFile` |
| `selectUnConnTdmFormFile` | select | 271 | [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys10_File.selectUnConnTdmFormFile` |
| `selectByText` | select | 292 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByText` |
| `selectByIcsFile` | select | 300 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByIcsFile` |
| `selectByAdmin` | select | 308 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByAdmin` |
| `selectByIcsFileAll` | select | 315 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByIcsFileAll` |
| `selectByFileYn` | select | 325 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByFileYn` |
| `selectCountByParentId` | select | 333 | [`sys10_file`](../../../db/tables/sys.md) |  | - |
| `selectOneByParentId` | select | 339 | [`sys10_file`](../../../db/tables/sys.md) |  | `opr.Opr01_Create.insertAppr` |
| `selectOneFileName` | select | 351 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectOneFileName` |
| `selectApprRelateDoc` | select | 370 | [`apr05_relate_doc`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectApprRelateDoc` |
| `selectMailFileHistory` | select | 384 | [`dcr11_mail_file_history`](../../../db/tables/dcr.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectMailFileHistory` |
| `selectByPayMonthId` | select | 391 | [`pay10_month`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md) |  | - |
| `selectByCompanyId` | select | 406 | [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) |  | `biz.Biz55_ErpFeeCharge.updateErpCompany` |
| `selectByTotalSize` | select | 430 | [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByTotalSize` |
| `selectByTotalSizeYear` | select | 459 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByTotalSizeYear` |
| `selectByTotalSizeMonth` | select | 474 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByTotalSizeMonth` |
| `selectByFamilyConsentId` | select | 490 | [`flt07_family_consent`](../../../db/tables/flt.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.selectByFamilyConsentId` |
| `selectByPfFileId` | select | 498 | [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.copyPfResultReportFileSafe` |
| `findTrashFile` | select | 509 | - | `find_orphan_sys10_files` | `sys.Sys10_File.findTrashFile` |
| `insert` | insert | 515 | [`sys10_file`](../../../db/tables/sys.md) | `f_sysdate` | `opr.Opr01_Create.insertAppr` |
| `insertUpdate_Postgre` | sql | 553 | [`sys10_file`](../../../db/tables/sys.md) | `f_sysdate` |  |
| `insertUpdate` | insert | 602 | [`sys10_file`](../../../db/tables/sys.md) | `f_sysdate` | `bbs.Bbs15_CompanyRule.pushData`, `pay.Pay50_Expense.updateApprEmpId`, `sys.Sys10_File.copyPfResultReportFileSafe`, `sys.Sys10_File.copySetFileName`, `sys.Sys10_File.fileReName` |
| `updateRelateApprId` | update | 613 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.updateRelateApprId` |
| `updateOthers` | update | 619 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys10_File.updateOthers` |
| `update` | update | 627 | [`sys10_file`](../../../db/tables/sys.md) | `f_sysdate` | - |
| `delete` | delete | 639 | [`sys10_file`](../../../db/tables/sys.md) |  | `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.deleteTmpFile`, `tdm.Tdm52_ChckManl.updateCheckStatus` |
| `updateParentId` | update | 645 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys61_FileDel.insert`, `sys.Sys61_FileDel.recovery` |
| `deleteByParentId` | delete | 656 | [`sys10_file`](../../../db/tables/sys.md) |  | `apr.Apr01_Appr.deleteByApprId`, `biz.Biz51_ErpContCorp.deleteList`, `fnd.Fnd20_Plan.delete`, `fnd.Fnd30_Opr.deleteApprId`, `opr.Opr01_Create.delete`, `pay.Pay50_Expense.deleteRequest`, `pay.Pay50_Expense.initExpense`, `pln.Pln02_Plan.delete`, `tdm.Tdm31_RoleDesc.deleteRd`, `tdm.Tdm31_RoleDesc.fileCheck`, `tdm.Tdm32_RoleDigm.fileCheck`, `tdm.Tdm33_RoleDigmFile.upsertByRoleDigmId`, `tdm.Tdm42_ManlOrg.fileCheck`, `tdm.Tdm53_ChckExct.fileCheck` |
| `deleteById` | delete | 662 | [`sys10_file`](../../../db/tables/sys.md) |  | `tdm.Tdm53_ChckExct.deleteList` |
