package kr.co.kfs.asseterp.biz.cmp.dto;

/** 공용메일 검증 요청 (AS-IS utils.mail.SendMailSMTP.checkCompanyMail 파라미터 mailAddress·password) */
public record CmpMailCheckReq(String mailAddress, String password) {
}
