/** 권한그룹 (GET /api/v1/sys/roles, AS-IS Sys04_RoleModel) */
export interface Role {
  roleId: number;
  companyId?: number;
  roleNm: string;
  seq?: string;
  note?: string;
  /** DB 값 'true'/'false' 문자열 */
  defaultRole?: string | null;
  adminYn?: string | null;
  companyNm?: string;
}

/** 고객(회사) 목록 행 (GET /api/v1/sys/companies, AS-IS Sys01_CompanyModel). Y/N은 'true'/'false' 문자열 */
export interface Company {
  companyId: number;
  companyNm: string;
  locNm?: string | null;
  bizNo?: string | null;
  loginSecureYn?: string;
  icamCompanyCd?: string | null;
  icamAdvisCompanyCd?: string | null;
  useYn?: string;
  note?: string | null;
  empInfo?: string | null;
  mobileTelNo?: string | null;
  officeTelNo?: string | null;
  fullAddress?: string | null;
  companyRepNm?: string | null;
  mailInfo?: string | null;
  mailLogYn?: string;
  apprStepLockYn?: string;
  dcrNumberingNm?: string | null;
  dcrDetailUseYn?: string;
  aprManagerInfoYn?: string;
  leaveMonthNm?: string | null;
  leaveYn?: string;
  leaveCompulsionRt?: number;
  icsCheckCycleNm?: string | null;
  icsComplyCycleNm?: string | null;
  taxTypeNm?: string | null;
  accountCloseMonthNm?: string | null;
  ownerCapitalApplyNm?: string | null;
  astManagerAutoYn?: string;
  icsGuideYn?: string;
  noticeDate?: string | null;
  startDate?: string | null;
}

/** 신규고객사 등록 (POST /api/v1/sys/companies, AS-IS Sys01_Edit_Company) */
export interface CompanyCreateReq {
  companyNm: string;
  locNm: string;
  emgrcyPasswd: string;
  /** YYYY-MM-DD */
  startDate: string;
  mailInfo?: string;
  bizNo: string;
  leaveMonthCd?: string;
  taxType?: string;
  accountCloseMonth?: string;
}

/** 공통코드 콤보 항목 (GET /api/v1/sys/codes?kindCd=) */
export interface Code {
  code: string;
  name: string;
}

/** 관리정보 탭 행 (GET /api/v1/sys/companies/{id}/manage, AS-IS Sys01_TabPage_Info01). Y/N은 DB 값 그대로('true'/'false'/null) */
export interface CompanyManage {
  companyId: number;
  loginSecureYn?: string | boolean | null;
  companyNm: string;
  locNm?: string | null;
  mailInfo?: string | null;
  emgrcyPasswd?: string | null;
  erpProductCd?: string | null;
  erpProductNm?: string | null;
  contType?: string | null;
  noticeDate?: string | null;
  closeDate?: string | null;
  icamCompanyCd?: string | null;
  icamAdvisCompanyCd?: string | null;
  assetYn?: string | boolean | null;
  advisYn?: string | boolean | null;
  pbsYn?: string | boolean | null;
  useYn?: string | boolean | null;
  note?: string | null;
  bizNo?: string | null;
}

/** 기본정보 탭 행 (GET /api/v1/sys/companies/{id}/basic, AS-IS Sys01_TabPage_Info02). 법인등록번호는 복호화한 값 */
export interface CompanyBasic {
  companyId: number;
  startDate?: string | null;
  bizNo?: string | null;
  decCorpRegNo?: string | null;
  empInfo?: string | null;
  mobileTelNo?: string | null;
  officeTelNo?: string | null;
  officeFaxNo?: string | null;
  emailAddr?: string | null;
  zipCd?: string | null;
  zipAddr?: string | null;
  zipDetail?: string | null;
}

