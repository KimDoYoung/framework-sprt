/** bbs(게시·규정) 화면 타입 (E10~) — API 응답 record와 같은 필드 */

/** 회사규정 (bbs15_company_rule) — 날짜는 YYYY-MM-DD */
export interface BbsCompanyRule {
  companyRuleId: number;
  companyId: number;
  ruleType: string | null;
  ruleTypeName: string | null;
  companyRuleCode: string | null;
  title: string | null;
  content: string | null;
  note: string | null;
  seq: number | null;
  revisionDate: string | null;
  revisionNo: number | null;
  publicYn: boolean | null;
  closeDate: string | null;
  creName: string | null;
  updName: string | null;
  updDateStr: string | null;
  fileCnt: number | null;
}

/** 저장 요청 — 등록은 companyRuleId(미리 받은 새 ID)와 companyId를 함께 보낸다 */
export interface BbsCompanyRuleSaveReq {
  companyRuleId?: number | null;
  companyId?: number | null;
  ruleType: string | null;
  companyRuleCode: string | null;
  title: string | null;
  content: string | null;
  note: string | null;
  seq: number | null;
  revisionDate: string | null;
  revisionNo: number | null;
  publicYn: boolean | null;
  closeDate: string | null;
}

/** Z03 공지사항 한 행 (AS-IS Bbs02_NoticeModel). noticeDetailFullName·title2는 HTML(구분 색 글씨), notice는 본문 HTML */
export interface BbsNoticePerson {
  noticeId: number;
  topYn: boolean;
  fromDate: string;
  noticeNo: string;
  noticeDetailFullName: string;
  title: string;
  title2: string;
  notice: string | null;
  commentYn: boolean;
}

/** H01 법규공지 한 행 (AS-IS Bbs02_NoticeModel). notice는 본문 HTML */
export interface BbsNotice {
  noticeId: number;
  fromDate: string;
  noticeTypeName: string;
  noticeNo: string;
  noticeDetailName: string;
  title: string;
  publicYnName: string;
  notice: string | null;
  commentYn: boolean;
}

/** H01 공지사항 댓글 한 행 (AS-IS Bbs07_CommentModel). deleteStr은 내 댓글이면 '✕' */
export interface BbsComment {
  commentId: number;
  personId: number;
  commentFullStr: string;
  fileStr: string;
  deleteStr: string;
  /** 관리자 댓글확인 창(Bbs07_Lookup_Comment)의 삭제 칸 — 항상 '✕' */
  deleteMasterStr: string;
  comment: string;
}

/** 증명서 신청내역 행 (S05, AS-IS Bbs11_ApplicationModel · selectByAppStatus) */
export interface BbsApplication {
  applicationId: number;
  appDate?: string | null;
  appEmpId?: number | null;
  appEmpName?: string | null;
  appType?: string | null;
  appTypeName?: string | null;
  appStatus?: string | null;
  content?: string | null;
}

/** T22 AS-IS Bbs11_ApplicationModel (bbs11_application + 계산 열) — 기타신청서 확인 그리드 */
export interface BbsApplicationMng {
  applicationId: number;
  companyId?: number | null;
  appDate?: string | null;
  appEmpId?: number | null;
  appEmpName?: string | null;
  appType?: string | null;
  appTypeName?: string | null;
  appStatus?: string | null;
  appStatusName?: string | null;
  closeDate?: string | null;
  note?: string | null;
  content?: string | null;
}

/** Y13 AS-IS Bbs11_ApplicationModel — 기타신청서 작성 그리드 행 (bbs11_application.selectByPersonId) */
export interface BbsApplicationMine {
  applicationId: number;
  appDate?: string | null;
  appEmpId?: number | null;
  appEmpName?: string | null;
  appType?: string | null;
  appTypeName?: string | null;
  appStatus?: string | null;
  appStatusName?: string | null;
  closeDate?: string | null;
  note?: string | null;
  content?: string | null;
}

/** Y13 신청서 저장 요청 — applicationId가 없으면 새 신청서 */
export interface BbsApplicationMineSaveReq {
  applicationId?: number | null;
  appDate: string;
  appType: string | null;
  note: string | null;
  content: string | null;
}

/** Y13 신청·신청취소 결과 — notice: 1 알림 발송, 0 수신자 없음, -1 문자 발송 실패 */
export interface BbsApplicationStatusRes {
  row: BbsApplicationMine;
  notice: number;
}

/** T22 AS-IS Bbs12_ApplicationFormModel — 신청구분 내용 양식 */
export interface BbsApplicationForm {
  applicationFormId: number;
  companyId?: number | null;
  appType?: string | null;
  appTypeName?: string | null;
  content?: string | null;
  contentMobi?: string | null;
  publicYn?: boolean | null;
}

