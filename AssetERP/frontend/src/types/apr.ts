/** 인감 한 행 (AS-IS Apr10_StampModel — Apr10_Lookup_DocStamp 그리드) */
export interface AprStamp {
  stampId: number;
  /** 이미지 URL용 문자열 ID */
  stampIdString: string;
  stampName?: string | null;
  useName?: string | null;
  orgName?: string | null;
}

/** 결재선 지정그룹 (AS-IS Apr30_ApprStepGroupModel) */
export interface AprApprStepGroup {
  apprStepGroupId: number;
  apprStepGroupName?: string | null;
  note?: string | null;
}

/** 문서작성 목록 한 행 (AS-IS Apr01_ApprModel 중 Dcr01_Tab_DcrWrite 그리드 열) */
export interface AprDcrWrite {
  apprId: number;
  /** 'true' | 'false' */
  bookmarkYn: string;
  regDate?: string | null;
  effectDate?: string | null;
  regEmpName?: string | null;
  classTreeName?: string | null;
  /** HTML이 섞여 있을 수 있다(폐기 표시 등) — gb.textHtml로 그린다 */
  title?: string | null;
  receiveName?: string | null;
  relateDisplayName?: string | null;
  /** `<b style=color:…;>상태</b>` */
  statusNameBold?: string | null;
  note?: string | null;
}

export interface AprDcrWriteParams {
  startDate: string;
  closeDate: string;
  searchText: string;
  receiveName: string;
  classTreeId?: number | null;
  offset: number;
  limit: number;
}

/** 업무별 문서작성 문서 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Grid_DocList 그리드 열, F02) */
export interface AprDoc {
  apprId: number;
  /** 'true' | 'false' */
  bookmarkYn: string;
  title?: string | null;
  /** 연관 펀드·일임 건수 ("2건", 없으면 '') */
  relateDisplayName?: string | null;
  /** `<b style=color:…;>상태</b>` */
  statusName?: string | null;
  /** '30'이 완료 */
  statusCode?: string | null;
  regDate?: string | null;
  effectDate?: string | null;
  regEmpName?: string | null;
}

/** 통합 문서검색 목록 한 행 (AS-IS Apr01_ApprModel 중 Dcr00_Tab_DocList 그리드 열, F05) */
export interface AprDocSearch {
  apprId: number;
  /** 'true' | 'false' */
  bookmarkYn: string;
  regDate?: string | null;
  regEmpName?: string | null;
  /** `<b style=color:…;>상태</b>` */
  statusName?: string | null;
  title?: string | null;
  inOutTypeName?: string | null;
  classTreeName?: string | null;
  receiveName?: string | null;
  stampSeq?: string | null;
  /** 연관 펀드·일임 건수 ("2건", 없으면 '') */
  relateDisplayName?: string | null;
  note?: string | null;
}

/** 연관펀드 (AS-IS Apr03_RelateFundModel, Apr03_TabPage_Relate) */
export interface AprRelateFund {
  fundId: number;
  fundName?: string | null;
}

/** 연관일임 (AS-IS Apr12_RelateAdvModel, Apr03_TabPage_Relate) */
export interface AprRelateAdv {
  advId: number;
  manageName?: string | null;
}

/** 법규별 문서작성 목록 한 행 (AS-IS Apr03_RelateFundModel 중 Ics01_Grid_ApprList가 쓰는 열). relateFundId는 연관펀드가 없으면 상신문서 id */
export interface AprIcsDoc {
  relateFundId: number;
  apprId: number;
  regDate?: string | null;
  effectDate?: string | null;
  regEmpName?: string | null;
  title?: string | null;
}

/** 폐기문서 신청현황 한 행 (AS-IS Apr90_DisposalListModel 중 Apr90_Tab_DisposalList가 쓰는 열) */
export interface AprDisposalList {
  disposalListId: number;
  apprId?: number | null;
  regDate?: string | null;
  title?: string | null;
  statusName?: string | null;
  reason?: string | null;
  confirmYn?: boolean | null;
  confirmEmpName?: string | null;
  confirmDate?: string | null;
}

/** 펀드별 문서검색 문서 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Grid_FundDocList가 쓰는 열) */
export interface AprFundDoc {
  apprId: number;
  regDate?: string | null;
  effectDate?: string | null;
  classTreeNameAllPath?: string | null;
  title?: string | null;
  receiveName?: string | null;
  fileName?: string | null;
}

/** 종목별 문서검색 문서 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Grid_ItemDocList가 쓰는 열) */
export interface AprItemDoc {
  apprId: number;
  regDate?: string | null;
  effectDate?: string | null;
  classTreeNameAllPath?: string | null;
  title?: string | null;
  note?: string | null;
  fileName?: string | null;
}

/** 다운로드 기록 한 행 (AS-IS Apr40_DownloadHistoryModel 중 Apr40_Lookup_DownloadHistory 그리드 열, F09) */
export interface AprDownloadHistory {
  downloadHistoryId: number;
  apprId: number;
  regDateString?: string | null;
  title?: string | null;
  personName?: string | null;
}
