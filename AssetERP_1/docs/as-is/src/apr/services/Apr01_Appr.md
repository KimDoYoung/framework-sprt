# apr.Apr01_Appr

`server/apr/Apr01_Appr.java`

서비스 키 `apr.Apr01_Appr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 39 | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) | `Act02_Tab_DepositIoList`, `Act80_Lookup_RelateAppr`, `Apr01_Edit_ApprDoc`, `Apr03_Page_Relate`, `Apr18_Lookup_Appr`, `Apr90_Tab_DisposalAppr`, `Apr90_Tab_DisposalList`, `Apr90_Tab_DisposalListAdmin`, `Ast06_Tab_TrTax`, `Ast09_Tab_DepositBook`, `Ast09_Tab_FinanceBook`, `Ast09_Tab_FinanceForBook`, `Ast13_Tab_DepnBook`, `Ast13_Tab_OfficeAssets`, `Biz01_Tab_Card`, `Biz01_Tab_CardManagement`, `Biz01_Tab_CardReport`, `Biz01_Tab_EntertmExpenseReport`, `Biz05_Lookup_RelateAppr`, `Biz14_Lookup_RelateAppr`, `Biz16_TabPage_EachCont`, `Biz20_Tab_FeeCharge`, `Biz55_Tab_ErpFeeCharge`, `Biz60_Tab_FundPriceModiReport`, `Bmt01_Tab_Buy`, `Bmt20_Lookup_RelateAppr`, `Car04_Tab_Journal`, `Dcr10_Tab_MailHistory`, `Dcr10_Tab_MailHistory_Manager`, `Emp15_Tab_Cert`, `Emp17_Tab_Benefit`, `Emp17_Tab_BenefitManager`, `Emp20_Tab_Leave`, `Emp21_TabPage_UnLeaveList1`, `Emp21_TabPage_UnLeaveList2`, `Emp21_Tab_PersonList`, `Emp22_Tab_EtcLeave`, `Emp24_Tab_JointLeave`, `Emp43_Tab_FinalAppr`, `Emp43_Tab_FirstAppr`, `Emp50_Tab_TransportExpense`, `Emp50_Tab_TransportExpenseMng`, `Emp53_Tab_BizTrip`, `Emp53_Tab_BizTripManager`, `Emp54_Tab_Errand`, `Emp54_Tab_ErrandManager`, `Est02_Tab_PfContract`, `Est02_Tab_PfResultReport`, `Flt02_Lookup_Emp`, `Flt03_Tab_AccountReport`, `Flt06_TabPage_AccountClose`, `Flt10_Grid_EmpAppr`, `Flt10_Tab_CeoReport`, `Flt10_Tab_RealTransaction`, `Fnd30_Tab_DemandOpr`, `Fnd30_Tab_Opr`, `Icam55_Tab_UserApprResult`, `Icam55_Tab_UserRegAppr`, `Icam55_Tab_UserStopAuthAppr`, `Ics01_Lookup_PeriodList`, `Ics16_Lookup_RelateAppr`, `Ics31_Tab_ComplianceReport`, `Ics32_Lookup_RelateAppr`, `Pay01_Tab_Annual`, `Pay01_Tab_AnnualList`, `Pay01_Tab_AnnualPerson`, `Pay07_TabPage_RetireStatement1`, `Pay10_TabPage_Retire`, `Pay10_Tab_List`, `Pay40_Tab_TaxWithholding`, `Pay50_Lookup_ExpenseRequestInsert`, `Pay50_Tab_Expense`, `Pay50_Tab_ExpenseManager`, `Pay50_Tab_ExpensePay`, `Pay50_Tab_ExpensePayWrite`, `Pln00_Popup_PlanDoc`, `Sch04_Lookup_IcrList`, `Sch04_Lookup_IcsList`, `Sch04_Tab_CheckList`, `Sch04_Tab_DailyCheckList`, `Sch04_Tab_DailyCheckListStatus`, `Sys53_Tab_SpecificMenuRequest`, `Sys53_Tab_SpecificMenuRequestAdmin`, `Sys61_Lookup_FileList` |  |
| `selectByApprId2` | 53 | [`apr01_appr.selectByApprId2`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_MyAuthList`, `Apr01_Tab_MyReferenceList`, `Apr01_Tab_MyRequestList`, `Dcr01_Tab_DcrWrite` |  |
| `selectByEmpId` | 58 | [`apr01_appr.selectByEmpId`](../../apr/sql/apr01_appr.md) | - |  |
| `selectByLinkCode` | 77 | [`apr01_appr.selectByLinkCode`](../../apr/sql/apr01_appr.md) | `Apr01_Lookup_ApprLink`, `Flt10_Tab_CeoReport` |  |
| `selectByApprIdList` | 90 | [`apr01_appr.selectByApprIdList`](../../apr/sql/apr01_appr.md) | `Apr01_Lookup_ApprLink` |  |
| `getApprIdList` | 109 | [`apr01_appr.getApprIdList`](../../apr/sql/apr01_appr.md) | `Apr03_Page_Relate` |  |
| `selectByText` | 121 | [`apr01_appr.selectByText`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_BizPriorApproval`, `Apr01_Tab_ExternalBiz` |  |
| `selectByText2` | 142 | [`apr01_appr.selectByText2`](../../apr/sql/apr01_appr.md) | `Dcr00_Tab_DocList` |  |
| `selectApprListByEmpId` | 163 | [`apr01_appr.selectApprListByEmpId`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_MyApproveList` |  |
| `selectByClassTreeId` | 187 | [`apr01_appr.selectByClassTreeId`](../../apr/sql/apr01_appr.md) | - |  |
| `selectByClassTreeId2` | 202 | [`apr01_appr.selectByClassTreeId2`](../../apr/sql/apr01_appr.md) | `Apr01_Grid_DocList`, `Dcr01_Grid_DcrClassList` |  |
| `selectByFundCodeId` | 220 | [`apr01_appr.selectByFundCodeId`](../../apr/sql/apr01_appr.md) | `Sys10_FundDocList` |  |
| `selectByBondId` | 241 | `apr01_appr.selectByBondId`(없음) | `Sys10_BondDocList` |  |
| `selectByRequestEmpId` | 261 | [`apr01_appr.selectByRequestEmpId`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_MyRequestList` |  |
| `selectByReferenceEmpId` | 284 | [`apr01_appr.selectByReferenceEmpId`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_MyReferenceList` |  |
| `selectByAuthEmpId` | 309 | [`apr01_appr.selectByAuthEmpId`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_MyAuthList` |  |
| `selectAplyListByEmpId` | 326 | [`apr01_appr.selectAplyListByEmpId`](../../apr/sql/apr01_appr.md) | - |  |
| `selectByDcrWrite` | 346 | [`apr01_appr.selectByDcrWrite`](../../apr/sql/apr01_appr.md) | - |  |
| `update` | 362 | [`apr01_appr.getDcrIdWord`](../../apr/sql/apr01_appr.md), [`apr01_appr.getStampSeq`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`apr11_advert_book.getAdvertSeq`](../../apr/sql/apr11_advert_book.md), [`apr11_advert_book.insertAdvertHistory`](../../apr/sql/apr11_advert_book.md), [`apr16_stamp_doc.updateByApprId`](../../apr/sql/apr16_stamp_doc.md), [`apr21_relate_appr.deleteByApprId`](../../apr/sql/apr21_relate_appr.md), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp60_sign.getSignId`](../../emp/sql/emp60_sign.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(apr01_appr)` 동적 INSERT/UPDATE, `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE, `UpdateDataModel(apr03_relate_fund)` 동적 INSERT/UPDATE, `UpdateDataModel(apr12_relate_adv)` 동적 INSERT/UPDATE, `UpdateDataModel(apr21_relate_appr)` 동적 INSERT/UPDATE, `UpdateDataModel(apr20_relate_ics)` 동적 INSERT/UPDATE, `UpdateDataModel(apr22_relate_icr)` 동적 INSERT/UPDATE, `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE | `Apr01_Edit_ApprDoc`, `Pln00_Popup_PlanDoc` | `SendMailMaster`, `SendSMSAPIFunction`, `SendTalkAPI`, `UpdateDataModel` |
| `appr` | 813 | [`apr01_appr.updateStepCd`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.selectApprStep`](../../apr/sql/apr04_appr_step.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `reject` | 839 | [`apr01_appr.updateStepCd`](../../apr/sql/apr01_appr.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `selectOutstanding` | 860 | [`apr01_appr.selectOutstanding`](../../apr/sql/apr01_appr.md) | `Monitoring_Page_Appr`, `Monitoring_Page_Outstanding` |  |
| `selectOutstandingPopup` | 879 | [`apr01_appr.selectOutstandingPopup`](../../apr/sql/apr01_appr.md) | `Frm01_Lookup_Outstanding` |  |
| `selectInstanding` | 893 | [`apr01_appr.selectInstanding`](../../apr/sql/apr01_appr.md) | - |  |
| `selectCfstanding` | 906 | [`apr01_appr.selectCfstanding`](../../apr/sql/apr01_appr.md) | - |  |
| `selectMonitorngAppr` | 919 | [`apr01_appr.selectMonitorngAppr`](../../apr/sql/apr01_appr.md) | `Monitoring_Page_Appr` |  |
| `selectTemporary` | 934 | [`apr01_appr.selectTemporary`](../../apr/sql/apr01_appr.md) | `Monitoring_Page_Appr` |  |
| `selectToDoList` | 943 | `apr01_appr.selectToDoList`(없음) | - |  |
| `selectPdfMakeTarget` | 961 | [`apr01_appr.selectPdfMakeTarget`](../../apr/sql/apr01_appr.md) | `Dbm10_Tab_MakePdf` |  |
| `selectByWeek` | 974 | [`apr01_appr.selectByWeek`](../../apr/sql/apr01_appr.md) | `Apr01_Lookup_ApprList` |  |
| `selectByDcrGroup` | 985 | [`apr01_appr.selectByDcrGroup`](../../apr/sql/apr01_appr.md) | `Apr01_Lookup_ApprList` |  |
| `deleteByApprId` | 996 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`apr11_advert_book.deleteByApprId`](../../apr/sql/apr11_advert_book.md), [`opr01_create.updateApprIdByApprId`](../../opr/sql/opr01_create.md), [`pln02_plan.updateApprIdByApprId`](../../pln/sql/pln02_plan.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.deleteCheck`](../../sys/sql/sys10_file.md) | `Apr01_Edit_ApprDoc`, `Icam55_Tab_UserRegAppr` | `File` |
| `insertApr01ApprTemp` | 1051 | `apr01_apprapr01_appr_temp.insertApprTemp`(없음) | - |  |
| `selectByApprDate` | 1071 | [`apr01_appr.selectByApprDate`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_StampSeq` |  |
| `selectByApprDateAll` | 1097 | `apr01_appr.selectByApprDateAll`(없음) | - |  |
| `selectByTotalList` | 1115 | [`apr01_appr.selectByTotalList`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_TotalList` |  |
| `selectBySubList` | 1131 | [`apr01_appr.selectBySubList`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_SubList` |  |
| `selectByFundDocList` | 1149 | [`apr01_appr.selectByFundDocList`](../../apr/sql/apr01_appr.md) | `Apr01_Grid_FundDocList` |  |
| `selectByItemDocList` | 1166 | [`apr01_appr.selectByItemDocList`](../../apr/sql/apr01_appr.md) | `Apr01_Grid_ItemDocList` |  |
| `selectByPaging` | 1171 | [`apr01_appr.selectByDcrWritePaging`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectByDcrWriteTotal`](../../apr/sql/apr01_appr.md) | `Dcr01_Tab_DcrWrite` |  |
| `permissionsCheck` | 1177 | [`apr01_appr.permissionsCheck`](../../apr/sql/apr01_appr.md) | `ApprCallbackResult` |  |
| `permissionsCheckWithDel` | 1191 | [`apr01_appr.permissionsCheckWithDel`](../../apr/sql/apr01_appr.md) | `ApprCallbackResult` |  |
| `getApprId` | 1205 | [`apr01_appr.getApprId`](../../apr/sql/apr01_appr.md) | `Apr18_Lookup_Appr` |  |
| `updateParentId` | 1213 | [`apr01_appr.updateParentId`](../../apr/sql/apr01_appr.md) | `Dcr01_Move_DcrClass` |  |
| `updatePutSealEmpId` | 1230 | [`apr01_appr.updatePutSeal`](../../apr/sql/apr01_appr.md) | `Apr01_Tab_StampSeq` |  |
| `modelUpdate` | 1263 | [`apr92_appr_modi.insert`](../../apr/sql/apr92_appr_modi.md), [`apr92_appr_modi.selectByPersonId`](../../apr/sql/apr92_appr_modi.md), [`apr92_appr_modi.updateReason`](../../apr/sql/apr92_appr_modi.md), `UpdateDataModel(apr01_appr)` 동적 INSERT/UPDATE | `Apr01_Edit_ApprModi` | `UpdateDataModel` |
