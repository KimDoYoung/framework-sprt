package kr.co.kfs.asseterp.biz.user.mapper;

import kr.co.kfs.asseterp.biz.user.dto.LoginAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

/**
 * 로그인 계정 조회 (AS-IS 테이블: emp01_person, sys25_password, emp03_trans, sys02_user, sys01_company)
 */
@Mapper
public interface AccountMapper {
    Optional<LoginAccount> findEmployee(@Param("companyCode") String companyCode, @Param("loginId") String loginId);

    Optional<LoginAccount> findManager(@Param("companyCode") String companyCode, @Param("loginId") String loginId);

    Optional<LoginAccount> findEmployeeById(@Param("personId") Long personId);

    Optional<LoginAccount> findManagerById(@Param("userId") Long userId);

    /** 회사의 사원 목록 (비밀번호 제외) */
    List<LoginAccount> findEmployeesByCompany(@Param("companyId") Long companyId);

    /** AS-IS emp03_trans.LoginCheck — 접근 만료된 최근 발령 수 */
    int countAccessExpired(@Param("companyCode") String companyCode, @Param("loginId") String loginId);

    Optional<kr.co.kfs.asseterp.biz.user.dto.LoginPolicy> findLoginPolicy(@Param("companyCode") String companyCode);

    /** AS-IS sys29_login_secure.checkLoginSecure */
    int countAllowedIp(@Param("companyId") Long companyId, @Param("ipAddress") String ipAddress);

    int updateEmpLockYn(@Param("personId") Long personId, @Param("lockYn") String lockYn);
}
