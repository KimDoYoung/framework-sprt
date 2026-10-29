import { apiClient } from './client';
import { readBlobError } from './file';
import { ApiResponse, PageRes } from '../types/auth';
import { BbsApplication, BbsCompanyRule, BbsCompanyRuleSaveReq, BbsComment, BbsFloralMessage, BbsFloralRequest, BbsFloralShare, BbsNotice } from '../types/bbs';

/** 요청서(신청서) — 증명서 신청내역 (S05, AS-IS Bbs11_Application) */
export const bbsApplicationApi = {
  /** AS-IS bbs.Bbs11_Application.selectByAppStatus — 증명서 신청(재직·경력·징계내역) 중 요청상태가 appStatus인 것(10 = 신청) */
  searchByAppStatus: async (appStatus = '10'): Promise<BbsApplication[]> => {
    const res = await apiClient.get<ApiResponse<BbsApplication[]>>('v1/bbs/applications', { params: { appStatus } });
    return res.data.data ?? [];
  },
};

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

/** T21 AS-IS Bbs20_Tab_FloralRequestMng (화환신청 확인) → server/bbs/Bbs20_FloralRequest · Bbs21_FloralRequestShare · Bbs22_FloralMessage */
export const bbsFloralApi = {
  /** AS-IS bbs.Bbs20_FloralRequest.selectByTextAdmin — 날짜 'yyyy-MM-dd', searchText는 글자만(서버가 %로 감싼다), confirmYn = 미완료건만 */
  searchRequests: async (startDate: string, closeDate: string, searchText: string, confirmYn: boolean): Promise<BbsFloralRequest[]> => {
    const res = await apiClient.get<ApiResponse<BbsFloralRequest[]>>('v1/bbs/floral-requests', { params: { startDate, closeDate, searchText, confirmYn } });
    return res.data.data ?? [];
  },
  /** AS-IS bbs.Bbs20_FloralRequest.selectById */
  getRequest: async (floralRequestId: number): Promise<BbsFloralRequest> => {
    const res = await apiClient.get<ApiResponse<BbsFloralRequest>>(`v1/bbs/floral-requests/${floralRequestId}`);
    return res.data.data;
  },
  /** AS-IS bbs.Bbs20_FloralRequest.update — 신청상태·완료일·비고·반려사유 → 다시 읽은 행들(요청 순서) */
  saveRequests: async (rows: BbsFloralRequest[]): Promise<BbsFloralRequest[]> => {
    const body = rows.map(r => ({ floralRequestId: r.floralRequestId, statusCode: r.statusCode ?? null, endDate: r.endDate ?? null, note: r.note ?? null, rejectReason: r.rejectReason ?? null }));
    const res = await apiClient.put<ApiResponse<BbsFloralRequest[]>>('v1/bbs/floral-requests', body);
    return res.data.data ?? [];
  },
  /** AS-IS bbs.Bbs20_FloralRequest.sendMessage — 받는 사원 ID들 → 발송 건수 */
  sendMessage: async (content: string, personIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/bbs/floral-requests/messages', { content, personIds });
    return res.data.data;
  },
  /** AS-IS bbs.Bbs21_FloralRequestShare.selectByFloralRequestId */
  searchShares: async (floralRequestId: number): Promise<BbsFloralShare[]> => {
    const res = await apiClient.get<ApiResponse<BbsFloralShare[]>>(`v1/bbs/floral-requests/${floralRequestId}/shares`);
    return res.data.data ?? [];
  },
  /** AS-IS bbs.Bbs21_FloralRequestShare.delete + update → selectShareInfo 문구 */
  saveShares: async (floralRequestId: number, deleteIds: number[], rows: { shareCode: string; personId: number | null; orgId: number | null }[]): Promise<string> => {
    const res = await apiClient.put<ApiResponse<string>>(`v1/bbs/floral-requests/${floralRequestId}/shares`, { deleteIds, rows });
    return res.data.data ?? '';
  },
  /** AS-IS bbs.Bbs22_FloralMessage.checkOccasionsCode 뒤 selectByCompanyId */
  searchMessages: async (): Promise<BbsFloralMessage[]> => {
    const res = await apiClient.get<ApiResponse<BbsFloralMessage[]>>('v1/bbs/floral-messages');
    return res.data.data ?? [];
  },
  /** AS-IS bbs.Bbs22_FloralMessage.update → 다시 읽은 목록 */
  saveMessages: async (rows: BbsFloralMessage[]): Promise<BbsFloralMessage[]> => {
    const res = await apiClient.put<ApiResponse<BbsFloralMessage[]>>('v1/bbs/floral-messages', rows.map(r => ({ floralMessageId: r.floralMessageId, message: r.message ?? null })));
    return res.data.data ?? [];
  },
};
