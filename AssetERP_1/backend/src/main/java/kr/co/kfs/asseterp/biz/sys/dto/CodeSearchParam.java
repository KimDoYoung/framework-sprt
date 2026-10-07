package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS selectByCodeKind 파라미터 (applyDate는 서버 오늘 — AS-IS도 null이면 오늘) */
public record CodeSearchParam(Long companyId, String kindCode) {
}
