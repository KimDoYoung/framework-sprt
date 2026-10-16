package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserListRes;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserListSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysAdminUserListService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Admin 사용자 관리 (AS-IS Sys80_Tab_AdminUserList → server/sys/Sys80_AdminUserList) */
@RestController
@RequestMapping("/api/v1/sys/admin-user-lists")
@RequiredArgsConstructor
public class SysAdminUserListController {

    private final SysAdminUserListService service;

    /** AS-IS sys.Sys80_AdminUserList.selectByAll */
    @GetMapping
    public ApiResponse<List<AdminUserListRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS sys.Sys80_AdminUserList.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AdminUserListRes>> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<AdminUserListSaveReq> rows) {
        return ApiResponse.ok(service.update(principal, rows));
    }

    /** AS-IS sys.Sys80_AdminUserList.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
