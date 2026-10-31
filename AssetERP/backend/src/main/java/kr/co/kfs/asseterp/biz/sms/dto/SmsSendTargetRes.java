package kr.co.kfs.asseterp.biz.sms.dto;

/** 문자 발송 창 목록 한 줄 (AS-IS Emp00_TransInfoModel — 조직·직책·사번·성명) */
public record SmsSendTargetRes(Long personId, String orgTitleName, String titleName, String empNo, String empKorName) {
}
