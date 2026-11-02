import { apiClient } from './client';
import { readBlobError } from './file';
import { ApiResponse, PageRes } from '../types/auth';
import { BbsApplication, BbsApplicationForm, BbsApplicationMine, BbsApplicationMineSaveReq, BbsApplicationMng, BbsApplicationStatusRes, BbsCompanyRule, BbsCompanyRuleSaveReq, BbsComment, BbsFloralMessage, BbsFloralRequest, BbsFloralRequestNew, BbsFloralRequestSaveReq, BbsFloralShare, BbsNotice, BbsNoticeAdmin, BbsNoticeAdminSaveReq, BbsNoticeHistory, BbsNoticeMng, BbsNoticePerson, BbsNoticeSaveReq, BbsTarget, BbsTargetCompany } from '../types/bbs';

/** 요청서(신청서) — 증명서 신청내역 (S05, AS-IS Bbs11_Application) */
export const bbsApplicationApi = {
  /** AS-IS bbs.Bbs11_Application.selectByAppStatus — 증명서 신청(재직·경력·징계내역) 중 요청상태가 appStatus인 것(10 = 신청) */
  searchByAppStatus: async (appStatus = '10'): Promise<BbsApplication[]> => {
    const res = await apiClient.get<ApiResponse<BbsApplication[]>>('v1/bbs/applications', { params: { appStatus } });
    return res.data.data ?? [];
  },

  /** T22 AS-IS bbs.Bbs11_Application.selectByResultCheck — appTypeCode 없으면 전체, resultCheck = 미완료건만 */
  searchByResultCheck: async (startDate: string, closeDate: string, appTypeCode: string | undefined, resultCheck: boolean): Promise<BbsApplicationMng[]> => {
    const res = await apiClient.get<ApiResponse<BbsApplicationMng[]>>('v1/bbs/applications/mng', { params: { startDate, closeDate, appTypeCode, resultCheck } });
    return res.data.data ?? [];
  },

  /** T22 AS-IS bbs.Bbs11_Application.update — 변경 행(신청상태·완료일·비고) → 다시 읽은 행들 */
  saveMng: async (rows: BbsApplicationMng[]): Promise<BbsApplicationMng[]> => {
    const body = rows.map(({ applicationId, appStatus, closeDate, note }) => ({ applicationId, appStatus, closeDate, note }));
    const res = await apiClient.put<ApiResponse<BbsApplicationMng[]>>('v1/bbs/applications/mng', body);
    return res.data.data ?? [];
  },

  /** T22 AS-IS bbs.Bbs11_Application.modelUpdate — 선택한 신청의 내용(편집기 HTML) */
  updateContent: async (applicationId: number, content: string): Promise<void> => {
    await apiClient.put(`v1/bbs/applications/${applicationId}/content`, { content });
  },

  /** T22 AS-IS sms.Sms02_History.sendMessage — [완료문자발송] */
  sendMessage: async (personId: number, msg: string): Promise<void> => {
    await apiClient.post('v1/bbs/applications/sms', { personId, msg });
  },

  /** Y13 AS-IS bbs.Bbs11_Application.selectByPersonId — 기타신청서 작성 목록(appTypeCode 없으면 전체) */
  searchMine: async (startDate: string, closeDate: string, appTypeCode: string | undefined): Promise<BbsApplicationMine[]> => {
    const res = await apiClient.get<ApiResponse<BbsApplicationMine[]>>('v1/bbs/applications/mine', { params: { startDate, closeDate, appTypeCode } });
    return res.data.data ?? [];
  },

  /** Y13 AS-IS bbs.Bbs11_Application.modelUpdate — 저장(임시저장·신청 전 저장) → 저장한 행 */
  saveMine: async (req: BbsApplicationMineSaveReq): Promise<BbsApplicationMine> => {
    const res = await apiClient.put<ApiResponse<BbsApplicationMine>>('v1/bbs/applications/mine', req);
    return res.data.data;
  },

  /** Y13 AS-IS bbs.Bbs11_Application.updateAppStatus + 알림문자 — type P = 신청, C = 신청취소 */
  changeStatus: async (applicationId: number, type: 'P' | 'C'): Promise<BbsApplicationStatusRes> => {
    const res = await apiClient.put<ApiResponse<BbsApplicationStatusRes>>(`v1/bbs/applications/mine/${applicationId}/status`, { type });
    return res.data.data;
  },

  /** Y13 AS-IS bbs.Bbs11_Application.delete → 지운 건수 */
  deleteMine: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bbs/applications/mine', { data: ids });
    return res.data.data ?? 0;
  },
};

