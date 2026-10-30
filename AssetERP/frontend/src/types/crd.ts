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

/** 법인카드 내역 한 행 (crd02_data, U14 Crd02_Tab_DataUpload) — 날짜는 yyyy-MM-dd. confirmYn은 내역확정이면 'O' */
export interface CrdData {
  dataId: number;
  companyId?: number | null;
  dataYm?: string | null;
  dataBankCode?: string | null;
  dataBankName?: string | null;
  approvalDt?: string | null;
  approvalTime?: string | null;
  partCode?: string | null;
  partName?: string | null;
  cardNo?: string | null;
  cardName?: string | null;
  franchiseName?: string | null;
  sectorName?: string | null;
  paymentMethod?: string | null;
  monthlyPayments?: number | null;
  approvalAmount?: number | null;
  surtax?: number | null;
  approvalClassification?: string | null;
  approvalMethod?: string | null;
  approvalNo?: string | null;
  stateName?: string | null;
  taxTy?: string | null;
  merchantStatus?: string | null;
  merchantNo?: string | null;
  bizLicenseNo?: string | null;
  representativeName?: string | null;
  merchantAddr?: string | null;
  merchantPhone?: string | null;
  confirmYn?: string | null;
}

/** 확정여부 콤보 (AS-IS confirmComboBox) → 서버 confirm 값 */
export type CrdDataConfirm = 'ALL' | 'DONE' | 'NOT_ALL' | 'NOT_EXCEPT_CANCEL';

/** biz.Biz01_Promo.targetCheck·targetListCheck 결과 — status -1 거절 / 0 진행 / 1 확인 후 진행 / 2 저장 완료 */
export interface CrdDataCheck {
  status: number;
  message?: string | null;
  count: number;
}

export interface CrdDataAmount {
  totalApprovalAmount?: number | null;
  totalSurtax?: number | null;
}

/** 선택내역확정·삭제는 ids, 전체내역확정은 조회조건 */
export interface CrdDataTarget {
  ids?: number[];
  searchText?: string;
  dataBankCode?: string;
  dataYm?: string;
  confirm?: CrdDataConfirm;
}
