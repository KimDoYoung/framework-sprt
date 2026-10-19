# sys.Sys00_Common

`server/sys/Sys00_Common.java`

서비스 키 `sys.Sys00_Common.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectDeadLine` | 21 | [`sys00_common.selectDeadLine`](../../sys/sql/sys00_common.md) | `Sch01_Lookup_Info`, `Sch03_Lookup_Icr`, `Sch03_Lookup_Ics`, `Sch20_Edit_Checklist` |  |
| `selectCompanyInfo` | 26 | [`sys00_common.selectCompanyInfo`](../../sys/sql/sys00_common.md) | - |  |
| `selectLocName` | 31 | [`sys00_common.selectLocName`](../../sys/sql/sys00_common.md) | `Sys03_Lookup_CompanyMenu` |  |
| `selectLocName2` | 36 | [`sys00_common.selectLocName2`](../../sys/sql/sys00_common.md) | `Sys03_Lookup_CompanyMenu` |  |
| `selectCompanyName` | 41 | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) | `Ics17_Tab_UserRequestAdmin`, `Sms03_Page_UserListAdmin`, `Sys26_Tab_LoginHistory`, `Sys27_Tab_LoginManage`, `Sys53_Tab_SpecificMenuRequestAdmin`, `Sys86_Tab_Websocket`, `Sys90_Tab_AfterServiceAdmin`, `Sys96_Tab_MenuLogAdmin`, `Sys96_Tab_OpenMenuLogAdmin` |  |
| `selectMenuName` | 46 | [`sys00_common.selectMenuName`](../../sys/sql/sys00_common.md) | `Sys06_Tab_MenuGuide` |  |
| `selectCompanyInfoName` | 51 | [`sys00_common.selectCompanyInfoName`](../../sys/sql/sys00_common.md) | - |  |
| `selectEvalGrade` | 56 | [`sys09_code.selectEvalGrade`](../../sys/sql/sys09_code.md) | `Emp44_Lookup_Write` |  |
| `selectCertCode` | 61 | [`sys00_common.selectCertCode`](../../sys/sql/sys00_common.md) | `Emp16_Lookup_CertList`, `Emp16_TabPage_CertMapping` |  |
| `selectByFormCode` | 66 | [`sys00_common.selectByFormCode`](../../sys/sql/sys00_common.md) | - |  |
| `selectBenefitCode` | 71 | [`sys00_common.selectBenefitCode`](../../sys/sql/sys00_common.md) | - |  |
| `selectBizCardManager` | 76 | [`sys00_common.selectBizCardManager`](../../sys/sql/sys00_common.md) | `Biz01_Lookup_Message`, `Biz01_Tab_CardContents`, `Biz01_Tab_CardContentsSimple`, `Biz01_Tab_CardManagement` |  |
| `selectCardManager` | 81 | [`sys00_common.selectCardManager`](../../sys/sql/sys00_common.md) | `Crd01_Tab_Card` |  |
| `selectDeposit` | 86 | [`sys00_common.selectDeposit`](../../sys/sql/sys00_common.md) | - |  |
| `selectForDeposit` | 91 | [`sys00_common.selectForDeposit`](../../sys/sql/sys00_common.md) | `Ast06_Lookup_TrForFinance`, `Ast06_Lookup_TrForIntrinsic`, `Ast07_Lookup_ForSettle` |  |
| `selectAllDeposit` | 96 | [`sys00_common.selectAllDeposit`](../../sys/sql/sys00_common.md) | - |  |
| `selectWindowUseTrCode` | 101 | [`sys00_common.selectWindowUseTrCode`](../../sys/sql/sys00_common.md) | `Ast06_Lookup_TrBizCard`, `Ast13_Lookup_ExpenseOfficeAssets` |  |
| `selectByKindGroupCode` | 106 | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) | `Act14_Lookup_LinkProvideContent`, `Apr16_Lookup_StampDocReg`, `Apr16_Tab_StampDocManager`, `Apr31_Page_ApprStepGroupMember`, `Ast09_Tab_FinanceBookOpr`, `Ast25_Lookup_Price`, `Ast25_Tab_Price`, `Bbs02_Edit_Notice`, `Bbs02_Edit_NoticeAdmin`, `Bbs02_Lookup_LoadBbs`, `Bbs02_Tab_NoticeAdmin`, `Bbs02_Tab_NoticeManager`, `Bbs20_Tab_FloralRequestMng`, `Biz01_Edit_Account`, `Biz01_Edit_Card`, `Biz01_Edit_CardSimple`, `Biz01_Lookup_CardManagement`, `Biz01_TabPage_List`, `Biz01_Tab_CardContents`, `Biz01_Tab_CardContentsSimple`, `Biz01_Tab_CardManagement`, `Biz11_Edit_ContHistory`, `Biz51_Edit_ErpContCorp`, `Bmt01_Tab_Buy`, `Emp15_Lookup_Cert`, `Emp15_Lookup_StampDocCert`, `Emp21_Lookup_Insert`, `Emp21_TabPage_UnLeaveList1`, `Emp21_TabPage_UnLeaveList2`, `Emp43_Tab_EvalExecute`, `Emp43_Tab_EvalResult`, `Emp43_Tab_EvalTarget`, `Emp43_Tab_FinalAppr`, `Emp43_Tab_FirstAppr`, `Flt10_Lookup_RightsExercise`, `Flt10_Tab_RealTransaction`, `Flt10_Tab_RightsExercise`, `Flt10_Tab_TrList`, `Flt10_Tab_TrListAdmin`, `Pay10_Lookup_GroupList`, `Pay31_Lookup_Insert1`, `Pay31_Lookup_Insert2`, `Pay31_Popup_InsureApply`, `Pay31_TabPage_InsureApply3`, `Pay31_TabPage_InsureApply4`, `Pay32_Lookup_Detail`, `Pay32_Tab_InsurePay`, `Pay50_Lookup_ExpenseRequestInsert`, `Pay50_Lookup_ExpenseUnJournal`, `Pay50_Tab_Expense`, `Pay50_Tab_ExpenseJournal`, `Pay50_Tab_ExpenseManager`, `Rpt10_Edit_WriteGuide`, `Sch01_Tab_List`, `Sch01_Tab_ListOrg`, `Sch03_TabPage_Cycle04`, `Sch03_TabPage_Cycle05`, `Sch04_Tab_IcsList`, `Sch04_Tab_IcsListManager`, `Sys01_TabPage_Info04`, `Sys15_Lookup_Corp_OnlyKFS`, `Tdm05_Edit_Cncl`, `Tdm43_Edit_Manl`, `Tdm43_Edit_Manl_20260309`, `Tdm52_Edit_ChckManl`, `Tdm52_Edit_ChckManlBatch` |  |
| `selectByKindCode` | 111 | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) | `Ast13_Lookup_BookDepn`, `Bbs02_Edit_NoticeAdmin`, `Bbs02_Tab_NoticeViewLaw`, `Bbs02_Tab_NoticeViewMgt`, `Bmt10_Lookup_InfoList`, `Bmt10_Tab_Info` |  |
| `selectByProvideContentCode` | 116 | [`sys00_common.selectByProvideContentCode`](../../sys/sql/sys00_common.md) | `Biz01_Edit_Card`, `Biz01_Edit_CardSimple`, `Biz01_Lookup_CardManagement` |  |
| `selectByFltItemType` | 121 | [`sys00_common.selectByFltItemType`](../../sys/sql/sys00_common.md) | `Flt10_Lookup_RightsExercise`, `Flt10_Tab_BuyReport`, `Flt10_Tab_RealTransaction`, `Flt13_Lookup_BookInit` |  |
| `selectDevStatus` | 126 | [`sys00_common.selectDevStatus`](../../sys/sql/sys00_common.md) | `Scm10_Tab_Dev`, `Scm11_Tab_DevTest` |  |
| `selectAccountCloseDate` | 131 | [`dbConfig.getAccountCloseDate`](../../utils/sql/dbConfig.md) | `Act04_Tab_ReportBS`, `Act04_Tab_ReportPL` |  |
| `selectPreQuarterCloseDate` | 136 | [`dbConfig.getPreQuarterCloseDate`](../../utils/sql/dbConfig.md) | `Act04_Tab_ReportBS`, `Act04_Tab_ReportPL` |  |
| `selectLeaveCode` | 141 | [`sys00_common.selectLeaveCode`](../../sys/sql/sys00_common.md) | `Emp20_Edit_Leave` |  |
| `selectBenefit` | 146 | [`sys00_common.selectBenefit`](../../sys/sql/sys00_common.md) | `Emp17_Lookup_Benefit`, `Emp17_Tab_Benefit`, `Emp17_Tab_BenefitManager` |  |
| `selectSpcLeaveCode` | 151 | [`sys00_common.selectSpcLeaveCode`](../../sys/sql/sys00_common.md) | `Emp20_Edit_Leave` |  |
| `selectDepnItemType` | 156 | [`sys00_common.selectDepnItemType`](../../sys/sql/sys00_common.md) | `Ast13_Tab_DepnBook` |  |
| `selectOfficeAssets` | 161 | [`sys00_common.selectOfficeAssets`](../../sys/sql/sys00_common.md) | `Ast13_Tab_OfficeAssets` |  |
| `selectScheduleClass` | 166 | [`sys09_code.selectScheduleClass`](../../sys/sql/sys09_code.md) | `Sch01_Lookup_Info`, `Sch01_Lookup_ManagerModi`, `Sch01_Tab_Info` |  |
| `selectScheduleClass2` | 171 | [`sys09_code.selectScheduleClass2`](../../sys/sql/sys09_code.md) | `Sch01_Tab_List`, `Sch04_Tab_DailyCheckList`, `Sch04_Tab_DailyCheckListStatus`, `Sch04_Tab_List`, `Sch04_Tab_ToDoList` |  |
| `selectWeekBizClass` | 176 | [`sys09_code.selectWeekBizClass`](../../sys/sql/sys09_code.md) | `Rpt03_Lookup_WeekWrite` |  |
| `selectIcs41DcrType` | 181 | [`sys09_code.selectIcs41DcrType`](../../sys/sql/sys09_code.md) | `Ics40_Edit_DcrPreconfirm`, `Ics40_Tab_DcrPreConfirm`, `Ics40_Tab_DcrReviewConfirm` |  |
| `selectWeekListByMonth` | 186 | - | `Rpt03_Tab_WeekWrite`, `Rpt04_Tab_WeekConfirm` |  |
