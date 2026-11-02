package kr.co.kfs.asseterp.biz.mkt.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** Z05 Mkt01_Lookup_Favorite (AS-IS server/mkt/mapper/mkt06_favorite.xml, Mkt06_Favorite.modelUpdate·deleteList) */
@Mapper
public interface MktFavoriteMapper {

    long selectNextId();

    /** UpdateDataModel INSERT (modelUpdate) */
    int insertOne(@Param("id") Long id, @Param("personId") Long personId, @Param("targetCompanyId") Long targetCompanyId,
                  @Param("managerId") Long managerId);

    /** AS-IS mkt06_favorite.deleteFavoriteId (내 즐겨찾기만) */
    int deleteByIds(@Param("personId") Long personId, @Param("ids") List<Long> ids);
}
