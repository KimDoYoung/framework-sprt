package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.CommentRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs32_comment.xml + UpdateDataModel(bbs32_comment) (Z13 Bbs32_TapPage_Comment) */
@Mapper
public interface BbsContentCommentMapper {

    List<CommentRes> selectByContentId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("contentId") Long contentId);

    Long selectNextId();

    int insertComment(@Param("commentId") Long commentId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("contentId") Long contentId, @Param("comment") String comment);

    int deleteComment(@Param("companyId") Long companyId, @Param("commentId") Long commentId);
}
