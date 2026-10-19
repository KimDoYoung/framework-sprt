# sys01_company

`server/sys/mapper/sys01_company.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 93 | [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.selectByApprovalTypeCd`, `apr.Apr04_ApprStep.updateList`, `apr.Apr90_DisposalList.modelUpdate`, `ast.Ast01_ClassTree.insert`, `ast.Ast01_ClassTree.insertIpo`, `bbs.Bbs15_CompanyRule.pushData`, `dcr.Dcr03_OrgAuth.update`, `dcr.Dcr30_Link.updateDcrAuth`, `emp.Emp20_Leave.cancelUpdate`, `emp.Emp21_UnLeave.insertAppr`, `emp.Emp21_UnLeave.sendMessage`, `flt.Flt10_Tr.sendMessage`, `fnd.Fnd01_FundCode.selectIcamFundInfo`, `org.Org01_Code.updateDcrAuth`, `pay.Pay50_Expense.confirmSendMessage`, `pay.Pay50_Expense.rejectSendMessage`, `pay.Pay50_Expense.updateApprEmpId`, `sms.Sms02_History.sendMessage`, `sms.Sms02_History.sendTagetMessage`, `sms.Sms03_GroupSend.sendMessage`, `sms.Sms04_GroupSendHistory.sendMessage`, `sms.Sms04_GroupSendHistory.sendTagetMessage`, `sys.Sys01_Company.apprStepLockChk`, `sys.Sys01_Company.selectById`, `sys.Sys10_File.copyPfResultReportFileSafe`, `sys.Sys10_File.copySetFileName`, `sys.Sys10_File.getServerPath`, `utils.mail.SendAlarm.sendMailSession`, `utils.mail.SendMailSMTP.checkCompanyMail`, `utils.mail.SendMailSMTP.checkMail`, `utils.mail.SendMailSMTP.sendMailSession`, `utils.mail.SendMailSMTP.sendMailSessionTest` |
| `updateMainImageId` | update | 115 | [`sys01_company`](../../../db/tables/sys.md) |  | `sys.Sys01_Company.selectById` |
| `updateJobDescEditable` | select | 121 | [`sys01_company`](../../../db/tables/sys.md) |  | - |
| `selectByAll` | select | 127 | [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `dcr.Dcr30_Link.linkCheck`, `sys.Sys01_Company.selectByAll` |
| `selectByName` | select | 149 | [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `sys.Sys01_Company.selectByName` |
| `selectCompany` | select | 182 | [`sys01_company`](../../../db/tables/sys.md) |  | `sys.Sys01_Company.selectCompany` |
| `selectByCompanyCode` | select | 199 | [`sys01_company`](../../../db/tables/sys.md) |  | `sys.Sys01_Company.selectByCompanyCode` |
| `selectByMenuId` | select | 206 | [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `sys.Sys01_Company.selectByMenuId` |
| `selectByCode` | select | 238 | [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys01_Company.selectByCode` |
| `selectByCopyList` | select | 255 | [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `sys.Sys01_Company.selectByCopyList` |
| `selectByPersonId` | select | 281 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) |  | `utils.mail.SendAlarm.sendMailSession`, `utils.mail.SendMailSMTP.sendMailSession`, `utils.mail.SendMailSMTP.sendMailSessionTest` |
| `selectIcamCompanyCode` | select | 288 | [`sys01_company`](../../../db/tables/sys.md) |  | `fnd.Fnd03_Consignment.selectIcamConsignment`, `fnd.Fnd09_TrustBank.selectIcamTrustBank` |
| `selectIcamAdvisCompanyCode` | select | 298 | [`sys01_company`](../../../db/tables/sys.md) |  | - |
| `selectIcamCompanyExcept` | select | 307 | [`sys01_company`](../../../db/tables/sys.md) |  | - |
| `selectByUseYn` | select | 317 | [`sys01_company`](../../../db/tables/sys.md) |  | `sys.Sys01_Company.selectByUseYn` |
| `getInfoByMenuId` | select | 325 | [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md) |  | `sys.Sys06_Menu.insertByMenuYn`, `sys.Sys06_Menu.updateByMenuYn` |
| `getCorpRegNo` | select | 341 | - | `to_encrypts` | `sys.Sys01_Company.getCorpRegNo` |
| `updateNote` | update | 345 | [`sys01_company`](../../../db/tables/sys.md) |  | `sys.Sys01_Company.updateNote` |
| `updateCorpRegNo` | update | 351 | [`sys01_company`](../../../db/tables/sys.md) | `to_encrypts` | `sys.Sys01_Company.updateCorpRegNo` |
| `updatePw` | update | 357 | [`sys01_company`](../../../db/tables/sys.md) |  | - |
| `getTaxType` | select | 363 | [`sys01_company`](../../../db/tables/sys.md) |  | `biz.Biz01_Promo.insert`, `biz.Biz01_Promo.insertList` |
