package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareSaveReq;
import kr.co.kfs.asseterp.biz.ics.service.IcsManagerService;
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

/** 법규 관리그룹 (AS-IS Ics02_Lookup_Manager·Ics01_Lookup_Share → server/ics/Ics02_Manager·Ics04_Share) — H08. 관리그룹 등록(H10) */
@RestController
@RequestMapping("/api/v1/ics/managers")
@RequiredArgsConstructor
public class IcsManagerController {

    private final IcsManagerService service;

    /** AS-IS ics.Ics02_Manager.selectByCompanyId */
    @GetMapping
    public ApiResponse<List<IcsManagerRes>> search(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(service.search(principal));
    }

    /** AS-IS ics.Ics04_Share.selectByManagerId */
    @GetMapping("/{managerId}/shares")
    public ApiResponse<List<IcsShareRes>> searchShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long managerId) {
        return ApiResponse.ok(service.searchShares(principal, managerId));
    }

    /** AS-IS ics.Ics02_Manager.update (H10) → 저장된 행(요청 순서) */
    @PutMapping
    public ApiResponse<List<IcsManagerRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<IcsManagerSaveReq> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS ics.Ics02_Manager.checkRelateIcs (H10) → 하나라도 법규에 연결돼 있으면 true */
    @GetMapping("/in-use")
    public ApiResponse<Boolean> inUse(@RequestParam List<Long> managerIds) {
        return ApiResponse.ok(service.inUse(managerIds));
    }

    /** AS-IS ics.Ics02_Manager.delete (H10) → 지운 수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> managerIds) {
        return ApiResponse.ok(service.delete(principal, managerIds));
    }

    /** AS-IS ics.Ics04_Share.update (H10) → 저장된 행(요청 순서) */
    @PutMapping("/{managerId}/shares")
    public ApiResponse<List<IcsShareRes>> saveShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long managerId,
                                                     @RequestBody List<IcsShareSaveReq> rows) {
        return ApiResponse.ok(service.saveShares(principal, managerId, rows));
    }

    /** AS-IS ics.Ics04_Share.delete (H10) → 지운 수 */
    @DeleteMapping("/{managerId}/shares")
    public ApiResponse<Integer> deleteShares(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long managerId,
                                             @RequestBody List<Long> shareIds) {
        return ApiResponse.ok(service.deleteShares(principal, managerId, shareIds));
    }
}
