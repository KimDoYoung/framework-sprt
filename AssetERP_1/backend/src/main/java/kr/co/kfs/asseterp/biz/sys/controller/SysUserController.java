package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserReq;
import kr.co.kfs.asseterp.biz.sys.dto.AdminUserRes;
import kr.co.kfs.asseterp.biz.sys.service.SysUserService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 고객별 관리자 (AS-IS Sys02_Tab_User → server/sys/Sys02_User) */
@RestController
@RequestMapping("/api/v1/sys/companies/{companyId}/users")
@RequiredArgsConstructor
public class SysUserController {

    private final SysUserService service;

    /** AS-IS sys.Sys02_User.selectByName */
    @GetMapping
    public ApiResponse<List<AdminUserRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId) {
        return ApiResponse.ok(service.searchUsers(principal, companyId));
    }

    /** AS-IS sys.Sys02_User.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<AdminUserRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                  @RequestBody List<AdminUserReq> rows) {
        return ApiResponse.ok(service.updateUsers(principal, companyId, rows));
    }

    /** AS-IS sys.Sys02_User.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                       @RequestBody List<Long> userIds) {
        return ApiResponse.ok(service.deleteUsers(principal, companyId, userIds));
    }
}
