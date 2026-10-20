package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.CommentRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs07_comment.xml + UpdateDataModel(bbs07_comment) (H01 Bbs07_TapPage_Comment) */
@Mapper
public interface BbsCommentMapper {

    List<CommentRes> selectByNoticeId(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("noticeId") Long noticeId);

    Long selectNextId();

    int insertComment(@Param("commentId") Long commentId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("noticeId") Long noticeId, @Param("comment") String comment);

    int deleteComment(@Param("companyId") Long companyId, @Param("commentId") Long commentId);
}
