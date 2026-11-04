package kr.co.kfs.asseterp.biz.batch.dto;

/** sys15_corp 한 건 (AS-IS Sys15_CorpModel 중 icamAdvice가 쓰는 필드) */
public record BatchSysCorp(Long corpId, Long companyId, String corpName, String corpType, String corpCode) {
}
