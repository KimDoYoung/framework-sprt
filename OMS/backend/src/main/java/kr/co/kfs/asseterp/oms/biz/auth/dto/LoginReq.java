package kr.co.kfs.asseterp.oms.biz.auth.dto;

/**
 * @param username    로그인 ID (사번 또는 회사관리자 ID)
 * @param companyCode 로그인할 회사 코드 (sys01_loc_nm). admin 테넌트에서만 사용하며, 일반 회사 서브도메인에서는 무시하고 호스트로 판정한다
 */
public record LoginReq(
        String username,
        String password,
        String companyCode
) {
}
