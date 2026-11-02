package kr.co.kfs.asseterp.biz.mkt.mapper;

import kr.co.kfs.asseterp.biz.mkt.dto.MktShareRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** Z05 Mkt05_Lookup_Share (AS-IS server/mkt/mapper/mkt05_share.xml) */
@Mapper
public interface MktShareMapper {

    long selectNextId();

    /** AS-IS mkt05_share.selectByParentId (회사 조건 추가) */
    List<MktShareRes> selectByParentId(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    /** AS-IS mkt05_share.selectShareInfo */
    String selectShareInfo(@Param("parentId") Long parentId);

    /** AS-IS mkt05_share.insertDefaultShare — 활동처의 공유 지정을 활동내역으로 복사. 건수 */
    int insertDefaultShare(@Param("companyId") Long companyId, @Param("historyId") Long historyId, @Param("targetCompanyId") Long targetCompanyId);

    /** AS-IS mkt05_share.deleteByParentId (회사 조건 추가) */
    int deleteByParentId(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    /** UpdateDataModel.deleteModel (회사 조건 추가) */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** UpdateDataModel UPDATE */
    int updateOne(@Param("companyId") Long companyId, @Param("r") MktShareRes row);

    /** UpdateDataModel INSERT */
    int insertOne(@Param("companyId") Long companyId, @Param("parentId") Long parentId, @Param("r") MktShareRes row);
}
