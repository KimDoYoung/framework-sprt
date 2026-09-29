export interface User {
  userId: number;
  username: string;
  name: string;
  companyId: number;
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

export interface UserItem {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  /** 잠금여부 (Y/N) */
  lockYn: string;
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