/** 전자결재·내부통제 탭 행 (GET /api/v1/sys/companies/{id}/approval, AS-IS Sys01_TabPage_Info03). Y/N은 'true'/'false' */
export interface CompanyApproval {
  companyId: number;
  apprStepLockYn?: string | boolean | null;
  companyRepNm?: string | null;
  aprManagerInfoYn?: string | boolean | null;
  dcrNumberingCd?: string | null;
  dcrNumberingNm?: string | null;
  dcrDetailUseYn?: string | boolean | null;
  icsCheckCycleType?: string | null;
  icsCheckCycleNm?: string | null;
  icsComplyCycleType?: string | null;
  icsComplyCycleNm?: string | null;
  icsNonStayYn?: string | boolean | null;
  fltOnlyCurrYn?: string | boolean | null;
  icsGuideYn?: string | boolean | null;
}

/** 경영·회계 탭 행 (GET /api/v1/sys/companies/{id}/account, AS-IS Sys01_TabPage_Info04). Y/N은 'true'/'false' */
export interface CompanyAccount {
  companyId: number;
  leaveMonthCd?: string | null;
  leaveMonthNm?: string | null;
  leaveYn?: string | boolean | null;
  leaveCompulsionRt?: number | null;
  taxType?: string | null;
  taxTypeNm?: string | null;
  cardRealUserYn?: string | boolean | null;
  incomeTaxFilingCd?: string | null;
  incomeTaxFilingNm?: string | null;
  accountCloseMonth?: string | null;
  accountCloseMonthNm?: string | null;
  ownerCapitalApplyCd?: string | null;
  ownerCapitalApplyNm?: string | null;
  astManagerAutoYn?: string | boolean | null;
  astEvalCycleCd?: string | null;
  astEvalCycleNm?: string | null;
  empEvalCycleCd?: string | null;
  empEvalCycleNm?: string | null;
  empEvalMonthCd?: string | null;
  empEvalMonthNm?: string | null;
}

/** 공인IP (GET /api/v1/sys/companies/{id}/login-secures, AS-IS Sys29_LoginSecureModel) */
export interface LoginSecure {
  loginSecureId: number;
  companyId?: number;
  startDate?: string | null;
  closeDate?: string | null;
  publicIp?: string | null;
  note?: string | null;
}

/** 고객별 관리자 (GET /api/v1/sys/companies/{id}/users, AS-IS Sys02_UserModel) */
export interface AdminUser {
  userId: number;
  companyId?: number;
  korNm?: string | null;
  loginId?: string | null;
  decPasswd?: string | null;
  email?: string | null;
  tel1?: string | null;
  tel2?: string | null;
  note?: string | null;
  adminYn?: string | boolean | null;
}

/** 관리자별 메뉴 권한 트리 행 (GET /api/v1/sys/admin-users/{userId}/menus) — 전위 순서, depth로 들여쓰기 */
export interface AdminUserMenu {
  menuId: number;
  parentId: number;
  depth: number;
  menuNm: string;
  seq?: string | null;
  note?: string | null;
  adminUserMenuId?: number | null;
  /** 'true'/'false'/null(설정 없음) */
  useYn?: string | null;
}

/** 회사별 메뉴맵핑 트리 행 (GET /api/v1/sys/menus/companies/{companyId}) — 전위 순서, depth로 들여쓰기 */
export interface CompanyMenuNode {
  menuId: number;
  parentId: number;
  depth: number;
  menuNm: string;
  seq?: string | null;
  note?: string | null;
  companyMenuId?: number | null;
  /** sys03_use_yn: 'true'/'false'/null(연결 없음) */
  useYn?: string | null;
}

/** 권한그룹별 메뉴 맵핑 트리 행 (GET /api/v1/sys/roles/{roleId}/menus) — 전위 순서, depth로 들여쓰기 */
export interface RoleMenuNode {
  menuId: number;
  parentId: number;
  depth: number;
  /** 메뉴번호 + ' ' + 메뉴명 (번호 없으면 메뉴명) */
  menuNoPlusNm: string;
  /** 메뉴명(번호 없이) — A07 트리 */
  menuNm?: string;
  seq?: string | null;
  note?: string | null;
  roleMenuId?: number | null;
  /** sys07_use_yn: 'true'/'false'/null(연결 없음) */
  useYn?: string | null;
}

