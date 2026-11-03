import { apiClient } from './client';
import { ApiResponse, PageRes } from '../types/auth';
import { readBlobError } from './file';
import {
  CurrentFeeByFund,
  FundOperateStatus,
  FundOperateStatusDetail,
  FundPrice,
  IcamData,
  IcamFee,
  IcamFeeFund,
  IcamFeeBook,
  IcamFeeDetail,
  IcamFeeBookCheck,
  IcamFeeDeposit,
  IcamFeeJobReq,
  IcamFund,
  IcamSource,
  IcamTestBatchReq,
  IcamStop,
  IcamUser,
  IcamUserResult,
  IcamUserSaveReq,
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
  searchFees: async (params: { companyId: number; feeType: string; startDate: string; closeDate: string; searchText: string; fundCode?: string | null; offset: number; limit: number }): Promise<PageRes<IcamFee>> => {
    const res = await apiClient.get<ApiResponse<PageRes<IcamFee>>>('v1/icam/fees', { params });
    return res.data.data ?? { total: 0, rows: [] };
  },

  // ── X29 ICAM 운용보수 발생내역 (Icam10_Tab_FundMngFee) ──

  /** AS-IS icam.Icam10_Fee.selectFundList: 펀드 조회창(Icam10_Lookup_FundCode)의 펀드 목록. 검색어 앞뒤 '%'는 서버가 붙인다 */
  searchFundList: async (stdDate: string, searchText: string): Promise<IcamFeeFund[]> => {
    const res = await apiClient.get<ApiResponse<IcamFeeFund[]>>('v1/icam/fees/funds', { params: { stdDate, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdFundMngFee: [출력/다운로드] RD 자료를 준비하고 출력 그룹 ID를 받는다 */
  insertFundMngFeeRd: async (req: { feeType: string; startDate: string; closeDate: string; fundCode: string | null; searchText: string }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/icam/fees/rd', req);
    return res.data.data ?? '';
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
  searchFeeBooks: async (params: { stdDate: string; searchText: string; fundCode?: string | null; offset: number; limit: number }): Promise<PageRes<IcamFeeBook>> => {
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

  // ── X25 증감액 상세 (Ast30_Lookup_FeeDetail) ──

  /** AS-IS icam.Icam10_Fee.selectByFundCode: 펀드 하루의 적요별 보수 */
  searchFeesByFund: async (params: { corpId?: number; fundCode: string; stdDate: string; searchText: string }): Promise<IcamFeeDetail[]> => {
    const res = await apiClient.get<ApiResponse<IcamFeeDetail[]>>('v1/icam/fees/by-fund', { params });
    return res.data.data ?? [];
  },

  // ── X27 펀드별 보수입금계좌 등록 (Icam11_Tab_OfficeMngFeeDeposit) ──

  /** AS-IS icam.Icam11_FeeDeposit.selectByCompanyId: 펀드별 현재 입금계좌 (corpId 없으면 전체 운용사) */
  searchFeeDeposits: async (params: { corpId?: number | null; searchText: string }): Promise<IcamFeeDeposit[]> => {
    const res = await apiClient.get<ApiResponse<IcamFeeDeposit[]>>('v1/icam/fee-deposits', { params: { corpId: params.corpId ?? undefined, searchText: params.searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam11_FeeDeposit.selectByFundCode2: 한 펀드의 적용시작일별 이력 */
  searchFeeDepositsByFund: async (icamCompanyCode: string | null, fundCode: string): Promise<IcamFeeDeposit[]> => {
    const res = await apiClient.get<ApiResponse<IcamFeeDeposit[]>>('v1/icam/fee-deposits/by-fund', { params: { icamCompanyCode: icamCompanyCode ?? undefined, fundCode } });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam11_FeeDeposit.update: 고친 행 저장 (feeDepositId 0 이하는 새 행) */
  saveFeeDeposits: async (rows: IcamFeeDeposit[]): Promise<IcamFeeDeposit[]> => {
    const items = rows.map(r => ({ feeDepositId: r.feeDepositId, icamCompanyCode: r.icamCompanyCode, fundCode: r.fundCode, startDate: r.startDate, depositId: r.depositId }));
    const res = await apiClient.put<ApiResponse<IcamFeeDeposit[]>>('v1/icam/fee-deposits', { items });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam11_FeeDeposit.delete */
  deleteFeeDeposits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/icam/fee-deposits', { data: { ids } });
    return res.data.data ?? 0;
  },
};

/** ICAM 사용자ID 신청서 작성 (EE29 Icam55_Tab_UserRegAppr, AS-IS icam.Icam55_IcamUser) */
export const icamUserApi = {
  /** AS-IS icam.Icam55_IcamUser.selectBySearchText (신청구분 1) — procResult면 처리결과가 없는 것만 */
  search: async (params: { searchText: string; startDate: string; closeDate: string; procResult: boolean }): Promise<IcamUser[]> => {
    const res = await apiClient.get<ApiResponse<IcamUser[]>>('v1/icam/users', { params });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam55_IcamUser.update (UpdateDataModel) → 저장된 행 */
  save: async (req: IcamUserSaveReq): Promise<IcamUser> => {
    const res = await apiClient.put<ApiResponse<IcamUser>>('v1/icam/users', req);
    return res.data.data;
  },

  /** AS-IS icam.Icam55_IcamUser.updateApprId */
  updateApprId: async (icamUserId: number, apprId: number): Promise<void> => {
    await apiClient.put<ApiResponse<void>>(`v1/icam/users/${icamUserId}/appr-id`, { apprId });
  },

  /** AS-IS apr.Apr01_Appr.deleteByApprId (새 결재요청을 진행할 때 기존 문서 삭제) */
  deleteAppr: async (apprId: number): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/icam/users/appr-delete', { apprId });
  },

  /** AS-IS icam.Icam55_IcamUser.deleteApprId + delete */
  remove: async (ids: number[]): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>('v1/icam/users', { params: { ids: ids.join(',') } });
  },

  // ── EE30 사용자ID 처리결과 등록 (Icam55_Tab_UserApprResult) ──

  /** AS-IS icam.Icam55_IcamUser.selectByDate */
  searchResults: async (params: { searchText: string; regType: string; startDate: string; closeDate: string; procResult: boolean }): Promise<IcamUserResult[]> => {
    const res = await apiClient.get<ApiResponse<IcamUserResult[]>>('v1/icam/users/results', { params });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam55_IcamUser.update — 바뀐 행의 처리결과·처리일자·처리상세·처리자 */
  saveResults: async (rows: IcamUserResult[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/icam/users/results', rows.map(r => ({
      icamUserId: r.icamUserId, procStateCode: r.procStateCode ?? null, procDate: r.procDate ?? null, procNote: r.procNote ?? null, procEmpId: r.procEmpId ?? null,
    })));
  },

  /** AS-IS icam.Icam55_IcamUser.updateResult — 선택내역 일괄반영(처리자는 서버가 로그인 사원) */
  updateResult: async (req: { ids: number[]; procStateCode: string | null; procDate: string | null; procNote: string | null }): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/icam/users/results/batch', req);
  },

  // ── EE31 미사용ID 권한정지 신청 (Icam55_Tab_UserStopAuthAppr) ──

  /** AS-IS icam.Icam55_IcamUser.selectBySearchText (신청구분 2) — stdDate = 선택 분기의 마지막 날 */
  searchStops: async (params: { searchText: string; stdDate: string }): Promise<IcamStop[]> => {
    const res = await apiClient.get<ApiResponse<IcamStop[]>>('v1/icam/users/stops', { params });
    return res.data.data ?? [];
  },

  /** AS-IS icam.Icam55_IcamUser.update — 바뀐 행 (icamUserId 0 이하는 새 행) */
  saveStops: async (rows: IcamStop[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/icam/users/stops', rows.map(r => ({
      icamUserId: r.icamUserId, regDate: r.regDate ?? null, companyName: r.companyName ?? null, userId: r.userId ?? null,
      userName: r.userName ?? null, email: r.email ?? null,
    })));
  },

  /** AS-IS icam.Icam55_IcamUser.updateApprIds — 화면의 모든 행에 같은 상신ID */
  updateStopApprIds: async (ids: number[], apprId: number): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/icam/users/stops/appr-id', { ids, apprId });
  },

  /** 템플릿 받기 (AS-IS downloadForm → ./excelTemplete/Template_권한정지 신청서.xlsx) */
  downloadStopTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/icam/users/stops/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_권한정지 신청서.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 엑셀업로드 (AS-IS ExcelUpload?uploadType=icamUserStopUpload) → 넣은 행 수 */
  uploadStopsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/icam/users/stops/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
