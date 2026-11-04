package kr.co.kfs.asseterp.biz.sys.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/sys/mapper/sys83_secondary_auth_user.xml (insert·selectByTempPassword) + sys01_company.sys01_secondary_auth_yn */
@Mapper
public interface SysSecondaryAuthMapper {

    /** LoginPage L168 companyModel.getSecondaryAuthYn(): 그 회사가 2차 인증을 쓰는가 */
    boolean selectSecondaryAuthYn(@Param("companyId") Long companyId);

    /** AS-IS sys83_secondary_auth_user.insert */
    int insert(@Param("companyId") Long companyId, @Param("personId") Long personId,
               @Param("phone") String phone, @Param("tempPassword") String tempPassword);

    /**
     * AS-IS sys83_secondary_auth_user.selectByTempPassword 의 건수 (가장 최근 발급 1건).
     * TOBE 보강: 발급 후 validMinutes 분 안의 것만
     */
    int countValid(@Param("companyId") Long companyId, @Param("personId") Long personId,
                   @Param("tempPassword") String tempPassword, @Param("validMinutes") int validMinutes);
}
