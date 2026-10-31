package kr.co.kfs.asseterp.biz.tdm.dto;

import jakarta.validation.constraints.NotNull;

/** 부서별 책무매뉴얼 보고의 결재 문서 번호 기록 (tdm.Tdm42_ManlOrg.updateApprId) */
public record ManlOrgApprIdReq(@NotNull Long apprId) {
}
