package kr.co.kfs.asseterp.biz.mkt.mapper;

import kr.co.kfs.asseterp.biz.mkt.dto.MktManagerRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** Z05 Mkt01_Lookup_TargetCompany 의 담당자 그리드 (AS-IS server/mkt/mapper/mkt02_manager.xml) */
@Mapper
public interface MktManagerMapper {

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS mkt02_manager.selectByTargetCompanyId (회사 조건 추가) */
    List<MktManagerRes> selectByTargetCompanyId(@Param("companyId") Long companyId, @Param("targetCompanyId") Long targetCompanyId);

    /** AS-IS mkt02_manager.selectById (회사 조건 추가) */
    MktManagerRes selectById(@Param("companyId") Long companyId, @Param("managerId") Long managerId);

    /** UpdateDataModel UPDATE — 화면이 바꾸는 컬럼만 */
    int updateOne(@Param("companyId") Long companyId, @Param("r") MktManagerRes row);

    /** UpdateDataModel INSERT */
    int insertOne(@Param("companyId") Long companyId, @Param("r") MktManagerRes row);

    /** UpdateDataModel.deleteModel (회사 조건 추가) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS mkt02_manager.updateTargetCompanyId (회사 조건 추가) */
    int updateTargetCompanyId(@Param("companyId") Long companyId, @Param("targetCompanyId") Long targetCompanyId,
                              @Param("managerIds") List<Long> managerIds);
}
