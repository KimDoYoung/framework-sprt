package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.PasswordPersonRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS emp03_trans.xml selectByGrade·selectByPasswordPersonId, emp01_person.xml updateLockYn, sys25_password.xml checkInsert·insert·updatePassword */
@Mapper
public interface SysPasswordMapper {
    /** AS-IS emp03_trans.selectByGrade: 기준일 현재 그 회사 재직 사원(겸직 제외) */
    List<PasswordPersonRes> selectByGrade(@Param("companyId") Long companyId, @Param("transDate") LocalDate transDate);

    /** AS-IS emp03_trans.selectByPasswordPersonId: 사원 한 명 */
    List<PasswordPersonRes> selectByPasswordPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("transDate") LocalDate transDate);

    /** 그 회사의 사원인지 (TOBE 추가: 요청의 personId가 로그인 회사 사원이어야 한다) */
    int countPerson(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp01_person.updateLockYn (회사 조건 추가) */
    int updateLockYn(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("lockYn") String lockYn);

    /** AS-IS sys25_password.checkInsert: 가장 최근 순번(없으면 null) */
    Long selectLastSeq(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS sys25_password.updatePassword */
    int updatePassword(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("seq") Long seq, @Param("pwd") String pwd);

    /** AS-IS sys25_password.insert (순번 = 그 사원의 최대 순번 + 1) */
    int insertPassword(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("pwd") String pwd);
}
