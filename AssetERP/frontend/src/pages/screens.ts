import React from 'react';
import { Bbs02_Tab_NoticeViewLaw } from './bbs/Bbs02_Tab_NoticeViewLaw';
import { Bbs02_Tab_NoticeViewMgt } from './bbs/Bbs02_Tab_NoticeViewMgt';
import { Bbs15_Tab_CompanyRuleManager } from './bbs/Bbs15_Tab_CompanyRuleManager';
import { Bbs15_Tab_CompanyRule } from './bbs/Bbs15_Tab_CompanyRule';
import { Bbs02_Tab_NoticeView } from './bbs/Bbs02_Tab_NoticeView';
import { Bbs02_Tab_NoticeManager } from './bbs/Bbs02_Tab_NoticeManager';
import { Bbs02_Tab_NoticeAdmin } from './bbs/Bbs02_Tab_NoticeAdmin';
import { Mkt01_Tab_TargetCompany } from './mkt/Mkt01_Tab_TargetCompany';
import { Mkt03_Tab_HistoryManager } from './mkt/Mkt03_Tab_HistoryManager';
import { Bbs10_Tab_BizShare } from './bbs/Bbs10_Tab_BizShare';
import { Bbs30_Tab_ClassTree } from './bbs/Bbs30_Tab_ClassTree';
import { Bbs11_Tab_Application } from './bbs/Bbs11_Tab_Application';
import { Bbs11_Tab_ApplicationMng } from './bbs/Bbs11_Tab_ApplicationMng';
import { Bbs20_Tab_FloralRequestMng } from './bbs/Bbs20_Tab_FloralRequestMng';
import { Bbs20_Tab_FloralRequest } from './bbs/Bbs20_Tab_FloralRequest';
import { Chk01_Tab_ClassTree } from './chk/Chk01_Tab_ClassTree';
import { Chk02_Tab_DailyList } from './chk/Chk02_Tab_DailyList';
import { Chk02_Tab_DailyListAdmin } from './chk/Chk02_Tab_DailyListAdmin';
import { Chk03_Tab_DailyListWrite } from './chk/Chk03_Tab_DailyListWrite';
import { Chk03_Tab_DailyListConfirm } from './chk/Chk03_Tab_DailyListConfirm';
import { Chk03_Tab_DailyListStatus } from './chk/Chk03_Tab_DailyListStatus';
import { Dbm01_Tab_TabComments } from './dbm/Dbm01_Tab_TabComments';
import { Dbm10_Tab_MakePdf } from './dbm/Dbm10_Tab_MakePdf';
import { Emp00_Tab_ChangeHistory } from './emp/Emp00_Tab_ChangeHistory';
import { Emp31_Tab_Director } from './emp/Emp31_Tab_Director';
import { Emp35_Tab_DeductPerson } from './emp/Emp35_Tab_DeductPerson';
import { Emp00_Tab_OrgPerson } from './emp/Emp00_Tab_OrgPerson';
import { Emp15_Tab_Cert } from './emp/Emp15_Tab_Cert';
import { Emp20_Tab_LeaveManager } from './emp/Emp20_Tab_LeaveManager';
import { Emp20_Tab_YearList } from './emp/Emp20_Tab_YearList';
import { Emp21_Tab_UnLeaveList } from './emp/Emp21_Tab_UnLeaveList';
import { Emp24_Tab_JointLeave } from './emp/Emp24_Tab_JointLeave';
import { Emp22_Tab_EtcLeave } from './emp/Emp22_Tab_EtcLeave';
import { Emp53_Tab_BizTripManager } from './emp/Emp53_Tab_BizTripManager';
import { Emp54_Tab_ErrandManager } from './emp/Emp54_Tab_ErrandManager';
import { Emp00_Tab_TransInfo } from './emp/Emp00_Tab_TransInfo';
import { Emp00_Tab_RoleMenu } from './emp/Emp00_Tab_RoleMenu';
import { Emp01_Tab_UserInfo } from './emp/Emp01_Tab_UserInfo';
import { Flt00_Tab_Info } from './flt/Flt00_Tab_Info';
import { Flt03_Tab_AccountAdmin } from './flt/Flt03_Tab_AccountAdmin';
import { Flt03_Tab_AccountReport } from './flt/Flt03_Tab_AccountReport';
import { Flt10_Tab_BuyReport } from './flt/Flt10_Tab_BuyReport';
import { Flt10_Tab_RealTransaction } from './flt/Flt10_Tab_RealTransaction';
import { Flt10_Tab_SellReport } from './flt/Flt10_Tab_SellReport';
import { Flt10_Tab_AcntTransfer } from './flt/Flt10_Tab_AcntTransfer';
import { Flt10_Tab_RightsExercise } from './flt/Flt10_Tab_RightsExercise';
import { Flt10_Tab_PreApprove } from './flt/Flt10_Tab_PreApprove';
import { Flt10_Tab_TrList } from './flt/Flt10_Tab_TrList';
import { Flt10_Tab_TrListAdmin } from './flt/Flt10_Tab_TrListAdmin';
import { Flt11_Tab_BookList } from './flt/Flt11_Tab_BookList';
import { Flt11_Tab_BookListAdmin } from './flt/Flt11_Tab_BookListAdmin';
import { Flt10_Tab_ViolateUser } from './flt/Flt10_Tab_ViolateUser';
import { Flt10_Tab_Violate } from './flt/Flt10_Tab_Violate';
import { Flt10_Tab_EmpAppr } from './flt/Flt10_Tab_EmpAppr';
import { Flt02_Tab_EmpInfo } from './flt/Flt02_Tab_EmpInfo';
import { Flt10_Tab_CeoReport } from './flt/Flt10_Tab_CeoReport';
import { Flt01_Tab_CompanyStd } from './flt/Flt01_Tab_CompanyStd';
import { Flt05_Tab_ItemTypeAdmin } from './flt/Flt05_Tab_ItemTypeAdmin';
import { Fnd01_Tab_FundPlan } from './fnd/Fnd01_Tab_FundPlan';
import { Fnd08_Tab_OrgAuthTempFund } from './fnd/Fnd08_Tab_OrgAuthTempFund';
import { Fnd08_Tab_OrgAuth } from './fnd/Fnd08_Tab_OrgAuth';
import { Fnd01_Tab_FundSearch } from './fnd/Fnd01_Tab_FundSearch';
import { Fnd01_Tab_FundIcamHistory } from './fnd/Fnd01_Tab_FundIcamHistory';
import { Fnd10_Tab_RelateAst } from './fnd/Fnd10_Tab_RelateAst';
import { Fnd10_Tab_RelateFnd } from './fnd/Fnd10_Tab_RelateFnd';
import { Fnd11_Tab_BookExtr } from './fnd/Fnd11_Tab_BookExtr';
import { Fnd25_Tab_FundTermsManager } from './fnd/Fnd25_Tab_FundTermsManager';
import { Fnd25_Tab_FundTerms } from './fnd/Fnd25_Tab_FundTerms';
import { Fnd01_Tab_FundCode } from './fnd/Fnd01_Tab_FundCode';
import { Adv02_Tab_Account } from './adv/Adv02_Tab_Account';
import { Adv05_Tab_OrgAuth } from './adv/Adv05_Tab_OrgAuth';
import { Adv11_Tab_BookExtr } from './adv/Adv11_Tab_BookExtr';
import { Fnd20_Tab_Plan } from './fnd/Fnd20_Tab_Plan';
import { Fnd20_Tab_PlanEmp } from './fnd/Fnd20_Tab_PlanEmp';
import { Fnd03_Tab_Consignment } from './fnd/Fnd03_Tab_Consignment';
import { Fnd03_Tab_ConsignmentManager } from './fnd/Fnd03_Tab_ConsignmentManager';
import { Fnd06_Tab_OfficeWork } from './fnd/Fnd06_Tab_OfficeWork';
import { Fnd06_Tab_OfficeWorkManager } from './fnd/Fnd06_Tab_OfficeWorkManager';
import { Ast01_Tab_InfoManager } from './ast/Ast01_Tab_InfoManager';
import { Ast01_Tab_ClassTreeManagement } from './ast/Ast01_Tab_ClassTreeManagement';
import { Ast01_Tab_ClassTreeIntrinsic } from './ast/Ast01_Tab_ClassTreeIntrinsic';
import { Ast01_Tab_InfoIntrinsic } from './ast/Ast01_Tab_InfoIntrinsic';
import { Ast40_Tab_OwnerCapital } from './ast/Ast40_Tab_OwnerCapital';
import { Ast01_Tab_InfoManagement } from './ast/Ast01_Tab_InfoManagement';
import { Fnd09_Tab_TrustBank } from './fnd/Fnd09_Tab_TrustBank';
import { Fnd09_Tab_TrustBankManager } from './fnd/Fnd09_Tab_TrustBankManager';
import { Ics01_Tab_ClassTree } from './ics/Ics01_Tab_ClassTree';
import { Ics01_Tab_ApprList } from './ics/Ics01_Tab_ApprList';
import { Apr90_Tab_DisposalAppr } from './apr/Apr90_Tab_DisposalAppr';
import { Apr90_Tab_DisposalList } from './apr/Apr90_Tab_DisposalList';
import { Apr90_Tab_DisposalListAdmin } from './apr/Apr90_Tab_DisposalListAdmin';
import { Apr01_Tab_Restore } from './apr/Apr01_Tab_Restore';
import { Apr30_Tab_ApprStepGroup } from './apr/Apr30_Tab_ApprStepGroup';
import { Apr07_Tab_AltApprMgr } from './apr/Apr07_Tab_AltApprMgr';
import { Apr01_Tab_MyApproveList } from './apr/Apr01_Tab_MyApproveList';
import { Apr01_Tab_MyRequestList } from './apr/Apr01_Tab_MyRequestList';
import { Apr01_Tab_BizPriorApproval } from './apr/Apr01_Tab_BizPriorApproval';
import { Apr01_Tab_ExternalBiz } from './apr/Apr01_Tab_ExternalBiz';
import { Apr01_Tab_MyReferenceList } from './apr/Apr01_Tab_MyReferenceList';
import { Apr01_Tab_MyAuthList } from './apr/Apr01_Tab_MyAuthList';
import { Apr01_Tab_StampSeq } from './apr/Apr01_Tab_StampSeq';
import { Apr01_Tab_TotalList } from './apr/Apr01_Tab_TotalList';
import { Apr01_Tab_SubList } from './apr/Apr01_Tab_SubList';
import { Apr07_Tab_AltAppr } from './apr/Apr07_Tab_AltAppr';
import { Apr10_Tab_Stamp } from './apr/Apr10_Tab_Stamp';
import { Apr15_Tab_ReprCorp } from './apr/Apr15_Tab_ReprCorp';
import { Apr16_Tab_StampDocManager } from './apr/Apr16_Tab_StampDocManager';
import { Apr16_Tab_StampList } from './apr/Apr16_Tab_StampList';
import { Apr16_Tab_StampDocAppl } from './apr/Apr16_Tab_StampDocAppl';
import { Apr16_Tab_StampListOrg } from './apr/Apr16_Tab_StampListOrg';
import { Apr16_Tab_StampFileCheck } from './apr/Apr16_Tab_StampFileCheck';
import { Emp60_Tab_Sign } from './emp/Emp60_Tab_Sign';
import { Emp30_Tab_ApprStepExcept } from './emp/Emp30_Tab_ApprStepExcept';
import { Emp10_Tab_AddrBook } from './emp/Emp10_Tab_AddrBook';
import { Emp10_Tab_PublicAddrBook } from './emp/Emp10_Tab_PublicAddrBook';
import { Cmp10_Tab_MailBook } from './cmp/Cmp10_Tab_MailBook';
import { Dcr10_Tab_MailHistory } from './dcr/Dcr10_Tab_MailHistory';
import { Dcr00_Tab_DocList } from './dcr/Dcr00_Tab_DocList';
import { Dcr00_Tab_FileList } from './dcr/Dcr00_Tab_FileList';
import { Fbx01_Tab_Document } from './fbx/Fbx01_Tab_Document';
import { Fbx01_Tab_Search } from './fbx/Fbx01_Tab_Search';
import { Dcr00_Tab_ApprList } from './dcr/Dcr00_Tab_ApprList';
import { Apr01_Tab_FundDocument } from './apr/Apr01_Tab_FundDocument';
import { Apr01_Tab_ItemDocument } from './apr/Apr01_Tab_ItemDocument';
import { Ics01_Tab_IcsFileUpload } from './ics/Ics01_Tab_IcsFileUpload';
import { Ics10_Tab_ChecklistAdmin } from './ics/Ics10_Tab_ChecklistAdmin';
import { Ics10_Tab_Checklist } from './ics/Ics10_Tab_Checklist';
import { Ics17_Tab_UserRequestAdmin } from './ics/Ics17_Tab_UserRequestAdmin';
import { Ics17_Tab_UserRequest } from './ics/Ics17_Tab_UserRequest';
import { Ics30_Tab_Compliance } from './ics/Ics30_Tab_Compliance';
import { Ics35_Tab_ExtrActivity } from './ics/Ics35_Tab_ExtrActivity';
import { Ics35_Tab_ExtrActivityList } from './ics/Ics35_Tab_ExtrActivityList';
import { Ics40_Tab_DcrPreConfirm } from './ics/Ics40_Tab_DcrPreConfirm';
import { Ics40_Tab_DcrReviewConfirm } from './ics/Ics40_Tab_DcrReviewConfirm';
import { Biz90_Tab_Limit } from './biz/Biz90_Tab_Limit';
import { Biz01_Tab_Card } from './biz/Biz01_Tab_Card';
import { Biz01_Tab_Other } from './biz/Biz01_Tab_Other';
import { Biz01_Tab_CardContents } from './biz/Biz01_Tab_CardContents';
import { Biz01_Tab_CardSimple } from './biz/Biz01_Tab_CardSimple';
import { Biz01_Tab_CardContentsSimple } from './biz/Biz01_Tab_CardContentsSimple';
import { Biz01_Tab_PriorApprovalSimple } from './biz/Biz01_Tab_PriorApprovalSimple';
import { Biz01_Tab_OtherSimple } from './biz/Biz01_Tab_OtherSimple';
import { Biz01_Tab_LimitCheckList } from './biz/Biz01_Tab_LimitCheckList';
import { Bmt01_Tab_Buy } from './bmt/Bmt01_Tab_Buy';
import { Bmt12_Tab_EmpIct } from './bmt/Bmt12_Tab_EmpIct';
import { Bmt10_Tab_Info } from './bmt/Bmt10_Tab_Info';
import { Bmt12_Tab_PcList } from './bmt/Bmt12_Tab_PcList';
import { Ast09_Tab_DepositBook } from './ast/Ast09_Tab_DepositBook';
import { Biz01_Tab_PriorApproval } from './biz/Biz01_Tab_PriorApproval';
import { Ics15_Tab_ChecklistWrite } from './ics/Ics15_Tab_ChecklistWrite';
import { Ics15_Tab_ChecklistConfirm } from './ics/Ics15_Tab_ChecklistConfirm';
import { Ics15_Tab_ChecklistStatus } from './ics/Ics15_Tab_ChecklistStatus';
import { Ics15_Tab_ChecklistStatusDetail } from './ics/Ics15_Tab_ChecklistStatusDetail';
import { Ics31_Tab_ComplianceWrite } from './ics/Ics31_Tab_ComplianceWrite';
import { Ics31_Tab_ComplianceConfirm } from './ics/Ics31_Tab_ComplianceConfirm';
import { Ics31_Tab_ComplianceReport } from './ics/Ics31_Tab_ComplianceReport';
import { Ics20_Tab_RevisionHistoryAdmin } from './ics/Ics20_Tab_RevisionHistoryAdmin';
import { Ics01_Tab_ClassTreeUser } from './ics/Ics01_Tab_ClassTreeUser';
import { Ics01_Tab_IcsFileUser } from './ics/Ics01_Tab_IcsFileUser';
import { Ics01_Tab_ClassTreeUserView } from './ics/Ics01_Tab_ClassTreeUserView';
import { Ics02_Tab_Manager } from './ics/Ics02_Tab_Manager';
import { Ics01_Tab_PeriodList } from './ics/Ics01_Tab_PeriodList';
import { Ics20_Tab_RevisionHistory } from './ics/Ics20_Tab_RevisionHistory';
import { Icr01_Tab_ClassTreeView } from './icr/Icr01_Tab_ClassTreeView';
import { Icr01_Tab_ClassTree } from './icr/Icr01_Tab_ClassTree';
import { Icam03_Tab_Fund } from './icam/Icam03_Tab_Fund';
import { Icam55_Tab_UserRegAppr } from './icam/Icam55_Tab_UserRegAppr';
import { Icam55_Tab_UserApprResult } from './icam/Icam55_Tab_UserApprResult';
import { Icam06_Tab_FundPrice } from './icam/Icam06_Tab_FundPrice';
import { Icam06_Tab_FundOperateStatus } from './icam/Icam06_Tab_FundOperateStatus';
import { Icam10_Tab_CurrentFeeByFund } from './icam/Icam10_Tab_CurrentFeeByFund';
import { Icam10_Tab_FeeAdmin } from './icam/Icam10_Tab_FeeAdmin';
import { Icam10_Tab_OfficeMngFee } from './icam/Icam10_Tab_OfficeMngFee';
import { Icam10_Tab_FundMngFee } from './icam/Icam10_Tab_FundMngFee';
import { Icam12_Tab_FundMngFeeBook } from './icam/Icam12_Tab_FundMngFeeBook';
import { Ast30_Tab_OfficeMngFeeState } from './ast/Ast30_Tab_OfficeMngFeeState';
import { Ast30_Tab_FundMngFee } from './ast/Ast30_Tab_FundMngFee';
import { Ast30_Tab_FundMngFeeState } from './ast/Ast30_Tab_FundMngFeeState';
import { Ast30_Tab_OfficeMngFeeStatePeriod } from './ast/Ast30_Tab_OfficeMngFeeStatePeriod';
import { Ast33_Tab_OfficeMngFundTrans } from './ast/Ast33_Tab_OfficeMngFundTrans';
import { Ast33_Tab_FundMngTrans } from './ast/Ast33_Tab_FundMngTrans';
import { Icam12_Tab_OfficeMngFeeBook } from './icam/Icam12_Tab_OfficeMngFeeBook';
import { Icam11_Tab_OfficeMngFeeDeposit } from './icam/Icam11_Tab_OfficeMngFeeDeposit';
import { Icam11_Tab_FundMngFeeDeposit } from './icam/Icam11_Tab_FundMngFeeDeposit';
import { Icam50_Tab_DbSource } from './icam/Icam50_Tab_DbSource';
import { Icam99_Tab_Test } from './icam/Icam99_Tab_Test';
import { Ifi90_Tab_Config } from './ifi/Ifi90_Tab_Config';
import { Org01_Tab_OrgCode } from './org/Org01_Tab_OrgCode';
import { Pay20_Tab_Deduct } from './pay/Pay20_Tab_Deduct';
import { Pay20_Tab_DeductAdmin } from './pay/Pay20_Tab_DeductAdmin';
import { Pay01_Tab_Annual } from './pay/Pay01_Tab_Annual';
import { Pay01_Tab_AnnualList } from './pay/Pay01_Tab_AnnualList';
import { Pay01_Tab_AnnualPerson } from './pay/Pay01_Tab_AnnualPerson';
import { Pay40_Tab_TaxWithholding } from './pay/Pay40_Tab_TaxWithholding';
import { Pay08_Tab_TaxWithholding } from './pay/Pay08_Tab_TaxWithholding';
import { Pay08_Tab_TaxWithholdingAdmin } from './pay/Pay08_Tab_TaxWithholdingAdmin';
import { Pay31_Tab_InsureApply } from './pay/Pay31_Tab_InsureApply';
import { Pay32_Tab_InsurePay } from './pay/Pay32_Tab_InsurePay';
import { Pay10_Tab_Month } from './pay/Pay10_Tab_Month';
import { Pay10_Tab_MonthItem } from './pay/Pay10_Tab_MonthItem';
import { Pay10_Tab_MonthSearch } from './pay/Pay10_Tab_MonthSearch';
import { Pay10_Tab_PersonList } from './pay/Pay10_Tab_PersonList';
import { Pay10_Tab_PersonListManager } from './pay/Pay10_Tab_PersonListManager';
import { Pay50_Tab_ExpenseManager } from './pay/Pay50_Tab_ExpenseManager';
import { Pay50_Tab_Expense } from './pay/Pay50_Tab_Expense';
import { Pay50_Tab_ExpensePayWrite } from './pay/Pay50_Tab_ExpensePayWrite';
import { Pay50_Tab_ExpensePay } from './pay/Pay50_Tab_ExpensePay';
import { Pay50_Tab_ExpenseJournal } from './pay/Pay50_Tab_ExpenseJournal';
import { Pay50_Tab_ExpenseSettle } from './pay/Pay50_Tab_ExpenseSettle';
import { Pay50_Tab_ExpenseConfirm } from './pay/Pay50_Tab_ExpenseConfirm';
import { Pay50_Tab_ExpenseRequest } from './pay/Pay50_Tab_ExpenseRequest';
import { Pay50_Tab_AccountSumList } from './pay/Pay50_Tab_AccountSumList';
import { Crd01_Tab_Card } from './crd/Crd01_Tab_Card';
import { Crd02_Tab_DataUpload } from './crd/Crd02_Tab_DataUpload';
import { Biz01_Tab_CardManagement } from './biz/Biz01_Tab_CardManagement';
import { Biz01_Tab_CardUserAllocation } from './biz/Biz01_Tab_CardUserAllocation';
import { Biz01_Tab_CardReport } from './biz/Biz01_Tab_CardReport';
import { Biz60_Tab_FundPriceModiReport } from './biz/Biz60_Tab_FundPriceModiReport';
import { Biz01_Tab_EntertmExpenseReport } from './biz/Biz01_Tab_EntertmExpenseReport';
import { Pay10_Tab_List } from './pay/Pay10_Tab_List';
import { Pay10_Tab_Retire } from './pay/Pay10_Tab_Retire';
import { Pay34_Tab_WorkTimeConfig } from './pay/Pay34_Tab_WorkTimeConfig';
import { Crd10_Tab_ExcelCompanyAdmin } from './crd/Crd10_Tab_ExcelCompanyAdmin';
import { Emp55_Tab_benefitInfoManager } from './emp/Emp55_Tab_benefitInfoManager';
import { Emp41_Tab_EvalList } from './emp/Emp41_Tab_EvalList';
import { Emp43_Tab_EvalTarget } from './emp/Emp43_Tab_EvalTarget';
import { Emp43_Tab_EvalExecute } from './emp/Emp43_Tab_EvalExecute';
import { Emp43_Tab_FirstAppr } from './emp/Emp43_Tab_FirstAppr';
import { Emp43_Tab_FinalAppr } from './emp/Emp43_Tab_FinalAppr';
import { Emp43_Tab_EvalResult } from './emp/Emp43_Tab_EvalResult';
import { Att02_Tab_CommuteAdmin } from './att/Att02_Tab_CommuteAdmin';
import { Att03_Tab_OvertimeReq } from './att/Att03_Tab_OvertimeReq';
import { Att02_Tab_CommuteStatus } from './att/Att02_Tab_CommuteStatus';
import { Att02_Tab_PersonStatus } from './att/Att02_Tab_PersonStatus';
import { Car01_Tab_Info } from './car/Car01_Tab_Info';
import { Car03_Tab_List } from './car/Car03_Tab_List';
import { Car04_Tab_PrivateJournal } from './car/Car04_Tab_PrivateJournal';
import { Car04_Tab_PublicJournal } from './car/Car04_Tab_PublicJournal';
import { Car04_Tab_PublicJournalAdmin } from './car/Car04_Tab_PublicJournalAdmin';
import { Car04_Tab_Journal } from './car/Car04_Tab_Journal';
import { Rpt01_Tab_DailyConfirm } from './rpt/Rpt01_Tab_DailyConfirm';
import { Rpt02_Tab_MonthWrite } from './rpt/Rpt02_Tab_MonthWrite';
import { Rpt04_Tab_WeekConfirm } from './rpt/Rpt04_Tab_WeekConfirm';
import { Rpt03_Tab_WeekWrite } from './rpt/Rpt03_Tab_WeekWrite';
import { Rpt01_Tab_DailyWrite } from './rpt/Rpt01_Tab_DailyWrite';
import { Rpt10_Tab_FssOrg } from './rpt/Rpt10_Tab_FssOrg';
import { Emp01_Tab_InoutState } from './emp/Emp01_Tab_InoutState';
import { Emp01_Tab_DueDiligence } from './emp/Emp01_Tab_DueDiligence';
import { Car04_Tab_PrivateJournalAdmin } from './car/Car04_Tab_PrivateJournalAdmin';
import { Act01_Tab_AccountCode } from './act/Act01_Tab_AccountCode';
import { Act10_Tab_ReprAccount } from './act/Act10_Tab_ReprAccount';
import { Ast05_Tab_TrCodeAdmin } from './ast/Ast05_Tab_TrCodeAdmin';
import { Act11_Tab_TrJournalMap } from './act/Act11_Tab_TrJournalMap';
import { Act13_Tab_RealAccountMap } from './act/Act13_Tab_RealAccountMap';
import { Act02_Tab_Journal } from './act/Act02_Tab_Journal';
import { Act02_Tab_ForJournal } from './act/Act02_Tab_ForJournal';
import { Act02_Tab_JournalSub } from './act/Act02_Tab_JournalSub';
import { Act04_Tab_GenLedger } from './act/Act04_Tab_GenLedger';
import { Act04_Tab_ReportPL } from './act/Act04_Tab_ReportPL';
import { Act04_Tab_ReportBS } from './act/Act04_Tab_ReportBS';
import { Act04_Tab_ReportFSS } from './act/Act04_Tab_ReportFSS';
import { Ast09_Tab_PreDepositBook } from './ast/Ast09_Tab_PreDepositBook';
import { Act04_Tab_Close } from './act/Act04_Tab_Close';
import { Act15_Tab_CloseCheck } from './act/Act15_Tab_CloseCheck';
import { Act02_Tab_DepositIoList } from './act/Act02_Tab_DepositIoList';
import { Act02_Tab_CreateJournal } from './act/Act02_Tab_CreateJournal';
import { Act02_Tab_JournalFix } from './act/Act02_Tab_JournalFix';
import { Act02_Tab_CreateForJournal } from './act/Act02_Tab_CreateForJournal';
import { Act02_Tab_CreateJournalBiz } from './act/Act02_Tab_CreateJournalBiz';
import { Ast09_Tab_DepositBookPeriod } from './ast/Ast09_Tab_DepositBookPeriod';
import { Ast06_Tab_TrTax } from './ast/Ast06_Tab_TrTax';
import { Ast06_Tab_TrFinance } from './ast/Ast06_Tab_TrFinance';
import { Ast06_Tab_TrIntrinsic } from './ast/Ast06_Tab_TrIntrinsic';
import { Ast06_Tab_AccruedIntrinsic } from './ast/Ast06_Tab_AccruedIntrinsic';
import { Ast06_Tab_TrForFinance } from './ast/Ast06_Tab_TrForFinance';
import { Ast06_Tab_TrForIntrinsic } from './ast/Ast06_Tab_TrForIntrinsic';
import { Ast06_Tab_AccruedForIntrinsic } from './ast/Ast06_Tab_AccruedForIntrinsic';
import { Ast06_Tab_TrAcntTransfer } from './ast/Ast06_Tab_TrAcntTransfer';
import { Ast06_Tab_TrDepositInt } from './ast/Ast06_Tab_TrDepositInt';
import { Ast06_Tab_TrDeposit } from './ast/Ast06_Tab_TrDeposit';
import { Ast06_Tab_TrForDeposit } from './ast/Ast06_Tab_TrForDeposit';
import { Ast06_Tab_FxEvalDeposit } from './ast/Ast06_Tab_FxEvalDeposit';
import { Ast30_Tab_OfficeMngFeeClose } from './ast/Ast30_Tab_OfficeMngFeeClose';
import { Ast30_Tab_FundMngFeeClose } from './ast/Ast30_Tab_FundMngFeeClose';
import { Ast06_Tab_EvalFinance } from './ast/Ast06_Tab_EvalFinance';
import { Ast25_Tab_Price } from './ast/Ast25_Tab_Price';
import { Ast06_Tab_EvalDepn } from './ast/Ast06_Tab_EvalDepn';
import { Ast09_Tab_FinanceBook } from './ast/Ast09_Tab_FinanceBook';
import { Ast13_Tab_OfficeAssets } from './ast/Ast13_Tab_OfficeAssets';
import { Ast13_Tab_DepnBook } from './ast/Ast13_Tab_DepnBook';
import { Ast09_Tab_FinanceForBook } from './ast/Ast09_Tab_FinanceForBook';
import { Ast09_Tab_FinanceBookPeriod } from './ast/Ast09_Tab_FinanceBookPeriod';
import { Ast09_Tab_FinanceBookOpr } from './ast/Ast09_Tab_FinanceBookOpr';
import { Ast06_Tab_TrIPO } from './ast/Ast06_Tab_TrIPO';
import { Emp17_Tab_Benefit } from './emp/Emp17_Tab_Benefit';
import { Emp17_Tab_BenefitManager } from './emp/Emp17_Tab_BenefitManager';
import { Emp53_Tab_BizTrip } from './emp/Emp53_Tab_BizTrip';
import { Emp54_Tab_Errand } from './emp/Emp54_Tab_Errand';
import { Emp20_Tab_Leave } from './emp/Emp20_Tab_Leave';
import { Emp20_Tab_LeaveList } from './emp/Emp20_Tab_LeaveList';
import { Emp21_Tab_PersonList } from './emp/Emp21_Tab_PersonList';
import { Emp50_Tab_TransportExpense } from './emp/Emp50_Tab_TransportExpense';
import { Emp50_Tab_TransportExpenseMng } from './emp/Emp50_Tab_TransportExpenseMng';
import { Sms02_Tab_TotalCount } from './sms/Sms02_Tab_TotalCount';
import { Sms03_Tab_SendAdmin } from './sms/Sms03_Tab_SendAdmin';
import { Sms03_Tab_GroupSend } from './sms/Sms03_Tab_GroupSend';
import { Sys01_Tab_Company } from './sys/Sys01_Tab_Company';
import { Sys03_Tab_CompanyMenu } from './sys/Sys03_Tab_CompanyMenu';
import { Sys06_Tab_Menu } from './sys/Sys06_Tab_Menu';
import { Sys04_Tab_Role } from './sys/Sys04_Tab_Role';
import { Sys04_Tab_RoleAdmin } from './sys/Sys04_Tab_RoleAdmin';
import { Sys05_Tab_UserRole } from './sys/Sys05_Tab_UserRole';
import { Sys05_Tab_CompanyUserRole } from './sys/Sys05_Tab_CompanyUserRole';
import { Sys05_Tab_PersonRole } from './sys/Sys05_Tab_PersonRole';
import { Sys08_Tab_CodeKindAdmin } from './sys/Sys08_Tab_CodeKindAdmin';
import { Sys08_Tab_CodeKindClient } from './sys/Sys08_Tab_CodeKindClient';
import { Sys06_Tab_MenuView } from './sys/Sys06_Tab_MenuView';
import { Sys10_Tab_TotalSize } from './sys/Sys10_Tab_TotalSize';
import { Sys53_Tab_SpecificMenuRequest } from './sys/Sys53_Tab_SpecificMenuRequest';
import { Sys53_Tab_SpecificMenuRequestAdmin } from './sys/Sys53_Tab_SpecificMenuRequestAdmin';
import { Sys96_Tab_OpenMenuLogAdmin } from './sys/Sys96_Tab_OpenMenuLogAdmin';
import { Sys60_Tab_FilePolicy } from './sys/Sys60_Tab_FilePolicy';
import { Sys91_Tab_AdviceMember } from './sys/Sys91_Tab_AdviceMember';
import { Sys92_Tab_ManagementTeam } from './sys/Sys92_Tab_ManagementTeam';
import { Sys90_Tab_AfterService } from './sys/Sys90_Tab_AfterService';
import { Sys90_Tab_AfterServiceAdmin } from './sys/Sys90_Tab_AfterServiceAdmin';
import { Sys27_Tab_LoginManage } from './sys/Sys27_Tab_LoginManage';
import { Sys26_Tab_LoginHistory } from './sys/Sys26_Tab_LoginHistory';
import { Sys80_Tab_AdminUserList } from './sys/Sys80_Tab_AdminUserList';
import { Sys81_Tab_AdminUserHistory } from './sys/Sys81_Tab_AdminUserHistory';
import { Sys95_Tab_Manual } from './sys/Sys95_Tab_Manual';
import { Sys95_Tab_ManualAdmin } from './sys/Sys95_Tab_ManualAdmin';
import { Sys06_Tab_MenuGuide } from './sys/Sys06_Tab_MenuGuide';
import { Sys10_Tab_TrashFileList } from './sys/Sys10_Tab_TrashFileList';
import { Sys12_Tab_Calendar } from './sys/Sys12_Tab_Calendar';
import { Sys15_Tab_Corp } from './sys/Sys15_Tab_Corp';
import { Sys30_Tab_LeaveYear } from './sys/Sys30_Tab_LeaveYear';
import { Sys25_Tab_ResetPassword } from './sys/Sys25_Tab_ResetPassword';
import { Sys86_Tab_Websocket } from './sys/Sys86_Tab_Websocket';
import { Sys07_Tab_RoleMenu } from './sys/Sys07_Tab_RoleMenu';
import { Sys07_Tab_Company } from './sys/Sys07_Tab_Company';
import { Sys07_Tab_CompanyRoleMenu } from './sys/Sys07_Tab_CompanyRoleMenu';
import { Tdm31_Tab_RoleDescAdmin } from './tdm/Tdm31_Tab_RoleDescAdmin';
import { Tdm32_Tab_RoleDigmAdmin } from './tdm/Tdm32_Tab_RoleDigmAdmin';
import { Tdm32_Tab_RoleDigm } from './tdm/Tdm32_Tab_RoleDigm';
import { Tdm36_Tab_RoleReport } from './tdm/Tdm36_Tab_RoleReport';
import { Tdm40_Tab_ManlJob } from './tdm/Tdm40_Tab_ManlJob';
import { Tdm41_Tab_ManlDutyOrg } from './tdm/Tdm41_Tab_ManlDutyOrg';
import { Tdm43_Tab_ManlItemReg } from './tdm/Tdm43_Tab_ManlItemReg';
import { Tdm42_Tab_ManlManagerAdmin } from './tdm/Tdm42_Tab_ManlManagerAdmin';
import { Tdm42_Tab_ManlManager } from './tdm/Tdm42_Tab_ManlManager';
import { Tdm42_Tab_ManlOrgAppr } from './tdm/Tdm42_Tab_ManlOrgAppr';
import { Tdm01_Tab_Hr } from './tdm/Tdm01_Tab_Hr';
import { Tdm10_Tab_Task } from './tdm/Tdm10_Tab_Task';
import { Tdm13_Tab_TaskDuty } from './tdm/Tdm13_Tab_TaskDuty';
import { Tdm05_Tab_Cncl } from './tdm/Tdm05_Tab_Cncl';
import { Tdm20_Tab_Role } from './tdm/Tdm20_Tab_Role';
import { Tdm08_Tab_Manager } from './tdm/Tdm08_Tab_Manager';
import { Tdm09_Tab_ApprStep } from './tdm/Tdm09_Tab_ApprStep';
import { Tdm30_Tab_RoleAllc } from './tdm/Tdm30_Tab_RoleAllc';
import { Tdm31_Tab_RoleDesc } from './tdm/Tdm31_Tab_RoleDesc';
import { Tdm50_Tab_DutyProgress } from './tdm/Tdm50_Tab_DutyProgress';
import { Tdm50_Tab_DutyProgressAdmin } from './tdm/Tdm50_Tab_DutyProgressAdmin';
import { Tdm50_Tab_TotalDashboard } from './tdm/Tdm50_Tab_TotalDashboard';
import { Tdm50_Tab_CheckJob } from './tdm/Tdm50_Tab_CheckJob';
import { Tdm51_Tab_CheckOrg } from './tdm/Tdm51_Tab_CheckOrg';
import { Tdm52_Tab_CheckManl } from './tdm/Tdm52_Tab_CheckManl';
import { Tdm59_Tab_CheckAppr } from './tdm/Tdm59_Tab_CheckAppr';
import { Tdm54_Tab_CheckInsuff } from './tdm/Tdm54_Tab_CheckInsuff';
import { Tdm00_Tab_ChangeList } from './tdm/Tdm00_Tab_ChangeList';
import { Tdm35_Tab_TaskList } from './tdm/Tdm35_Tab_TaskList';
import { Tdm43_Tab_ManlItemList } from './tdm/Tdm43_Tab_ManlItemList';
import { Tdm43_Tab_RelateFormFileUpload } from './tdm/Tdm43_Tab_RelateFormFileUpload';
import { Tdm91_Tab_CompanySetup } from './tdm/Tdm91_Tab_CompanySetup';
import { Tdm50_Tab_DutyRecon } from './tdm/Tdm50_Tab_DutyRecon';
import { Tdm50_Tab_DutyReconAdmin } from './tdm/Tdm50_Tab_DutyReconAdmin';
import { Dcr01_Tab_ClassTree } from './dcr/Dcr01_Tab_ClassTree';
import { Dcr05_Tab_DocType } from './dcr/Dcr05_Tab_DocType';
import { Dcr30_Tab_LinkAdmin } from './dcr/Dcr30_Tab_LinkAdmin';
import { Dcr01_Tab_DcrClassModify } from './dcr/Dcr01_Tab_DcrClassModify';
import { Dcr03_Tab_DcrAuth } from './dcr/Dcr03_Tab_DcrAuth';
import { Dcr03_Tab_OrgAuth } from './dcr/Dcr03_Tab_OrgAuth';
import { Dcr04_Tab_EmpAuth } from './dcr/Dcr04_Tab_EmpAuth';
import { Dcr10_Tab_MailHistory_Manager } from './dcr/Dcr10_Tab_MailHistory_Manager';
import { Dcr01_Tab_DcrUser } from './dcr/Dcr01_Tab_DcrUser';
import { Dcr01_Tab_DcrWrite } from './dcr/Dcr01_Tab_DcrWrite';
import { Rpt10_Tab_FssSubmit } from './rpt/Rpt10_Tab_FssSubmit';
import { Sch01_Tab_Info } from './sch/Sch01_Tab_Info';
import { Sch01_Tab_List } from './sch/Sch01_Tab_List';
import { Sch01_Tab_ListOrg } from './sch/Sch01_Tab_ListOrg';
import { Sch04_Tab_ToDoList } from './sch/Sch04_Tab_ToDoList';
import { Sch04_Tab_DailyCheckList } from './sch/Sch04_Tab_DailyCheckList';
import { Sch04_Tab_DailyCheckListStatus } from './sch/Sch04_Tab_DailyCheckListStatus';
import { Sch04_Tab_IcsList } from './sch/Sch04_Tab_IcsList';
import { Sch04_Tab_IcsListManager } from './sch/Sch04_Tab_IcsListManager';
import { Sch10_Tab_IpoAdmin } from './sch/Sch10_Tab_IpoAdmin';
import { Sch10_Tab_Ipo } from './sch/Sch10_Tab_Ipo';
import { Sch10_Tab_Ipo2 } from './sch/Sch10_Tab_Ipo2';
import { Fnd30_Tab_DemandOpr } from './fnd/Fnd30_Tab_DemandOpr';
import { Fnd30_Tab_Opr } from './fnd/Fnd30_Tab_Opr';
import { Fnd32_Tab_Account } from './fnd/Fnd32_Tab_Account';
import { Kfs01_Tab_RemoteView } from './kfs/Kfs01_Tab_RemoteView';
import { Est01_Tab_PfFeeType } from './est/Est01_Tab_PfFeeType';
import { Est02_Tab_PfContract } from './est/Est02_Tab_PfContract';
import { Est03_Tab_PfHistory } from './est/Est03_Tab_PfHistory';
import { Est02_Tab_PfResultReport } from './est/Est02_Tab_PfResultReport';
import { Est03_Tab_PfHistoryConfirm } from './est/Est03_Tab_PfHistoryConfirm';
import { Act09_Tab_AccountNum } from './act/Act09_Tab_AccountNum';
import { Ast05_Tab_TrCodeIntrinsic } from './ast/Ast05_Tab_TrCodeIntrinsic';
import { Emp00_Tab_OrgEmpManager } from './emp/Emp00_Tab_OrgEmpManager';
import { Fnd07_Tab_IssuingEntity } from './fnd/Fnd07_Tab_IssuingEntity';
import { Mrb01_Tab_List } from './mrb/Mrb01_Tab_List';
import { Scm01_Tab_Sr } from './scm/Scm01_Tab_Sr';
import { Scm01_Tab_DevMng } from './scm/Scm01_Tab_DevMng';
import { Scm10_Tab_Dev } from './scm/Scm10_Tab_Dev';
import { Scm13_Tab_Deploy } from './scm/Scm13_Tab_Deploy';
import { Scm30_Tab_Program } from './scm/Scm30_Tab_Program';
import { Biz10_Tab_ContCorp } from './biz/Biz10_Tab_ContCorp';
import { Biz20_Tab_FeeCharge } from './biz/Biz20_Tab_FeeCharge';
import { Biz51_Tab_ErpContCorp } from './biz/Biz51_Tab_ErpContCorp';
import { Biz55_Tab_ErpFeeCharge } from './biz/Biz55_Tab_ErpFeeCharge';
import { Test_Tab_ReactComponents } from './test/Test_Tab_ReactComponents';

