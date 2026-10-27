import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { CurrentFeeByFund, FundPrice, IcamData, IcamFee, IcamFund, IcamSource, IcamTestBatchReq } from '../types/icam';

/** icam 화면 API (D07~) */
export const icamApi = {
  // ── D07 ICAM 펀드정보 (Icam03_Tab_Fund) ──

  /** AS-IS icam.Icam03_Fund.selectRecentFund: 고른 회사의 펀드별 최신 적용일 행 */
  searchRecentFunds: async (companyId: number): Promise<IcamFund[]> => {
    const res = await apiClient.get<ApiResponse<IcamFund[]>>('v1/icam/funds/recent', { params: { companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam03_Fund.selectByPaging: 한 펀드의 일자별 이력 (페이지 행 + 전체 건수) */
  searchFundHistory: async (params: { companyId: number; fundCode: string; offset: number; limit: number }): Promise<PageRes<IcamFund>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcamFund>>>('v1/icam/funds', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },

  /** AS-IS BatchMain(actionCode=icamFund·extrFund): ICAM Get·타사무 Get — 외부 ICAM DB 연동이 없으면 오류 */
  runFundBatch: async (actionCode: 'icamFund' | 'extrFund', companyId: string): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/funds/batch', { actionCode, companyId });
  },

  // ── D08 ICAM 보수(관리자용) (Icam10_Tab_FeeAdmin) ──

  /** AS-IS icam.Icam10_Fee.selectByFeeTypePaging: 기간·보수구분·검색어의 발생보수 (페이지 행 + 전체 건수) */
  searchFees: async (params: { companyId: number; feeType: string; startDate: string; closeDate: string; searchText: string; offset: number; limit: number }): Promise<PageRes<IcamFee>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcamFee>>>('v1/icam/fees', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },

  /** AS-IS BatchMain(actionCode=icamOfficeMngFee·icamFundMngFee): ICAM 발생보수 가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  runFeeBatch: async (req: { actionCode: 'icamOfficeMngFee' | 'icamFundMngFee'; companyId: string; startDate: string; closeDate: string }): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/fees/batch', req);
  },

  // ── D09 ICAM DB Source Get (Icam50_Tab_DbSource) ──

  /** AS-IS icam.Icam50_Source.selectByServerTypePaging: 기준일 이전 최신 적재분의 DB소스 (페이지 행 + 전체 건수). 서버·소스구분은 "전체"면 전부 */
  searchSources: async (params: { stdDate: string; serverType: string; sourceType: string; nameSearchText: string; sourceSearchText: string; offset: number; limit: number }): Promise<PageRes<IcamSource>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcamSource>>>('v1/icam/sources', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },

  /** AS-IS icam.Icam50_Source.insertIcamDbSource: ICAM DB소스 가져오기 — 외부 ICAM DB 연동이 없으면 오류 */
  fetchSource: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/sources/fetch');
  },

  // ── D10 작업용 (Icam99_Tab_Test) ──

  /** AS-IS icam.Icam02_Data.selectByCompanyId: 로그인 회사의 ICAM 연계 데이터 */
  searchIcamData: async (): Promise<IcamData[]> => {
    const res = await apiClient.get<ApiResponse<IcamData[]>>('v1/icam/data');
    return res.data.data ?? [];
  },

  /** AS-IS BatchMain(actionCode=…): 작업용 화면의 작업 버튼 — 배치 연동이 없으면 오류 */
  runTestBatch: async (req: IcamTestBatchReq): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/test/batch', req);
  },

  // ── R05 펀드별 기준가 현황 (Icam06_Tab_FundPrice) ──

  /** AS-IS icam.Icam06_FundBook.selectIcamFundPrice: 펀드별 기준가 현황 목록 */
  searchFundPrices: async (stdDate: string): Promise<FundPrice[]> => {
    const res = await apiClient.get<ApiResponse<FundPrice[]>>('v1/icam/fund-prices', { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFundPrice: RD 엑셀 다운로드 그룹 ID 생성 */
  rdDownloadFundPrice: async (stdDate: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/icam/fund-prices/rd-download', { stdDate });
    return res.data.data ?? '';
  },

  // ── R06 펀드별 발생보수현황 (Icam10_Tab_CurrentFeeByFund) ──

  /** AS-IS icam.Icam10_Fee.getCurrentFeeByFund: 펀드별 발생보수현황 목록 */
  searchCurrentFeeByFunds: async (yearText: string, preYearText?: string): Promise<CurrentFeeByFund[]> => {
    const res = await apiClient.get<ApiResponse<CurrentFeeByFund[]>>('v1/icam/current-fee-by-funds', {
      params: { yearText, preYearText },
    });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdCurrentFeeByFund: RD 엑셀 다운로드 그룹 ID 생성 */
  rdDownloadCurrentFeeByFund: async (yearText: string, preYearText?: string): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/icam/current-fee-by-funds/rd-download', {
      yearText,
      preYearText,
    });
    return res.data.data ?? '';
  },
};
