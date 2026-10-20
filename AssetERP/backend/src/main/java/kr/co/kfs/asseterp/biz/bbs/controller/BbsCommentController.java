package kr.co.kfs.asseterp.biz.bbs.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.CommentRes;
import kr.co.kfs.asseterp.biz.bbs.dto.CommentSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsCommentService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 공지사항 댓글 (AS-IS server/bbs/Bbs07_Comment) */
@RestController
@RequestMapping("/api/v1/bbs")
@RequiredArgsConstructor
public class BbsCommentController {

    private final BbsCommentService service;

    /** AS-IS bbs.Bbs07_Comment.selectByNoticeId */
    @GetMapping("/notices/{noticeId}/comments")
    public ApiResponse<List<CommentRes>> searchByNoticeId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId) {
        return ApiResponse.ok(service.searchByNoticeId(principal, noticeId));
    }

    /** AS-IS bbs.Bbs07_Comment.modelUpdate. 새 댓글 ID를 돌려준다 */
    @PostMapping("/notices/{noticeId}/comments")
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long noticeId,
                                    @Valid @RequestBody CommentSaveReq req) {
        return ApiResponse.ok(service.create(principal, noticeId, req.comment()));
    }

    /** AS-IS bbs.Bbs07_Comment.delete */
    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long commentId) {
        service.delete(principal, commentId);
        return ApiResponse.ok(null);
    }
}
