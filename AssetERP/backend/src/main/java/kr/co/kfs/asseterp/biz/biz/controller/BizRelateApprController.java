package kr.co.kfs.asseterp.biz.biz.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprRes;
import kr.co.kfs.asseterp.biz.biz.service.BizRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** 상신문서 연결 (AS-IS Biz05_Lookup_RelateAppr·Biz01_Tab_Card 상신 상태 → server/biz/Biz05_RelateAppr) */
@RestController
@RequestMapping("/api/v1/biz/relate-apprs")
@RequiredArgsConstructor
public class BizRelateApprController {

    private final BizRelateApprService service;

    /** AS-IS biz.Biz05_RelateAppr.selectByPromoId */
    @GetMapping
    public ApiResponse<List<BizRelateApprRes>> searchByPromo(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long promoId) {
        return ApiResponse.ok(service.searchByPromo(principal, promoId));
    }

    /** AS-IS biz.Biz05_RelateAppr.selectByPersonId — 한 건이면 그 행, 아니면 data가 null(미상신) */
    @GetMapping("/by-person")
    public ApiResponse<BizRelateApprRes> byPerson(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dataYm, @RequestParam String linkCode) {
        return ApiResponse.ok(service.getByPerson(principal, dataYm, linkCode));
    }

    /** AS-IS biz.Biz05_RelateAppr.selectByDataYm — 한 건이면 그 행, 아니면 data가 null(미상신) */
    @GetMapping("/by-data-ym")
    public ApiResponse<BizRelateApprRes> byDataYm(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String dataYm, @RequestParam String linkCode) {
        return ApiResponse.ok(service.getByDataYm(principal, dataYm, linkCode));
    }

    /** AS-IS biz.Biz05_RelateAppr.selectFileCount → 'n건' */
    @GetMapping("/file-count")
    public ApiResponse<String> fileCount(@RequestParam Long promoId) {
        return ApiResponse.ok(service.getFileCount(promoId));
    }

    /** AS-IS biz.Biz05_RelateAppr.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> relateApprIds) {
        return ApiResponse.ok(service.delete(principal, relateApprIds));
    }
}
