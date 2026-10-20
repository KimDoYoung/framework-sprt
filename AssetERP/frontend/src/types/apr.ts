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

/** 폐기문서 승인 한 행 (AS-IS Apr90_DisposalListModel 중 Apr90_Tab_DisposalAppr가 쓰는 열) */
export interface AprDisposalAppr {
  disposalListId: number;
  apprId?: number | null;
  disposalCode?: string | null;
  disposalName?: string | null;
  regDate?: string | null;
  regEmpName?: string | null;
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

/** 상신내역 조회 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_MyRequestList 그리드 열, G02). title은 HTML(폐기 문서는 빨간 [폐기]) */
export interface AprMyRequest {
  apprId: number;
  /** 완료 '30' 만 [신청]·[메일보내기] 가능 */
  statusCode?: string | null;
  regDate?: string | null;
  effectDate?: string | null;
  statusName?: string | null;
  classTreeName?: string | null;
  inOutTypeName?: string | null;
  title?: string | null;
  preconfirmStatusName?: string | null;
  /** '있음' 또는 '' */
  preconfirmMsgYnStr?: string | null;
  /** '송신' 또는 '' */
  mailYn?: string | null;
  recentApprovalName?: string | null;
  recentApprovalDate?: string | null;
  note?: string | null;
}

/** 결재내역 조회 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_MyApproveList 그리드 열, G01). title은 HTML(폐기 문서는 빨간 [폐기]) */
export interface AprMyApprove {
  apprId: number;
  /** 화면에서만 붙이는 행 키 — AS-IS SQL이 같은 문서를 결재 단계마다 한 행씩 돌려줘 apprId가 겹칠 수 있다(대결·여러 단계) */
  rowKey?: string;
  /** 완료 '30' 만 [메일보내기] 가능 */
  statusCode?: string | null;
  statusName?: string | null;
  regDate?: string | null;
  inOutTypeName?: string | null;
  title?: string | null;
  regEmpName?: string | null;
  nextApprName?: string | null;
  effectDate?: string | null;
  classTreeName?: string | null;
  /** '송신' 또는 '' */
  mailYn?: string | null;
  myApprovalDate?: string | null;
  finalApprovalDate?: string | null;
  note?: string | null;
}

/** 참조내역 조회 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_MyReferenceList 그리드 열, G03). title은 HTML(폐기 문서는 빨간 [폐기]) */
export interface AprMyReference {
  apprId: number;
  /** 화면에서만 붙이는 행 키 — AS-IS SQL이 같은 문서를 한 행 이상 돌려줄 수 있다 */
  rowKey?: string;
  /** 완료 '30' 만 [메일보내기] 가능 */
  statusCode?: string | null;
  regDate?: string | null;
  effectDate?: string | null;
  statusName?: string | null;
  classTreeName?: string | null;
  inOutTypeName?: string | null;
  title?: string | null;
  /** '송신' 또는 '' */
  mailYn?: string | null;
  regEmpName?: string | null;
  recentApprovalName?: string | null;
  recentApprovalDate?: string | null;
  note?: string | null;
}

/** 공람내역 조회 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_MyAuthList 그리드 열, G04). title은 HTML(폐기 문서는 빨간 [폐기]) */
export interface AprMyAuth {
  apprId: number;
  /** 화면에서만 붙이는 행 키 — AS-IS SQL이 같은 문서를 결재 단계마다 한 행씩 돌려줘 apprId가 겹친다 */
  rowKey?: string;
  /** 완료 '30' 만 [메일보내기] 가능 */
  statusCode?: string | null;
  regDate?: string | null;
  effectDate?: string | null;
  statusName?: string | null;
  classTreeName?: string | null;
  inOutTypeName?: string | null;
  title?: string | null;
  /** '송신' 또는 '' */
  mailYn?: string | null;
  recentApprovalName?: string | null;
  recentApprovalDate?: string | null;
  note?: string | null;
}

/** 대결자 지정 한 행 (AS-IS Apr07_AltApprModel, G05). 날짜는 'yyyy-MM-dd', stampYn은 'true'/'false' 문자열 */
export interface AprAltAppr {
  altApprId: number;
  targetEmpId?: number | null;
  altEmpId?: number | null;
  altEmpNo?: string | null;
  altEmpName?: string | null;
  altOrgName?: string | null;
  altTitleName?: string | null;
  startDate?: string | null;
  closeDate?: string | null;
  stampYn?: string | null;
  reasonCd?: string | null;
  emgrPoint?: string | null;
}

/** 인감대장 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_StampSeq 그리드 열, G06). title은 HTML(폐기 문서는 빨간 [폐기]). 날짜는 'yyyy-MM-ddTHH:mm:ss' */
export interface AprStampSeq {
  apprId: number;
  stampSeqText?: string | null;
  apprDate?: string | null;
  regEmpName?: string | null;
  apprEmpName?: string | null;
  title?: string | null;
  stampName?: string | null;
  receiveName?: string | null;
  putSealEmpName?: string | null;
  putSealDate?: string | null;
}

/** 인감확인 저장 결과 (AS-IS Apr01_Appr.updatePutSealEmpId) */
export interface AprPutSeal {
  apprId: number;
  putSealEmpName?: string | null;
  putSealDate?: string | null;
}

/** 인감 한 행 (AS-IS Apr10_StampModel — Apr10_Tab_Stamp 그리드, G07). 책임자 이름은 "이름 직책", 날짜는 'yyyy-MM-dd', 논리 값은 'true'/'false' 문자열 */
export interface AprStampManage {
  stampId: number;
  orgId?: number | null;
  orgName?: string | null;
  aprEmpId?: number | null;
  aprEmpName?: string | null;
  secondEmpId?: number | null;
  secondEmpName?: string | null;
  stampName?: string | null;
  startDate?: string | null;
  closeDate?: string | null;
  useName?: string | null;
  /** 이미지 URL용 문자열 ID */
  stampIdString?: string | null;
  corpStampYn?: string | null;
  stepUseYn?: string | null;
  allUseYn?: string | null;
  /** 사용가능 부서 요약 ('', '부서', '부서 외 n건') */
  roleName?: string | null;
  /** 미사용 문서분류 건수 ('n건') */
  stampAuthCntStr?: string | null;
  note?: string | null;
}

/** 추가 대표명의 한 행 (AS-IS Apr15_ReprCorpModel — Apr15_Tab_ReprCorp 그리드, G08). 논리 값은 'true'/'false' 문자열 */
export interface AprReprCorp {
  reprCorpId: number;
  /** 구분 코드 (ReprCorpType: 10 PEF / 20 리츠) */
  corpType?: string | null;
  corpTypeName?: string | null;
  corpName?: string | null;
  reprName?: string | null;
  corpRegYn?: string | null;
  stampId?: number | null;
  stampName?: string | null;
  note?: string | null;
  useYn?: string | null;
}
