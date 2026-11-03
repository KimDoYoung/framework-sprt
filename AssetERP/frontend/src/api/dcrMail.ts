import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { DcrMailHistorySaveReq, DcrMailSenderInit, DcrMailSendReq, DcrMailSendRes, DcrPublicMail, EmpMailCheck, EmpPersonMail } from '../types/dcrMail';

/** 메일 발송창 (EE35) — 백엔드 `/api/v1/dcr/mail-sender` */
export const dcrMailSenderApi = {
  /** 열 때: 본인 메일 · 공용메일 권한 · 첨부 목록 (AS-IS Emp01_Person.selectByPersonId · Cmp10_MailBook.selectByPersonId · Sys10_File.selectApprRelateDoc) */
  init: async (apprId?: number | null): Promise<DcrMailSenderInit> => {
    const res = await apiClient.get<ApiResponse<DcrMailSenderInit>>('v1/dcr/mail-sender/init', { params: { apprId } });
    return res.data.data;
  },

  /** AS-IS cmp.Cmp10_MailBook.selectByText — 검색어는 서버가 %…%로 */
  searchPublicMails: async (searchText: string): Promise<DcrPublicMail[]> => {
    const res = await apiClient.get<ApiResponse<DcrPublicMail[]>>('v1/dcr/mail-sender/public-mails', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS utils.mail.SendMailSMTP.sendMailSession(Test) */
  send: async (req: DcrMailSendReq): Promise<DcrMailSendRes> => {
    const res = await apiClient.post<ApiResponse<DcrMailSendRes>>('v1/dcr/mail-sender/send', req);
    return res.data.data;
  },

  /** AS-IS dcr.Dcr10_MailHistory.insertMailHistory → 새 기록 ID */
  saveHistory: async (req: DcrMailHistorySaveReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/dcr/mail-sender/history', req);
    return res.data.data;
  },
};

/** 본인 메일 계정 (AS-IS Emp10_Lookup_MailRetrieve → emp.Emp01_Person · utils.mail.SendMailSMTP.checkMail) */
export const empPersonMailApi = {
  get: async (): Promise<EmpPersonMail> => {
    const res = await apiClient.get<ApiResponse<EmpPersonMail>>('v1/emp/persons/me/mail');
    return res.data.data;
  },

  /** AS-IS emp.Emp01_Person.changeMail */
  change: async (mailAddress: string, password: string): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/emp/persons/me/mail', { mailAddress, password });
    return res.data.data ?? 0;
  },

  /** AS-IS emp.Emp01_Person.resetMail — 비밀번호를 비운다 */
  reset: async (): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/emp/persons/me/mail');
    return res.data.data ?? 0;
  },

  /** AS-IS utils.mail.SendMailSMTP.checkMail — 검증 메일 발송 */
  check: async (mailAddress: string, password: string): Promise<EmpMailCheck> => {
    const res = await apiClient.post<ApiResponse<EmpMailCheck>>('v1/emp/persons/me/mail/check', { mailAddress, password });
    return res.data.data;
  },
};
