import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import { PayDeductTable, PayFormula, PayFormulaDate, PayItem, PayOtherSetup, PayPersonDeduct, PayRate, PaySimpleTax, PaySimpleTaxOther, PayStartDate, PayTaxCalc, PayTaxDeduct, PayTaxDeductLimit, PayWorkTime } from '../types/pay';

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
};
