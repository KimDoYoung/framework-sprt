package kr.co.kfs.asseterp.biz.mkt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.mkt.dto.MktManagerMoveReq;
import kr.co.kfs.asseterp.biz.mkt.dto.MktManagerRes;
import kr.co.kfs.asseterp.biz.mkt.service.MktManagerService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Z05 활동처 담당자 (AS-IS server/mkt/Mkt02_Manager) */
@RestController
@RequestMapping("/api/v1/mkt/managers")
@RequiredArgsConstructor
public class MktManagerController {

    private final MktManagerService service;

    /** AS-IS mkt.Mkt02_Manager.selectByTargetCompanyId */
    @GetMapping
    public ApiResponse<List<MktManagerRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long targetCompanyId) {
        return ApiResponse.ok(service.search(principal, targetCompanyId));
    }

    /** AS-IS mkt.Mkt02_Manager.update */
    @PutMapping
    public ApiResponse<List<MktManagerRes>> save(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<MktManagerRes> rows) {
        return ApiResponse.ok(service.save(principal, rows));
    }

    /** AS-IS mkt.Mkt02_Manager.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> ids) {
        return ApiResponse.ok(service.delete(principal, ids));
    }

    /** AS-IS mkt.Mkt02_Manager.updateTargetCompanyId (활동처 변경) → 옮긴 건수 */
    @PutMapping("/move")
    public ApiResponse<Integer> move(@AuthenticationPrincipal UserPrincipal principal, @RequestBody MktManagerMoveReq req) {
        return ApiResponse.ok(service.move(principal, req));
    }
}
