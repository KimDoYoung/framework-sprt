import React from 'react';
import { Bbs15_Tab_CompanyRuleManager } from './bbs/Bbs15_Tab_CompanyRuleManager';
import { Chk01_Tab_ClassTree } from './chk/Chk01_Tab_ClassTree';
import { Chk02_Tab_DailyListAdmin } from './chk/Chk02_Tab_DailyListAdmin';
import { Dbm01_Tab_TabComments } from './dbm/Dbm01_Tab_TabComments';
import { Dbm10_Tab_MakePdf } from './dbm/Dbm10_Tab_MakePdf';
import { Emp00_Tab_TransInfo } from './emp/Emp00_Tab_TransInfo';
import { Emp00_Tab_RoleMenu } from './emp/Emp00_Tab_RoleMenu';
import { Emp01_Tab_UserInfo } from './emp/Emp01_Tab_UserInfo';
import { Flt05_Tab_ItemTypeAdmin } from './flt/Flt05_Tab_ItemTypeAdmin';
import { Fnd03_Tab_ConsignmentManager } from './fnd/Fnd03_Tab_ConsignmentManager';
import { Fnd06_Tab_OfficeWorkManager } from './fnd/Fnd06_Tab_OfficeWorkManager';
import { Ast01_Tab_InfoManager } from './ast/Ast01_Tab_InfoManager';
import { Fnd09_Tab_TrustBankManager } from './fnd/Fnd09_Tab_TrustBankManager';
import { Ics01_Tab_ClassTree } from './ics/Ics01_Tab_ClassTree';
import { Ics01_Tab_IcsFileUpload } from './ics/Ics01_Tab_IcsFileUpload';
import { Ics10_Tab_ChecklistAdmin } from './ics/Ics10_Tab_ChecklistAdmin';
import { Ics17_Tab_UserRequestAdmin } from './ics/Ics17_Tab_UserRequestAdmin';
import { Ics30_Tab_Compliance } from './ics/Ics30_Tab_Compliance';
import { Ics20_Tab_RevisionHistoryAdmin } from './ics/Ics20_Tab_RevisionHistoryAdmin';
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
import { Tdm42_Tab_ManlManagerAdmin } from './tdm/Tdm42_Tab_ManlManagerAdmin';
import { Tdm50_Tab_DutyProgressAdmin } from './tdm/Tdm50_Tab_DutyProgressAdmin';
import { Tdm50_Tab_DutyReconAdmin } from './tdm/Tdm50_Tab_DutyReconAdmin';
import { Dcr01_Tab_ClassTree } from './dcr/Dcr01_Tab_ClassTree';
import { Dcr05_Tab_DocType } from './dcr/Dcr05_Tab_DocType';
import { Dcr30_Tab_LinkAdmin } from './dcr/Dcr30_Tab_LinkAdmin';
import { Dcr01_Tab_DcrWrite } from './dcr/Dcr01_Tab_DcrWrite';
import { Rpt10_Tab_FssSubmit } from './rpt/Rpt10_Tab_FssSubmit';
import { Sch10_Tab_IpoAdmin } from './sch/Sch10_Tab_IpoAdmin';
import { Test_Tab_ReactComponents } from './test/Test_Tab_ReactComponents';

/**
 * 화면 등록표 (AS-IS MenuOpener): sys06_menu.sys06_class_nm(메뉴 키) → 화면 컴포넌트.
 * 없는 키는 MainFrame이 PendingScreenView로 연다. A 작업이 끝날 때마다 여기에 등록한다(05 §2 프론트).
 * 메뉴 키는 DB 값 그대로 쓴다(오타 `Sys03_Tab_ComapnyMenu`도 그대로).
 */
