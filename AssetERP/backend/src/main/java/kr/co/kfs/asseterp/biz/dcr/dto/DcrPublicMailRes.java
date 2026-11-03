package kr.co.kfs.asseterp.biz.dcr.dto;

/** 공용메일 조회창 한 행 (AS-IS Cmp10_Lookup_MailBookList 그리드: 이메일·비고). 비밀번호는 내보내지 않는다 */
public record DcrPublicMailRes(Long mailBookId, String emailAddr, String note) {
}
