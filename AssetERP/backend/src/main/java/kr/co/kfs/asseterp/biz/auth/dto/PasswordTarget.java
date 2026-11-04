package kr.co.kfs.asseterp.biz.auth.dto;

/** 로그인 전 비밀번호 처리 대상 사원 (회사코드 + 로그인ID[사번]로 찾은 사원) */
public record PasswordTarget(Long companyId, Long personId, String korNm, String mobileTelNo, String lockYn) {
}
