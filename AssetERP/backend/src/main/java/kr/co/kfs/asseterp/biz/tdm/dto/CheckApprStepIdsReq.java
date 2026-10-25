package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 승인선 삭제 대상 (AS-IS tdm.Tdm58_ChckApprStep.delete) */
public record CheckApprStepIdsReq(List<Long> chckApprStepIds) {
}
