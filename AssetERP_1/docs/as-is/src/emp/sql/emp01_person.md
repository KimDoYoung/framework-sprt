# emp01_person

`server/emp/mapper/emp01_person.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 60 | [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.clearApprStepId`, `apr.Apr04_ApprStep.confirmUpdate`, `apr.Apr04_ApprStep.updateList`, `apr.Apr90_DisposalList.modelUpdate`, `att.Att03_OvertimeReq.selectApprStepByType`, `att.Att03_OvertimeReq.sendMessage`, `bbs.Bbs20_FloralRequest.sendMessage`, `biz.Biz01_Promo.sendMessage`, `emp.Emp01_Person.selectById`, `emp.Emp04_AddTitle.updateList`, `emp.Emp20_Leave.cancelUpdate`, `emp.Emp21_UnLeave.sendMessage`, `flt.Flt10_Tr.sendMessage`, `pay.Pay31_InsureApply.insert3`, `pay.Pay50_Expense.confirmSendMessage`, `pay.Pay50_Expense.rejectSendMessage`, `sms.Sms02_History.sendTagetMessage`, `sms.Sms04_GroupSendHistory.sendTagetMessage` |
| `selectByEmpNo` | select | 69 | [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | - |
| `selectByCtzNo` | select | 78 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md) | `to_decrypts` | - |
| `selectByText` | select | 87 | [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `emp.Emp01_Person.selectByText` |
| `selectByCompanyId` | select | 96 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_get_emptrans`, `f_sysdate` | `emp.Emp01_Person.selectByCompanyId` |
| `selectBySearchTextPaging` | select | 120 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_get_emptrans`, `f_sysdate`, `f_today` | `emp.Emp01_Person.selectBySearchTextPaging` |
| `selectBySearchTextTotal` | select | 169 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_today` | `emp.Emp01_Person.selectBySearchTextPaging` |
| `selectByCompanyIdPaging` | select | 202 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_get_emptrans`, `f_sysdate` | `emp.Emp01_Person.selectByPaging` |
| `selectByCompanyIdTotal` | select | 233 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) |  | `emp.Emp01_Person.selectByPaging` |
| `selectByLoginUserPaging` | select | 251 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_get_emptrans`, `f_sysdate` | `emp.Emp01_Person.selectByLoginUserPaging` |
| `selectByLoginUserTotal` | select | 275 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) |  | `emp.Emp01_Person.selectByLoginUserPaging` |
| `selectByPersonId` | select | 292 | [`emp01_person`](../../../db/tables/emp.md) | `to_decrypts` | `emp.Emp01_Person.changeMail`, `emp.Emp01_Person.selectByPersonId`, `emp.Emp17_Benefit.sendMessage`, `sys.Sys27_LoginManage.updateConfirmYn` |
| `selectByCmpList` | select | 299 | [`cmp03_item_check`](../../../db/tables/cmp.md), [`cmp04_person_check`](../../../db/tables/cmp.md), [`emp01_person`](../../../db/tables/emp.md) | `to_decrypts` | - |
| `selectByYearList` | select | 339 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_get_close_date`, `f_get_datediff`, `f_get_emptrans`, `f_get_last_day`, `f_get_leave_days`, `f_get_leave_days2`, `f_today` | `emp.Emp01_Person.selectByYearList`, `sys.Sys99_Print.insertRdYearList` |
| `selectByUnLeaveCode` | select | 440 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md) | `f_get_close_date`, `f_get_datediff`, `f_get_leave_days2`, `f_today` | `emp.Emp21_UnLeave.insert` |
| `selectByUnLeaveCode2` | select | 508 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_close_date`, `f_get_emptrans`, `f_get_last_day`, `f_get_leave_days2`, `f_today` | `emp.Emp21_UnLeave.insert2` |
| `selectByCompanyCode` | select | 634 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `to_decrypts` | `sys.Sys02_User.userLock`, `sys.Sys25_Password.insert` |
| `checkUsePersonId` | select | 643 | - | `f_check_use_person_id` | `emp.Emp01_Person.checkUsePersonId` |
| `empNoCheck` | select | 647 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp01_Person.empNoCheck` |
| `getGradeCode` | select | 654 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md) | `f_sysdate`, `to_decrypts` | - |
| `getSmsNoticeCode` | select | 697 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp93_sms_notice_target`](../../../db/tables/emp.md) | `f_sysdate`, `to_decrypts` | - |
| `getPersonCount` | select | 728 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_today` | `biz.Biz55_ErpFeeCharge.updateErpCompany` |
| `changeMail` | update | 760 | [`emp01_person`](../../../db/tables/emp.md) | `to_encrypts` | `emp.Emp01_Person.changeMail` |
| `resetMail` | update | 767 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp01_Person.resetMail` |
| `updateLocation` | update | 773 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp01_Person.updateLocation` |
| `updateTheme` | update | 779 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp01_Person.updateTheme` |
| `updateLockYn` | update | 785 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp01_Person.updateLockYn`, `sys.Sys02_User.userLock` |
| `updateMenuFixYn` | update | 791 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp01_Person.updateMenuFixYn` |
| `insertEmpDel` | insert | 798 | [`emp01_person`](../../../db/tables/emp.md), [`emp99_person_del`](../../../db/tables/emp.md) | `f_create_seq`, `f_sysdate` | `emp.Emp01_Person.deleteTarget`, `emp.Emp04_AddTitle.deleteList` |
| `insert` | insert | 826 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp04_AddTitle.updateList` |
| `excelInsert` | insert | 848 | [`emp01_person`](../../../db/tables/emp.md) |  | - |
| `deleteByPersonId` | delete | 874 | [`emp01_person`](../../../db/tables/emp.md) |  | `emp.Emp04_AddTitle.deleteList` |
