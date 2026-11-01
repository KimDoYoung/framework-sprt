package kr.co.kfs.asseterp.biz.apr.dto;

/** A21~A23·A37·A49 복리후생비 신청서 본문의 신청자 값 (AS-IS LoginUser — 소속·직위·직책·휴대폰) */
public record BenefitSenderRow(String orgName, String posName, String titleName, String mobileTelNo) {
}
