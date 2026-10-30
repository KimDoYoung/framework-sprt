package kr.co.kfs.asseterp.biz.apr.dto;

/** apr04_appr_step.lastStepList 한 줄 — stepEmpId는 대결자·인감 책임자로 바뀐 실제 결재자 (V02) */
public record AprLastStepRow(String stepTypeCode, String seq, Long stepEmpId) {
}
