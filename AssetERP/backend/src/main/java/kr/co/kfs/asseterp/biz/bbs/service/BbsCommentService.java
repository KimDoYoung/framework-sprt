package kr.co.kfs.asseterp.biz.bbs.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.CommentRes;
import kr.co.kfs.asseterp.biz.bbs.mapper.BbsCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/bbs/Bbs07_Comment.java (H01 공지사항 댓글) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BbsCommentService {

    private final BbsCommentMapper mapper;

    /** AS-IS selectByNoticeId L27 */
    public List<CommentRes> searchByNoticeId(UserPrincipal user, Long noticeId) {
        return mapper.selectByNoticeId(user.getCompanyId(), user.getUserId(), noticeId);
    }

    /** AS-IS modelUpdate L50 — 새 댓글 ID를 돌려줘 첨부파일을 바로 붙일 수 있게 한다 */
    @Transactional
    public Long create(UserPrincipal user, Long noticeId, String comment) {
        Long commentId = mapper.selectNextId();
        mapper.insertComment(commentId, user.getCompanyId(), user.getUserId(), noticeId, comment);
        return commentId;
    }

    /** AS-IS delete L84 */
    @Transactional
    public void delete(UserPrincipal user, Long commentId) {
        mapper.deleteComment(user.getCompanyId(), commentId);
    }
}