/** T22 신청구분 내용 양식 (AS-IS Bbs12_ApplicationForm) */
export const bbsApplicationFormApi = {
  /** AS-IS formCheck(없는 신청구분 양식 만들기) + selectByCompanyId */
  search: async (): Promise<BbsApplicationForm[]> => {
    const res = await apiClient.get<ApiResponse<BbsApplicationForm[]>>('v1/bbs/application-forms');
    return res.data.data ?? [];
  },

  /** Y13 AS-IS Bbs12_ApplicationForm.appTypeCall — 신청구분의 양식 내용(없으면 null) */
  getContent: async (appType: string): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/bbs/application-forms/content', { params: { appType } });
    return res.data.data ?? null;
  },

  /** AS-IS update — 공개여부 */
  update: async (rows: BbsApplicationForm[]): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/bbs/application-forms', rows.map(({ applicationFormId, publicYn }) => ({ applicationFormId, publicYn })));
    return res.data.data ?? 0;
  },

  /** AS-IS modelUpdate — 선택한 양식의 내용·모바일 내용 */
  updateContent: async (applicationFormId: number, content: string, contentMobi: string): Promise<void> => {
    await apiClient.put(`v1/bbs/application-forms/${applicationFormId}/content`, { content, contentMobi });
  },
};

/** bbs 화면 API (E10~) */
export const bbsApi = {
  // ── Z01 회사규정 (Bbs15_Tab_CompanyRule) ──

  /** AS-IS bbs.Bbs15_CompanyRule.selectBySearchText: 로그인 회사의 공개된 최신 개정회차(종료일 안 지난 것). ruleType 전체는 '%' */
  searchPublicCompanyRules: async (ruleType: string, searchText: string): Promise<BbsCompanyRule[]> => {
    const res = await apiClient.get<ApiResponse<BbsCompanyRule[]>>('v1/bbs/company-rules/public', { params: { ruleType, searchText } });
    return res.data.data ?? [];
  },

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
  // ── Z02 공지사항 등록 (Bbs02_Tab_NoticeManager·Bbs02_Edit_Notice·Bbs02_Lookup_LoadBbs) ──

  /** AS-IS bbs.Bbs02_Notice.selectByCompanyIdPaging. 구분·구분상세는 코드('%'면 전체). systemNoticeYn은 불러오기 창만 true */
  searchNoticeManage: async (params: { noticeType: string; noticeDetail: string; searchText: string; systemNoticeYn?: boolean; offset: number; limit: number }): Promise<PageRes<BbsNoticeMng>> => {
    const res = await apiClient.get<ApiResponse<PageRes<BbsNoticeMng>>>('v1/bbs/notices/manage', { params });
    return res.data.data as PageRes<BbsNoticeMng>;
  },

  /** AS-IS GridInsertRow의 새 공지 ID */
  getNoticeNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/bbs/notices/next-id');
    return res.data.data as number;
  },

  /** AS-IS bbs.Bbs02_Notice.update + bbs.Bbs03_Target.update. 저장한 한 줄을 돌려준다 */
  saveNotice: async (req: BbsNoticeSaveReq): Promise<BbsNoticeMng> => {
    const res = await apiClient.put<ApiResponse<BbsNoticeMng>>('v1/bbs/notices/manage', req);
    return res.data.data as BbsNoticeMng;
  },

  /** AS-IS bbs.Bbs02_Notice.delete */
  deleteNotice: async (noticeId: number): Promise<void> => {
    await apiClient.delete(`v1/bbs/notices/manage/${noticeId}`);
  },

  /** AS-IS bbs.Bbs03_Target.selectByNoticeId (공지일 기준 조직·직책) */
  searchNoticeTargets: async (noticeId: number, fromDate: string): Promise<BbsTarget[]> => {
    const res = await apiClient.get<ApiResponse<BbsTarget[]>>(`v1/bbs/notices/${noticeId}/targets`, { params: { fromDate } });
    return res.data.data ?? [];
  },

  /** AS-IS bbs.Bbs03_Target.delete (체크한 대상자) */
  deleteNoticeTargets: async (noticeId: number, targetIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/bbs/notices/${noticeId}/targets`, { data: targetIds });
    return res.data.data ?? 0;
  },

  /** AS-IS bbs.Bbs03_Target.deleteAllTarget */
  deleteAllNoticeTargets: async (noticeId: number): Promise<void> => {
    await apiClient.delete(`v1/bbs/notices/${noticeId}/targets/all`);
  },

  /** AS-IS bbs.Bbs02_Notice.selectByPersonIdPaging (Z03). 구분 전체는 '%', 기간(YYYY-MM-DD)은 구분이 전체일 때만 보낸다 */
  searchMyNotices: async (params: { noticeType: string; noticeDetailCode: string; searchText: string; startDate?: string; closeDate?: string; offset: number; limit: number }): Promise<PageRes<BbsNoticePerson>> => {
    const res = await apiClient.get<ApiResponse<PageRes<BbsNoticePerson>>>('v1/bbs/notices/mine', { params });
    return res.data.data as PageRes<BbsNoticePerson>;
  },

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
  /** Y12 AS-IS bbs.Bbs20_FloralRequest.selectByText — 신청 화면(공개 건 + 내 비공개 건) */
  searchMine: async (startDate: string, closeDate: string, searchText: string, confirmYn: boolean): Promise<BbsFloralRequest[]> => {
    const res = await apiClient.get<ApiResponse<BbsFloralRequest[]>>('v1/bbs/floral-requests/mine', { params: { startDate, closeDate, searchText, confirmYn } });
    return res.data.data ?? [];
  },
  /** Y12 AS-IS Bbs20_Edit_FloralRequest.insert — 새 신청의 기본값(번호를 새로 받는다) */
  newRequest: async (): Promise<BbsFloralRequestNew> => {
    const res = await apiClient.post<ApiResponse<BbsFloralRequestNew>>('v1/bbs/floral-requests/new');
    return res.data.data;
  },
  /** Y12 AS-IS bbs.Bbs22_FloralMessage.getMessage — 경조구분의 문구(없으면 null) */
  getMessage: async (code: string): Promise<string | null> => {
    const res = await apiClient.get<ApiResponse<string | null>>('v1/bbs/floral-requests/message', { params: { code } });
    return res.data.data ?? null;
  },
  /** Y12 AS-IS bbs.Bbs20_FloralRequest.modelUpdate → 저장한 번호 */
  saveRequest: async (req: BbsFloralRequestSaveReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/bbs/floral-requests/save', req);
    return res.data.data;
  },
  /** Y12 AS-IS bbs.Bbs20_FloralRequest.delete → 지운 건수 */
  deleteRequests: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/bbs/floral-requests', { data: ids });
    return res.data.data ?? 0;
  },
  /** Y12 AS-IS bbs.Bbs21_FloralRequestShare.insertDefaultShare → "신청공유" 문구(복사한 게 없으면 null) */
  insertDefaultShare: async (floralRequestId: number, contactId: number): Promise<string | null> => {
    const res = await apiClient.post<ApiResponse<string | null>>(`v1/bbs/floral-requests/${floralRequestId}/default-shares`, null, { params: { contactId } });
    return res.data.data ?? null;
  },
  /** Y12 AS-IS bbs.Bbs21_FloralRequestShare.deleteDefaultShare */
  deleteDefaultShare: async (floralRequestId: number): Promise<void> => {
    await apiClient.delete(`v1/bbs/floral-requests/${floralRequestId}/default-shares`);
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

/** Z04 KFS공지등록 (Bbs02_Tab_NoticeAdmin·Bbs02_Edit_NoticeAdmin·Bbs09_Lookup_History) — KFS 관리자만 */
export const bbsNoticeAdminApi = {
  /** AS-IS bbs.Bbs02_Notice.selectByPublicYnPaging. 구분·구분상세는 코드('%'면 전체), 상태는 '알림'·'대기'·그 밖은 전체, 기간은 구분이 전체일 때만 보낸다 */
  searchNotices: async (params: { openYn: string; noticeType: string; noticeDetail: string; searchText: string; startDate?: string; closeDate?: string; offset: number; limit: number }): Promise<PageRes<BbsNoticeAdmin>> => {
    const res = await apiClient.get<ApiResponse<PageRes<BbsNoticeAdmin>>>('v1/bbs/notice-admin', { params });
    return res.data.data as PageRes<BbsNoticeAdmin>;
  },

  /** AS-IS DBUtil.setSeq — 새 공지의 ID */
  getNextId: async (): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/bbs/notice-admin/next-id');
    return res.data.data as number;
  },

  /** AS-IS bbs.Bbs09_NoticeHistory.insert + bbs.Bbs02_Notice.modelUpdate + bbs.Bbs04_TargetCompany.update. 저장한 한 줄을 돌려준다 */
  saveNotice: async (req: BbsNoticeAdminSaveReq): Promise<BbsNoticeAdmin> => {
    const res = await apiClient.put<ApiResponse<BbsNoticeAdmin>>('v1/bbs/notice-admin', req);
    return res.data.data as BbsNoticeAdmin;
  },

  /** AS-IS bbs.Bbs02_Notice.delete */
  deleteNotice: async (noticeId: number): Promise<void> => {
    await apiClient.delete(`v1/bbs/notice-admin/${noticeId}`);
  },

  /** AS-IS bbs.Bbs04_TargetCompany.selectByNoticeId */
  searchTargetCompanies: async (noticeId: number): Promise<BbsTargetCompany[]> => {
    const res = await apiClient.get<ApiResponse<BbsTargetCompany[]>>(`v1/bbs/notice-admin/${noticeId}/target-companies`);
    return res.data.data ?? [];
  },

  /** AS-IS bbs.Bbs04_TargetCompany.delete (체크한 고객사) */
  deleteTargetCompanies: async (noticeId: number, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/bbs/notice-admin/${noticeId}/target-companies`, { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS bbs.Bbs04_TargetCompany.deleteAllTarget */
  deleteAllTargetCompanies: async (noticeId: number): Promise<void> => {
    await apiClient.delete(`v1/bbs/notice-admin/${noticeId}/target-companies/all`);
  },

  /** AS-IS bbs.Bbs09_NoticeHistory.selectByNoticeId */
  searchHistories: async (noticeId: number): Promise<BbsNoticeHistory[]> => {
    const res = await apiClient.get<ApiResponse<BbsNoticeHistory[]>>(`v1/bbs/notice-admin/${noticeId}/histories`);
    return res.data.data ?? [];
  },

  /** AS-IS sms.Sms03_GroupSend.sendNoticeMessage — 수신자는 사원 ID(번호는 서버가 읽는다) */
  sendNoticeMessage: async (message: string, personIds: number[]): Promise<void> => {
    await apiClient.post('v1/bbs/notice-admin/send-message', { message, personIds });
  },
};
