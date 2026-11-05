/** L12 영업 거래처 조회창(Crm09_Lookup_SelectSingle) 한 행 — keyInCompany는 회사명 한 열 */
export interface CrmContact {
  contactId: number;
  contactName: string;
  /** open("emp")에서만 — 담당자명 */
  contactEmpName?: string | null;
}

/** 영업거래처 한 건 (AS-IS Crm09_ContactModel 중 Crm09_Lookup_ContactPoint가 다루는 값, EE84). shareInfo = 공유기본 요약 */
export interface CrmContactDetail {
  contactId: number;
  contactName: string;
  itemTypeCode: string;
  itemTypeName?: string | null;
  contactEmpName?: string | null;
  contactOrgName?: string | null;
  contactTitle?: string | null;
  contactPos?: string | null;
  contactTelNo?: string | null;
  contactMobileNo?: string | null;
  contactEmailAddr?: string | null;
  contactDate?: string | null;
  personId?: number | null;
  companyId?: number | null;
  majorIssues?: string | null;
  note?: string | null;
  shareInfo?: string | null;
}

/** 영업거래처 저장 (contactId가 없으면 새로 만든다) */
export interface CrmContactSaveReq {
  contactId?: number | null;
  contactName: string;
  itemTypeCode: string;
  contactEmpName: string | null;
  contactOrgName: string | null;
  contactTitle: string | null;
  contactPos: string | null;
  contactTelNo: string | null;
  contactMobileNo: string | null;
  contactEmailAddr: string | null;
  majorIssues: string | null;
  note: string | null;
}

/** 업무활동내역 한 건 (AS-IS Crm12_WorkDetailModel 중 Crm12_Lookup_WorkDetail이 다루는 값, EE85). contactName = 거래처, shareInfo = 공유 요약 */
export interface CrmWorkDetail {
  workDetailId: number;
  contactId: number;
  contactName?: string | null;
  workDate?: string | null;
  regDate?: string | null;
  workName?: string | null;
  workContent?: string | null;
  privateYn?: boolean | null;
  personId?: number | null;
  companyId?: number | null;
  shareInfo?: string | null;
}

/** 업무활동내역 연결펀드 한 줄 (AS-IS Crm13_RelateFundModel). 새로 더한 줄은 relateFundId가 없다 */
export interface CrmRelateFund {
  relateFundId?: number | null;
  workDetailId?: number | null;
  fundId: number;
  fundCode?: string | null;
  fundName?: string | null;
}

/** 업무활동내역 저장 — fundIds = 그리드에 있는 연결펀드 */
export interface CrmWorkDetailSaveReq {
  workDetailId: number;
  contactId: number;
  workDate: string;
  workName: string;
  workContent: string | null;
  privateYn: boolean;
  fundIds: number[];
}

/** 공유지정 한 줄 (AS-IS Crm14_ShareDefaultModel · Crm15_ShareModel, EE86·EE87). 새로 더한 줄은 shareId가 0 이하(임시) */
export interface CrmShare {
  shareId: number;
  shareCode?: string | null;
  shareName?: string | null;
  personId?: number | null;
  personName?: string | null;
  orgId?: number | null;
  orgName?: string | null;
}
