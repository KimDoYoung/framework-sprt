package kr.co.kfs.asseterp.biz.sys.dto;

/** 비밀번호 초기화 대상 사원 한 행 (AS-IS Emp03_TransModel 중 화면 열). lockYn은 'true'/'false' */
public record PasswordPersonRes(Long personId, String empNo, String orgName, String empKorName, String lockYn) {
}
