package kr.co.kfs.asseterp.biz.sys.dto;

/** 회사 메일 저장 (AS-IS Sys22_Mail.modelUpdate 의 updateModel). 새 메일이면 서버가 ID를 만들고 회사는 로그인 회사 */
public record SysMailSaveReq(String mailAddress, String mailDecPassword, String note) {
}
