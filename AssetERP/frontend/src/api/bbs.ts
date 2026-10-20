import { apiClient } from './client';
import { readBlobError } from './file';
import { ApiResponse, PageRes } from '../types/auth';
import { BbsCompanyRule, BbsCompanyRuleSaveReq, BbsComment, BbsNotice } from '../types/bbs';

/** bbs 화면 API (E10~) */
export const bbsApi = {
  // ── E10 회사규정관리 (Bbs15_Tab_CompanyRuleManager) ──

  /** AS-IS bbs.Bbs15_CompanyRule.selectBySearchTextManager: 고객사는 관리자 회사만 고른다(그 밖에는 로그인 회사). ruleType 전체는 '%' */
  searchCompanyRules: async (ruleType: string, searchText: string, companyId?: number): Promise<BbsCompanyRule[]> => {
    const res = await apiClient.get<ApiResponse<BbsCompanyRule[]>>('v1/bbs/company-rules', { params: { companyId, ruleType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS DBUtil.setSeq — 새 회사규정의 id */
  getCompanyRuleNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/bbs/company-rules/next-id');
    return res.data.data;
  },

  /** AS-IS bbs.Bbs15_CompanyRule.update (등록) → 저장된 행 */
  createCompanyRule: async (req: BbsCompanyRuleSaveReq): Promise<BbsCompanyRule> => {
    const res = await apiClient.post<ApiResponse<BbsCompanyRule>>('v1/bbs/company-rules', req);
    return res.data.data;
  },

  /** AS-IS bbs.Bbs15_CompanyRule.update (수정) → 저장된 행 */
  updateCompanyRule: async (companyRuleId: number, req: BbsCompanyRuleSaveReq): Promise<BbsCompanyRule> => {
    const res = await apiClient.put<ApiResponse<BbsCompanyRule>>(`v1/bbs/company-rules/${companyRuleId}`, req);
    return res.data.data;
  },

  /** AS-IS bbs.Bbs15_CompanyRule.delete → 지운 건수 */
  deleteCompanyRules: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bbs/company-rules', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS bbs.Bbs15_CompanyRule.pushData: 고른 회사규정(첨부 포함)을 고객사로 복사 (관리자 회사만) → 복사한 건수 */
  pushCompanyRules: async (companyId: number, companyRuleIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/bbs/company-rules/push', { companyId, companyRuleIds });
    return res.data.data ?? 0;
  },

  /** 엑셀다운로드 (AS-IS RD 리포트 → xlsx) — 조회 조건 그대로, 브라우저 저장 */
  downloadCompanyRulesExcel: async (ruleType: string, searchText: string, fileName: string, companyId?: number): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/bbs/company-rules/excel', { params: { companyId, ruleType, searchText }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=bbsUpload) → 등록한 건수 */
  uploadCompanyRulesExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/bbs/company-rules/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};

/** H01 공지사항 (Bbs02_Tab_NoticeViewLaw·Bbs02_Popup_NoticeAdmin·Bbs07_TapPage_Comment) */
export const bbsNoticeApi = {
  /** AS-IS bbs.Bbs02_Notice.selectByNoticeDetailCodePaging. 법규공지는 noticeType 10, 구분상세 전체는 '%' */
  searchNotices: async (params: { noticeType: string; noticeDetailCode: string; searchText: string; offset: number; limit: number }): Promise<PageRes<BbsNotice>> => {
    const res = await apiClient.get<ApiResponse<PageRes<BbsNotice>>>('v1/bbs/notices', { params });
    return res.data.data as PageRes<BbsNotice>;
  },

  /** AS-IS bbs.Bbs05_History.updatePersonId: "해당 공지사항 그만보기" */
  updateNoticeHistory: async (noticeId: number): Promise<void> => {
    await apiClient.post(`v1/bbs/notices/${noticeId}/history`);
  },

  /** AS-IS bbs.Bbs07_Comment.selectByNoticeId */
  searchComments: async (noticeId: number): Promise<BbsComment[]> => {
    const res = await apiClient.get<ApiResponse<BbsComment[]>>(`v1/bbs/notices/${noticeId}/comments`);
    return res.data.data as BbsComment[];
  },

  /** AS-IS bbs.Bbs07_Comment.modelUpdate: 새 댓글 ID */
  createComment: async (noticeId: number, comment: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>(`v1/bbs/notices/${noticeId}/comments`, { comment });
    return res.data.data as number;
  },

  /** AS-IS bbs.Bbs07_Comment.delete */
  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`v1/bbs/comments/${commentId}`);
  },
};
