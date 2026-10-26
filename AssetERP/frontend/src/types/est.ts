/** 부동산PF 수수료 항목 한 행 (GET /api/v1/est/pf-fee-types, AS-IS Est01_PfFeeTypeModel). 날짜는 'yyyy-MM-dd' */
export interface PfFeeType {
  pfFeeTypeId: number;
  feeCode: string | null;
  feeName: string | null;
  feeDesc: string | null;
  seq: number | null;
  startDate: string | null;
  closeDate: string | null;
  note: string | null;
}

/** 부동산PF 용역계약 한 행 (GET /api/v1/est/pf-contracts, AS-IS Est02_PfContractModel). 날짜는 'yyyy-MM-dd'. 첨부 파일 목록 열(fileListHtml)은 결재 연결 단계에서 */
export interface PfContract {
  pfContractId: number;
  borrower: string | null;
  projectSiteName: string | null;
  projectSiteAddr: string | null;
  pfFeeTypeId: number | null;
  feeCode: string | null;
  feeName: string | null;
  startDate: string | null;
  closeDate: string | null;
  managerId: number;
  managerName: string | null;
  managerInfo: string | null;
  /** 수행시작일 기준 담당자 조직 — 작성자 조직원 검사에 쓴다 */
  managerOrgId: number | null;
  plan: string | null;
  planApprId: number | null;
  planApprStatusName: string | null;
  resultApprId: number | null;
  resultApprStatusName: string | null;
}

/** 용역계약 등록·수정 요청 (AS-IS est.Est02_PfContract.modelUpdate) */
export interface PfContractSaveReq {
  pfContractId: number;
  borrower: string;
  projectSiteName: string;
  projectSiteAddr: string;
  pfFeeTypeId: number | null;
  startDate: string;
  closeDate: string;
  managerId: number;
  plan: string | null;
}
