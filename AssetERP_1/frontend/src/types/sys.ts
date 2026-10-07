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
