package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/**
 * 결재선 수정 [저장] (Apr04_Edit_RetouchApprStep.update → apr.Apr04_ApprStep.updateList, V08).
 * steps는 창에 남은 결재선 전체(번호 순), deleteStepIds는 창에서 지운 기존 줄. 새 줄은 apprStepId가 DB에 없는 것이다.
 */
public record AprRetouchReq(List<AprApprSaveStepReq> steps, List<Long> deleteStepIds) {
}
