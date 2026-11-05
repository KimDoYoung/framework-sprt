package kr.co.kfs.asseterp.biz.user.dto;

/**
 * 회사의 로그인 정책 (sys01_company)
 *
 * @param companyId         sys01_company_id
 * @param loginSecureYn     sys01_login_secure_yn — 'true'면 허용 공인 IP(sys29_login_secure)에서만 로그인
 * @param emergencyPassword sys01_emgrcy_passwd — 회사 비상 비밀번호 (AS-IS Sys02_User.getLoginInfo L107: 사원 비밀번호 대신 쓸 수 있다)
 */
public record LoginPolicy(Long companyId, String loginSecureYn, String emergencyPassword) {
    public boolean isLoginSecure() {
        return "true".equals(loginSecureYn);
    }
}
