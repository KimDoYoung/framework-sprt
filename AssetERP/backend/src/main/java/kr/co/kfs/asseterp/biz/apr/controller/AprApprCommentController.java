package kr.co.kfs.asseterp.biz.apr.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.kfs.asseterp.biz.apr.dto.AprCommentNoticeRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCommentRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCommentSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprOpenHistoryRes;
import kr.co.kfs.asseterp.biz.apr.service.AprApprCommentService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;

/** 전자결재 문서창의 [열람기록]·[댓글] (AS-IS client/vi/apr/Apr41_Lookup_OpenHistory · Apr42_Lookup_Comment, V04) */
@RestController
@RequestMapping("/api/v1/apr/apprs/{apprId}")
@RequiredArgsConstructor
public class AprApprCommentController {

    private final AprApprCommentService service;

    /** AS-IS apr.Apr41_OpenHistory.selectByApprIdPaging */
    @GetMapping("/open-histories")
    public ApiResponse<PageRes<AprOpenHistoryRes>> searchOpenHistories(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId,
            @RequestParam(defaultValue = "0") long offset, @RequestParam(defaultValue = "20") long limit) {
        return ApiResponse.ok(service.searchOpenHistories(principal, apprId, offset, limit));
    }

    /** AS-IS apr.Apr42_Comment.selectByApprId */
    @GetMapping("/comments")
    public ApiResponse<List<AprCommentRes>> searchComments(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.searchComments(principal, apprId));
    }

    /** AS-IS apr.Apr42_Comment.modelUpdate */
    @PostMapping("/comments")
    public ApiResponse<Void> createComment(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @RequestBody AprCommentSaveReq req) {
        service.createComment(principal, apprId, req.comment());
        return ApiResponse.ok(null);
    }

    /** AS-IS apr.Apr42_Comment.delete (작성자만) */
    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<Void> deleteComment(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId, @PathVariable Long commentId) {
        service.deleteComment(principal, apprId, commentId);
        return ApiResponse.ok(null);
    }

    /** AS-IS Apr42_Lookup_Comment [알림발송] — 결재선 사원과 문구 */
    @GetMapping("/comment-notice")
    public ApiResponse<AprCommentNoticeRes> getNotice(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long apprId) {
        return ApiResponse.ok(service.getNotice(principal, apprId));
    }
}
