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
