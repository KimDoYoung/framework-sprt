package kr.co.kfs.asseterp.biz.bbs.controller;

import jakarta.validation.Valid;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bbs.dto.ContentRes;
import kr.co.kfs.asseterp.biz.bbs.dto.ContentSaveReq;
import kr.co.kfs.asseterp.biz.bbs.service.BbsContentService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 게시물 (AS-IS server/bbs/Bbs31_Content — Z13) */
@RestController
@RequestMapping("/api/v1/bbs/contents")
@RequiredArgsConstructor
public class BbsContentController {

    private final BbsContentService service;

    /** AS-IS bbs.Bbs31_Content.selectByClassTreeIdPaging·Total */
    @GetMapping
    public ApiResponse<PageRes<ContentRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                                   @RequestParam(required = false, defaultValue = "") String searchText,
                                                   @RequestParam(defaultValue = "0") long offset, @RequestParam(defaultValue = "100") long limit) {
        return ApiResponse.ok(service.searchPaging(principal, classTreeId, searchText, offset, limit));
    }

    /** AS-IS bbs.Bbs31_Content.selectByClassTreeId·selectByParentTreeId — 분류·세부항목을 지우기 전 게시물이 있는가 */
    @GetMapping("/exists")
    public ApiResponse<Boolean> exists(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long classTreeId,
                                       @RequestParam(defaultValue = "false") boolean byParent) {
        return ApiResponse.ok(service.exists(principal, classTreeId, byParent));
    }

    /** AS-IS DBUtil.setSeq — 새 글 ID */
    @GetMapping("/next-id")
    public ApiResponse<Long> nextId() {
        return ApiResponse.ok(service.nextId());
    }

    /** AS-IS bbs.Bbs31_Content.selectById */
    @GetMapping("/{contentId}")
    public ApiResponse<ContentRes> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contentId) {
        return ApiResponse.ok(service.get(principal, contentId));
    }

    /** AS-IS bbs.Bbs31_Content.modelUpdate — 저장한 글 */
    @PutMapping
    public ApiResponse<ContentRes> save(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ContentSaveReq req) {
        return ApiResponse.ok(service.save(principal, req));
    }

    /** AS-IS bbs.Bbs31_Content.modelDelete */
    @DeleteMapping("/{contentId}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long contentId) {
        service.delete(principal, contentId);
        return ApiResponse.ok(null);
    }
}
