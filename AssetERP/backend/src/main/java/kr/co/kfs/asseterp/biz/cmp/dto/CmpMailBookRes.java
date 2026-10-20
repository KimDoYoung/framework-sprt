package kr.co.kfs.asseterp.biz.cmp.dto;

/** 공용메일 한 행 (AS-IS Cmp10_MailBookModel, selectByCompanyId). decPassword = to_decrypts(비밀번호) — 등록·수정창이 보여 준다 */
public record CmpMailBookRes(Long mailBookId, String emailAddr, String note, String decPassword) {
}
