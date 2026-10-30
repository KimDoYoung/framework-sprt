package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUserAllocationRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardUserAllocationUpdateReq;
import kr.co.kfs.asseterp.biz.biz.service.BizCardUserAllocationService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 법인카드 실사용자 배분 (AS-IS Biz01_Tab_CardUserAllocation → server/biz/Biz01_Promo) */
@RestController
@RequestMapping("/api/v1/biz/card-user-allocations")
@RequiredArgsConstructor
public class BizCardUserAllocationController {

    private final BizCardUserAllocationService service;

    /** AS-IS biz.Biz01_Promo.selectCardCommonUser */
    @GetMapping
    public ApiResponse<List<BizCardUserAllocationRes>> search(@AuthenticationPrincipal UserPrincipal principal,
                                                              @RequestParam String dataYm,
                                                              @RequestParam(defaultValue = "false") boolean unassignedOnly) {
        return ApiResponse.ok(service.search(principal, dataYm, unassignedOnly));
    }

    /** AS-IS biz.Biz01_Promo.updateRealPersonId → 저장한 건수 */
    @PutMapping
    public ApiResponse<Integer> update(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BizCardUserAllocationUpdateReq req) {
        return ApiResponse.ok(service.update(principal, req));
    }
}
