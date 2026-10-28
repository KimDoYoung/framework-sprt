import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { readBlobError } from './file';
import { PayAccount, PayApprCheck, PayInsurePay, PayRelateAppr, PayMonth, PayMonthCreateReq, PayMonthGroup, PayMonthItem, PayMonthItemDate, PayMonthItemText, PayMonthPerson, PayRelateNote, PayRetireDeduct, PayRetireInsure, PayRetireLeave, PayRetireTaxDeduct, PayRetireLeaveCalc, PayRetireMonth, PayRetireTaxDetail, PayRetireTaxItem, PayActMapping, PayAnnual, PayDeductTable, PayFormula, PayFormulaDate, PayItem, PayOtherSetup, PayPersonDeduct, PayRate, PaySimpleTax, PaySimpleTaxOther, PayStartDate, PayTaxCalc, PayTaxDeduct, PayTaxWithholding, PayTaxReceipt, PayTaxDeductLimit, PayWorkTime, PayInsureApply, PayInsureApplyCreateReq, PayBasicSetup, PayBasicSetupSaveReq } from '../types/pay';

/** pay(급여) API (E22 급여기초정보관리) */
export const payApi = {
  /** AS-IS pay.Pay20_Item.selectBySearchText — 항목구분은 코드(전체 "%"), 항목명은 서버가 "%검색어%"로 감싼다 */
  searchItems: async (itemType: string, searchText: string): Promise<PayItem[]> => {
    const res = await apiClient.get<ApiResponse<PayItem[]>>('v1/pay/items', { params: { itemType, searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay20_Item.selectByText (급여항목 조회창) */
  lookupItems: async (searchText: string): Promise<PayItem[]> => {
    const res = await apiClient.get<ApiResponse<PayItem[]>>('v1/pay/items/lookup', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay20_Item.update → 저장된 행(요청 순서) */
  saveItems: async (rows: PayItem[]): Promise<PayItem[]> => {
    const body = rows.map(({ itemId, itemType, itemCd, itemName, nonTaxType, seq, useYn }) => ({ itemId, itemType, itemCd, itemName, nonTaxType, seq, useYn }));
    const res = await apiClient.put<ApiResponse<PayItem[]>>('v1/pay/items', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay20_Item.delete → 지운 건수 */
  deleteItems: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/items', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay21_Rate.selectByCode — 율 구분 코드(전체 "%") */
  searchRates: async (rateCode: string): Promise<PayRate[]> => {
    const res = await apiClient.get<ApiResponse<PayRate[]>>('v1/pay/rates', { params: { rateCode } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay21_Rate.update → 저장된 행(요청 순서) */
  saveRates: async (rows: PayRate[]): Promise<PayRate[]> => {
    const body = rows.map(({ rateId, rateCode, startDate, applyRate, note }) => ({ rateId, rateCode, startDate, applyRate, note }));
    const res = await apiClient.put<ApiResponse<PayRate[]>>('v1/pay/rates', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay21_Rate.delete → 지운 건수 */
  deleteRates: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/rates', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay04_Formula.selectByCompanyId — companyId 없으면 로그인 회사(다른 회사는 관리자만) */
  searchFormulaDates: async (companyId?: number): Promise<PayFormulaDate[]> => {
    const res = await apiClient.get<ApiResponse<PayFormulaDate[]>>('v1/pay/formulas/dates', { params: { companyId } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay04_Formula.selectByDate */
  searchFormulas: async (startDate: string, companyId?: number): Promise<PayFormula[]> => {
    const res = await apiClient.get<ApiResponse<PayFormula[]>>('v1/pay/formulas', { params: { companyId, startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay04_Formula.insert — 가장 최근 적용일 행을 새 적용일로 복사 */
  createFormulaDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/formulas/dates', { startDate });
  },

  /** AS-IS pay.Pay04_Formula.deleteByDate → 지운 건수 */
  deleteFormulaDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/formulas/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay04_Formula.update → 저장된 행(요청 순서) */
  saveFormulas: async (rows: PayFormula[]): Promise<PayFormula[]> => {
    const body = rows.map(({ formulaId, startDate, itemCd, formulaForm, note }) => ({ formulaId, startDate, itemCd, formulaForm, note }));
    const res = await apiClient.put<ApiResponse<PayFormula[]>>('v1/pay/formulas', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay04_Formula.delete → 지운 건수 */
  deleteFormulas: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/formulas', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay04_Formula.basicDataCreate — 관리자 회사 적용일 산출식을 고객사로 복사 → 복사한 건수 */
  basicDataCreate: async (companyId: number, startDate: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/pay/formulas/basic-data', { companyId, startDate });
    return res.data.data ?? 0;
  },

  // ── 근로소득 간이세액표 (Pay22_SimpleTaxTable · Pay23_SimpleTaxTableOther) ──

  /** AS-IS pay.Pay23_SimpleTaxTableOther.selectByAll — 적용일 목록(최신순) */
  searchSimpleTaxDates: async (): Promise<PayStartDate[]> => {
    const res = await apiClient.get<ApiResponse<PayStartDate[]>>('v1/pay/simple-taxes/dates');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay23_SimpleTaxTableOther.insert — 적용일 이전 최근 적용일의 천만원 초과 표를 복사 */
  createSimpleTaxDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/simple-taxes/dates', { startDate });
  },

  /** AS-IS pay.Pay23_SimpleTaxTableOther.deleteByDate — 두 표의 해당 적용일을 지운다 */
  deleteSimpleTaxDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/simple-taxes/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay22_SimpleTaxTable.selectByDate (천만원 이하) — searchLong이 있으면 그 금액이 속한 구간만 */
  searchSimpleTaxes: async (startDate: string, searchLong?: number | null): Promise<PaySimpleTax[]> => {
    const res = await apiClient.get<ApiResponse<PaySimpleTax[]>>('v1/pay/simple-taxes', { params: { startDate, searchLong: searchLong ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay22_SimpleTaxTable.deleteByDate — 엑셀업로드 전에 천만원 이하 표를 비운다 */
  deleteSimpleTaxTable: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/simple-taxes', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS ExcelUpload?uploadType=simpleTaxTableUpload → 넣은 건수 */
  uploadSimpleTaxExcel: async (startDate: string, file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/pay/simple-taxes/excel', form, { params: { startDate }, headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay23_SimpleTaxTableOther.selectByDate (천만원 초과) */
  searchSimpleTaxOthers: async (startDate: string): Promise<PaySimpleTaxOther[]> => {
    const res = await apiClient.get<ApiResponse<PaySimpleTaxOther[]>>('v1/pay/simple-taxes/other', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay23_SimpleTaxTableOther.update → 저장된 행(요청 순서) */
  saveSimpleTaxOthers: async (rows: PaySimpleTaxOther[]): Promise<PaySimpleTaxOther[]> => {
    const body = rows.map(({ simpleTaxTableOtherId, startDate, fromAmt, toAmt, rate1, rate2, addTax, note }) => ({ simpleTaxTableOtherId, startDate, fromAmt, toAmt, rate1, rate2, addTax, note }));
    const res = await apiClient.put<ApiResponse<PaySimpleTaxOther[]>>('v1/pay/simple-taxes/other', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay23_SimpleTaxTableOther.delete → 지운 건수 */
  deleteSimpleTaxOthers: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/simple-taxes/other', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 근로소득 공제표 (Pay24_DeductTable) ──

  /** AS-IS pay.Pay24_DeductTable.selectByAll — 적용일 목록(최신순) */
  searchDeductTableDates: async (): Promise<PayStartDate[]> => {
    const res = await apiClient.get<ApiResponse<PayStartDate[]>>('v1/pay/deduct-tables/dates');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay24_DeductTable.insert — 적용일 이전 최근 적용일의 공제한도·공제표를 복사 */
  createDeductTableDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/deduct-tables/dates', { startDate });
  },

  /** AS-IS pay.Pay24_DeductTable.deleteByDate */
  deleteDeductTableDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/deduct-tables/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay24_DeductTable.selectByDataCode("2") — 공제표 구간 */
  searchDeductTables: async (startDate: string): Promise<PayDeductTable[]> => {
    const res = await apiClient.get<ApiResponse<PayDeductTable[]>>('v1/pay/deduct-tables', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay24_DeductTable.update → 저장된 행(요청 순서) */
  saveDeductTables: async (rows: PayDeductTable[]): Promise<PayDeductTable[]> => {
    const body = rows.map(({ deductTableId, startDate, fromAmt, toAmt, deductAmt, deductRate, note }) => ({ deductTableId, startDate, fromAmt, toAmt, deductAmt, deductRate, note }));
    const res = await apiClient.put<ApiResponse<PayDeductTable[]>>('v1/pay/deduct-tables', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay24_DeductTable.delete → 지운 건수 */
  deleteDeductTables: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/deduct-tables', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay24_DeductTable.selectByDataCode("1") — 공제한도(없으면 0) */
  searchDeductLimit: async (startDate: string): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/pay/deduct-tables/limit', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay24_DeductTable.updateLimitAmt */
  saveDeductLimit: async (startDate: string, limitAmt: number | null): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('v1/pay/deduct-tables/limit', { startDate, limitAmt });
    return res.data.data ?? 0;
  },

  // ── 인적공제금액 (Pay25_PersonDeduct) ──

  /** AS-IS pay.Pay25_PersonDeduct.selectByAll — 적용일 목록(최신순) */
  searchPersonDeductDates: async (): Promise<PayStartDate[]> => {
    const res = await apiClient.get<ApiResponse<PayStartDate[]>>('v1/pay/person-deducts/dates');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay25_PersonDeduct.insert — 적용일 이전 최근 적용일의 행을 복사 */
  createPersonDeductDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/person-deducts/dates', { startDate });
  },

  /** AS-IS pay.Pay25_PersonDeduct.deleteByDate */
  deletePersonDeductDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/person-deducts/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay25_PersonDeduct.selectByDate */
  searchPersonDeducts: async (startDate: string): Promise<PayPersonDeduct[]> => {
    const res = await apiClient.get<ApiResponse<PayPersonDeduct[]>>('v1/pay/person-deducts', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay25_PersonDeduct.update → 저장된 행(요청 순서) */
  savePersonDeducts: async (rows: PayPersonDeduct[]): Promise<PayPersonDeduct[]> => {
    const body = rows.map(({ personDeductId, startDate, personDeductCode, deductAmt, note }) => ({ personDeductId, startDate, personDeductCode, deductAmt, note }));
    const res = await apiClient.put<ApiResponse<PayPersonDeduct[]>>('v1/pay/person-deducts', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay25_PersonDeduct.delete → 지운 건수 */
  deletePersonDeducts: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/person-deducts', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 과세표준 구간별 기본세율 (Pay26_TaxCalcTable) ──

  /** AS-IS pay.Pay26_TaxCalcTable.selectByAll — 적용일 목록(최신순) */
  searchTaxCalcDates: async (): Promise<PayStartDate[]> => {
    const res = await apiClient.get<ApiResponse<PayStartDate[]>>('v1/pay/tax-calcs/dates');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay26_TaxCalcTable.insert — 적용일 이전 최근 적용일의 행을 복사 */
  createTaxCalcDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/tax-calcs/dates', { startDate });
  },

  /** AS-IS pay.Pay26_TaxCalcTable.deleteByDate */
  deleteTaxCalcDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/tax-calcs/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay26_TaxCalcTable.selectByDate */
  searchTaxCalcs: async (startDate: string): Promise<PayTaxCalc[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxCalc[]>>('v1/pay/tax-calcs', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay26_TaxCalcTable.update → 저장된 행(요청 순서) */
  saveTaxCalcs: async (rows: PayTaxCalc[]): Promise<PayTaxCalc[]> => {
    const body = rows.map(({ taxCalcTableId, startDate, fromAmt, toAmt, basicTax, rate, note }) => ({ taxCalcTableId, startDate, fromAmt, toAmt, basicTax, rate, note }));
    const res = await apiClient.put<ApiResponse<PayTaxCalc[]>>('v1/pay/tax-calcs', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay26_TaxCalcTable.delete → 지운 건수 */
  deleteTaxCalcs: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/tax-calcs', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 근로소득 세액공제 (Pay27_TaxDeductTable · Pay28_TaxDeductLimit) ──

  /** AS-IS pay.Pay27_TaxDeductTable.selectByAll — 적용일 목록(최신순) */
  searchTaxDeductDates: async (): Promise<PayStartDate[]> => {
    const res = await apiClient.get<ApiResponse<PayStartDate[]>>('v1/pay/tax-deducts/dates');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay27_TaxDeductTable.insert — 적용일 이전 최근 적용일의 세액공제·한도를 복사 */
  createTaxDeductDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/tax-deducts/dates', { startDate });
  },

  /** AS-IS pay.Pay27_TaxDeductTable.deleteByDate — 세액공제와 한도를 같이 지움 */
  deleteTaxDeductDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/tax-deducts/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay27_TaxDeductTable.selectByDate */
  searchTaxDeducts: async (startDate: string): Promise<PayTaxDeduct[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxDeduct[]>>('v1/pay/tax-deducts', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay27_TaxDeductTable.update → 저장된 행(요청 순서) */
  saveTaxDeducts: async (rows: PayTaxDeduct[]): Promise<PayTaxDeduct[]> => {
    const body = rows.map(({ taxDeductTableId, startDate, fromAmt, toAmt, deductAmt, rate, note }) => ({ taxDeductTableId, startDate, fromAmt, toAmt, deductAmt, rate, note }));
    const res = await apiClient.put<ApiResponse<PayTaxDeduct[]>>('v1/pay/tax-deducts', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay27_TaxDeductTable.delete → 지운 건수 */
  deleteTaxDeducts: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/tax-deducts', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay28_TaxDeductLimit.selectByDate */
  searchTaxDeductLimits: async (startDate: string): Promise<PayTaxDeductLimit[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxDeductLimit[]>>('v1/pay/tax-deducts/limits', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay28_TaxDeductLimit.update → 저장된 행(요청 순서) */
  saveTaxDeductLimits: async (rows: PayTaxDeductLimit[]): Promise<PayTaxDeductLimit[]> => {
    const body = rows.map(({ taxDeductLimitId, startDate, fromAmt, toAmt, minLimit, maxLimit, rate, note }) => ({ taxDeductLimitId, startDate, fromAmt, toAmt, minLimit, maxLimit, rate, note }));
    const res = await apiClient.put<ApiResponse<PayTaxDeductLimit[]>>('v1/pay/tax-deducts/limits', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay28_TaxDeductLimit.delete → 지운 건수 */
  deleteTaxDeductLimits: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/tax-deducts/limits', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 급여공제 기타설정 (Pay29_OtherSetup) ──

  /** AS-IS pay.Pay29_OtherSetup.selectByAll — 적용일 목록(최신순) */
  searchOtherSetupDates: async (): Promise<PayStartDate[]> => {
    const res = await apiClient.get<ApiResponse<PayStartDate[]>>('v1/pay/other-setups/dates');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay29_OtherSetup.insert — 적용일 이전 최근 적용일의 행을 복사 */
  createOtherSetupDate: async (startDate: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/other-setups/dates', { startDate });
  },

  /** AS-IS pay.Pay29_OtherSetup.deleteByDate */
  deleteOtherSetupDate: async (startDate: string): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/other-setups/dates', { params: { startDate } });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay29_OtherSetup.selectByDate */
  searchOtherSetups: async (startDate: string): Promise<PayOtherSetup[]> => {
    const res = await apiClient.get<ApiResponse<PayOtherSetup[]>>('v1/pay/other-setups', { params: { startDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay29_OtherSetup.update → 저장된 행(요청 순서) */
  saveOtherSetups: async (rows: PayOtherSetup[]): Promise<PayOtherSetup[]> => {
    const body = rows.map(({ otherSetupId, startDate, hiMaxDiv, eiMaxDiv, hiMinAmt, hiMaxAmt, npMinAmt, npMaxAmt, stdTaxDeduct, note }) => ({ otherSetupId, startDate, hiMaxDiv, eiMaxDiv, hiMinAmt, hiMaxAmt, npMinAmt, npMaxAmt, stdTaxDeduct, note }));
    const res = await apiClient.put<ApiResponse<PayOtherSetup[]>>('v1/pay/other-setups', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay29_OtherSetup.delete → 지운 건수 */
  deleteOtherSetups: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/other-setups', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay34_WorkTimeConfig.selectByCompanyId (E23 근로시간기준관리) — 회사는 서버가 0으로 고정 */
  searchWorkTimes: async (): Promise<PayWorkTime[]> => {
    const res = await apiClient.get<ApiResponse<PayWorkTime[]>>('v1/pay/work-times');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay34_WorkTimeConfig.update → 저장된 행(요청 순서) */
  saveWorkTimes: async (rows: PayWorkTime[]): Promise<PayWorkTime[]> => {
    const body = rows.map(({ workTimeConfigId, startDate, dayWorkHours, weekMaxAddHours, ntStartTime, ntEndTime, otMultRate, ntMultRate, holiStdMultRate, holiOverMultRate }) => ({ workTimeConfigId, startDate, dayWorkHours, weekMaxAddHours, ntStartTime, ntEndTime, otMultRate, ntMultRate, holiStdMultRate, holiOverMultRate }));
    const res = await apiClient.put<ApiResponse<PayWorkTime[]>>('v1/pay/work-times', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay34_WorkTimeConfig.delete → 지운 건수 */
  deleteWorkTimes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/work-times', { data: ids });
    return res.data.data ?? 0;
  },
  // ── S13 연봉계약관리 (Pay01_Tab_Annual) ──

  /** AS-IS pay.Pay01_Annual.selectByAll / selectByPersonId — 사원을 안 골랐으면 전체. radioOption 1 최근등록내역 / 2 년도별(yearStr) / 3 전체 */
  searchAnnuals: async (params: { personId?: number | null; radioOption: number; yearStr: string; retireYn: boolean; apprCheckYn?: boolean }): Promise<PayAnnual[]> => {
    const res = await apiClient.get<ApiResponse<PayAnnual[]>>('v1/pay/annuals', { params: { ...params, personId: params.personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** S15 연봉조회: AS-IS pay.Pay01_Annual.selectByPersonId(personId = 로그인 사용자, apprYn "true") — 본인의 결재완료 연봉 전부 */
  searchMyAnnuals: async (): Promise<PayAnnual[]> => {
    const res = await apiClient.get<ApiResponse<PayAnnual[]>>('v1/pay/annuals/mine');
    return res.data.data ?? [];
  },

  /** S14 [출력/다운로드]: AS-IS sys.Sys99_Print.insertRdAnnualListAll(사원 없음) / insertRdAnnualList(사원) — 결재완료만 출력 자료에 넣고 groupId(rdGroupId)를 돌려준다 */
  rdPrintAnnuals: async (params: { personId?: number | null; radioOption: number; yearStr: string; retireYn: boolean }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/pay/annuals/rd-print', null, { params: { ...params, personId: params.personId ?? undefined } });
    return res.data.data ?? '';
  },

  /** AS-IS pay.Pay01_Annual.update — 저장한 행(요청 순서) */
  saveAnnuals: async (rows: PayAnnual[]): Promise<PayAnnual[]> => {
    const body = rows.map(({ annualId, personId, startDate, closeDate, startTime, closeTime, monthOtHours, annualPay, retirePay, etcAgreement, basicPay, mealPay, carMt, childcareAllowance, overPay, etc01Pay, etc02Pay }) => ({ annualId, personId, startDate, closeDate, startTime, closeTime, monthOtHours, annualPay, retirePay, etcAgreement, basicPay, mealPay, carMt, childcareAllowance, overPay, etc01Pay, etc02Pay }));
    const res = await apiClient.put<ApiResponse<PayAnnual[]>>('v1/pay/annuals', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay01_Annual.delete → 지운 건수 */
  deleteAnnuals: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/annuals', { data: ids });
    return res.data.data ?? 0;
  },

  /** [템플릿] — AS-IS downloadForm.submit() (./excelTemplete/Template_연봉계약정보.xlsx) */
  downloadAnnualTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/pay/annuals/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_연봉계약정보.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** [엑셀업로드] — AS-IS ExcelUpload?uploadType=payUpload → 등록한 건수 */
  uploadAnnualsExcel: async (file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>('v1/pay/annuals/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },

  // ── S13 계약서 Mapping (Pay06_Lookup_ActList) ──

  /** AS-IS pay.Pay06_ActMapping.selectByLinkCode — 사원구분은 전체("%") */
  searchActMappings: async (linkCode: string): Promise<PayActMapping[]> => {
    const res = await apiClient.get<ApiResponse<PayActMapping[]>>('v1/pay/act-mappings', { params: { linkCode, kindCode: '%' } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay06_ActMapping.update — 저장한 행(요청 순서) */
  saveActMappings: async (rows: PayActMapping[]): Promise<PayActMapping[]> => {
    const body = rows.map(({ actMappingId, title, content, linkCode, defaultYn, note, kindCode }) => ({ actMappingId, title, content, linkCode, defaultYn, note, kindCode }));
    const res = await apiClient.put<ApiResponse<PayActMapping[]>>('v1/pay/act-mappings', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay06_ActMapping.delete → 지운 건수 */
  deleteActMappings: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/act-mappings', { data: ids });
    return res.data.data ?? 0;
  },

  // ── S16 급여관리 (Pay10_Tab_Month) ──

  /** AS-IS pay.Pay10_Month.selectByCompanyId */
  searchMonths: async (payCode: string, payDate: string): Promise<PayMonth[]> => {
    const res = await apiClient.get<ApiResponse<PayMonth[]>>('v1/pay/months', { params: { payCode, payDate } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay10_Month.selectByYear (지급구분/일자 조회창) — payCode 전체는 "%" */
  searchMonthGroups: async (year: string, payCode: string, code?: string | null): Promise<PayMonthGroup[]> => {
    const res = await apiClient.get<ApiResponse<PayMonthGroup[]>>('v1/pay/months/groups', { params: { year, payCode, code: code ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay10_Month.checkAppr — 결재 진행·전표 발생이면 ok=false + 문구 (실패여도 예외가 아니다) */
  checkMonthAppr: async (payCode: string, payDate: string, monthId?: number | null): Promise<PayApprCheck> => {
    const res = await apiClient.get<ApiResponse<PayApprCheck>>('v1/pay/months/check-appr', { params: { payCode, payDate, monthId: monthId ?? undefined } });
    return res.data.data ?? { ok: true };
  },

  /** AS-IS pay.Pay10_Month.insert */
  createMonths: async (req: PayMonthCreateReq): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/months', req);
  },

  /** AS-IS pay.Pay10_Month.deleteAll → 지운 건수 */
  deleteMonths: async (monthIds: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/months', { data: monthIds });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay10_Month.modelUpdate (근로시간 팝업) — 총근로시간은 서버가 계산 */
  updateMonthWorkTime: async (monthId: number, req: { workDay: number; extendWorkTime: number; nightWorkTime: number; holidayWorkTime: number }): Promise<void> => {
    await apiClient.put<ApiResponse<number>>(`v1/pay/months/${monthId}/work-time`, req);
  },

  /** AS-IS pay.Pay11_MonthItem.selectByItemType — 1 지급 / 2 공제 */
  searchMonthItems: async (monthId: number, itemType: string): Promise<PayMonthItem[]> => {
    const res = await apiClient.get<ApiResponse<PayMonthItem[]>>('v1/pay/month-items', { params: { monthId, itemType } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay11_MonthItem.updateList(지급) / getInsureAdjustModi(공제) */
  saveMonthItems: async (monthId: number, itemType: string, updateList: { monthItemId?: number | null; itemCd: string; itemAmt?: number | null }[], deleteIds: number[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/pay/month-items', { monthId, itemType, updateList, deleteIds });
  },

  /** AS-IS pay.Pay11_MonthItem.selectByText (S17 급여관리(항목별)) */
  searchMonthItemsByText: async (params: { payCode: string; payDate: string; itemCode: string; searchText: string }): Promise<PayMonthItemText[]> => {
    const res = await apiClient.get<ApiResponse<PayMonthItemText[]>>('v1/pay/month-items/by-text', { params });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay11_MonthItem.updateMonthItemList (S17 [저장]) */
  saveMonthItemAmounts: async (rows: { monthId: number; monthItemId: number; itemType: string; itemCd: string; itemAmt: number | null }[]): Promise<void> => {
    await apiClient.put<ApiResponse<void>>('v1/pay/month-items/amounts', rows);
  },

  /** AS-IS pay.Pay11_MonthItem.insertItemType (S17 [일괄생성]) → 추가한 건수 */
  insertMonthItemBulk: async (req: { payCode: string; payDate: string; itemType: string; itemCode: string }): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/pay/month-items/bulk', req);
    return res.data.data ?? 0;
  },

  /** AS-IS sys.Sys99_Print.insertRdMonthItem (S17 [출력/다운로드]) → 출력 자료 groupId */
  rdPrintMonthItems: async (params: { payCode: string; payDate: string; itemCode: string; searchText: string }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/pay/month-items/rd-print', null, { params });
    return res.data.data as string;
  },

  /** AS-IS pay.Pay10_Month.selectByYearPersonId — 본인 급여(S20 급여명세서). 사원은 서버가 로그인 사용자로 정한다 */
  searchMyPayMonths: async (year: string): Promise<PayMonthPerson[]> => {
    const res = await apiClient.get<ApiResponse<PayMonthPerson[]>>('v1/pay/months/mine', { params: { year } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay10_Month.selectByYearPersonId — 고른 사원의 급여(S21 급여명세서(경영관리팀)) */
  searchPersonPayMonths: async (personId: number, year: string): Promise<PayMonthPerson[]> => {
    const res = await apiClient.get<ApiResponse<PayMonthPerson[]>>('v1/pay/months/by-person', { params: { personId, year } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay10_Month.selectByMonthIdCount ×2 — 지급·공제 항목 수 중 큰 값(RD 보고서 num). mine이면 본인 급여만 */
  payMonthItemCount: async (monthId: number, mine: boolean): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>(mine ? `v1/pay/months/mine/${monthId}/item-count` : `v1/pay/months/${monthId}/item-count`);
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay11_MonthItem.selectByDate (S19 급여항목조회) */
  searchMonthItemsByDate: async (params: { startDate: string; closeDate: string; itemCode: string; searchText: string }): Promise<PayMonthItemDate[]> => {
    const res = await apiClient.get<ApiResponse<PayMonthItemDate[]>>('v1/pay/month-items/by-date', { params });
    return res.data.data ?? [];
  },

  /** AS-IS sys.Sys99_Print.insertRdMonthSearch (S19 [출력/다운로드]) → 출력 자료 groupId */
  rdPrintMonthItemsByDate: async (params: { startDate: string; closeDate: string; itemCode: string; searchText: string }): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/pay/month-items/rd-print-by-date', null, { params });
    return res.data.data as string;
  },

  /** AS-IS pay.Pay20_Item.getMonthItem (S17 Pay20_Lookup_MonthItem) */
  lookupMonthItems: async (searchText: string): Promise<PayItem[]> => {
    const res = await apiClient.get<ApiResponse<PayItem[]>>('v1/pay/items/month-items', { params: { searchText } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay11_MonthItem.recalculationTax */
  recalculateTax: async (monthId: number): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/month-items/recalculate-tax', null, { params: { monthId } });
  },

  /** AS-IS pay.Pay20_Item.selectByItemType (Pay20_Lookup_SelectMulti) */
  searchItemsByType: async (itemType: string): Promise<PayItem[]> => {
    const res = await apiClient.get<ApiResponse<PayItem[]>>('v1/pay/items/by-type', { params: { itemType } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay09_RelateNote.selectByCompanyId — noteType 1 전체 / 2 개별 */
  searchRelateNotes: async (payCode: string, payDate: string, noteType: string): Promise<PayRelateNote[]> => {
    const res = await apiClient.get<ApiResponse<PayRelateNote[]>>('v1/pay/relate-notes', { params: { payCode, payDate, noteType } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay09_RelateNote.checkNote — 없으면 빈 비고 행을 만들어 돌려준다 */
  checkRelateNote: async (payCode: string, payDate: string, noteType: string): Promise<PayRelateNote> => {
    const res = await apiClient.post<ApiResponse<PayRelateNote>>('v1/pay/relate-notes/check', null, { params: { payCode, payDate, noteType } });
    return res.data.data as PayRelateNote;
  },

  /** AS-IS pay.Pay09_RelateNote.modelUpdate / update → 저장된 행(요청 순서). id가 0 이하·없으면 새 행 */
  saveRelateNotes: async (rows: PayRelateNote[]): Promise<PayRelateNote[]> => {
    const body = rows.map(({ relateNoteId, payDate, payCd, noteType, personId, note }) => ({ relateNoteId: relateNoteId > 0 ? relateNoteId : null, payDate, payCd, noteType, personId, note }));
    const res = await apiClient.put<ApiResponse<PayRelateNote[]>>('v1/pay/relate-notes', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay09_RelateNote.delete → 지운 건수 */
  deleteRelateNotes: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/relate-notes', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay05_RelateAppr.selectByCompanyId — 급여대장 상신 상태. 상신 이력이 없으면 null(미상신) */
  getRelateAppr: async (payCode: string, payDate: string): Promise<PayRelateAppr | null> => {
    const res = await apiClient.get<ApiResponse<PayRelateAppr | null>>('v1/pay/relate-apprs', { params: { payCode, payDate } });
    return res.data.data ?? null;
  },

  /** AS-IS pay.Pay30_BasicSetup.selectByCompanyId (S28) — 설정이 없으면 null */
  getBasicSetup: async (): Promise<PayBasicSetup | null> => {
    const res = await apiClient.get<ApiResponse<PayBasicSetup | null>>('v1/pay/basic-setup');
    return res.data.data ?? null;
  },

  /** AS-IS pay.Pay30_BasicSetup.modelUpdate (S28) */
  saveBasicSetup: async (req: PayBasicSetupSaveReq): Promise<PayBasicSetup> => {
    const res = await apiClient.put<ApiResponse<PayBasicSetup>>('v1/pay/basic-setup', req);
    return res.data.data;
  },

  /** AS-IS pay.Pay03_Account.selectByCompanyId */
  searchAccounts: async (): Promise<PayAccount[]> => {
    const res = await apiClient.get<ApiResponse<PayAccount[]>>('v1/pay/accounts');
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay03_Account.selectByStartDate — 지급일에 적용되는 출금계좌, 없으면 null */
  getAccountByDate: async (startDate: string): Promise<PayAccount | null> => {
    const res = await apiClient.get<ApiResponse<PayAccount | null>>('v1/pay/accounts/current', { params: { startDate } });
    return res.data.data ?? null;
  },

  /** AS-IS pay.Pay03_Account.update → 저장된 행(요청 순서). id가 0 이하면 새 행 */
  saveAccounts: async (rows: PayAccount[]): Promise<PayAccount[]> => {
    const body = rows.map(({ accountId, startDate, astClassTreeId, bankCd, accountNo, accountName, note }) => ({ accountId: accountId > 0 ? accountId : null, startDate, astClassTreeId, bankCd, accountNo, accountName, note }));
    const res = await apiClient.put<ApiResponse<PayAccount[]>>('v1/pay/accounts', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay03_Account.delete → 지운 건수 */
  deleteAccounts: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/accounts', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay32_InsurePay.selectByPersonId — year·insureCode가 비면 전체 */
  searchInsurePays: async (personId: number, insureCode: string, year: string): Promise<PayInsurePay[]> => {
    const res = await apiClient.get<ApiResponse<PayInsurePay[]>>('v1/pay/insure-pays', { params: { personId, insureCode, year } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay32_InsurePay.selectByCompanyId (S27) — 사원·연도·보험별 가장 최근 정산 한 행. personId가 없으면 회사 전체, year·insureCode가 비면 전체 */
  searchInsurePaysByCompany: async (params: { personId?: number | null; insureCode?: string; year?: string }): Promise<PayInsurePay[]> => {
    const res = await apiClient.get<ApiResponse<PayInsurePay[]>>('v1/pay/insure-pays/company', { params: { ...params, personId: params.personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay32_InsurePay.update → 저장된 행(요청 순서). id가 0 이하면 새 행 */
  saveInsurePays: async (rows: PayInsurePay[]): Promise<PayInsurePay[]> => {
    const body = rows.map(({ insurePayId, personId, year, insureCd, tgtAmt, payCd, payDiv, date, cnt, amt, remAmt }) => ({ insurePayId: insurePayId > 0 ? insurePayId : null, personId, year, insureCd, tgtAmt, payCd, payDiv, date, cnt, amt, remAmt }));
    const res = await apiClient.put<ApiResponse<PayInsurePay[]>>('v1/pay/insure-pays', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay32_InsurePay.delete → 지운 건수 */
  deleteInsurePays: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/insure-pays', { data: ids });
    return res.data.data ?? 0;
  },

  // ── 퇴직정산 Pay10_Tab_Retire (S22) ──

  /** AS-IS pay.Pay10_Month.selectByPersonId(payCode 03) + getRetireInfo의 퇴직일 — 퇴직정산서가 없으면 null */
  getRetireMonth: async (personId: number): Promise<PayRetireMonth | null> => {
    const res = await apiClient.get<ApiResponse<PayRetireMonth | null>>('v1/pay/retires/month', { params: { personId } });
    return res.data.data ?? null;
  },

  /** AS-IS pay.Pay10_Month.selectByRetirePayCode(지급 1·공제 2) 행 수 중 큰 값 — RD 폼 num */
  retireRdCount: async (personId: number): Promise<number> => {
    const res = await apiClient.get<ApiResponse<number>>('v1/pay/retires/rd-count', { params: { personId } });
    return res.data.data ?? 1;
  },

  /** AS-IS pay.Pay12_RetireInsure.getInsureRetire(insert) — Pay12_Lookup_RetireCreate [생성] */
  createRetire: async (personId: number, insureCheckYn: boolean, taxCheckYn: boolean): Promise<void> => {
    await apiClient.post('v1/pay/retires', { personId, insureCheckYn, taxCheckYn });
  },

  /** AS-IS getInsureRetire(C) — [삭제]. 퇴직정산서가 없으면 false */
  deleteRetire: async (personId: number): Promise<boolean> => {
    const res = await apiClient.delete<ApiResponse<boolean>>('v1/pay/retires', { params: { personId } });
    return res.data.data ?? false;
  },

  /** AS-IS pay.Pay12_RetireInsure.selectByPersonId */
  searchRetireInsures: async (personId: number, insureCode: string): Promise<PayRetireInsure[]> => {
    const res = await apiClient.get<ApiResponse<PayRetireInsure[]>>('v1/pay/retire-insures', { params: { personId, insureCode } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay12_RetireInsure.insertRetireInfo — 행 저장(음수 id는 새 행)·삭제 */
  saveRetireInsures: async (monthId: number, insureCode: string, year: string, updates: PayRetireInsure[], deleteIds: number[]): Promise<void> => {
    const rows = updates.map((r) => ({ ...r, retireInsureId: r.retireInsureId > 0 ? r.retireInsureId : null }));
    await apiClient.put('v1/pay/retire-insures', { monthId, insureCode, year, updates: rows, deleteIds });
  },

  /** AS-IS pay.Pay12_RetireInsure.callInsureRetire — [4대보험 정산 재생성] */
  regenerateRetireInsures: async (personId: number): Promise<void> => {
    await apiClient.post('v1/pay/retire-insures/regenerate', null, { params: { personId } });
  },

  /** AS-IS sys.Sys99_Print.insertRdRetireInsure → rdGroupId */
  rdPrintRetireInsures: async (personId: number): Promise<string> => {
    const res = await apiClient.post<ApiResponse<string>>('v1/pay/retire-insures/rd-print', null, { params: { personId } });
    return res.data.data ?? '';
  },

  /** AS-IS pay.Pay14_RetireTaxItem.selectByMonthId ×3 + pay.Pay13_RetireTax.getOfficePayTax·selectByMonthId */
  getRetireTax: async (monthId: number): Promise<PayRetireTaxDetail> => {
    const res = await apiClient.get<ApiResponse<PayRetireTaxDetail>>(`v1/pay/retire-taxes/${monthId}`);
    return res.data.data as PayRetireTaxDetail;
  },

  /** AS-IS pay.Pay14_RetireTaxItem.insertRetireTaxItem — menuNum 1·4·7 */
  saveRetireTaxItems: async (personId: number, monthId: number, menuNum: number, updates: PayRetireTaxItem[], deleteIds: number[]): Promise<void> => {
    const rows = updates.map((r) => ({ ...r, retireTaxItemId: r.retireTaxItemId > 0 ? r.retireTaxItemId : null }));
    await apiClient.put('v1/pay/retire-taxes/items', { personId, monthId, menuNum, updates: rows, deleteIds });
  },

  /** AS-IS pay.Pay13_RetireTax.insertRetireTax — menuNum 2·3·5·6·8·10 */
  saveRetireTaxAmount: async (personId: number, monthId: number, menuNum: number, itemAmt: number | null, pyItemAmt: number | null): Promise<void> => {
    await apiClient.put('v1/pay/retire-taxes/amounts', { personId, monthId, menuNum, itemAmt, pyItemAmt });
  },

  /** AS-IS pay.Pay13_RetireTax.insertOfficePayTax — 9. 기납부세액 */
  saveRetireOfficePayTax: async (personId: number, monthId: number, v: { preOfficePayTax: number | null; pyPreOfficePayTax: number | null; curOfficePayTax: number | null; pyCurOfficePayTax: number | null }): Promise<void> => {
    await apiClient.put('v1/pay/retire-taxes/office', { personId, monthId, ...v });
  },

  /** AS-IS pay.Pay10_Month.getRetireInfo → pay.Pay15_RetireLeave.getRetireLeave·selectByMonthId — 퇴직정산서가 없으면 null */
  getRetireLeave: async (personId: number): Promise<PayRetireLeave | null> => {
    const res = await apiClient.get<ApiResponse<PayRetireLeave | null>>('v1/pay/retire-leaves', { params: { personId } });
    return res.data.data ?? null;
  },

  /** AS-IS pay.Pay15_RetireLeave.calcRetireLeaveDays → selectRemLeaveDays → selectByMonthId(monthId=사원ID) */
  calcRetireLeave: async (personId: number, retireDate: string): Promise<PayRetireLeaveCalc> => {
    const res = await apiClient.post<ApiResponse<PayRetireLeaveCalc>>('v1/pay/retire-leaves/calc', null, { params: { personId, retireDate } });
    return res.data.data as PayRetireLeaveCalc;
  },

  /** AS-IS pay.Pay05_RelateAppr.selectByRetire — 퇴직정산서의 상신 상태. 없으면 null(미상신) */
  getRetireRelateAppr: async (monthId: number): Promise<PayRelateAppr | null> => {
    const res = await apiClient.get<ApiResponse<PayRelateAppr | null>>('v1/pay/relate-apprs/retire', { params: { monthId } });
    return res.data.data ?? null;
  },

  /** AS-IS pay.Pay24_DeductTable.selectByMonthId — Pay24_Lookup_DeductTable */
  getRetireDeductTable: async (monthId: number): Promise<PayRetireDeduct> => {
    const res = await apiClient.get<ApiResponse<PayRetireDeduct>>('v1/pay/retire-tables/deduct', { params: { monthId } });
    return res.data.data as PayRetireDeduct;
  },

  /** AS-IS pay.Pay25_PersonDeduct.selectByMonthId — Pay25_Lookup_PersonDeduct */
  getRetirePersonDeducts: async (monthId: number): Promise<PayPersonDeduct[]> => {
    const res = await apiClient.get<ApiResponse<PayPersonDeduct[]>>('v1/pay/retire-tables/person-deduct', { params: { monthId } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay26_TaxCalcTable.selectByMonthId — Pay26_Lookup_TaxCalcTable */
  getRetireTaxCalcs: async (monthId: number): Promise<PayTaxCalc[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxCalc[]>>('v1/pay/retire-tables/tax-calc', { params: { monthId } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay27_TaxDeductTable·Pay28_TaxDeductLimit.selectByMonthId — Pay27_Lookup_TaxDeductTable */
  getRetireTaxDeduct: async (monthId: number): Promise<PayRetireTaxDeduct> => {
    const res = await apiClient.get<ApiResponse<PayRetireTaxDeduct>>('v1/pay/retire-tables/tax-deduct', { params: { monthId } });
    return res.data.data as PayRetireTaxDeduct;
  },

  // ── S23 갑근세확인서 발급 (Pay40_Tab_TaxWithholding) ──

  /** AS-IS pay.Pay40_IncomeTaxWithholding.selectByCompanyId — stdYear는 LIKE 비교(원본 그대로) */
  searchTaxWithholdings: async (stdYear: string): Promise<PayTaxWithholding[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxWithholding[]>>('v1/pay/tax-withholdings', { params: { stdYear } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay40_IncomeTaxWithholding.updateList — 저장한 행(요청 순서) */
  saveTaxWithholdings: async (rows: PayTaxWithholding[]): Promise<PayTaxWithholding[]> => {
    const body = rows.map(({ incomeTaxWithholdingId, personId, regDate, stdYear, purUseCode, submitTo, cnt }) => ({ incomeTaxWithholdingId, personId, regDate, stdYear, purUseCode, submitTo, cnt }));
    const res = await apiClient.put<ApiResponse<PayTaxWithholding[]>>('v1/pay/tax-withholdings', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay40_IncomeTaxWithholding.delete → 지운 건수 */
  deleteTaxWithholdings: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/tax-withholdings', { data: ids });
    return res.data.data ?? 0;
  },

  // ── S24 원천징수영수증(사본) (Pay08_Tab_TaxWithholding) ──

  /** AS-IS pay.Pay08_TaxWithholding.selectByPersonId — personId는 서버가 로그인 사용자로 정한다 */
  searchMyTaxReceipts: async (): Promise<PayTaxReceipt[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxReceipt[]>>('v1/pay/tax-receipts/mine');
    return res.data.data ?? [];
  },

  // ── S25 원천징수영수증 업로드 (Pay08_Tab_TaxWithholdingAdmin) ──

  /** AS-IS pay.Pay08_TaxWithholding.selectByCompanyId(personId 없음) / selectByPersonId(사원을 골랐을 때) */
  searchTaxReceipts: async (personId: number | null): Promise<PayTaxReceipt[]> => {
    const res = await apiClient.get<ApiResponse<PayTaxReceipt[]>>('v1/pay/tax-receipts', { params: { personId: personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS FileUpload?mode=pay08 — 파일 하나마다 영수증 행을 새로 만들어 올린다 */
  uploadTaxReceipt: async (file: File): Promise<PayTaxReceipt> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<ApiResponse<PayTaxReceipt>>('v1/pay/tax-receipts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data;
  },

  /** AS-IS pay.Pay08_TaxWithholding.update — 바뀐 행의 사원·비고 → 저장한 건수 */
  saveTaxReceipts: async (rows: PayTaxReceipt[]): Promise<number> => {
    const body = rows.map(({ taxWithholdingId, personId, note }) => ({ taxWithholdingId, personId, note }));
    const res = await apiClient.put<ApiResponse<number>>('v1/pay/tax-receipts', body);
    return res.data.data;
  },

  /** AS-IS pay.Pay08_TaxWithholding.delete (파일은 fileApi.deleteFile로 먼저 지운다) */
  deleteTaxReceipt: async (taxWithholdingId: number): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>(`v1/pay/tax-receipts/${taxWithholdingId}`);
    return res.data.data;
  },

  // ── S26 4대보험신고(EDI) (Pay31_Tab_InsureApply) ──

  /** AS-IS pay.Pay31_InsureApply.selectByCompanyId — gubun "1" 자격취득 / "multi" 보수변동·착오정정 / "4" 전년도분 보수총액 / "5" 납부방법 변경 */
  searchInsureApplies: async (params: { gubun: string; personId?: number | null; insureCode?: string; year?: string; startDate: string; closeDate: string }): Promise<PayInsureApply[]> => {
    const res = await apiClient.get<ApiResponse<PayInsureApply[]>>('v1/pay/insure-applies', { params: { ...params, personId: params.personId ?? undefined } });
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay31_InsureApply.update — 저장한 행(요청 순서) */
  saveInsureApplies: async (rows: PayInsureApply[]): Promise<PayInsureApply[]> => {
    const body = rows.map(({ insureApplyId, personId, insureCode, insureApplyCode, applyDate, initDate, applyMonth, applyMonthPay, payCode, payDiv, note, npsInitPayYn }) => ({ insureApplyId, personId, insureCode, insureApplyCode, applyDate, initDate, applyMonth, applyMonthPay, payCode, payDiv, note, npsInitPayYn }));
    const res = await apiClient.put<ApiResponse<PayInsureApply[]>>('v1/pay/insure-applies', body);
    return res.data.data ?? [];
  },

  /** AS-IS pay.Pay31_InsureApply.delete → 지운 건수 */
  deleteInsureApplies: async (ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/insure-applies', { data: ids });
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay31_InsureApply.insert1 → 만든 행 수 */
  createInsureApplies: async (req: PayInsureApplyCreateReq): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('v1/pay/insure-applies', req);
    return res.data.data ?? 0;
  },

  /** AS-IS pay.Pay31_InsureApply.insert3 — personId 없이 allYn이면 전체생성 */
  createInsurePreYear: async (req: { personId?: number | null; allYn: boolean; year: string }): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('v1/pay/insure-applies/pre-year', { ...req, personId: req.personId ?? undefined });
  },

  /** AS-IS pay.Pay31_InsureApply.updateList */
  saveInsurePreYear: async (year: string, rows: PayInsureApply[]): Promise<void> => {
    const body = { year, rows: rows.map(({ insureApplyId, preYearPay1, preYearPay2, preYearPay3, preYearWorkMonthCnt }) => ({ insureApplyId, preYearPay1, preYearPay2, preYearPay3, preYearWorkMonthCnt })) };
    await apiClient.put<ApiResponse<void>>('v1/pay/insure-applies/pre-year', body);
  },

  /** AS-IS pay.Pay31_InsureApply.deleteList → 지운 건수 */
  deleteInsurePreYear: async (year: string, ids: number[]): Promise<number> => {
    const res = await apiClient.delete<ApiResponse<number>>('v1/pay/insure-applies/pre-year', { data: { year, ids } });
    return res.data.data ?? 0;
  },

  /** 탭 4 [템플릿] — AS-IS downloadForm.submit() (./excelTemplete/Template_4대보험 납부방법 변경.xlsx) */
  downloadInsureApplyTemplate: async (): Promise<void> => {
    try {
      const res = await apiClient.get<Blob>('v1/pay/insure-applies/template', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_4대보험 납부방법 변경.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      throw await readBlobError(err);
    }
  },

  /** 탭 2 [엑셀업로드] — AS-IS ExcelUpload?uploadType=ediUpload / 탭 4 — payInsureApply4Upload → 넣은 건수 */
  uploadInsureApplyExcel: async (kind: 'edi' | 'pay-method', file: File): Promise<number> => {
    const form = new FormData();
    form.append('excelUpload', file);
    const res = await apiClient.post<ApiResponse<number>>(`v1/pay/insure-applies/excel/${kind}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.data ?? 0;
  },
};