/**
 * 화면 등록표 (AS-IS MenuOpener): sys06_menu.sys06_class_nm(메뉴 키) → 화면 컴포넌트.
 * 없는 키는 MainFrame이 PendingScreenView로 연다. A 작업이 끝날 때마다 여기에 등록한다(05 §2 프론트).
 * 메뉴 키는 DB 값 그대로 쓴다(오타 `Sys03_Tab_ComapnyMenu`도 그대로).
 */
export const SCREENS: Record<string, React.FC> = {
  Bbs02_Tab_NoticeViewMgt, // S01 (H01의 Bbs02_Popup_NoticeAdmin 재사용, noticeType 20)
  Emp00_Tab_ChangeHistory, // S02
  Emp00_Tab_OrgPerson, // S04
  Emp20_Tab_YearList, // S07
  Emp21_Tab_UnLeaveList, // S08 (1단계: 상신 결재문서 일괄 생성·문자발송·상세보기 전자결재 편집창은 다음 단계)
  Emp24_Tab_JointLeave, // S09 (1단계: 승인신청 결재문서 생성·상세보기 전자결재 편집창은 다음 단계)
  Emp22_Tab_EtcLeave, // S10 (1단계: 결재요청 결재문서 생성·결재문서 보기 전자결재 편집창은 다음 단계)
  Emp53_Tab_BizTripManager, // S11 (1단계: 상세보기 결재문서 보기 전자결재 편집창은 다음 단계)
  Emp54_Tab_ErrandManager, // S12 (1단계: 이익수령 제외신청 결재문서 보기 전자결재 편집창은 다음 단계)
  Emp20_Tab_LeaveManager, // S06 (1단계: [휴가취소]의 결재문서 삭제·알림 발송 emp.Emp20_Leave.cancelUpdate는 다음 단계)
  Emp15_Tab_Cert, // S05 (1단계: 전자결재 상신 Apr01_Edit_ApprDoc·문서분류 선택 Dcr01_Lookup_Class·메일보내기 Dcr10_Lookup_MailSender는 다음 단계)
  Emp35_Tab_DeductPerson, // S28 (급여공제정보 — 아래는 C01-3의 Emp35_Page_DeductDate 공용 + 기본설정 pay30_Popup_BasicSetup·임금계산방법·급여출금계좌. 다음 단계: 4대보험 신고정보 Pay31_Popup_InsureApply)
  Emp31_Tab_Director, // S03 (1단계: 문서분류지정 Dcr30_Lookup_Link·보고서 창의 선임/해임 콤보·결재상신은 다음 단계)
  Bbs02_Tab_NoticeViewLaw, // H01 (+ Bbs02_Popup_NoticeAdmin·Bbs07_TapPage_Comment·Bbs07_Lookup_FileList·Bbs02_Lookup_File)
  Bbs10_Tab_BizShare, // Z07 (+ Bbs10_Edit_BizShare)
  Bbs30_Tab_ClassTree, // Z13 (+ Bbs31_Grid_Content·Lookup_Content·Edit_Content, Bbs32_TapPage_Comment·Lookup_FileList, Bbs30_Lookup_ClassTree·ParentTree, Bbs33_Lookup_Role)
  Bbs11_Tab_Application, // Y13 (+ Bbs11_Edit_Application)
  Bbs11_Tab_ApplicationMng, // T22 (+ Bbs12_Lookup_ApplicationMng)
  Bbs20_Tab_FloralRequest, // Y12 (+ Bbs20_Edit_FloralRequest 등록·수정·Bbs20_Lookup_OccasionsOption·Mkt01_Lookup_Select)
  Bbs20_Tab_FloralRequestMng, // T21 (+ Bbs20_Edit_FloralRequest 보기 모드·Bbs21_Lookup_FloralRequestShare·Bbs20_Grid_RelateFile·Bbs20_Lookup_RelateFile·Bbs20_Lookup_Message·Bbs22_Lookup_FloralMessage)
  Bbs02_Tab_NoticeAdmin, // Z04 (+ Bbs02_Edit_NoticeAdmin·Bbs09_Lookup_History·Bbs02_Edit_Message, 고객사 선택 Sys01_Lookup_SelectMulti·문자 수신자 Emp00_Lookup_SelectMulti·첨부 Bbs15_Lookup_File·알람 Sch06_Lookup_AlarmSetup 재사용)
  Mkt03_Tab_HistoryManager, // Z06 (+ Mkt01_Lookup_TargetCompany2, Mkt03_Lookup_History·Mkt05_Lookup_Share·Sys10_Lookup_File 재사용)
  Mkt01_Tab_TargetCompany, // Z05 (+ Mkt01_Grid_TargetCompany·Mkt03_Grid_History·Mkt01_Lookup_TargetCompany·SelectCompany·Favorite·FavoriteInsert·ExcelUpload·Mkt05_Lookup_Share·Mkt03_Lookup_History, 펀드 Fnd01_Lookup_SelectMulti·조직/사원 Org00/Emp00_Lookup_SelectMulti·첨부 Sys10_Lookup_FileViewer 재사용)
  Bbs02_Tab_NoticeManager, // Z02 (+ Bbs02_Edit_Notice·Bbs02_Lookup_LoadBbs·Bbs07_Lookup_Comment·Emp57_Lookup_List·Emp57_Lookup_DetailList, 첨부는 Bbs15_Lookup_File·알람은 Sch06_Lookup_AlarmSetup 재사용)
  Bbs02_Tab_NoticeView, // Z03 (+ H01의 Bbs02_Popup_NoticeAdmin·Bbs07_TapPage_Comment·Bbs07_Lookup_FileList·Bbs02_Lookup_File 재사용, 새 gb.pin)
  Bbs15_Tab_CompanyRule, // Z01 (+ Bbs15_Lookup_Content·Bbs02_Lookup_File 사용자용)
  Bbs15_Tab_CompanyRuleManager, // E10 (+ Bbs15_Edit_CompanyRuleManager·Bbs15_Lookup_File, 엑셀다운로드는 RD 리포트 대신 서버가 xlsx 생성)
  Chk01_Tab_ClassTree, // E06
  Chk02_Tab_DailyListAdmin, // E07
  Chk02_Tab_DailyList, // R01
  Chk03_Tab_DailyListWrite, // R02
  Chk03_Tab_DailyListConfirm, // R03
  Chk03_Tab_DailyListStatus, // R04
  Dbm01_Tab_TabComments, // C08 (주석 저장·소스 생성은 DB 프로시저가 없어 서버가 거절)
  Dbm10_Tab_MakePdf, // C07 (PDF 생성은 서버 연동 없음 — PdfMaker 기본 구현)
  Emp00_Tab_TransInfo, // C01 (1단계: 목록·등록·기본정보·일반발령)
  Emp00_Tab_RoleMenu, // C04
  Emp01_Tab_UserInfo, // C03
  Flt00_Tab_Info, // I01 (1단계: 안내문·메뉴 링크. 링크 01·02·09의 조회창 Flt02_Lookup_Emp·Flt13_Lookup_BookInit은 다음 단계)
  Flt03_Tab_AccountReport, // I02 (1단계: 본 화면 + 폐쇄계좌 탭 + 계좌 조회창. 보고주기·서약서 창 Flt02_Lookup_Emp, 최초원장 Flt13_Lookup_BookInit, 전자결재 상신·상세보기 Apr01_Edit_ApprDoc는 다음 단계)
  Flt10_Tab_BuyReport, // I03 (1단계: 본 화면 + 종목 찾기·기간조회 창 + 상장주식 종목 VIEW. 보고주기·서약서 창 Flt02_Lookup_Emp는 다음 단계)
  Flt10_Tab_RealTransaction, // I05 (1단계: 본 화면 + 계좌정보·코드설정 창 + 엑셀업로드. 상신 창 Apr01_Edit_ApprDoc·문서보기 Flt14_Lookup_RelateAppr는 다음 단계)
  Flt10_Tab_AcntTransfer, // I06 (1단계=전체: 본 화면 + 등록·변경 창 + 보유내역 조회창 expectYn=false)
  Flt10_Tab_RightsExercise, // I07 (1단계=전체: 본 화면 + 등록·변경 창 + 보유내역·계좌·종목 조회창. 다른 도메인 의존 없음)
  Flt10_Tab_PreApprove, // J02 (1단계: 본 화면 + 사유 창. 알림수신인 설정·펀드보유종목 확인은 다른 도메인 조회창이라 다음 단계. 일괄 알림발송은 발송 연동이 없어 대상이 있으면 안내 오류)
  Flt10_Tab_TrList, // I08 (1단계=전체: 본 화면 하나, 엑셀은 RD 대신 서버 xlsx. 다른 도메인 의존 없음)
  Flt10_Tab_TrListAdmin, // J03 (1단계=전체: 본 화면 하나, 사원찾기 Emp00 기존 부품, 엑셀 2종은 RD 대신 서버 xlsx)
  Flt11_Tab_BookList, // I09 (1단계=전체: 본 화면 하나. [최초원장 등록]은 원본에서 툴바에 연결이 없어 화면에 없다)
  Flt11_Tab_BookListAdmin, // J04 (1단계=전체: 본 화면 하나, 사원찾기 Emp00 기존 부품, 엑셀은 RD 대신 서버 xlsx)
  Flt10_Tab_ViolateUser, // I10 (1단계=전체: 본 화면 하나, 엑셀은 RD 대신 서버 xlsx. 사원찾기 Emp00 기존 부품. 본 화면 Flt10_Tab_Violate는 J05가 fixedUser 없이 같이 쓴다)
  Flt10_Tab_Violate, // J05 (I10과 같은 컴포넌트를 fixedUser 없이 등록: 사원 선택·열릴 때 조회 안 함)
  Flt10_Tab_EmpAppr, // J06 (1단계=본 화면 + Flt10_Grid_EmpAppr. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Flt02_Tab_EmpInfo, // J07 (1단계=전체: 본 화면 + 메모 Flt15_Lookup_Note + 조회창 3개(가족동의서·계좌정보·위반내역). 파일보기 Sys10_Lookup_FileViewer 재사용)
  Flt10_Tab_CeoReport, // J08 (1단계: 본 화면 + 탭 3개(Flt03_TabPage_Account·Flt10_TabPage_ReportPerson·Flt10_TabPage_TrList). 엑셀은 RD 대신 서버 xlsx. 결재요청·문서보기가 여는 전자결재 Apr01_Edit_ApprDoc·Apr01_Lookup_ApprLink·Dcr01_Lookup_Class와 RD 첨부파일 생성은 다음 단계)
  Flt01_Tab_CompanyStd, // J09 (본 화면 + 조회창 4개: Flt01_Lookup_LockUpCheckType·Flt05_Lookup_ItemType·Flt08_Lookup_LockupItem·Flt16_Lookup_ExceptPerson)
  Flt03_Tab_AccountAdmin, // J01 (1단계=전체 본 화면 하나. 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Flt10_Tab_SellReport, // I04 (1단계: 본 화면 + 보유내역 조회창 Flt11_Lookup_BookList(I09 공유). 보고주기·서약서 창 Flt02_Lookup_Emp는 다음 단계)
  Flt05_Tab_ItemTypeAdmin, // E08
  Fnd08_Tab_OrgAuthTempFund, // P02 (+ Fnd08_Page_OrgAuth·Fnd08_Lookup_OrgCode)
  Fnd01_Tab_FundSearch, // P07 (+ Fnd01_Edit_FundSearch·components/lookup/Fnd25_Lookup_Content)
  Fnd01_Tab_FundIcamHistory, // P08 (+ 오른쪽 변경이력 페이징 그리드 Fnd01_Grid_FundIcamHistory 포함)
  Fnd10_Tab_RelateAst, // P09
  Fnd10_Tab_RelateFnd, // P10
  Fnd25_Tab_FundTerms, // P13 (+ components/lookup/Fnd25_Lookup_Content, 펀드규약 조회)
  Fnd25_Tab_FundTermsManager, // P12 (+ Fnd25_Grid_FundTermsDetail·Fnd25_Lookup_FundTermsManager·Fnd25_Edit_FundTermsManager·components/lookup/Fnd01_Lookup_SelectSingle·Com01_Lookup_RelateFile, 펀드규약 등록)
  Fnd11_Tab_BookExtr, // P11 (+ components/lookup/Com50_Lookup_StkItem VIEW, 템플릿·엑셀업로드)
  Fnd08_Tab_OrgAuth, // P06 (+ Fnd08_Page_OrgAuth·components/lookup/Fnd08_Lookup_OrgAuth·Fnd01_Lookup_SelectMulti)
  Fnd20_Tab_Plan, // P03 (+ Fnd20_TabPage_Plan·components/lookup/Dcr00_Lookup_FundPlan, 상품기획일정 등록)
  Adv02_Tab_Account, // Q01 (+ Adv02_Edit_Account·components/lookup/Sys15_Lookup_Corp corpTypeName, 일임계좌 등록)
  Adv05_Tab_OrgAuth, // Q02 (+ Adv05_Page_OrgAuth·components/lookup/Adv05_Lookup_OrgAuth·Adv02_Lookup_SelectMulti, 일임계좌 권한설정)
  Adv11_Tab_BookExtr, // Q03 (+ components/lookup/Com50_Lookup_StkItem VIEW, 템플릿·엑셀업로드, 일임보유주식등록(타사무))
  Fnd01_Tab_FundCode, // P05 (+ Fnd01_Edit_FundCode·components/lookup/Fnd03_Lookup_Consignment·Fnd06_Lookup_OfficeWork·Fnd09_Lookup_TrustBank, 펀드 등록 및 변경)
  Fnd20_Tab_PlanEmp, // P04 (1단계: 본 화면 + Fnd20_TabPage_PlanEmp. [결재요청] 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc·서버 insertAppr는 다음 단계)
  Fnd01_Tab_FundPlan, // P01 (+ Fnd00_Lookup_FundCode, 신규기획펀드 등록 — 아래 편집 폼 Fnd01_Edit_FundPlan 포함)
  Fnd03_Tab_Consignment, // R10 (#1051 수탁사정보 관리)
  Fnd03_Tab_ConsignmentManager, // D11 (ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절)
  Fnd06_Tab_OfficeWork, // R11 (#1052 사무수탁사정보 관리)
  Fnd06_Tab_OfficeWorkManager, // D12 (ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절)
  Fnd09_Tab_TrustBank, // R12 (#1100 수탁은행정보 관리)
  Fnd09_Tab_TrustBankManager, // D13 (저장은 원본 서버에 insertCheck가 없어 원본에서도 실패 — 서버가 거절, ICAM가져오기도 거절)
  Ics01_Tab_ApprList, // F03 1단계 (메뉴 #1014 + Ics01_Grid_ApprList. 편집창 Apr01_Edit_ApprDoc·문서분류 조회창 Dcr01_Lookup_Class는 다음 단계)
  Dcr00_Tab_DocList, // F05 1단계 (메뉴 #1006 + Dcr01_Lookup_DcrClass·Apr03_TabPage_Relate. 편집창 Apr01_Edit_ApprDoc·북마크 Apr50_Lookup_ApprList·댓글 Apr42_Lookup_CommentView는 다음 단계)
  Dcr00_Tab_ApprList, // F09 1단계 (메뉴 #1326 문서 다운로드 + Apr40_Lookup_DownloadHistory·Dcr01_Lookup_DcrClass. 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc·PDF 만들기 createInPDF7은 다음 단계)
  Dcr00_Tab_FileList, // F08 1단계 (메뉴 #1224 문서별 첨부파일 검색 + Dcr01_Lookup_DcrClass. 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr01_Tab_ItemDocument, // F07 1단계 (메뉴 #1137 (X)종목별 문서검색 + Apr01_Grid_ItemDocList. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr01_Tab_FundDocument, // F06 1단계 (메뉴 #1005 + Apr01_Grid_FundDocList. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr90_Tab_DisposalAppr, // F10 1단계 (메뉴 #1490. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr01_Tab_MyApproveList, // G01 1단계 (메뉴 #1018. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·메일보내기가 여는 Dcr10_Lookup_MailSender는 다음 단계)
  Apr01_Tab_BizPriorApproval, // L06 1단계 (메뉴 #1134. 승인신청·상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·문서분류지정이 여는 Dcr30_Lookup_Link는 다음 단계)
  Apr01_Tab_ExternalBiz, // A40 (메뉴 #1343 대외활동 신청서 작성. [승인신청]·[상세보기]는 전자결재 편집창 Apr01_Edit_ApprDoc, 문서분류 조회창은 Dcr30_Move_DcrClass)
  Apr01_Tab_MyRequestList, // G02 1단계 (메뉴 #1019. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·신청의 Ics40_Edit_DcrPreconfirm·준감인의견의 Ics40_Edit_Msg·메일보내기가 여는 Dcr10_Lookup_MailSender는 다음 단계)
  Apr01_Tab_MyReferenceList, // G03 1단계 (메뉴 #1093. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·메일보내기가 여는 Dcr10_Lookup_MailSender는 다음 단계)
  Apr01_Tab_MyAuthList, // G04 1단계 (메뉴 #1428. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·메일보내기가 여는 Dcr10_Lookup_MailSender는 다음 단계)
  Apr01_Tab_TotalList, // G16 (메뉴 #1010 운영현황표. 건별명세 아이콘이 메뉴 #1011 G17을 TempData로 연다)
  Apr01_Tab_SubList, // G17 1단계 (메뉴 #1011 건별명세. 문서조회가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr01_Tab_StampSeq, // G06 1단계 (메뉴 #1020 (X)인감대장. 문서확인이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr10_Tab_Stamp, // G07 (메뉴 #1026. 조회창 Apr10_Move_OrgCode·Org10_Lookup_RoleStamp·Dcr40_Lookup_StampAuth·Org00_Lookup_SelectMulti를 함께 변환)
  Emp60_Tab_Sign, // G09 (메뉴 #1501)
  Emp30_Tab_ApprStepExcept, // G10 (메뉴 #1439. 사원찾기 Emp00_Lookup_SelectSingle 재사용)
  Emp10_Tab_AddrBook, // G11 (메뉴 #1025. 그룹설정 Emp57_Lookup_Insert 외 3개 클래스 함께)
  Emp10_Tab_PublicAddrBook, // G12 (메뉴 #1211. 그룹설정 재사용)
  Dcr10_Tab_MailHistory, // G14 (메뉴 #1023. 상세보기 Dcr10_Lookup_MailViwer 함께, 전자결재 편집창·펀드 조회창은 다음 단계)
  Cmp10_Tab_MailBook, // G13 (메뉴 #1212. 권한자 Cmp10_Tab_MailBookList·등록창 Cmp10_Edit_Tab_MailBook 함께)
  Apr16_Tab_StampDocManager, // T23 (+ Apr16_Lookup_StampDocReg·Apr16_Lookup_StampReprCorp·Apr15_Lookup_ReprCorp·Apr16_Lookup_GetDocAppl)
  Apr16_Tab_StampList, // T24 (+ Apr16_Lookup_UpdateStampDate)
  Apr16_Tab_StampDocAppl, // Y11 (+ Apr16_Lookup_StampDocAppl)
  Apr16_Tab_StampListOrg, // T25 (T24와 같은 구조, org 필터)
  Apr16_Tab_StampFileCheck, // T26
  Apr15_Tab_ReprCorp, // G08 (메뉴 #1506. 인감 조회창 Apr10_Lookup_Stamp 재사용)
  Apr07_Tab_AltAppr, // G05 (메뉴 #1021. 사원찾기 Emp00_Lookup_SelectSingle 재사용)
  Apr07_Tab_AltApprMgr, // EE02 (메뉴 #1022. 사원찾기 Emp00_Lookup_SelectSingle 재사용)
  Apr30_Tab_ApprStepGroup, // EE03 (메뉴 #1282. 멤버 Apr31_Page_ApprStepGroupMember, 사원찾기 Emp00_Lookup_SelectMulti 재사용)
  Apr01_Tab_Restore, // EE01 1단계 (메뉴 #1098. 상세보기가 여는 폐기문서 보기 Apr01_Edit_ApprDoc.getApprDelModel은 다음 단계)
  Apr90_Tab_DisposalList, // F04 1단계 (메뉴 #1443. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Apr90_Tab_DisposalListAdmin, // EE04 1단계 (메뉴 #1253. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Ics01_Tab_ClassTree, // E01 (기한 설정 Sch03_Lookup_Ics는 다른 도메인이라 별도 ID)
  Ics01_Tab_IcsFileUpload, // E02
  Ics20_Tab_RevisionHistoryAdmin, // E03
  Ics01_Tab_IcsFileUser, // H07
  Ics01_Tab_ClassTreeUser, // H08 (+ Ics02_Lookup_Manager·Ics01_Lookup_Share·Ics01_Lookup_Except, 나머지 조회창은 H02·H03 재사용)
  Ics02_Tab_Manager, // H10 (+ Ics04_Page_Share, Org00_Lookup_SelectMulti 재사용)
  Ics01_Tab_ClassTreeUserView, // H02 (+ Ics01_Lookup_Content view·IcsFile period·SelectParent·Ics20_Lookup_*·Sch03_Lookup_IcsUser)
  Ics20_Tab_RevisionHistory, // H05 (+ Ics20_Edit_RevisionHistory, Ics19_Grid_IcsList view·Ics20_Grid_FileList user, Ics20_Lookup_Content user)
  Ics01_Tab_PeriodList, // H04 (+ components/lookup Ics01_Lookup_CheckList·IcsComboBoxField, ClassTreeDetail·IcsFile period 재사용)
  Icr01_Tab_ClassTree, // H09 (+ Icr01_Grid_IcrType·Edit_ClassTree·Move_TreeGrid·Move_Grid·Lookup_Share·Lookup_IcrFile(admin)·Lookup_Content(editable)·Sch03_Lookup_Ics 6, Icr02_Lookup_Manager=Ics02_Lookup_Manager)
  Icr01_Tab_ClassTreeView, // H03 (+ Icr01_Lookup_Content view·IcrFile period·SelectParent·Sch03_Lookup_IcsUser)
  Ics10_Tab_ChecklistAdmin, // E04
  Ics10_Tab_Checklist, // K04 (+ Ics10_Lookup_UseYn·Ics10_Lookup_ExcelUpload·Sch22_Lookup_WriteGroup·Sch02_Page_Share. 출력은 RD 대신 서버 xlsx)
  Ics17_Tab_UserRequestAdmin, // E09 (+ Ics17_Edit_UserRequestAdmin·Ics17_Lookup_LawContent·Ics17_Grid_FileList)
  Ics17_Tab_UserRequest, // H11 (+ Ics17_Edit_UserRequest, Ics17_Lookup_LawContent user·Ics17_Grid_FileList 재사용)
  Ics30_Tab_Compliance, // E05 (+ E05-1 예외사원 등록 Emp33_Lookup_ExceptBiz)
  Ics35_Tab_ExtrActivity, // M01 (+ Ics35_Edit_ExtrActivity·Ics35_Grid_FileList·Sys10_Lookup_File, 전자결재 편집창은 다음 단계)
  Ics35_Tab_ExtrActivityList, // M02 (짝 M01, 전자결재 편집창은 다음 단계)
  Ics40_Tab_DcrPreConfirm, // M05 (+ Ics41_Lookup_DcrType·Ics40_Edit_Msg, 전자결재 편집창은 다음 단계)
  Ics40_Tab_DcrReviewConfirm, // M06 (짝 M05, 읽기 전용)
  Biz90_Tab_Limit, // L01 (메뉴 #1130. 하위 Biz04_Lookup_EmpSetup)
  Biz60_Tab_FundPriceModiReport, // V32 (메뉴 #1505. 편집 팝업 Biz60_Edit_FundPriceModi, 상신 A75·A76·A77은 Apr01_Edit_ApprDoc link, 메일 보내기는 다음 단계)
  Biz01_Tab_Card, // L02 (메뉴 #1131. 하위 Biz01_Edit_Card·Biz02_Grid_PersonList(InternalList·ExternalList)·Biz01_Lookup_CardManagement·Biz05_Lookup_RelateAppr·Biz05_Lookup_RelateFile. 1단계: 전자결재·거래처 조회창은 안내만)
  Biz01_Tab_Other, // L03 (메뉴 #1132. 하위 Biz01_Edit_Other. 사람 목록·증빙자료 창은 L02 부품 재사용)
  Bmt01_Tab_Buy, // L05 (메뉴 #1135. 아래쪽 제공내역은 pages/biz/Biz01_TabPage_List. 전자결재·상대처 조회창은 다음 단계)
  Bmt12_Tab_EmpIct, // T20 (임직원 정보통신수단, RD 출력)
  Bmt10_Tab_Info, // W18 (전산장비관리)
  Bmt12_Tab_PcList, // W19 (PC장비상세)
  Ast09_Tab_DepositBook, // W21 (메뉴 #1473·#1159. 상신 A39, 계정별원장 아이콘은 메뉴 1150 X17)
  Biz01_Tab_LimitCheckList, // L07 (메뉴 #1133. 하위 탭 Biz01_TabPage_PersonDay·PersonYear·CompanyYear, 엑셀 서버 생성)
  Biz01_Tab_PriorApproval, // L08 (메뉴 #1136. 거래상대방 조회창 components/lookup/Mkt01_Lookup_Select2, 제공(수령)자는 Emp00_Lookup_SelectSingle)
  Biz01_Tab_CardContents, // L04 (메뉴 #1138. 편집 칸·인원 칸·증빙자료 창은 L02 부품 재사용, RD 내려받기 utils/rdDownload)
  Biz01_Tab_PriorApprovalSimple, // L12 (메뉴 #1322. 거래상대방 칸은 영업 거래처 조회창 components/lookup/Crm09_Lookup_SelectSingle, RD 미리보기 RdViewer)
  Biz01_Tab_CardContentsSimple, // L11 (메뉴 #1321. 편집 칸 Biz01_Edit_CardSimple·거래상대방 조회창은 L09, 증빙자료 창은 L02 부품 재사용, RD 내려받기 utils/rdDownload)
  Biz01_Tab_OtherSimple, // L10 (메뉴 #1320. 하위 Biz01_Edit_OtherSimple. 거래상대방 조회창은 L09 Biz01_Lookup_ProvideCompany, 증빙자료 창은 L02 부품 재사용)
  Biz01_Tab_CardSimple, // L09 (메뉴 #1319. 하위 Biz01_Edit_CardSimple·Biz01_Lookup_ProvideCompany. 일괄저장 창·증빙자료 창은 L02 부품 재사용)
  Ics15_Tab_ChecklistWrite, // K05 (+ Ics15_Edit_Reason. 보기 창은 K04의 Ics10_Edit_Checklist readOnly)
  Ics15_Tab_ChecklistConfirm, // K06 (+ Ics16_Lookup_RelateAppr. 보기 창은 K04의 Ics10_Edit_Checklist readOnly)
  Ics15_Tab_ChecklistStatus, // K07 (+ Ics15_Lookup_ChecklistStatusDetail. 보기 창은 K04의 Ics10_Edit_Checklist readOnly)
  Ics15_Tab_ChecklistStatusDetail, // K08 (보기 창은 K04의 Ics10_Edit_Checklist readOnly. 출력은 RD 대신 서버 xlsx)
  Ics31_Tab_ComplianceWrite, // K01 (+ Ics31_Edit_Reason. 엑셀은 RD 리포트 대신 서버 xlsx)
  Ics31_Tab_ComplianceConfirm, // K02 (V28: 문서분류·상신상태·[상신][문서보기]·사원명 조회 — 옛 조회창 Ics32_Lookup_RelateAppr는 어디서도 안 열려 제외)
  Ics31_Tab_ComplianceReport, // K03 1단계 (RD 미리보기 대신 표. [상신]·[문서보기]·문서분류 선택은 전자결재 단계 — 안내만)
  Icam55_Tab_UserApprResult, // EE30 (메뉴 #1316. 하위 Icam55_Lookup_UserApprResult. 문서보기 Apr01_Edit_ApprDoc)
  Icam55_Tab_UserRegAppr, // EE29 (메뉴 #1314. 하위 Icam55_Edit_UserRegAppr·Icam55_Lookup_RegContent. 전자결재 편집창 Apr01_Edit_ApprDoc 링크 A33 연결)
  Icam03_Tab_Fund, // D07 (ICAM Get·타사무 Get은 외부 ICAM DB 연동이 없어 서버가 거절)
  Icam06_Tab_FundPrice, // R05 (메뉴 #1475. 펀드별 기준가 현황)
  Icam06_Tab_FundOperateStatus, // R07 (메뉴 #1323. 펀드운용현황(펀드합계))
  Icam10_Tab_CurrentFeeByFund, // R06 (메뉴 #1268. 펀드별 발생보수현황 / #1494. 월별 펀드보수현황)
  Icam10_Tab_FeeAdmin, // D08 (ICAM 발생보수 가져오기도 같은 연동이 없어 서버가 거절)
  Icam12_Tab_FundMngFeeBook, // X30 (메뉴 #1215. X24 `icam/fee-books`에 fundCode 조건, 펀드 조회창은 X29 재사용)
  Icam10_Tab_FundMngFee, // X29 (메뉴 #1214. 같은 `icam/fees` API, 보수구분 20402 고정 + 펀드 조회창 `icam/fees/funds` + RD `icam/fees/rd`)
  Icam10_Tab_OfficeMngFee, // X23 (메뉴 #1199. 같은 `icam/fees` API, 보수구분 20407 고정)
  Ast33_Tab_OfficeMngFundTrans, // X28 (메뉴 #1251. `ast/fund-trans` + `ast/book-fund-fees/pre-hold`, X34 운용보수 이관펀드 등록이 같은 API·편집창을 쓸 수 있다)
  Ast30_Tab_OfficeMngFeeStatePeriod, // X26 (메뉴 #1249. `ast/book-fund-fees/period` + X25 펀드 조회·증감액 상세 재사용)
  Ast33_Tab_FundMngTrans, // X34 (메뉴 #1252. X28 `ast/fund-trans` + `ast/book-fund-fees/pre-hold` 재사용, 새 API 없음)
  Ast30_Tab_FundMngFee, // X32 (메뉴 #1401. `ast/book-fund-fees/month-fees`)
  Ast30_Tab_FundMngFeeState, // X31 (메뉴 #1216. `ast/book-fund-fees/fund-fee-books` + 펀드 조회창 X29 + 증감액 상세 X25 재사용)
  Ast30_Tab_OfficeMngFeeState, // X25 (메뉴 #1201. `ast/book-fund-fees` + 증감액 상세 `icam/fees/by-fund`)
  Icam11_Tab_FundMngFeeDeposit, // X33 (메뉴 #1217. X27 `icam/fee-deposits`·이력 그리드·예금계좌 조회창 재사용)
  Icam11_Tab_OfficeMngFeeDeposit, // X27 (메뉴 #1204. `icam/fee-deposits`, X33 운용보수 입금계좌 관리가 같은 API를 쓸 수 있다)
  Icam12_Tab_OfficeMngFeeBook, // X24 (메뉴 #1200. `icam/fee-books`, X30 운용보수 월말잔액이 같은 API를 쓸 수 있다)
  Icam50_Tab_DbSource, // D09 (DB소스 가져오기도 같은 연동이 없어 서버가 거절)
  Icam99_Tab_Test, // D10 (작업 버튼은 BatchMain 연동이 없어 서버가 거절)
  Ifi90_Tab_Config, // D01 (계정PW 저장은 원본도 안 함 — 작업기록 제안)
  Org01_Tab_OrgCode, // C02 (조직도보기 Org02_View_Chart 제외)
  Tdm31_Tab_RoleDescAdmin, // E11 (재생성은 RD 리포트 연동이 없어 서버가 거절 — RoleDescPdfMaker 기본 구현)
  Tdm32_Tab_RoleDigm, // N13
  Tdm36_Tab_RoleReport, // N14
  Tdm40_Tab_ManlJob, // N15
  Tdm41_Tab_ManlDutyOrg, // N16 (+ Tdm40_Lookup_SelectSingle·Tdm10_Lookup_SelectSingle·Tdm41_Lookup_ChangeOrg_Tmp 신설)
  Tdm43_Tab_ManlItemReg, // N17 (+ Tdm43_TabPage_ManlItemReg·Tdm43_Lookup_ManlItemRegList·RegList2 신설)
  Tdm32_Tab_RoleDigmAdmin, // E12 (재생성은 RD 리포트 연동이 없어 서버가 거절 — RoleDigmPdfMaker 기본 구현)
  Tdm42_Tab_ManlManagerAdmin, // E13 1단계 (+ Tdm43_Lookup_ManlItem·Org00_Lookup_SelectTdm, 재생성은 RD 연동이 없어 서버가 거절 — ManlOrgPdfMaker 기본 구현, 점검항목 등록/수정창은 E13-2)
  Tdm42_Tab_ManlManager, // N19 (N18과 같은 서버 클래스·흐름, 부서 직접 선택 + 점검항목 조회창 아이콘. 결재요청·문서보기는 안내, 잠금의 파일 생성은 ManlOrgPdfMaker 기본 구현이 거절)
  Tdm42_Tab_ManlOrgAppr, // N18 1단계 (결재요청·문서보기는 전자결재 편집창 Apr01_Edit_ApprDoc이 다른 도메인이라 점검 후 안내, 잠금의 파일 생성은 ManlOrgPdfMaker 기본 구현이 거절)
  Tdm10_Tab_Task, // N05 1단계 (+ Tdm10_Edit_Task·Tdm12_Lookup_TaskRelateDetail·Tdm14_Lookup_TaskType·Tdm95_Lookup_ChangeHistory, 연결법규·내규 Tdm11은 다음 단계)
  Tdm13_Tab_TaskDuty, // N06 (+ Tdm14_Lookup_TaskType view·Tdm95_Lookup_ChangeHistory)
  Tdm08_Tab_Manager, // N09 (+ Emp00_Lookup_SelectSingle 재사용)
  Tdm09_Tab_ApprStep, // N10 (+ Tdm20_Lookup_SelectRole·Tdm23_Lookup_SelectOrg 신설, Emp01_Lookup_PersonModel 재사용)
  Tdm30_Tab_RoleAllc, // N11 1단계 (+ Tdm34_TabPage_RoleAllcDetail·Tdm30_Edit_RoleAllc·Tdm30_Edit_RoleAllcModify·Tdm35_Lookup_RoleAllcTask·Tdm02_Lookup_HrRecord, 상신·상신문서보기 Apr01_Edit_ApprDoc와 책무기술서 RD 뷰어는 다음 단계)
  Tdm31_Tab_RoleDesc, // N12 1단계 (+ Tdm30_Lookup_SelectMulti, 결재요청·문서보기 Apr01_Edit_ApprDoc와 책무기술서 RD 뷰어는 다음 단계)
  Tdm05_Tab_Cncl, // N07 (+ Tdm05_Edit_Cncl·Tdm22_Lookup_RoleRelateCncl2·Tdm20_Lookup_SelectMulti)
  Tdm20_Tab_Role, // N08 (+ Tdm20_Edit_Role·Tdm20_Lookup_SelectSingle·Tdm21~23 연결창·Tdm05/Tdm10_Lookup_SelectMulti)
  Tdm01_Tab_Hr, // N04 (+ Tdm01_Lookup_HrChangeInfo·Tdm03_Lookup_AddTitle)
  Tdm50_Tab_DutyProgress, // N02 (E14 Admin의 고객사용 짝 — 같은 API)
  Tdm50_Tab_DutyProgressAdmin, // E14 (조회마다 DB 함수 f_recon_tdm이 sys99_print의 사용자 몫 행을 다시 만든다 — AS-IS 그대로)
  Dcr01_Tab_ClassTree, // E16 (메뉴 #1110·#1001 — 같은 클래스. + Dcr01_Grid_DocType·Dcr01_Edit_ClassTree·Dcr01_Move_*·Dcr01_Lookup_UseYn·DcrCopyAdmin·Dcr05~07·Dcr20·Dcr21, apr 조회창 둘)
  Dcr05_Tab_DocType, // E18 (메뉴 #1482·#1007 — 같은 클래스. + Dcr05_Edit_DocType·Dcr05_Edit_Update(E16)·Sys09_Lookup_Code(구분추가)·Sys01_Lookup_Company)
  Dcr30_Tab_LinkAdmin, // E17 (열 때 Link 없는 회사에 채우는 linkCheck가 쓰기 — AS-IS 그대로. + Dcr30_TabPage_Company·Dcr30_Lookup_LinkNote·Dcr30_Move_DcrClass·Com10_Lookup_CommonMapping·Pay06_Popup_Example)
  Dcr01_Tab_DcrClassModify, // EE05 1단계 (메뉴 #1004 + Dcr01_Grid_DcrClassList·Dcr01_Move_DcrClass. 보기 아이콘이 여는 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Dcr03_Tab_DcrAuth, // EE06 (메뉴 #1073 + Dcr03_TabPage_DcrAuth·Dcr03_LinkNote. 문서분류지정 창 Dcr30_Lookup_Link 연결)
  Dcr03_Tab_OrgAuth, // EE07 (메뉴 #1074 + Dcr03_TabPage_OrgAuth·Dcr03_LinkNote. 권한복사 조직찾기 Org00_Lookup_SelectMulti·문서분류지정 창 Dcr30_Lookup_Link 연결)
  Dcr04_Tab_EmpAuth, // EE08 (메뉴 #1491 + Dcr04_TabPage_EmpAuth·Dcr04_Lookup_DocList·Dcr04_TabPage_DocList. 사원찾기 Emp00_Lookup_SelectMulti·조직찾기 Org00_Lookup_SelectSingle 재사용)
  Dcr10_Tab_MailHistory_Manager, // EE09 (메뉴 #1024 + 메일 상세 Dcr10_Lookup_MailViwer(manager)·연관펀드 Fnd01_Lookup_SelectSingle·문서 Apr01_Edit_ApprDoc 재사용)
  Dcr01_Tab_DcrUser, // F02 1단계 (메뉴 #1002 + Dcr01_Tab_DcrManager·Apr01_Grid_DocList·Apr03_TabPage_Relate. 편집창 Apr01_Edit_ApprDoc·북마크 Apr50_Lookup_ApprList·메일 Dcr10_Lookup_MailSender는 다음 단계)
  Dcr01_Tab_DcrWrite, // F01 1단계 (메뉴 #1318 + Dcr08_Lookup_SelectSingle. 전자결재 편집창 Apr01_Edit_ApprDoc·북마크 Apr50_Lookup_ApprList는 F01-2)
  Rpt01_Tab_DailyConfirm, // Z09 (+ Rpt01_Edit_DailyConfirm, RD Rpt01_Rd_Daily)
  Rpt03_Tab_WeekWrite, // Z11 (+ Rpt03_Page_WeekWrite, Rpt03_Lookup_WeekWrite, Rpt05_Lookup_WeekBizClass, RD Rpt03_Rd_WeekWrite)
  Rpt02_Tab_MonthWrite, // Z10 (+ Rpt02_Edit_MonthWrite, Rpt02_Lookup_FileList, RD Rpt02_Rd_Month)
  Rpt04_Tab_WeekConfirm, // Z12 (+ Rpt04_Lookup_WeekConfirm, RD Rpt04_Rd_WeekConfirm)
  Rpt01_Tab_DailyWrite, // Z08 (+ Rpt01_Edit_DailyWrite)
  Rpt10_Tab_FssSubmit, // E19 (+ Rpt10_Edit_WriteGuide)
  Sch01_Tab_Info, // O01 (+ Sch01_Lookup_Info·Sch01_Lookup_ManagerModi(Run)·Sch01_Grid_RelateFile·Sch08_Lookup_Class·Sch06_Lookup_AlarmSetup. 기한 Sch03_Lookup_Short/Cycle은 E01-1 재사용)
  Sch01_Tab_List, // O02 (+ Sch01_Lookup_InfoView·Sch10_Lookup_Ipo. 첨부는 Bbs02_Lookup_File 재사용)
  Sch01_Tab_ListOrg, // O03 (+ Org00_Lookup_SelectMulti·Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용)
  Sch04_Tab_ToDoList, // O04 (+ Emp00_Lookup_SelectSingle·Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용)
  Sch04_Tab_DailyCheckList, // O05 (+ AreaMessage·Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용, 상신은 1단계 안내만)
  Sch04_Tab_DailyCheckListStatus, // O06 (+ Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용, 결재 문서 보기는 안내만)
  Sch04_Tab_IcsList, // H06 (+ Sch04_Lookup_IcsMsg·Ics01/Icr01_Lookup_ClassTreeDetail. Apr01_Edit_ApprDoc은 다른 도메인이라 안내만)
  Sch04_Tab_IcsListManager, // H12 (H06의 관리자용 짝. Sch04_Lookup_IcsMsg actionType "2"·Org00_Lookup_SelectMulti 재사용. Apr01_Edit_ApprDoc은 안내만)
  Sch10_Tab_Ipo, // Q04 (+ Sch02_Lookup_Share·Sch12_Lookup_IpoCorpList·RdViewer_Sch10. 알람 Sch06_Lookup_AlarmSetup은 O01, 사원·조직 찾기는 재사용)
  Sch10_Tab_Ipo2, // W04 (#1296. Q04 Sch10_Tab_Ipo의 짝 — 수요예측참여·청약운용지시 열·고정 열 없음. Sch02_Lookup_Share·Sch12_Lookup_IpoCorpList·RdViewer_Sch10 재사용)
  Fnd30_Tab_DemandOpr, // Q05 1단계 (메뉴 #1341. + Fnd31_Page_DemandOprFund·Fnd31_Edit_DemandOprFund·Fnd30_Edit_DemandOpr·components/lookup/Adv02_Lookup_SelectSingle. [결재요청]·[상세보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·문서분류지정 Dcr30_Lookup_Link는 다음 단계)
  Fnd30_Tab_Opr, // Q06 1단계 (메뉴 #1227. + Fnd31_Page_OprFund·Fnd31_Edit_OprFund·Fnd30_Edit_Opr·Fnd30_Lookup_DemandOprList. [결재요청]·[상세보기]가 여는 전자결재 편집창 Apr01_Edit_ApprDoc·문서분류지정 Dcr30_Lookup_Link는 다음 단계)
  Fnd32_Tab_Account, // Q07 (메뉴 #1290. 공모주 참여계좌 — 거래처 조회창 Sys15_Lookup_Corp 재사용)
  Kfs01_Tab_RemoteView, // Z15 (메뉴 #1334. 리모트뷰 사용기록관리 — 엑셀업로드 remoteViewUpload)
  Est02_Tab_PfResultReport, // Q12 1단계 (메뉴 #1378. 용역결과보고서 — + Est03_TabPage_PfHistoryList·Est04_Lookup_PfFile. 결재 아이콘·문서보기의 전자결재 편집창 Apr01_Edit_ApprDoc·문서분류 Dcr01_Lookup_Class·Dcr30_Link는 다음 단계)
  Est03_Tab_PfHistoryConfirm, // Q11 (메뉴 #1382. 용역수행내역 승인 — + Est03_TabPage_PfHistoryConfirm·Est04_Grid_PfFileConfirm, 조회창은 Q10 Est02_Lookup_PfContract)
  Est03_Tab_PfHistory, // Q10 (메뉴 #1377. 용역수행내역 등록 — + Est03_TabPage_PfHistory·Est04_Grid_PfFile·Est02_Lookup_PfContract)
  Est02_Tab_PfContract, // Q09 (메뉴 #1376. 용역계약체결 — + Est02_Edit_PfContract·Est02_Grid_File·Est01_Lookup_PfFeeType. 결재 아이콘·문서보기의 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Est01_Tab_PfFeeType, // Q08 (메뉴 #1375. 부동산PF 수수료 — 계획서양식·결과보고서양식 아이콘이 여는 Com11_Lookup_FormMappingMulti)
  Sch10_Tab_IpoAdmin, // E20 (+ Sch12_Lookup_IpoCorp·Sch14_Lookup_IpoMismatch·Sch15_Lookup_IpoItemMatching·Com50_Lookup_StkItem)
  Ast01_Tab_InfoManager, // E21
  Ast01_Tab_ClassTreeManagement, // R08 (메뉴 #1117. 펀드자산 종목기본)
  Ast01_Tab_ClassTreeIntrinsic, // W01 (메뉴 #1087. 고유자산 기본등록 ①)
  Ast01_Tab_InfoIntrinsic, // W02 (메뉴 #1088. 고유자산 상세등록 ②)
  Ast40_Tab_OwnerCapital, // W03 (메뉴 #1299. 자기자본/투자한도 등록. 하위 Ast41_Lookup_InvestLimit·Ast41_Lookup_Insert)
  Ast01_Tab_InfoManagement, // R09 (메뉴 #1118. 펀드자산 종목상세)
  Pay10_Tab_PersonListManager, // S21 (S20의 RD 폼 Pay10_Rd_PersonList 공용 + 사원찾기 Emp00_Lookup_SelectSingle)
  Pay50_Tab_Expense, // Y10 (메뉴 #1407. 하위 Pay50_Edit_Expense(U03)·Pay50_Lookup_ExpenseRequestInsert(Y08) 재사용)
  Pay50_Tab_ExpenseManager, // U03 (메뉴 #1385. 하위 Pay50_Edit_Expense·Pay51_Lookup_ExpenseForm·Pay50_Lookup_RejectReason·Pay50_Lookup_ExpenseRequestList·Pay52_Lookup_AccountCode·Pay50_Lookup_Content·Sys17_Lookup_Account. 1단계: 바로등록·상신·문서보기·알림발송·증빙자료는 안내만)
  Pay50_Tab_ExpensePayWrite, // U07 (메뉴 #1386. 하위 Pay50_Lookup_UpdateDeposit·Pay50_Lookup_NewExpenseApprList·Sys15_Lookup_TelInfo·Ast01_Lookup_CorpAccount. 1단계: 상신·문서보기는 안내만)
  Pay50_Tab_ExpensePay, // U08 (메뉴 #1400. 하위 Sys15_Lookup_TelInfo. 1단계: 문서보기는 안내만)
  Pay50_Tab_ExpenseJournal, // U09 (메뉴 #1387. 하위 Pay50_Lookup_ExpenseUnJournal·Pay50_Lookup_UpdateAccount·Pay52_Lookup_AccountCode·Act02_Grid_CreateJournal. 1단계: 연관문서·전표수정 아이콘은 안내만)
  Pay10_Tab_PersonList, // S20 (RD 보고서 Pay10_Rd_PersonList 끼워 넣기)
  Pay10_Tab_MonthSearch, // S19 (Pay20_Lookup_MonthItem은 S17 재사용. 출력 창 = RdViewer)
  Pay10_Tab_MonthItem, // S17 (Pay10_Lookup_GroupList는 S16 재사용 + Pay20_Lookup_MonthItem. 출력 창 = RdViewer)
  Pay10_Tab_Retire, // S22 (퇴직정산 — 탭 4개 Pay10_TabPage_Retire·Pay12_TabPage_RetireInsure·Pay13_TabPage_RetireTax·Pay15_TabPage_RetireLeave + Pay12_Lookup_RetireCreate·Pay10_Lookup_RemLeaveDays·Pay24~27 보기 창. 1단계: 상신·문서보기는 안내)
  Pay10_Tab_List, // S18 (RD 보고서 Pay10_Rd_List 끼워 넣기 + Pay10_Lookup_Journal·Pay03_Lookup_PayAccount. 1단계: 상신·문서보기는 안내)
  Pay10_Tab_Month, // S16 1단계 (임금계산방법 Pay04_Lookup_Formula는 다음 단계 — 안내만. + Pay11_TabPage_MonthItem·팝업 6개·Emp01_Lookup_TransDate)
  Pay08_Tab_TaxWithholding, // S24
  Pay08_Tab_TaxWithholdingAdmin, // S25
  Pay32_Tab_InsurePay, // S27 (4대보험 정산내역 — Pay32_Lookup_Detail은 S16 부품, 정산 행에서 열 때 구분·기준년도를 행에서)
  Pay31_Tab_InsureApply, // S26 (4대보험신고(EDI) — 탭 4개 Pay31_TabPage_InsureApply1~4 + Pay31_Lookup_Insert1~3)
  Pay40_Tab_TaxWithholding, // S23 1단계 (결재요청 아이콘의 결재문서 작성·상세보기 아이콘의 결재문서 보기 Apr01_Edit_ApprDoc은 다음 단계)
  Pay01_Tab_AnnualPerson, // S15 1단계 (상신상태 아이콘의 결재문서 보기 Apr01_Edit_ApprDoc은 다음 단계)
  Pay01_Tab_AnnualList, // S14 1단계 (상신상태 아이콘의 결재문서 보기 Apr01_Edit_ApprDoc은 다음 단계. 출력 창 Pay01_Lookup_Rd_AnnualList = RdViewer)
  Pay01_Tab_Annual, // S13 1단계 (상신의 결재문서 작성·상신상태 아이콘의 결재문서 보기 Apr01_Edit_ApprDoc은 다음 단계. + Pay06_Lookup_ActList·Pay06_Lookup_ActMapping)
  Pay20_Tab_Deduct, // S29 (E22 Pay20_Tab_DeductAdmin 껍데기 재사용 — 원본이 클래스명만 다름, 탭 9개·25 클래스 모두 E22)
  Pay20_Tab_DeductAdmin, // E22 1단계 (탭 1~3: Pay20_TabPage_Item·Pay04_TabPage_Formula·Pay21_TabPage_Rate + Pay20_Lookup_ItemList·Pay04_Lookup_Insert. 탭 4~9는 자리만)
  Pay34_Tab_WorkTimeConfig, // E23
  Crd10_Tab_ExcelCompanyAdmin, // E24 (+ Crd11_Lookup_ExcelCodeAdmin)
  Emp55_Tab_benefitInfoManager, // E25 (+ Act01_Lookup_AccountCode)
  Emp41_Tab_EvalList, // E26 (+ Emp40_Lookup_Insert·Emp42_Lookup_EvalGrade)
  Emp43_Tab_EvalTarget, // T01 (+ Emp43_Lookup_SelectSingle·Emp43_Lookup_SelectMulti·Emp43_Edit_ChangeEval)
  Emp43_Tab_EvalExecute, // T02 (+ Emp44_Lookup_Write)
  Emp43_Tab_FirstAppr, // T03 (+ Emp43_Edit_Score. 1단계: 전자결재 상신·문서보기 Apr01_Edit_ApprDoc·문서분류 선택 Dcr30_Move_DcrClass는 다음 단계)
  Emp43_Tab_FinalAppr, // T04 (+ Emp43_Edit_CeoScore. 1단계: T03과 같음)
  Emp43_Tab_EvalResult, // T05 (+ 공용 사원찾기 Emp00_Lookup_SelectSingle)
  Att03_Tab_OvertimeReq, // T07
  Att02_Tab_CommuteStatus, // T08 (+ Att02_Edit_InOutReason)
  Att02_Tab_PersonStatus, // T09 (+ Att02_Edit_InOutReason)
  Car01_Tab_Info, // T10 (+ Car01_Edit_Info, Car02_Grid_User)
  Car03_Tab_List, // T13 (+ Car03_Tab_DayofMonth, Car03_Popup_BookingReg, Car03_TimelineChart)
  Car04_Tab_PrivateJournal, // T11 (+ Car04_Lookup_PrivateJournal, Car01_Lookup_Info)
  Car04_Tab_PrivateJournalAdmin, // T12 (+ Car04_Lookup_Batch)
  Car04_Tab_PublicJournal, // T14 (+ Car04_Lookup_PublicJournal, Car01_Lookup_Info)
  Emp01_Tab_InoutState, // T18 (+ Emp01_Rd_InoutState, RD 출력)
  Emp01_Tab_DueDiligence, // T19 (+ Emp01_Rd_DueDiligence, RD 출력)
  Rpt10_Tab_FssOrg, // T17 (+ RD 보고서 탭 페이지 6개·Rpt10_Lookup_WriteGuide, RD 출력)
  Car04_Tab_Journal, // T16 (+ Car04_Lookup_PrivateJournal·PublicJournal 재사용, RD 출력)
  Car04_Tab_PublicJournalAdmin, // T15 (+ Car04_Lookup_PublicJournalAdmin, Car04_Edit_PublicJournalAdmin)
  Att02_Tab_CommuteAdmin, // T06 (+ Att02_Lookup_InsertBatch·Att02_Edit_InOutReason·Att02_Edit_CommuteBatch·Att02_Edit_Commute·Att01_Lookup_WorkPolicy)
  Act01_Tab_AccountCode, // E27 (+ Act01_Edit_AccountCode·Act01_Lookup_Parent·Act01_Lookup_PrintYn·Act01_Lookup_CopyAdmin)
  Act10_Tab_ReprAccount, // E28 (+ Act10_Lookup_ReprAccount)
  Ast05_Tab_TrCodeAdmin, // E29 (+ Ast15_Lookup_TrCodeWindow·Ast15_Page_TrCodeWindow·Sys06_Lookup_SearchMenu·Sys40_Lookup_Bookmark)
  Act11_Tab_TrJournalMap, // E30 (+ Act11_Grid_TrJournalMap·Ast05_Lookup_TrCode)
  Act13_Tab_RealAccountMap, // E31 (+ Act10_Lookup_ReprAccount·Act01_Lookup_AccountCode)
  Act02_Tab_Journal, // X15
  Ast09_Tab_PreDepositBook, // X19 (메뉴 #1342. 하위 Act02_Grid_History)
  Act04_Tab_ReportFSS, // X22 (메뉴 #1225. 하위 Act04_Rd_ReportFSS(RD 영역). SR)
  Act04_Tab_ReportBS, // X21 (메뉴 #1179. X20과 같은 API를 reportType '1'로 사용)
  Act04_Tab_ReportPL, // X20 (메뉴 #1178. 하위 클래스 없음. 조회·비교일 API는 X21 Act04_Tab_ReportBS가 reportType '1'로 재사용)
  Act04_Tab_GenLedger, // X18 (메뉴 #1151. 하위 Act04_Lookup_GenLedger — [회계마감]·Act04_Lookup_AccountClose는 원본이 툴바에 넣지 않아 옮기지 않음)
  Act02_Tab_JournalSub, // X17 (메뉴 #1150. 하위 Act01_Lookup_AccountTree. 예금원장(기간) U02의 [계정별원장]이 TempData 'act.journalSub'로 행을 보낸다)
  Act02_Tab_ForJournal, // X16 (메뉴 #1177. X15의 외화 판 — 하위 Act02_Lookup_ModiForJournal)
  Act04_Tab_Close, // X14
  Act15_Tab_CloseCheck, // E32
  Act02_Tab_DepositIoList, // U01 (메뉴 #1164·#1470. 상신의 전자결재 편집창은 다음 단계, 문서분류 조회창 Dcr30_Move_DcrClass·RD 출력 재사용)
  Act02_Tab_CreateJournal, // X01 (메뉴 #1148. 하위 Act02_Grid_CreateJournal·Act02_Lookup_CreateJournal·Act02_Lookup_JournalList·Act80_Lookup_RelateAppr)
  Act02_Tab_CreateForJournal, // X07 (메뉴 #1176. 하위 Act02_Grid_CreateForJournal·Act02_Lookup_CreateForJournal·Act80_Lookup_RelateAppr. 외화 전표 abroType 2)
  Act02_Tab_JournalFix, // X02 (메뉴 #1207. 하위 Act02_Grid_JournalFix. 외화 전표 [변경]의 Act02_Lookup_ModiForJournal은 X07에서)
  Act02_Tab_CreateJournalBiz, // U10 (메뉴 #1180. 하위 Act02_Grid_CreateJournalBiz. 1단계: 분개 [변경] 아이콘의 Act02_Lookup_ModiJournal은 안내만)
  Pay50_Tab_AccountSumList, // U12 (메뉴 #1399. 단독 화면, [엑셀다운로드]는 RD)
  Crd02_Tab_DataUpload, // U14 (메뉴 #1039·#1479. 하위 Crd02_Edit_DataUpload·Crd11_Lookup_ExcelCode, 엑셀업로드·내역확정(Biz01_Promo) 서버 포함)
  Biz01_Tab_CardManagement, // U15 (메뉴 #1141. 하위 Biz01_Edit_Account·Biz01_Lookup_Message·Biz01_Lookup_CardManagementDownload·Crd02_Lookup_OtherList. 일괄저장 창·증빙자료 창은 L02 부품 재사용. 1단계: 전자결재·계정과목연결·비품대장 조회창은 안내만)
  Biz01_Tab_CardUserAllocation, // U16 (메뉴 #1406. 하위 Emp00_Lookup_SelectSingle 재사용. 클래스 1개)
  Biz01_Tab_CardReport, // U17 (메뉴 #1333. 하위 Biz01_Rd_CardReport(RD 영역)·Biz03_Lookup_AccountMap. 1단계: 전자결재 편집창은 안내만)
  Biz01_Tab_EntertmExpenseReport, // U18 (메뉴 #1335. 하위 Biz01_TabPage_MonthEntertmExpense·EntertmExpenseHistory·Biz02_TabPage_CompanyEntertmExpense, 기존 Biz02_Grid_PersonList 재사용. 1단계: 전자결재 편집창은 안내만)
  Crd01_Tab_Card, // U13 (메뉴 #1038·#1478. 하위 Crd01_Edit_Card·Crd03_Grid_User, 결제계좌 Ast01_Lookup_CorpAccount·직원 Emp00_Lookup_SelectSingle 재사용)
  Pay50_Tab_ExpenseConfirm, // Y09 (메뉴 #1384. 하위 Pay50_Lookup_ConfirmReason(=Pay50_Lookup_RejectReason 껍질)·Pay50_Lookup_Content. 증빙자료 Com01_Lookup_RelateAppr는 안내만)
  Pay50_Tab_ExpenseRequest, // Y08 (메뉴 #1383. 하위 Pay50_Lookup_ExpenseRequestInsert(등록·수정·보기·바로등록)·Pay50_Lookup_ExpenseCopy·Pay50_Lookup_ConfirmReason·Pay50_Lookup_RejectReason. 증빙자료 Com01_Lookup_RelateAppr·[신규문서 작성]의 새 문서 창은 안내만)
  Pay50_Tab_ExpenseSettle, // U11 (메뉴 #1390. 하위 Ast07_Grid_History·Ast07_Lookup_Settle·Ast07_Lookup_SettleMulti, 거래처 조회창은 임직원 포함(empYn). History [전표변경] 아이콘의 Act02_Lookup_ModiJournal은 안내만)
  Ast09_Tab_DepositBookPeriod, // U02 (메뉴 #1238·#1471. 하위 Ast01_Lookup_CorpAccount. 계정별원장 아이콘은 메뉴 1150을 열고 값만 보냄 — 받는 화면 Act02_Tab_JournalSub는 다음 단계)
  Emp17_Tab_Benefit, // Y06 (메뉴 #1221. 하위 Emp17_Lookup_Benefit. 전자결재 편집창 Apr01_Edit_ApprDoc 링크 A21~A23·A37·A49 연결)
  Emp50_Tab_TransportExpense, // Y07 (메뉴 #1349. 영수증 파일·Sys10_Lookup_FileViewer, 전자결재 편집창 Apr01_Edit_ApprDoc 링크 A42 연결)
  Emp54_Tab_Errand, // Y04 (메뉴 #1358. 하위 Emp54_Edit_Errand·Emp56_Lookup_Share(공용). 전자결재 편집창 Apr01_Edit_ApprDoc 링크 A45 연결)
  Emp20_Tab_Leave, // Y01 (메뉴 #1032. 하위 Emp20_Edit_Leave·Emp22_Lookup_EtcLeave(선택 모드)·Emp00_Lookup_SelectSingle(leaveManager). 전자결재 편집창 Apr01_Edit_ApprDoc 링크 A01 연결. 대결자 지정은 다음 단계)
  Emp20_Tab_LeaveList, // Y02 (메뉴 #1034. 사원 선택 조회창 Emp00_Lookup_SelectSingle·RD Emp20_Rd_LeaveList. 전자결재 편집창 Apr01_Edit_ApprDoc으로 문서보기)
  Emp21_Tab_PersonList, // Y03 (메뉴 #1184. 전자결재 편집창 Apr01_Edit_ApprDoc 링크 A15 연결, 문서분류 확인 Dcr01_Lookup_Class)
  Emp53_Tab_BizTrip, // Y05 (메뉴 #1359. 하위 Emp53_Lookup_BizTrip·Emp53_Lookup_BizTripShare·Emp56_Lookup_Share. 전자결재 편집창 Apr01_Edit_ApprDoc 링크 B11~B14 연결)
  Emp17_Tab_BenefitManager, // U05 (메뉴 #1222. 하위 Emp17_Edit_Note·Emp55_Lookup_account. 상신·문서보기의 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Emp50_Tab_TransportExpenseMng, // U06 (메뉴 #1348. 문서보기·상신의 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
  Ast06_Tab_TrTax, // U04 (메뉴 #1196. 하위 Ast06_Lookup_TrTax·Ast06_Lookup_Tr4Insure·Ast06_Grid_Journal·Ast05_Lookup_TrCodeWindow. 결재요청·문서보기의 전자결재 편집창, 분개 [변경]의 Act02_Lookup_ModiJournal은 다음 단계)
  Ast06_Tab_TrIntrinsic, // X03 (메뉴 #1091. + Ast06_Lookup_TrIntrinsic·Ast07_Grid_Settle·Ast06_Lookup_TrList·Ast06_Lookup_InsertCF·Ast13_Lookup_BookDepn. Ast07_Lookup_Settle은 거래 기준 NEW/MODI를 더했다)
  Ast06_Tab_AccruedIntrinsic, // X04 (메뉴 #1092. + Ast05_Lookup_TrCodeWindow·Ast07_Grid_History·Ast07_Lookup_Settle(NEW/9100)·Ast07_Lookup_SettleMulti. 결제 이력의 전표변경 Act02_Lookup_ModiJournal은 안내만)
  Ast06_Tab_TrFinance, // W06(메뉴 #1158. + Ast06_Lookup_TrFinance·Ast09_Lookup_Book. 연관문서·분개 [변경]은 W05와 같은 창)
  Ast06_Tab_TrForIntrinsic, // X08 (메뉴 #1171. + Ast06_Lookup_TrForIntrinsic·Ast07_Grid_ForSettle·Ast07_Lookup_ForSettle·Ast06_Grid_ForJournal·Act02_Lookup_ModiForJournal. 국외 거래 abroType 2)
  Ast06_Tab_AccruedForIntrinsic, // X09 (메뉴 #1173. + Ast07_Grid_ForHistory. 결제등록은 X08 Ast07_Lookup_ForSettle, 전표변경은 Act02_Lookup_ModiForJournal. 국외 abroType 2)
  Ast06_Tab_TrForFinance, // W07 (메뉴 #1365. + Ast06_Lookup_TrForFinance. 보유자산 조회창·연관문서·분개 [변경]은 W06과 같은 창)
  Ast13_Tab_DepnBook, // W17 (메뉴 #1181. + Ast16_Lookup_NonDeductTax(W11). 상신 A29 = Apr01_Edit_ApprDoc 연결, RD Ast13_Rd_DepnBook)
  Ast13_Tab_OfficeAssets, // W16 (메뉴 #1397. + Ast13_Lookup_ExpenseOfficeAssets·Pay50_Lookup_ExpenseOfficeAssets·Ast06_Lookup_ModifyNote. 상신 A65 = Apr01_Edit_ApprDoc 연결, RD Ast13_Rd_OfficeAssets)
  Ast09_Tab_FinanceBook, // W12 (메뉴 #1160. 상신 A30 = Apr01_Edit_ApprDoc 연결, RD Ast09_Rd_FinanceBook)
  Ast09_Tab_FinanceBookOpr, // W15 (메뉴 #1300. 아래 탭 Ast06_TabPage_FinanceBookOpr, RD Ast09_Rd_FinanceBookOpr)
  Ast09_Tab_FinanceBookPeriod, // W14 (메뉴 #1239. 조회가 sys99_print를 다시 쌓음, 엑셀 RD Ast09_Rd_FinanceBookPeriod)
  Ast09_Tab_FinanceForBook, // W13 (메뉴 #1366. 상신 A03, 조회 abroType 2, RD는 W12와 같은 mrd)
  Ast06_Tab_EvalDepn, // W11 (메뉴 #1175. + Ast16_Lookup_NonDeductTax·Ast06_Lookup_ModifyDepnCost. 분개 그리드는 W05~W09와 같은 부품)
  Ast25_Tab_Price, // W10 (메뉴 #1295. 시세 조회·저장·삭제 — 시세입력 창 Ast25_Lookup_Price(W09)와 같은 ast/prices API)
  Ast06_Tab_EvalFinance, // W09 (메뉴 #1167. + Ast06_TabPage_MarketEval·InterestEval·Ast25_Lookup_Price. 거래·분개 그리드는 W05~W08과 같은 부품)
  Ast06_Tab_TrAcntTransfer, // W08 (메뉴 #1208. + Ast06_Lookup_TrAcntTransfer. 보유자산 조회창·연관문서·분개 [변경]은 W06과 같은 창)
  Ast06_Tab_TrDepositInt, // W23 (메뉴 #1472·#1205. + Ast06_Lookup_TrDepositInt. 분개 그리드·연관문서·계좌 조회창은 W05·W08과 같은 창)
  Ast06_Tab_TrDeposit, // X06 (메뉴 #1166. + Ast06_Lookup_TrDeposit. 분개 그리드·연관문서·계좌 조회창은 W05·W23과 같은 창)
  Ast06_Tab_TrForDeposit, // X10 (메뉴 #1172. + Ast06_Lookup_TrForDeposit. 분개 그리드 Ast06_Grid_ForJournal·연관문서·계좌 조회창은 X08·W05와 같은 창)
  Ast06_Tab_FxEvalDeposit, // X12 (메뉴 #1174. + Ast24_Lookup_FxRate. 분개 그리드·보관처·계좌 조회창은 W09·X06과 같은 창)
  Ast30_Tab_FundMngFeeClose, // X35 (메뉴 #1218. X13 `ast/fund-fee-closes` 조회·처리·취소·보수원장정리 재사용 + 새 `fund-rd`)
  Ast30_Tab_OfficeMngFeeClose, // X13 (메뉴 #1202. + Ast30_Lookup_FeeClose. 분개 그리드·운용사 조회창은 X12와 같은 창)
  Ast06_Tab_TrIPO, // W05 1단계 (메뉴 #1288. + Ast06_Lookup_TrIPO·Ast06_Lookup_CreateIpoAstClass·Ast01_Lookup_Info. 연관문서 Act80_Lookup_RelateAppr·분개 [변경] Act02_Lookup_ModiJournal은 다음 단계)
  Tdm50_Tab_TotalDashboard, // N01 1단계 (+ Tdm50_Tab_Dashboard·DashboardExct·DashboardOrg·Tdm01_Lookup_SelectSingle, [보기] 아이콘의 점검 편집창·미흡 조치 상세는 N22·N24)
  Tdm50_Tab_CheckJob, // N20 1단계 (+ Tdm50_TabPage_CheckJob·Tdm50_Edit_CheckJob·Tdm55_Lookup_ChckRecord, 결재요청·문서보기·알림발송의 문자 창은 다른 도메인이라 점검 후 안내, 보고서 PDF는 서버 CheckExctPdfMaker)
  Tdm51_Tab_CheckOrg, // N21 (+ Tdm51_TabPage_CheckOrg·Tdm58_Lookup_ChckApprStep·Emp00_Lookup_SelectSingleTdm, 점검항목 [상세]의 Tdm52_Edit_ChckManl은 N22에서)
  Tdm52_Tab_CheckManl, // N22 (+ Tdm52_TabPage_CheckManl·Tdm52_Edit_ChckManl·Tdm52_Edit_ChckManlBatch·Tdm54_Edit_ChckInsuff)
  Tdm59_Tab_CheckAppr, // N23 (+ Tdm59_TabPage_CheckAppr·Tdm59_Edit_Cmnt·Tdm59_Edit_ReportCmnt·Tdm52_Edit_ChckManlCmnt·Tdm54_Lookup_ChckInsuffCmnt·Tdm55_Lookup_ChckRecord2, 증빙자료 창은 안내만)
  Tdm00_Tab_ChangeList, // N25
  Tdm35_Tab_TaskList, // N26
  Tdm43_Tab_ManlItemList, // N27 (+ Tdm45_TabPage_Relate·Tdm43_Lookup_RefBasis·Tdm43_Lookup_EtcModify)
  Tdm43_Tab_RelateFormFileUpload, // N28 (+ Tdm43_Lookup_RelateFormFileMultiUpload)
  Tdm91_Tab_CompanySetup, // N29
  Tdm54_Tab_CheckInsuff, // N24 (+ Tdm54_Lookup_ChckInsuff, 조치기록 증빙자료 창은 안내만)
  Tdm50_Tab_DutyRecon, // N03 (E15 Admin의 고객사용 짝 — 같은 API)
  Tdm50_Tab_DutyReconAdmin, // E15 (조회마다 DB 함수 f_recon_tdm('DB_CHK')이 sys99_print의 사용자 몫 행을 다시 만든다 — AS-IS 그대로)
  Sms02_Tab_TotalCount, // C05
  Sms03_Tab_SendAdmin, // C06 (실제 문자 발송은 하지 않음 — SmsSender 기본 구현)
  Sms03_Tab_GroupSend, // Z14 (C06의 group-sends·Edit 재사용, 재직 사원 대상. 실제 발송 없음)
  Sys01_Tab_Company, // A15 (1단계: 목록·신규 등록)
  Sys03_Tab_ComapnyMenu: Sys03_Tab_CompanyMenu, // A10 (메뉴 키 오타 그대로)
  Sys06_Tab_Menu, // A09
  Sys06_Tab_MenuView, // A11
  Sys06_Tab_MenuGuide, // A12
  Sys04_Tab_Role, // A01
  Sys04_Tab_RoleAdmin, // A02
  Sys05_Tab_UserRole, // A03
  Sys05_Tab_CompanyUserRole, // A05
  Sys05_Tab_PersonRole, // A04
  Sys07_Tab_RoleMenu, // A06
  Sys07_Tab_Company, // A08
  Sys07_Tab_CompanyRoleMenu, // A07
  Sys08_Tab_CodeKindAdmin, // A13
  Sys08_Tab_CodeKindClient, // A14
  Sys10_Tab_TotalSize, // A16
  Sys10_Tab_TrashFileList, // A17
  Sys86_Tab_Websocket, // A24 (실제 알림·강제 로그아웃은 시험하지 않음)
  Sys25_Tab_ResetPassword, // A19
  Sys12_Tab_Calendar, // A18 (메뉴 #1080 관리자·#1113 기초자료 둘 다)
  Sys15_Tab_Corp, // A25 (메뉴 #1146 거래처 등록·#1155 거래처 관리 둘 다)
  Sys30_Tab_LeaveYear, // A26 (메뉴 #1036)
  Sys96_Tab_OpenMenuLogAdmin, // A35
  Sys90_Tab_AfterService, // A29
  Sys60_Tab_FilePolicy, // A36
  Sys91_Tab_AdviceMember, // A31
  Sys92_Tab_ManagementTeam, // A32
  Sys90_Tab_AfterServiceAdmin, // A30
  Sys27_Tab_LoginManage, // A21
  Sys26_Tab_LoginHistory, // A20
  Sys80_Tab_AdminUserList, // A22
  Sys81_Tab_AdminUserHistory, // A23
  Sys95_Tab_Manual, // A33
  Sys95_Tab_ManualAdmin, // A34
  Sys53_Tab_SpecificMenuRequestAdmin, // A28 (1단계: 문서보기 아이콘의 전자결재 제외)
  Sys53_Tab_SpecificMenuRequest, // A27 (1단계: 결재요청 아이콘의 전자결재·분류선택 제외)
  Fbx01_Tab_Document, // F11 (메뉴 #1116 파일등록 + Fbx01_TabPage_DocList·Fbx02_Popup_History. 미리보기는 Sys10_Lookup_FileViewer 재사용)
  Fbx01_Tab_Search, // F12 (메뉴 #1122 파일조회 + Fbx01_Grid_DocList. Fbx02_Popup_History·Sys10_Lookup_FileViewer 재사용)
  Act09_Tab_AccountNum, // EE10 (메뉴 #1206)
  Ast05_Tab_TrCodeIntrinsic, // EE11 (메뉴 #1090. + Ast15_Lookup_TrCodeWindow·Ast01_Lookup_Info·Dcr30_Move_DcrClass)
  Emp00_Tab_OrgEmpManager, // EE12 (메뉴 #1031. + Org01_Tree_OrgCode)
  Fnd07_Tab_IssuingEntity, // EE13 (메뉴 #1053. 저장은 원본 서버에 update가 없어 거절)
  Mrb01_Tab_List, // EE14 (메뉴 #1067. + Mrb01_Tab_DayofMonth, Mrb01_Popup_MeetingRoomReg, Mrb01_TimelineChart. 첨부파일은 Bbs02_Lookup_File admin)
  Scm10_Tab_Dev, // EE17 (메뉴 #1263. + Scm11_Grid_DevStep·Scm11_Edit_DevStep·Scm11_Grid_ApprFile·Scm13_Grid_DevProgram·Scm13_Lookup_MultiUpload·Scm03_Lookup_ExpectProgram·Scm01_Lookup_Detail·Scm11_Lookup_ResultMessage, 나머지는 EE15·EE16 재사용)
  Scm30_Tab_Program, // EE19 (메뉴 #1265. + Scm30_Lookup_Program·Scm30_Lookup_MultiUpload, Scm30_Edit_Program의 insert·edit·versionEdit)
  Biz10_Tab_ContCorp, // EE20 (메뉴 #1209. + Biz11_Edit_ContHistory·Biz12_Edit_FeeInfo·Biz14_Lookup_RelateAppr·Biz11_Lookup_FileList·Biz17_Lookup_HoldFee·탭 4개, Sys15_Lookup_Corp_OnlyKFS)
  Biz20_Tab_FeeCharge, // EE21 (메뉴 #1210. + Biz20_Edit_FeeCharge·Biz22_Lookup_FeeChargeCalc·Biz20_Lookup_FileList·Biz29_Lookup_Account·Biz10_Lookup_ContCorp)
  Biz51_Tab_ErpContCorp, // EE22 (메뉴 #1402. + Biz51_Edit_ErpContCorp·Biz52_Lookup_ErpFee·Biz50_Lookup_ErpSetup·Biz50_Lookup_MailMapping, 증빙자료 Com01_Lookup_RelateAppr는 안내만 — EE34)
  Biz55_Tab_ErpFeeCharge, // EE23 (메뉴 #1403. + Biz55_Lookup_ErpFeeCharge·Biz55_Lookup_ErpCompany, 메일 발송 Dcr10_Lookup_MailSender 는 EE35)
  Scm13_Tab_Deploy, // EE18 (메뉴 #1266. + Scm13_Page_Deploy·Scm13_Lookup_Note·Scm30_Edit_Program(read), 나머지는 EE15~EE17 재사용)
  Scm01_Tab_DevMng, // EE16 (메뉴 #1262. + Scm01_Edit_DevMngRO·Scm01_Edit_DevMng·Scm10_Grid_Dev·Scm03_Grid_ExpectProgram·Scm11_Lookup_DevStep·Scm11_Lookup_Result·Scm10_Lookup_Note·Scm12_Lookup_DevStepRule·Scm13_Lookup_DevProgram·Scm13_Edit_DevProgram·Scm30_Lookup_SelectMulti·Scm01_Lookup_ResultContent·Scm01_Lookup_ApprFile + components/lookup/Biz13_Lookup_WithCorp)
  Scm01_Tab_Sr, // EE15 (메뉴 #1261. + Scm01_Edit_Sr·Scm01_Edit_SrRO·Scm01_Lookup_SrContent·Scm01_Grid_ApprFile·Scm02_Grid_ApprStep·Scm02_Edit_ApprStep·Scm02_Edit_NoteMessage)
  Test_Tab_ReactComponents, // B11 공통 컴포넌트 테스트 (원본 없음, mock)
};
