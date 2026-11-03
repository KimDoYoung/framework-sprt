package kr.co.kfs.asseterp.biz.dcr.dto;

import kr.co.kfs.asseterp.biz.sys.dto.FileRes;

import java.util.List;

/** 메일 발송창을 열 때 필요한 값 — 내선·휴대폰은 [보내기]의 서명 검사에, 메일서버정보(LoginUser.getMailInfo)는 일괄 발송 이력에 쓴다 (AS-IS Emp01_Person.selectByPersonId · Cmp10_MailBook.selectByPersonId · Sys10_File.selectApprRelateDoc) */
public record DcrMailSenderInitRes(String senderEmail, String mailInfo, String officeTelno, String mobileTelno, boolean publicMailAllowed, List<FileRes> files) {
}
