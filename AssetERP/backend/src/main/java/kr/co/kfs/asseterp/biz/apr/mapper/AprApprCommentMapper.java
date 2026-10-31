package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprCommentRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprOpenHistoryCond;
import kr.co.kfs.asseterp.biz.apr.dto.AprOpenHistoryRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/apr/mapper/apr41_open_history.xml · apr42_comment.xml (V04 열람기록 창·댓글 창) */
@Mapper
public interface AprApprCommentMapper {
    /** AS-IS apr41_open_history.selectByApprIdPaging */
    List<AprOpenHistoryRes> selectOpenHistoryPaging(@Param("c") AprOpenHistoryCond cond);

    /** AS-IS apr41_open_history.selectByApprIdTotal */
    long selectOpenHistoryTotal(@Param("apprId") Long apprId);

    /** AS-IS apr42_comment.selectByApprId */
    List<AprCommentRes> selectComments(@Param("apprId") Long apprId, @Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS Apr42_Comment.modelUpdate의 INSERT (등록일시는 서버 시각) */
    int insertComment(@Param("commentId") Long commentId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                      @Param("apprId") Long apprId, @Param("comment") String comment);

    /** 댓글 한 건 (삭제 전 작성자 확인) */
    AprCommentRes selectCommentById(@Param("commentId") Long commentId, @Param("apprId") Long apprId, @Param("companyId") Long companyId);

    /** AS-IS Apr42_Comment.delete (UpdateDataModel 삭제) */
    int deleteComment(@Param("commentId") Long commentId, @Param("companyId") Long companyId);
}