export const SCREENS: Record<string, React.FC> = {
  Bbs15_Tab_CompanyRuleManager, // E10 (+ Bbs15_Edit_CompanyRuleManager·Bbs15_Lookup_File, 엑셀다운로드는 RD 리포트 대신 서버가 xlsx 생성)
  Chk01_Tab_ClassTree, // E06
  Chk02_Tab_DailyListAdmin, // E07
  Dbm01_Tab_TabComments, // C08 (주석 저장·소스 생성은 DB 프로시저가 없어 서버가 거절)
  Dbm10_Tab_MakePdf, // C07 (PDF 생성은 서버 연동 없음 — PdfMaker 기본 구현)
  Emp00_Tab_TransInfo, // C01 (1단계: 목록·등록·기본정보·일반발령)
  Emp00_Tab_RoleMenu, // C04
  Emp01_Tab_UserInfo, // C03
  Flt05_Tab_ItemTypeAdmin, // E08
  Fnd03_Tab_ConsignmentManager, // D11 (ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절)
  Fnd06_Tab_OfficeWorkManager, // D12 (ICAM가져오기는 외부 ICAM DB 연동이 없어 서버가 거절)
  Fnd09_Tab_TrustBankManager, // D13 (저장은 원본 서버에 insertCheck가 없어 원본에서도 실패 — 서버가 거절, ICAM가져오기도 거절)
  Ics01_Tab_ClassTree, // E01 (기한 설정 Sch03_Lookup_Ics는 다른 도메인이라 별도 ID)
  Ics01_Tab_IcsFileUpload, // E02
  Ics20_Tab_RevisionHistoryAdmin, // E03
  Ics10_Tab_ChecklistAdmin, // E04
  Ics17_Tab_UserRequestAdmin, // E09 (+ Ics17_Edit_UserRequestAdmin·Ics17_Lookup_LawContent·Ics17_Grid_FileList)
  Ics30_Tab_Compliance, // E05 (+ E05-1 예외사원 등록 Emp33_Lookup_ExceptBiz)
  Icam03_Tab_Fund, // D07 (ICAM Get·타사무 Get은 외부 ICAM DB 연동이 없어 서버가 거절)
  Icam10_Tab_FeeAdmin, // D08 (ICAM 발생보수 가져오기도 같은 연동이 없어 서버가 거절)
  Icam50_Tab_DbSource, // D09 (DB소스 가져오기도 같은 연동이 없어 서버가 거절)
  Icam99_Tab_Test, // D10 (작업 버튼은 BatchMain 연동이 없어 서버가 거절)
  Ifi90_Tab_Config, // D01 (계정PW 저장은 원본도 안 함 — 작업기록 제안)
  Org01_Tab_OrgCode, // C02 (조직도보기 Org02_View_Chart 제외)
  Tdm31_Tab_RoleDescAdmin, // E11 (재생성은 RD 리포트 연동이 없어 서버가 거절 — RoleDescPdfMaker 기본 구현)
  Tdm32_Tab_RoleDigmAdmin, // E12 (재생성은 RD 리포트 연동이 없어 서버가 거절 — RoleDigmPdfMaker 기본 구현)
  Tdm42_Tab_ManlManagerAdmin, // E13 1단계 (+ Tdm43_Lookup_ManlItem·Org00_Lookup_SelectTdm, 재생성은 RD 연동이 없어 서버가 거절 — ManlOrgPdfMaker 기본 구현, 점검항목 등록/수정창은 E13-2)
  Tdm50_Tab_DutyProgressAdmin, // E14 (조회마다 DB 함수 f_recon_tdm이 sys99_print의 사용자 몫 행을 다시 만든다 — AS-IS 그대로)
  Dcr01_Tab_ClassTree, // E16 (메뉴 #1110·#1001 — 같은 클래스. + Dcr01_Grid_DocType·Dcr01_Edit_ClassTree·Dcr01_Move_*·Dcr01_Lookup_UseYn·DcrCopyAdmin·Dcr05~07·Dcr20·Dcr21, apr 조회창 둘)
  Dcr05_Tab_DocType, // E18 (메뉴 #1482·#1007 — 같은 클래스. + Dcr05_Edit_DocType·Dcr05_Edit_Update(E16)·Sys09_Lookup_Code(구분추가)·Sys01_Lookup_Company)
  Dcr30_Tab_LinkAdmin, // E17 (열 때 Link 없는 회사에 채우는 linkCheck가 쓰기 — AS-IS 그대로. + Dcr30_TabPage_Company·Dcr30_Lookup_LinkNote·Dcr30_Move_DcrClass·Com10_Lookup_CommonMapping·Pay06_Popup_Example)
  Dcr01_Tab_DcrWrite, // F01 1단계 (메뉴 #1318 + Dcr08_Lookup_SelectSingle. 전자결재 편집창 Apr01_Edit_ApprDoc·북마크 Apr50_Lookup_ApprList는 F01-2)
  Rpt10_Tab_FssSubmit, // E19 (+ Rpt10_Edit_WriteGuide)
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
  Test_Tab_ReactComponents, // B11 공통 컴포넌트 테스트 (원본 없음, mock)
};
