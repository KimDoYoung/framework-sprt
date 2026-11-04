package kr.co.kfs.asseterp.biz.apr.controller;

import kr.co.kfs.asseterp.biz.apr.dto.AprBookmarkListRes;
import kr.co.kfs.asseterp.biz.apr.service.AprBookmarkListService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 중요표시 문서 창 (AS-IS client/vi/apr/Apr50_Lookup_ApprList, EE40) */
@RestController
@RequestMapping("/api/v1/apr/bookmarks")
@RequiredArgsConstructor
public class AprBookmarkListController {

    private final AprBookmarkListService service;

    /** AS-IS apr.Apr50_Bookmark.selectByPersonIdPaging */
    @GetMapping
    public ApiResponse<PageRes<AprBookmarkListRes>> search(@AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String searchText,
            @RequestParam(defaultValue = "0") long offset, @RequestParam(defaultValue = "50") long limit) {
        return ApiResponse.ok(service.search(principal, searchText, offset, limit));
    }
}
