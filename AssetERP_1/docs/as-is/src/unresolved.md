# 정적으로 해석하지 못한 호출

문자열을 실행 시점에 조합하는 경우. 필요하면 해당 위치를 직접 읽는다.

## 클라이언트 서비스 호출

| 클래스 | 줄 | 식 |
|:---|---:|:---|
| `client/service/CallBatch.java` | 29 | `serviceName` |
| `client/grid/CommonComboBoxField.java` | 230 | `this.serviceName` |
| `client/field/CustomComboBoxField.java` | 116 | `this.serviceName` |
| `client/service/GridDeleteData.java` | 28 | `serviceName` |
| `client/service/GridInsertData.java` | 24 | `serviceName` |
| `client/service/GridPagingLoader.java` | 89 | `serviceName` |
| `client/service/GridRetrieveData.java` | 29 | `serviceName` |
| `client/service/GridUpdate.java` | 56 | `serviceName` |
| `client/service/GridUpdate.java` | 75 | `serviceName` |
| `client/vi/icam/Icam10_Lookup_getICAM.java` | 191 | `serviceName` |
| `client/service/ServiceRequest.java` | 23 | `serviceName` |
| `client/service/TreeGridDelete.java` | 30 | `serviceName` |
| `client/service/TreeGridUpdate.java` | 43 | `serviceName` |
| `client/service/TreeGridUpdate.java` | 63 | `serviceName` |

## 서버 SQL 호출

| 메서드 | 줄 | 식 |
|:---|---:|:---|
| `sys.Sys11_RelateFile.checkFileDelete` | 91 | `model3.getParentTable()+".selectById"` |
| `utils.db.UpdateDataModel.updateModel` | 334 | `tableName + ".selectById"` |

## 서버 메서드가 없는 서비스 키

클래스·메서드 이름이 바뀌었거나 삭제된 경우.

- `apr.Apr01_Appr.updateIcsParentId` ← `Ics01_Move_IcsClass`
- `apr.Apr06_ApprStepRule.delete` ← `Apr06_Tab_ApprStepRule`
- `apr.Apr06_ApprStepRule.update` ← `Apr06_Tab_ApprStepRule`
- `ast.Ast06_Tr.insert` ← `Ast06_Tab_TrManagement`
- `ast.Ast07_Settle.insert` ← `Ast06_Tab_AccruedManagement`
- `biz.Biz13_WithCorp.insert` ← `Biz13_Page_WithCorp`
- `biz.Biz20_FeeCharge.insertFeeCharge` ← `Icam99_Tab_Test`
- `biz.Biz60_FundPriceModi.selectApprId` ← `Biz60_Tab_FundPriceModiReport`
- `emp.Emp00_TransInfo.selectByRiskManager` ← `Apr01_Edit_ApprDoc`
- `fnd.Fnd05_Memeco.delete` ← `Fnd05_Tab_Memeco`
- `fnd.Fnd05_Memeco.update` ← `Fnd05_Tab_Memeco`
- `fnd.Fnd07_IssuingEntity.update` ← `Fnd07_Tab_IssuingEntity`
- `fnd.Fnd09_TrustBank.insertCheck` ← `Fnd09_Tab_TrustBankManager`
- `pay.Pay10_Month.calculate` ← `Pay10_Tab_Month`
- `pln.Fnd01_FundPlan.selectByPlanFundId` ← `Fnd01_TabPage_FundCode`
- `pmx.Pmx05_EvalTarget.selectPayZoneByPersonId` ← `MyPage`
- `sys.Sys01_Company.selectByNotAssignedCompany` ← `Lookup_AdminCompany`
- `sys.Sys10_File.copyPfResultReportFile` ← `Apr01_Grid_ApprFile`
- `tdm.Tdm20_Role.selectByRoleId` ← `Tdm20_Lookup_CeoRoleList`

## 매퍼에 없는 SQL ID

