package kr.co.kfs.asseterp.biz.adv.mapper;

import kr.co.kfs.asseterp.biz.adv.dto.AccountOrgAuthSearchParam;
import kr.co.kfs.asseterp.biz.adv.dto.AccountRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/adv/mapper/adv05_org_auth.xml + adv02_account.xml selectByOrgAuthPaging (Q02) */
@Mapper
public interface AdvOrgAuthMapper {
    long selectNextId();

    /** AS-IS adv02_account.selectByOrgAuthPaging — 내 조직이 권한을 가진 계좌 */
    List<AccountRes> selectByOrgAuthPaging(@Param("p") AccountOrgAuthSearchParam param);

    long selectByOrgAuthPagingTotal(@Param("p") AccountOrgAuthSearchParam param);

    /** 계좌·조직이 로그인 회사 것인지(보안 보강) */
    int countAccount(@Param("accountId") Long accountId, @Param("companyId") Long companyId);

    int countOrg(@Param("orgCodeId") Long orgCodeId, @Param("companyId") Long companyId);

    /** AS-IS checkOrgAuth — 이미 있는 권한 행의 id, 없으면 null */
    Long selectOrgAuthId(@Param("accountId") Long accountId, @Param("orgCodeId") Long orgCodeId);

    /** AS-IS UpdateDataModel(adv05_org_auth) 동적 INSERT */
    int insertOrgAuth(@Param("orgAuthId") Long orgAuthId, @Param("accountId") Long accountId, @Param("orgCodeId") Long orgCodeId,
                      @Param("authYn") String authYn);

    /** AS-IS UpdateDataModel(adv05_org_auth) 동적 UPDATE */
    int updateAuthYn(@Param("orgAuthId") Long orgAuthId, @Param("authYn") String authYn);
}
