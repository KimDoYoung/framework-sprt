import React from 'react';
import { Sys01_Tab_Company } from './sys/Sys01_Tab_Company';
import { Sys03_Tab_CompanyMenu } from './sys/Sys03_Tab_CompanyMenu';
import { Sys04_Tab_Role } from './sys/Sys04_Tab_Role';
import { Sys07_Tab_RoleMenu } from './sys/Sys07_Tab_RoleMenu';

/**
 * 화면 등록표 (AS-IS MenuOpener): sys06_menu.sys06_class_nm(메뉴 키) → 화면 컴포넌트.
 * 없는 키는 MainFrame이 PendingScreenView로 연다. A 작업이 끝날 때마다 여기에 등록한다(05 §2 프론트).
 * 메뉴 키는 DB 값 그대로 쓴다(오타 `Sys03_Tab_ComapnyMenu`도 그대로).
 */
export const SCREENS: Record<string, React.FC> = {
  Sys01_Tab_Company, // A15 (1단계: 목록·신규 등록)
  Sys03_Tab_ComapnyMenu: Sys03_Tab_CompanyMenu, // A10 (메뉴 키 오타 그대로)
  Sys04_Tab_Role, // A01
  Sys07_Tab_RoleMenu, // A06
};
