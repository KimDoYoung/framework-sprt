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
