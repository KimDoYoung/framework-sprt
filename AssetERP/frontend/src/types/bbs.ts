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