/** T21 AS-IS Bbs20_FloralRequestModel (bbs20_floral_request + 계산 열) */
export interface BbsFloralRequest {
  floralRequestId: number;
  companyId?: number | null;
  regDate?: string | null;
  personId?: number | null;
  personName?: string | null;
  personInfo?: string | null;
  occasionsCode?: string | null;
  occasionsName?: string | null;
  message?: string | null;
  sendCompany?: string | null;
  sendEmp?: string | null;
  sendPos?: string | null;
  rcvCompany?: string | null;
  rcvEmp?: string | null;
  rcvPos?: string | null;
  rcvDept?: string | null;
  rcvTel?: string | null;
  rcvAddr?: string | null;
  sendRequestDate?: string | null;
  sendRequestTime?: string | null;
  statusCode?: string | null;
  statusName?: string | null;
  endDate?: string | null;
  note?: string | null;
  reason?: string | null;
  addInfo?: string | null;
  requests?: string | null;
  rejectReason?: string | null;
  privateYn?: string | null;
  fileCount?: number | null;
  shareInfo?: string | null;
  /** 그리드 열 `rcvInfo`(담당자) — AS-IS SQL에 이 열이 없어 늘 비어 있다(원본 그대로) */
  rcvInfo?: string | null;
}

/** Y12 새 신청의 기본값 (POST bbs/floral-requests/new, AS-IS Bbs20_Edit_FloralRequest.insert) */
export interface BbsFloralRequestNew {
  floralRequestId: number;
  regDate: string;
  personId: number;
  personName: string;
  sendCompany: string;
  sendEmp: string;
  sendPos: string;
}

/** Y12 신청 등록·수정 저장 (PUT bbs/floral-requests/save, AS-IS Bbs20_FloralRequest.modelUpdate) */
export interface BbsFloralRequestSaveReq {
  floralRequestId: number;
  regDate: string;
  occasionsCode: string;
  message: string;
  sendCompany: string;
  sendEmp: string;
  sendPos: string | null;
  rcvCompany: string;
  rcvEmp: string;
  rcvPos: string | null;
  rcvDept: string | null;
  rcvTel: string;
  rcvAddr: string;
  sendRequestDate: string;
  sendRequestTime: string | null;
  reason: string;
  addInfo: string | null;
  requests: string | null;
  privateYn: boolean;
}

/** AS-IS Bbs22_FloralMessageModel */
export interface BbsFloralMessage {
  floralMessageId: number;
  occasionsCode?: string | null;
  occasionsName?: string | null;
  message?: string | null;
}

/** AS-IS Bbs21_FloralRequestShareModel */
export interface BbsFloralShare {
  floralRequestShareId: number;
  floralRequestId?: number | null;
  shareCode?: string | null;
  shareName?: string | null;
  personId?: number | null;
  personName?: string | null;
  orgId?: number | null;
  orgName?: string | null;
}

/** Z02 공지사항 등록 한 행 = 편집창 입력값 (AS-IS Bbs02_NoticeModel). 날짜는 YYYY-MM-DD, notice는 본문 HTML */
export interface BbsNoticeMng {
  noticeId: number;
  companyId: number | null;
  topYn: boolean;
  fromDate: string | null;
  toDate: string | null;
  openYn: string | null;
  noticeNo: string | null;
  noticeType: string | null;
  noticeTypeName: string | null;
  noticeDetailCode: string | null;
  noticeDetailName: string | null;
  noticeDetailFullName: string | null;
  title: string | null;
  commentCnt: number | null;
  note: string | null;
  notice: string | null;
  userId: number | null;
  userName: string | null;
  commentYn: boolean;
  topNoticeYn: boolean;
  topNoticeCloseDate: string | null;
}

/** 개별 공지 대상자 한 줄 (AS-IS Bbs03_TargetModel) */
export interface BbsTarget {
  targetId: number;
  noticeId: number;
  personId: number;
  orgName: string | null;
  titleName: string | null;
  empNo: string | null;
  empName: string | null;
}

/** 공지 저장 요청 (AS-IS bbs.Bbs02_Notice.update + bbs.Bbs03_Target.update) */
export interface BbsNoticeSaveReq {
  noticeId: number;
  title: string;
  notice: string | null;
  fromDate: string;
  toDate: string;
  openYn: string | null;
  note: string | null;
  noticeType: string;
  noticeDetailCode: string | null;
  commentYn: boolean;
  topNoticeYn: boolean;
  topNoticeCloseDate: string | null;
  newTargetPersonIds: number[];
}

/** Z04 KFS공지 한 행 = 편집창 입력값 (AS-IS Bbs02_NoticeModel, KFS공지등록). 날짜는 YYYY-MM-DD, notice는 본문 HTML */
export interface BbsNoticeAdmin {
  noticeId: number;
  companyId: number | null;
  fromDate: string | null;
  toDate: string | null;
  openYn: string | null;
  noticeNo: string | null;
  noticeType: string | null;
  noticeTypeName: string | null;
  noticeDetailCode: string | null;
  noticeDetailName: string | null;
  noticeDetailFullName: string | null;
  title: string | null;
  note: string | null;
  notice: string | null;
  userId: number | null;
  userName: string | null;
  publicYn: boolean;
  publicCompanyYn: boolean;
}

