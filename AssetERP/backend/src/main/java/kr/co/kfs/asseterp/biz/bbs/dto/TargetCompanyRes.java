package kr.co.kfs.asseterp.biz.bbs.dto;

/** 개별 공지 대상 고객사 한 줄 (AS-IS Bbs04_TargetCompanyModel) */
public record TargetCompanyRes(Long targetCompanyId, Long noticeId, Long companyId, String companyName) {
}