/** 메뉴별 그룹권한(View) 메뉴 트리 행 (GET /api/v1/sys/menus/view, AS-IS Sys06_MenuModel ← sys06_menu.selectByCompanyId) */
export interface MenuViewNode {
  menuId: number;
  /** 루트는 0 */
  parentId: number;
  depth: number;
  /** 메뉴번호 + ' ' + 메뉴명 (번호 없으면 메뉴명) */
  menuNoPlusNm: string;
}

/** 사원별 메뉴 트리 행 (GET /api/v1/sys/persons/{personId}/menus, C04) — 전위 순서, 루트는 parentId null·depth 0 */
export interface PersonMenuNode {
  menuId: number;
  parentId: number | null;
  depth: number;
  /** 메뉴번호 + ' ' + 메뉴명 (번호 없으면 메뉴명) */
  menuNoPlusNm: string;
}

/** 권한그룹별 메뉴권한 복사 (POST /api/v1/sys/role-menus/copy-role|copy-menu). inCompanyId = 출발지, companyIds = 목적지 */
export interface RoleMenuCopyReq {
  inCompanyId: number;
  roleName: string;
  menuId?: number;
  companyIds: number[];
}

/** 권한그룹별 사원 (GET /api/v1/sys/roles/{roleId}/user-roles, AS-IS Sys05_UserRoleModel) */
export interface UserRole {
  userRoleId: number;
  userId: number;
  roleId: number;
  authOrgId?: number | null;
  authOrgNm?: string | null;
  orgNm?: string | null;
  titleNm?: string | null;
  empNo?: string | null;
  korNm?: string | null;
  /** 사원 조직의 상위 전체명 (AS-IS "권한조직" 칸이 보여 주는 값) */
  parentFullNm?: string | null;
}

/** 사원별 권한그룹 (GET /api/v1/sys/persons/{userId}/roles, AS-IS Sys04_RoleModel ← sys04_role.selectByUserId) */
export interface PersonRole {
  roleId: number;
  roleNm?: string | null;
  seq?: string | null;
  note?: string | null;
  /** 'true' | 'false' (gb.boolean 편집) */
  userRoleYn: string;
  /** 연결이 있을 때만 — 해제 저장 때 삭제 키 */
  userRoleId?: number | null;
}

// ── A09 메뉴 관리 (Sys06_Tab_Menu) ──

/** 메뉴 관리 트리 행 (AS-IS Sys06_MenuModel). 전위 순서, Y/N은 'true'/'false' */
export interface MenuNode {
  menuId: number;
  parentId: number;
  depth: number;
  menuNm: string;
  seq?: string | null;
  note?: string | null;
  useYn: string;
  classNm?: string | null;
  menualUrl?: string | null;
  addTitleUseYn: string;
  mobiUseYn: string;
  mobiClassNm?: string | null;
  menuNo?: string | null;
}

/** 매뉴 편집 저장 (menuId 없으면 등록) */
export type MenuSaveReq = Omit<MenuNode, 'depth' | 'menuId'> & { menuId?: number };

/** 일괄복사 매뉴 목록 (getAllMenuList) */
export interface MenuCopy {
  menuId: number;
  parentPathNm?: string | null;
  menuNoPlusNm?: string | null;
}

/** 일괄복사 고객사 목록 (selectByCopyList) */
export interface CompanyCopy {
  companyId: number;
  companyNm: string;
  erpProductCd?: string | null;
  assetYn?: string | null;
  advisYn?: string | null;
  icamCompanyCd?: string | null;
}

/** 메뉴를 쓰는 회사 (Sys01_Grid_CompanyMenu, selectByCode). 같은 회사가 두 줄일 수 있어 화면 행 ID = companyId + companyMenuId */
export interface CompanyMenuYn extends CompanyCopy {
  menuYn: string;
  companyMenuId?: number | null;
}

/** 코드구분 한 행 (A13, AS-IS Sys08_CodeKindModel). sysYn은 DB 값 그대로('true'/'false') — 시스템 체크박스 */
export interface CodeKind {
  codeKindId: number;
  kindCd: string;
  kindNm: string;
  sysYn: string;
  note?: string | null;
}

