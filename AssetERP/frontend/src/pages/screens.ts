import React from 'react';
import { Bbs02_Tab_NoticeViewLaw } from './bbs/Bbs02_Tab_NoticeViewLaw';
import { Bbs15_Tab_CompanyRuleManager } from './bbs/Bbs15_Tab_CompanyRuleManager';
import { Chk01_Tab_ClassTree } from './chk/Chk01_Tab_ClassTree';
import { Chk02_Tab_DailyListAdmin } from './chk/Chk02_Tab_DailyListAdmin';
import { Dbm01_Tab_TabComments } from './dbm/Dbm01_Tab_TabComments';
import { Dbm10_Tab_MakePdf } from './dbm/Dbm10_Tab_MakePdf';
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
import { Fnd03_Tab_ConsignmentManager } from './fnd/Fnd03_Tab_ConsignmentManager';
import { Fnd06_Tab_OfficeWorkManager } from './fnd/Fnd06_Tab_OfficeWorkManager';
import { Ast01_Tab_InfoManager } from './ast/Ast01_Tab_InfoManager';
import { Fnd09_Tab_TrustBankManager } from './fnd/Fnd09_Tab_TrustBankManager';
import { Ics01_Tab_ClassTree } from './ics/Ics01_Tab_ClassTree';
import { Ics01_Tab_ApprList } from './ics/Ics01_Tab_ApprList';
import { Apr90_Tab_DisposalAppr } from './apr/Apr90_Tab_DisposalAppr';
import { Apr90_Tab_DisposalList } from './apr/Apr90_Tab_DisposalList';
import { Apr01_Tab_MyApproveList } from './apr/Apr01_Tab_MyApproveList';
import { Apr01_Tab_MyRequestList } from './apr/Apr01_Tab_MyRequestList';
import { Apr01_Tab_BizPriorApproval } from './apr/Apr01_Tab_BizPriorApproval';
import { Apr01_Tab_MyReferenceList } from './apr/Apr01_Tab_MyReferenceList';
import { Apr01_Tab_MyAuthList } from './apr/Apr01_Tab_MyAuthList';
import { Apr01_Tab_StampSeq } from './apr/Apr01_Tab_StampSeq';
import { Apr01_Tab_TotalList } from './apr/Apr01_Tab_TotalList';
import { Apr01_Tab_SubList } from './apr/Apr01_Tab_SubList';
import { Apr07_Tab_AltAppr } from './apr/Apr07_Tab_AltAppr';
import { Apr10_Tab_Stamp } from './apr/Apr10_Tab_Stamp';
import { Apr15_Tab_ReprCorp } from './apr/Apr15_Tab_ReprCorp';
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
import { Icam10_Tab_FeeAdmin } from './icam/Icam10_Tab_FeeAdmin';
import { Icam50_Tab_DbSource } from './icam/Icam50_Tab_DbSource';
import { Icam99_Tab_Test } from './icam/Icam99_Tab_Test';
import { Ifi90_Tab_Config } from './ifi/Ifi90_Tab_Config';
import { Org01_Tab_OrgCode } from './org/Org01_Tab_OrgCode';
import { Pay20_Tab_DeductAdmin } from './pay/Pay20_Tab_DeductAdmin';
import { Pay34_Tab_WorkTimeConfig } from './pay/Pay34_Tab_WorkTimeConfig';
import { Crd10_Tab_ExcelCompanyAdmin } from './crd/Crd10_Tab_ExcelCompanyAdmin';
import { Emp55_Tab_benefitInfoManager } from './emp/Emp55_Tab_benefitInfoManager';
import { Emp41_Tab_EvalList } from './emp/Emp41_Tab_EvalList';
import { Act01_Tab_AccountCode } from './act/Act01_Tab_AccountCode';
import { Act10_Tab_ReprAccount } from './act/Act10_Tab_ReprAccount';
import { Ast05_Tab_TrCodeAdmin } from './ast/Ast05_Tab_TrCodeAdmin';
import { Act11_Tab_TrJournalMap } from './act/Act11_Tab_TrJournalMap';
import { Act13_Tab_RealAccountMap } from './act/Act13_Tab_RealAccountMap';
import { Act15_Tab_CloseCheck } from './act/Act15_Tab_CloseCheck';
import { Sms02_Tab_TotalCount } from './sms/Sms02_Tab_TotalCount';
import { Sms03_Tab_SendAdmin } from './sms/Sms03_Tab_SendAdmin';
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
import { Test_Tab_ReactComponents } from './test/Test_Tab_ReactComponents';

