package kr.co.kfs.asseterp.biz.apr.dto;

/** 문서를 연 사원에게 켜지는 결재 처리 단추 (AS-IS Apr01_Edit_ApprDoc.retrieveApproval L643-728 · myTurnCheck L1032-1131 · myCancelApprovalCheck L859-1030, V02). canRetouchSteps = 내 차례이고 합의(20)가 아닐 때 켜지는 [결재선 수정] (makeTypoButton 안 enableButton L4259-4262, V08) */
public record AprApprActionStateRes(boolean canConfirm, boolean canCancelApproval, boolean canCancelRequest, boolean canRetouchSteps, boolean canTypo) {
}
