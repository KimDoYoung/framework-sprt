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

/** 법인카드 (crd.Crd01_Card, GET /api/v1/crd/cards). Y/N은 'true'/'false' 문자열, 날짜는 'yyyy-MM-dd' */
export interface CrdCard {
  cardId: number;
  companyId?: number | null;
  bankCode?: string | null;
  bankName?: string | null;
  cardName?: string | null;
  cardNoSlip?: string | null;
  cardNo?: string | null;
  frDate?: string | null;
  toDate?: string | null;
  closeYn?: string | null;
  cardType?: string | null;
  cardTypeName?: string | null;
  note?: string | null;
  depositId?: number | null;
  depositName?: string | null;
  cardManagerName?: string | null;
}

/** 카드사용자 콤보 (sys.Sys00_Common.selectCardManager) */
export interface CrdCardManager {
  personId: number;
  name: string;
}

/** 카드 사용자(관리자) 이력 (crd.Crd03_Trans, GET /api/v1/crd/cards/{cardId}/users) */
export interface CrdCardUser {
  transId: number;
  personId?: number | null;
  cardId?: number | null;
  frDt?: string | null;
  toDt?: string | null;
  useYn?: string | null;
  publicYn?: string | null;
  personName?: string | null;
  titleName?: string | null;
  orgName?: string | null;
}
