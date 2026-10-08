// ── C02 조직정보 등록 (Org01_Tab_OrgCode) ──

/** 조직 트리 행 (GET /api/v1/org/org-codes, AS-IS Org01_CodeModel + orgInfoModel). 날짜는 'yyyy-MM-dd' */
export interface OrgCode {
  codeId: number;
  parentCodeId: number;
  infoId: number;
  orgCd?: string | null;
  korNm?: string | null;
  levelCd?: string | null;
  levelNm?: string | null;
  orgHeadList?: string | null;
  sortOrder?: string | null;
  modDate?: string | null;
  modReason?: string | null;
  openDate?: string | null;
  openReason?: string | null;
  closeDate?: string | null;
  closeReason?: string | null;
  engNm?: string | null;
  note?: string | null;
  dcrIdWord?: string | null;
  /** treelevel (1 = 최상위) */
  depth?: number | null;
}

/** 조직정보 이력 행 (GET /api/v1/org/org-codes/{codeId}/infos, AS-IS Org02_InfoModel) */
export interface OrgInfoHist {
  infoId: number;
  codeId: number;
  parentCodeId: number;
  korNm?: string | null;
  modDate?: string | null;
  modReason?: string | null;
  levelCd?: string | null;
  levelNm?: string | null;
  sortOrder?: string | null;
  engNm?: string | null;
  note?: string | null;
  dcrIdWord?: string | null;
}

/** 조직 저장 (POST·PUT /api/v1/org/org-codes, AS-IS Org01_Code.update 1건). baseDate = 저장 뒤 다시 읽을 기준일 */
export interface OrgCodeSaveReq {
  codeId?: number | null;
  orgCd?: string | null;
  openDate?: string | null;
  openReason?: string | null;
  closeDate?: string | null;
  closeReason?: string | null;
  infoId?: number | null;
  korNm?: string | null;
  modDate?: string | null;
  modReason?: string | null;
  parentCodeId: number;
  levelCd?: string | null;
  sortOrder?: string | null;
  note?: string | null;
  dcrIdWord?: string | null;
  baseDate: string;
}
