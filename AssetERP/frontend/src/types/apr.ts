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

/** 불러오기 창 문서 목록 한 행 (AS-IS Apr03_RelateFundModel 중 Apr05_Grid_RelateAprList 열 + 미리보기 apprModel.content, W05 ⓒ) */
export interface AprLoadDoc {
  apprId: number;
  /** `<b style=color:…;>상태</b>` */
  statusName?: string | null;
  title?: string | null;
  /** 이 SQL에는 펀드 열이 없어 늘 빈 값(AS-IS도 같다) */
  fundName?: string | null;
  regDate?: string | null;
  effectDate?: string | null;
  regEmpName?: string | null;
  /** 미리보기 HTML (apr01_content) */
  content?: string | null;
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

/** 이익제공 사전승인신청 목록 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_BizPriorApproval 그리드 열, L06) */
export interface AprPreProvide {
  apprId: number;
  regDate?: string | null;
  effectDate?: string | null;
  classTreeNameAllPath?: string | null;
  title?: string | null;
  statusName?: string | null;
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

/** 운영현황표 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_TotalList 그리드 열, G16). apprId는 SQL의 행번호(행 키) */
export interface AprTotalList {
  apprId: number;
  aprOrgName?: string | null;
  aprPersonName?: string | null;
  genCnt: number;
  icsCnt: number;
  totalCnt: number;
  procGenCnt: number;
  procIcsCnt: number;
  procTotalCnt: number;
  unProcGenCnt: number;
  unProcIcsCnt: number;
  unProcTotalCnt: number;
}

/** 건별명세 한 행 (AS-IS Apr01_ApprModel 중 Apr01_Tab_SubList 그리드 열, G17). effectDate는 시행일 */
export interface AprSubList {
  apprId: number;
  effectDate?: string | null;
  docTypeName?: string | null;
  classTreeNameAllPath?: string | null;
  title?: string | null;
  aprOrgName?: string | null;
  aprPersonName?: string | null;
  statusName?: string | null;
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

/** T23 AS-IS Apr16_StampDocModel — 법인서류 매수관리 그리드 한 행 (selectDocByRegDate) */
export interface AprStampDoc {
  stampDocId: number;
  companyId?: number | null;
  regDate?: string | null;
  applType?: string | null;
  applTypeName?: string | null;
  stampId?: number | null;
  reprCorpId?: number | null;
  stampReprCorpName?: string | null;
  docIssueQty?: number | null;
  docApplQty?: number | null;
  docUseQty?: number | null;
  provideCo?: string | null;
  purpose?: string | null;
  requester?: string | null;
  note?: string | null;
  applDate?: string | null;
  applEmpName?: string | null;
  apprId?: number | null;
  apprName?: string | null;
  apprStatusName?: string | null;
}

/** T24·T25 AS-IS Apr16_StampDocModel — 인감날인대장 한 행 (selectStampByCompanyId). stampDocId는 행번호 키, realStampDocId가 실제 신청 ID(대외문서는 null) */
export interface AprStampList {
  stampDocId: number;
  applDate?: string | null;
  applEmpName?: string | null;
  stampName?: string | null;
  stampQty?: number | null;
  stampOutYn?: string | null;
  provideCo?: string | null;
  purpose?: string | null;
  note?: string | null;
  apprStatusName?: string | null;
  stampSeq?: string | null;
  stampDate?: string | null;
  apprId?: number | null;
  realStampDocId?: number | null;
}

/** T26 AS-IS Apr16_StampDocModel — 인감날인본 업로드확인 한 행 (selectStampCheck) */
export interface AprStampCheck {
  stampDocId: number;
  applDate?: string | null;
  applEmpName?: string | null;
  stampName?: string | null;
  stampQty?: number | null;
  provideCo?: string | null;
  purpose?: string | null;
  apprId?: number | null;
  apprStatusName?: string | null;
  stampDate?: string | null;
  stampFileChk?: string | null;
  confirmDate?: string | null;
  confirmerId?: number | null;
  confirmerName?: string | null;
}

/** 위쪽 합계 그리드 (selectDocGroupSum) */
export interface AprStampDocSum {
  stampDocId: number;
  applTypeName?: string | null;
  stampReprCorpName?: string | null;
  docIssueQty?: number | null;
  docUseQty?: number | null;
  docRemainQty?: number | null;
}

/** 신청내역 가져오기 창 (selectApplDocByRegDateIsNull) */
export interface AprStampDocAppl {
  stampDocId: number;
  applDate?: string | null;
  applEmpName?: string | null;
  provideCo?: string | null;
  purpose?: string | null;
  applType?: string | null;
  applTypeName?: string | null;
  stampReprCorpName?: string | null;
  docApplQty?: number | null;
}

/** 인감 및 대표명의 선택 창 (selectByApplType). stampDocId는 ROW_NUMBER */
export interface AprStampDocLookup {
  stampDocId: number;
  applTypeName?: string | null;
  applType?: string | null;
  stampReprCorpName?: string | null;
  stampId?: number | null;
  reprCorpId?: number | null;
}

/** 저장 — 매수관리 그리드의 발급·사용매수와 등록 창 입력값. stampDocId가 0 이하면 새 행 */
export interface AprStampDocSaveReq {
  stampDocId: number;
  regDate?: string | null;
  applType?: string | null;
  stampId?: number | null;
  reprCorpId?: number | null;
  docIssueQty?: number | null;
  docUseQty?: number | null;
  provideCo?: string | null;
  purpose?: string | null;
  note?: string | null;
  apprId?: number | null;
}

/** 대표명의 선택 창 (Apr15_Lookup_ReprCorp) */
export interface AprReprCorpLookup {
  reprCorpId: number;
  corpTypeName?: string | null;
  corpName?: string | null;
  reprName?: string | null;
  /** 대표명의에 지정된 인감 — 문서창 [대표회사]를 고르면 인감종류도 채운다 (V12) */
  stampId?: number | null;
}

/** 기본 법인인감 (selectCorpStampYn) */
export interface AprCorpStamp {
  stampId: number;
  stampName: string;
}

/** 전자결재 문서 열기 (AS-IS Apr01_ApprModel 중 Apr01_Edit_ApprDoc 편집기 열, V01) */
export interface AprApprDetail {
  apprId: number;
  companyId: number;
  classTreeId: number;
  /** 루트부터 '/'로 이은 문서분류 이름 (창 제목) */
  classTreeFullName?: string | null;
  printFundYn?: string | null;
  title?: string | null;
  /** '10' 대외문서 · '20' 사내문서 */
  inOutTypeCode?: string | null;
  content?: string | null;
  regDate: string;
  effectDate?: string | null;
  /** '10' 상신 · '20' 진행 · '30' 완료 · '40' 반려 · '99' 임시저장 */
  statusCode: string;
  regEmpId: number;
  regEmpName?: string | null;
  stampId?: number | null;
  stampName?: string | null;
  stampPosition?: string | null;
  stampPositionName?: string | null;
  receiveName?: string | null;
  referenceName?: string | null;
  signCompany?: string | null;
  signCeo?: string | null;
  note?: string | null;
  linkCode?: string | null;
  advertYn?: string | null;
}

/** 결재선 한 줄 (AS-IS Apr04_ApprStepModel, V01) */
export interface AprApprStep {
  apprStepId: number;
  /** 결재단계 순서 (문자열 숫자) */
  seq?: string | null;
  stepTypeCode: string;
  stepTypeName?: string | null;
  stepStatusCode?: string | null;
  stepStatusName?: string | null;
  apprDate?: string | null;
  /** `<b>정) </b>직책 성명(조직)` 같은 HTML — 서버가 만든다 */
  stepApprName?: string | null;
  opinionYnStr?: string | null;
  typoYnStr?: string | null;
  note?: string | null;
  rejectReason?: string | null;
  stepEmpId: number;
  apprEmpId?: number | null;
  /** 결재선 설정 창의 칸 (V07) */
  titleName?: string | null;
  empKorName?: string | null;
  orgKorName?: string | null;
  lockYn?: boolean;
  /** 이 줄을 결재선에 넣은 사원 — 결재선 수정(V08)에서 내가 넣은 줄만 지울 수 있다 */
  addEmpId?: number | null;
}

/** 연관문서 탭 한 줄 (AS-IS Apr21_RelateApprModel, V01) */
export interface AprRelateAppr {
  relateApprId: number;
  targetApprId: number;
  inOutTypeCode?: string | null;
  inOutTypeName?: string | null;
  targetRegDate?: string | null;
  targetTitle?: string | null;
}

/** 연관법규·연관내규 탭 한 줄 (AS-IS Apr20_RelateIcsModel·Apr22_RelateIcrModel, V01) */
export interface AprRelateLaw {
  relateId: number;
  classTreeId: number;
  classTreeFullName?: string | null;
  cycleName?: string | null;
  closeDate?: string | null;
  /** V13: 편집 모드에서 [저장]에 다시 보내는 값 */
  deadlineId?: number | null;
  standCode?: string | null;
  standDate?: string | null;
  standYn?: string | null;
}

/** 날인신청 탭 한 줄 (AS-IS Apr16_Grid_StampApplList, V01) */
export interface AprApprStampAppl {
  stampDocId: number;
  applTypeName?: string | null;
  stampReprCorpName?: string | null;
  applQty?: number | null;
  stampOutYn?: string | null;
}

/** 첨부파일 탭 한 줄 (AS-IS Sys10_FileModel 중 Apr01_Grid_ApprFile 열, V01) */
export interface AprApprFile {
  fileId: number;
  fileName: string;
  fileExt?: string | null;
  /** 'true'면 확정문서 */
  fileYn?: string | null;
  printYn?: string | null;
}

/** 연관펀드 탭 한 줄 (AS-IS Apr03_RelateFundModel 중 buildRelateFundGrid 열, V01) */
export interface AprApprFund {
  relateFundId: number;
  fundTypeName?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
  afterYn?: string | null;
  printYn?: string | null;
  /** V13: 편집 모드에서 [저장]에 다시 보내는 펀드 ID */
  fundId?: number;
}

/** 연관일임 탭 한 줄 (AS-IS Apr12_RelateAdvModel 중 buildRelateAdvGrid 열, V01) */
export interface AprApprAdv {
  relateAdvId: number;
  manageCode?: string | null;
  manageName?: string | null;
  /** V13: 편집 모드에서 [저장]에 다시 보내는 일임계좌 ID */
  advId?: number;
}

/** 문서를 연 사원에게 켜질 결재 처리 단추 (AS-IS myTurnCheck·myCancelApprovalCheck·retrieveApproval, V02) */
export interface AprApprActionState {
  canConfirm: boolean;
  canCancelApproval: boolean;
  canCancelRequest: boolean;
  /** [결재선 수정] — 내 차례이고 합의가 아닐 때 (V08) */
  canRetouchSteps: boolean;
  /** [오타수정] — 결재 전·결재중 문서에서 내 차례일 때 (V09) */
  canTypo: boolean;
}

/** 결재 처리 결과 (V02) — ok가 false면 message를 안내로, needConfirm이면 message로 확인을 받고 다시 보낸다 */
export interface AprApprActionRes {
  ok: boolean;
  needConfirm: boolean;
  /** 인감이 있는 완료 문서 — AS-IS는 PDF를 만들었다(V04 전까지 안 만듦) */
  makePdf: boolean;
  message?: string | null;
  notice?: string | null;
}

/** 새 문서 열기의 기본 결재선 한 줄 (Apr04_ApprStep.createApprovalTypeCd, V06) */
export interface AprNewStep {
  apprStepId: number;
  seq?: string | null;
  stepTypeCode: string;
  stepTypeName?: string | null;
  stepStatusCode?: string | null;
  stepStatusName?: string | null;
  stepEmpId: number;
  apprEmpId?: number | null;
  /** 이름 문구 — 대결이면 HTML */
  stepApprName?: string | null;
  lockYn: boolean;
  titleName?: string | null;
  empKorName?: string | null;
  orgKorName?: string | null;
}

/** 인감을 고른 뒤의 결재선 (GET apr/apprs/stamp-line, V12) — ok가 false면 인감을 쓸 수 없는 경우(message), outType은 대외문서로 바꿔야 하는 경우 */
export interface AprStampLine {
  ok: boolean;
  message?: string | null;
  stampId?: number | null;
  stampName?: string | null;
  stampIdString?: string | null;
  outType: boolean;
  steps: AprNewStep[];
}

/** 새 문서에 따라오는 연관법규·내규 한 줄 (V06) */
export interface AprNewLaw {
  relateId: number;
  classTreeId: number;
  classTreeName?: string | null;
  classTreeFullName?: string | null;
  content?: string | null;
  submitTo?: string | null;
  relatedLaw?: string | null;
  cycleName?: string | null;
  deadlineId?: number | null;
  deadlineFullName?: string | null;
  deadlineNote?: string | null;
}

/** 다른 화면이 링크코드로 결재창을 여는 값 (AS-IS insertLinkApproval(classTreeModel, linkCode, gridDataModel, …), V17) — refId = 그 화면 행의 번호 */
export interface AprLinkOpen {
  classTreeId: number;
  linkCode: string;
  refId?: number | null;
  /** 행 번호 하나로 모자란 코드가 더 넘기는 값 — 호출 화면의 입력칸(기준일자 stdDate·체크주기 cycleType·기준년도 yyyy·월/분기 코드 mm·월/분기 이름 cycleName, V19) */
  args?: AprLinkArgs;
}

export interface AprLinkArgs {
  stdDate?: string;
  cycleType?: string;
  yyyy?: string;
  mm?: string;
  cycleName?: string;
  /** 여러 행을 한 문서로 묶는 코드의 행 ID 쉼표 목록 — A77 기준가 정정 월보고(AS-IS linkParam.gridList, V20) */
  ids?: string;
  /** A43 여비교통비 관리 — 기준년월(yyyy.MM)과 계정과목 이름(호출 화면이 읽은 값, V23) */
  yyyymm?: string;
  accountName?: string;
  /** D01 연봉계약 — 계약서 양식이 둘 이상일 때 Pay06_Lookup_LinkContent에서 고른 양식 ID(V26) */
  actMappingId?: string;
  /** A10~A12 이익제공(수령) — 신청서 구분 콤보에 보이는 이름, 제목은 "이름_로그인 사원 이름"(V29) */
  typeName?: string;
  /** A09 자기매매 실거래 보고 — 보고 기준일(yyyy-MM-dd)·보고 기간 이름("3월"·"1분기") (V30) */
  closeDate?: string;
  periodString?: string;
  /** B05 계좌개설 신고 — 보고주기 코드(V30) */
  checkCycle?: string;
  /** A94 책무이행점검보고서 — 이행점검 탭의 보고CEO 직책 ID(tdm20_role_id), 제목의 직책 이름과 본문 현황의 기준(V34) */
  roleId?: string;
  /** A15 미사용휴가 지정통보서 — 화면의 해당 연도(V36). A70·A71 인사평가 보고 — 평가년도(V37) */
  stdYear?: string;
  /** A70·A71 인사평가 보고 — 평가기간 코드(반기별 회사가 아니면 10, V37) */
  stdTermCode?: string;
  /** A42 여비교통비 신청서 — 신청번호·기준년월(V36) */
  regNo?: string;
  regDate?: string;
  /** A13 법인카드 내역관리 — 기준년월(yyyy.MM, V38). 마감일은 closeDate */
  dataYm?: string;
  /** A46~A51 복리후생비 지출결의 — 신청구분 콤보 이름과 구분 코드(계정과목 이름을 읽음, V40). 행은 ids, 기준년월은 yyyy·mm */
  benefitName?: string;
  benefitCode?: string;
}

/** 링크코드별 제목·본문·시행일자 (GET apr/apprs/link-seed, V17) */
/** 결재문서 번호 목록으로 읽은 문서 한 줄 (AS-IS apr.Apr01_Appr.selectByApprIdList — Apr01_Lookup_ApprLink, V34) */
export interface AprApprIdRow {
  apprId: number;
  regDate: string | null;
  title: string | null;
  statusCode: string | null;
  statusName: string | null;
}

export interface AprLinkSeed {
  linkCode: string;
  title?: string | null;
  content?: string | null;
  effectDate: string;
  titleReadOnly: boolean;
  saveVisible: boolean;
  /** 증명서(B01~B04)는 대외문서라 수신·참조를 "-"로 채운다 (V22) */
  receiveName?: string | null;
  referenceName?: string | null;
  /** 문서구분을 고정하는 코드(A93 책무매뉴얼 보고 = '20' 사내문서, V21) */
  inOutTypeCode?: string | null;
  /** 문서를 열자마자 연관문서 탭에 넣을 문서(A43 여비교통비 관리 — insertRelateApprList, V23) */
  relateApprs?: AprLinkRelateAppr[] | null;
  /** 공모주(A26·A38)의 연관펀드·연관일임 자동등록 (insertRelateFundList, V38) */
  relateFunds?: AprLinkRelateFund[] | null;
  relateAdvs?: AprLinkRelateAdv[] | null;
}

export interface AprLinkRelateFund {
  fundId: number;
  fundTypeName?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
}

export interface AprLinkRelateAdv {
  advId: number;
  manageCode?: string | null;
  manageName?: string | null;
}

export interface AprLinkRelateAppr {
  targetApprId: number;
  regDate?: string | null;
  title?: string | null;
  inOutTypeCode?: string | null;
}

/** 새 문서 열기 (GET apr/apprs/new, V06) */
export interface AprApprNew {
  apprId: number;
  classTreeId: number;
  classTreeFullName?: string | null;
  printFundYn?: string | null;
  sealCode?: string | null;
  title?: string | null;
  content?: string | null;
  regDate: string;
  signCompany?: string | null;
  signCeo?: string | null;
  statusCode: string;
  regEmpId: number;
  regEmpName?: string | null;
  steps: AprNewStep[];
  relateIcs: AprNewLaw[];
  relateIcr: AprNewLaw[];
}

/** [저장]·[결재요청]의 결재선 한 줄 (V03) */
export interface AprApprSaveStep {
  apprStepId?: number | null;
  stepTypeCode: string;
  seq: string;
  stepStatusCode?: string | null;
  stepEmpId: number;
  lockYn?: string | null;
  addEmpId?: number | null;
}

/** [저장]·[결재요청] (PUT apr/apprs/{id}, V03) */
export interface AprApprSaveReq {
  mode: 'save' | 'request';
  classTreeId?: number | null;
  linkCode?: string | null;
  title?: string | null;
  content?: string | null;
  note?: string | null;
  effectDate?: string | null;
  regDate?: string | null;
  stampId?: number | null;
  receiveName?: string | null;
  referenceName?: string | null;
  inOutTypeCode?: string | null;
  signCompany?: string | null;
  signCeo?: string | null;
  stampPosition?: string | null;
  formType?: string | null;
  message?: string | null;
  confirmed: boolean;
  steps: AprApprSaveStep[];
  /** V13: 연관 탭 다섯 개의 화면 내용 전체(없으면 서버가 연관 테이블을 건드리지 않는다) */
  relates?: AprApprRelateReq;
}

/** [저장]·[결재요청]에 함께 보내는 연관 탭 다섯 개 (V13, AS-IS Apr03_Page_Relate.getRelate*List) */
export interface AprApprRelateReq {
  funds?: { relateFundId: number | null; fundId: number; printYn: string | null; afterYn: string | null }[];
  advs?: { relateAdvId: number | null; advId: number }[];
  apprs?: { relateApprId: number | null; targetApprId: number }[];
  ics?: AprRelateLawSave[];
  icr?: AprRelateLawSave[];
  /** V14: 날인신청 탭의 제공처·제공목적·비고 (줄은 [+]·[-]가 그 자리에서 넣고 지운다) */
  stampDoc?: { provideCo: string | null; purpose: string | null; note: string | null };
}

/** 날인신청 탭 편집 (GET apr/apprs/{id}/stamp-docs, V14) — locked는 이미 결재한 사람이 있어 [+]·[-]가 꺼지는 경우 */
export interface AprStampApplEdit {
  rows: AprApprStampAppl[];
  meta: { provideCo: string | null; purpose: string | null; note: string | null };
  locked: boolean;
}

/** 날인신청 한 줄 더하기 (POST …/stamp-docs) — applType 1 법인인감증명서 / 2 법인등기부등본 / 3 인감날인 */
export interface AprStampApplAddReq {
  applType: string;
  stampReprCorpId: number;
  qty: number;
  outYn?: boolean;
}

export interface AprRelateLawSave {
  relateId: number | null;
  classTreeId: number;
  deadlineId: number | null;
  standCode: string | null;
  standDate: string | null;
  closeDate: string | null;
  standYn: string | null;
}

export interface AprApprWriteRes {
  ok: boolean;
  message?: string | null;
  apprId?: number | null;
  statusCode?: string | null;
  makePdf: boolean;
  /** 'confirm'이면 message를 확인 창으로 묻고 confirmed=true로 다시 보낸다 */
  notice?: string | null;
}

/** 결재선 설정 창의 사원 조회 한 줄 (V07) */
export interface AprStepEmp {
  personId: number;
  orgCodeId: number;
  orgKorName?: string | null;
  titleName?: string | null;
  titleName2?: string | null;
  empKorName?: string | null;
}

/** 최근 결재선 불러오기 창의 문서 한 줄 (apr01_appr.selectByWeek·selectByDcrGroup, V08) */
export interface AprRecentDoc {
  apprId: number;
  statusName?: string | null;
  regDate?: string | null;
  classTreeNameAllpath?: string | null;
  title?: string | null;
}

/** 열람기록 한 줄 (GET apr/apprs/{id}/open-histories, AS-IS Apr41_OpenHistoryModel) */
export interface AprOpenHistory {
  openHistoryId: number;
  openDateStr: string;
  orgName: string | null;
  personName: string | null;
  loginModeName: string | null;
}

/** 댓글 한 줄 (GET apr/apprs/{id}/comments, AS-IS Apr42_CommentModel). commentFullStr는 HTML 머리, deleteStr은 내가 쓴 글이면 ✕ */
export interface AprComment {
  commentId: number;
  personId: number;
  comment: string;
  commentFullStr: string;
  fileStr: string;
  deleteStr: string;
}

/** 댓글 창 [알림발송]이 문자 발송 창에 넘기는 값 (GET apr/apprs/{id}/comment-notice) */
export interface AprCommentNotice {
  personIds: number[];
  message: string;
}

/** 오타수정 기록 — 수정자가 처음 고치기 전의 문서 내용 + 변경사유 (GET apr/apprs/{id}/typo, AS-IS Apr92_ApprModiModel) */
export interface AprTypo {
  apprModiId: number;
  title: string | null;
  content: string | null;
  receiveName: string | null;
  referenceName: string | null;
  note: string | null;
  reason: string | null;
  signCompany: string | null;
  signCeo: string | null;
}

/** [오타수정] 저장 (PUT apr/apprs/{id}/typo) */
export interface AprTypoSaveReq {
  title: string;
  receiveName: string;
  referenceName: string;
  note: string;
  signCompany: string;
  signCeo: string;
  content: string;
  reason: string;
}

/** 중요표시 한 줄 (GET apr/apprs/{id}/bookmarks) — personId가 없는 줄은 "전체 중요표시" 스위치 줄 (publicYn 'true'/'false') */
export interface AprBookmark {
  bookmarkId: number;
  personId: number | null;
  personInfo: string | null;
  publicYn: string | null;
}

/** 공람 사원 한 줄 (GET apr/apprs/{id}/person-auths) */
export interface AprPersonAuth {
  personAuthId: number;
  personId: number;
  personNo: string | null;
  personName: string | null;
}

/** [문서폐기 신청] 확인 (GET apr/apprs/{id}/disposal-check) — ok가 false면 message를 보여 주고 멈춘다 */
export interface AprDisposalCheck {
  ok: boolean;
  message: string | null;
}

/** 승인자 지정 창의 처음 값 */
export interface AprDisposalConfirmEmp {
  personId: number;
  korName: string;
}

/** 연관법규 한 줄 (GET apr/apprs/{id}/relate-ics-edit, AS-IS Apr20_RelateIcsModel). relateIcsId가 없으면 아직 저장 안 한 새 줄. 날짜는 'yyyy-MM-dd' */
export interface AprRelateIcsRow {
  relateIcsId: number | null;
  classTreeId: number;
  classTreeFullName: string | null;
  content: string | null;
  submitTo: string | null;
  relatedLaw: string | null;
  deadlineId: number | null;
  deadlineFullName: string | null;
  deadlineNote: string | null;
  cycleName: string | null;
  /** 기준코드 10 결재완료일 / 20 발생일 */
  standCode: string | null;
  standDate: string | null;
  closeDate: string | null;
  standYn: string | null;
}

/** 연관법규 저장 (PUT apr/apprs/{id}/relate-ics) */
export interface AprRelateIcsSaveReq {
  rows: { relateIcsId: number | null; classTreeId: number; deadlineId: number | null; standCode: string | null; standDate: string | null; closeDate: string | null }[];
  deleteIds: number[];
}

/** 결재완료후 첨부파일 한 줄 (GET apr/apprs/{id}/after-files) */
/** [연관펀드설정] 창 한 줄 (AS-IS Apr03_RelateFundModel, apr03_relate_fund.selectByAfterYn, V16) */
export interface AprAfterFund {
  relateFundId: number;
  fundId: number;
  fundTypeName?: string | null;
  fundCode?: string | null;
  fundName?: string | null;
  printYn?: string | null;
  afterYn?: string | null;
}

export interface AprAfterFile {
  fileId: number;
  parentId: number;
  fileName: string;
  stampYn: boolean;
}

/** [불러오기] 창 목록 한 줄 (GET apr/doc-picks, AS-IS Dcr00_DocListModel). 날짜는 'yyyy-MM-ddTHH:mm:ss' */
export interface AprLoadDoc2 {
  docId: number;
  apprId: number;
  regDate: string;
  title: string | null;
  receiveName: string | null;
  fundDisplayName: string | null;
  /** 상태 이름(굵은 글씨 HTML) */
  statusName: string | null;
  empName: string | null;
  classTreeName: string | null;
  authYn: boolean;
  statusCode: string | null;
  content: string | null;
  /** 문서구분 코드(10 대외 / 20 사내) — 연관문서 창이 구분 열을 만든다 (V13) */
  inOutTypeCode?: string | null;
}

/** [양식] 창 목록 한 줄 (GET apr/doc-forms, AS-IS Dcr05_DocTypeModel) */
export interface AprDocForm {
  docTypeId: number;
  formClassName: string | null;
  title: string | null;
  note: string | null;
  content: string | null;
}

/** 상신 문서의 첨부파일 한 줄 — 옵션 열 포함 (GET apr/apprs/{id}/edit-files) */
export interface AprEditFile {
  fileId: number;
  parentId: number;
  fileName: string;
  fileExt: string | null;
  fileYn: string | null;
  titleYn: string | null;
  printYn: boolean;
  extYn: boolean;
  seq: string | null;
}

/** 삭제된 첨부파일 한 줄 (GET apr/apprs/{id}/file-dels, AS-IS Sys61_FileDelModel) */
export interface AprFileDel {
  fileDelId: number;
  fileId: number;
  parentId: number;
  fileName: string;
  personName: string | null;
  delDate: string | null;
  reason: string | null;
}
