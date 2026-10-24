package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인자 순서 저장 한 행 (AS-IS Tdm09_ApprStep.inUpdateData — 위로·아래로 뒤 전체 행의 순서) */
public record ApprStepSeqReq(
        Long apprStepId,
        String apprSeq) {
}
