package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkRes;
import kr.co.kfs.asseterp.biz.sys.dto.BookmarkSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysBookmarkService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 북마크 (AS-IS Sys40_Lookup_Bookmark·Sys06_Lookup_SearchMenu의 별 → server/sys/Sys40_Bookmark) */
@RestController
@RequestMapping("/api/v1/sys/bookmarks")
@RequiredArgsConstructor
public class SysBookmarkController {

    private final SysBookmarkService service;

    /** AS-IS sys.Sys40_Bookmark.selectBySearchText */
    @GetMapping
    public ApiResponse<List<BookmarkRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sys.Sys40_Bookmark.update → 고친 건수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<BookmarkSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys40_Bookmark.deleteAll → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> deleteAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.deleteAll(principal));
    }

    /** AS-IS sys.Sys40_Bookmark.insertMenuId */
    @PostMapping("/menus/{menuId}")
    public ApiResponse<Void> insertMenuId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long menuId) {
        service.insertMenuId(principal, menuId);
        return ApiResponse.ok(null);
    }

    /** AS-IS sys.Sys40_Bookmark.deleteMenuId */
    @DeleteMapping("/menus/{menuId}")
    public ApiResponse<Void> deleteMenuId(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long menuId) {
        service.deleteMenuId(principal, menuId);
        return ApiResponse.ok(null);
    }
}
