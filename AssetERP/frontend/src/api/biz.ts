import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import {
  BizAccountMap, BizAccountOption, BizBuyPromo, BizCardCompare, BizCardContents, BizCardContentsPrintReq, BizCardManagement, BizCardManagementPrintReq, BizCardManagementUpdateReq, BizCardReportPrint, BizCardUseItem, BizCardUserAllocation, BizCardUserAllocationUpdateReq, BizCodeOption, BizDocClass, BizLimit, BizLimitCompanyYear, BizLimitPersonDay, BizLimitPersonYear, BizPerson, BizPromoAccountReq, BizPromoCard, BizPromoOther, BizPromoOtherReq, BizPromoOtherSimpleReq,
  BizPromoSimpleUpdateReq, BizPromoUpdateReq, BizProvideCompany, BizProvideList, BizProvideListCond, BizProvideSetup, BizProvideSimple, BizProvideSimpleCond, BizRelateAppr,
} from '../types/biz';
import { MktTarget } from '../types/mkt';
import { CrmContact } from '../types/crm';

/** L01 AS-IS Biz90_Tab_Limit (이익제공 기준관리) */
export const bizLimitApi = {
  /** AS-IS biz.Biz90_Limit.selectByCompanyId */
  searchLimits: async (): Promise<BizLimit[]> => {
    const res = await apiClient.get<ApiResponse<BizLimit[]>>('v1/biz/limits');
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz90_Limit.update → 저장된 행(요청 순서). 새 행(id ≤ 0)은 id를 빼고 보낸다 */
  saveLimits: async (rows: BizLimit[]): Promise<BizLimit[]> => {
    const body = rows.map(({ limitId, startDate, provideRcvType, saleRuleLimit1, saleRuleLimit2, companyLimit1, companyLimit2, companyLimit3 }) =>
      ({ limitId: limitId > 0 ? limitId : null, startDate, provideRcvType, saleRuleLimit1, saleRuleLimit2, companyLimit1, companyLimit2, companyLimit3 }));
    const res = await apiClient.put<ApiResponse<BizLimit[]>>('v1/biz/limits', body);
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz90_Limit.delete → 지운 건수 */
  deleteLimits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/limits', { data: ids });
    return res.data.data ?? 0;
  },
};

/** L01 AS-IS Biz04_Lookup_EmpSetup (직원 자동등록 설정) */
export const bizProvideSetupApi = {
  /** AS-IS biz.Biz04_ProvideSetup.selectByProvidePurCode — 서버가 목적 코드 뒤에 '%'를 붙인다 */
  searchProvideSetups: async (providePurCode: string): Promise<BizProvideSetup[]> => {
    const res = await apiClient.get<ApiResponse<BizProvideSetup[]>>('v1/biz/provide-setups', { params: { providePurCode } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz04_ProvideSetup.upsert (바뀐 행마다) → 저장한 건수 */
  saveProvideSetups: async (rows: BizProvideSetup[]): Promise<number> => {
    const body = rows.map(({ provideSetupId, provideContentCode, empSetYn }) => ({ provideSetupId, provideContentCode, empSetYn }));
    const res = await apiClient.put<ApiResponse<number>>('v1/biz/provide-setups', body);
    return res.data.data ?? 0;
  },
};

/** L02 AS-IS Biz01_Tab_Card·Biz01_Edit_Card·Biz01_Lookup_CardManagement (server/biz/Biz01_Promo) */
export const bizPromoApi = {
  /** AS-IS biz.Biz01_Promo.selectByCard — 날짜 'yyyy-MM-dd', 서버가 searchText를 %…%로 감싼다 */
  searchCards: async (startDate: string, closeDate: string, searchText: string): Promise<BizPromoCard[]> => {
    const res = await apiClient.get<ApiResponse<BizPromoCard[]>>('v1/biz/promos/cards', { params: { startDate, closeDate, searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.closeCheck — 마감된 내역이 있으면 true (status -1) */
  hasClosed: async (promoIds: number[]): Promise<boolean> => {
    const res = await apiClient.post<ApiResponse<boolean>>('v1/biz/promos/close-check', promoIds);
    return res.data.data ?? false;
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate */
  updatePromo: async (promoId: number, req: BizPromoUpdateReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/${promoId}`, req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_CardSimple) — 거래상대방·인원까지 */
  updatePromoSimple: async (promoId: number, req: BizPromoSimpleUpdateReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/${promoId}/simple`, req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.selectByProvideCompany (Biz01_Lookup_ProvideCompany) */
  searchProvideCompanies: async (searchText: string): Promise<BizProvideCompany[]> => {
    const res = await apiClient.get<ApiResponse<BizProvideCompany[]>>('v1/biz/promos/provide-companies', { params: { searchText } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.noteUpdate — 마감된 내역은 비고만 */
  updateNote: async (promoId: number, note: string | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/${promoId}/note`, { note });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.updateAccount → 저장한 건수 */
  updateAccounts: async (req: BizPromoAccountReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/biz/promos/accounts', req);
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys00_Common.selectByProvideContentCode */
  searchProvideAccounts: async (provideContentCode: string): Promise<BizAccountOption[]> => {
    const res = await apiClient.get<ApiResponse<BizAccountOption[]>>('v1/biz/promos/provide-accounts', { params: { provideContentCode } });
    return res.data.data ?? [];
  },
  /** AS-IS dcr.Dcr30_Link.selectByLinkCode — 지정된 문서분류가 없으면 null */
  getDocClass: async (linkCode: string): Promise<BizDocClass | null> => {
    const res = await apiClient.get<ApiResponse<BizDocClass | null>>('v1/biz/promos/doc-class', { params: { linkCode } });
    return res.data.data ?? null;
  },
  /** AS-IS sys.Sys99_Print.insertRdCard → 출력 그룹 ID (RD rdGroupId) */
  rdPrint: async (startDate: string, closeDate: string, searchText: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/rd-print', { startDate, closeDate, searchText });
    return res.data.data ?? '';
  },

  // ── L03 Biz01_Tab_Other·Biz01_Edit_Other ──

  /** AS-IS biz.Biz01_Promo.selectByOther — 날짜 'yyyy-MM-dd', 제공/수령 구분이 없으면 '%'(전체) */
  searchOthers: async (startDate: string, closeDate: string, provideRcvType: string): Promise<BizPromoOther[]> => {
    const res = await apiClient.get<ApiResponse<BizPromoOther[]>>('v1/biz/promos/others', { params: { startDate, closeDate, provideRcvType } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate (새 행) → 내역 ID */
  createOther: async (req: BizPromoOtherReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/biz/promos/others', req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_OtherSimple 새 행) — 거래상대방·인원까지 */
  createOtherSimple: async (req: BizPromoOtherSimpleReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/biz/promos/others/simple', req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_OtherSimple 고친 행) */
  updateOtherSimple: async (promoId: number, req: BizPromoOtherSimpleReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/others/${promoId}/simple`, req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate (고친 행) */
  updateOther: async (promoId: number, req: BizPromoOtherReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/promos/others/${promoId}`, req);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz01_Promo.delete → 지운 건수 */
  deleteOthers: async (promoIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/promos/others', { data: promoIds });
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys09_Code.selectByKindCode(ProvidePurCode, 구분코드%) */
  searchProvidePurposes: async (rcvType: string): Promise<BizCodeOption[]> => {
    const res = await apiClient.get<ApiResponse<BizCodeOption[]>>('v1/biz/promos/provide-purposes', { params: { rcvType } });
    return res.data.data ?? [];
  },

  // ── L05 Bmt01_Tab_Buy → Biz01_TabPage_List ──

  /** AS-IS biz.Biz01_Promo.selectByBuyId */
  searchBuyPromos: async (buyId: number): Promise<BizBuyPromo[]> => {
    const res = await apiClient.get<ApiResponse<BizBuyPromo[]>>('v1/biz/promos/buy-promos', { params: { buyId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.updateAdd — 변경 행(promoId ≤ 0은 새 행) → 다시 읽은 행들(요청 순서) */
  saveBuyPromos: async (rows: BizBuyPromo[]): Promise<BizBuyPromo[]> => {
    const res = await apiClient.put<ApiResponse<BizBuyPromo[]>>('v1/biz/promos/buy-promos', rows);
    return res.data.data ?? [];
  },

  // ── L04 Biz01_Tab_CardContents ──

  /** AS-IS biz.Biz01_Promo.selectCardContentsPaging — dataYm 'yyyy.MM', managerId·providePurCode '%'는 전체, offset = (쪽-1)*limit */
  searchCardContents: async (p: { dataYm: string; managerId: string; providePurCode: string; searchText: string; offset: number; limit: number }): Promise<PageRes<BizCardContents>> => {
    const res = await apiClient.get<ApiResponse<PageRes<BizCardContents>>>('v1/biz/promos/card-contents', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** AS-IS biz.Biz01_Promo.selectByAmt — 총 승인금액 */
  getCardContentsAmount: async (p: { dataYm: string; managerId: string; providePurCode: string; searchText: string }): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/biz/promos/card-contents/total-amount', { params: p });
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys00_Common.selectBizCardManager — 기준년월 'yyyy.MM'. "전체"는 부르는 쪽이 붙인다 */
  searchCardManagers: async (stdYm: string): Promise<BizCodeOption[]> => {
    const res = await apiClient.get<ApiResponse<BizCodeOption[]>>('v1/biz/promos/card-managers', { params: { stdYm } });
    return res.data.data ?? [];
  },
  /** AS-IS sys.Sys99_Print.insertRdCardContents → 출력 그룹 ID */
  rdPrintCardContents: async (req: BizCardContentsPrintReq): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/card-contents/rd-print', req);
    return res.data.data ?? '';
  },
  /** AS-IS sys.Sys99_Print.insertRdCardContentsDownload → 출력 그룹 ID(엑셀용) */
  rdDownloadCardContents: async (req: BizCardContentsPrintReq): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/card-contents/rd-download', req);
    return res.data.data ?? '';
  },
  /** AS-IS sys.Sys99_Print.insertRdCardContentsSimple → 출력 그룹 ID(엑셀용, L11) */
  rdDownloadCardContentsSimple: async (req: BizCardContentsPrintReq): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/card-contents/rd-download-simple', req);
    return res.data.data ?? '';
  },

  // ── L08 Biz01_Tab_PriorApproval ──

  /** AS-IS biz.Biz01_Promo.selectProvideList — 날짜 'yyyy-MM-dd', crmName '%'는 전체, empId가 null이면 파라미터를 빼서 조건 없음 */
  searchProvideList: async (c: BizProvideListCond): Promise<BizProvideList[]> => {
    const res = await apiClient.get<ApiResponse<BizProvideList[]>>('v1/biz/promos/provide-list', {
      params: { startDate: c.startDate, endDate: c.endDate, provideRcvType: c.provideRcvType, crmName: c.crmName, ...(c.empId != null ? { empId: c.empId } : {}) },
    });
    return res.data.data ?? [];
  },
  /** AS-IS sys.Sys99_Print.insertRdProvideList → 출력 그룹 ID */
  rdPrintProvideList: async (c: BizProvideListCond): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/provide-list/rd-print', c);
    return res.data.data ?? '';
  },

  // ── L12 Biz01_Tab_PriorApprovalSimple ──

  /** AS-IS biz.Biz01_Promo.selectProvideListSimple — 한도초과 내역. 날짜 'yyyy-MM-dd', provideRcvType·crmName '%'는 전체 */
  searchProvideListSimple: async (c: BizProvideSimpleCond): Promise<BizProvideSimple[]> => {
    const res = await apiClient.get<ApiResponse<BizProvideSimple[]>>('v1/biz/promos/provide-list-simple', { params: c });
    return res.data.data ?? [];
  },
  /** AS-IS sys.Sys99_Print.insertRdProvideListSimple → 출력 그룹 ID */
  rdPrintProvideListSimple: async (c: BizProvideSimpleCond): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/promos/provide-list-simple/rd-print', c);
    return res.data.data ?? '';
  },
};

/** L12 AS-IS Crm09_Lookup_SelectSingle (server/crm/Crm09_Contact) — 영업 거래처 조회창 */
export const crmContactApi = {
  /** AS-IS crm.Crm09_Contact.selectKeyInCompanyName — open("keyInCompany"). searchText는 글자 그대로(서버가 `%…%`로 감싼다) */
  searchKeyInCompanies: async (searchText: string): Promise<CrmContact[]> => {
    const res = await apiClient.get<ApiResponse<CrmContact[]>>('v1/crm/contacts/key-in-companies', { params: { searchText } });
    return res.data.data ?? [];
  },
};

/** L08 AS-IS Mkt01_Lookup_Select2 (server/mkt/Mkt01_TargetCompany) — 거래상대방 조회창 */
export const mktTargetApi = {
  /** AS-IS mkt.Mkt01_TargetCompany.selectTargetCompanyPaging(cmp) / selectManagerPaging(emp) — searchText는 글자 그대로(서버가 `%…%`로 감싼다), offset = (쪽-1)*limit */
  search: async (type: 'cmp' | 'emp', p: { searchText: string; offset: number; limit: number }): Promise<PageRes<MktTarget>> => {
    const res = await apiClient.get<ApiResponse<PageRes<MktTarget>>>(type === 'cmp' ? 'v1/mkt/target-companies' : 'v1/mkt/target-companies/managers', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },
};

/** L02 AS-IS Biz02_Grid_InternalList·ExternalList (server/biz/Biz02_Person) */
export const bizPersonApi = {
  /** AS-IS biz.Biz02_Person.selectByInternal */
  searchInternal: async (promoId: number): Promise<BizPerson[]> => {
    const res = await apiClient.get<ApiResponse<BizPerson[]>>('v1/biz/people/internal', { params: { promoId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz02_Person.selectByExternal */
  searchExternal: async (promoId: number): Promise<BizPerson[]> => {
    const res = await apiClient.get<ApiResponse<BizPerson[]>>('v1/biz/people/external', { params: { promoId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz02_Person.modelUpdate(직원 등록) → 추가한 건수 */
  addEmps: async (promoId: number, empIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/biz/people/internal', { promoId, empIds });
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz02_Person.insertEmpId — 로그인 사원이 없는 내역에 직원으로 넣는다 */
  autoRegister: async (promoIds: number[]): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/biz/people/auto-register', promoIds);
    return res.data.data ?? 0;
  },
  /** AS-IS biz.Biz04_ProvideSetup.selectByProvideContentCode → 직원 자동등록 여부 */
  getEmpSet: async (provideContentCode: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/biz/people/emp-set', { params: { provideContentCode } });
    return res.data.data ?? false;
  },
  /** AS-IS biz.Biz02_Person.delete → 지운 건수 */
  deletePeople: async (personIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/people', { data: personIds });
    return res.data.data ?? 0;
  },
};

/** L02 AS-IS Biz05_Lookup_RelateAppr·Biz01_Tab_Card 상신 상태 (server/biz/Biz05_RelateAppr) */
export const bizRelateApprApi = {
  /** AS-IS biz.Biz05_RelateAppr.selectByPromoId */
  searchByPromo: async (promoId: number): Promise<BizRelateAppr[]> => {
    const res = await apiClient.get<ApiResponse<BizRelateAppr[]>>('v1/biz/relate-apprs', { params: { promoId } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz05_RelateAppr.selectByPersonId — 한 건이면 그 행, 아니면 null(미상신). dataYm 'yyyy.MM' */
  getByPerson: async (dataYm: string, linkCode: string): Promise<BizRelateAppr | null> => {
    const res = await apiClient.get<ApiResponse<BizRelateAppr | null>>('v1/biz/relate-apprs/by-person', { params: { dataYm, linkCode } });
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz05_RelateAppr.selectByDataYm — 한 건이면 그 행, 아니면 null(미상신). dataYm 'yyyy.MM' */
  getByDataYm: async (dataYm: string, linkCode: string): Promise<BizRelateAppr | null> => {
    const res = await apiClient.get<ApiResponse<BizRelateAppr | null>>('v1/biz/relate-apprs/by-data-ym', { params: { dataYm, linkCode } });
    return res.data.data ?? null;
  },
  /** AS-IS biz.Biz05_RelateAppr.selectFileCount → 'n건' */
  getFileCount: async (promoId: number): Promise<string> => {
    const res = await apiClient.get<ApiResponse<string>>('v1/biz/relate-apprs/file-count', { params: { promoId } });
    return res.data.data ?? '0건';
  },
  /** AS-IS biz.Biz05_RelateAppr.delete → 지운 건수 */
  deleteRelateApprs: async (relateApprIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/relate-apprs', { data: relateApprIds });
    return res.data.data ?? 0;
  },
};

/** U15 AS-IS Biz01_Tab_CardManagement (법인카드 내역관리) → server/biz/Biz01_Promo (selectByPaging·compareCheck·cardClose·modelUpdate·sendMessage) */
export const bizCardManagementApi = {
  /** AS-IS biz.Biz01_Promo.selectByPaging — dataYm 'yyyy.MM', managerId·providePurCode '%'는 전체, offset = (쪽-1)*limit */
  search: async (p: { dataYm: string; managerId: string; providePurCode: string; searchText: string; offset: number; limit: number }): Promise<PageRes<BizCardManagement>> => {
    const res = await apiClient.get<ApiResponse<PageRes<BizCardManagement>>>('v1/biz/card-managements', { params: p });
    return res.data.data ?? { total: 0, rows: [] };
  },
  /** AS-IS LoginUser.getCompanyModel().getCardRealUserYn() — 실사용자 칸을 보일지 */
  getCardRealUser: async (): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<boolean>>('v1/biz/card-managements/real-user');
    return res.data.data ?? false;
  },
  /** AS-IS biz.Biz01_Promo.compareCheck — 업로드 내역과 금액이 다른 건. 비면 같다 */
  compare: async (dataYm: string): Promise<BizCardCompare[]> => {
    const res = await apiClient.get<ApiResponse<BizCardCompare[]>>('v1/biz/card-managements/compare', { params: { dataYm } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.cardClose — procType P 마감 / C 취소. 실패하면 서버 메시지로 오류 */
  close: async (dataYm: string, procType: 'P' | 'C'): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/biz/card-managements/close', { dataYm, procType });
  },
  /** AS-IS biz.Biz01_Promo.modelUpdate (Biz01_Edit_Account) → 저장한 건수 */
  update: async (promoId: number, req: BizCardManagementUpdateReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>(`v1/biz/card-managements/${promoId}`, req);
    return res.data.data ?? 0;
  },
  /** AS-IS sys.Sys99_Print.insertRdCardManagement → 출력 그룹 ID(엑셀용) */
  rdDownload: async (req: BizCardManagementPrintReq): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/biz/card-managements/rd-download', req);
    return res.data.data ?? '';
  },
  /** AS-IS biz.Biz01_Promo.sendMessage — 고른 사용자(사원 ID)에게 마감 알림 문자 */
  sendMessage: async (dataYm: string, personIds: number[]): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/biz/card-managements/messages', { dataYm, personIds });
  },
};

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** L07 AS-IS Biz01_Tab_LimitCheckList (이익제공 한도초과현황) → server Biz01_Promo.selectByPersonDay·PersonYear·CompanyYear. provideRcvType 없으면 전체 */
export const bizLimitCheckApi = {
  /** 인별 1회 초과건 */
  searchPersonDay: async (yearText: string, provideRcvType?: string): Promise<BizLimitPersonDay[]> => {
    const res = await apiClient.get<ApiResponse<BizLimitPersonDay[]>>('v1/biz/limit-checks/person-day', { params: { yearText, provideRcvType } });
    return res.data.data ?? [];
  },
  /** 인별 연간 초과건 */
  searchPersonYear: async (yearText: string, provideRcvType?: string): Promise<BizLimitPersonYear[]> => {
    const res = await apiClient.get<ApiResponse<BizLimitPersonYear[]>>('v1/biz/limit-checks/person-year', { params: { yearText, provideRcvType } });
    return res.data.data ?? [];
  },
  /** 회사별 연간 초과건 */
  searchCompanyYear: async (yearText: string, provideRcvType?: string): Promise<BizLimitCompanyYear[]> => {
    const res = await apiClient.get<ApiResponse<BizLimitCompanyYear[]>>('v1/biz/limit-checks/company-year', { params: { yearText, provideRcvType } });
    return res.data.data ?? [];
  },
  /** AS-IS ExcelDownload?actionCode=biz01List: 세 탭을 시트 3개로 — "이익제공 한도초과현황(연도).xls" */
  downloadExcel: async (yearText: string, provideRcvType?: string): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/biz/limit-checks/excel', { params: { yearText, provideRcvType }, responseType: 'blob' });
      saveBlob(res.data, `이익제공 한도초과현황(${yearText}).xls`);
    } catch (err) {
      throw await readBlobError(err);
    }
  },
};

/** U16 AS-IS Biz01_Tab_CardUserAllocation (법인카드 실사용자 배분) → server/biz/Biz01_Promo (selectCardCommonUser·updateRealPersonId) */
export const bizCardUserAllocationApi = {
  /** AS-IS biz.Biz01_Promo.selectCardCommonUser — dataYm 'yyyy.MM', unassignedOnly = "미분배건 조회" */
  search: async (dataYm: string, unassignedOnly: boolean): Promise<BizCardUserAllocation[]> => {
    const res = await apiClient.get<ApiResponse<BizCardUserAllocation[]>>('v1/biz/card-user-allocations', { params: { dataYm, unassignedOnly } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz01_Promo.updateRealPersonId — realPersonId null = 공통. 저장한 건수 */
  update: async (req: BizCardUserAllocationUpdateReq): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/biz/card-user-allocations', req);
    return res.data.data ?? 0;
  },
};

/** U17 AS-IS Biz01_Tab_CardReport (법인카드 현황) → sys.Sys99_Print.insertCardReport·2·3 */
export const bizCardReportApi = {
  /** 세 보고서의 RD 출력 자료를 만들고 그룹 ID를 받는다. year 'yyyy', month '01'~'12', cardRealUserType '관리자'|'실사용자' */
  print: async (year: string, month: string, cardRealUserType: string): Promise<BizCardReportPrint> => {
    const res = await apiClient.post<ApiResponse<BizCardReportPrint>>('v1/biz/card-reports/rd-print', { year, month, cardRealUserType });
    return res.data.data;
  },
};

/** U17 AS-IS Biz03_Lookup_AccountMap (항목별 계정연결) → server/biz/Biz03_AccountMap */
export const bizAccountMapApi = {
  /** AS-IS sys.Sys09_Code.selectByCodeKind(BizCardUseItemCode, 오늘) */
  searchUseItems: async (): Promise<BizCardUseItem[]> => {
    const res = await apiClient.get<ApiResponse<BizCardUseItem[]>>('v1/biz/account-maps/use-items');
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz03_AccountMap.selectByUseItemCode */
  searchByUseItemCode: async (useItemCode: string): Promise<BizAccountMap[]> => {
    const res = await apiClient.get<ApiResponse<BizAccountMap[]>>('v1/biz/account-maps', { params: { useItemCode } });
    return res.data.data ?? [];
  },
  /** AS-IS biz.Biz03_AccountMap.update — 요청과 같은 순서로 돌려준다(저장한 뒤 목록은 다시 읽는다) */
  save: async (rows: BizAccountMap[]): Promise<BizAccountMap[]> => {
    const body = rows.map(({ accountMapId, useItemCode, accountCodeId }) => ({ accountMapId, useItemCode, accountCodeId }));
    await apiClient.put<ApiResponse<number>>('v1/biz/account-maps', body);
    return rows;
  },
  /** AS-IS biz.Biz03_AccountMap.delete */
  remove: async (accountMapIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/biz/account-maps', { data: accountMapIds });
    return res.data.data ?? 0;
  },
};
