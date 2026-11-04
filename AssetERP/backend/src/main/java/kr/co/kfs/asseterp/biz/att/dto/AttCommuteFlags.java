package kr.co.kfs.asseterp.biz.att.dto;

/** 회사 근태 설정 (AS-IS LoginUser.getCompanyModel().getCommutePopupYn / getCommuteLockYn) */
public record AttCommuteFlags(Boolean popupYn, Boolean lockYn) {
}
