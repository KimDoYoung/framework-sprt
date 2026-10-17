package kr.co.kfs.asseterp.biz.icam.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.IcamBatchReq;
import kr.co.kfs.asseterp.biz.icam.dto.IcamFundRes;
import kr.co.kfs.asseterp.biz.icam.service.IcamFundService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** ICAM 펀드정보 (AS-IS Icam03_Tab_Fund + Icam03_Grid_Fund → server/icam/Icam03_Fund) — 메뉴 #1096 */
@RestController
@RequestMapping("/api/v1/icam/funds")
@RequiredArgsConstructor
public class IcamFundController {

    private final IcamFundService service;

    /** AS-IS icam.Icam03_Fund.selectRecentFund — 고른 회사의 펀드별 최신 적용일 행 */
    @GetMapping("/recent")
    public ApiResponse<List<IcamFundRes>> searchRecent(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestParam Long companyId) {
        return ApiResponse.ok(service.searchRecent(principal, companyId));
    }

    /** AS-IS icam.Icam03_Fund.selectByPaging — 한 펀드의 일자별 이력, 페이지 행 + 전체 건수 */
    @GetMapping
    public ApiResponse<PageRes<IcamFundRes>> searchHistory(@AuthenticationPrincipal UserPrincipal principal,
                                                           @RequestParam Long companyId,
                                                           @RequestParam String fundCode,
                                                           @RequestParam(defaultValue = "0") int offset,
                                                           @RequestParam(defaultValue = "100") int limit) {
        return ApiResponse.ok(service.searchHistory(principal, companyId, fundCode, offset, limit));
    }

    /** AS-IS BatchMain(icamFund·extrFund): ICAM Get·타사무 Get — 외부 ICAM DB 연동이 없어 서버가 거절 */
    @PostMapping("/batch")
    public ApiResponse<Void> runBatch(@AuthenticationPrincipal UserPrincipal principal, @RequestBody IcamBatchReq req) {
        service.runBatch(principal, req.actionCode(), req.companyId());
        return ApiResponse.ok(null);
    }
}
