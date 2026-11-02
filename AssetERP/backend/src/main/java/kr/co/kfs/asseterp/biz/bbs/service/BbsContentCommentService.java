package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.CommentRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsContentCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/bbs/Bbs32_Comment.java (Z13 게시물 댓글) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsContentCommentService {

    private final BbsContentCommentMapper mapper;

    /** AS-IS selectByContentId L28 (getSize L39는 행 펼치기용이라 필요 없다) */
    public List<CommentRes> searchByContentId(UserPrincipal user, Long contentId) {
        return mapper.selectByContentId(user.getCompanyId(), user.getUserId(), contentId);
    }

    /** AS-IS modelUpdate L50 — 새 댓글 ID를 돌려줘 첨부파일을 바로 붙일 수 있게 한다 */
    @Transactional
    public Long create(UserPrincipal user, Long contentId, String comment) {
        Long commentId = mapper.selectNextId();
        mapper.insertComment(commentId, user.getCompanyId(), user.getUserId(), contentId, comment);
        return commentId;
    }

    /** AS-IS delete L84 */
    @Transactional
    public void delete(UserPrincipal user, Long commentId) {
        mapper.deleteComment(user.getCompanyId(), commentId);
    }
}