/** 개별 공지 대상 고객사 한 줄 (AS-IS Bbs04_TargetCompanyModel) */
export interface BbsTargetCompany {
  targetCompanyId: number;
  noticeId: number;
  companyId: number;
  companyName: string | null;
}

/** 공지 변경 기록 한 줄 (AS-IS Bbs09_NoticeHistoryModel) */
export interface BbsNoticeHistory {
  noticeHistoryId: number;
  regDateStr: string;
  openYn: string | null;
  personName: string | null;
  contentYn: boolean;
  notice: string | null;
}

/** KFS공지 저장 요청 */
export interface BbsNoticeAdminSaveReq {
  noticeId: number;
  title: string;
  notice: string | null;
  fromDate: string;
  toDate: string;
  openYn: string | null;
  note: string | null;
  noticeType: string;
  noticeDetailCode: string | null;
  publicYn: boolean;
  publicCompanyYn: boolean;
  latestOpenYn: string | null;
  latestNotice: string | null;
  newTargetCompanyIds: number[];
}

/** Z07 AS-IS Bbs10_BizShareModel — 업무공유 그리드 행 (bbs10_biz_share.selectByText) */
export interface BbsBizShare {
  bizShareId: number;
  date?: string | null;
  bizShareType?: string | null;
  bizShareTypeName?: string | null;
  content?: string | null;
  keyword?: string | null;
  note?: string | null;
  personId?: number | null;
  personName?: string | null;
}

/** Z07 저장 요청 — bizShareId가 없으면 새 글 */
export interface BbsBizShareSaveReq {
  bizShareId?: number | null;
  date: string;
  bizShareType: string;
  content: string;
  keyword: string | null;
  note: string | null;
}

/** Z13 게시판 분류/세부항목 한 행 (AS-IS Bbs30_ClassTreeModel). typeCd 'C' = 분류, 'T' = 세부항목 */
export interface BbsClassTree {
  classTreeId: number;
  companyId?: number;
  classTreeNm: string | null;
  parentTreeId: number;
  seq: number | null;
  note?: string | null;
  typeCd: string;
  useYn: boolean;
  publicYn: boolean;
  /** 세부항목의 상위 분류명 (분류 줄은 null) */
  parentTreeNm?: string | null;
  /** 세부항목의 게시물 수 */
  count?: number | null;
}

/** Z13 게시물 한 행 (AS-IS Bbs31_ContentModel). 목록은 content가 null — 상세 창이 읽는다 */
export interface BbsContent {
  contentId: number;
  classTreeId: number;
  personId: number;
  title: string | null;
  /** 비공개 글이면 앞에 굵은 "(비공개) "가 붙은 HTML 제목 */
  titleRole: string;
  content: string | null;
  hideYn: boolean;
  regDateStr: string;
  personName: string;
}

/** Z13 게시물 저장 요청 — editChk false면 새 글(등록일 = 지금) */
export interface BbsContentSaveReq {
  contentId: number;
  classTreeId: number | null;
  title: string;
  content: string;
  hideYn: boolean;
  editChk: boolean;
}

/** Z13 게시판 분류 권한 한 행 (AS-IS Bbs33_RoleModel). roleCd 'P' = 사원, 'O' = 부서 */
export interface BbsClassRole {
  roleId: number;
  classTreeId: number;
  roleCd: string;
  personId: number | null;
  orgCodeId: number | null;
  personName: string | null;
  orgName: string | null;
  roleName: string;
}

/** 나에게 온 알림 공지 한 줄 (AS-IS Bbs02_NoticeModel 일부 — Frm01_Lookup_NoticeList, EE55). title2 = 구분 색 글씨 + 제목(HTML) */
export interface BbsNoticeTarget {
  noticeId: number;
  noticeNo?: string | null;
  title: string;
  title2?: string | null;
  notice?: string | null;
  commentYn?: boolean | null;
  fromDate?: string | null;
}


/** 로그인 때 뜨는 공지 한 줄 (AS-IS Bbs02_NoticeModel 일부 — Bbs02_Lookup_NoticeAdmin, EE83). topYn = 상단고정, noticeTypeName = 구분 HTML */
export interface BbsNoticeCompany extends BbsNoticeTarget {
  topYn?: string | null;
  noticeTypeName?: string | null;
}

/** 게시판 한 건 (GET /api/v1/bbs/boards/{id}, AS-IS Bbs01_BoardModel 중 등록·수정 창이 다루는 값). writeUserName은 "이름 직위" */
export interface BbsBoard {
  boardId: number;
  typeCode?: string | null;
  typeName?: string | null;
  title?: string | null;
  content?: string | null;
  writeUserId?: number | null;
  writeUserName?: string | null;
  writeDate?: string | null;
}

/** 게시판 저장 요청 (AS-IS bbs.Bbs01_Board.update) */
export interface BbsBoardSaveReq {
  boardId: number;
  typeCode: string | null;
  title: string | null;
  content: string | null;
  writeDate: string | null;
}
