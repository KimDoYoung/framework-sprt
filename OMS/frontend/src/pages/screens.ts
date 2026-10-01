import React from 'react';
import { Emp00ChangeHistoryView } from './emp/Emp00ChangeHistoryView';
import { Emp00OrgEmpManagerView, Emp00OrgPersonView } from './emp/Emp00OrgPersonView';
import { Emp00RoleMenuView } from './emp/Emp00RoleMenuView';
import { Emp00TransInfoView } from './emp/Emp00TransInfoView';
import { Emp01UserInfoView } from './emp/Emp01UserInfoView';
import { Org01OrgCodeView } from './org/Org01OrgCodeView';
import { Sys01CompanyView } from './sys/Sys01CompanyView';
import { Sys03CompanyMenuView } from './sys/Sys03CompanyMenuView';
import { Sys04RoleView } from './sys/Sys04RoleView';
import { Sys04RoleAdminView } from './sys/Sys04RoleAdminView';
import { Sys05UserRoleView } from './sys/Sys05UserRoleView';
import { Sys05PersonRoleView } from './sys/Sys05PersonRoleView';
import { Sys05CompanyUserRoleView } from './sys/Sys05CompanyUserRoleView';
import { Sys06MenuView } from './sys/Sys06MenuView';
import { Sys06MenuGuideView } from './sys/Sys06MenuGuideView';
import { Sys06MenuViewView } from './sys/Sys06MenuViewView';
import { Sys07RoleMenuView } from './sys/Sys07RoleMenuView';
import { Sys07CompanyView } from './sys/Sys07CompanyView';
import { Sys07CompanyRoleMenuView } from './sys/Sys07CompanyRoleMenuView';
import { Sys08CodeKindAdminView } from './sys/Sys08CodeKindAdminView';
import { Sys08CodeKindClientView } from './sys/Sys08CodeKindClientView';
import { Sys10TotalSizeView } from './sys/Sys10TotalSizeView';
import { Sys12CalendarView } from './sys/Sys12CalendarView';
import { Sys10TrashFileListView } from './sys/Sys10TrashFileListView';

/**
 * 화면 등록표 (AS-IS MenuOpener.TAB_REGISTRY): sys06_menu.sys06_class_nm → 화면 컴포넌트.
 * 없는 클래스는 MainFrame이 PendingScreenView로 연다.
 */
export const SCREENS: Record<string, React.FC> = {
  Emp00_Tab_ChangeHistory: Emp00ChangeHistoryView,
  Emp00_Tab_OrgEmpManager: Emp00OrgEmpManagerView,
  Emp00_Tab_OrgPerson: Emp00OrgPersonView,
  Emp00_Tab_RoleMenu: Emp00RoleMenuView,
  Emp00_Tab_TransInfo: Emp00TransInfoView,
  Emp01_Tab_UserInfo: Emp01UserInfoView,
  Org01_Tab_OrgCode: Org01OrgCodeView,
  Sys01_Tab_Company: Sys01CompanyView,
  // asseterpdb sys06_class_nm 오타(Comapny) 그대로 — 색인 '메뉴 키'
  Sys03_Tab_ComapnyMenu: Sys03CompanyMenuView,
  Sys03_Tab_CompanyMenu: Sys03CompanyMenuView,
  Sys04_Tab_Role: Sys04RoleView,
  Sys04_Tab_RoleAdmin: Sys04RoleAdminView,
  Sys05_Tab_UserRole: Sys05UserRoleView,
  Sys05_Tab_CompanyUserRole: Sys05CompanyUserRoleView,
  Sys05_Tab_PersonRole: Sys05PersonRoleView,
  Sys06_Tab_Menu: Sys06MenuView,
  Sys06_Tab_MenuGuide: Sys06MenuGuideView,
  Sys06_Tab_MenuView: Sys06MenuViewView,
  Sys07_Tab_RoleMenu: Sys07RoleMenuView,
  Sys07_Tab_Company: Sys07CompanyView,
  Sys07_Tab_CompanyRoleMenu: Sys07CompanyRoleMenuView,
  Sys08_Tab_CodeKindAdmin: Sys08CodeKindAdminView,
  Sys08_Tab_CodeKindClient: Sys08CodeKindClientView,
  Sys10_Tab_TotalSize: Sys10TotalSizeView,
  Sys10_Tab_TrashFileList: Sys10TrashFileListView,
  Sys12_Tab_Calendar: Sys12CalendarView,
};
