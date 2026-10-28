import { apiClient } from './client';
import { ApiResponse } from '../types/auth';

/** RD(Report Designer) 호출 주소 발급 — 백엔드 `POST /api/v1/rd/urls` (docs/RD-대책.md). rv의 companyId·personId는 서버가 로그인 값으로 채운다 */
export interface RdUrlReq {
  /** page = 화면에 끼워 넣는 RD 페이지(`{mrd}.html`, rv는 일반 쿼리 문자열) */
  kind: 'viewer' | 'download' | 'save' | 'page';
  mrd: string;
  options?: string;
  exportType?: string;
  fileName?: string;
  rv?: Record<string, string>;
}

export interface RdUrlRes {
  url: string;
  method: 'GET' | 'POST';
}

export const rdApi = {
  /** AS-IS RDUtil.getPageName() 와 같은 주소 규칙 */
  buildUrl: async (req: RdUrlReq): Promise<RdUrlRes> => {
    const res = await apiClient.post<ApiResponse<RdUrlRes>>('v1/rd/urls', req);
    return res.data.data;
  },
};
