package kr.co.kfs.asseterp.biz.org.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.org.dto.OrgRoleStampRes;
import kr.co.kfs.asseterp.biz.org.dto.OrgRoleStampSaveReq;
import kr.co.kfs.asseterp.biz.org.service.OrgRoleStampService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 인감별 사용 가능 부서 (AS-IS Org10_Lookup_RoleStamp → server/org/Org10_RoleStamp) */
@RestController
@RequestMapping("/api/v1/org/role-stamps")
@RequiredArgsConstructor
public class OrgRoleStampController {

    private final OrgRoleStampService service;

    /** AS-IS org.Org10_RoleStamp.selectByStampId */
    @GetMapping
    public ApiResponse<List<OrgRoleStampRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long stampId) {
        return ApiResponse.ok(service.search(principal, stampId));
    }

    /** AS-IS org.Org10_RoleStamp.update → 저장된 행 */
    @PutMapping
    public ApiResponse<List<OrgRoleStampRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<OrgRoleStampSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS org.Org10_RoleStamp.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }
}
