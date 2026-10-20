import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { CmpMailBook, CmpMailCheck, CmpMailRole } from '../types/cmp';

/** G13 공용메일 관리 (Cmp10_Tab_MailBook·Cmp10_Edit_Tab_MailBook·Cmp10_Tab_MailBookList) */
export const cmpMailBookApi = {
  /** AS-IS cmp.Cmp10_MailBook.selectByCompanyId: 로그인 회사의 공용메일 */
  searchMailBooks: async (): Promise<CmpMailBook[]> => {
    const res = await apiClient.get<ApiResponse<CmpMailBook[]>>('v1/cmp/mail-books');
    return res.data.data ?? [];
  },

  /** AS-IS cmp.Cmp10_MailBook.modelUpdate (새 메일): 비밀번호는 서버가 암호화해 저장 */
  createMailBook: async (emailAddr: string, decPassword: string, note: string): Promise<CmpMailBook> => {
    const res = await apiClient.post<ApiResponse<CmpMailBook>>('v1/cmp/mail-books', { emailAddr, decPassword, note });
    return res.data.data;
  },

  /** AS-IS cmp.Cmp10_MailBook.modelUpdate (고친 메일): 비고만 바뀐다 */
  updateMailBook: async (mailBookId: number, note: string): Promise<CmpMailBook> => {
    const res = await apiClient.put<ApiResponse<CmpMailBook>>(`v1/cmp/mail-books/${mailBookId}`, { note });
    return res.data.data;
  },

  /** AS-IS cmp.Cmp11_MailRole.deleteByMailBookId + cmp.Cmp10_MailBook.delete → 지운 건수 */
  deleteMailBook: async (mailBookId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/cmp/mail-books/${mailBookId}`);
    return res.data.data ?? 0;
  },

  /** AS-IS utils.mail.SendMailSMTP.checkCompanyMail: 회사 메일서버로 시험 메일을 보낸다 */
  checkMail: async (mailAddress: string, password: string): Promise<CmpMailCheck> => {
    const res = await apiClient.post<ApiResponse<CmpMailCheck>>('v1/cmp/mail-books/check', { mailAddress, password });
    return res.data.data;
  },

  /** AS-IS cmp.Cmp11_MailRole.selectByRoleId */
  searchRoles: async (mailBookId: number): Promise<CmpMailRole[]> => {
    const res = await apiClient.get<ApiResponse<CmpMailRole[]>>(`v1/cmp/mail-books/${mailBookId}/roles`);
    return res.data.data ?? [];
  },

  /** AS-IS cmp.Cmp11_MailRole.updateList: 이미 있는 사원은 건너뛴다 → 새로 넣은 건수 */
  saveRoles: async (rows: CmpMailRole[]): Promise<number> => {
    const body = rows.map(({ mailBookId, personId }) => ({ mailBookId, personId }));
    const res = await apiClient.put<ApiResponse<number>>('v1/cmp/mail-roles', body);
    return res.data.data ?? 0;
  },

  /** AS-IS cmp.Cmp11_MailRole.delete → 지운 건수 */
  deleteRoles: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/cmp/mail-roles', { data: ids });
    return res.data.data ?? 0;
  },
};
