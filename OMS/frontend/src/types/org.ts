/** 기준일 조직 (GET /api/v1/org/org-infos, AS-IS Org00_OrgInfoModel) */
export interface OrgInfo {
  orgCodeId: number;
  orgCd: string;
  korNm: string;
  parentCodeId: number | null;
  /** 상위 조직 전체 이름 */
  parentFullNm: string | null;
  levelCd: string | null;
}

/** 기준일 조직 트리 행 (GET /api/v1/org/codes, 깊이 우선). 일자는 yyyy-MM-dd */
export interface OrgCode {
  codeId: number;
  /** 기준일에 유효한 이력 */
  infoId: number;
  parentCodeId: number;
  /** 최상위 = 0 */
  level: number;
  orgCd: string;
  korNm: string;
  engNm: string | null;
  levelCd: string | null;
  levelNm: string | null;
  /** 조직 장 */
  orgHeadList: string | null;
  sortOrder: string | null;
  modDate: string | null;
  modReason: string | null;
  openDate: string | null;
  openReason: string | null;
  closeDate: string | null;
  closeReason: string | null;
  /** 주요업무/비고 */
  note: string | null;
}

/** 조직 등록·수정 요청 */
export type OrgCodeSave = Pick<OrgCode, 'parentCodeId' | 'orgCd' | 'korNm' | 'engNm' | 'levelCd' | 'sortOrder' | 'modDate' | 'modReason'
  | 'openDate' | 'openReason' | 'closeDate' | 'closeReason' | 'note'> & { infoId: number | null };

/** 조직정보 이력 (GET /api/v1/org/codes/{codeId}/histories) */
export interface OrgHistory {
  infoId: number;
  codeId: number;
  parentCodeId: number;
  modDate: string;
  modReason: string | null;
  korNm: string;
  engNm: string | null;
  levelCd: string | null;
  levelNm: string | null;
  sortOrder: string | null;
  note: string | null;
}
