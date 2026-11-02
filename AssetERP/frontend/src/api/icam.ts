import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import {
  CurrentFeeByFund,
  FundOperateStatus,
  FundOperateStatusDetail,
  FundPrice,
  IcamData,
  IcamFee,
  IcamFeeBook,
  IcamFeeBookCheck,
  IcamFeeJobReq,
  IcamFund,
  IcamSource,
  IcamTestBatchReq,
} from '../types/icam';

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

  // ── X23 ICAM 펀드보수 발생내역 (Icam10_Tab_OfficeMngFee) ──

  /** AS-IS icam.Icam10_Fee.updateFee: 발생보수만 바꾼다 (Icam10_Lookup_FundFee [저장]) */
  updateFee: async (feeId: string, fee: number | null): Promise<void> => {
    await apiClient.put<ApiResponse<null>>(`v1/icam/fees/${feeId}`, { fee });
  },

  /** AS-IS icam.Icam10_Fee.getICAMFundFee: 외부 ICAM DB 연동이 없으면 오류 (Icam10_Lookup_getICAM) */
  getIcamFundFee: async (req: IcamFeeJobReq): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/fees/icam-fund-fee', req);
  },

  /** AS-IS icam.Icam10_Fee.createFeeBook: 펀드보수원장 재생성 */
  createFeeBook: async (req: IcamFeeJobReq): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/fees/fee-books', req);
  },

  /** AS-IS icam.Icam10_Fee.createFeeRcvTr: 펀드보수 인출거래 재생성 (운용사별) */
  createFeeRcvTr: async (req: IcamFeeJobReq): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/fees/rcv-trs', req);
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

  // ── R07 펀드운용현황 (Icam06_Tab_FundOperateStatus) ──

  /** AS-IS icam.Icam06_FundBook.selectFundBookAvg: 상단 펀드운용현황 합계 목록 */
  searchFundOperateStatus: async (params: {
    startDate: string;
    closeDate: string;
    fundType?: string;
    searchText?: string;
  }): Promise<FundOperateStatus[]> => {
    const res = await apiClient.get<ApiResponse<FundOperateStatus[]>>('v1/icam/fund-operate-status', { params });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam06_FundBook.selectByStdDate: 하단 펀드별 운용현황 상세 목록 */
  searchFundOperateStatusDetails: async (params: {
    stdDate: string;
    fundType?: string;
    searchText?: string;
  }): Promise<FundOperateStatusDetail[]> => {
    const res = await apiClient.get<ApiResponse<FundOperateStatusDetail[]>>('v1/icam/fund-operate-status/details', {
      params,
    });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFundOperateStatus: RD 출력 그룹 ID 생성 */
  rdPrintFundOperateStatus: async (req: {
    startDate: string;
    closeDate: string;
    fundType?: string;
    searchText?: string;
  }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/icam/fund-operate-status/rd-print', req);
    return res.data.data ?? '';
  },

  // ── X24 ICAM 펀드보수 월말잔액 (Icam12_Tab_OfficeMngFeeBook) ──

  /** AS-IS icam.Icam12_FeeBook.selectByStdDatePaging: 기준일(말일)의 월말잔액 (페이지 행 + 전체 건수) */
  searchFeeBooks: async (params: { stdDate: string; searchText: string; offset: number; limit: number }): Promise<PageRes<IcamFeeBook>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcamFeeBook>>>('v1/icam/fee-books', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },

  /** AS-IS icam.Icam13_FeeBookCheck.selectByStdDate: 기준일의 대사 결과 */
  searchFeeBookChecks: async (stdDate: string): Promise<IcamFeeBookCheck[]> => {
    const res = await apiClient.get<ApiResponse<IcamFeeBookCheck[]>>('v1/icam/fee-books/checks', { params: { stdDate } });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam13_FeeBookCheck.checkFeeBook: ICAM 월말잔액 대사 — 외부 ICAM DB 연동이 없으면 오류 */
  checkFeeBook: async (stdDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('v1/icam/fee-books/checks', { stdDate });
  },
};
