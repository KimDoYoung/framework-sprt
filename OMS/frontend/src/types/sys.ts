/** 권한그룹 (GET /api/v1/sys/roles, AS-IS Sys04_RoleModel) */
export interface Role {
  roleId: number;
  roleNm: string;
  seq: string | null;
  note: string | null;
  companyId: number | null;
  companyNm: string | null;
  /** 회사 기본 권한그룹 */
  defaultRole: boolean;
  adminYn: boolean;
}

/** 권한그룹별 사원 (GET /api/v1/sys/user-roles, AS-IS Sys05_UserRoleModel) */
export interface UserRole {
  userRoleId: number;
  userId: number | null;
  roleId: number | null;
  seq: string | null;
  note: string | null;
  /** 권한조직 */
  authOrgId: number | null;
  authOrgNm: string | null;
  empNo: string | null;
  empKorNm: string | null;
  /** 사원의 현재 조직 */
  orgNm: string | null;
  titleNm: string | null;
}

/** 사원별 권한그룹 (GET /api/v1/sys/roles/users/{userId}) */
export interface RoleUser {
  roleId: number;
  roleNm: string;
  seq: string | null;
  note: string | null;
  /** 사원이 이 권한그룹을 가졌는지 */
  userRoleYn: boolean;
  userRoleId: number | null;
}

/** 권한그룹별 메뉴 트리 행 (GET /api/v1/sys/role-menus, 깊이 우선 순서) */
export interface RoleMenu {
  menuId: number;
  parentId: number;
  /** 1차 메뉴 = 0 */
  level: number;
  menuNoPlusNm: string;
  seq: string | null;
  note: string | null;
  roleMenuId: number | null;
  roleMenuYn: boolean;
}

/** 회사가 사용하는 메뉴 트리 행 (GET /api/v1/sys/menus/company, 깊이 우선 순서) */
export interface CompanyUseMenu {
  menuId: number;
  parentId: number;
  /** 1차 메뉴 = 0 */
  level: number;
  menuNoPlusNm: string;
}

/** 화면안내 행 (GET /api/v1/sys/menu-guides: 3차 메뉴) */
export interface MenuGuide {
  menuId: number;
  /** 1차 > 2차 메뉴 */
  menuFullNm: string;
  menuNm: string;
  note: string | null;
}

/** 1차 메뉴 (GET /api/v1/sys/menu-items/top) */
export interface TopMenu {
  menuId: number;
  menuNm: string;
}

/** 메뉴 관리 트리 행 (GET /api/v1/sys/menu-items, 깊이 우선 순서) */
export interface MenuItem {
  menuId: number;
  parentId: number;
  level: number;
  menuNm: string;
  classNm: string | null;
  seq: string | null;
  useYn: boolean;
  menuNo: string | null;
  note: string | null;
  menuFullNm: string | null;
}

/** 메뉴 등록·수정·이동 요청 */
export type MenuItemSave = Pick<MenuItem, 'parentId' | 'menuNm' | 'classNm' | 'menuNo' | 'seq' | 'useYn' | 'note'>;

/** 일괄복사 대상 메뉴 */
export interface MenuCopy {
  menuId: number;
  parentId: number;
  menuNoPlusNm: string;
  parentPathNm: string | null;
  note: string | null;
}

/** 회사별 메뉴 트리 행 (GET /api/v1/sys/company-menus) */
export interface CompanyMenu {
  menuId: number;
  parentId: number;
  level: number;
  menuNm: string;
  seq: string | null;
  note: string | null;
  companyMenuId: number | null;
  companyMenuYn: boolean;
}

/** 고객사 (GET /api/v1/sys/companies) */
export interface SysCompany {
  companyId: number;
  companyNm: string;
  locNm: string | null;
  useYn: boolean;
  icamCompanyCd: string | null;
  note: string | null;
}

/** 메뉴를 쓰는 고객사 (GET /api/v1/sys/companies/by-menu) */
export interface CompanyMenuYn {
  companyId: number;
  companyNm: string;
  icamCompanyCd: string | null;
  menuYn: boolean;
  companyMenuId: number | null;
}

/** 공통코드 종류 (GET /api/v1/sys/code-kinds, sys08_code_kind) */
export interface CodeKind {
  codeKindId: number;
  kindCd: string;
  kindNm: string;
  /** 시스템 코드(회사 0 코드를 모든 회사가 같이 쓴다) */
  sysYn: boolean;
  note: string | null;
}

/** 공통코드 (GET /api/v1/sys/codes, sys09_code). 일자는 yyyy-MM-dd */
export interface Code {
  codeId: number;
  companyId: number | null;
  codeKindId: number;
  code: string;
  name: string;
  seq: string | null;
  /** 미사용 */
  closeYn: boolean;
  applyDate: string | null;
  closeDate: string | null;
  lastDate: string | null;
  note: string | null;
}

/** 공통코드 그룹 행 (sys13_code_group). 그룹 정의 행 codeId = 0, 구성 코드 행 codeId = 코드ID */
export interface CodeGroup {
  codeGroupId: number;
  kindGroupCd: string;
  kindGroupNm: string;
  codeKindId: number;
  codeId: number;
  note: string | null;
  code: string | null;
  name: string | null;
}

/** 고객사 상세 (GET /api/v1/sys/companies/details, /{id}). 일자는 yyyy-MM-dd */
export interface CompanyDetail {
  companyId: number;
  companyNm: string;
  /** 서브도메인 */
  locNm: string | null;
  /** 사업자등록번호 */
  bizNo: string | null;
  /** 회사암호 */
  emgrcyPasswd: string | null;
  startDate: string | null;
  closeDate: string | null;
  useYn: boolean;
  /** 보안로그인(공인IP) */
  loginSecureYn: boolean;
  icamCompanyCd: string | null;
  icamAdvisCompanyCd: string | null;
  empInfo: string | null;
  officeTelNo: string | null;
  emailAddr: string | null;
  note: string | null;
}

export type CompanySave = Omit<CompanyDetail, 'companyId'>;

/** 고객사 공인IP (sys29_login_secure) */
export interface LoginSecure {
  loginSecureId: number;
  companyId: number;
  startDate: string | null;
  closeDate: string | null;
  publicIp: string;
  note: string | null;
}

/** 사원이 쓸 수 있는 메뉴 (GET /api/v1/sys/menus/persons/{personId}, 깊이 우선) */
export interface PersonMenu {
  menuId: number;
  parentId: number;
  level: number;
  menuNoPlusNm: string;
  classNm: string | null;
  note: string | null;
}
