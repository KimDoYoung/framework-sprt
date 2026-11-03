package kr.co.kfs.asseterp.biz.emp.dto;

/** 본인 메일 계정 저장/검증 (AS-IS emp.Emp01_Person.changeMail · utils.mail.SendMailSMTP.checkMail 파라미터 mailAddress·password) */
public record EmpPersonMailSaveReq(String mailAddress, String password) {
}
