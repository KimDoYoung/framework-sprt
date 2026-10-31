package kr.co.kfs.asseterp.biz.apr.dto;

/** 로그인 사원의 양식 치환 값 (AS-IS LoginUser.getUserModel() — 사번·직급·직책·연락처, V24) */
public record HrLinkUserRow(String empNo, String posName, String titleName, String mobileTelno) {
}