/**
 * 화면 등록표 (AS-IS MenuOpener): sys06_menu.sys06_class_nm(메뉴 키) → 화면 컴포넌트.
 * 없는 키는 MainFrame이 PendingScreenView로 연다. A 작업이 끝날 때마다 여기에 등록한다(05 §2 프론트).
 * 메뉴 키는 DB 값 그대로 쓴다(오타 `Sys03_Tab_ComapnyMenu`도 그대로).
 */
export const SCREENS: Record<string, React.FC> = {
  Bbs02_Tab_NoticeViewLaw, // H01 (+ Bbs02_Popup_NoticeAdmin·Bbs07_TapPage_Comment·Bbs07_Lookup_FileList·Bbs02_Lookup_File)
  Bbs15_Tab_CompanyRuleManager, // E10 (+ Bbs15_Edit_CompanyRuleManager·Bbs15_Lookup_File, 엑셀다운로드는 RD 리포트 대신 서버가 xlsx 생성)
  Chk01_Tab_ClassTree, // E06
  Chk02_Tab_DailyListAdmin, // E07
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
  Fnd01_Tab_FundPlan, // P01 (+ Fnd00_Lookup_FundCode, 신규기획펀드 등록 — 아래 편집 폼 Fnd01_Edit_FundPlan 포함)
  Fnd03_Tab_ConsignmentManager, // D11 (ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절)
  Fnd06_Tab_OfficeWorkManager, // D12 (ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절)
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
  Apr15_Tab_ReprCorp, // G08 (메뉴 #1506. 인감 조회창 Apr10_Lookup_Stamp 재사용)
  Apr07_Tab_AltAppr, // G05 (메뉴 #1021. 사원찾기 Emp00_Lookup_SelectSingle 재사용)
  Apr90_Tab_DisposalList, // F04 1단계 (메뉴 #1443. 상세보기가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계)
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
  Biz01_Tab_Card, // L02 (메뉴 #1131. 하위 Biz01_Edit_Card·Biz02_Grid_PersonList(InternalList·ExternalList)·Biz01_Lookup_CardManagement·Biz05_Lookup_RelateAppr·Biz05_Lookup_RelateFile. 1단계: 전자결재·거래처 조회창은 안내만)
  Biz01_Tab_Other, // L03 (메뉴 #1132. 하위 Biz01_Edit_Other. 사람 목록·증빙자료 창은 L02 부품 재사용)
  Bmt01_Tab_Buy, // L05 (메뉴 #1135. 아래쪽 제공내역은 pages/biz/Biz01_TabPage_List. 전자결재·상대처 조회창은 다음 단계)
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
  Ics31_Tab_ComplianceConfirm, // K02 ([상신] Ics32_Lookup_RelateAppr은 원본도 툴바에 안 붙인 도달 불가 버튼이라 제외)
  Ics31_Tab_ComplianceReport, // K03 1단계 (RD 미리보기 대신 표. [상신]·[문서보기]·문서분류 선택은 전자결재 단계 — 안내만)
  Icam03_Tab_Fund, // D07 (ICAM Get·타사무 Get은 외부 ICAM DB 연동이 없어 서버가 거절)
  Icam10_Tab_FeeAdmin, // D08 (ICAM 발생보수 가져오기도 같은 연동이 없어 서버가 거절)
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
  Dcr01_Tab_DcrUser, // F02 1단계 (메뉴 #1002 + Dcr01_Tab_DcrManager·Apr01_Grid_DocList·Apr03_TabPage_Relate. 편집창 Apr01_Edit_ApprDoc·북마크 Apr50_Lookup_ApprList·메일 Dcr10_Lookup_MailSender는 다음 단계)
  Dcr01_Tab_DcrWrite, // F01 1단계 (메뉴 #1318 + Dcr08_Lookup_SelectSingle. 전자결재 편집창 Apr01_Edit_ApprDoc·북마크 Apr50_Lookup_ApprList는 F01-2)
  Rpt10_Tab_FssSubmit, // E19 (+ Rpt10_Edit_WriteGuide)
  Sch01_Tab_Info, // O01 (+ Sch01_Lookup_Info·Sch01_Lookup_ManagerModi(Run)·Sch01_Grid_RelateFile·Sch08_Lookup_Class·Sch06_Lookup_AlarmSetup. 기한 Sch03_Lookup_Short/Cycle은 E01-1 재사용)
  Sch01_Tab_List, // O02 (+ Sch01_Lookup_InfoView·Sch10_Lookup_Ipo. 첨부는 Bbs02_Lookup_File 재사용)
  Sch01_Tab_ListOrg, // O03 (+ Org00_Lookup_SelectMulti·Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용)
  Sch04_Tab_ToDoList, // O04 (+ Emp00_Lookup_SelectSingle·Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용)
  Sch04_Tab_DailyCheckList, // O05 (+ AreaMessage·Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용, 상신은 1단계 안내만)
  Sch04_Tab_DailyCheckListStatus, // O06 (+ Sch01_Lookup_InfoView·Sch10_Lookup_Ipo 재사용, 결재 문서 보기는 안내만)
  Sch04_Tab_IcsList, // H06 (+ Sch04_Lookup_IcsMsg·Ics01/Icr01_Lookup_ClassTreeDetail. Apr01_Edit_ApprDoc은 다른 도메인이라 안내만)
  Sch04_Tab_IcsListManager, // H12 (H06의 관리자용 짝. Sch04_Lookup_IcsMsg actionType "2"·Org00_Lookup_SelectMulti 재사용. Apr01_Edit_ApprDoc은 안내만)
  Sch10_Tab_IpoAdmin, // E20 (+ Sch12_Lookup_IpoCorp·Sch14_Lookup_IpoMismatch·Sch15_Lookup_IpoItemMatching·Com50_Lookup_StkItem)
  Ast01_Tab_InfoManager, // E21
  Pay20_Tab_DeductAdmin, // E22 1단계 (탭 1~3: Pay20_TabPage_Item·Pay04_TabPage_Formula·Pay21_TabPage_Rate + Pay20_Lookup_ItemList·Pay04_Lookup_Insert. 탭 4~9는 자리만)
  Pay34_Tab_WorkTimeConfig, // E23
  Crd10_Tab_ExcelCompanyAdmin, // E24 (+ Crd11_Lookup_ExcelCodeAdmin)
  Emp55_Tab_benefitInfoManager, // E25 (+ Act01_Lookup_AccountCode)
  Emp41_Tab_EvalList, // E26 (+ Emp40_Lookup_Insert·Emp42_Lookup_EvalGrade)
  Act01_Tab_AccountCode, // E27 (+ Act01_Edit_AccountCode·Act01_Lookup_Parent·Act01_Lookup_PrintYn·Act01_Lookup_CopyAdmin)
  Act10_Tab_ReprAccount, // E28 (+ Act10_Lookup_ReprAccount)
  Ast05_Tab_TrCodeAdmin, // E29 (+ Ast15_Lookup_TrCodeWindow·Ast15_Page_TrCodeWindow·Sys06_Lookup_SearchMenu·Sys40_Lookup_Bookmark)
  Act11_Tab_TrJournalMap, // E30 (+ Act11_Grid_TrJournalMap·Ast05_Lookup_TrCode)
  Act13_Tab_RealAccountMap, // E31 (+ Act10_Lookup_ReprAccount·Act01_Lookup_AccountCode)
  Act15_Tab_CloseCheck, // E32
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
  Test_Tab_ReactComponents, // B11 공통 컴포넌트 테스트 (원본 없음, mock)
};
