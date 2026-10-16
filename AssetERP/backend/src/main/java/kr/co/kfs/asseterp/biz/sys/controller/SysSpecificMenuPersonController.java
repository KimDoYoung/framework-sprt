package kr.co.kfs.asseterp.biz.sys.controller;

import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuPersonRes;
import kr.co.kfs.asseterp.biz.sys.dto.SpecificMenuPersonSaveReq;
import kr.co.kfs.asseterp.biz.sys.service.SysSpecificMenuPersonService;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 특정매뉴 사원권한 (AS-IS Sys51_Lookup_SpecificMenuPerson → server/sys/Sys51_SpecificMenuPerson) */
@RestController
@RequestMapping("/api/v1/sys/companies/{companyId}/specific-menus/{specificMenuId}/persons")
@RequiredArgsConstructor
public class SysSpecificMenuPersonController {

    private final SysSpecificMenuPersonService sysSpecificMenuPersonService;

    /** AS-IS sys.Sys51_SpecificMenuPerson.selectBySpecificMenuId */
    @GetMapping
    public ApiResponse<List<SpecificMenuPersonRes>> search(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                           @PathVariable Long specificMenuId, @RequestParam String specificWorkCd) {
        return ApiResponse.ok(sysSpecificMenuPersonService.search(principal, companyId, specificMenuId, specificWorkCd));
    }

    /** AS-IS sys.Sys51_SpecificMenuPerson.update → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<SpecificMenuPersonRes>> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                                           @PathVariable Long specificMenuId, @RequestBody List<SpecificMenuPersonSaveReq> rows) {
        return ApiResponse.ok(sysSpecificMenuPersonService.update(principal, companyId, specificMenuId, rows));
    }

    /** AS-IS sys.Sys51_SpecificMenuPerson.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                       @PathVariable Long specificMenuId, @RequestBody List<Long> ids) {
        return ApiResponse.ok(sysSpecificMenuPersonService.delete(principal, companyId, specificMenuId, ids));
    }

    /** AS-IS sys.Sys51_SpecificMenuPerson.updateGroup (일괄 권한설정) */
    @PostMapping("/group")
    public ApiResponse<Void> updateGroup(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long companyId,
                                         @PathVariable Long specificMenuId, @RequestParam String specificWorkCd) {
        sysSpecificMenuPersonService.updateGroup(principal, companyId, specificMenuId, specificWorkCd);
        return ApiResponse.ok(null);
    }
}
