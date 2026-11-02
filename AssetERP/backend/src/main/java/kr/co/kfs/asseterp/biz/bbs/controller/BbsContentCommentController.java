package kr.co.kfs.asseterp.biz.bbs.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.CommentRes;
import kr.co.kfs.asseterp.biz.bbs.dto.CommentSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsContentCommentService;
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

/** 게시물 댓글 (AS-IS server/bbs/Bbs32_Comment — Z13) */
@RestController
@RequestMapping("/api/v1/bbs")
@RequiredArgsConstructor
public class BbsContentCommentController {

    private final BbsContentCommentService service;

    /** AS-IS bbs.Bbs32_Comment.selectByContentId */
    @GetMapping("/contents/{contentId}/comments")
    public ApiResponse<List<CommentRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contentId) {
        return ApiResponse.ok(service.searchByContentId(principal, contentId));
    }

    /** AS-IS bbs.Bbs32_Comment.modelUpdate. 새 댓글 ID를 돌려준다 */
    @PostMapping("/contents/{contentId}/comments")
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contentId, @Valid @RequestBody CommentSaveReq req) {
        return ApiResponse.ok(service.create(principal, contentId, req.comment()));
    }

    /** AS-IS bbs.Bbs32_Comment.delete */
    @DeleteMapping("/content-comments/{commentId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long commentId) {
        service.delete(principal, commentId);
        return ApiResponse.ok(null);
    }
}
