package kr.co.kfs.asseterp.biz.fnd.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/fnd/mapper/fnd08_org_auth.xml */
@Mapper
public interface FndOrgAuthMapper {
    long selectNextId();

    /** 펀드·조직이 로그인 회사 것인지(보안 보강) */
    int countFund(@Param("fundCodeId") Long fundCodeId, @Param("companyId") Long companyId);

    int countOrg(@Param("orgCodeId") Long orgCodeId, @Param("companyId") Long companyId);

    /** AS-IS checkOrgAuth — 이미 있는 권한 행의 id, 없으면 null */
    Long selectOrgAuthId(@Param("fundCodeId") Long fundCodeId, @Param("orgCodeId") Long orgCodeId);

    /** AS-IS UpdateDataModel(fnd08_org_auth) 동적 INSERT */
    int insertOrgAuth(@Param("orgAuthId") Long orgAuthId, @Param("fundCodeId") Long fundCodeId, @Param("orgCodeId") Long orgCodeId,
                      @Param("authYn") String authYn);

    /** AS-IS UpdateDataModel(fnd08_org_auth) 동적 UPDATE */
    int updateAuthYn(@Param("orgAuthId") Long orgAuthId, @Param("authYn") String authYn);
}
