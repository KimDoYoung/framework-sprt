package kr.co.kfs.asseterp.biz.sms.dto;

/** 발송 대상 한 사람 (AS-IS Emp01_PersonModel: 고객사·사원명·휴대폰) */
public record GroupSendTargetReq(Long personId, String companyName, String korName, String mobileTelNo) {
}
