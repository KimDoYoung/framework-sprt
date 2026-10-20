package kr.co.kfs.asseterp.biz.ics.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsManagerRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsShareRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsManagerService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 법규 관리그룹 (AS-IS Ics02_Lookup_Manager·Ics01_Lookup_Share → server/ics/Ics02_Manager·Ics04_Share) — H08. 관리그룹 등록(H10)은 여기에 더한다 */
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
}
