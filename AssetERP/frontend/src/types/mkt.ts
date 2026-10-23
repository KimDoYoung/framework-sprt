/** 업무활동처(거래상대방) 조회창 한 행 (AS-IS Mkt01_TargetCompanyModel 중 조회창이 쓰는 열). 회사별(cmp)은 담당자 열이 null */
export interface MktTarget {
  targetCompanyId: number;
  managerId: number | null;
  targetCompanyName: string | null;
  managerName: string | null;
  managerOrgName: string | null;
}
