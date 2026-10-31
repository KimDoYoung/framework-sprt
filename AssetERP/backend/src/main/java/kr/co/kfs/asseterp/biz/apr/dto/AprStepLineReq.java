package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 결재선 줄 만들기 (Apr04_Edit_ApprStep.insertApprovalEmp, V07) — stepTypeCode는 10 결재 · 20 합의 · 30 참조 */
public record AprStepLineReq(String stepTypeCode, List<AprStepPersonReq> persons) {
}
