package kr.co.kfs.asseterp.biz.scm.dto;

/**
 * AS-IS Scm01_Edit_Sr.updateApprStep(aprStepStatus) — 승인 '20' / 반려 '30'.
 * last: 마지막 결재자인가(lastChk) — 맞으면 의뢰의 승인상태를 승인 '30' / 반려 '40'으로 바꾼다
 */
public record SrApprDecisionReq(String stepStatusCd, boolean last) {
}
