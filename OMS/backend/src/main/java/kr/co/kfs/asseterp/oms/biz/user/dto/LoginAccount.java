package kr.co.kfs.asseterp.oms.biz.user.dto;

import java.util.List;

/**
 * 로그인 계정. AS-IS와 같이 사원(emp01_person)을 먼저 찾고, 없으면 회사관리자(sys02_user)를 찾는다.
 *
 * @param accountType     E: 사원(emp01_person), M: 회사관리자(sys02_user)
 * @param accountId       emp01_person_id 또는 sys02_user_id
 * @param companyCode     sys01_loc_nm (서브도메인)
 * @param loginId         사번(emp01_emp_no) 또는 sys02_login_id
 * @param password        복호화한 비밀번호 (사원: sys25_password 최신 seq, 관리자: sys02_passwd). 목록 조회 시 null
 * @param passwordAgeDays 비밀번호 설정 후 경과일 (AS-IS sys25_pass)
 * @param lockYn          emp01_lock_yn ('true'/'false'/null). 관리자는 잠금 없음
 * @param transCode       현재 발령코드 (emp03_trans_cd, 800: 겸직, 900: 퇴직). 관리자는 null
 */
public record LoginAccount(
        String accountType,
        Long accountId,
        Long companyId,
        String companyCode,
        String companyName,
        String loginId,
        String name,
        String password,
        Integer passwordAgeDays,
        String lockYn,
        String transCode
) {
    public static final String EMPLOYEE = "E";
    public static final String MANAGER = "M";

    public static final String LOCKED = "true";
    public static final String UNLOCKED = "false";

    public static final String TRANS_ADD_TITLE = "800";
    public static final String TRANS_RETIRED = "900";

    public boolean isEmployee() {
        return EMPLOYEE.equals(accountType);
    }

    /**
     * 세션(JWT sub, Redis 키)용 사용자 ID.
     * emp01_person_id와 sys02_user_id는 서로 다른 시퀀스라 값이 겹칠 수 있어(예: 1) 관리자는 음수로 구분한다.
     */
    public Long sessionUserId() {
        return toSessionUserId(accountType, accountId);
    }

    public static Long toSessionUserId(String accountType, Long accountId) {
        return EMPLOYEE.equals(accountType) ? accountId : -accountId;
    }

    public static boolean isEmployeeSessionId(Long sessionUserId) {
        return sessionUserId > 0;
    }

    public static Long toAccountId(Long sessionUserId) {
        return Math.abs(sessionUserId);
    }

    /**
     * 전 회사에서 유일한 사용자 이름 ({회사코드}:{로그인ID}). 감사 로그, WebSocket 사용자 라우팅에 사용한다.
     * 사번은 회사마다 겹치므로(예: 000) 회사 코드를 붙인다.
     */
    public String qualifiedUsername() {
        return companyCode + ":" + loginId;
    }

    public boolean isLocked() {
        return LOCKED.equals(lockYn);
    }

    /**
     * @param adminCompanyCode KFS 관리자 회사 코드 (asseterp.tenant.admin-code)
     */
    public List<String> roles(String adminCompanyCode) {
        if (isEmployee()) {
            return List.of("ROLE_USER");
        }
        return adminCompanyCode.equals(companyCode)
                ? List.of("ROLE_ADMIN", "ROLE_SYSADMIN")
                : List.of("ROLE_ADMIN");
    }
}
