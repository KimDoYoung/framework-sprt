package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelateIcsRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManlRelateIcsMapper {

    /** AS-IS tdm45_manl_relate_ics.selectByIcsId (관리자 회사 0만 행이 나온다) */
    List<ManlRelateIcsRes> selectByIcsId(@Param("companyId") Long companyId, @Param("icsId") Long icsId, @Param("searchText") String searchText);

    /** AS-IS tdm43_manl.selectByExceptIcsId — 이미 연결된 것을 뺀 점검항목 */
    List<ManlRes> selectByExceptIcsId(@Param("companyId") Long companyId, @Param("icsId") Long icsId, @Param("searchText") String searchText);

    /** AS-IS tdm45_manl_relate_ics.insert (이미 있으면 넣지 않는다) */
    int insert(@Param("manlId") Long manlId, @Param("icsClassTreeId") Long icsClassTreeId);

    /** AS-IS Tdm45_ManlRelateIcs.delete(deleteModel) */
    int deleteById(@Param("manlRelateIcsId") Long manlRelateIcsId, @Param("icsClassTreeId") Long icsClassTreeId);
}
