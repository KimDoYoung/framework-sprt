package kr.co.kfs.asseterp.biz.scm.dto;

public record DevStepSaveReq(Long devStepId, String devStepSeq, String devStepCd, Long personId, String resultCd) {
}
