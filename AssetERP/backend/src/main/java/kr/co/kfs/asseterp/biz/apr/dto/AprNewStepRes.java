package kr.co.kfs.asseterp.biz.apr.dto;

/** 기본 결재선 한 줄 (Apr04_ApprStep.createApprovalTypeCd, V06). stepApprName은 이름 문구(대결이면 HTML) */
public record AprNewStepRes(Long apprStepId, String seq, String stepTypeCode, String stepTypeName, String stepStatusCode, String stepStatusName,
                            Long stepEmpId, Long apprEmpId, String stepApprName, boolean lockYn,
                            String titleName, String empKorName, String orgKorName) {
}
