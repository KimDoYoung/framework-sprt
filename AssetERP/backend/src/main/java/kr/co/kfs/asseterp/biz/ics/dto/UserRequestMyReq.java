package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규등록신청 저장 요청 (AS-IS Ics17_Edit_UserRequest가 고치는 칸: 요청일자·확인여부·법규명·법규내용·보고주기·보고처·법규조항) */
public record UserRequestMyReq(String regDate, String confirmYn, String lawTitle, String lawContent,
                               String reportCycle, String submitTo, String relatedLaw) {
}
