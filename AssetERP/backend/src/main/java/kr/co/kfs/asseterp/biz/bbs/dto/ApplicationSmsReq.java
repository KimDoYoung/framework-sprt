package kr.co.kfs.asseterp.biz.bbs.dto;

/** AS-IS Sms02_History.sendMessage(companyId, personId, msg) */
public record ApplicationSmsReq(Long personId, String msg) {
}
