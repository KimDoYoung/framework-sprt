package kr.co.kfs.asseterp.biz.sys.dto;

/** AS-IS Sys85_ClientInfoModel — sys85_client_info (고객사 개인정보: 문자발송 기타고객사). moblieTelno는 원본 모델 이름(오타) 그대로 */
public record ClientInfoRes(Long clientInfoId, String companyName, String orgName, String posName, String clientName, String moblieTelno) {
}
