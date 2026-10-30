package kr.co.kfs.asseterp.biz.apr.dto;

/** 문서를 연 사원에게 켜지는 결재 처리 단추 (AS-IS Apr01_Edit_ApprDoc.retrieveApproval L643-728 · myTurnCheck L1032-1131 · myCancelApprovalCheck L859-1030, V02) */
public record AprApprActionStateRes(boolean canConfirm, boolean canCancelApproval, boolean canCancelRequest) {
}