- `act12_journal_map.selectByCompanyId` ← `act.Act12_JournalMap.selectByCompanyId`
- `apr01_appr.selectByApprDateAll` ← `apr.Apr01_Appr.selectByApprDateAll`
- `apr01_appr.selectByBondId` ← `apr.Apr01_Appr.selectByBondId`
- `apr01_appr.selectToDoList` ← `apr.Apr01_Appr.selectToDoList`
- `apr01_apprapr01_appr_temp.insertApprTemp` ← `apr.Apr01_Appr.insertApr01ApprTemp`
- `apr03_relate_fund.selectByClassTreeId2` ← `apr.Apr03_RelateFund.selectByClassTreeId2`
- `ast13_book_depn.checkByDepnDate` ← `ast.Ast13_BookDepn.checkByDepnDate`
- `ast13_book_depn.checkByDepnDateAfter` ← `ast.Ast13_BookDepn.checkByDepnDate`
- `ast14_book_fund_fee.selectById` ← `ast.Ast14_BookFundFee.selectById`
- `att03_overtime_req.selectByCompanyId` ← `att.Att03_OvertimeReq.selectByCompanyId`
- `att03_overtime_req.selectByConfirmPersonId` ← `att.Att03_OvertimeReq.selectByConfirmPersonId`
- `att03_overtime_req.updateReqStatusCode` ← `att.Att03_OvertimeReq.updateReqStatusCode`
- `att04_commute_hist.selectByCompanyId` ← `att.Att04_CommuteHist.selectByCompanyId`
- `bbs02_notice.selectByPersonId` ← `bbs.Bbs02_Notice.selectByPersonId`
- `biz01_promo.selectByText` ← `biz.Biz01_Promo.selectByText`
- `biz13_with_corp.getCorpName` ← `biz.Biz13_WithCorp.getCorpName`
- `biz13_with_corp.selectByCompanyId` ← `biz.Biz13_WithCorp.selectByCompanyId`
- `biz13_with_corp.selectByWithGroupId` ← `biz.Biz13_WithCorp.selectByWithGroupId`
- `cmp10_mail_book.deleteByMailBookId` ← `cmp.Cmp10_MailBook.deleteByMailBookId`
- `cmp11_count.selectById` ← `crm.Crm11_Count.selectById`
- `crm09_contact.selectByAll` ← `crm.Crm09_Contact.selectByAll`
- `dbm01_tab_comments.selectByColumnName` ← `dbm.Dbm01_TabComments.selectByColumnName`
- `dcr01_class_tree.selectByBondId` ← `dcr.Dcr01_ClassTree.selectByBondId`
- `emp01_hire.selectById` ← `emp.Hire.selectById`
- `emp01_hire.selectByKorName` ← `emp.Hire.selectByKorName`
- `emp01_hire.selectByPayTarget` ← `emp.Hire.selectByPayTarget`
- `emp01_hire.selectByUserId` ← `emp.Hire.selectByUserId`
- `emp01_hire.selectByUserName` ← `emp.Hire.selectByUserName`
- `emp44_eval_write.selectByEvalListStdId` ← `emp.Emp44_EvalWrite.selectByEvalListStdId`
- `emp44_eval_write.selectByEvalTargetId` ← `emp.Emp44_EvalWrite.selectByEvalTargetId`
- `flt10_tr.selectByDate` ← `flt.Flt10_Tr.selectByDate`
- `fnd20_plan.selectByEmpPlanFundId` ← `fnd.Fnd20_Plan.selectByEmpPlanFundId`
- `fnd20_plan.selectByLookupFund` ← `fnd.Fnd20_Plan.selectByLookupFund`
- `fnd20_plan.selectByPlanFundId` ← `fnd.Fnd20_Plan.selectByPlanFundId`
- `fnd20_plan.selectByPlanFundName` ← `fnd.Fnd20_Plan.selectByPlanFundName`
- `fnd20_plan.selectByPlanPersonFund` ← `fnd.Fnd20_Plan.selectByPlanPersonFund`
- `frm01_list.selectMonitorngAppr` ← `frm.Frm01_List.selectMonitorngAppr`
- `ics30_compliance.selectChecklistStatusPaging` ← `ics.Ics30_Compliance.selectComplianceStatusPaging`
- `ics30_compliance.selectChecklistStatusPagingTotal` ← `ics.Ics30_Compliance.selectComplianceStatusPaging`
- `mkt01_target_company.selectByCompanyId` ← `mkt.Mkt01_TargetCompany.selectByCompanyId`
- `mrb01_booking.selectByApprDate` ← `mrb.Mrb01_Booking.selectByApprDate`
- `mvb01_booking.callProcedure` ← `mvb.Mvb01_Booking.callProcedure`
- `mvb01_booking.checkAvailable` ← `mvb.Mvb01_Booking.checkAvailable`
- `mvb01_booking.deleteByBookingId` ← `mvb.Mvb01_Booking.deleteByBookingId`
- `mvb01_booking.selectByApprDate` ← `mvb.Mvb01_Booking.selectByApprDate`
- `opr01_create.chkPreDelete` ← `opr.Opr01_Create.chkPreDelete`
- `org00_org_info.selectByCheckParentId` ← `org.Org00_OrgInfo.selectByCheckParentId`
- `org01_code.selectByDcrTreeId` ← `org.Org01_Code.selectByDcrTreeId`
- `org02_info.selectByCondition` ← `org.Org02_SearchOrgInfo.selectByCondition`
- `pay50_expense.selectExpenseUnJournal` ← `pay.Pay50_Expense.selectExpenseUnJournal`
- `pcd01_pickup.checkAvailable` ← `pcd.Pcd01_Pickup.checkAvailable`
- `pcd01_pickup.selectByApprDate` ← `pcd.Pcd01_Pickup.selectByApprDate`
- `pln02_plan.selectByLookupFund` ← `pln.Pln02_Plan.selectByLookupFund`
- `pln02_plan.selectByPlanPersonFund` ← `pln.Pln02_Plan.selectByPlanPersonFund`
- `pln03_resrch.apprUpdate` ← `pln.Pln03_Resrch.apprUpdate`
- `pln03_resrch.closeUpdate` ← `pln.Pln03_Resrch.closeUpdate`
- `pln03_resrch.insert` ← `pln.Pln03_Resrch.update`
- `pln03_resrch.selectById` ← `pln.Pln03_Resrch.selectById`
- `pln03_resrch.selectBySearchText` ← `pln.Pln03_Resrch.selectBySearchText`
- `pln03_resrch.selectDetailInit` ← `pln.Pln03_Resrch.selectDetailInit`
- `pln03_resrch.selectOneApprPersonId` ← `pln.Pln03_Resrch.selectOneApprPersonId`
- `sch04_list.selectSchedule` ← `sch.Sch04_List.selectSchedule`
- `sch22_write_group.selectByParentId` ← `sch.Sch22_WriteGroup.selectByParentId`
- `sys02_user.selectByAll` ← `sys.Sys02_User.selectByAll`
- `sys02_user.selectByUserName` ← `sys.Sys02_User.selectByUserName`
- `sys04_role.selectByNotAssigned` ← `sys.Sys04_Role.selectByNotAssigned`
- `sys06_menu.selectByHeaderMenu` ← `sys.Sys06_Menu.selectByHeaderMenu`
- `sys06_menu.selectByOneDepthsUser` ← `sys.Sys06_Menu.selectByOneDepthsUser`
- `sys10_file.insertPayFile` ← `sys.Sys10_File.insertPayFile`
- `sys10_file.selectByAll` ← `sys.File.selectByAll`, `sys.Sys10_File.selectByAll`
- `sys10_file.selectByApprId` ← `sys.Sys10_File.selectByApprId`
- `sys10_file.selectByClassTreeId` ← `sys.Sys10_File.selectByClassTreeId`
- `sys21_license_code.selectByCodeKindId` ← `sys.Sys21_LicenseCode.selectByApplyDate`
- `sys21_license_code.selectByToday` ← `emp.License.selectByToday`
- `sys21_license_code.selectByUserId` ← `emp.License.selectByUserId`
- `sys27_login_manage.updateCollapse` ← `sys.Sys27_LoginManage.updateCollapse`
- `tdm11_task_relate_rule.selectByTaskId` ← `tdm.Tdm11_TaskRelateRule.selectByTaskId`
- `tdm41_manl_duty.updateOrgCodeId` ← `tdm.Tdm41_ManlDuty.updateOrgCodeId`
- `tdm50_chck_job.selectEndInfoByCheckerId` ← `tdm.Tdm50_ChckJob.selectEndInfoByCheckerId`
