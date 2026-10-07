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
