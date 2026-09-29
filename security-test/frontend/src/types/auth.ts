export interface User {
  userId: number;
  username: string;
  name: string;
  companyId: number;
  deptId: string;
  roles: string[];
  jti: string;
  accessToken?: string;
  accessTokenExpiresIn?: number;
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
  message: string;
  data: T;
}
