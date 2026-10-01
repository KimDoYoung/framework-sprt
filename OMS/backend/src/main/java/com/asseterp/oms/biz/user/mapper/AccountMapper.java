package com.asseterp.oms.biz.user.mapper;

import com.asseterp.oms.biz.user.dto.LoginAccount;
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

    int updateEmpLockYn(@Param("personId") Long personId, @Param("lockYn") String lockYn);
}
