package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.ContentCond;
import kr.co.kfs.asseterp.biz.bbs.dto.ContentRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs31_content.xml + UpdateDataModel(bbs31_content) (Z13 Bbs31_Grid_Content·Lookup_Content·Edit_Content) */
@Mapper
public interface BbsContentMapper {

    List<ContentRes> selectByClassTreeIdPaging(ContentCond cond);

    long selectByClassTreeIdPagingTotal(ContentCond cond);

    ContentRes selectById(@Param("companyId") Long companyId, @Param("contentId") Long contentId);

    /** bbs31_content.selectByClassTreeId·selectByParentTreeId — 분류·세부항목을 지우기 전에 게시물이 있는지만 본다 */
    long countByClassTreeId(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    long countByParentTreeId(@Param("companyId") Long companyId, @Param("parentTreeId") Long parentTreeId);

    Long selectNextId();

    int insertContent(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("contentId") Long contentId,
                      @Param("classTreeId") Long classTreeId, @Param("title") String title, @Param("content") String content,
                      @Param("hideYn") boolean hideYn);

    int updateContent(@Param("companyId") Long companyId, @Param("contentId") Long contentId, @Param("title") String title,
                      @Param("content") String content, @Param("hideYn") boolean hideYn);

    int deleteContent(@Param("companyId") Long companyId, @Param("contentId") Long contentId);
}
