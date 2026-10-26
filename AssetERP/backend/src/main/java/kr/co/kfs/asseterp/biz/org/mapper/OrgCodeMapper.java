package kr.co.kfs.asseterp.biz.org.mapper;

import kr.co.kfs.asseterp.biz.org.dto.OrgCodeRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgCodeSaveReq;
import kr.co.kfs.asseterp.biz.org.dto.OrgFundAuthRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgFundAuthRow;
import kr.co.kfs.asseterp.biz.org.dto.OrgInfoRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/org/mapper/org01_code.xml (+ Org01_Code가 쓰는 org02_info 저장) */
@Mapper
public interface OrgCodeMapper {
    /** AS-IS selectByParentId_1Bang (parentCodeId = 0) */
    List<OrgCodeRes> searchOrgCodes(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate);

    /** AS-IS selectByBaseDate */
    OrgCodeRes selectByBaseDate(@Param("companyId") Long companyId, @Param("codeId") Long codeId, @Param("baseDate") LocalDate baseDate);

    int countCode(@Param("companyId") Long companyId, @Param("codeId") Long codeId);

    int countInfoByModDate(@Param("codeId") Long codeId, @Param("modDate") LocalDate modDate, @Param("infoId") Long infoId);

    /** AS-IS org02_info.selectCountByCodeId */
    long countInfoByCodeId(@Param("codeId") Long codeId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    int insertInfo(@Param("infoId") Long infoId, @Param("req") OrgCodeSaveReq req);

    int insertInfoHistory(@Param("infoId") Long infoId, @Param("srcInfoId") Long srcInfoId, @Param("req") OrgCodeSaveReq req);

    int updateInfo(@Param("companyId") Long companyId, @Param("req") OrgCodeSaveReq req);

    int insertCode(@Param("companyId") Long companyId, @Param("req") OrgCodeSaveReq req);

    int updateCode(@Param("companyId") Long companyId, @Param("req") OrgCodeSaveReq req);

    int deleteInfo(@Param("companyId") Long companyId, @Param("infoId") Long infoId);

    int deleteCode(@Param("companyId") Long companyId, @Param("codeId") Long codeId);

    /** AS-IS org01_code.selectByKorName (P02 조직찾기 Fnd08_Lookup_OrgCode) */
    List<OrgInfoRes> selectByKorName(@Param("companyId") Long companyId, @Param("baseDate") LocalDate baseDate, @Param("korName") String korName);

    /** AS-IS org01_code.selectByFundCodeId (P02 권한 트리, 한 단계) */
    List<OrgFundAuthRes> selectByFundCodeId(@Param("companyId") Long companyId, @Param("parentCodeId") Long parentCodeId, @Param("fundCodeId") Long fundCodeId);

    /** 펀드가 로그인 회사 것인지 (보안 보강) */
    int countFundInCompany(@Param("fundCodeId") Long fundCodeId, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd08_org_auth) INSERT */
    int insertOrgAuth(@Param("orgAuthId") Long orgAuthId, @Param("fundCodeId") Long fundCodeId, @Param("r") OrgFundAuthRow row);

    /** AS-IS UpdateDataModel(fnd08_org_auth) UPDATE — 권한 여부만 바뀐다 */
    int updateOrgAuth(@Param("fundCodeId") Long fundCodeId, @Param("r") OrgFundAuthRow row);
}
