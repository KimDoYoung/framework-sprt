/** 법인카드 업로드 카드사(crd10_excel_company) — 법인카드 업로드 기초자료 */
export interface CrdExcelCompany {
  excelCompanyId: number;
  companyId?: number;
  bankCode?: string;
  bankName?: string;
  note?: string;
}

/** 법인카드 업로드 구분코드 맵핑(crd11_excel_code) */
export interface CrdExcelCode {
  excelCodeId: number;
  companyId?: number;
  bankCode?: string;
  bankName?: string;
  bankExcelCode?: string;
  bankExcelName?: string;
  seq?: number;
  text?: string;
}
