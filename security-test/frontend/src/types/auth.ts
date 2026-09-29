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
