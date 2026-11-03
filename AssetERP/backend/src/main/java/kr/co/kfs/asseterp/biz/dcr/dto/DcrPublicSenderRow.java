package kr.co.kfs.asseterp.biz.dcr.dto;

/** 발송 계정으로 쓰는 공용메일 (AS-IS cmp10_mail_book.selectByEmailAddress 첫 행) */
public record DcrPublicSenderRow(String emailAddr, String decPassword) {
}
