package kr.co.kfs.asseterp.biz.emp.dto;

/** 본인 메일 계정 (AS-IS emp.Emp01_Person.selectByPersonId 중 이메일주소·복호 비밀번호, Emp10_Lookup_MailRetrieve) */
public record EmpPersonMailRes(String mailAddress, String password) {
}
