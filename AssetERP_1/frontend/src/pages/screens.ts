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
import { Sys07_Tab_RoleMenu } from './sys/Sys07_Tab_RoleMenu';
import { Sys07_Tab_Company } from './sys/Sys07_Tab_Company';
import { Sys07_Tab_CompanyRoleMenu } from './sys/Sys07_Tab_CompanyRoleMenu';

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
  Sys53_Tab_SpecificMenuRequest, // A27 (1단계: 결재요청 아이콘의 전자결재·분류선택 제외)
};
