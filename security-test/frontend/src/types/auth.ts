export interface User {
  /** 세션용 사용자 ID (사원: emp01_person_id, 회사관리자: -sys02_user_id) */
  userId: number;
  /** 전 회사에서 유일한 이름 {회사코드}:{로그인ID} */
  username: string;
  /** 화면에 입력한 로그인 ID (사번 또는 관리자 ID) */
  loginId: string;
  name: string;
  companyId: number;
  /** 로그인한 회사 코드 (sys01_loc_nm) */
  companyCode: string;
  companyName: string;
  /** 로그인한 호스트의 테넌트(서브도메인). admin 테넌트에서 다른 회사를 선택하면 companyCode와 다르다 */
  tenant: string;
  deptId: string;
  roles: string[];
  jti: string;
  /** 응답 시점 기준 Access Token 남은 수명(ms) */
  accessTokenExpiresIn: number;
  /** 응답 시점 기준 세션(Refresh Token) 남은 수명(ms) */
  refreshTokenExpiresIn: number;
  /** 서버 설정 Access Token 전체 수명(ms) - jwt.access-token-expiration */
  accessTokenLifetime: number;
  /** 서버 설정 세션(Refresh Token) 전체 수명(ms) - jwt.refresh-token-expiration */
  refreshTokenLifetime: number;
}

/** 접속한 서브도메인의 회사 정보 (GET /api/public/tenant) */
export interface TenantInfo {
  host: string;
  companyCode: string;
  companyId: number | null;
  companyName: string | null;
  /** 등록된 사용 중인 회사인지 여부 */
  valid: boolean;
  /** KFS 관리자 테넌트 - 로그인 화면에 회사 선택 표시 */
  admin: boolean;
}

/** admin 로그인 화면의 회사 선택 항목 */
export interface CompanyItem {
  companyId: number;
  companyCode: string;
  companyName: string;
}

/** 관리자 회사의 사원 (emp01_person) */
export interface UserItem {
  userId: number;
  /** 로그인 ID (사번) */
  username: string;
  fullName: string;
  role: string;
  /** 잠금여부 (AS-IS emp01_lock_yn: 'true' / 'false' / null) */
  lockYn: string | null;
  /** 현재 연속 로그인 실패 횟수 */
  failureCount: number;
}

/** 보안 감사 로그 (sys71_security_audit_log) */
export interface AuditLogItem {
  auditId: number;
  /** 이벤트 유형 (LOGIN_SUCCESS, LOGIN_FAIL, ACCOUNT_LOCKED ...) */
  eventType: string;
  /** SUCCESS / FAIL */
  result: string;
  /** 행위자 로그인 아이디 */
  userId: string | null;
  /** 대상 (잠금 해제 대상 사용자, 파일ID 등) */
  targetId: string | null;
  detail: string | null;
  clientIp: string | null;
  userAgent: string | null;
  /** 요청 추적 ID - 서버 로그 검색 키 */
  traceId: string | null;
  createdAt: string;
}

export interface FileItem {
  fileId: string;
  originalFilename: string;
  storedFilename: string;
  fileSize: number;
  detectedMimeType: string;
  declaredContentType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  /** 성공 시 'OK', 실패 시 에러 코드 (예: LOGIN_FAILED, MULTI_LOGIN_DETECTED) */
  code: string;
  message: string;
  data: T;
}
