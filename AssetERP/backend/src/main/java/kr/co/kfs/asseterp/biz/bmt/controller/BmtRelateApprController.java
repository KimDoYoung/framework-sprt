package kr.co.kfs.asseterp.biz.bmt.controller;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtRelateApprRes;
import kr.co.kfs.asseterp.biz.bmt.dto.BmtRelateApprSaveReq;
import kr.co.kfs.asseterp.biz.bmt.service.BmtRelateApprService;
import kr.co.kfs.asseterp.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 전산장비 연관문서 (AS-IS Bmt20_Lookup_RelateAppr → server/bmt/Bmt20_RelateAppr) */
@RestController
@RequestMapping("/api/v1/bmt/relate-apprs")
@RequiredArgsConstructor
public class BmtRelateApprController {

    private final BmtRelateApprService service;

    /** AS-IS bmt.Bmt20_RelateAppr.selectByInfoId */
    @GetMapping
    public ApiResponse<List<BmtRelateApprRes>> search(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long infoId) {
        return ApiResponse.ok(service.search(principal, infoId));
    }

    /** AS-IS bmt.Bmt20_RelateAppr.modelUpdate → 새 ID */
    @PostMapping
    public ApiResponse<Long> create(@AuthenticationPrincipal UserPrincipal principal, @RequestBody BmtRelateApprSaveReq req) {
        return ApiResponse.ok(service.create(principal, req));
    }

    /** AS-IS bmt.Bmt20_RelateAppr.delete → 지운 건수 */
    @DeleteMapping
    public ApiResponse<Integer> delete(@AuthenticationPrincipal UserPrincipal principal, @RequestBody List<Long> relateApprIds) {
        return ApiResponse.ok(service.delete(principal, relateApprIds));
    }
}
