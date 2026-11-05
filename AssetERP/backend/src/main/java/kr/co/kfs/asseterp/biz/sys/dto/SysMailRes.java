package kr.co.kfs.asseterp.biz.sys.dto;

/** 회사 메일 한 행 (AS-IS Sys22_MailModel, sys22_mail.selectById). mailDecPassword = to_decrypts(비밀번호) — 창이 보여 준다 */
public record SysMailRes(Long mailId, String mailAddress, String mailDecPassword, String note) {
}
