package kr.co.kfs.asseterp.biz.emp.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.MenuInfoNoticeAllReq;
import kr.co.kfs.asseterp.biz.emp.dto.MenuInfoNoticeRes;
import kr.co.kfs.asseterp.biz.emp.service.EmpMenuInfoNoticeService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
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

import java.util.List;

/** 화면안내 목록 (AS-IS Emp91_Lookup_List → server/emp/Emp91_MenuInfoNotice, EE62) — 본인 데이터만 */
@RestController
@RequestMapping("/api/v1/emp/menu-info-notices")
@RequiredArgsConstructor
public class EmpMenuInfoNoticeController {

    private final EmpMenuInfoNoticeService service;

    /** AS-IS emp.Emp91_MenuInfoNotice.selectByText */
    @GetMapping
    public ApiResponse<List<MenuInfoNoticeRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam(required = false) String searchText) {
        return ApiResponse.ok(service.search(principal, searchText));
    }

    /** 화면안내 전체 비활성화 상태 (AS-IS LoginUser.getMenuInfoYn 의 반대) */
    @GetMapping("/all-blocked")
    public ApiResponse<Boolean> isAllBlocked(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.isAllBlocked(principal));
    }

    /** AS-IS emp.Emp91_MenuInfoNotice.updatePersonId / deletePersonId (menuId 0) */
    @PutMapping("/all")
    public ApiResponse<Void> setAllBlocked(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MenuInfoNoticeAllReq req) {
        service.setAllBlocked(principal, req.blocked());
        return ApiResponse.ok(null);
    }

    /** AS-IS emp.Emp91_MenuInfoNotice.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS emp.Emp91_MenuInfoNotice.deleteMenuId — 회사 전체 (화면안내 저장 뒤) */
    @DeleteMapping("/menus/{menuId}")
    public ApiResponse<Integer> deleteByMenu(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long menuId) {
        return ApiResponse.ok(service.deleteByMenu(principal, menuId));
    }
}
