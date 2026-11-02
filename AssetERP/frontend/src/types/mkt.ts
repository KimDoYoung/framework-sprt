/** Y12 업무활동처 및 이익제공처 조회창(Mkt01_Lookup_Select) 한 행 — 활동처 + 담당자 한 줄 */
export interface MktSelect {
  targetCompanyId: number;
  managerId: number | null;
  targetCompanyName: string | null;
  managerName: string | null;
  managerPosName: string | null;
  managerOrgName: string | null;
  managerTel: string | null;
}

/** 업무활동처(거래상대방) 조회창 한 행 (AS-IS Mkt01_TargetCompanyModel 중 조회창이 쓰는 열). 회사별(cmp)은 담당자 열이 null */
export interface MktTarget {
  targetCompanyId: number;
  managerId: number | null;
  targetCompanyName: string | null;
  managerName: string | null;
  managerOrgName: string | null;
}

/** Z05 활동처 구분 한 줄 (AS-IS sys.Sys09_Code.selectByCode CrmItemTypeCode) — `%`는 전체보기 */
export interface MktItemType {
  code: string;
  name: string;
}

/** Z05 업무활동처 (AS-IS Mkt01_TargetCompanyModel) */
export interface MktTargetCompany {
  targetCompanyId: number;
  itemTypeCode: string | null;
  targetCompanyName: string | null;
  addr: string | null;
  tel: string | null;
  note: string | null;
  unuseYn: boolean | null;
  itemTypeName: string | null;
  managerInfo: string | null;
  shareInfo: string | null;
}

/** PUT mkt/target-companies 본문 (AS-IS Mkt01_TargetCompany.updateOne) */
export type MktTargetCompanySave = Pick<MktTargetCompany, 'targetCompanyId' | 'itemTypeCode' | 'targetCompanyName' | 'addr' | 'tel' | 'note' | 'unuseYn'>;

/** Z05 즐겨찾기 한 줄 (AS-IS selectFavoritePaging) */
export interface MktFavorite {
  favoriteId: number;
  targetCompanyId: number;
  targetCompanyName: string | null;
  managerName: string | null;
  managerPosName: string | null;
  managerOrgName: string | null;
}

/** Z05 활동처 담당자 (AS-IS Mkt02_ManagerModel) — 새 행은 managerId가 0 이하 */
export interface MktManager {
  managerId: number;
  targetCompanyId: number;
  managerName: string | null;
  orgName: string | null;
  posName: string | null;
  tel: string | null;
  emailAddr: string | null;
  note: string | null;
  retireInfo: string | null;
}

/** Z05 업무활동내역 (AS-IS Mkt03_HistoryModel) */
export interface MktHistory {
  historyId: number;
  personId: number;
  regDate: string | null;
  targetCompanyId: number;
  targetCompanyName: string | null;
  activityDate: string | null;
  activityTitle: string | null;
  activityContent: string | null;
  personOrgName: string | null;
  fileCount: string | null;
  fundInfo: string | null;
  shareInfo: string | null;
}

/** PUT mkt/histories 본문 (AS-IS Mkt03_History.updateOne + Mkt04_RelateFund.updateByList) */
export interface MktHistorySave {
  historyId: number;
  targetCompanyId: number;
  activityDate: string | null;
  activityTitle: string | null;
  activityContent: string | null;
  fundIds: number[];
}

/** 업무활동내역 연결펀드 (AS-IS Mkt04_RelateFundModel) — 새 행은 relateFundId가 0 이하 */
export interface MktRelateFund {
  relateFundId: number;
  historyId: number;
  fundId: number;
  fundCode: string | null;
  fundName: string | null;
}

/** Z05 공유지정 (AS-IS Mkt05_ShareModel) — shareCode 1 사원 / 2 부서, 새 행은 shareId가 0 이하 */
export interface MktShare {
  shareId: number;
  parentId: number;
  shareCode: string;
  personId: number | null;
  orgId: number | null;
  shareName: string | null;
  personName: string | null;
  orgName: string | null;
}
