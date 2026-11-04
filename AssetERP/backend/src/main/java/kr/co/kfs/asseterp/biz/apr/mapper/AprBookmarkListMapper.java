package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr50_bookmark.xml — selectByPersonIdPaging · selectByPersonIdPagingTotal (Apr50_Lookup_ApprList) */
@Mapper
public interface AprBookmarkListMapper {

    List<AprBookmarkListRes> selectByPersonIdPaging(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                    @Param("publicYn") String publicYn, @Param("searchText") String searchText,
                                                    @Param("limit") long limit, @Param("offset") long offset);

    long selectByPersonIdPagingTotal(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                     @Param("publicYn") String publicYn, @Param("searchText") String searchText);
}
