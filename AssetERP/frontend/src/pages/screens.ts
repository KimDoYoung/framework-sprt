import React from 'react';
import { Emp00_Tab_TransInfo } from './emp/Emp00_Tab_TransInfo';
import { Emp00_Tab_RoleMenu } from './emp/Emp00_Tab_RoleMenu';
import { Emp01_Tab_UserInfo } from './emp/Emp01_Tab_UserInfo';
import { Org01_Tab_OrgCode } from './org/Org01_Tab_OrgCode';
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
import { Sys91_Tab_AdviceMember } from './sys/Sys91_Tab_AdviceMember';
import { Sys92_Tab_ManagementTeam } from './sys/Sys92_Tab_ManagementTeam';
import { Sys90_Tab_AfterService } from './sys/Sys90_Tab_AfterService';
import { Sys90_Tab_AfterServiceAdmin } from './sys/Sys90_Tab_AfterServiceAdmin';
import { Sys27_Tab_LoginManage } from './sys/Sys27_Tab_LoginManage';
import { Sys26_Tab_LoginHistory } from './sys/Sys26_Tab_LoginHistory';
import { Sys80_Tab_AdminUserList } from './sys/Sys80_Tab_AdminUserList';
import { Sys81_Tab_AdminUserHistory } from './sys/Sys81_Tab_AdminUserHistory';
import { Sys95_Tab_Manual } from './sys/Sys95_Tab_Manual';
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
import { Test_Tab_ReactComponents } from './test/Test_Tab_ReactComponents';

/**
 * 화면 등록표 (AS-IS MenuOpener): sys06_menu.sys06_class_nm(메뉴 키) → 화면 컴포넌트.
 * 없는 키는 MainFrame이 PendingScreenView로 연다. A 작업이 끝날 때마다 여기에 등록한다(05 §2 프론트).
 * 메뉴 키는 DB 값 그대로 쓴다(오타 `Sys03_Tab_ComapnyMenu`도 그대로).
 */
export const SCREENS: Record<string, React.FC> = {
  Emp00_Tab_TransInfo, // C01 (1단계: 목록·등록·기본정보·일반발령)
  Emp00_Tab_RoleMenu, // C04
  Emp01_Tab_UserInfo, // C03
  Org01_Tab_OrgCode, // C02 (조직도보기 Org02_View_Chart 제외)
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
  Sys91_Tab_AdviceMember, // A31
  Sys92_Tab_ManagementTeam, // A32
  Sys90_Tab_AfterServiceAdmin, // A30
  Sys27_Tab_LoginManage, // A21
  Sys26_Tab_LoginHistory, // A20
  Sys80_Tab_AdminUserList, // A22
  Sys81_Tab_AdminUserHistory, // A23
  Sys95_Tab_Manual, // A33
  Sys53_Tab_SpecificMenuRequestAdmin, // A28 (1단계: 문서보기 아이콘의 전자결재 제외)
  Sys53_Tab_SpecificMenuRequest, // A27 (1단계: 결재요청 아이콘의 전자결재·분류선택 제외)
  Test_Tab_ReactComponents, // B11 공통 컴포넌트 테스트 (원본 없음, mock)
};