/** 코드 관리 한 행 (A13, AS-IS Sys09_CodeModel). 날짜는 'yyyy-MM-dd', closeYn은 'true'/'false' */
export interface CodeAdmin {
  codeId: number;
  codeKindId: number;
  companyId: number;
  code: string;
  name: string;
  seq?: string | null;
  closeYn?: string | null;
  applyDate?: string | null;
  closeDate?: string | null;
  note?: string | null;
  lastDate?: string | null;
}

/** 코드 그룹 한 행 (A13, AS-IS Sys13_CodeGroupModel). codeId 0 = 그룹 헤더, 아니면 소속 코드(code·name) */
export interface CodeGroup {
  codeGroupId: number;
  kindGroupCd: string;
  kindGroupNm: string;
  codeKindId: number;
  codeId: number;
  code?: string | null;
  name?: string | null;
}

/** 특정화면 사용요청 한 행 (A27, AS-IS Sys53_SpecificMenuRequestModel). specificMenuRequestId ≤ 0 = 새 행. 날짜는 'YYYY-MM-DD' */
export interface SpecificMenuRequest {
  specificMenuRequestId: number;
  companyId?: number | null;
  personId?: number | null;
  personNm?: string | null;
  regDate?: string | null;
  stateCd?: string | null;
  stateNm?: string | null;
  specificWorkCd?: string | null;
  specificWorkNm?: string | null;
  apprId?: number | null;
  /** 결재문서 상태 코드 (AprStatusCode: 10·20·30 진행중, 40·99 종결) */
  aprStatusCd?: string | null;
  aprStatusNm?: string | null;
  confirmNm?: string | null;
}

/** 특정매뉴 권한 한 행 (A15-4, AS-IS Sys50_SpecificMenuModel). specificMenuId ≤ 0 = 새 행 */
export interface SpecificMenu {
  specificMenuId: number;
  companyId?: number;
  specificWorkCd?: string | null;
  specificWorkNm?: string | null;
  menuId?: number | null;
  menuNm?: string | null;
  note?: string | null;
}

/** 특정매뉴 사원권한 한 행 (A15-4, AS-IS Sys51_SpecificMenuPersonModel). useYn은 'true'/'false' */
export interface SpecificMenuPerson {
  specificMenuPersonId: number;
  specificMenuId?: number;
  personId?: number;
  personNm?: string | null;
  useYn?: string | null;
  note?: string | null;
  specificWorkCd?: string | null;
}

/** 특정매뉴 문서권한(Link) 한 행 (A15-4, AS-IS Sys52_SpecificMenuLinkModel) */
export interface SpecificMenuLink {
  specificMenuLinkId: number;
  companyId?: number;
  specificWorkCd?: string | null;
  linkCd?: string | null;
  linkNm?: string | null;
  note?: string | null;
}

/** 특정매뉴 요청이력 한 행 (A15-4, AS-IS Sys54_SpecificMenuHistoryModel). 날짜는 'yyyy-MM-dd' */
export interface SpecificMenuHistory {
  specificMenuHistoryId: number;
  companyId?: number;
  regDate?: string | null;
  confirmDate?: string | null;
  confirmNm?: string | null;
  note?: string | null;
  fileNm?: string | null;
  noteYnStr?: string | null;
}

/** 첨부 파일 한 행 (B10, AS-IS Sys10_FileModel / sys10_file). regDate는 ISO 일시 */
export interface FileInfo {
  fileId: number;
  parentId: number;
  fileNm: string;
  regDate?: string | null;
  size?: number | null;
  note?: string | null;
  fileExt?: string | null;
  fileYn?: string | null;
  titleYn?: string | null;
  seq?: string | null;
}

/** 매뉴찾기 조회창 한 행 (A15-4, AS-IS Sys06_Lookup_SelectMulti → Sys06_MenuModel) */
export interface MenuLookup {
  menuId: number;
  parentPathNm: string;
  menuNm: string;
  menuFullNm: string;
}
